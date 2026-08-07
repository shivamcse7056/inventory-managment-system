const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    sku: {
      type: String,
      required: [true, 'SKU code is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative'],
      default: 0,
    },
    supplierName: {
      type: String,
      required: [true, 'Supplier name is required'],
      trim: true,
      maxlength: [100, "Supplier name cannot exceed 100 characters"],
    },
    status: {
      type: String,
      enum: ['In Stock', 'Low Stock', 'Out of Stock'],
      default: 'Out of Stock',
    },
    imageUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre('save', function (next) {
  if (this.quantity === 0) {
    this.status = 'Out of Stock';
  } else if (this.quantity <= 10) {
    this.status = 'Low Stock';
  } else {
    this.status = 'In Stock';
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
