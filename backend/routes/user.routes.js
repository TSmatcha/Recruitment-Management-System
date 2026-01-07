import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại!" });
    }

    return res.json({
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
      company: user.company || null
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi server!" });
  }
});

export default router;
