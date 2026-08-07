import React from 'react';
import { X, Trash2 } from 'lucide-react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title = "Confirm Delete", message = "Are you sure you want to delete this item? This action cannot be undone." }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-950/65 backdrop-blur-sm select-none">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl animate-scaleIn text-left">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2 text-rose-500">
            <Trash2 size={18} />
            <h3 className="text-base font-bold dark:text-white">{title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="mt-6 flex justify-end space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
