import Job from "../models/Job.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Company from "../models/Company.js";
import cloudinary from "../config/cloudinary.js"; 
import { upload } from "../middlewares/upload.js";
import fs from "fs";

// 📌 Đăng bài tuyển dụng
export const createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      postedBy: req.user.id
    });
    res.status(201).json({ message: "Đăng tin thành công", job });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi đăng tin", error: error.message });
  }
};

// 📋 Lấy danh sách việc của employer
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách", error: error.message });
  }
};

// ✏️ Cập nhật bài đăng
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user.id },
      req.body,
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Không tìm thấy công việc" });
    res.status(200).json({ message: "Cập nhật thành công", job });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật", error: error.message });
  }
};

// ❌ Xoá bài đăng
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      postedBy: req.user.id
    });
    if (!job) return res.status(404).json({ message: "Không tìm thấy công việc" });
    res.status(200).json({ message: "Đã xoá công việc" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xoá", error: error.message });
  }
};
// Đổi mật khẩu
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // chỉ lấy employer
    const user = await User.findOne({ _id: req.user.id, role: "employer" });
    if (!user) return res.status(404).json({ message: "Không tìm thấy tài khoản" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });

    // chỉ gán, middleware hash tự xử lý
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi đổi mật khẩu", error: error.message });
  }
};
//
export const getEmployerProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.user.id,
      role: "employer",
    })
      .select("-password")
      .populate("company");

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy nhà tuyển dụng" });
    }
   const jobCount = await Job.countDocuments({ postedBy: user._id });
    res.status(200).json({
      // USER
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      avatar: user.avatar || null,
      credits: jobCount,
      joinDate: user.joinDate,

      // COMPANY
      company: user.company
        ? {
            id: user.company._id,
            name: user.company.name,
            description: user.company.description,
            website: user.company.website,
            address: user.company.address,
            logo: user.company.logo,
            industry: user.company.industry,
          }
        : null,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy hồ sơ employer" });
  }
};

// 
export const updateEmployerProfile = async (req, res) => {
  try {
    const { phone, company } = req.body;

    const user = await User.findOne({
      _id: req.user.id,
      role: "employer",
    });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy nhà tuyển dụng" });
    }

    // 1️⃣ Update USER
    if (phone !== undefined) {
      user.phone = phone;
      await user.save();
    }

    // 2️⃣ Update hoặc tạo COMPANY
    let companyData = null;

    if (company) {
      if (user.company) {
        companyData = await Company.findByIdAndUpdate(
          user.company,
          {
            name: company.name,
            address: company.address,
            website: company.website,
            description: company.description,
            industry: company.industry,
            logo: company.logo,
          },
          { new: true }
        );
      } else {
        companyData = await Company.create({
          ...company,
          owner: user._id,
        });

        user.company = companyData._id;
        await user.save();
      }
    }

    res.status(200).json({
      message: "Cập nhật hồ sơ thành công",
      user,
      company: companyData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi cập nhật hồ sơ employer" });
  }
};
// PUT /api/employer/avatar
export const updateEmployerAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Chưa chọn ảnh" });

   const uploadRes = await cloudinary.uploader.upload(req.file.path, {
  folder: "avatars",
});

fs.unlinkSync(req.file.path); // 👈 xoá file tạm


    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    user.avatar = uploadRes.secure_url;
    user.avatar_public_id = uploadRes.public_id;
    await user.save();

    console.log("New avatar:", user.avatar); // log thử
    res.status(200).json({ avatar: user.avatar });
  } catch (err) {
    console.error("Upload avatar thất bại:", err);
    res.status(500).json({ message: "Upload avatar thất bại" });
  }
};

// PUT /api/employer/company/logo
export const updateCompanyLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Chưa chọn logo" });
    }

    const user = await User.findById(req.user.id).populate("company");
    if (!user || !user.company) {
      return res.status(404).json({ message: "Chưa có công ty" });
    }

    const uploadRes = await cloudinary.uploader.upload(req.file.path, {
      folder: "company-logos",
    });

    user.company.logo = uploadRes.secure_url;
    await user.company.save();

    res.status(200).json({ logo: user.company.logo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload logo thất bại" });
  }
};
