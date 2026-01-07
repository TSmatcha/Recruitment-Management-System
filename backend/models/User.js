import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // ===== Thông tin cơ bản =====
    name: {
      type: String,
      required: [true, "Tên không được để trống"],
    },
    email: {
      type: String,
      required: [true, "Email không được để trống"],
      unique: true,
      match: [/.+\@.+\..+/, "Email không hợp lệ"],
    },
    password: {
      type: String,
      required: [true, "Mật khẩu không được để trống"],
      minlength: [6, "Mật khẩu ít nhất 6 ký tự"],
    },
    role: {
      type: String,
      enum: ["candidate", "employer", "admin"],
      default: "candidate",
    },

    // ===== Thông tin chung & Ứng viên =====
    phone: { type: String },
    address: { type: String },
    gender: { type: String, enum: ["Nam", "Nữ", "Khác"], default: "Khác" },
    birthdate: { type: Date },
    skills: { type: [String], default: [] },

    // ✅ ĐÃ CẬP NHẬT: Experience dạng mảng Object
    experience: [
      {
        companyName: String,
        position: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],

    // ✅ ĐÃ CẬP NHẬT: Education dạng mảng Object
    education: [
      {
        school: String,
        degree: String,
        startYear: Number,
        endYear: Number,
      },
    ],

    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    avatar: { type: String },
    avatar_public_id: { type: String },
    industry: {
      type: String,
      enum: [
        "it",
        "sales",
        "accounting",
        "marketing",
        "education",
        "hr",
        "healthcare",
        "production",
        "none",
      ],
      required: function () {
        return this.role === "candidate";
      },
      default: "none",
    },
    cv: { type: String },
    cv_public_id: { type: String },

    // ===== Nhà tuyển dụng =====
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    credits: { type: Number, default: 0 },
    savedCandidates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    // ===== Quên mật khẩu =====
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },

    // ===== Cờ trạng thái =====
    isActive: { type: Boolean, default: true },
    isProfilePublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 🔒 Hash password trước khi lưu
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔑 So sánh mật khẩu khi đăng nhập
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 📅 Virtual field: ngày tham gia
userSchema.virtual("joinDate").get(function () {
  if (!this.createdAt) return null;
  return this.createdAt.toLocaleDateString("vi-VN");
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

const User = mongoose.model("User", userSchema);
export default User;