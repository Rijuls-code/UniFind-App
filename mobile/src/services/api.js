import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.2.2:8000/api'; // Android emulator → localhost
// For physical device, replace with your machine's local IP e.g. 'http://192.168.1.x:8000/api'

const getToken = async () => {
  try {
    return await AsyncStorage.getItem('auth_token');
  } catch {
    return null;
  }
};

const request = async (method, path, body = null) => {
  const token = await getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_URL}${path}`, options);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Request failed');
  }
  return response.json();
};

export const authAPI = {
  signup: (data) => request('POST', '/auth/signup', data),
  getProfile: () => request('GET', '/auth/me'),
};

export const productsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request('GET', `/products${query ? '?' + query : ''}`);
  },
  getById: (id) => request('GET', `/products/${id}`),
  create: (data) => request('POST', '/products', data),
  update: (id, data) => request('PUT', `/products/${id}`, data),
  delete: (id) => request('DELETE', `/products/${id}`),
  getUserProducts: (userId) => request('GET', `/products/user/${userId}`),
};

export const usersAPI = {
  getById: (id) => request('GET', `/users/${id}`),
  update: (data) => request('PUT', '/users/me', data),
};

export const chatsAPI = {
  getAll: () => request('GET', '/chats'),
  create: (data) => request('POST', '/chats', data),
  getMessages: (chatId) => request('GET', `/chats/${chatId}/messages`),
  sendMessage: (chatId, data) => request('POST', `/chats/${chatId}/messages`, data),
};

export const needBoardAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request('GET', `/needboard${query ? '?' + query : ''}`);
  },
  create: (data) => request('POST', '/needboard', data),
};

export const analyticsAPI = {
  getDashboard: () => request('GET', '/analytics/dashboard'),
};
