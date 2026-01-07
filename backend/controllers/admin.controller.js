import User from "../models/User.js";
import Job from "../models/Job.js";
import Company from "../models/Company.js";
import Application from "../models/Application.js";
import Notification from "../models/Notification.js";

// =============================
//        USER MANAGEMENT
// =============================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Admin getAllUsers error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    res.json({ message: "Xóa người dùng thành công" });
  } catch (error) {
    console.error("Admin deleteUser error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};


//  KHOÁ / MỞ TÀI KHOẢN USER
export const toggleUserActive = async (req, res) => {
  try {
    const { userId, action } = req.body;

    if (!userId || !["lock", "unlock"].includes(action)) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ!" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại!" });

    // Không cho admin tự khoá chính mình
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: "Bạn không thể khóa tài khoản của chính mình!" });
    }

    user.isActive = action === "unlock";
    await user.save();

    //  Gửi thông báo
    await Notification.create({
      userId: user._id,
      title: user.isActive ? "Tài khoản đã được mở khóa" : "Tài khoản đã bị khóa",
      message: user.isActive
        ? "Tài khoản của bạn đã được mở khóa bởi quản trị viên."
        : "Tài khoản của bạn đã bị khóa bởi quản trị viên.",
    });

    res.json({
      success: true,
      message: `Tài khoản đã được ${action === "lock" ? "khóa" : "mở khóa"} thành công`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Admin toggleUserActive error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};


// =============================
//        JOB MANAGEMENT
// =============================
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("company", "name logo")
      .populate("postedBy", "name email");

    res.json(jobs);
  } catch (error) {
    console.error("Admin getAllJobs error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const getJobDetail = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("company", "name logo description location")
      .populate("postedBy", "name email")
      .lean();

    if (!job) {
      return res.status(404).json({ message: "Không tìm thấy job" });
    }

    res.json(job);
  } catch (error) {
    console.error("Admin getJobDetail error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};


// DUYỆT JOB
export const approveJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: "Không tìm thấy job" });

    job.status = "approved";
    await job.save();

    // Tạo thông báo
    await Notification.create({
      userId: job.postedBy,
      title: "Tin tuyển dụng đã được duyệt",
      message: `Tin tuyển dụng "${job.title}" của bạn đã được admin phê duyệt.`,
      jobId: job._id,
    });

    res.json({ message: "Duyệt job thành công", job });
  } catch (error) {
    console.error("Admin approveJob error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};


// XOÁ JOB
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Không tìm thấy job" });

    await job.deleteOne();

    //  Tạo thông báo
    await Notification.create({
      userId: job.postedBy,
      title: "Tin tuyển dụng đã bị xoá",
      message: `Tin tuyển dụng "${job.title}" của bạn đã bị admin gỡ xuống.`,
      jobId: job._id,
    });

    res.json({ message: "Xóa job thành công" });
  } catch (error) {
    console.error("Admin deleteJob error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};


// =============================
//       COMPANY MANAGEMENT
// =============================
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    console.error("Admin getAllCompanies error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
export const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({ message: "Không tìm thấy công ty" });
        }

        res.status(200).json(company);
    } catch (err) {
        console.error("Lỗi lấy chi tiết công ty:", err);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// =============================
//     APPLICATION MANAGEMENT
// =============================
export const getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find()
      .populate("userId", "name email") // populate thông tin ứng viên
      .populate({
        path: "jobId",                 // populate job
        select: "title company",
        populate: { path: "company", select: "name" } // populate tên công ty trong job
      });

    res.json(apps);
  } catch (error) {
    console.error("Admin getAllApplications error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

