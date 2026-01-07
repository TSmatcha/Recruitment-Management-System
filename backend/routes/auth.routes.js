import express from "express";
import {
  registerCandidate,
  registerEmployer,
  loginUser,
  createAdmin,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 👉 Ví dụ route đăng ký / đăng nhập
router.post("/register-candidate", registerCandidate);
router.post("/register-employer", registerEmployer);
router.post("/login", loginUser);
router.post("/create-admin", createAdmin);
// 🔐 Quên mật khẩu
router.post("/forgot-password", forgotPassword);

// 🔁 Reset mật khẩu
router.put("/reset-password/:token", resetPassword);

export default router;
