import axiosClient from './axiosClient';

export const authAPI = {
  // Login user
  login: async (credentials) => {
    return await axiosClient.post('/api/auth/login', credentials);
  },

  // Register user
  register: async (userData) => {
    return await axiosClient.post('/api/auth/register', userData);
  },

  // Get user profile
  getProfile: async () => {
    return await axiosClient.get('/api/auth/profile');
  },

  // Update user profile
  updateProfile: async (userData) => {
    return await axiosClient.put('/api/auth/profile', userData);
  },

  // Change password
  changePassword: async (passwordData) => {
    return await axiosClient.put('/api/auth/change-password', passwordData);
  },

  // Logout (if needed for server-side logout)
  logout: async () => {
    return await axiosClient.post('/api/auth/logout');
  },
};
