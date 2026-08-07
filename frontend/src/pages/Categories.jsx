import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getCategoriesApi, deleteCategoryApi } from '../services/category.service';
import { useAuth } from '../hooks/useAuth';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import Card from '../components/Card';
import AddModal from '../components/AddModal';
import EditModal from '../components/EditModal';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  FolderPlus, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const Categories = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategoriesApi();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showNotification = (msg, isSuccess = true) => {
    if (isSuccess) {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setError(msg);
      setTimeout(() => setError(null), 5000);
    }
  };

  const confirmDelete = (id) => {
    setCategoryToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    try {
      const res = await deleteCategoryApi(categoryToDelete);
      if (res.success) {
        showNotification('Category deleted successfully!');
        fetchCategories();
      }
    } catch (err) {
      showNotification(err.message || 'Failed to delete category', false);
    } finally {
      setIsDeleteOpen(false);
      setCategoryToDelete(null);
    }
  };

  const openEditModal = (cat) => {
    setCurrentCategory(cat);
    setIsEditOpen(true);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Layout title="Category Management">
      {successMsg && (
        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-sm mb-6 animate-fadeIn">
          <CheckCircle size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center space-x-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-sm mb-6 animate-fadeIn animate-shake">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
          />
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-bold rounded-xl shadow-md transition-all text-sm"
          >
            <Plus size={18} />
            <span>Add Category</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex h-[30vh] items-center justify-center">
          <span className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => (
            <Card key={cat._id}>
              <div>
                <div className="flex items-start justify-between">
                  <h4 className="text-lg font-bold text-slate-800 dark:text-white capitalize">{cat.name}</h4>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed">
                  {cat.description || 'No description provided.'}
                </p>
              </div>

              {isAdmin && (
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-2 text-slate-500 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => confirmDelete(cat._id)}
                    className="p-2 text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-16 flex flex-col items-center justify-center text-slate-400">
          <FolderPlus size={48} className="mb-3 stroke-1" />
          <p className="text-sm">No categories found matching your query</p>
        </div>
      )}

      <AddModal 
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        type="category"
        onSuccess={fetchCategories}
        showNotification={showNotification}
      />

      <EditModal 
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setCurrentCategory(null);
        }}
        type="category"
        data={currentCategory}
        onSuccess={fetchCategories}
        showNotification={showNotification}
      />

      <ConfirmDeleteModal 
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message="Are you sure you want to delete this category? All products associated with this category must be reassigned first."
      />
    </Layout>
  );
};

export default Categories;
