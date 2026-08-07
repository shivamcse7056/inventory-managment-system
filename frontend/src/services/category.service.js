import axiosInstance from './axiosInstance';

export const getCategoriesApi = async () => {
  return axiosInstance.get('/categories');
};

export const createCategoryApi = async (categoryData) => {
  return axiosInstance.post('/categories', categoryData);
};

export const updateCategoryApi = async (id, categoryData) => {
  return axiosInstance.put(`/categories/${id}`, categoryData);
};

export const deleteCategoryApi = async (id) => {
  return axiosInstance.delete(`/categories/${id}`);
};
