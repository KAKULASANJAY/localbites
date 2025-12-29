import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  updatePassword: (data) => api.put('/auth/password', data)
};

// Restaurant API
export const restaurantAPI = {
  getAll: (params) => api.get('/restaurants', { params }),
  getById: (id) => api.get(`/restaurants/${id}`),
  create: (data) => api.post('/restaurants', data),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  toggleStatus: (id) => api.put(`/restaurants/${id}/toggle-status`),
  getMyRestaurant: () => api.get('/restaurants/owner/my-restaurant')
};

// Food API
export const foodAPI = {
  getByRestaurant: (restaurantId, params) => api.get(`/foods/restaurant/${restaurantId}`, { params }),
  getById: (id) => api.get(`/foods/${id}`),
  create: (data) => api.post('/foods', data),
  update: (id, data) => api.put(`/foods/${id}`, data),
  delete: (id) => api.delete(`/foods/${id}`),
  toggleAvailability: (id) => api.put(`/foods/${id}/toggle-availability`)
};

// Order API
export const orderAPI = {
  place: (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
  getRestaurantOrders: (params) => api.get('/orders/restaurant', { params }),
  updateStatus: (id, status, reason) => api.put(`/orders/${id}/status`, { status, reason })
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getRestaurants: (params) => api.get('/admin/restaurants', { params }),
  approveRestaurant: (id, data) => api.put(`/admin/restaurants/${id}/approve`, data),
  updateCommission: (id, percentage) => api.put(`/admin/restaurants/${id}/commission`, { commissionPercentage: percentage }),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUserActive: (id) => api.put(`/admin/users/${id}/toggle-active`),
  getOrders: (params) => api.get('/admin/orders', { params })
};
