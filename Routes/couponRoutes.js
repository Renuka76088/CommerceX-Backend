import express from "express";
import {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getSingleCoupon,
  getVendorCoupons,
} from "../Controllers/CouponController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware(["vendor"]), createCoupon);

router.put("/update/:couponId", authMiddleware(["vendor"]), updateCoupon);

router.delete("/delete/:couponId", authMiddleware(["vendor"]), deleteCoupon);

router.get("/vendor", authMiddleware(["vendor"]), getVendorCoupons);

router.get("/single/:couponId", getSingleCoupon);

export default router;
