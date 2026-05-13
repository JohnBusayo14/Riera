// Replace with your actual backend IP/URL
const API_BASE_URL = 'http://192.168.1.100:5000'; 

export const getValidUri = (url) => {
  if (!url || typeof url !== 'string' || url.trim() === '') return null;

  // Handle relative paths from backend
  let sanitizedUrl = url.replace(/\\/g, '/');
  
  if (!sanitizedUrl.startsWith('http')) {
    // If it starts with /uploads, add the base URL
    sanitizedUrl = `${API_BASE_URL}${sanitizedUrl.startsWith('/') ? '' : '/'}${sanitizedUrl}`;
  }

  return sanitizedUrl;
};