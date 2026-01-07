import mongoose from "mongoose";

const savedJobSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

// ✅ Không cho phép lưu trùng 1 công việc
savedJobSchema.index({ jobId: 1, userId: 1 }, { unique: true });

const SavedJob = mongoose.model("SavedJob", savedJobSchema);
export default SavedJob;
