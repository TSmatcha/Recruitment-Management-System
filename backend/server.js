import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import companyRoutes from "./routes/company.routes.js";
import jobRoutes from "./routes/job.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import candidateRoutes from "./routes/candidate.routes.js";
import applicationRoutes from "./routes/application.routes.js"; 
import savedJobRoutes from "./routes/savedJob.routes.js";   
import candidateViewRoutes from "./routes/candidateView.route.js";
import notificationRoutes from "./routes/notification.route.js";
import cvRoutes from "./routes/cv.routes.js";
import employerRoutes from "./routes/employer.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import userRoutes from "./routes/user.routes.js";
import talentRoutes from "./routes/talent.routes.js";
// Cấu hình môi trường
dotenv.config();

if (!process.env.MONGO_URI) {
  console.error("❌ Lỗi: Thiếu biến môi trường MONGO_URI trong file .env");
  process.exit(1);
}

// Kết nối MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Xác định __dirname cho ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cho phép truy cập ảnh upload (avatar ứng viên)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Đăng ký routes
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/applications", applicationRoutes); 
app.use("/api/saved-jobs", savedJobRoutes);      
app.use("/api/candidate", candidateViewRoutes);   
app.use("/api/notifications", notificationRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/employer", employerRoutes);
app.use("/api/employer/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/talents", talentRoutes);
// Lắng nghe server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});
