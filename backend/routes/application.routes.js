import express from "express";
import { protect, candidateOnly, employerOnly } from "../middlewares/auth.middleware.js";
import {
  cancelApplication,
  getMyApplications,
  getApplicantsForEmployer,
  approveApplication,
  rejectApplication,
  getApplicationById,
  inviteCandidate,     // Thêm vào đây
  acceptInvitation      // Thêm vào đây
} from "../controllers/application.controller.js";

const router = express.Router();

// ================= EMPLOYER =================

// 📋 Xem danh sách ứng viên
router.get(
  "/employer/applicants",
  protect,
  employerOnly,
  getApplicantsForEmployer
);

// ✉️ Mời ứng tuyển (URL: /api/applications/invite)
router.post(
  "/invite",
  protect,
  employerOnly,
  inviteCandidate
);

// ✅ DUYỆT ỨNG VIÊN
router.put(
  "/:id/approve",
  protect,
  employerOnly,
  approveApplication
);

// ❌ TỪ CHỐI ỨNG VIÊN
router.put(
  "/:id/reject",
  protect,
  employerOnly,
  rejectApplication
);

router.get('/:id', protect, employerOnly, getApplicationById);

// ================= CANDIDATE =================

// ✅ Chấp nhận lời mời (URL: /api/applications/accept-invitation)
router.put(
  "/accept-invitation",
  protect,
  candidateOnly,
  acceptInvitation
);

// 👨‍💼 Candidate xem đơn đã nộp
router.get(
  "/",
  protect,
  candidateOnly,
  getMyApplications
);

// ❌ Huỷ ứng tuyển
router.delete(
  "/:jobId",
  protect,
  candidateOnly,
  cancelApplication
);

export default router;