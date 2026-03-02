import express from "express";
import { sendOtp, verifyOtp } from "../Controllers/userController.js";
import { adminLogin,  createDefaultAdmin } from "../Controllers/adminController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/create-default-admin", createDefaultAdmin);
router.post("/admin-login", adminLogin);

export default router;
