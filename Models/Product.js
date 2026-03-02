import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    // 🔥 NEW FIELD
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
      index: true
    },

    vendorShopName: {
      type: String,
      required: true,
      trim: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    // ✅ Cloudinary Images
    images: [
      {
        url: {
          type: String,
          required: true
        },
        publicId: {
          type: String,
          required: true
        }
      }
    ],

    currentPrice: {
      type: Number,
      required: true,
      min: 0
    },

    previousPrice: {
      type: Number,
      required: true,
      min: 0
    },

    discount: {
      type: Number,
      min: 0,
      max: 100
    },

    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    stock: {
      type: Number,
      default: 0,
      min: 0
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);


/* 🔥 Prevent Same Vendor Same SubCategory Same Title Duplicate */
productSchema.index(
  { vendor: 1, subCategory: 1, title: 1 },
  { unique: true }
);

export default mongoose.model("Product", productSchema);
