// src/api/authApi.js

import apiClient from '../services/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authApi = {
  /**
   * Register a new user
   */
  register: async (payload) => {
    try {
      const response = await apiClient.post('/auth/register', payload);
      return response?.data; 
    } catch (error) {
      const errorMessage = error.response?.data?.Message || error.message || "";
      console.error("Registration Error:", errorMessage);
      throw error;
    }
  },

  /**
   * Login with email and password
   */
  login: async (payload) => {
    const response = await apiClient.post('/auth/login', payload);
    return response.data; 
  },

  /**
   * Get current authenticated user profile
   */
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data; 
  },

  /**
   * Update user profile
   */
  updateProfile: async ({ name, email, phone }) => {
    const response = await apiClient.put('/auth/profile', {
      name: name?.trim(),
      email: email?.trim().toLowerCase(),
      phone,
    });
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async ({ oldPassword, newPassword, confirmNewPassword }) => {
    const response = await apiClient.post('/auth/change-password', {
      oldPassword,
      newPassword,
      confirmNewPassword,
    });
    return response.data;
  },

  /**
   * Save device token for push notifications (FCM)
   */
  saveDeviceToken: async (deviceToken) => {
    await apiClient.post('/auth/device-token', {
      deviceToken,
    });
  },

  /**
   * Server-side logout and clear local storage
   */
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('Server logout failed, proceeding with local logout');
    } finally {
      await AsyncStorage.multiRemove(['token', 'user']);
    }
  },

  /**
   * STEP 1: Request Reset Code
   * Logic: Backend generates code and sends SMTP email.
   * Added a longer timeout specifically for this call.
   */
  forgotPassword: async (email) => {
    return await apiClient.post('/auth/forgot-password', 
      { email: email.trim().toLowerCase() },
      { timeout: 30000 } // Give the SMTP server 30 seconds to respond
    );
  },

  /**
   * STEP 2: Verify code and set new password
   */
  resetPassword: async (payload) => {
    // payload: { email, token, newPassword }
    const response = await apiClient.post('/auth/reset-password', payload);
    return response.data;
  },

  /**
   * Resend verification email
   */
  resendVerification: async (email) => {
    const response = await apiClient.post('/auth/resend-verification', {
      email: email.trim().toLowerCase(),
    }, 
    { timeout: 30000 });
    return response.data;
  },
};