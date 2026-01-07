import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * 🛡️ Middleware xác thực JWT
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Lấy token từ header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Không có token xác thực!" });
    }

    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ message: "Token không hợp lệ!" });
    }

    // Tìm user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Người dùng không tồn tại!" });
    }

    // Gắn vào req.user
    req.user = {
      _id: user._id.toString(),
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name,
    };

    return next(); // ⭐ tiếp tục route
  } catch (error) {
    console.error("❌ JWT Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token đã hết hạn!" });
    }

    return res.status(401).json({ message: "Token không hợp lệ!" });
  }
};

/**
 * 👑 Role: ADMIN
 */
export const adminOnly = (req, res, next) => {
  if (req.user?.role === "admin") return next();

  return res.status(403).json({ message: "Không có quyền admin!" });
};

/**
 * 🏢 Role: EMPLOYER
 */
export const employerOnly = (req, res, next) => {
  if (req.user?.role === "employer") return next();

  return res.status(403).json({ message: "Chỉ dành cho nhà tuyển dụng!" });
};

/**
 * 👩‍💻 Role: CANDIDATE
 */
export const candidateOnly = (req, res, next) => {
  if (req.user?.role === "candidate") return next();

  return res.status(403).json({ message: "Chỉ dành cho ứng viên!" });
};
/**
 * 🔒 Chặn user bị khóa
 */
export const checkActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.isActive) {
      return res.status(403).json({ message: "Tài khoản của bạn đã bị khóa!" });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
