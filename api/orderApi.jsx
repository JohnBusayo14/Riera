
// src/api/orderApi.js
import apiClient from '../services/apiClient';

/**
 * orderApi service for handling all order-related transactions.
 * Includes Logistics (Local/International) and Marketplace (Agro) orders.
 * [2026-01-09] Backend handles all cost and weight calculations.
 */
export const orderApi = {
  
  /**
   * POST: api/orders/agro
   * Primary endpoint for placing orders from the Agro Marketplace.
   */
  createAgroOrder: async (orderData) => {
    const response = await apiClient.post('/orders/agro', orderData);
    return response.data;
  },

  /**
   * POST: api/orders/agro/checkout
   * Validates a cart and prepares it for payment/processing via the wallet.
   */
  checkoutAgroOrder: async (checkoutData) => {
    const response = await apiClient.post('/orders/agro/checkout', checkoutData);
    return response.data;
  },

  /**
   * GET: api/orders/marketplace/history
   * Retrieves the history of all marketplace-specific purchases.
   */
  getMarketplaceHistory: async () => {
    const response = await apiClient.get('/orders/marketplace/history');
    return response.data;
  },

  /**
   * POST: api/orders/quote
   * Fetches a live shipping/logistics quote based on GPS and weights.
   */
 // src/api/orderApi.js refined getQuote
getQuote: async (payload) => {
  try {
    // If we are sending a marketplace cart, 'weight' might be inside 'items'
    // but the API might still want a top-level 'weight' string for logistics compatibility.
    const sanitizedPayload = {
      ...payload,
      // Ensure top-level weight is a string if it exists
      weight: payload.weight ? String(payload.weight) : "0", 
    };
    
    // Crucial: Use the path exactly as defined in your backend
    const response = await apiClient.post('/orders/quote', sanitizedPayload);
    return response.data;
  } catch (error) {
    // Log the actual error response from the server to see what's missing
    console.error("Backend Error Detail:", error.response?.data);
    throw error;
  }
},

  /**
   * POST: api/orders/local
   * Creates a local logistics order.
   * Note: Quantity parameter removed to handle calculations on backend.
   */
  createLocalOrder: async (orderData) => {
    // Explicitly remove 'quantity' to prevent backend DTO validation errors
    const { quantity, ...cleanedData } = orderData;
    const response = await apiClient.post('/orders/local', cleanedData);
    return response.data;
  },

  /**
   * POST: api/orders/international
   * Creates an international export order.
   */
  createInternationalOrder: async (orderData) => {
    const response = await apiClient.post('/orders/international', orderData);
    return response.data;
  },

  /**
   * GET: api/orders/my-orders
   * Retrieves all orders (Local, Intl, Agro) belonging to the current user.
   */
  getMyOrders: async () => {
    const response = await apiClient.get('/orders/my-orders');
    return response.data;
  },

  /**
   * GET: api/orders/{id}
   * Fetches full details for a single order by its ID.
   */
  getOrderDetails: async (id) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  /**
   * POST: api/orders/{id}/status
   * Updates the status of an order (e.g., Pending to InTransit).
   */
  updateOrderStatus: async (id, statusPayload) => {
    const response = await apiClient.post(`/orders/${id}/status`, statusPayload);
    return response.data;
  },

  /**
   * POST: api/orders/{id}/cancel
   * Allows the sender to cancel an order before it is processed.
   */
  cancelOrder: async (id) => {
    const response = await apiClient.post(`/orders/${id}/cancel`);
    return response.data;
  }
};

export default orderApi;