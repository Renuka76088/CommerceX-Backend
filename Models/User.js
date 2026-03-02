import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  mobile: { type: String, unique: true },
  role: {
    type: String,
    enum: ["user", "vendor"],
  },
  otp: String,
  otpExpiry: Date,
});

// ✅ Check if model already exists
export default mongoose.models.User || mongoose.model("User", userSchema);
