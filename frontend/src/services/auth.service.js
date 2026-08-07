import axiosInstance from './axiosInstance';

export const loginApi = async (email, password) => {
  return axiosInstance.post('/auth/login', { email, password });
};

export const registerApi = async (name, email, password, role) => {
  return axiosInstance.post('/auth/register', { name, email, password, role });
};

export const logoutApi = async () => {
  return axiosInstance.post('/auth/logout');
};

export const getProfileApi = async () => {
  return axiosInstance.get('/auth/profile');
};
