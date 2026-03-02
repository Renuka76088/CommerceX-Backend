import express from "express";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addProduct,
  getVendorProducts,
  updateProductByVendor,
  deleteProductByVendor,
  approveProduct,
  deleteProduct,
  getApprovedProducts,
} from "../Controllers/productController.js";

const router = express.Router();

// Vendor Add Product
router.post(
  "/add",
  authMiddleware(["vendor"]),
  upload.array("images", 5),
  addProduct
);


// Vendor Get Own Products
router.get(
  "/vendor/my-products",
  authMiddleware(["vendor"]),
  getVendorProducts
);

// Vendor Update Product
router.put(
  "/vendor/update/:productId",
  authMiddleware(["vendor"]),
  upload.array("images", 5),
  updateProductByVendor
);

// Vendor Delete Product
router.delete(
  "/vendor/delete/:productId",
  authMiddleware(["vendor"]),
  deleteProductByVendor
);
// Admin Approve
router.put(
  "/approve/:productId",
  authMiddleware(["admin"]),
  approveProduct
);

// Admin Delete
router.delete(
  "/delete/:productId",
  authMiddleware(["admin"]),
  deleteProduct
);

// User View Products
router.get("/all", getApprovedProducts);

export default router;
