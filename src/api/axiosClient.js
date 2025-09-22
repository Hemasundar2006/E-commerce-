import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://e-commerce-website-backend1-production.up.railway.app';

// Create axios instance
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Include credentials for CORS
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosClient.interceptors.request.use(
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

// Response interceptor for error handling
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle network errors
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.error('Network error: Unable to connect to server');
      return Promise.reject(new Error('Network error: Unable to connect to server. Please check your internet connection and try again.'));
    }
    
    // Handle common HTTP errors
    if (error.response?.status === 401) {
      // Unauthorized - remove token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      // Forbidden
      console.error('Access denied');
    }
    
    if (error.response?.status >= 500) {
      // Server errors
      console.error('Server error occurred');
    }
    
    // Return a more user-friendly error message
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'An unexpected error occurred';
    
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosClient;
