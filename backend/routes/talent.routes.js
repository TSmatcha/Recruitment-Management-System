import express from "express";
import {
  searchTalents,
  getCandidateDetail,
  saveCandidate,
  unsaveCandidate,
  getSavedCandidates
} from "../controllers/auth.controller.js";


import {
  protect,
  employerOnly
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🔍 Nhà tuyển dụng tìm kiếm ứng viên
router.get("/search", protect, employerOnly, searchTalents);
router.get("/saved", protect, employerOnly, getSavedCandidates); // phải trước /:id
router.get("/:id", protect, employerOnly, getCandidateDetail);
router.post("/save", protect, employerOnly, saveCandidate);
router.post("/unsave", protect, employerOnly, unsaveCandidate);


export default router;
