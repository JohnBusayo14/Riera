import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Ensure this path correctly points to the apiClient.js we just updated
import apiClient from '../services/apiClient'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load storage on startup
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('agro_token');
        const savedUser = await AsyncStorage.getItem('agro_user');
        
        if (savedToken && savedUser) {
          setToken(savedToken);
          setCurrentUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error("Auth loading error:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuthData();
  }, []);

  /**
   * Fetches latest profile from backend and updates local state + storage
   * Useful for updating "isVerified" status or wallet balances
   */
  const refreshUser = async () => {
    try {
      const response = await apiClient.get('/auth/profile');
      
      // Handle standard API response wrappers (e.g., response.data.data)
      const updatedUser = response.data.data || response.data;
      
      if (updatedUser) {
        setCurrentUser(updatedUser);
        await AsyncStorage.setItem('agro_user', JSON.stringify(updatedUser));
        return updatedUser;
      }
    } catch (e) {
      console.error("Failed to refresh user profile:", e.message);
      
      // If the profile fetch fails because the token is invalid (401), log out
      if (e.response?.status === 401) {
        await logout();
      }
      return null;
    }
  };

  const login = async (userData, userToken) => {
    try {
      setToken(userToken);
      setCurrentUser(userData);
      
      // Store both for persistence
      await AsyncStorage.setItem('agro_token', userToken);
      await AsyncStorage.setItem('agro_user', JSON.stringify(userData));
    } catch (e) {
      console.error("Error saving login data:", e);
    }
  };

const logout = async () => {
    try {
      // 1. Attempt backend cleanup while token still exists
      const tokenExists = await AsyncStorage.getItem('agro_token');
      if (tokenExists) {
        try {
          // Use a timeout or a 'silent' flag if you added one to your config
          await apiClient.post('/driver/logout-cleanup', {}, { timeout: 3000 });
        } catch (apiError) {
          console.log("Backend cleanup skipped or failed:", apiError.message);
        }
      }

      // 2. Clear Local State (Crucial: do this AFTER the API call)
      setToken(null);
      setCurrentUser(null);
      
      // 3. Clear storage
      await AsyncStorage.multiRemove(['agro_token', 'agro_user']);
      
    } catch (e) {
      console.error("Error during logout:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      token, 
      isLoading, 
      login, 
      logout, 
      setCurrentUser,
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);