import ExtraGift from "../Models/ExtraGift.js";
import { uploadToCloudinary } from "../Utils/cloudinary.js";
import fs from "fs";


// 🔹 CREATE EXTRA GIFT
export const createExtraGift = async (req, res) => {
  try {
    const vendorId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "Gift image is required" });
    }

    const result = await uploadToCloudinary(req.file.path, "extra-gifts");

    fs.unlinkSync(req.file.path);

    const gift = await ExtraGift.create({
      vendor: vendorId,
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      image: result.url,   // ✅ FIXED
    });

    res.status(201).json({
      message: "Extra Gift Created Successfully",
      gift,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



// 🔹 UPDATE EXTRA GIFT
export const updateExtraGift = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { giftId } = req.params;

    const gift = await ExtraGift.findById(giftId);

    if (!gift)
      return res.status(404).json({ message: "Gift not found" });

    if (gift.vendor.toString() !== vendorId)
      return res.status(403).json({ message: "Unauthorized" });

    // Replace image if new uploaded
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, "extra-gifts");
      fs.unlinkSync(req.file.path);
      
      gift.image = result.url;
    }

    gift.title = req.body.title || gift.title;
    gift.description = req.body.description || gift.description;
    gift.price = req.body.price || gift.price;

    await gift.save();

    res.json({
      message: "Extra Gift Updated Successfully",
      gift,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔹 DELETE EXTRA GIFT
export const deleteExtraGift = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { giftId } = req.params;

    const gift = await ExtraGift.findById(giftId);

    if (!gift)
      return res.status(404).json({ message: "Gift not found" });

    if (gift.vendor.toString() !== vendorId)
      return res.status(403).json({ message: "Unauthorized" });

    await gift.deleteOne();

    res.json({ message: "Extra Gift Deleted Successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔹 GET SINGLE GIFT
export const getSingleGift = async (req, res) => {
  try {
    const { giftId } = req.params;

    const gift = await ExtraGift.findById(giftId);

    if (!gift)
      return res.status(404).json({ message: "Gift not found" });

    res.json(gift);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔹 GET ALL GIFTS OF VENDOR
export const getVendorGifts = async (req, res) => {
  try {
    const vendorId = req.user.id;

    const gifts = await ExtraGift.find({ vendor: vendorId })
      .sort({ createdAt: -1 });

    res.json(gifts);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
