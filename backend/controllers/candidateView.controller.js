import CandidateView from "../models/CandidateView.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

// Nhà tuyển dụng xem hồ sơ ứng viên
export const viewCandidateProfile = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { candidateId } = req.params;

    const employer = await User.findById(employerId);
    if (!employer || employer.role !== "employer") {
      return res.status(403).json({ message: "Chỉ nhà tuyển dụng mới được phép!" });
    }

    const candidate = await User.findById(candidateId);
    if (!candidate || candidate.role !== "candidate") {
      return res.status(404).json({ message: "Không tìm thấy ứng viên!" });
    }

    //  Kiểm tra đã xem chưa
    const existed = await CandidateView.findOne({ employerId, candidateId });
    if (existed) {
      return res.json({ message: "Bạn đã xem hồ sơ này trước đó." });
    }

    //  Lưu lượt xem
    const newView = await CandidateView.create({ employerId, candidateId });

    //  Tạo thông báo cho ứng viên
    await Notification.create({
      userId: candidateId,
      title: "Nhà tuyển dụng đã xem hồ sơ của bạn",
      content: `${employer.name || "Một nhà tuyển dụng"} vừa xem hồ sơ của bạn.`,
    });

    res.json({ message: "Xem hồ sơ thành công!", view: newView });
  } catch (error) {
    console.error("❌ Lỗi xem hồ sơ:", error);
    res.status(500).json({ message: "Lỗi khi xem hồ sơ", error: error.message });
  }
};
export const getViewedList = async (req, res) => {
  try {
    const candidateId = req.user.id; // candidate login

    // Lấy tất cả employer đã xem hồ sơ
    const views = await CandidateView.find({ candidateId })
      .populate("employerId", "name company") // chỉ lấy tên, công ty
      .sort({ createdAt: -1 });

    const formatted = views.map(v => ({
      _id: v._id,
      companyName: v.employerId.company || v.employerId.name,
      dateViewed: v.createdAt
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách xem hồ sơ" });
  }
};
// Lấy thông tin employer
export const getEmployerDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const employer = await User.findById(id).select(
      "name company email phone address website description"
    );

    if (!employer || employer.role !== "employer") {
      return res.status(404).json({ message: "Không tìm thấy nhà tuyển dụng" });
    }

    res.json(employer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy thông tin nhà tuyển dụng" });
  }
};