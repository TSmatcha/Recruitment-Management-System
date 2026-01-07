  import express from "express";
  import { protect, candidateOnly } from "../middlewares/auth.middleware.js";
  import {
    createCV,
    getMyCVs,
    getCVById,
    updateCV,
    deleteCV,
    setDefaultCV,
  } from "../controllers/cv.controller.js";

  const router = express.Router();

  // Tạo CV
  router.post("/", protect, candidateOnly, createCV);

  // Lấy tất cả CV
  router.get("/", protect, candidateOnly, getMyCVs);

  // Lấy CV chi tiết
  router.get("/:id", protect, getCVById);

  // Cập nhật CV
  router.put("/:id", protect, candidateOnly, updateCV);

  // Xóa CV
  router.delete("/:id", protect, candidateOnly, deleteCV);

  // Đặt CV mặc định
  router.put("/:id/default", protect, candidateOnly, setDefaultCV);

  export default router;
