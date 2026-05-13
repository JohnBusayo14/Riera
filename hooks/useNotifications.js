import * as signalR from '@microsoft/signalr';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// 1. Import the environment variable
import { API_URL } from '@env'; 

export const useNotifications = (UserId) => { 
  useEffect(() => {
    if (!UserId) return;

    let Connection = null;

    const StartSignalR = async () => {
      try {
        // 2. Aligned key with apiClient.jsx ('agro_token')
        const Token = await AsyncStorage.getItem('agro_token');

        Connection = new signalR.HubConnectionBuilder()
          .withUrl(`${API_URL}/notificationHub`, {
            accessTokenFactory: () => Token,
            // 3. Add ngrok bypass header for the negotiation request
            headers: {
              'ngrok-skip-browser-warning': 'true',
            },
            transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling 
          })
          .withAutomaticReconnect()
          .configureLogging(signalR.LogLevel.Warning)
          .build();

        Connection.on('ReceiveNotification', (Notification) => {
          Alert.alert(
            Notification.Title ?? "Update", 
            Notification.Message ?? "New notification received."
          );
        });

        await Connection.start();
        console.log(`>>> SignalR: Connected to ${API_URL}`);

      } catch (Err) {
        console.error('>>> SignalR Error:', Err.message);
      }
    };

    StartSignalR();

    return () => {
      if (Connection) Connection.stop();
    };
  }, [UserId]);
};