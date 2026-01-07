import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const run = async () => {
  try {
    // 🔌 Kết nối DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // 🔄 Update user cũ chưa có experience
    const result = await User.updateMany(
      { experience: { $exists: false } },
      { $set: { experience: 1 } }
    );

    console.log(`✅ Updated ${result.modifiedCount} users`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error updating experience:", err);
    process.exit(1);
  }
};

run();
