import Coupon from "../Models/Coupon.js";


// 🔹 CREATE COUPON
export const createCoupon = async (req, res) => {
  try {
    const vendorId = req.user.id;

    const {
      code,
      title,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      expiryDate,
    } = req.body;

    if (!code || !title || !discountType || !discountValue || !minOrderAmount) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Prevent duplicate coupon code for same vendor
    const existingCoupon = await Coupon.findOne({ code, vendor: vendorId });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = await Coupon.create({
      vendor: vendorId,
      code: code.toUpperCase(),
      title,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      expiryDate,
    });

    res.status(201).json({
      message: "Coupon Created Successfully",
      coupon,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔹 UPDATE COUPON
export const updateCoupon = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { couponId } = req.params;

    const coupon = await Coupon.findById(couponId);

    if (!coupon)
      return res.status(404).json({ message: "Coupon not found" });

    if (coupon.vendor.toString() !== vendorId)
      return res.status(403).json({ message: "Unauthorized" });

    if (req.body.code)
      coupon.code = req.body.code.toUpperCase();

    coupon.title = req.body.title || coupon.title;
    coupon.description = req.body.description || coupon.description;
    coupon.discountType = req.body.discountType || coupon.discountType;
    coupon.discountValue = req.body.discountValue || coupon.discountValue;
    coupon.minOrderAmount = req.body.minOrderAmount || coupon.minOrderAmount;
    coupon.maxDiscount = req.body.maxDiscount || coupon.maxDiscount;
    coupon.expiryDate = req.body.expiryDate || coupon.expiryDate;

    await coupon.save();

    res.json({
      message: "Coupon Updated Successfully",
      coupon,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔹 DELETE COUPON
export const deleteCoupon = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { couponId } = req.params;

    const coupon = await Coupon.findById(couponId);

    if (!coupon)
      return res.status(404).json({ message: "Coupon not found" });

    if (coupon.vendor.toString() !== vendorId)
      return res.status(403).json({ message: "Unauthorized" });

    await coupon.deleteOne();

    res.json({ message: "Coupon Deleted Successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔹 GET SINGLE COUPON
export const getSingleCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;

    const coupon = await Coupon.findById(couponId);

    if (!coupon)
      return res.status(404).json({ message: "Coupon not found" });

    res.json(coupon);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔹 GET ALL COUPONS OF VENDOR
export const getVendorCoupons = async (req, res) => {
  try {
    const vendorId = req.user.id;

    const coupons = await Coupon.find({ vendor: vendorId })
      .sort({ createdAt: -1 });

    res.json(coupons);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
