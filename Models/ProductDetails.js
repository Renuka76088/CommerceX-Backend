import mongoose from "mongoose";

const productDetailsSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    aboutProduct: String,

    extraImages: [String],

    giftExtras: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExtraGift",
      },
    ],

    offersAvailable: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("ProductDetails", productDetailsSchema);
