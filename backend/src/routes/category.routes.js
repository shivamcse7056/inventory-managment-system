const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
  .get(getCategories)
  .post(admin, createCategory);

router.route('/:id')
  .put(admin, updateCategory)
  .delete(admin, deleteCategory);

module.exports = router;
