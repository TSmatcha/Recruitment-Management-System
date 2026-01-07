import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverLetter: {
      type: String,
    },
    cvId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CV",
      default: null,
    },
    cvUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["applied", "invited", "reviewed", "interview", "accepted", "rejected"],
      default: "applied",
    },
    // ✅ ĐÃ SỬA DẤU NGOẶC Ở ĐÂY
    rating: {
      score: { type: Number, min: 1, max: 5 },
      comment: { type: String, default: "" },
    }, 
  },
  { timestamps: true }
);

applicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

applicationSchema.pre("save", function (next) {
  if (!this.cvId && !this.cvUrl) {
    return next(new Error("Application must have cvId or cvUrl"));
  }
  if (this.cvId && this.cvUrl) {
    return next(new Error("Only one of cvId or cvUrl is allowed"));
  }
  next();
});

const Application = mongoose.model("Application", applicationSchema);
export default Application;