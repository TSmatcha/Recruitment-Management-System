// backend/routes/dashboard.routes.js
import express from "express";
import { getDashboard } from "../controllers/dashboard.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🔹 Dashboard tổng hợp
router.get("/", protect, getDashboard);

export default router;
