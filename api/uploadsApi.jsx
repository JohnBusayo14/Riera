// src/api/uploadsApi.js
import apiClient from '../services/apiClient';

export const uploadsApi = {
  uploadCargoImage: async (base64Image) => {
    const response = await apiClient.post('/uploads/cargo', { base64Image });
    return response.data; // { url: "/uploads/xxx.jpg" }
  },
};
