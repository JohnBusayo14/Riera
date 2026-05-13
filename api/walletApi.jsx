import apiClient from '../services/apiClient';

/**
 * Wallet API Service
 * Handles all financial transactions and balance checks.
 * Note: All currency calculations are performed on the backend [cite: 2026-01-09].
 */
const walletApi = {
  
  /**
   * Get lightweight balance
   * Maps to: [HttpGet("balance")]
   * Expected response: { balance: 5000.00 }
   */
  getBalance: async () => {
    const response = await apiClient.get('/wallet/balance');
    return response.data;
  },

  /**
   * Get full wallet overview (Balance + recent transactions)
   * Maps to: [HttpGet] GetWallet()
   */
  getWallet: async () => {
    const response = await apiClient.get('/wallet');
    return response.data;
  },

  /**
   * Get transaction history
   * Maps to: [HttpGet("transactions")]
   */
  getTransactions: async () => {
    const response = await apiClient.get('/wallet/transactions');
    return response.data;
  },

  post: async (url, data) => {
    return await apiClient.post(url, data);
  },

  /**
   * Initialize Ozow payment
   * Maps to: [HttpPost("ozow/initialize")]
   * @param {object} payload - { Amount, Method: 'OZOW' }
   */
  initializeOzowPayment: async (payload) => {
    // Uses PascalCase to match FundWalletRequest DTO [cite: 2026-01-23]
    const response = await apiClient.post('/wallet/ozow/initialize', payload);
    return response.data;
  },
  /**
   * Initialize Paystack payment
   * Logic: Sends raw Naira amount. Backend converts to Kobo.
   * Maps to: [HttpPost("paystack/initialize")]
   * @param {object} params
   * @param {number} params.amount - The amount in Naira
   * @param {string} [params.method='CARD']
   */
// src/api/walletApi.js
initializePaystackPayment: async (payload) => {
  // payload should already be { Amount, Method }
  const response = await apiClient.post('/wallet/paystack/initialize', payload);
  return response.data;
},

  /**
   * Verify Paystack payment
   * Logic: Backend checks status and credits user balance if successful.
   * Maps to: [HttpPost("paystack/verify")]
   * @param {object} params
   * @param {string} params.reference - Paystack transaction reference
   */
  // src/api/walletApi.js

verifyPayment: async ({ reference }) => {
  try {
    // We must use 'Reference' with a capital 'R' to match the 
    // C# VerifyPaymentRequest class.
    const response = await apiClient.post('/wallet/paystack/verify', { 
      Reference: reference.trim() // Added .trim() to prevent whitespace errors
    });
    return response.data; 
  } catch (error) {
    // Log the actual error message from the backend for easier debugging
    console.error("Verification Backend Message:", error.response?.data?.message);
    throw error;
  }
},

  /**
   * Debit wallet
   * Logic: Deducts funds for Marketplace orders.
   * Maps to: [HttpPost("debit")]
   * @param {object} params
   * @param {number} params.amount
   * @param {string} params.description
   */
  debitWallet: async ({ amount, description }) => {
    // Uses PascalCase to match 'public class DebitWalletRequest'
    const response = await apiClient.post('/wallet/debit', { 
      Amount: amount, 
      Description: description 
    });
    return response.data;
  },

  /**
   * Request a Manual Bank Transfer Verification
   * Maps to: [HttpPost("manual-transfer")]
   */
  notifyManualTransfer: async (transferData) => {
    const response = await apiClient.post('/wallet/manual-transfer', transferData);
    return response.data;
  }
};

export { walletApi };