import SavedJob from "../models/SavedJob.js";
import Job from "../models/Job.js";

// 💾 Lưu công việc
export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Công việc không tồn tại!" });

    const saved = await SavedJob.create({ jobId, userId });
    res.status(201).json({ message: "Đã lưu công việc!", saved });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Bạn đã lưu công việc này rồi!" });
    }
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ❌ Bỏ lưu công việc
export const unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    const deleted = await SavedJob.findOneAndDelete({ jobId, userId });
    if (!deleted) {
      return res.status(404).json({ message: "Công việc chưa được lưu!" });
    }

    res.json({ message: "Đã bỏ lưu công việc!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// 📋 Lấy danh sách công việc đã lưu
export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    const savedJobs = await SavedJob.find({ userId })
      .populate({
        path: "jobId",
        select: "title location salary company",
        populate: {
          path: "company",
          select: "name logo", // lấy tên và logo công ty
        },
        match: { _id: { $exists: true } } // lọc job bị xóa
      });

    // Lọc ra những jobId bị null (job đã bị xóa)
    const filtered = savedJobs.filter(s => s.jobId);

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
