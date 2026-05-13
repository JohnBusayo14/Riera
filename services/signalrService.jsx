import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const HUB_URL = 'https://your-api-url.com/notificationHub'; // Your backend hub URL

let connection = null;

export const startSignalRConnection = async (token) => {
  if (connection) {
    return connection;
  }

  try {
    connection = new HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => token, // JWT token for auth
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect() // Auto reconnect on disconnect
      .build();

    await connection.start();
    console.log('SignalR Connected');

    return connection;
  } catch (err) {
    console.error('SignalR Connection Error: ', err);
    throw err;
  }
};

export const stopSignalRConnection = async () => {
  if (connection) {
    await connection.stop();
    connection = null;
    console.log('SignalR Disconnected');
  }
};

export const onReceiveNotification = (callback) => {
  if (connection) {
    connection.on('ReceiveNotification', (notification) => {
      callback(notification);
    });
  }
};

