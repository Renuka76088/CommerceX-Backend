import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // email is required and unique
  role: {
    type: String,
    enum: ["user", "vendor"],
    required: true,
  },
  otp: String,
  otpExpiry: Date,
});

// Prevent model overwrite errors
export default mongoose.models.User || mongoose.model("User", userSchema);