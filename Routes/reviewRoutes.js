import express from "express";
import {
  addOrUpdateReview,
  getProductReviews,
  deleteReview
} from "../Controllers/reviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ User adds or updates review
router.post("/:productId", authMiddleware(["user", "vendor"]), addOrUpdateReview);

// ✅ Get all reviews for a product
router.get("/:productId", getProductReviews);

// ✅ Delete review (user or admin)
router.delete("/:reviewId", authMiddleware(["user", "admin"]), deleteReview);

export default router;
