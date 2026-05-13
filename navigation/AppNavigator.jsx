import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../auth/AuthContext';
import AuthStack from './AuthStack';
import MainStack from './MainStack';

import LoadingScreen from '../screens/LoadingScreen';
import Toast from 'react-native-toast-message';
import { usePusherNotifications } from '../hooks/usePusherNotifications';
import DriverDashboard from '../driver/DriverDashboard';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isLoading: IsLoading, currentUser: CurrentUser } = useAuth();

  usePusherNotifications(CurrentUser?.id, (NotificationData) => {
    let ToastType = 'info';
    if (NotificationData.Type === 'Finance' || NotificationData.Status === 'Settled') {
      ToastType = 'success';
    }
    Toast.show({
      type: ToastType,
      text1: NotificationData.Title || "RieRa Update",
      text2: NotificationData.Message,
      visibilityTime: 4000,
    });
  });

  if (IsLoading) return <LoadingScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!CurrentUser ? (
          // 1. Authentication Flow
          <Stack.Screen name="AuthStack" component={AuthStack} />
        ) : (
          // 2. Main Application Flow
          // We name this 'MainStack' for ALL logged-in users to prevent 
          // navigation reset errors in SignIn/SignUp screens.
          <Stack.Screen name="MainStack">
            {(props) => {
              // Internal Role Switching
              if (CurrentUser.Role?.toUpperCase() === 'DRIVER') {
                return <DriverDashboard {...props} />;
              }
              return <MainStack {...props} />;
            }}
          </Stack.Screen>
        )}
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};

export default AppNavigator;