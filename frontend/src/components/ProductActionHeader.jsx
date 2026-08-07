import React from 'react';
import { Search, Plus } from 'lucide-react';

const ProductActionHeader = ({
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  categories,
  isAdmin,
  onAddClick,
  onSubmitSearch,
  setPage
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 select-none">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <form onSubmit={onSubmitSearch} className="relative w-full lg:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-24 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
          />
          <button 
            type="submit"
            className="absolute right-2 top-2 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-bold rounded-lg text-xs transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex items-center justify-end space-x-3 w-full lg:w-auto shrink-0">
          {isAdmin && (
            <button
              onClick={onAddClick}
              className="flex items-center space-x-1.5 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md w-full sm:w-auto justify-center"
            >
              <Plus size={18} />
              <span>Add Product</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Category Filter</label>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Stock Status</label>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Sort Field</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="createdAt">Date Created</option>
            <option value="name">Product Name</option>
            <option value="quantity">Stock Quantity</option>
            <option value="unitPrice">Unit Price</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Sort Direction</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductActionHeader;
