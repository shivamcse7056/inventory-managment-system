const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    type: {
      type: String,
      enum: ['Stock In', 'Stock Out', 'Adjustment'],
      required: true,
    },
    quantityChanged: {
      type: Number,
      required: true,
    },
    previousQuantity: {
      type: Number,
      required: true,
    },
    newQuantity: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [250, "Notes cannot exceed 250 characters"],
      default: "",
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
