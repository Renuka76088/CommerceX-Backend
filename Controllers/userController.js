import User from "../Models/User.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../Utils/sendEmail.js";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ================= SEND OTP =================
export const sendOtp = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ message: "Email and role required" });
    }

    const otp = generateOTP();

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, role });
    }

    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await user.save();

    // ✅ EMAIL SEND
    await sendEmail(email, otp);

    res.json({
      message: "OTP sent to email successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= VERIFY OTP =================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP Expired" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({
      message: "Login Successful",
      token,
      role: user.role,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};