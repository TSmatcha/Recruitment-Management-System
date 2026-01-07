import express from "express";
import {
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
  changePassword,
  getEmployerProfile,
  updateEmployerProfile,
  updateEmployerAvatar,
  updateCompanyLogo,
} from "../controllers/employer.controller.js";

import { getEmployerDashboard } from "../controllers/employerDashboard.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { getEmployerDetail } from "../controllers/candidateView.controller.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

/* ===================== DASHBOARD ===================== */

router.get("/dashboard", protect, getEmployerDashboard);

/* ===================== JOBS ===================== */

router.post("/jobs", protect, createJob);
router.get("/jobs", protect, getMyJobs);
router.put("/jobs/:id", protect, updateJob);
router.delete("/jobs/:id", protect, deleteJob);

/* ===================== PROFILE ===================== */

router.get("/profile", protect, getEmployerProfile);
router.put("/profile", protect, updateEmployerProfile);

router.put(
  "/profile/avatar",
  protect,
  upload.single("avatar"),
  updateEmployerAvatar
);

router.put(
  "/profile/company/logo",
  protect,
  upload.single("logo"),
  updateCompanyLogo
);

/* ===================== SECURITY ===================== */

router.put("/change-password", protect, changePassword);

/* ===================== PUBLIC / CANDIDATE VIEW ===================== */

// ⚠️ LUÔN ĐẶT CUỐI
router.get("/:id", protect, getEmployerDetail);

export default router;
