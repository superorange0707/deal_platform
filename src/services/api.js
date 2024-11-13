import axios from 'axios';
import { notification } from 'antd';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    if (response) {
      // Handle different error status codes
      switch (response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
          notification.error({
            message: 'Session Expired',
            description: 'Please login again.',
          });
          break;

        case 403:
          notification.error({
            message: 'Access Denied',
            description: 'You do not have permission to perform this action.',
          });
          break;

        case 404:
          notification.error({
            message: 'Not Found',
            description: 'The requested resource was not found.',
          });
          break;

        case 500:
          notification.error({
            message: 'Server Error',
            description: 'Something went wrong on our end. Please try again later.',
          });
          break;

        default:
          notification.error({
            message: 'Error',
            description: response.data?.message || 'Something went wrong.',
          });
      }
    } else {
      // Network error or server not responding
      notification.error({
        message: 'Network Error',
        description: 'Please check your internet connection and try again.',
      });
    }

    return Promise.reject(error);
  }
);

// API methods
const methods = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data, config = {}) => api.post(url, data, config),
  put: (url, data, config = {}) => api.put(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
  patch: (url, data, config = {}) => api.patch(url, data, config),
};

export default methods; 