import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },

    location: { type: String, required: true },

    salary: {
      type: Number,
      required: true
    },

    description: { type: String, required: true },
    requirements: { type: String, default: "" },

    jobType: {
      type: String,
      enum: ["fulltime", "parttime", "internship", "remote"],
      default: "fulltime"
    },

    category: {
      type: String,
      required: true,
      enum: [
        "it",
        "accounting",
        "marketing",
        "hr",
        "sales",
        "production",
        "education",
        "healthcare"
      ]
    },

    career: { type: String },
    level: { type: String },
    experience: { type: String },
    education: { type: String, default: "Không yêu cầu" },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // ✅ ĐÃ CẬP NHẬT: Thêm interview và rating vào applicants
    applicants: {
      type: [
        {
          candidateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
          },
          name: String,
          email: String,
          cv: String,
          status: { type: String, default: "new" },
          appliedAt: { type: Date, default: Date.now },
          
          // Thêm mới: Thông tin phỏng vấn
          interview: {
            scheduledDate: { type: Date },
            location: { type: String }, 
            note: { type: String }
          },
          
          // Thêm mới: Đánh giá ứng viên
          rating: {
            score: { type: Number, min: 1, max: 5 },
            comment: { type: String }
          }
        }
      ],
      default: []
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },

    resendRequested: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// 🔹 Kiểm tra hết hạn
jobSchema.methods.isExpired = function () {
  return this.expiresAt && new Date() > this.expiresAt;
};

const Job = mongoose.model("Job", jobSchema);
export default Job;