import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env'; 

const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
  timeout: 15000, // Added timeout to prevent hanging requests
});

// Request Interceptor: Attach Token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('agro_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      if (!config._silent) {
        console.log(`➡️  [API REQUEST] ${config.method?.toUpperCase()} -> ${config.url}`);
      }
    } catch (err) {
      console.error('❌ Token read error:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Success & Global Errors
apiClient.interceptors.response.use(
  (response) => {
    if (!response.config._silent) {
      console.log(`✅ [API SUCCESS] ${response.status} <- ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const url = error.config?.url || 'unknown';
    const message = error.response?.data?.message || error.message;

    // Log the error for debugging
    if (!error.config?._silent) {
      console.error(`❌ [API ERROR] ${status || 'Network'} | URL: ${url} | Msg: ${message}`);
    }

    // ─── 401 UNAUTHORIZED LOGIC ───────────────────────────────────────────
    if (status === 401) {
      // 1. Don't auto-logout if we are ALREADY trying to log out
      if (url.includes('logout-cleanup') || url.includes('auth/logout')) {
        return Promise.reject(error);
      }

      // 2. Optional: Add a check to see if the token is actually missing 
      // from storage before wiping everything.
      const localToken = await AsyncStorage.getItem('agro_token');
      
      if (localToken) {
        console.warn("Unauthorized request detected with valid local token. Potential token expiration.");
        
        // 3. Clear storage and trigger a re-route
        // Use multiRemove to clear user data
        await AsyncStorage.multiRemove(['agro_token', 'agro_user']);
        
        // Note: You should trigger a global state reset here if using 
        // a tool like Redux or an Event Emitter.
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;