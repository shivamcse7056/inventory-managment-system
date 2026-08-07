const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock,
  getTransactions,
  getDashboardStats,
} = require('../controllers/product.controller');
const { protect, admin } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');

router.use(protect);

router.get('/dashboard/stats', getDashboardStats);
router.get('/transactions/logs', getTransactions);

router.route('/')
  .get(getProducts)
  .post(admin, upload.single('image'), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(admin, upload.single('image'), updateProduct)
  .delete(admin, deleteProduct);

router.post('/:id/adjust-stock', admin, adjustStock);

module.exports = router;
