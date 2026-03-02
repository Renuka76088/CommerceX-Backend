import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from "../Controllers/CartController.js";

import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/add", authMiddleware(), addToCart);
router.get("/", authMiddleware(), getCart);
router.put("/update", authMiddleware(), updateCartItem);
router.delete("/remove/:productId", authMiddleware(), removeFromCart);
router.delete("/clear", authMiddleware(), clearCart);

export default router;
