import React from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { API_URL } from '../services/axiosInstance';

const ProductDetailsModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  const getProductImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_URL.replace('/api', '')}${url}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/60 backdrop-blur-sm select-none">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[85vh] animate-scaleIn text-left">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Product Catalog Details</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex flex-col items-center space-y-4 shrink-0">
            <div className="w-36 h-36 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
              {product.imageUrl ? (
                <img src={getProductImageUrl(product.imageUrl)} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={36} className="text-slate-400" />
              )}
            </div>

            <div className="flex flex-col items-center p-3 bg-white border border-slate-100 rounded-xl">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${product.sku}`} 
                alt="Product SKU QR Code" 
                className="w-24 h-24"
              />
              <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase mt-1">SKU Barcode</span>
            </div>
          </div>

          <div className="flex-1 space-y-3.5">
            <div>
              <h4 className="text-xl font-bold text-slate-800 dark:text-white capitalize">{product.name}</h4>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">SKU: <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300">{product.sku}</code></p>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Stock status</span>
                <p className={`text-xs font-extrabold mt-0.5 ${
                  product.status === 'In Stock' ? 'text-emerald-500' :
                  product.status === 'Low Stock' ? 'text-amber-500' : 'text-rose-500'
                }`}>{product.status}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Category</span>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5 capitalize">{product.category?.name || 'N/A'}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Unit price</span>
                <p className="text-xs font-extrabold text-slate-800 dark:text-white mt-0.5">${product.unitPrice.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total stock</span>
                <p className="text-xs font-extrabold text-slate-800 dark:text-white mt-0.5">{product.quantity} units</p>
              </div>
            </div>

            <div className="text-xs">
              <span className="block font-bold text-slate-400 uppercase mb-1">Product Description</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-h-[100px] overflow-y-auto pr-1">
                {product.description || 'No description provided for this product.'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Close details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
