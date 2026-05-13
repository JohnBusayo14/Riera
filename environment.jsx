// environment.js
import { Platform } from 'react-native';

const LOCAL_IP = '192.168.1.10'; // <--- CHANGE THIS to your PC's IP Address

export const environment = {
  // Use 10.0.2.2 for Android Emulator, or your Local IP for physical devices
  apiUrl: Platform.OS === 'android' ? `http://${LOCAL_IP}:5000/api` : `http://localhost:5000/api`,
  
  // Hub URL for SignalR (no /api suffix)
  hubUrl: Platform.OS === 'android' ? `http://${LOCAL_IP}:5000` : `http://localhost:5000`,
  
  production: false
};