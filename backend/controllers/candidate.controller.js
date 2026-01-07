import User from "../models/User.js";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcryptjs";


// 📋 Lấy thông tin hồ sơ
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user || user.role !== "candidate") {
      return res.status(404).json({ message: "Không tìm thấy ứng viên!" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};


// ✏️ Cập nhật hồ sơ (avatar + CV)
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "candidate") {
      return res.status(404).json({ message: "Không tìm thấy ứng viên!" });
    }

    const {
      name,
      gender,
      birthdate,
      phone,
      address,
      skills,
      skillsToRemove,
      experience, // Bây giờ là chuỗi JSON từ FormData
      education,  // Bây giờ là chuỗi JSON từ FormData
      industry,
    } = req.body;

    // ================= UPDATE THÔNG TIN CƠ BẢN =================
    if (name !== undefined) user.name = name;
    if (gender !== undefined) user.gender = gender;
    if (birthdate !== undefined) user.birthdate = birthdate;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (industry !== undefined) user.industry = industry;

    // ================= GIẢI MÃ EXPERIENCE & EDUCATION =================
    // Quan trọng: Vì gửi qua FormData nên chúng là String, cần parse về Array
    if (experience !== undefined) {
      try {
        user.experience = typeof experience === "string" ? JSON.parse(experience) : experience;
      } catch (e) {
        console.error("Lỗi parse experience:", e);
      }
    }

    if (education !== undefined) {
      try {
        user.education = typeof education === "string" ? JSON.parse(education) : education;
      } catch (e) {
        console.error("Lỗi parse education:", e);
      }
    }

    // ================= HANDLE SKILLS =================
    let currentSkills = Array.isArray(user.skills) ? [...user.skills] : [];

    if (skillsToRemove) {
      let toRemove = [];
      if (typeof skillsToRemove === "string") {
        try { toRemove = JSON.parse(skillsToRemove); } catch { toRemove = [skillsToRemove]; }
      } else if (Array.isArray(skillsToRemove)) {
        toRemove = skillsToRemove;
      } 
      currentSkills = currentSkills.filter(s => !toRemove.includes(s));
    }

    if (skills) {
      let newSkills = [];
      if (typeof skills === "string") {
        try { newSkills = JSON.parse(skills); } catch { newSkills = [skills]; }
      } else if (Array.isArray(skills)) {
        newSkills = skills;
      }
      currentSkills = Array.from(new Set([...currentSkills, ...newSkills]));
    }
    user.skills = currentSkills;

    // ================= UPLOAD AVATAR =================
    if (req.files?.avatar?.length > 0) {
      const avatarFile = req.files.avatar[0];
      if (user.avatar_public_id) await cloudinary.uploader.destroy(user.avatar_public_id);
      const result = await cloudinary.uploader.upload(avatarFile.path, { folder: "avatars" });
      user.avatar = `${result.secure_url}?t=${Date.now()}`;
      user.avatar_public_id = result.public_id;
      if (fs.existsSync(avatarFile.path)) fs.unlinkSync(avatarFile.path);
    }

    // ================= UPLOAD CV =================
    if (req.files?.cv?.length > 0) {
      const cvFile = req.files.cv[0];
      if (user.cv_public_id) {
        await cloudinary.uploader.destroy(user.cv_public_id, { resource_type: "raw" });
      }
      const resultCv = await cloudinary.uploader.upload(cvFile.path, {
        folder: "cv_files",
        resource_type: "raw",
        use_filename: true,
        unique_filename: false,
        type: "upload",
      });
      user.cv = `${resultCv.secure_url}?t=${Date.now()}`;
      user.cv_public_id = resultCv.public_id;
      if (fs.existsSync(cvFile.path)) fs.unlinkSync(cvFile.path);
    }

    await user.save();
    const freshUser = await User.findById(user._id).select("-password");

    return res.json({
      message: "Cập nhật hồ sơ thành công!",
      user: freshUser,
    });
  } catch (error) {
    console.error("❌ Lỗi cập nhật hồ sơ:", error);
    res.status(500).json({
      message: "Lỗi cập nhật hồ sơ",
      error: error.message,
    });
  }
};

