import express from "express";
import {
  createExtraGift,
  updateExtraGift,
  deleteExtraGift,
  getSingleGift,
  getVendorGifts,
} from "../Controllers/ExtraGiftController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware(["vendor"]),
  upload.single("image"),
  createExtraGift
);

router.put(
  "/update/:giftId",
  authMiddleware(["vendor"]),
  upload.single("image"),
  updateExtraGift
);

router.delete(
  "/delete/:giftId",
  authMiddleware(["vendor"]),
  deleteExtraGift
);

router.get(
  "/vendor",
  authMiddleware(["vendor"]),
  getVendorGifts
);

router.get("/single/:giftId", getSingleGift);

export default router;
