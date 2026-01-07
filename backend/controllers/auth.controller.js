  import jwt from "jsonwebtoken";
  import crypto from "crypto";
  import User from "../models/User.js";
  import Company from "../models/Company.js";
  import sendResetPasswordEmail from "../utils/sendResetPasswordEmail.js";
  //  Hàm tạo JWT token
  const generateToken = (user) => {
    return jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );
  };

  //  Hàm format thông tin user trả về
  const formatUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    industry: user.industry || "",
    avatar: user.avatar || null,
     avatar_public_id: user.avatar_public_id || null,
    joinDate: user.createdAt
      ? new Date(user.createdAt).toLocaleDateString("vi-VN") 
      : "Không rõ",
  });

  //  Đăng ký Ứng viên
  export const registerCandidate = async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const exist = await User.findOne({ email });
      if (exist)
        return res.status(400).json({ message: "Email đã tồn tại" });

      const user = await User.create({
        name,
        email,
        password,
        role: "candidate",
      });

      const token = generateToken(user);
      res.status(201).json({
        message: "Đăng ký ứng viên thành công",
        user: formatUser(user),
        token,
      });
    } catch (err) {
      console.error("❌ Lỗi đăng ký ứng viên:", err.message);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  };

  //  Đăng ký Nhà tuyển dụng (FULL VERSION)
export const registerEmployer = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      companyName,
      location,
      industry,
      description,
      website,
      emailCompany,
      logo,
    } = req.body;

    // Kiểm tra email tồn tại
    const exist = await User.findOne({ email });
    if (exist)
      return res.status(400).json({ message: "Email đã tồn tại" });

    //  Tạo user employer
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "employer",
    });

    //  Tạo công ty
    const company = await Company.create({
      name: companyName,
      address: location || "Đang cập nhật",
      industry: industry || "",
      description: description || "Chưa có mô tả",
      website: website || "#",
      email: emailCompany || `info@${companyName.replace(/\s+/g, "").toLowerCase()}.com`,
      logo: logo || "https://via.placeholder.com/100",
      owner: user._id,
    });

    //  Gắn company vào user
    user.company = company._id;
    await user.save();

    //  Sinh token
    const token = generateToken(user);

    res.status(201).json({
      message: "Đăng ký nhà tuyển dụng thành công",
      user: formatUser(user),
      company,
      token,
    });
  } catch (err) {
    console.error("❌ Lỗi đăng ký nhà tuyển dụng:", err.message);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};


  //  Tạo Admin (chỉ dùng 1 lần)
  export const createAdmin = async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const exist = await User.findOne({ email });
      if (exist)
        return res.status(400).json({ message: "Email đã tồn tại" });

      await User.create({
        name,
        email,
        password,
        role: "admin",
      });

      res.status(201).json({ message: "Tạo admin thành công" });
    } catch (err) {
      console.error("❌ Lỗi tạo admin:", err.message);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  };

  //  Đăng nhập (có kiểm tra role + check isActive)
export const loginUser = async (req, res) => {
  try {
    const { email, password, expectedRole } = req.body; // expectedRole: 'candidate' hoặc 'employer'

    //  Tìm user theo email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    //  Kiểm tra mật khẩu
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Sai mật khẩu" });

    //  Kiểm tra tài khoản có bị khóa không
    if (!user.isActive) {
      return res.status(403).json({ message: "Tài khoản của bạn đã bị khóa!" });
    }

    //  Kiểm tra role nếu có expectedRole từ frontend
    if (expectedRole && user.role !== expectedRole) {
      return res.status(403).json({
        message:
          user.role === "employer"
            ? "Đây là tài khoản Nhà tuyển dụng. Vui lòng đăng nhập tại trang Dành cho Nhà tuyển dụng."
            : user.role === "candidate"
            ? "Đây là tài khoản Ứng viên. Vui lòng đăng nhập tại trang Dành cho Ứng viên."
            : "Tài khoản này không được phép đăng nhập tại trang này.",
      });
    }

    //  Tạo JWT token
    const token = generateToken(user);

    //  Trả kết quả thành công
    res.status(200).json({
      message: "Đăng nhập thành công",
      user: formatUser(user),
      token,
    });
  } catch (err) {
    console.error("❌ Lỗi đăng nhập:", err.message);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
//  QUÊN MẬT KHẨU - GỬI LINK RESET
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản với email này",
      });
    }

    //  Tạo token
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 phút

    await user.save();

    //  Link reset (frontend)
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    //  Gửi email
    await sendResetPasswordEmail(user.email, resetUrl);

    res.json({
      message: "📧 Đã gửi email đặt lại mật khẩu",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
//  RESET MẬT KHẨU
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    //  Hash token nhận từ URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    //  Tìm user hợp lệ
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    //  Đặt mật khẩu mới
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      message: "Đặt lại mật khẩu thành công",
    });
  } catch (err) {
    console.error("❌ Reset password error:", err.message);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
// Tìm ứng viên
export const searchTalents = async (req, res) => {
  try {
    const { q, skills, minExp, maxExp, gender, education, industry } = req.query;

    // 1. Khởi tạo Pipeline với các điều kiện cơ bản
    let pipeline = [
      {
        $match: {
          role: "candidate",
          isActive: true,
          isProfilePublic: true,
        }
      }
    ];

    // 2. Tính toán tổng số năm kinh nghiệm (totalExp) từ mảng experience
    // Quy đổi từ ngày bắt đầu/kết thúc ra con số cụ thể
    pipeline.push({
      $addFields: {
        totalExp: {
          $reduce: {
            input: "$experience",
            initialValue: 0,
            in: {
              $add: [
                "$$value",
                {
                  $divide: [
                    {
                      $subtract: [
                        { $ifNull: ["$$this.endDate", new Date()] },
                        "$$this.startDate"
                      ]
                    },
                    31536000000 
                  ]
                }
              ]
            }
          }
        }
      }
    });

    // 3. Xây dựng các điều kiện lọc bổ sung
    const matchConditions = {};

    // 🔍 Tìm theo từ khóa (Tên hoặc Trường học trong mảng Education)
    if (q) {
      matchConditions.$or = [
        { name: { $regex: q, $options: "i" } },
        { "education.school": { $regex: q, $options: "i" } }
      ];
    }

    // 🧠 Kỹ năng
    if (skills) {
      const skillsArr = skills.split(",").map(s => s.trim());
      const skillRegexArr = skillsArr.map(s => new RegExp(`^${s}$`, "i"));
      matchConditions.skills = { $in: skillRegexArr };
    }

    // 🚻 Giới tính
    if (gender) matchConditions.gender = gender;

    // 🏥 Ngành nghề
    if (industry) matchConditions.industry = industry;

    // 🎓 Lọc riêng trường học
    if (education) {
      matchConditions["education.school"] = { $regex: education, $options: "i" };
    }

    // ⏳ Lọc theo tổng số năm kinh nghiệm đã tính ở bước 2
    if (minExp || maxExp) {
      matchConditions.totalExp = {};
      if (minExp) matchConditions.totalExp.$gte = Number(minExp);
      if (maxExp) matchConditions.totalExp.$lte = Number(maxExp);
    }

    // Đẩy các điều kiện match vào pipeline
    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    // 4. Sắp xếp và Loại bỏ các trường nhạy cảm
    pipeline.push({
      $sort: { totalExp: -1, createdAt: -1 }
    });
    
    pipeline.push({
      $project: {
        password: 0,
        resetPasswordToken: 0,
        resetPasswordExpire: 0
      }
    });

    // Thực thi Aggregation
    const talents = await User.aggregate(pipeline);

    res.json({
      success: true,
      count: talents.length,
      data: talents,
    });
  } catch (err) {
    console.error("❌ searchTalents error:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi tìm kiếm ứng viên",
    });
  }
};

