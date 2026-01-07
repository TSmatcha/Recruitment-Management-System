import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Notification from "../models/Notification.js";
import { sendEmail } from "../utils/email.js"; 
import { Types } from "mongoose";

//  Hủy đơn ứng tuyển
export const cancelApplication = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.user.id;

    const deleted = await Application.findOneAndDelete({ jobId, userId });
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy đơn ứng tuyển!" });
    }

    res.json({ message: "Đã hủy ứng tuyển thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi hủy ứng tuyển", error: error.message });
  }
};


//  Lấy danh sách công việc & lời mời dành cho Candidate
export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await Application.find({ userId })
      .populate("jobId", "title companyName location salary type createdAt") // Lấy thông tin Job
      .select("status jobId userId createdAt cvUrl coverLetter") // ✅ BẮT BUỘC lấy status để FE filter
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy danh sách ứng tuyển", error: error.message });
  }
};
// Lấy danh sách ứng viên cho employer
export const getApplicantsForEmployer = async (req, res) => {
  try {
    const employerId = req.user.id;

    // 1. Lấy tất cả Job của Employer này
    const jobs = await Job.find({ postedBy: employerId }).select("_id title");
    const jobIds = jobs.map(j => j._id);

    // 2. Tìm tất cả đơn ứng tuyển thuộc các Job trên
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate("userId", "name email avatar")
      .populate("jobId", "title")
      .select("userId jobId status rating cvId cvUrl createdAt") 
      .sort({ createdAt: -1 });

    // 3. Nhóm theo Job để FE hiển thị dễ dàng
    const grouped = jobs.map(job => ({
      jobId: job._id,
      title: job.title,
      // Lọc các ứng viên thuộc Job này (bao gồm cả trạng thái 'invited')
      applicants: applications.filter(
        a => a.jobId._id.toString() === job._id.toString()
      ),
    }));

    res.json(grouped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi lấy ứng viên", error: err.message });
  }
};

// Duyệt ứng viên
export const approveApplication = async (req, res) => {
    const { interviewTime } = req.body; 
    const appId = req.params.id;
    const employerId = req.user.id;

    const application = await Application.findById(appId).populate("jobId").populate("userId");
    if (!application) return res.status(404).json({ message: "Không tìm thấy ứng viên" });
    if (application.jobId.postedBy.toString() !== employerId)
        return res.status(403).json({ message: "Bạn không có quyền duyệt ứng viên này" });

    application.status = "accepted";
    await application.save();

    // Tạo notification
   await Notification.create({
  userId: application.userId._id,

  title: application.jobId.title,
  message: interviewTime
    ? `Ứng tuyển đã được duyệt • Phỏng vấn: ${interviewTime}`
    : "Ứng tuyển đã được duyệt",

  jobId: application.jobId._id,
  isRead: false,
});



    // Gửi email
    if (application.userId.email) {
        await sendEmail({
            to: application.userId.email,
            subject: "Ứng tuyển đã được duyệt",
            text: `Ứng tuyển "${application.jobId.title}" được duyệt. Giờ phỏng vấn: ${interviewTime}`,
        });
    }

    res.json({ message: "Đã duyệt ứng viên thành công", application });
};

// Từ chối ứng viên
export const rejectApplication = async (req, res) => {
    const { reason } = req.body; 
    const appId = req.params.id;
    const employerId = req.user.id;

    const application = await Application.findById(appId).populate("jobId").populate("userId");
    if (!application) return res.status(404).json({ message: "Không tìm thấy ứng viên" });
    if (application.jobId.postedBy.toString() !== employerId)
        return res.status(403).json({ message: "Bạn không có quyền từ chối ứng viên này" });

    application.status = "rejected";
    await application.save();

    // Tạo notification
  await Notification.create({
  userId: application.userId._id,

  title: application.jobId.title,
  message: reason
    ? `Ứng tuyển bị từ chối • ${reason}`
    : "Ứng tuyển bị từ chối",

  jobId: application.jobId._id,
  isRead: false,
});



    // Gửi email
    if (application.userId.email) {
        await sendEmail({
            to: application.userId.email,
            subject: "Ứng tuyển bị từ chối",
            text: `Ứng tuyển "${application.jobId.title}" bị từ chối. Lý do: ${reason}`,
        });
    }

    res.json({ message: "Đã từ chối ứng viên", application });
};

// controllers/application.controller.js
export const getApplicationById = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('jobId', 'title')
      .populate("cvId");
    if (!app) return res.status(404).json({ message: 'Không tìm thấy ứng viên' });

    const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

    res.json({
      _id: app._id,
      jobId: app.jobId._id,
      jobTitle: app.jobId.title,
      userId: app.userId._id,
      name: app.userId.name,
      email: app.userId.email,
      phone: app.userId.phone,
      cvUrl: app.cvUrl ? `${BASE_URL}${app.cvUrl}` : null, 
      cvId: app.cvId || null,
      status: app.status,
      createdAt: app.createdAt
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};
// 
export const rateApplication = async (req, res) => {
  try {
    const { id } = req.params; 
    const { score, comment } = req.body;

    const application = await Application.findByIdAndUpdate(
      id,
      { $set: { rating: { score, comment }, status: "reviewed" } },
      { new: true }
    );

    if (!application) return res.status(404).json({ message: "Không tìm thấy đơn" });

    res.json({ success: true, message: "Đánh giá thành công!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Mời ứng viên
export const inviteCandidate = async (req, res) => {
    try {
        const { jobId, candidateId } = req.body;

        // 1. Kiểm tra xem ứng viên đã có trong danh sách ứng tuyển/được mời của job này chưa
        const existingApplication = await Application.findOne({
            jobId: jobId,
            userId: candidateId
        });

        // 2. Nếu đã tồn tại, trả về lỗi 400 và tin nhắn cụ thể
        if (existingApplication) {
            return res.status(400).json({ 
                message: "Ứng viên này đã ứng tuyển hoặc được mời trước đó." 
            });
        }

        // 3. Nếu chưa tồn tại, tiến hành tạo đơn mời
        const invitation = await Application.create({
            jobId,
            userId: candidateId,
            status: "invited",
            cvUrl: "pending" 
        });

        // 4. Gửi thông báo cho ứng viên
        await Notification.create({
            userId: candidateId,
            title: "Lời mời ứng tuyển",
            message: `Bạn được mời ứng tuyển vào vị trí công việc mới.`,
            jobId: jobId
        });

        res.json({ message: "Đã gửi lời mời thành công!" });
    } catch (error) {
        console.error("Invite Error:", error);
        res.status(500).json({ message: "Lỗi hệ thống khi mời ứng viên" });
    }
};
// Ứng viên chấp nhận lời mời từ Employer
export const acceptInvitation = async (req, res) => {
    try {
        const { applicationId, cvId, cvUrl, coverLetter } = req.body;
        const userId = req.user.id;

        const application = await Application.findOne({ _id: applicationId, userId, status: "invited" });

        if (!application) {
            return res.status(404).json({ message: "Không tìm thấy lời mời hợp lệ." });
        }

        // Cập nhật thông tin CV và chuyển trạng thái về 'applied' để Employer bắt đầu xét duyệt
        application.cvId = cvId || null;
        application.cvUrl = cvUrl || null;
        application.coverLetter = coverLetter || "";
        application.status = "applied"; 

        await application.save();

        res.json({ message: "Chấp nhận lời mời thành công, hồ sơ của bạn đã được gửi đi." });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};