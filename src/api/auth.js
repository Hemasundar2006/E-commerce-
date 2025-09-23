import axiosClient from './axiosClient';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://e-commerce-website-backend1-production.up.railway.app';

export const authAPI = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Store token and user data
      if (data.token) localStorage.setItem('token', data.token);
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check your internet connection and try again.');
      }
      throw error;
    }
  },

  // Register user - Updated version
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // This is equivalent to withCredentials: true in axios
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Store token and user data
      if (data.token) localStorage.setItem('token', data.token);
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check your internet connection and try again.');
      }
      console.error("Registration failed:", error);
      throw error;
    }
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

// For backward compatibility, export individual functions
export const registerUser = authAPI.register;

// Alternative axios version
export const registerUser = async (userData) => {
  try {
    const response = await axiosClient.post('/api/auth/register', userData);
    
    // Store token and user data if provided
    if (response.data.token) localStorage.setItem('token', response.data.token);
    if (response.data.user) localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};
