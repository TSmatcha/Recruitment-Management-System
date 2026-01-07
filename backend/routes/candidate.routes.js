import express from "express";
import { upload } from "../middlewares/upload.js"; // ✅ đúng
import { protect, candidateOnly } from "../middlewares/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  changePassword,
  getCandidateStats,
  toggleProfileStatus,   
  recordProfileView,    
} from "../controllers/candidate.controller.js";

const router = express.Router();

//
// ===== 📋 HỒ SƠ ỨNG VIÊN =====
//

// 👉 Lấy thông tin hồ sơ
router.get("/profile", protect, candidateOnly, getProfile);

// 👉 Cập nhật hồ sơ (có hỗ trợ upload ảnh đại diện)
router.put(
  "/profile",
  protect,
  candidateOnly,
  upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "cv", maxCount: 1 }
]),
  updateProfile
);

// 👉 Bật/tắt trạng thái công khai hồ sơ
router.put("/profile/status", protect, candidateOnly, toggleProfileStatus); // ✅ thêm mới

//
// ===== 🔐 BẢO MẬT & TÀI KHOẢN =====
//

// 👉 Đổi mật khẩu
router.put("/change-password", protect, candidateOnly, changePassword);

//
// ===== 📊 DASHBOARD / THỐNG KÊ =====
//

// 👉 Lấy thống kê tổng quan (số việc đã lưu, đã ứng tuyển, phỏng vấn)
router.get("/stats", protect, candidateOnly, getCandidateStats);

//
// ===== 👀 NHÀ TUYỂN DỤNG XEM HỒ SƠ ỨNG VIÊN =====
//

// 👉 Ghi nhận lượt xem hồ sơ (nhà tuyển dụng xem)
router.post("/view/:candidateId", protect, recordProfileView); // ✅ thêm mới

export default router;
