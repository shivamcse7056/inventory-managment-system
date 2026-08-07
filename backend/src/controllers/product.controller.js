const Product = require('../models/product.model');
const Category = require('../models/category.model');
const Transaction = require('../models/transaction.model');
const { uploadToCloudinary } = require('../middleware/upload.middleware');

const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, category, status, sortBy, sortOrder } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }
    if (status) {
      query.status = status;
    }

    let sort = {};
    if (sortBy) {
      const order = sortOrder === 'desc' ? -1 : 1;
      sort[sortBy] = order;
    } else {
      sort['createdAt'] = -1; 
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, sku, category, description, quantity, unitPrice, supplierName } = req.body;

    if (!name || !sku || !category || !supplierName) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ success: false, message: 'Invalid category specified' });
    }

    const skuExists = await Product.findOne({ sku: sku.toUpperCase() });
    if (skuExists) {
      return res.status(400).json({ success: false, message: 'SKU code already exists' });
    }

    let imageUrl = '';
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      imageUrl = uploadResult.secure_url;
    }

    const product = new Product({
      name,
      sku: sku.toUpperCase(),
      category,
      description,
      quantity: quantity ? Number(quantity) : 0,
      unitPrice: unitPrice ? Number(unitPrice) : 0,
      supplierName,
      imageUrl,
    });

    const savedProduct = await product.save();

    if (product.quantity > 0) {
      await Transaction.create({
        product: savedProduct._id,
        type: 'Stock In',
        quantityChanged: product.quantity,
        previousQuantity: 0,
        newQuantity: product.quantity,
        notes: 'Initial stock load on product creation',
        performedBy: req.user._id,
      });
    }

    res.status(201).json({ success: true, data: savedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const updateProduct = async (req, res) => {
  try {
    const { name, sku, category, description, unitPrice, supplierName } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (sku && sku.toUpperCase() !== product.sku) {
      const skuExists = await Product.findOne({ sku: sku.toUpperCase() });
      if (skuExists) {
        return res.status(400).json({ success: false, message: 'SKU code already exists' });
      }
      product.sku = sku.toUpperCase();
    }

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ success: false, message: 'Invalid category specified' });
      }
      product.category = category;
    }

    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (unitPrice !== undefined) {
      if (Number(unitPrice) < 0) {
        return res.status(400).json({ success: false, message: 'Unit price cannot be negative' });
      }
      product.unitPrice = Number(unitPrice);
    }
    if (supplierName) product.supplierName = supplierName;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      product.imageUrl = uploadResult.secure_url;
    }

    const updatedProduct = await product.save();
    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Transaction.deleteMany({ product: req.params.id });

    await Product.deleteOne({ _id: req.params.id });

    res.json({ success: true, message: 'Product and transaction logs deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const adjustStock = async (req, res) => {
  try {
    const { quantityChanged, type, notes } = req.body;

    if (!quantityChanged || isNaN(quantityChanged) || Number(quantityChanged) <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid, positive quantity change value' });
    }

    if (!type || !['Stock In', 'Stock Out', 'Adjustment'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid transaction type' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const previousQuantity = product.quantity;
    let newQuantity = previousQuantity;

    const change = Number(quantityChanged);
    if (type === 'Stock In') {
      newQuantity += change;
    } else if (type === 'Stock Out') {
      newQuantity -= change;
    } else if (type === 'Adjustment') {
      newQuantity += change;
    }

    if (newQuantity < 0) {
      return res.status(400).json({ success: false, message: 'Transaction would result in negative stock quantity' });
    }

    product.quantity = newQuantity;
    const updatedProduct = await product.save();

    const transaction = await Transaction.create({
      product: product._id,
      type,
      quantityChanged: change * (type === 'Stock Out' ? -1 : 1),
      previousQuantity,
      newQuantity,
      notes: notes || `Stock manually adjusted via ${type}`,
      performedBy: req.user._id,
    });

    res.json({
      success: true,
      data: updatedProduct,
      transaction,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.product) {
      query.product = req.query.product;
    }

    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .populate('product', 'name sku')
      .populate('performedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({});
    const totalCategories = await Category.countDocuments({});

    const stockStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: '$quantity' },
        },
      },
    ]);
    const totalStockQuantity = stockStats.length > 0 ? stockStats[0].totalQuantity : 0;

    const lowStockItems = await Product.countDocuments({ status: 'Low Stock' });
    const outOfStockItems = await Product.countDocuments({ status: 'Out of Stock' });

    const categoryDistribution = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $unwind: '$categoryDetails',
      },
      {
        $project: {
          _id: 1,
          name: '$categoryDetails.name',
          count: 1,
          totalQuantity: 1,
        },
      },
    ]);

    const recentActivities = await Transaction.find({})
      .populate('product', 'name sku')
      .populate('performedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalProducts,
        totalCategories,
        totalStockQuantity,
        lowStockItems,
        outOfStockItems,
        categoryDistribution,
        recentActivities,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock,
  getTransactions,
  getDashboardStats,
};
