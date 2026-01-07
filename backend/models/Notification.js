import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // ID người nhận thông báo
    },
    title: {
      type: String,
      required: true, // Tiêu đề thông báo
      trim: true,
    },
    message: {
      type: String,
      required: true, // Nội dung thông báo
      trim: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job", // Liên kết tới job nếu thông báo liên quan
    },
    isRead: {
      type: Boolean,
      default: false, // Trạng thái đã đọc hay chưa
    },
  },
  { timestamps: true } // tự tạo createdAt và updatedAt
);

export default mongoose.model("Notification", notificationSchema);
