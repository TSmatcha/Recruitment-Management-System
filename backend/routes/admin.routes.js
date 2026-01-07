import express from "express";
import { protect, adminOnly, checkActive } from "../middlewares/auth.middleware.js";
import { 
    getAllUsers, 
    deleteUser,
    toggleUserActive,
    getAllJobs,
    getJobDetail,       
    approveJob,
    deleteJob,
    getAllCompanies,
    getCompanyById,
    getAllApplications
} from "../controllers/admin.controller.js";

const router = express.Router();

// ==========================
//      QUẢN LÝ USER
// ==========================
router.get("/users", protect, adminOnly, checkActive, getAllUsers);
router.delete("/users/:id", protect, adminOnly, checkActive, deleteUser);
router.post("/users/toggle-active", protect, adminOnly, toggleUserActive); // khóa/mở user

// ==========================
//      QUẢN LÝ JOB
// ==========================
router.get("/jobs", protect, adminOnly, checkActive, getAllJobs);
router.get("/jobs/:id", protect, adminOnly, checkActive, getJobDetail);
router.put("/jobs/:id/approve", protect, adminOnly, checkActive, approveJob);
router.delete("/jobs/:id", protect, adminOnly, checkActive, deleteJob);

// ==========================
//      QUẢN LÝ COMPANY
// ==========================
router.get("/companies", protect, adminOnly, checkActive, getAllCompanies);
router.get("/companies/:id", protect, adminOnly, checkActive, getCompanyById);

// ==========================
//    QUẢN LÝ APPLICATION
// ==========================
router.get("/applications", protect, adminOnly, checkActive, getAllApplications);

export default router;
