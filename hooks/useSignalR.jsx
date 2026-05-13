import * as signalR from '@microsoft/signalr';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Using your direct IPv4 address for local network stability
const BASE_URL = 'http://192.168.0.170:5000'; 

export const useNotifications = (UserId) => { // PascalCase [cite: 2026-01-23]
  useEffect(() => {
    if (!UserId) return;

    let Connection = null;

    const StartSignalR = async () => {
      try {
        const Token = await AsyncStorage.getItem('agro_auth_token');

        Connection = new signalR.HubConnectionBuilder()
          .withUrl(`${BASE_URL}/notificationHub`, {
            accessTokenFactory: () => Token,
            // WebSockets is preferred for direct IP connections
            transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling 
          })
          .withAutomaticReconnect()
          .configureLogging(signalR.LogLevel.Warning)
          .build();

        // Listen for the event (Matches Backend PascalCase event names)
        Connection.on('ReceiveNotification', (Notification) => {
          console.log("SignalR: Packet received", Notification);
          // Backend handles calculation; we just display the message [cite: 2026-01-09]
          Alert.alert(
            Notification.Title ?? "New Update", 
            Notification.Message ?? "You have a new notification."
          );
        });

        await Connection.start();
        console.log(`SignalR: Connected successfully to ${BASE_URL}`);

      } catch (Err) {
        console.error('SignalR: Start failed. Verify your PC Firewall allows Port 5000:', Err.message);
      }
    };

    StartSignalR();

    // Cleanup: Stop connection when component unmounts or UserId changes
    return () => {
      if (Connection) {
        Connection.stop()
          .then(() => console.log("SignalR: Connection stopped safely."))
          .catch(Err => console.warn("SignalR: Error during stop:", Err));
      }
    };
  }, [UserId]);
};