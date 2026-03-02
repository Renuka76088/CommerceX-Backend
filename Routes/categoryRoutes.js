import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createVendorCategory,
  getVendorCategories,
  createSubCategory,
  getVendorSubCategories
} from "../Controllers/categoryController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= ADMIN ================= */

// Admin creates category
router.post("/admin/create", authMiddleware(["admin"]), createCategory);

// Update category
router.put("/admin/update/:categoryId", authMiddleware(["admin"]), updateCategory);

// Delete category
router.delete("/admin/delete/:categoryId", authMiddleware(["admin"]), deleteCategory);


/* ================= PUBLIC ================= */

// Get all categories
router.get("/", getCategories);


/* ================= VENDOR ================= */

// Vendor creates category
router.post("/vendor/create", authMiddleware(["vendor"]), createVendorCategory);

// Vendor fetches their categories
router.get("/vendor/my-categories", authMiddleware(["vendor"]), getVendorCategories);

// Vendor creates subcategory
router.post("/vendor/create-subcategory", authMiddleware(["vendor"]), createSubCategory);

// Vendor fetches subcategories
router.get("/vendor/my-subcategories", authMiddleware(["vendor"]), getVendorSubCategories);


/* ================= MUST BE LAST ================= */

// Get single category (dynamic route always last)
router.get("/:categoryId", getCategoryById);

export default router;
