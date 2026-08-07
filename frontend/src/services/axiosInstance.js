import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed && parsed.token) {
        config.headers['Authorization'] = `Bearer ${parsed.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

   
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh') &&
      !originalRequest.url.includes('/auth/login')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (refreshResponse.data && refreshResponse.data.success) {
          const newAccessToken = refreshResponse.data.data.token;
          const user = localStorage.getItem('user');
          if (user) {
            const parsed = JSON.parse(user);
            parsed.token = newAccessToken;
            localStorage.setItem('user', JSON.stringify(parsed));
          }

          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);
          isRefreshing = false;

          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    const errMessage = error.response?.data?.message || error.message || 'API request failed';
    return Promise.reject(new Error(errMessage));
  }
);

export default axiosInstance;
