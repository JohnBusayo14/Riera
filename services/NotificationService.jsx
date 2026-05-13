// import messaging from '@react-native-firebase/messaging';
// import * as Notifications from 'expo-notifications';
// import axios from 'axios';
// import { Platform, PermissionsAndroid } from 'react-native';

// // Your current ngrok URL for backend communication
// const BASE_URL = 'https://injured-mealiest-lucius.ngrok-free.dev';

// /**
//  * Creates the notification channel for Android.
//  * This MUST match the channelId sent by your C# backend.
//  */
// export const setupNotificationChannels = async () => {
//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('orders_channel', {
//       name: 'Order Updates',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#10b981',
//       sound: 'doorbell.wav', // The filename defined in app.json plugins
//     });
//   }
// };

// export const registerForPushNotifications = async (userId, userToken) => {
//   try {
//     // 1. Request Permission (Crucial for Android 13+ and iOS)
//     if (Platform.OS === 'android' && Platform.Version >= 33) {
//       await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
//     }
    
//     const authStatus = await messaging().requestPermission();
//     const enabled =
//       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//     if (enabled) {
//       // Initialize the custom sound channel
//       await setupNotificationChannels();

//       // 2. Get the unique FCM Device Token from Firebase
//       const fcmToken = await messaging().getToken();
//       console.log('FCM Device Token:', fcmToken);

//       // 3. Sync token to backend
//       await axios.post(`${BASE_URL}/api/notifications/update-token`, 
//         { fcmToken: fcmToken },
//         { 
//           headers: { 
//             Authorization: `Bearer ${userToken}`,
//             'Content-Type': 'application/json'
//           } 
//         }
//       );
      
//       console.log('Backend Sync: Success! Device token linked to user.');
//     }
//   } catch (error) {
//     console.error('Push Registration Error:', error.response?.data || error.message);
//   }
// };

// // Handle Foreground Messages (App is open)
// export const setupForegroundListener = (onMessageReceived) => {
//   return messaging().onMessage(async remoteMessage => {
//     console.log('A new FCM message arrived!', remoteMessage);
    
//     // Optional: Trigger a local notification manually in foreground 
//     // to force the custom sound to play while the app is open
//     if (onMessageReceived) {
//       onMessageReceived(remoteMessage);
//     }
//   });
// };



import messaging from '@react-native-firebase/messaging';
import * as ExpoNotifications from 'expo-notifications'; // Renamed to avoid conflicts
import axios from 'axios';
import { Platform, PermissionsAndroid } from 'react-native';

const BASE_URL = 'https://injured-mealiest-lucius.ngrok-free.dev';

// Configure how notifications should behave when the app is FOREGROUNDED
ExpoNotifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Creates the notification channel for Android.
 */
export const setupNotificationChannels = async () => {
  if (Platform.OS === 'android') {
    await ExpoNotifications.setNotificationChannelAsync('orders_channel', {
      name: 'Order Updates',
      importance: ExpoNotifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#10b981',
      sound: 'doorbell.wav', 
    });
  }
};

export const registerForPushNotifications = async (userId, userToken) => {
  try {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }
    
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      await setupNotificationChannels();

      const fcmToken = await messaging().getToken();
      console.log('FCM Device Token:', fcmToken);

      await axios.post(`${BASE_URL}/api/notifications/update-token`, 
        { fcmToken: fcmToken },
        { 
          headers: { 
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      console.log('Backend Sync: Success!');
    }
  } catch (error) {
    console.error('Push Registration Error:', error.response?.data || error.message);
  }
};

// Handle Foreground Messages (App is open)
export const setupForegroundListener = (onMessageReceived) => {
  return messaging().onMessage(async remoteMessage => {
    console.log('FCM message arrived in foreground!', remoteMessage);
    
    // Manually trigger the local notification to ensure sound plays in foreground
    try {
      await ExpoNotifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.notification?.title || "AgroMove Update",
          body: remoteMessage.notification?.body || "",
          data: remoteMessage.data,
          sound: 'doorbell.wav', // Matches channel config
        },
        trigger: null, // Show immediately
      });
    } catch (err) {
      console.error("Error scheduling foreground notification:", err);
    }

    if (onMessageReceived) {
      onMessageReceived(remoteMessage);
    }
  });
};