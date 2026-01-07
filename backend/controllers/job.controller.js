  import Job from "../models/Job.js";
  import User from "../models/User.js";
  import Notification from "../models/Notification.js";
  import Application from "../models/Application.js";
  import CV from "../models/CV.js";

  // 🧾 Tạo job (employer)
  export const createJob = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).populate("company");
      if (!user?.company) {
        return res.status(400).json({ message: "Bạn chưa có công ty để đăng tin!" });
      }

      const {
        title,
        description,
        salary,
        location,
        requirements,
        jobType,

        // 🔹 FIELD FILTER
        category,
        career,
        level,
        experience,
        education
      } = req.body;

      // Validate bắt buộc
      if (!title || !location || !description) {
        return res.status(400).json({
          message: "Tên công việc, địa điểm và mô tả là bắt buộc"
        });
      }

      const job = await Job.create({
        title,
        description,
        salary,
        location,
        requirements,
        jobType,

        // 👇 LƯU FILTER
        category,
        career,
        level,
        experience,
        education,

        company: user.company._id,
        postedBy: req.user.id,
        applicants: [],
        status: "pending",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });

      await job.populate("company", "name logo");
      await job.populate("postedBy", "name email");

      res.status(201).json({
        message: "Đăng job thành công! Tin đang chờ admin duyệt.",
        job
      });

    } catch (err) {
      console.error("Create job error:", err);
      res.status(500).json({
        message: "Đăng job thất bại: " + err.message
      });
    }
  };


  // 📌 Lấy danh sách job (public, đã approved + chưa hết hạn)
  export const getJobs = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

    let filter = {
        status: "approved",
        $or: [
          { expiresAt: { $gte: new Date() } },
          { expiresAt: { $exists: false } }
        ]
      };

      // Nếu FE muốn filter theo company
      if (req.query.companyId) {
        filter.company = req.query.companyId;
      }

      const totalJobs = await Job.countDocuments(filter);

      const jobs = await Job.find(filter)
        .populate("company", "name logo")
        .populate("postedBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      res.status(200).json({
        page,
        totalPages: Math.ceil(totalJobs / limit),
        totalJobs,
        jobs
      });
    } catch (err) {
      console.error("Get jobs error:", err);
      res.status(500).json({ message: err.message });
    }
  };

  // 📌 Lấy chi tiết job
  export const getJobById = async (req, res) => {
    try {
      const job = await Job.findById(req.params.id)
        .populate("company", "name logo")
        .populate("postedBy", "name email");

      if (!job) return res.status(404).json({ message: "Không tìm thấy job" });

      // Nếu không phải chủ job → kiểm tra trạng thái
      if (
        !req.user ||
        job.postedBy.toString() !== req.user.id.toString()
      ) {
        if (job.status !== "approved" || job.isExpired()) {
          return res.status(403).json({ message: "Job này chưa được phép hiển thị" });
        }
      }

      res.json(job);
    } catch (err) {
      console.error("Get job by id error:", err);
      res.status(500).json({ message: err.message });
    }
  };


  // 📌 Lấy job theo company (FE gọi /company/:id/jobs)
  export const getJobsByCompany = async (req, res) => {
    try {
      const companyId = req.params.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const filter = {
    company: companyId,
    status: "approved",
    $or: [
      { expiresAt: { $gte: new Date() } },
      { expiresAt: { $exists: false } }
    ]
  };


      const totalJobs = await Job.countDocuments(filter);

      const jobs = await Job.find(filter)
        .populate("company", "name logo")
        .populate("postedBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      res.json({
        page,
        totalPages: Math.ceil(totalJobs / limit),
        totalJobs,
        jobs
      });
    } catch (err) {
      console.error("Get jobs by company error:", err);
      res.status(500).json({ message: err.message });
    }
  };

  // Ứng tuyển
export const applyJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;
    const { cvId, coverLetter } = req.body;

    // ---- Check job ----
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Không tìm thấy công việc" });
    }

    if (job.status !== "approved" || job.isExpired()) {
      return res.status(400).json({
        message: "Tin tuyển dụng hết hạn hoặc chưa được duyệt",
      });
    }

    // ---- Check đã ứng tuyển chưa ----
    const existed = await Application.findOne({ jobId, userId });
    if (existed) {
      return res.status(400).json({
        message: "Bạn đã ứng tuyển công việc này rồi",
      });
    }

    // ---- XỬ LÝ CV ----
