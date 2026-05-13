// // import 'react-native-reanimated';
// // import React, { useState, useEffect } from 'react';
// // import { StyleSheet, LogBox, Platform, PermissionsAndroid, View, Text, Vibration } from 'react-native';
// // import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
// // import { SafeAreaProvider } from 'react-native-safe-area-context';
// // import { StatusBar } from 'expo-status-bar';
// // import { GestureHandlerRootView } from 'react-native-gesture-handler';

// // // --- NOTIFICATIONS IMPORT ---
// // import Toast, { BaseToast } from 'react-native-toast-message';
// // import * as Notifications from 'expo-notifications';
// // // Updated to Modular SDK import
// // import { getMessaging } from '@react-native-firebase/messaging';

// // // --- CONTEXT PROVIDERS ---
// // import { ThemeProvider, useTheme } from './context/ThemeContext';
// // import { AuthProvider, useAuth } from './auth/AuthContext';
// // import { CartProvider } from './context/CartContext';
// // import { usePusherNotifications } from './hooks/usePusherNotifications';

// // // --- NAVIGATORS & SCREENS ---
// // import AuthNavigator from './navigation/AuthStack';
// // import MainNavigator from './navigation/MainStack';
// // import LoadingScreen from './screens/LoadingScreen';
// // import SplashScreen from './screens/SplashScreen';

// // // 1. REGISTER FIREBASE BACKGROUND HANDLER (Modular Style)
// // getMessaging().setBackgroundMessageHandler(async remoteMessage => {
// //   console.log('Message handled in the background!', remoteMessage);
// // });

// // // 2. CONFIGURE EXPO NOTIFICATIONS BEHAVIOR
// // Notifications.setNotificationHandler({
// //   handleNotification: async () => ({
// //     shouldShowAlert: true,
// //     shouldPlaySound: true, // System will play sound for channel if configured
// //     shouldSetBadge: true,
// //   }),
// // });

// // // 3. CUSTOM TOAST CONFIGURATION
// // const toastConfig = {
// //   success: (props) => (
// //     <BaseToast
// //       {...props}
// //       style={{ borderLeftColor: '#10b981', backgroundColor: '#fff', height: 70 }}
// //       contentContainerStyle={{ paddingHorizontal: 15 }}
// //       text1Style={{ fontSize: 16, fontWeight: 'bold', color: '#10b981' }}
// //       text2Style={{ fontSize: 14, color: '#374151' }}
// //     />
// //   ),
// //   agroOrder: ({ text1, text2 }) => (
// //     <View style={styles.customToast}>
// //       <View style={styles.toastContent}>
// //         <Text style={styles.toastTitle}>{text1}</Text>
// //         <Text style={styles.toastSub}>{text2}</Text>
// //       </View>
// //     </View>
// //   ),
// // };

// // LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate`']);

// // const RootNavigation = () => {
// //   const { currentUser: User, isLoading: IsLoading } = useAuth();
// //   const { isDark: IsDark, colors: ThemeColors } = useTheme();
// //   const [ShowSplash, setShowSplash] = useState(true);

// //   useEffect(() => {
// //     const setupNotifications = async () => {
// //       // 1. Android Channel Setup
// //       if (Platform.OS === 'android') {
// //         await Notifications.setNotificationChannelAsync('orders_channel', {
// //           name: 'Order Updates',
// //           importance: Notifications.AndroidImportance.MAX,
// //           vibrationPattern: [0, 250, 250, 250],
// //           lightColor: '#10b981',
// //         });
// //       }

// //       // 2. Request Android 13+ Permissions
// //       if (Platform.OS === 'android' && Platform.Version >= 33) {
// //         await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
// //       }

// //       // 3. Request Firebase Permission & Get Token (Modular)
// //       const messaging = getMessaging();
// //       const authStatus = await messaging.requestPermission();
// //       const enabled = authStatus === 1 || authStatus === 2;

// //       if (enabled) {
// //         const token = await messaging.getToken();
// //         console.log('--- FCM TOKEN ---', token);
// //       }
// //     };

// //     setupNotifications();

// //     // Foreground Listener (Modular)
// //     const unsubscribeFirebase = getMessaging().onMessage(async remoteMessage => {
// //       console.log('Foreground message received:', remoteMessage);
      
