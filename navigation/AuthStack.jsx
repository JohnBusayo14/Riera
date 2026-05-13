// navigation/AuthStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import auth-related screens
import SignInScreen from '../auth/SignInScreen';
import SignUpScreen from '../auth/SignUpScreen';
//import ForgotPasswordScreen from '../auth/ForgotPasswordScreen';
import OTPScreen from '../screens/OTPScreen';
import ForgotPasswordScreen from '../auth/ForgotPasswordScreen';
//import OnboardingScreen from '../screens/OnboardingScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  // Defensive check: If a screen is undefined due to an export error, 
  // this prevents the app from crashing with a red screen.
  const checkComponent = (comp, name) => {
    if (!comp) {
      console.error(`[AuthStack] Component for ${name} is undefined. Check your exports!`);
      return () => null; 
    }
    return comp;
  };

  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerShown: false, // Hide headers for clean auth flow
        animation: 'slide_from_right', // Smooth native transition
      }}
    >
      {/* <Stack.Screen 
        name="Onboarding" 
        component={checkComponent(OnboardingScreen, 'Onboarding')} 
      /> */}
      
      <Stack.Screen 
        name="SignIn" 
        component={checkComponent(SignInScreen, 'SignIn')} 
      />
      
      <Stack.Screen 
        name="SignUp" 
        component={checkComponent(SignUpScreen, 'SignUp')} 
      />
      
      <Stack.Screen 
        name="ForgotPassword" 
        component={checkComponent(ForgotPasswordScreen, 'ForgotPassword')} 
      />
      
      <Stack.Screen 
        name="OTP" 
        component={checkComponent(OTPScreen, 'OTP')} 
      />
    </Stack.Navigator>
  );
};

export default AuthStack;