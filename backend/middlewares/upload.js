import multer from "multer";
import path from "path";

// STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

// FILTER
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const imageTypes = ["image/jpeg", "image/png", "image/jpg"];
    const docTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/zip",
    ];

    if (file.fieldname === "avatar" || file.fieldname === "logo") {
      if (!imageTypes.includes(file.mimetype)) {
        return cb(new Error(`${file.fieldname} phải là ảnh JPG/PNG`), false);
      }
      return cb(null, true);
    }

    if (file.fieldname === "cv") {
      if (!docTypes.includes(file.mimetype)) {
        return cb(new Error("CV chỉ chấp nhận PDF / DOC / DOCX"), false);
      }
      return cb(null, true);
    }

    cb(new Error("Field upload không hợp lệ"), false);
  },
});
