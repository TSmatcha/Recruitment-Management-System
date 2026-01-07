import Notification from "../models/Notification.js";
import mongoose from "mongoose";

// 🔔 Lấy danh sách thông báo của user
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 }); // mới nhất trước

    res.json(notifications);
  } catch (error) {
    console.error("❌ Lỗi khi lấy thông báo:", error);
    res.status(500).json({
      message: "Lỗi khi lấy thông báo",
      error: error.message,
    });
  }
};

// ✅ Đánh dấu thông báo đã đọc
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID thông báo không hợp lệ" });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Không tìm thấy thông báo" });
    }

    res.json({
      message: "Đã đánh dấu là đã đọc",
      notification,
    });
  } catch (error) {
    console.error("❌ Lỗi khi đánh dấu thông báo:", error);
    res.status(500).json({
      message: "Lỗi khi đánh dấu thông báo",
      error: error.message,
    });
  }
};

// 🗑️ Xóa thông báo
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID thông báo không hợp lệ" });
    }

    const deleted = await Notification.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy thông báo để xóa" });
    }

    res.json({ message: "Đã xóa thông báo thành công" });
  } catch (error) {
    console.error("❌ Lỗi khi xóa thông báo:", error);
    res.status(500).json({
      message: "Lỗi khi xóa thông báo",
      error: error.message,
    });
  }
};
