import Review from "../Models/Review.js";
import Product from "../Models/Product.js";

// 🔹 Add or Update Review
export const addOrUpdateReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment)
      return res.status(400).json({ message: "Rating and comment required" });

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // ✅ Check if user already reviewed
    let review = await Review.findOne({ user: userId, product: productId });

    if (review) {
      review.rating = rating;
      review.comment = comment;
      await review.save();
      return res.json({ message: "Review updated successfully", review });
    }

    // ✅ Create new review
    review = await Review.create({
      user: userId,
      product: productId,
      rating,
      comment,
    });

    res.status(201).json({ message: "Review added successfully", review });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get All Reviews for a Product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate("user", "mobile fullName");

    res.json({ count: reviews.length, reviews });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Delete Review (User or Admin)
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const review = await Review.findById(reviewId);
    if (!review)
      return res.status(404).json({ message: "Review not found" });

    // User can delete their own review, Admin can delete any
    if (review.user.toString() !== userId && role !== "admin")
      return res.status(403).json({ message: "Unauthorized" });

    await review.deleteOne();

    res.json({ message: "Review deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
