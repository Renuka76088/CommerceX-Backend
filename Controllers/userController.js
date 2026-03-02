import User from "../Models/User.js";
import jwt from "jsonwebtoken";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// SEND OTP
export const sendOtp = async (req, res) => {
  try {
    const { mobile, role } = req.body;

    if (!mobile || !role) {
      return res.status(400).json({ message: "Mobile and role required" });
    }

    const otp = generateOTP();

    let user = await User.findOne({ mobile });

    if (!user) {
      user = new User({ mobile, role });
    }

    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await user.save();

    // ✅ Console me OTP show hoga
    console.log(`OTP for ${mobile}: ${otp}`);

    // ✅ Postman me bhi OTP milega (Testing ke liye)
    res.json({
      message: "OTP Sent Successfully",
      otp: otp
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// VERIFY OTP
export const verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    const user = await User.findOne({ mobile });

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