// 🔐 Đổi mật khẩu
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "candidate") {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu cũ không đúng!" });
    }

    user.password = newPassword;
    await user.save(); // pre('save') tự hash

    res.json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    console.error("❌ Lỗi đổi mật khẩu:", error);
    res.status(500).json({ message: "Lỗi đổi mật khẩu", error: error.message });
  }
};

// 📊 Thống kê dashboard ứng viên
export const getCandidateStats = async (req, res) => {
  try {
    const candidateId = req.user.id; // dùng id cho đồng bộ

    const Application = (await import("../models/Application.js")).default;
    const SavedJob = (await import("../models/SavedJob.js")).default;
    const CandidateView = (await import("../models/CandidateView.js")).default;
    const Notification = (await import("../models/Notification.js")).default;

    const applied = await Application.countDocuments({ userId: candidateId });
    const saved = await SavedJob.countDocuments({ userId: candidateId });
    const viewed = await CandidateView.countDocuments({ candidateId });
    const notified = await Notification.countDocuments({ userId: candidateId });

    res.json({
      viewed,
      saved,
      applied,
      notified,
    });
  } catch (error) {
    console.error("❌ Lỗi khi lấy thống kê:", error);
    res.status(500).json({
      message: "Lỗi khi lấy thống kê",
      error: error.message,
    });
  }
};

// 🟢 Bật/tắt trạng thái công khai hồ sơ
export const toggleProfileStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "candidate") {
      return res.status(404).json({ message: "Không tìm thấy ứng viên!" });
    }

    user.isProfilePublic = !user.isProfilePublic;
    await user.save();

    res.json({
      message: `Đã ${user.isProfilePublic ? "mở" : "đóng"} hồ sơ thành công!`,
      isProfilePublic: user.isProfilePublic,
    });
  } catch (error) {
    console.error("❌ Lỗi đổi trạng thái hồ sơ:", error);
    res.status(500).json({ message: "Lỗi đổi trạng thái hồ sơ", error: error.message });
  }
};

// 👀 Ghi nhận khi nhà tuyển dụng xem hồ sơ
export const recordProfileView = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { candidateId } = req.params;

    const CandidateView = (await import("../models/CandidateView.js")).default;
    const Notification = (await import("../models/Notification.js")).default;
    const candidate = await User.findById(candidateId);

    if (!candidate || candidate.role !== "candidate") {
      return res.status(404).json({ message: "Không tìm thấy ứng viên!" });
    }

    if (!candidate.isProfilePublic) {
      return res.status(403).json({ message: "Ứng viên đã ẩn hồ sơ." });
    }

    // Ghi lượt xem (tránh trùng)
    const existing = await CandidateView.findOne({ employerId, candidateId });
    if (!existing) {
      await CandidateView.create({ employerId, candidateId });
    }

    // Gửi thông báo cho ứng viên
    await Notification.create({
      userId: candidateId,
      title: "Hồ sơ của bạn đã được xem",
      message: "Một nhà tuyển dụng vừa xem hồ sơ của bạn.",
      type: "profile_view",
    });

    res.json({ message: "Đã ghi nhận lượt xem hồ sơ." });
  } catch (error) {
    console.error("❌ Lỗi ghi lượt xem hồ sơ:", error);
    res.status(500).json({ message: "Lỗi ghi lượt xem hồ sơ", error: error.message });
  }
};

// 🔔 Lấy danh sách thông báo của ứng viên
export const getNotifications = async (req, res) => {
  try {
    const Notification = (await import("../models/Notification.js")).default;
    const list = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(list);
  } catch (error) {
    console.error("❌ Lỗi lấy thông báo:", error);
    res.status(500).json({ message: "Lỗi lấy thông báo", error: error.message });
  }
};
export const uploadSystemCV = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || user.role !== "candidate") {
      return res.status(403).json({ message: "Không có quyền" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Chưa chọn file CV" });
    }

    user.cv = req.file.path; // URL cloudinary
    user.cv_public_id = req.file.filename;

    await user.save();

    res.json({
      success: true,
      message: "Upload CV hệ thống thành công",
      cv: user.cv,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload CV thất bại" });
  }
};
