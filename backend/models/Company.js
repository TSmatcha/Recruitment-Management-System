import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "Chưa có mô tả" },
  website: { type: String, default: "#" },
  email: { 
    type: String, 
    required: true, 
    default: function() { 
      return "info@" + (this.name ? this.name.replace(/\s+/g, "").toLowerCase() + ".com" : "company.com"); 
    } 
  },
  address: { type: String, required: true, default: "Đang cập nhật" },
  logo: { type: String, default: "https://via.placeholder.com/100" },
  industry: { type: String },
  field: { type: String },
  size: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// 🔹 Virtual populate jobs
companySchema.virtual("jobs", {
  ref: "Job",
  localField: "_id",
  foreignField: "company",
});

export default mongoose.model("Company", companySchema);
