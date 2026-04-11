import axios from 'axios';
import { firebaseAuth } from './firebase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Firebase auth token
api.interceptors.request.use(
  async (config) => {
    const token = await firebaseAuth.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, logout
      await firebaseAuth.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/api/auth/signup', data),
  getProfile: () => api.get('/api/auth/me'),
};

// Products APIs
export const productsAPI = {
  getAll: (params) => api.get('/api/products', { params }),
  getById: (id) => api.get(`/api/products/${id}`),
  create: (data) => api.post('/api/products', data),
  update: (id, data) => api.put(`/api/products/${id}`, data),
  delete: (id) => api.delete(`/api/products/${id}`),
  getUserProducts: (userId) => api.get(`/api/products/user/${userId}`),
};

// Users APIs
export const usersAPI = {
  getById: (id) => api.get(`/api/users/${id}`),
  update: (data) => api.put(`/api/users/me`, data),
};

// Chats APIs
export const chatsAPI = {
  getAll: () => api.get('/api/chats'),
  getById: (id) => api.get(`/api/chats/${id}`),
  create: (data) => api.post('/api/chats', data),
  getMessages: (chatId) => api.get(`/api/chats/${chatId}/messages`),
  sendMessage: (chatId, data) => api.post(`/api/chats/${chatId}/messages`, data),
};

// NeedBoard APIs
export const needBoardAPI = {
  getAll: (params) => api.get('/api/needboard', { params }),
  create: (data) => api.post('/api/needboard', data),
  addResponse: (id, data) => api.post(`/api/needboard/${id}/responses`, data),
};

// Analytics APIs
export const analyticsAPI = {
  getDashboard: () => api.get('/api/analytics/dashboard'),
};

export default api;
