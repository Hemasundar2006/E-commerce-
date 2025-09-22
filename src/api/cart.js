import axiosClient from './axiosClient';

export const cartAPI = {
  // Get user's cart
  getCart: async () => {
    return await axiosClient.get('/api/cart');
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    return await axiosClient.post('/api/cart/add', {
      productId,
      quantity,
    });
  },

  // Update cart item quantity
  updateCartItem: async (productId, quantity) => {
    return await axiosClient.put('/api/cart/update', {
      productId,
      quantity,
    });
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    return await axiosClient.delete(`/api/cart/remove/${productId}`);
  },

  // Clear entire cart
  clearCart: async () => {
    return await axiosClient.delete('/api/cart/clear');
  },

  // Get cart count (number of items)
  getCartCount: async () => {
    return await axiosClient.get('/api/cart/count');
  },
};
