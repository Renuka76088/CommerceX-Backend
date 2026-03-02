import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: String,
    title: String,
    description: String,
    discountType: {
      type: String,
      enum: ["flat", "percentage"],
    },
    discountValue: Number,
    minOrderAmount: Number,
    maxDiscount: Number,
    expiryDate: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
