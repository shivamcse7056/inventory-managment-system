import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { updateProductApi } from '../services/product.service';
import { updateCategoryApi } from '../services/category.service';

const EditModal = ({ isOpen, onClose, type, data, categories = [], onSuccess, showNotification }) => {
  const [productData, setProductData] = useState({
    name: '',
    sku: '',
    category: '',
    supplierName: '',
    unitPrice: '0',
    description: '',
  });

  const [categoryData, setCategoryData] = useState({
    name: '',
    description: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && data) {
      if (type === 'product') {
        setProductData({
          name: data.name || '',
          sku: data.sku || '',
          category: data.category?._id || data.category || '',
          supplierName: data.supplierName || '',
          unitPrice: data.unitPrice !== undefined ? String(data.unitPrice) : '0',
          description: data.description || '',
        });
        setImageFile(null);
      } else if (type === 'category') {
        setCategoryData({
          name: data.name || '',
          description: data.description || '',
        });
      }
    }
  }, [isOpen, data, type]);

  if (!isOpen || !data) return null;

  const handleProductChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setCategoryData({ ...categoryData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === 'product') {
        if (!productData.name || !productData.sku || !productData.category || !productData.supplierName) {
          showNotification('Please fill in all required fields', false);
          setLoading(false);
          return;
        }

        const putData = new FormData();
        putData.append('name', productData.name);
        putData.append('sku', productData.sku);
        putData.append('category', productData.category);
        putData.append('description', productData.description);
        putData.append('unitPrice', productData.unitPrice);
        putData.append('supplierName', productData.supplierName);

        if (imageFile) {
          putData.append('image', imageFile);
        }

        const res = await updateProductApi(data._id, putData);
        if (res.success) {
          showNotification('Product updated successfully!');
          onSuccess();
          onClose();
        }
      } else if (type === 'category') {
        if (!categoryData.name) {
          showNotification('Category name is required', false);
          setLoading(false);
          return;
        }

        const res = await updateCategoryApi(data._id, categoryData);
        if (res.success) {
          showNotification('Category updated successfully!');
          onSuccess();
          onClose();
        }
      }
    } catch (err) {
      showNotification(err.message || 'Failed to update item', false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/60 backdrop-blur-sm select-none">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] animate-scaleIn">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            {type === 'product' ? 'Edit Product' : 'Edit Category'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-left">
          {type === 'product' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={productData.name}
                    onChange={handleProductChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">SKU (Unique) *</label>
                  <input
                    type="text"
                    name="sku"
                    required
                    value={productData.sku}
                    onChange={handleProductChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Category *</label>
                  <select
                    name="category"
                    required
                    value={productData.category}
                    onChange={handleProductChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Supplier Name *</label>
                  <input
                    type="text"
                    name="supplierName"
                    required
                    value={productData.supplierName}
                    onChange={handleProductChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Unit Price ($)</label>
                <input
                  type="number"
                  name="unitPrice"
                  min="0"
                  step="0.01"
                  value={productData.unitPrice}
                  onChange={handleProductChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={productData.description}
                  onChange={handleProductChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Product Image (Leave blank to keep existing)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:file:bg-slate-800 file:text-slate-700 dark:file:text-slate-300 hover:file:bg-slate-200 dark:hover:file:bg-slate-700 cursor-pointer"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Category Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={categoryData.name}
                  onChange={handleCategoryChange}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors text-xs"
                  placeholder="Category Name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={categoryData.description}
                  onChange={handleCategoryChange}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors text-xs resize-none"
                  placeholder="Category Description"
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center min-w-[100px]"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
