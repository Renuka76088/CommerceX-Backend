import mongoose from "mongoose";

/* ================= CATEGORY ================= */

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },

  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

}, { timestamps: true });

// Same vendor duplicate category na bana sake
categorySchema.index({ name: 1, vendor: 1 }, { unique: true });


/* ================= SUB CATEGORY ================= */

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

}, { timestamps: true });

// Same vendor same category me duplicate subcategory na bana sake
subCategorySchema.index(
  { name: 1, category: 1, vendor: 1 },
  { unique: true }
);


/* ================= EXPORT ================= */

export const Category = mongoose.model("Category", categorySchema);
export const SubCategory = mongoose.model("SubCategory", subCategorySchema);
