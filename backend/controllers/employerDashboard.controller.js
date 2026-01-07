import Job from "../models/Job.js";
import Application from "../models/Application.js";

export const getEmployerDashboard = async (req, res) => {
  try {
    const employerId = req.user.id;

    const jobIds = await Job.find({ postedBy: employerId }).distinct("_id");

    const activeJobs = await Job.countDocuments({
      postedBy: employerId,
      status: "approved",
    });

    const newApplicants = await Application.countDocuments({
      jobId: { $in: jobIds },
      status: "applied",
    });

    const credits = jobIds.length;

    const recentApplications = await Application.find({
      jobId: { $in: jobIds },
    })
      .populate("userId", "name email")
      .populate("jobId", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      activeJobs,
      newApplicants,
      credits,
      recentApplications: recentApplications.map(app => ({
        candidate: app.userId?.name,
        position: app.jobId?.title,
        date: app.createdAt,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi dashboard employer" });
  }
};
