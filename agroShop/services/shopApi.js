import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://your-api-url.com/api'; // Replace with your actual base URL

const shopApi = {
  // Fetch all available products for the marketplace
  getProducts: async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Place a new Agro-Order (Product + Logistics)
  placeOrder: async (orderData) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(`${API_URL}/orders/agro-purchase`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error("Error placing order:", error);
      throw error;
    }
  }
};

export default shopApi;