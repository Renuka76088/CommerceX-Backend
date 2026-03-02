import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createInventory,
  updateStock,
  getVendorInventory,
  getSingleInventory,
  deleteInventory
} from "../Controllers/inventoryController.js";

const router = express.Router();

// Create inventory
router.post(
  "/create/:productId",
  authMiddleware(["vendor"]),
  createInventory
);

// Update stock
router.put(
  "/update/:productId",
  authMiddleware(["vendor"]),
  updateStock
);

// Get vendor inventory
router.get(
  "/vendor",
  authMiddleware(["vendor"]),
  getVendorInventory
);

// Get single product inventory
router.get("/:productId", getSingleInventory);

// Delete inventory
router.delete(
  "/delete/:productId",
  authMiddleware(["vendor"]),
  deleteInventory
);

export default router;
