const Category = require('../models/category.model');
const Product = require('../models/product.model');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 }).lean();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const trimmedName = name?.trim().toLowerCase();

    if (!trimmedName) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const categoryExists = await Category.findOne({ name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } });
    if (categoryExists) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const category = await Category.create({ name, description });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (name) {
      const trimmedName = name?.trim().toLowerCase();
      const duplicate = await Category.findOne({
        name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
        _id: { $ne: req.params.id },
      });
      if (duplicate) {
        return res.status(400).json({ success: false, message: 'Category name already exists' });
      }
      category.name = trimmedName;
    }

    if (description !== undefined) {
      category.description = description;
    }

    const updatedCategory = await category.save();
    res.json({ success: true, data: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const productsCount = await Product.countDocuments({ category: req.params.id });
    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It is assigned to ${productsCount} product(s).`,
      });
    }

    await Category.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Category removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
