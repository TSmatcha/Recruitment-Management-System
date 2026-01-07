import express from "express";
import {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getFeaturedCompanies,
} from "../controllers/company.controller.js";

import { protect, employerOnly} from "../middlewares/auth.middleware.js";

const router = express.Router();

// 1️⃣ Featured phải đứng trước :id
router.get("/featured", getFeaturedCompanies);

// 2️⃣ Lấy tất cả công ty (ai cũng xem được)
router.get("/", getCompanies);

// 3️⃣ CRUD theo ID
router.get("/:id", getCompanyById);

// Chỉ employer mới tạo công ty
router.post("/", protect, employerOnly, createCompany);

// Chỉ owner hoặc admin mới update/xóa
router.put("/:id", protect, updateCompany);
router.delete("/:id", protect, deleteCompany);

export default router;
