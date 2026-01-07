import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { viewCandidateProfile, getViewedList } from "../controllers/candidateView.controller.js";

const router = express.Router();

// Ghi nhận lượt xem hồ sơ ứng viên
router.post("/view/:candidateId", protect, viewCandidateProfile);

// Lấy danh sách nhà tuyển dụng đã xem hồ sơ
router.get("/viewed", protect, getViewedList);

export default router;
