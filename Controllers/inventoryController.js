import Inventory from "../Models/Inventory.js";
import Product from "../Models/Product.js";


// 🔹 CREATE INVENTORY
export const createInventory = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { productId } = req.params;
    const { totalStock, lowStockAlert } = req.body;

    const product = await Product.findById(productId);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    if (product.vendor.toString() !== vendorId)
      return res.status(403).json({ message: "Unauthorized" });

    const alreadyExists = await Inventory.findOne({ product: productId });
    if (alreadyExists)
      return res.status(400).json({ message: "Inventory already exists" });

    const inventory = await Inventory.create({
      product: productId,
      vendor: vendorId,
      totalStock,
      availableStock: totalStock,
      lowStockAlert: lowStockAlert || 5,
    });

    res.status(201).json(inventory);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔹 UPDATE STOCK
export const updateStock = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { productId } = req.params;
    const { totalStock } = req.body;

    const inventory = await Inventory.findOne({ product: productId });

    if (!inventory)
      return res.status(404).json({ message: "Inventory not found" });

    if (inventory.vendor.toString() !== vendorId)
      return res.status(403).json({ message: "Unauthorized" });

    inventory.totalStock = totalStock;
    inventory.availableStock = totalStock - inventory.soldStock;

    // Auto status update
    if (inventory.availableStock === 0) {
      inventory.status = "out_of_stock";
    } else if (inventory.availableStock <= inventory.lowStockAlert) {
      inventory.status = "low_stock";
    } else {
      inventory.status = "in_stock";
    }

    await inventory.save();

    res.json(inventory);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔹 GET VENDOR INVENTORY
export const getVendorInventory = async (req, res) => {
  try {
    const vendorId = req.user.id;

    const inventory = await Inventory.find({ vendor: vendorId })
      .populate("product", "title currentPrice images");

    res.json(inventory);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔹 GET SINGLE INVENTORY
export const getSingleInventory = async (req, res) => {
  try {
    const { productId } = req.params;

    const inventory = await Inventory.findOne({ product: productId })
      .populate("product");

    if (!inventory)
      return res.status(404).json({ message: "Inventory not found" });

    res.json(inventory);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔹 DELETE INVENTORY
export const deleteInventory = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { productId } = req.params;

    const inventory = await Inventory.findOne({ product: productId });

    if (!inventory)
      return res.status(404).json({ message: "Inventory not found" });

    if (inventory.vendor.toString() !== vendorId)
      return res.status(403).json({ message: "Unauthorized" });

    await inventory.deleteOne();

    res.json({ message: "Inventory deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