let cvUrl = null;
let cvObjectId = null;

// 🟦 Upload CV (PDF/DOC)
if (req.file) {
  cvUrl = `/uploads/${req.file.filename}`;
}

// 🟦 Chọn CV đã tạo (CV hệ thống)
if (cvId) {
  const cv = await CV.findOne({ _id: cvId, candidate: userId });
  if (!cv) {
    return res.status(403).json({ message: "CV không hợp lệ" });
  }

  cvObjectId = cv._id;
}

// ❌ Không có CV nào
if (!cvUrl && !cvObjectId) {
  return res.status(400).json({
    message: "Vui lòng chọn CV đã tạo hoặc tải CV lên",
  });
}


    // ---- Tạo Application ----
    const newApp = await Application.create({
      jobId,
      userId,
      status: "applied",
      coverLetter: coverLetter || "",
      cvId: cvObjectId, 
      cvUrl: cvUrl,
    });

    // ---- Thêm vào Job.applicants ----
    job.applicants.push({
      candidateId: userId,
      name: req.user.name,
      email: req.user.email,
      cvId: cvObjectId || null, 
       cvUrl: cvUrl || null, 
      status: "new",
      appliedAt: new Date(),
    });

    await job.save();

    res.json({
      message: "Ứng tuyển thành công!",
      application: newApp,
    });
  } catch (err) {
    console.error("Apply job error:", err);
    res.status(500).json({ message: err.message });
  }
};

  // 📌 Employer xem danh sách job của mình (chỉ job công ty của họ)
 // 📌 Employer xem danh sách job của mình
export const getMyJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("company");
    if (!user?.company) return res.status(400).json({ message: "Bạn chưa có công ty!" });

    // Tìm tất cả các job của công ty
    const jobs = await Job.find({ company: user.company._id })
      .populate("company", "name logo")
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    // Trả về cả Object (cho trang quản lý) và đảm bảo cấu trúc ổn định
    res.json({
      success: true,
      total: jobs.length,
      jobs: jobs // Đây là mảng danh sách tin
    });
  } catch (err) {
    console.error("Get my jobs error:", err);
    res.status(500).json({ message: err.message });
  }
};

  // 🔄 Employer gửi yêu cầu đăng lại
  export const requestRepost = async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);

      if (!job) return res.status(404).json({ message: "Không tìm thấy job" });

      if (job.postedBy.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: "Không có quyền" });
      }

      if (!job.isExpired()) {
        return res.status(400).json({ message: "Tin chưa hết hạn, không cần đăng lại" });
      }

      job.status = "pending";
      job.resendRequested = true;
      job.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await job.save();

      res.json({ message: "Yêu cầu đăng lại đã gửi, chờ admin duyệt" });
    } catch (err) {
      console.error("Repost job error:", err);
      res.status(500).json({ message: err.message });
    }
  };

  //
  // 🔹 Cập nhật job (employer)
  export const updateJob = async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ message: "Không tìm thấy job" });

      if (job.postedBy.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: "Không có quyền chỉnh sửa job này" });
      }

      const {
        title,
        description,
        salary,
        location,
        requirements,
        jobType,

        // 🔹 FILTER
        category,
        career,
        level,
        experience,
        education
      } = req.body;

      if (title) job.title = title;
      if (description) job.description = description;
      if (salary !== undefined) job.salary = salary;
      if (location) job.location = location;
      if (requirements !== undefined) job.requirements = requirements;
      if (jobType) job.jobType = jobType;
      

      // ✅ UPDATE FILTER
      if (category !== undefined) job.category = category;
      if (career !== undefined) job.career = career;
      if (level !== undefined) job.level = level;
      if (experience !== undefined) job.experience = experience;
      if (education !== undefined) job.education = education;
      
      await job.save();
      await job.populate("company", "name logo");
      await job.populate("postedBy", "name email");

      res.json({ message: "Cập nhật job thành công", job });
    } catch (err) {
      console.error("Update job error:", err);
      res.status(500).json({ message: err.message });
    }
  };


  // ❌ Xóa job (employer)
  export const deleteJob = async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ message: "Không tìm thấy job" });

      if (job.postedBy.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: "Không có quyền xóa job này" });
      }

      await job.deleteOne();

      await Notification.create({
        userId: req.user.id,
        title: "Xóa job thành công",
        message: `Bạn đã xóa thành công công việc "${job.title}".`,
        isRead: false,
      });

      res.json({ message: "Xóa job thành công" });
    } catch (err) {
      console.error("Delete job error:", err);
      res.status(500).json({ message: err.message });
    }
  };

  // GET /api/jobs/search
  // GET /api/jobs/search