// //       Vibration.vibrate([0, 500, 100, 500]); 

// //       Toast.show({
// //         type: 'agroOrder',
// //         text1: remoteMessage.notification?.title || "AgroMove Update",
// //         text2: remoteMessage.notification?.body || "Check your order status",
// //         topOffset: 60,
// //       });
// //     });

// //     const notificationClickSubscription = Notifications.addNotificationResponseReceivedListener(response => {
// //       console.log('User tapped notification:', response.notification.request.content.data);
// //     });

// //     return () => {
// //       unsubscribeFirebase();
// //       notificationClickSubscription.remove();
// //     };
// //   }, []);

// //   usePusherNotifications(User?.id, (NotificationData) => {
// //     Toast.show({
// //       type: 'success',
// //       text1: NotificationData.Title || "AgroMove Update",
// //       text2: NotificationData.Message,
// //       visibilityTime: 5000,
// //     });
// //   });

// //   if (ShowSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;
// //   if (IsLoading) return <LoadingScreen />;

// //   const CustomAppTheme = {
// //     ...(IsDark ? DarkTheme : DefaultTheme),
// //     dark: IsDark,
// //     colors: {
// //       ...(IsDark ? DarkTheme.colors : DefaultTheme.colors),
// //       primary: ThemeColors.Primary,
// //       background: ThemeColors.Background,
// //       card: ThemeColors.Surface,
// //       text: ThemeColors.TextPrimary,
// //       border: ThemeColors.Border,
// //       notification: '#EF4444',
// //     },
// //   };

// //   return (
// //     <NavigationContainer theme={CustomAppTheme}>
// //       {User ? <MainNavigator /> : <AuthNavigator />}
// //     </NavigationContainer>
// //   );
// // };

// // const App = () => {
// //   return (
// //     <GestureHandlerRootView style={{ flex: 1 }}>
// //       <ThemeProvider>
// //         <SafeAreaProvider>
// //           <AuthProvider>
// //             <CartProvider>
// //               <AppContent />
// //               <Toast config={toastConfig} />
// //             </CartProvider>
// //           </AuthProvider>
// //         </SafeAreaProvider>
// //       </ThemeProvider>
// //     </GestureHandlerRootView>
// //   );
// // };

// // const AppContent = () => {
// //   const { isDark: IsDark } = useTheme();
// //   return (
// //     <>
// //       <StatusBar style={IsDark ? "light" : "dark"} translucent backgroundColor="transparent" />
// //       <RootNavigation />
// //     </>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   customToast: {
// //     height: 70,
// //     width: '90%',
// //     backgroundColor: '#fff',
// //     borderRadius: 12,
// //     borderLeftWidth: 6,
// //     borderLeftColor: '#10b981',
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 20,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 3 },
// //     shadowOpacity: 0.2,
// //     shadowRadius: 5,
// //     elevation: 6,
// //   },
// //   toastContent: { flex: 1 },
// //   toastTitle: { fontWeight: 'bold', fontSize: 16, color: '#10b981' },
// //   toastSub: { fontSize: 14, color: '#4B5563', marginTop: 2 },
// // });

// // export default App;








// import 'react-native-reanimated';
// import React, { useState, useEffect } from 'react';
// import { StyleSheet, LogBox, Platform, PermissionsAndroid, View, Text, Vibration } from 'react-native';
// import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { StatusBar } from 'expo-status-bar';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';

// // --- NOTIFICATIONS IMPORT ---
// import Toast, { BaseToast } from 'react-native-toast-message';
// import * as Notifications from 'expo-notifications';
// // Updated to Modular SDK import
// // import { getMessaging } from '@react-native-firebase/messaging';

// // --- CONTEXT PROVIDERS ---
// import { ThemeProvider, useTheme } from './context/ThemeContext';
// import { AuthProvider, useAuth } from './auth/AuthContext';
// import { CartProvider } from './context/CartContext';
// import { usePusherNotifications } from './hooks/usePusherNotifications';

// // --- NAVIGATORS & SCREENS ---
// import AuthNavigator from './navigation/AuthStack';
// import MainNavigator from './navigation/MainStack';
// import LoadingScreen from './screens/LoadingScreen';
// import SplashScreen from './screens/SplashScreen';

