import axiosClient from './axiosClient';

export const ordersAPI = {
  // Create new order
  createOrder: async (orderData) => {
    return await axiosClient.post('/api/orders', orderData);
  },

  // Get user's orders
  getOrders: async () => {
    return await axiosClient.get('/api/orders');
  },

  // Get single order by ID
  getOrder: async (orderId) => {
    return await axiosClient.get(`/api/orders/${orderId}`);
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    return await axiosClient.put(`/api/orders/${orderId}/cancel`);
  },

  // Process payment (for online payments)
  processPayment: async (orderData) => {
    return await axiosClient.post('/api/orders/payment', orderData);
  },

  // Verify payment
  verifyPayment: async (paymentData) => {
    return await axiosClient.post('/api/orders/payment/verify', paymentData);
  },

  // Admin: Get all orders
  getAllOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await axiosClient.get(`/api/admin/orders${queryString ? `?${queryString}` : ''}`);
  },

  // Admin: Update order status
  updateOrderStatus: async (orderId, status) => {
    return await axiosClient.put(`/api/admin/orders/${orderId}/status`, { status });
  },

  // Admin: Update payment status
  updatePaymentStatus: async (orderId, paymentStatus) => {
    return await axiosClient.put(`/api/admin/orders/${orderId}/payment-status`, { paymentStatus });
  },

  // Get order statistics (for admin dashboard)
  getOrderStats: async () => {
    return await axiosClient.get('/api/admin/orders/stats');
  },
};
