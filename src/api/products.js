import axiosClient from './axiosClient';

export const productsAPI = {
  // Get all products with optional filters
  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await axiosClient.get(`/api/products${queryString ? `?${queryString}` : ''}`);
  },

  // Get single product by ID
  getProduct: async (id) => {
    return await axiosClient.get(`/api/products/${id}`);
  },

  // Search products
  searchProducts: async (query) => {
    return await axiosClient.get(`/api/products/search?q=${encodeURIComponent(query)}`);
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    return await axiosClient.get(`/api/products/category/${category}`);
  },

  // Get product categories
  getCategories: async () => {
    return await axiosClient.get('/api/products/categories');
  },

  // Add product review
  addReview: async (productId, reviewData) => {
    return await axiosClient.post(`/api/products/${productId}/reviews`, reviewData);
  },

  // Get product reviews
  getReviews: async (productId) => {
    return await axiosClient.get(`/api/products/${productId}/reviews`);
  },

  // Admin: Create product
  createProduct: async (productData) => {
    return await axiosClient.post('/api/admin/products', productData);
  },

  // Admin: Update product
  updateProduct: async (id, productData) => {
    return await axiosClient.put(`/api/admin/products/${id}`, productData);
  },

  // Admin: Delete product
  deleteProduct: async (id) => {
    return await axiosClient.delete(`/api/admin/products/${id}`);
  },

  // Admin: Upload product images
  uploadProductImages: async (productId, formData) => {
    return await axiosClient.post(`/api/admin/products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