// // 1. REGISTER FIREBASE BACKGROUND HANDLER (Modular Style)
// getMessaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the background!', remoteMessage);
// });

// // 2. CONFIGURE EXPO NOTIFICATIONS BEHAVIOR
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true, // System will play sound for channel if configured
//     shouldSetBadge: true,
//   }),
// });

// // // 3. WHATSAPP-STYLE TOAST CONFIGURATION
// const toastConfig = {
//   // ✅ WhatsApp-style notification (main type for push notifications)
//   whatsapp: ({ text1, text2 }) => (
//     <View style={styles.whatsappToast}>
//       {/* App Icon Circle */}
//       <View style={styles.whatsappIcon}>
//         <Text style={styles.whatsappIconText}>A</Text>
//       </View>
      
//       {/* Content */}
//       <View style={styles.whatsappContent}>
//         <Text style={styles.whatsappTitle} numberOfLines={1}>
//           {text1 || 'AgroMove'}
//         </Text>
//         <Text style={styles.whatsappMessage} numberOfLines={2}>
//           {text2 || 'New notification'}
//         </Text>
//       </View>
      
//       {/* Time */}
//       <Text style={styles.whatsappTime}>now</Text>
//     </View>
//   ),

//   // Order-specific notification (green theme)
//   order: ({ text1, text2 }) => (
//     <View style={[styles.whatsappToast, { borderLeftColor: '#10b981' }]}>
//       <View style={[styles.whatsappIcon, { backgroundColor: '#10b981' }]}>
//         <Text style={styles.whatsappIconText}>📦</Text>
//       </View>
//       <View style={styles.whatsappContent}>
//         <Text style={styles.whatsappTitle} numberOfLines={1}>{text1}</Text>
//         <Text style={styles.whatsappMessage} numberOfLines={2}>{text2}</Text>
//       </View>
//       <Text style={styles.whatsappTime}>now</Text>
//     </View>
//   ),

//   // Finance notification (yellow/gold theme)
//   finance: ({ text1, text2 }) => (
//     <View style={[styles.whatsappToast, { borderLeftColor: '#F59E0B' }]}>
//       <View style={[styles.whatsappIcon, { backgroundColor: '#F59E0B' }]}>
//         <Text style={styles.whatsappIconText}>💰</Text>
//       </View>
//       <View style={styles.whatsappContent}>
//         <Text style={styles.whatsappTitle} numberOfLines={1}>{text1}</Text>
//         <Text style={styles.whatsappMessage} numberOfLines={2}>{text2}</Text>
//       </View>
//       <Text style={styles.whatsappTime}>now</Text>
//     </View>
//   ),

//   // Success notification (green checkmark)
//   success: ({ text1, text2 }) => (
//     <View style={[styles.whatsappToast, { borderLeftColor: '#10B981' }]}>
//       <View style={[styles.whatsappIcon, { backgroundColor: '#10B981' }]}>
//         <Text style={styles.whatsappIconText}>✓</Text>
//       </View>
//       <View style={styles.whatsappContent}>
//         <Text style={styles.whatsappTitle} numberOfLines={1}>{text1}</Text>
//         <Text style={styles.whatsappMessage} numberOfLines={2}>{text2}</Text>
//       </View>
//       <Text style={styles.whatsappTime}>now</Text>
//     </View>
//   ),
// };

// // 3. CUSTOM TOAST CONFIGURATION
// // const toastConfig = {
// //   success: (props) => (
// //     <BaseToast
// //       {...props}
// //       style={{ borderLeftColor: '#10b981', backgroundColor: '#fff', height: 70 }}
// //       contentContainerStyle={{ paddingHorizontal: 15 }}
// //       text1Style={{ fontSize: 16, fontWeight: 'bold', color: '#10b981' }}
// //       text2Style={{ fontSize: 14, color: '#374151' }}
// //     />
// //   ),
// //   agroOrder: ({ text1, text2 }) => (
// //     <View style={styles.customToast}>
// //       <View style={styles.toastContent}>
// //         <Text style={styles.toastTitle}>{text1}</Text>
// //         <Text style={styles.toastSub}>{text2}</Text>
// //       </View>
// //     </View>
// //   ),
// // };

// LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate`']);

// const RootNavigation = () => {
//   const { currentUser: User, isLoading: IsLoading } = useAuth();
//   const { isDark: IsDark, colors: ThemeColors } = useTheme();
//   const [ShowSplash, setShowSplash] = useState(true);

//   useEffect(() => {
//     const setupNotifications = async () => {
//       // 1. Android Channel Setup with CUSTOM SOUND
//       if (Platform.OS === 'android') {
//         await Notifications.setNotificationChannelAsync('orders_channel', {
//           name: 'Order Updates',
//           importance: Notifications.AndroidImportance.MAX,
//           vibrationPattern: [0, 250, 250, 250], // WhatsApp-style vibration
//           lightColor: '#10b981',
//           sound: 'doorbell.wav', // ✅ Custom sound from assets/sounds/
//         });
//       }

//       // 2. Request Android 13+ Permissions
//       if (Platform.OS === 'android' && Platform.Version >= 33) {
//         await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
//       }

//       // 3. Request Firebase Permission & Get Token (Modular)
//       const messaging = getMessaging();
//       const authStatus = await messaging.requestPermission();
//       const enabled = authStatus === 1 || authStatus === 2;

//       if (enabled) {
//         const token = await messaging.getToken();
//         console.log('--- FCM TOKEN ---', token);
//       }
//     };

//     setupNotifications();

//     // Foreground Listener (Modular) - Shows WhatsApp-style toast
//     const unsubscribeFirebase = getMessaging().onMessage(async remoteMessage => {
//       console.log('Foreground message received:', remoteMessage);
      
//       // ✅ WhatsApp-style vibration pattern (double buzz)
//       Vibration.vibrate([0, 100, 50, 100]); 

//       // ✅ Show notification sound via local notification
//       // This triggers the notification channel's sound
//       await Notifications.scheduleNotificationAsync({
//         content: {
//           title: remoteMessage.notification?.title || 'AgroMove',
//           body: remoteMessage.notification?.body || 'New notification',
//           sound: 'doorbell.wav',
//         },
//         trigger: null, // Show immediately
//       });

//       // ✅ Show WhatsApp-style toast based on notification type
//       const notificationType = remoteMessage.data?.type?.toLowerCase() || 'whatsapp';
//       const toastType = ['order', 'finance', 'success'].includes(notificationType) 
//         ? notificationType 
//         : 'whatsapp';

//       Toast.show({
//         type: toastType, // Uses the custom WhatsApp-style config
//         text1: remoteMessage.notification?.title || "AgroMove",
//         text2: remoteMessage.notification?.body || "You have a new notification",
//         position: 'top',
//         topOffset: 50,
//         visibilityTime: 4000,
//         autoHide: true,
//       });
//     });

//     const notificationClickSubscription = Notifications.addNotificationResponseReceivedListener(response => {
//       console.log('User tapped notification:', response.notification.request.content.data);
//     });

//     return () => {
//       unsubscribeFirebase();
//       notificationClickSubscription.remove();
//     };
//   }, []);

//   usePusherNotifications(User?.id, (NotificationData) => {
//     // ✅ WhatsApp-style vibration
//     Vibration.vibrate([0, 100, 50, 100]);

//     // ✅ Play custom sound via local notification
//     Notifications.scheduleNotificationAsync({
//       content: {
//         title: NotificationData.Title || 'AgroMove',
//         body: NotificationData.Message,
//         sound: 'doorbell.wav',
//       },
//       trigger: null,
//     });

//     // ✅ Show WhatsApp-style toast based on notification type
//     const notificationType = NotificationData.Type?.toLowerCase() || 'whatsapp';
//     const toastType = ['order', 'finance', 'success'].includes(notificationType) 
//       ? notificationType 
//       : 'whatsapp';

//     Toast.show({
//       type: toastType,
//       text1: NotificationData.Title || "AgroMove",
//       text2: NotificationData.Message,
//       position: 'top',
//       topOffset: 50,
//       visibilityTime: 4000,
//       autoHide: true,
//     });
//   });

//   if (ShowSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;
//   if (IsLoading) return <LoadingScreen />;

