import Admin from "../Models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ADMIN LOGIN
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Admin Login Successful",
      token,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDefaultAdmin = async (req, res) => {
  try {
    const existing = await Admin.findOne({ username: "superadmin" });

    if (existing) {
      return res.json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await Admin.create({
      username: "superadmin",
      password: hashedPassword,
    });

    res.json({ message: "Default Admin Created" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
