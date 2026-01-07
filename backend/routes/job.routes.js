import express from "express";
import Job from "../models/Job.js";
import { upload } from "../middlewares/upload.js";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  searchJobs,
  applyJob,
  getMyJobs,
  requestRepost
} from "../controllers/job.controller.js";
import { protect, employerOnly, candidateOnly, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🔍 Tìm kiếm job (public)
router.get("/search", searchJobs);

// 👨‍💼 Employer xem job mình đăng
router.get("/my", protect, employerOnly, getMyJobs);

// ⭐ Employer yêu cầu đăng lại
router.post("/:id/repost", protect, employerOnly, requestRepost);

// ⭐ Admin duyệt job
router.put("/:id/approve", protect, adminOnly, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Không tìm thấy job" });
    job.status = "approved";
    job.resendRequested = false;
    await job.save();
    res.json({ message: "Duyệt job thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ❌ Admin từ chối
router.put("/:id/reject", protect, adminOnly, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Không tìm thấy job" });
    job.status = "rejected";
    await job.save();
    res.json({ message: "Đã từ chối job" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Public - lấy danh sách job
router.get("/", getJobs);

// 🔎 Chi tiết job
router.get("/:id", getJobById);

// 🧾 CRUD job
router.post("/", protect, employerOnly, createJob);
router.put("/:id", protect, employerOnly, updateJob);
router.delete("/:id", protect, employerOnly, deleteJob);

// 📝 Candidate ứng tuyển (UPLOAD CV)
router.post("/:id/apply", protect, candidateOnly, upload.single("cv"), applyJob);

export default router;