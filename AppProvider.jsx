import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './services/apiClient';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load Data on Start
  useEffect(() => {
    const loadData = async () => {
      try {
        const [u, o, w, t] = await Promise.all([
          AsyncStorage.getItem('agro_user'),
          AsyncStorage.getItem('agro_orders'),
          AsyncStorage.getItem('agro_wallet_balance'),
          AsyncStorage.getItem('agro_transactions')
        ]);
        if (u) setCurrentUser(JSON.parse(u));
        if (o) setOrders(JSON.parse(o));
        if (w) setWalletBalance(parseFloat(w) || 0);
        if (t) setTransactions(JSON.parse(t) || []);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Save Data when state changes
  useEffect(() => {
    const save = async () => {
      if (currentUser) {
        await AsyncStorage.setItem('agro_user', JSON.stringify(currentUser));
      } else {
        await AsyncStorage.removeItem('agro_user');
      }
      await AsyncStorage.setItem('agro_orders', JSON.stringify(orders));
      await AsyncStorage.setItem('agro_wallet_balance', walletBalance.toString());
      await AsyncStorage.setItem('agro_transactions', JSON.stringify(transactions));
    };
    save();
  }, [currentUser, orders, walletBalance, transactions]);

  /**
   * Enhanced logout implementation:
   * Fixes the issue where wallet/transactions were still accessible/usable after logout
   * 
   * What it does:
   * 1. Calls backend /api/auth/logout → clears device token on server
   * 2. Clears ALL possible auth-related storage keys (including common token keys)
   * 3. Resets ALL context states to initial empty values
   * 4. Gracefully continues even if server call fails
   */
  const logout = async () => {
    try {
      // Call server to clear device token (for push notifications)
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('Server logout failed (continuing with local logout):', error);
    } finally {
      // Reset all states immediately (prevents old data from showing on current screen)
      setCurrentUser(null);
      setOrders([]);
      setWalletBalance(0);
      setTransactions([]);

      // Clear ALL persisted data, including common JWT token keys
      // (This prevents API calls from succeeding after logout)
      const keysToRemove = [
        'agro_user',
        'agro_orders',
        'agro_wallet_balance',
        'agro_transactions',
        'token',              // Most common key for JWT
        'authToken',
        'jwtToken',
        'accessToken',
        '@token',             // Sometimes prefixed
        '@auth_token',
      ];

      try {
        await AsyncStorage.multiRemove(keysToRemove);
      } catch (storageError) {
        console.warn('Error clearing storage during logout:', storageError);
      }
    }
  };

  // Helper: Derived value for easy auth checks in screens
  const isAuthenticated = !!currentUser;

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      orders,
      setOrders,
      walletBalance,
      setWalletBalance,
      transactions,
      setTransactions,
      logout,
      isAuthenticated,  // ← New: easy way to check if user is logged in
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);