import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, ActivityIndicator, Alert, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import { walletApi } from '../api/walletApi';

export default function OzowPaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const webViewRef = useRef(null);
  
  const { amount } = route.params || { amount: 0 };
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializePayment = async () => {
      try {
        // Backend handles calculations [cite: 2026-01-09]
        // Request uses PascalCase [cite: 2026-01-23]
        const response = await walletApi.post('/wallet/ozow/initialize', { 
          Amount: amount, 
          Method: 'OZOW' 
        });

        const url = response.data?.PaymentUrl || response.data?.paymentUrl;

        if (url) {
          setPaymentUrl(url);
        } else {
          throw new Error("No payment URL received");
        }
      } catch (error) {
        console.error("Ozow Init Error:", error?.response?.data || error.message);
        Alert.alert("Error", "Could not connect to Ozow. Please try again.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    if (amount > 0) initializePayment();
  }, [amount]);

  const handleNavigationStateChange = (navState) => {
    const { url } = navState;
    if (!url) return;

    // Convert to lowercase for safer comparison
    const lowerUrl = url.toLowerCase();

    // 1. Success Flow
    // Ensure this matches the SuccessUrl configured in your C# WalletController
    if (lowerUrl.includes('success')) {
      Alert.alert("Success", "Payment processed. Updating your balance...");
      navigation.navigate('Wallet'); // useFocusEffect in WalletContainer will refresh balance
      return;
    }

    // 2. Cancellation/Error Flow
    // We check for specific terminal paths to avoid accidental triggers 
    // during intermediate redirects.
    const isExplicitCancel = lowerUrl.includes('/cancel') || lowerUrl.includes('status=cancelled');
    const isExplicitError = lowerUrl.includes('/error') || lowerUrl.includes('status=error');

    if (isExplicitCancel || isExplicitError) {
      Alert.alert(
        "Transaction Incomplete", 
        "The payment was cancelled or encountered an error."
      );
      navigation.goBack();
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {paymentUrl && (
        <WebView 
          ref={webViewRef}
          source={{ uri: paymentUrl }}
          onNavigationStateChange={handleNavigationStateChange}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          // Added to prevent the WebView from caching old "Cancelled" states
          incognito={true} 
          renderLoading={() => (
            <ActivityIndicator 
              style={styles.absoluteLoader} 
              size="large" 
              color="#16a34a" 
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  absoluteLoader: { 
    position: 'absolute', 
    top: '50%', 
    left: '45%',
    zIndex: 999 
  }
});