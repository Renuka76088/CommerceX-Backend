import express from "express";
import { getVendorDashboard } from "../Controllers/vendorDashboardController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Vendor analytics dashboard
router.get("/", authMiddleware(["vendor"]), getVendorDashboard);

export default router;
