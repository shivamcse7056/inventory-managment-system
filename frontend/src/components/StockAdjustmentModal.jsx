import React, { useState, useEffect } from 'react';
import { X, PlusCircle, MinusCircle, MoveHorizontal } from 'lucide-react';
import { adjustStockApi } from '../services/product.service';

const StockAdjustmentModal = ({ isOpen, onClose, product, onStockAdjusted, showNotification }) => {
  const [stockForm, setStockForm] = useState({
    quantityChanged: '',
    type: 'Stock In',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStockForm({ quantityChanged: '', type: 'Stock In', notes: '' });
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stockForm.quantityChanged || isNaN(stockForm.quantityChanged) || Number(stockForm.quantityChanged) <= 0) {
      showNotification('Please enter a valid, positive quantity', false);
      return;
    }

    setLoading(true);
    try {
      const res = await adjustStockApi(product._id, stockForm);
      if (res.success) {
        showNotification(`Stock adjusted successfully! New Qty: ${res.data.quantity}`);
        onStockAdjusted();
        onClose();
      }
    } catch (err) {
      showNotification(err.message || 'Stock adjustment failed', false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/60 backdrop-blur-sm select-none">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl animate-scaleIn">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Adjust Stock Level</h3>
            <span className="text-xs text-slate-400 font-medium">Product: {product.name} (Current: {product.quantity} qty)</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Adjustment Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Stock In (+)', type: 'Stock In', icon: PlusCircle, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
                { label: 'Stock Out (-)', type: 'Stock Out', icon: MinusCircle, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
                { label: 'Correction', type: 'Adjustment', icon: MoveHorizontal, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' }
              ].map(btn => {
                const Icon = btn.icon;
                const isSelected = stockForm.type === btn.type;
                return (
                  <button
                    key={btn.type}
                    type="button"
                    onClick={() => setStockForm({ ...stockForm, type: btn.type })}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
                      isSelected 
                        ? `${btn.color} ring-2 ring-emerald-500` 
                        : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon size={18} className="mb-1" />
                    <span>{btn.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Quantity Changed</label>
            <input
              type="number"
              required
              min="1"
              value={stockForm.quantityChanged}
              onChange={(e) => setStockForm({ ...stockForm, quantityChanged: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              placeholder="Number of units"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Transaction Notes</label>
            <textarea
              rows="3"
              value={stockForm.notes}
              onChange={(e) => setStockForm({ ...stockForm, notes: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-emerald-500 resize-none"
              placeholder="Reason for stock movement (e.g. Sales, restocking, inventory checks)"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
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
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center min-w-[100px]"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                'Apply Change'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockAdjustmentModal;
