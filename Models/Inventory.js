import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    totalStock: {
      type: Number,
      required: true,
      default: 0,
    },

    soldStock: {
      type: Number,
      default: 0,
    },

    availableStock: {
      type: Number,
      default: 0,
    },

    lowStockAlert: {
      type: Number,
      default: 5,
    },

    status: {
      type: String,
      enum: ["in_stock", "low_stock", "out_of_stock"],
      default: "in_stock",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Inventory", inventorySchema);
