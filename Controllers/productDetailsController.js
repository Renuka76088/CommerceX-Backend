import ProductDetails from "../Models/ProductDetails.js";
import Product from "../Models/Product.js";
import ExtraGift from "../Models/ExtraGift.js";
import Coupon from "../Models/Coupon.js";
import { uploadToCloudinary } from "../Utils/cloudinary.js";
import fs from "fs";


// 🔹 CREATE PRODUCT DETAILS
export const createProductDetails = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { productId } = req.params;

    // 🔹 Check product
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    if (product.vendor.toString() !== vendorId)
      return res.status(403).json({ message: "Unauthorized" });

    // 🔹 Prevent duplicate details
    const alreadyExists = await ProductDetails.findOne({ product: productId });
    if (alreadyExists)
      return res.status(400).json({
        message: "Details already created. Use update API."
      });

    // 🔹 Upload Images
    let extraImages = [];

    if (req.files && req.files.length > 0) {
      if (req.files.length > 6)
        return res.status(400).json({
          message: "Maximum 6 images allowed"
        });

      for (const file of req.files) {
        const result = await uploadToCloudinary(
          file.path,
          "products/details"
        );

        // ✅ Safe push (no null issue)
        extraImages.push(result.secure_url || result.url);

        fs.unlinkSync(file.path);
      }
    }

    // 🔹 Convert gift IDs to array
    const giftIds = req.body.giftExtras
      ? Array.isArray(req.body.giftExtras)
        ? req.body.giftExtras
        : [req.body.giftExtras]
      : [];

    // 🔹 Convert coupon IDs to array
    const couponIds = req.body.offersAvailable
      ? Array.isArray(req.body.offersAvailable)
        ? req.body.offersAvailable
        : [req.body.offersAvailable]
      : [];

    // 🔹 Create Details
    const createdDetails = await ProductDetails.create({
      product: productId,
      vendor: vendorId,
      aboutProduct: req.body.aboutProduct || "",
      extraImages,
      giftExtras: giftIds,
      offersAvailable: couponIds,
    });

    // 🔹 Populate
    const populatedDetails = await ProductDetails.findById(
      createdDetails._id
    )
      .populate("product")
      .populate("vendor", "mobile shopName")
      .populate("giftExtras")
      .populate("offersAvailable");

    // 🔥 FRONTEND FRIENDLY RESPONSE
    res.status(201).json({
      message: "Product Details Created Successfully",
      data: {
        // 🔹 Product fields
        productId: populatedDetails.product._id,
        title: populatedDetails.product.title,
        description: populatedDetails.product.description,
        currentPrice: populatedDetails.product.currentPrice,
        previousPrice: populatedDetails.product.previousPrice,
        discount: populatedDetails.product.discount,
        ratings: populatedDetails.product.ratings,
        productImages: populatedDetails.product.images,

        // 🔹 Details fields
        aboutProduct: populatedDetails.aboutProduct,
        extraImages: populatedDetails.extraImages,

        // 🔹 Relations
        giftExtras: populatedDetails.giftExtras,
        offersAvailable: populatedDetails.offersAvailable,

        vendor: populatedDetails.vendor,

        createdAt: populatedDetails.createdAt,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};





// 🔹 UPDATE PRODUCT DETAILS
export const updateProductDetails = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { productId } = req.params;

    const details = await ProductDetails.findOne({ product: productId });
    if (!details)
      return res.status(404).json({ message: "Details not found" });

    if (details.vendor.toString() !== vendorId)
      return res.status(403).json({ message: "Unauthorized" });

    // Append new images (max 6 total)
    if (req.files && req.files.length > 0) {
      if (details.extraImages.length + req.files.length > 6)
        return res.status(400).json({ message: "Maximum 6 images allowed" });

      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path, "products/details");
        details.extraImages.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
    }

    if (req.body.aboutProduct !== undefined)
      details.aboutProduct = req.body.aboutProduct;

    await details.save();

    res.json({
      message: "Product Details Updated Successfully",
      details,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔹 DELETE PRODUCT DETAILS
export const deleteProductDetails = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { productId } = req.params;

    const details = await ProductDetails.findOne({ product: productId });

    if (!details)
      return res.status(404).json({ message: "Details not found" });

    if (details.vendor.toString() !== vendorId)
      return res.status(403).json({ message: "Unauthorized" });

    await details.deleteOne();

    res.json({ message: "Product Details Deleted Successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔹 ATTACH GIFTS & COUPONS TO PRODUCT
export const attachDetailsToProduct = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { productId } = req.params;
    const { giftIds = [], couponIds = [] } = req.body;

    const details = await ProductDetails.findOne({ product: productId });

    if (!details)
      return res.status(404).json({ message: "Details not found" });

    if (details.vendor.toString() !== vendorId)
      return res.status(403).json({ message: "Unauthorized" });

    // Validate Gifts
    const validGifts = await ExtraGift.find({
      _id: { $in: giftIds },
      vendor: vendorId,
    });

    // Validate Coupons
    const validCoupons = await Coupon.find({
      _id: { $in: couponIds },
      vendor: vendorId,
    });

    details.giftExtras = validGifts.map(g => g._id);
    details.offersAvailable = validCoupons.map(c => c._id);

    await details.save();

    res.json({
      message: "Gifts & Coupons Attached Successfully",
      details,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔹 GET PRODUCT DETAILS (USER SIDE)
export const getProductDetails = async (req, res) => {
  try {
    const { productId } = req.params;

    const details = await ProductDetails.findOne({ product: productId })
      .populate("product")
      .populate("vendor", "mobile shopName")
      .populate("giftExtras")
      .populate("offersAvailable");

    if (!details)
      return res.status(404).json({ message: "Details not found" });

    res.json(details);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