// EMPLOYER – XEM CHI TIẾT ỨNG VIÊN
export const getCandidateDetail = async (req, res) => {
  try {
    const employerId = req.user._id;

    const candidate = await User.findOne({
      _id: req.params.id,
      role: "candidate",
    }).select("-password");

    if (!candidate) {
      return res.status(404).json({ message: "Không tìm thấy ứng viên" });
    }
    if (!candidate.isProfilePublic) {
  return res.status(404).json({ message: "Ứng viên đã ẩn hồ sơ" });
}
    const employer = await User.findById(employerId);

    if (!employer || employer.role !== "employer") {
      return res.status(403).json({
        message: "Không có quyền truy cập",
      });
    }

    const isSaved = employer.savedCandidates.some(
      (id) => id.toString() === candidate._id.toString()
    );

 res.json({
  ...candidate.toObject(),
  savedByCurrentEmployer: isSaved,
});


  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy chi tiết ứng viên" });
  }
};

// =====================
// LƯU ỨNG VIÊN
// =====================
export const saveCandidate = async (req, res) => {
  try {
    const employerId = req.user._id;
    const { candidateId } = req.body;

    const employer = await User.findById(employerId);
    if (!employer || employer.role !== "employer") {
      return res.status(403).json({
        message: "Không có quyền lưu ứng viên",
      });
    }

    const candidate = await User.findById(candidateId);
    if (!candidate || candidate.role !== "candidate") {
      return res.status(404).json({
        message: "Ứng viên không tồn tại",
      });
    }

    const alreadySaved = employer.savedCandidates.some(
      (id) => id.toString() === candidateId
    );

    if (alreadySaved) {
      return res.status(400).json({
        message: "Ứng viên đã được lưu",
      });
    }

    employer.savedCandidates.push(candidateId);
    await employer.save();

    res.json({
      success: true,
      message: "Đã lưu ứng viên",
    });

  } catch (error) {
    console.error("❌ saveCandidate error:", error);
    res.status(500).json({
      message: "Lỗi lưu ứng viên",
      error: error.message,
    });
  }
};
export const unsaveCandidate = async (req, res) => {
  try {
    const employerId = req.user._id;
    const { candidateId } = req.body;

    const employer = await User.findById(employerId);

    if (!employer || employer.role !== "employer") {
      return res.status(403).json({
        message: "Không có quyền thực hiện",
      });
    }

    employer.savedCandidates = employer.savedCandidates.filter(
      (id) => id.toString() !== candidateId
    );

    await employer.save();

    res.json({
      success: true,
      message: "Đã bỏ lưu ứng viên",
    });

  } catch (error) {
    console.error("❌ unsaveCandidate error:", error);
    res.status(500).json({
      message: "Lỗi bỏ lưu ứng viên",
    });
  }
};
// GET danh sách ứng viên đã lưu
export const getSavedCandidates = async (req, res) => {
  try {
    const employer = await User.findById(req.user._id)
      .populate({
        path: "savedCandidates",
        select: "-password -resetPasswordToken -resetPasswordExpire"
      });

    res.json({
      success: true,
      data: employer.savedCandidates,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi lấy danh sách ứng viên đã lưu" });
  }
};
