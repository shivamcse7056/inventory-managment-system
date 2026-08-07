import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { API_URL } from '../services/axiosInstance';
import { useAuth } from '../hooks/useAuth';
import { getCategoriesApi } from '../services/category.service';
import { getProductsApi, deleteProductApi } from '../services/product.service';
import { 
  Edit2, 
  Trash2, 
  Eye, 
  MoveHorizontal,
  Image as ImageIcon,
  FolderOpen,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import AddModal from '../components/AddModal';
import EditModal from '../components/EditModal';
import ProductDetailsModal from '../components/ProductDetailsModal';
import StockAdjustmentModal from '../components/StockAdjustmentModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import ProductActionHeader from '../components/ProductActionHeader';

const getProductImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `${API_URL.replace('/api', '')}${url}`;
};

const Products = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [activeProduct, setActiveProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const showNotification = (msg, isSuccess = true) => {
    if (isSuccess) {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setError(msg);
      setTimeout(() => setError(null), 5000);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategoriesApi();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: 8,
        search,
        category: categoryFilter,
        status: statusFilter,
        sortBy,
        sortOrder,
      });
      const res = await getProductsApi(queryParams.toString());
      if (res.success) {
        setProducts(res.data);
        setTotalPages(res.pagination.pages);
      }
    } catch (err) {
      showNotification(err.message || 'Failed to fetch products', false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, categoryFilter, statusFilter, sortBy, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const confirmDelete = (id) => {
    setProductToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      const res = await deleteProductApi(productToDelete);
      if (res.success) {
        showNotification('Product deleted successfully!');
        fetchProducts();
      }
    } catch (err) {
      showNotification(err.message || 'Failed to delete product', false);
    } finally {
      setIsDeleteOpen(false);
      setProductToDelete(null);
    }
  };

  const openDetail = (product) => {
    setActiveProduct(product);
    setIsDetailOpen(true);
  };

  const openStock = (product) => {
    setActiveProduct(product);
    setIsStockOpen(true);
  };

  const openEdit = (product) => {
    setActiveProduct(product);
    setIsEditOpen(true);
  };

  return (
    <Layout title="Product Inventory">
      {successMsg && (
        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4.5 rounded-xl text-sm mb-6 animate-fadeIn">
          <CheckCircle size={18} className="shrink-0" />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4.5 rounded-xl text-sm mb-6 animate-fadeIn animate-shake">
          <AlertCircle size={18} className="shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <ProductActionHeader 
        search={search}
        setSearch={setSearch}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        categories={categories}
        isAdmin={isAdmin}
        onAddClick={() => setIsAddOpen(true)}
        onSubmitSearch={handleSearchSubmit}
        setPage={setPage}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden select-none">
        {loading ? (
          <div className="flex h-[40vh] items-center justify-center">
            <span className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-950/20">
                  <th className="px-6 py-4">Product details</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Unit Price</th>
                  <th className="px-6 py-4">Current Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {products.map((p) => (
                  <tr key={p._id} className="text-slate-600 dark:text-slate-300 hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors">
                    <td className="px-6 py-4.5">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                          {p.imageUrl ? (
                            <img src={getProductImageUrl(p.imageUrl)} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={18} className="text-slate-400" />
                          )}
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-slate-800 dark:text-white truncate max-w-[200px]" title={p.name}>
                            {p.name}
                          </p>
                          <span className="text-[10px] text-slate-400 font-medium block mt-0.5 truncate max-w-[150px]">{p.supplierName}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4.5 font-medium">
                      <code className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md text-xs font-semibold">
                        {p.sku}
                      </code>
                    </td>

                    <td className="px-6 py-4.5 font-medium capitalize text-slate-500 dark:text-slate-400">
                      {p.category?.name || 'Unassigned'}
                    </td>

                    <td className="px-6 py-4.5 font-bold text-slate-800 dark:text-white">
                      ${p.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="w-32">
                        <div className="flex items-center justify-between mb-1.5 font-semibold text-md">
                          <span className="text-slate-700 dark:text-slate-300">{p.quantity} units</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        p.status === 'In Stock' ? 'bg-emerald-500/10 text-emerald-500' :
                        p.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-rose-500/10 text-rose-500'
                      }`}>
                        {p.status}
                      </span>
                    </td>

                    <td className="px-6 py-4.5 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => openDetail(p)}
                          className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="View QR & Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => openStock(p)}
                          className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Adjust Stock"
                        >
                          <MoveHorizontal size={15} />
                        </button>
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => openEdit(p)}
                              className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                              title="Edit Product"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => confirmDelete(p._id)}
                              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <FolderOpen size={52} className="mb-3 stroke-1" />
            <p className="text-sm">No products found matching your search</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-6 py-4">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl text-xs font-semibold transition-colors"
            >
              Previous
            </button>
            <span className="text-xs text-slate-400 font-semibold">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl text-xs font-semibold transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <AddModal 
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        type="product"
        categories={categories}
        onSuccess={fetchProducts}
        showNotification={showNotification}
      />

      <EditModal 
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setActiveProduct(null);
        }}
        type="product"
        data={activeProduct}
        categories={categories}
        onSuccess={fetchProducts}
        showNotification={showNotification}
      />

      <StockAdjustmentModal 
        isOpen={isStockOpen}
        onClose={() => {
          setIsStockOpen(false);
          setActiveProduct(null);
        }}
        product={activeProduct}
        onStockAdjusted={fetchProducts}
        showNotification={showNotification}
      />

      <ProductDetailsModal 
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setActiveProduct(null);
        }}
        product={activeProduct}
      />

      <ConfirmDeleteModal 
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message="Are you sure you want to delete this product? All transaction history and log entries for this item will be permanently removed."
      />
    </Layout>
  );
};

export default Products;
