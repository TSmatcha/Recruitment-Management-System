// backend/controllers/dashboard.controller.js
import Job from "../models/Job.js";
import User from "../models/User.js";

// 🔹 Dashboard tổng hợp cho employer
export const getDashboard = async (req, res) => {
  try {
    const employerId = req.user.id; // ✅ lấy đúng id từ middleware

    // 1️⃣ Việc đang kích hoạt
    const activeJobs = await Job.countDocuments({ postedBy: employerId });

    // 2️⃣ Ứng viên mới + recent applications
    const jobs = await Job.find({ postedBy: employerId });
    let newApplicants = 0;
    const recentApplications = [];

    jobs.forEach(job => {
      if (job.applicants && Array.isArray(job.applicants)) {
        const newApps = job.applicants.filter(a => a.status === "new");
        newApplicants += newApps.length;

        job.applicants.forEach(a => {
          recentApplications.push({
            candidate: a.name,
            position: job.title,
            date: a.appliedAt ? a.appliedAt.toISOString() : null
          });
        });
      }
    });

    // Sắp xếp recentApplications theo ngày giảm dần, lấy 10 gần nhất
    recentApplications.sort((a, b) => new Date(b.date) - new Date(a.date));
    const recentApplicationsLimited = recentApplications.slice(0, 10);

    // 3️⃣ Tín dụng còn lại
    const employer = await User.findById(employerId);
    const credits = employer?.credits ?? 0;

    // ✅ Trả dữ liệu
    res.json({
      activeJobs: activeJobs ?? 0,
      newApplicants: newApplicants ?? 0,
      credits,
      recentApplications: recentApplicationsLimited
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Lỗi khi tải dashboard", error: err.message });
  }
};
