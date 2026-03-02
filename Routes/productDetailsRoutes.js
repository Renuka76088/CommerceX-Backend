import express from "express";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createProductDetails,
  updateProductDetails,
  deleteProductDetails,
  getProductDetails,
} from "../Controllers/productDetailsController.js";

const router = express.Router();

router.post(
  "/create/:productId",
  authMiddleware(["vendor"]),
  upload.array("extraImages", 6),
  createProductDetails
);

router.put(
  "/update/:productId",
  authMiddleware(["vendor"]),
  upload.array("extraImages", 6),
  updateProductDetails
);

router.delete(
  "/delete/:productId",
  authMiddleware(["vendor"]),
  deleteProductDetails
);

router.get("/get/:productId", getProductDetails);

export default router;
