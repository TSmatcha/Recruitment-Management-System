import mongoose from "mongoose";
import Company from "../models/Company.js";
import User from "../models/User.js";
import Job from "../models/Job.js";

// 🏢 Tạo công ty và gắn vào user
export const createCompany = async (req, res) => {
  try {
    // --- Thêm destructure các trường mới ---
    const { name, description, website, address, email, logo, industry, field, size } = req.body;

    const company = await Company.create({
      name,
      description: description || "Chưa có mô tả",
      website: website || "#",
      address: address || "Đang cập nhật",
      email: email || `info@${name.replace(/\s+/g, "").toLowerCase()}.com`,
      logo: logo || "https://via.placeholder.com/100",
      industry: industry || "",  // fallback nếu FE không gửi
      field: field || "",
      size: size || "",
      owner: req.user._id,
    });

    // Gắn company vào user
    const user = await User.findById(req.user.id);
    user.company = company._id;
    await user.save();

    res.status(201).json(company);
  } catch (err) {
    console.error("Lỗi khi tạo công ty:", err);
    res.status(500).json({ message: "Lỗi khi tạo công ty: " + err.message });
  }
};

// 📋 Lấy tất cả công ty
export const getCompanies = async (req, res) => {
  try {
    const { search, locations } = req.query;
    const filter = {};

    const andConditions = [];

    // 🔍 SEARCH: name OR address
    if (search) {
      andConditions.push({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { address: { $regex: search, $options: "i" } }
        ]
      });
    }

    // 📍 LOCATION FILTER
    if (locations) {
      const locArr = locations.split(",");
      andConditions.push({
        $or: locArr.map(loc => ({
          address: { $regex: loc, $options: "i" }
        }))
      });
    }

    if (andConditions.length) {
      filter.$and = andConditions;
    }

    const companies = await Company.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "jobs",
          let: { companyId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$company", "$$companyId"] },
                status: "approved",
                $or: [
                  { expiresAt: { $gte: new Date() } },
                  { expiresAt: null },
                  { expiresAt: { $exists: false } }
                ]
              }
            }
          ],
          as: "jobs"
        }
      },
      {
        $addFields: {
          jobsCount: { $size: "$jobs" }
        }
      },
      { $project: { jobs: 0 } }
    ]);

    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// 🔍 Lấy chi tiết công ty theo ID, kèm jobs
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID công ty không hợp lệ" });
    }

    // populate owner và virtual jobs
    const company = await Company.findById(id)
      .populate("owner", "name email")
      .populate("jobs"); // <-- thêm dòng này

    if (!company) return res.status(404).json({ message: "Không tìm thấy công ty" });

    res.json(company);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy chi tiết công ty: " + err.message });
  }
};

// ✏️ Cập nhật công ty
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID công ty không hợp lệ" });
    }

    const company = await Company.findById(id);
    if (!company) return res.status(404).json({ message: "Không tìm thấy công ty" });

    if (company.owner.toString() !== req.user.id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền chỉnh sửa" });
    }

    Object.assign(company, req.body);
    await company.save();

    res.json(company);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi cập nhật công ty: " + err.message });
  }
};

// 🗑️ Xóa công ty
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID công ty không hợp lệ" });
    }

    const company = await Company.findById(id);
    if (!company) return res.status(404).json({ message: "Không tìm thấy công ty" });

    if (company.owner.toString() !== req.user.id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền xóa" });
    }

    await company.deleteOne();
    res.json({ message: "Đã xóa công ty" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi xóa công ty: " + err.message });
  }
};

// 🌟 Lấy danh sách công ty nổi bật
export const getFeaturedCompanies = async (req, res) => {
  try {
    const companies = await Company.aggregate([
      {
        $lookup: {
          from: "jobs",
          let: { companyId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$company", "$$companyId"] },
                status: "approved",
                $or: [
                  { expiresAt: { $gte: new Date() } },
                  { expiresAt: null },
                  { expiresAt: { $exists: false } }
                ]
              }
            }
          ],
          as: "jobs"
        }
      },
      {
        $addFields: {
          jobsCount: { $size: "$jobs" }
        }
      },
      { $sort: { jobsCount: -1 } },
      { $limit: 8 },
      {
        $project: {
          name: 1,
          logo: 1,
          address: 1,
          jobsCount: 1
        }
      }
    ]);

    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
