import mongoose from "mongoose";

const cvSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: { type: String, required: true, trim: true },
    summary: { type: String, trim: true },

    education: [
      {
        school: { type: String, trim: true },
        degree: { type: String, trim: true },
        startYear: Number,
        endYear: Number,
      },
    ],

    experience: [
      {
        company: { type: String, trim: true },
        position: { type: String, trim: true },
        startDate: Date,
        endDate: Date,
        description: { type: String, trim: true },
      },
    ],

    skills: [{ type: String, trim: true }],

    projects: [
      {
        name: { type: String, trim: true },
        description: { type: String, trim: true },
        link: { type: String, trim: true },
      },
    ],

    contact: {
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
      address: { type: String, trim: true },
    },

    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("CV", cvSchema);