export const searchJobs = async (req, res) => {
  try {
    const {
      q,
      location,
      category,
      career,
      level,
      experience,
      education,
      jobType,
      salary
    } = req.query;

    let filter = {
      status: "approved",
      $or: [
        { expiresAt: { $gte: new Date() } },
        { expiresAt: { $exists: false } }
      ]
    };

    // 🔎 Search text
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ];
    }

    if (location) filter.location = { $regex: location, $options: "i" };
    if (category) filter.category = category;
    if (career) filter.career = career;
    if (level) filter.level = level;
    if (experience) filter.experience = experience;
    if (education) filter.education = education;
    if (jobType) filter.jobType = jobType;

   if (salary) {
  switch (salary) {
    case "under7":
      filter.salary = { $lt: 7 };
      break;
    case "7-10":
      filter.salary = { $gte: 7, $lte: 10 };
      break;
    case "10-15":
      filter.salary = { $gte: 10, $lte: 15 };
      break;
    case "15-20":
      filter.salary = { $gte: 15, $lte: 20 };
      break;
    case "20+":
      filter.salary = { $gte: 20 };
      break;
  }
}
    const jobs = await Job.find(filter)
      .populate("company", "name logo")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    console.error("Search jobs error:", err);
    res.status(500).json({ message: err.message });
  }
};


  export const getAppliedJobs = async (req, res) => {
    try {
      const jobs = await Job.find({ "applicants.candidateId": req.user.id })
        .select("title location salary applicants createdAt")
        .lean();

      const result = [];

      jobs.forEach(job => {
        const app = job.applicants.find(
          a => a.candidateId.toString() === req.user.id
        );

        if (app) {
          result.push({
            _id: app._id,
            status: app.status,
            appliedAt: app.appliedAt,
            job: {
              _id: job._id,
              title: job.title,
              location: job.location,
              salary: job.salary
            }
          });
        }
      });

      res.json(result);
    } catch (err) {
      console.error("Get applied jobs error:", err);
      res.status(500).json({ message: err.message });
    }
  };
// ⭐ Đánh giá ứng viên (employer)
export const rateCandidate = async (req, res) => {
  try {
    const { jobId, candidateId } = req.params;
    const { score, comment } = req.body;

    // Kiểm tra điểm hợp lệ
    if (score < 1 || score > 5) {
      return res.status(400).json({ message: "Điểm đánh giá phải từ 1 đến 5 sao" });
    }

    // Tìm job và cập nhật rating cho candidate cụ thể trong mảng applicants
    const job = await Job.findOneAndUpdate(
      { 
        _id: jobId, 
        "applicants.candidateId": candidateId 
      },
      {
        $set: {
          "applicants.$.rating": {
            score,
            comment,
            ratedAt: new Date() // Bạn có thể thêm trường này vào Schema nếu muốn lưu ngày đánh giá
          },
          // Tự động chuyển trạng thái sang "reviewed" nếu cần
          "applicants.$.status": "reviewed" 
        }
      },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Không tìm thấy hồ sơ ứng tuyển của ứng viên này" });
    }

    // 🔔 (Tùy chọn) Tạo thông báo cho ứng viên
    await Notification.create({
      userId: candidateId,
      title: "Hồ sơ của bạn đã được đánh giá",
      message: `Nhà tuyển dụng đã để lại đánh giá cho hồ sơ ứng tuyển vị trí "${job.title}".`,
      isRead: false
    });

    res.json({
      success: true,
      message: "Đánh giá ứng viên thành công!",
      rating: { score, comment }
    });

  } catch (err) {
    console.error("Rate candidate error:", err);
    res.status(500).json({ message: "Lỗi hệ thống: " + err.message });
  }
};