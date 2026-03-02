import express from "express";
import {
  createPaymentOrder,
  verifyPaymentAndCreateOrder,
  getUserOrders,
  getVendorOrders,
  getAllOrdersAdmin,
  updateOrderStatus
} from "../Controllers/OrderController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// User
router.post("/create-payment", authMiddleware(["user"]), createPaymentOrder);
router.post("/verify-payment", authMiddleware(["user"]), verifyPaymentAndCreateOrder);
router.get("/my-orders", authMiddleware(["user"]), getUserOrders);

// Vendor
router.get("/vendor-orders", authMiddleware(["vendor"]), getVendorOrders);

// Admin
router.get("/all", authMiddleware(["admin"]), getAllOrdersAdmin);
router.put("/update-status/:orderId", authMiddleware(["admin"]), updateOrderStatus);

export default router;
