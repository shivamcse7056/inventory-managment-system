import axiosInstance from './axiosInstance';

export const getProductsApi = async (queryParamsString) => {
  return axiosInstance.get(`/products?${queryParamsString}`);
};

export const getProductByIdApi = async (id) => {
  return axiosInstance.get(`/products/${id}`);
};

export const createProductApi = async (productFormData) => {
  return axiosInstance.post('/products', productFormData);
};

export const updateProductApi = async (id, productFormData) => {
  return axiosInstance.put(`/products/${id}`, productFormData);
};

export const deleteProductApi = async (id) => {
  return axiosInstance.delete(`/products/${id}`);
};

export const adjustStockApi = async (id, stockFormData) => {
  return axiosInstance.post(`/products/${id}/adjust-stock`, stockFormData);
};

export const getTransactionLogsApi = async (queryParamsString) => {
  return axiosInstance.get(`/products/transactions/logs?${queryParamsString}`);
};

export const getDashboardStatsApi = async () => {
  return axiosInstance.get('/products/dashboard/stats');
};
