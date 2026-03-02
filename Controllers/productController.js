import Product from "../Models/Product.js";
import { SubCategory } from "../Models/Category.js";
import User from "../Models/User.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../Utils/cloudinary.js";
import fs from "fs";


// ======================================
// 🔹 Vendor Add Product
// ======================================

const cleanNumber = (value) => {
  if (!value) return 0;
  return Number(value.toString().replace(/[^\d.]/g, ""));
};

export const addProduct = async (req, res) => {
  try {
    const vendorId = req.user.id;

    const {
      title,
      description,
      currentPrice,
      previousPrice,
      discount,
      ratings,
      subCategoryId
    } = req.body;

    if (!subCategoryId) {
      return res.status(400).json({ message: "SubCategory is required" });
    }

    // 🔥 Check subcategory belongs to vendor
    const subCategory = await SubCategory.findOne({
      _id: subCategoryId,
      vendor: vendorId
    });

    if (!subCategory) {
      return res.status(403).json({
        message: "SubCategory not found or not authorized"
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image required" });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const result = await uploadToCloudinary(file.path, "products");

      uploadedImages.push({
        url: result.url,
        publicId: result.publicId,
      });

      fs.unlinkSync(file.path);
    }

    const product = await Product.create({
      vendor: vendorId,
      subCategory: subCategoryId,
      vendorShopName: req.user.shopName || "Vendor Shop",
      title,
      description,
      images: uploadedImages,
      currentPrice: cleanNumber(currentPrice),
      previousPrice: cleanNumber(previousPrice),
      discount: cleanNumber(discount),
      ratings: cleanNumber(ratings),
      status: "pending"
    });

    res.status(201).json({
      message: "Product Added. Waiting for Admin Approval.",
      product
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// ======================================
// 🔹 Vendor Get Own Products
// ======================================
export const getVendorProducts = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const products = await Product.find({ vendor: vendorId });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ======================================
// 🔹 Vendor Update Product
// ======================================
export const updateProductByVendor = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.vendor.toString() !== vendorId) {
      return res.status(403).json({ message: "You can update only your own product" });
    }

    const {
      title,
      description,
      currentPrice,
      previousPrice,
      discount,
      ratings,
    } = req.body;

    // 🔥 If new images uploaded
    if (req.files && req.files.length > 0) {

      // Delete old images from cloudinary
      for (const img of product.images) {
        if (img.publicId) {
          await deleteFromCloudinary(img.publicId);
        }
      }

      const uploadedImages = [];

      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path, "products");

        uploadedImages.push({
          url: result.url,
          publicId: result.publicId,
        });

        fs.unlinkSync(file.path);
      }

      product.images = uploadedImages;
    }

    product.title = title || product.title;
    product.description = description || product.description;
    product.currentPrice = currentPrice || product.currentPrice;
    product.previousPrice = previousPrice || product.previousPrice;
    product.discount = discount || product.discount;
    product.ratings = ratings || product.ratings;

    // Update ke baad fir se pending
    product.status = "pending";

    await product.save();

    res.json({
      message: "Product Updated. Waiting for Admin Approval.",
      product,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ======================================
// 🔹 Vendor Delete Product
// ======================================
export const deleteProductByVendor = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.vendor.toString() !== vendorId) {
      return res.status(403).json({ message: "You can delete only your own product" });
    }

    // Delete images from cloudinary
    for (const img of product.images) {
      if (img.publicId) {
        await deleteFromCloudinary(img.publicId);
      }
    }

    await product.deleteOne();

    res.json({ message: "Product Deleted Successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ======================================
// 🔹 Admin Approve Product
// ======================================
export const approveProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndUpdate(
      productId,
      { status: "approved" },
      { new: true }
    );

    res.json({ message: "Product Approved", product });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ======================================
// 🔹 Admin Delete Product
// ======================================
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // delete cloudinary images
    for (const img of product.images) {
      if (img.publicId) {
        await deleteFromCloudinary(img.publicId);
      }
    }

    await product.deleteOne();

    res.json({ message: "Product Deleted Successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ======================================
// 🔹 User Get Approved Products
// ======================================
export const getApprovedProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "approved" })
      .populate("vendor", "mobile shopName")
      .populate({
        path: "subCategory",
        populate: {
          path: "category",
          select: "name"
        }
      });

    res.json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