//   const CustomAppTheme = {
//     ...(IsDark ? DarkTheme : DefaultTheme),
//     dark: IsDark,
//     colors: {
//       ...(IsDark ? DarkTheme.colors : DefaultTheme.colors),
//       primary: ThemeColors.Primary,
//       background: ThemeColors.Background,
//       card: ThemeColors.Surface,
//       text: ThemeColors.TextPrimary,
//       border: ThemeColors.Border,
//       notification: '#EF4444',
//     },
//   };

//   return (
//     <NavigationContainer theme={CustomAppTheme}>
//       {User ? <MainNavigator /> : <AuthNavigator />}
//     </NavigationContainer>
//   );
// };

// const App = () => {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <ThemeProvider>
//         <SafeAreaProvider>
//           <AuthProvider>
//             <CartProvider>
//               <AppContent />
//               <Toast config={toastConfig} />
//             </CartProvider>
//           </AuthProvider>
//         </SafeAreaProvider>
//       </ThemeProvider>
//     </GestureHandlerRootView>
//   );
// };

// const AppContent = () => {
//   const { isDark: IsDark } = useTheme();
//   return (
//     <>
//       <StatusBar style={IsDark ? "light" : "dark"} translucent backgroundColor="transparent" />
//       <RootNavigation />
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   // ✅ WhatsApp-style toast container
//   whatsappToast: {
//     width: '90%',
//     minHeight: 75,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     borderLeftWidth: 4,
//     borderLeftColor: '#008148', // AgroMove green
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 8,
//     elevation: 8,
//   },

//   // Icon circle (like WhatsApp contact photo)
//   whatsappIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#008148',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },

//   whatsappIconText: {
//     color: '#FFFFFF',
//     fontSize: 20,
//     fontWeight: '900',
//   },

//   // Content area
//   whatsappContent: {
//     flex: 1,
//     marginRight: 8,
//   },

//   whatsappTitle: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#000000',
//     marginBottom: 3,
//   },

//   whatsappMessage: {
//     fontSize: 13,
//     fontWeight: '400',
//     color: '#4B5563',
//     lineHeight: 18,
//   },

//   // Time indicator (like WhatsApp)
//   whatsappTime: {
//     fontSize: 11,
//     fontWeight: '600',
//     color: '#9CA3AF',
//     marginLeft: 4,
//   },
// });

// export default App;










import 'react-native-reanimated';
import React, { useState, useEffect } from 'react';
import { StyleSheet, LogBox, Platform, PermissionsAndroid, View, Text, Vibration } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// --- NOTIFICATIONS IMPORT ---
import Toast from 'react-native-toast-message';
import * as Notifications from 'expo-notifications';

// --- CONTEXT PROVIDERS ---
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { CartProvider } from './context/CartContext';
import { usePusherNotifications } from './hooks/usePusherNotifications';

// --- NAVIGATORS & SCREENS ---
import AuthNavigator from './navigation/AuthStack';
import MainNavigator from './navigation/MainStack';
import LoadingScreen from './screens/LoadingScreen';
import SplashScreen from './screens/SplashScreen';

