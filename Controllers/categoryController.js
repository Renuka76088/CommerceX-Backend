import { Category, SubCategory } from "../Models/Category.js";

// ✅ Admin creates a category
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ message: "Category name is required" });

    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ message: "Category already exists" });

    const category = await Category.create({
      name,
      description,
      createdBy: req.user.id
    });

    res.status(201).json({ message: "Category created", category });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get single category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update category (Admin only)
export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    if (name) category.name = name;
    if (description) category.description = description;

    await category.save();

    res.json({ message: "Category updated", category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete category (Admin only)
export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    await category.deleteOne();

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// vendor


// ✅ Vendor/Admin creates a category
export const createVendorCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const vendorId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await Category.create({
      name,
      description,
      vendor: vendorId
    });

    res.status(201).json({
      message: "Category created successfully",
      category
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category already exists for this vendor" });
    }

    res.status(500).json({ message: error.message });
  }
};


// ✅ Vendor fetches their categories
export const getVendorCategories = async (req, res) => {
  try {
    const vendorId = req.user.id;

    const categories = await Category
      .find({ vendor: vendorId })
      .sort({ createdAt: -1 });

    res.json(categories);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSubCategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    const vendorId = req.user.id;

    if (!name || !categoryId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check category exists AND belongs to this vendor
    const category = await Category.findOne({
      _id: categoryId,
      vendor: vendorId
    });

    if (!category) {
      return res.status(403).json({
        message: "Category not found or not authorized"
      });
    }

    const subCategory = await SubCategory.create({
      name,
      category: categoryId,
      vendor: vendorId
    });

    res.status(201).json({
      message: "Subcategory created successfully",
      subCategory
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Subcategory already exists in this category"
      });
    }

    res.status(500).json({ message: error.message });
  }
};

export const getVendorSubCategories = async (req, res) => {
  try {
    const vendorId = req.user.id;

    const subCategories = await SubCategory.find({
      vendor: vendorId
    })
    .populate("category", "name")
    .sort({ createdAt: -1 });

    res.json(subCategories);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
