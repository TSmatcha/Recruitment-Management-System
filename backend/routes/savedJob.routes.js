import express from "express";
import { protect, candidateOnly } from "../middlewares/auth.middleware.js";
import {
  saveJob,
  unsaveJob,
  getSavedJobs,
} from "../controllers/savedJob.controller.js";

const router = express.Router();

// Lưu job
router.post("/", protect, candidateOnly, saveJob);

// Lấy danh sách việc đã lưu
router.get("/", protect, candidateOnly, getSavedJobs);

// Bỏ lưu job
router.delete("/:jobId", protect, candidateOnly, unsaveJob);

export default router;