// 1. CONFIGURE EXPO NOTIFICATIONS BEHAVIOR
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// 2. WHATSAPP-STYLE TOAST CONFIGURATION
const toastConfig = {
  whatsapp: ({ text1, text2 }) => (
    <View style={styles.whatsappToast}>
      <View style={styles.whatsappIcon}>
        <Text style={styles.whatsappIconText}>A</Text>
      </View>
      <View style={styles.whatsappContent}>
        <Text style={styles.whatsappTitle} numberOfLines={1}>{text1 || 'AgroMove'}</Text>
        <Text style={styles.whatsappMessage} numberOfLines={2}>{text2 || 'New notification'}</Text>
      </View>
      <Text style={styles.whatsappTime}>now</Text>
    </View>
  ),
  order: ({ text1, text2 }) => (
    <View style={[styles.whatsappToast, { borderLeftColor: '#10b981' }]}>
      <View style={[styles.whatsappIcon, { backgroundColor: '#10b981' }]}>
        <Text style={styles.whatsappIconText}>📦</Text>
      </View>
      <View style={styles.whatsappContent}>
        <Text style={styles.whatsappTitle} numberOfLines={1}>{text1}</Text>
        <Text style={styles.whatsappMessage} numberOfLines={2}>{text2}</Text>
      </View>
      <Text style={styles.whatsappTime}>now</Text>
    </View>
  ),
  finance: ({ text1, text2 }) => (
    <View style={[styles.whatsappToast, { borderLeftColor: '#F59E0B' }]}>
      <View style={[styles.whatsappIcon, { backgroundColor: '#F59E0B' }]}>
        <Text style={styles.whatsappIconText}>💰</Text>
      </View>
      <View style={styles.whatsappContent}>
        <Text style={styles.whatsappTitle} numberOfLines={1}>{text1}</Text>
        <Text style={styles.whatsappMessage} numberOfLines={2}>{text2}</Text>
      </View>
      <Text style={styles.whatsappTime}>now</Text>
    </View>
  ),
  success: ({ text1, text2 }) => (
    <View style={[styles.whatsappToast, { borderLeftColor: '#10B981' }]}>
      <View style={[styles.whatsappIcon, { backgroundColor: '#10B981' }]}>
        <Text style={styles.whatsappIconText}>✓</Text>
      </View>
      <View style={styles.whatsappContent}>
        <Text style={styles.whatsappTitle} numberOfLines={1}>{text1}</Text>
        <Text style={styles.whatsappMessage} numberOfLines={2}>{text2}</Text>
      </View>
      <Text style={styles.whatsappTime}>now</Text>
    </View>
  ),
};

LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate`']);

const RootNavigation = () => {
  const { currentUser: User, isLoading: IsLoading } = useAuth();
  const { isDark: IsDark, colors: ThemeColors } = useTheme();
  const [ShowSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const setupNotifications = async () => {
      // 1. Android Channel Setup
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('orders_channel', {
          name: 'Order Updates',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#10b981',
        });
      }

      // 2. Request Permissions
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      }
      
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions not granted');
      }
    };

    setupNotifications();

    const notificationClickSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('User tapped notification:', response.notification.request.content.data);
    });

    return () => {
      notificationClickSubscription.remove();
    };
  }, []);

  // ✅ Keep Pusher working for Real-time updates without Firebase
  usePusherNotifications(User?.id, (NotificationData) => {
    Vibration.vibrate([0, 100, 50, 100]);
    
    const nType = NotificationData.Type?.toLowerCase() || 'whatsapp';
    const toastType = ['order', 'finance', 'success'].includes(nType) ? nType : 'whatsapp';

    Toast.show({
      type: toastType,
      text1: NotificationData.Title || "AgroMove",
      text2: NotificationData.Message,
      position: 'top',
      topOffset: 50,
      visibilityTime: 4000,
    });
  });

  if (ShowSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;
  if (IsLoading) return <LoadingScreen />;

  const CustomAppTheme = {
    ...(IsDark ? DarkTheme : DefaultTheme),
    dark: IsDark,
    colors: {
      ...(IsDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: ThemeColors.Primary,
      background: ThemeColors.Background,
      card: ThemeColors.Surface,
      text: ThemeColors.TextPrimary,
      border: ThemeColors.Border,
      notification: '#EF4444',
    },
  };

  return (
    <NavigationContainer theme={CustomAppTheme}>
      {User ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

// ... App and AppContent components stay as they were ...
const App = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <ThemeProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
            <Toast config={toastConfig} />
          </CartProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  </GestureHandlerRootView>
);

const AppContent = () => {
  const { isDark: IsDark } = useTheme();
  return (
    <>
      <StatusBar style={IsDark ? "light" : "dark"} translucent backgroundColor="transparent" />
      <RootNavigation />
    </>
  );
};

const styles = StyleSheet.create({
  whatsappToast: {
    width: '90%',
    minHeight: 75,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#008148',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  whatsappIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#008148',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  whatsappIconText: { color: '#FFFFFF', fontSize: 20, fontWeight: '900' },
  whatsappContent: { flex: 1, marginRight: 8 },
  whatsappTitle: { fontSize: 15, fontWeight: '700', color: '#000000', marginBottom: 3 },
  whatsappMessage: { fontSize: 13, fontWeight: '400', color: '#4B5563', lineHeight: 18 },
  whatsappTime: { fontSize: 11, fontWeight: '600', color: '#9CA3AF', marginLeft: 4 },
});

export default App;