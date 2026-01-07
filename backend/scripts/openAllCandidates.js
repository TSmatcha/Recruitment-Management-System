import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const result = await User.updateMany(
      { role: "candidate" },
      { $set: { isProfilePublic: true } }
    );

    console.log("✅ DONE");
    console.log("Matched:", result.matchedCount);
    console.log("Modified:", result.modifiedCount);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
