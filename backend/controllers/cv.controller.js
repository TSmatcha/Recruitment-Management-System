import CV from "../models/CV.js";

// 📝 Tạo CV mới
export const createCV = async (req, res) => {
  try {
    const { title, summary, education, experience, skills, projects, contact } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Vui lòng nhập tiêu đề CV" });
    }

    // Kiểm tra ứng viên có bao nhiêu CV
    const count = await CV.countDocuments({ candidate: req.user.id });

    const newCV = await CV.create({
      candidate: req.user.id,
      title,
      summary,
      education,
      experience,
      skills,
      projects,
      contact,
      // Nếu là CV đầu tiên thì set default luôn
      isDefault: count === 0,
    });

    return res.status(201).json({
      message: "Tạo CV thành công",
      cv: newCV,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi tạo CV",
      error: error.message,
    });
  }
};

// 📋 Lấy tất cả CV của ứng viên
export const getMyCVs = async (req, res) => {
  try {
    const cvs = await CV.find({ candidate: req.user.id }).sort({ createdAt: -1 });
    return res.json(cvs);
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi lấy CV",
      error: error.message,
    });
  }
};
export const getCVById = async (req, res) => {
    try {
        // Chỉ tìm theo ID, bỏ điều kiện { candidate: req.user.id }
        const cv = await CV.findById(req.params.id);

        if (!cv) {
            return res.status(404).json({ message: "Không tìm thấy CV hệ thống" });
        }
        return res.json(cv);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// ✏️ Cập nhật CV
export const updateCV = async (req, res) => {
  try {
    const allowedFields = [
      "title",
      "summary",
      "education",
      "experience",
      "skills",
      "projects",
      "contact",
      "isDefault",
    ];

    // Lọc field ko hợp lệ
    Object.keys(req.body).forEach((key) => {
      if (!allowedFields.includes(key)) delete req.body[key];
    });

    const updated = await CV.findOneAndUpdate(
      { _id: req.params.id, candidate: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy CV" });
    }

    return res.json({
      message: "Cập nhật CV thành công",
      cv: updated,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi cập nhật CV",
      error: error.message,
    });
  }
};

// ❌ Xóa CV
export const deleteCV = async (req, res) => {
  try {
    const deleted = await CV.findOneAndDelete({
      _id: req.params.id,
      candidate: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy CV" });
    }

    // Nếu CV bị xoá là default thì set default cho CV khác
    if (deleted.isDefault) {
      const anotherCV = await CV.findOne({ candidate: req.user.id });
      if (anotherCV) {
        anotherCV.isDefault = true;
        await anotherCV.save();
      }
    }

    return res.json({ message: "Xoá CV thành công" });

  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi xoá CV",
      error: error.message,
    });
  }
};

// ⭐ Đặt CV mặc định
export const setDefaultCV = async (req, res) => {
  try {
    // Unset all
    await CV.updateMany(
      { candidate: req.user.id },
      { isDefault: false }
    );

    // Set new default
    const cv = await CV.findOneAndUpdate(
      { _id: req.params.id, candidate: req.user.id },
      { isDefault: true },
      { new: true }
    );

    if (!cv) {
      return res.status(404).json({ message: "Không tìm thấy CV" });
    }

    return res.json({
      message: "Đặt CV mặc định thành công",
      cv,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi đặt CV mặc định",
      error: error.message,
    });
  }
};
