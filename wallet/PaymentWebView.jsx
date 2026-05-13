// import React, { useState } from 'react';
// import { StyleSheet, SafeAreaView, TouchableOpacity, Text, View, Alert, ActivityIndicator } from 'react-native';
// import { WebView } from 'react-native-webview';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { X } from 'lucide-react-native';
// import { walletApi } from '../api/walletApi';

// export default function PaymentWebView() {
//   const navigation = useNavigation();
//   const route = useRoute();
  
//   // Safely extract params to avoid "undefined" errors
//   const { url, reference } = route.params || {}; 
//   const [verifying, setVerifying] = useState(false);

//   /**
//    * Listen for Paystack redirect URLs.
//    * Logic: When Paystack hits the callback/success URL, we trigger the backend verification.
//    */
//   const handleNavigationStateChange = async (navState) => {
//     // Check for common Paystack success redirect patterns
//     if (
//       navState.url.includes('callback') || 
//       navState.url.includes('checkout-success') || 
//       navState.url.includes('status=success')
//     ) {
//       // Small delay to ensure the transaction is recorded on Paystack's end
//       setTimeout(() => verifyAndClose(), 1500);
//     }
//   };

//   const verifyAndClose = async () => {
//     // Prevent multiple simultaneous verification calls
//     if (verifying || !reference) return;
    
//     setVerifying(true);

//     try {
//       /**
//        * BACKEND VERIFICATION
//        * We pass 'reference' as a key. The walletApi wrapper will 
//        * format it as 'Reference' for the C# DTO.
//        */
//       await walletApi.verifyPayment({ reference: reference });
      
//       Alert.alert("Success", "Wallet funded successfully!");
      
//       // Navigate back to Wallet. The useFocusEffect in WalletContainer 
//       // will trigger a fresh balance fetch [cite: 2026-01-09].
//       navigation.navigate('Wallet', { refresh: true }); 
      
//     } catch (error) {
//       console.error("Verification Error:", error.response?.data || error.message);
      
//       // If a 400 error occurs, it usually means it's already processed 
//       // or the reference was invalid.
//       Alert.alert(
//         "Notice", 
//         "Verification is pending. If your balance hasn't updated in 2 minutes, please contact support."
//       );
//       navigation.goBack();
//     } finally {
//       setVerifying(false);
//     }
//   };

//   // If URL is missing, don't attempt to load the WebView
//   if (!url) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <Text>Invalid Payment Link</Text>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
//           <Text style={{ color: '#16a34a', fontWeight: 'bold' }}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} disabled={verifying}>
//           <X size={24} color="#0f172a" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Complete Payment</Text>
//         {verifying ? (
//           <ActivityIndicator size="small" color="#16a34a" />
//         ) : (
//           <View style={{ width: 24 }} />
//         )}
//       </View>
      
//       <WebView 
//         source={{ uri: url }} 
//         onNavigationStateChange={handleNavigationStateChange}
//         startInLoadingState={true}
//         renderLoading={() => (
//           <ActivityIndicator 
//             style={{ position: 'absolute', top: '50%', left: '45%' }} 
//             size="large" 
//             color="#16a34a" 
//           />
//         )}
//         // Safety: ensure external links don't break the flow
//         onMessage={(event) => {
//            if(event.nativeEvent.data === 'close') navigation.goBack();
//         }}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'white' },
//   header: { 
//     height: 55, 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'space-between', 
//     paddingHorizontal: 15, 
//     borderBottomWidth: 1, 
//     borderBottomColor: '#f1f5f9' 
//   },
//   headerTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' }
// });









// screens/wallet/PaymentWebView.jsx
// 💳 Paystack Payment Handler - Navigates to Wallet on Success

import React, { useState } from 'react';
import {
  StyleSheet, SafeAreaView, TouchableOpacity, Text,
  View, Alert, ActivityIndicator
} from 'react-native';
import { WebView } from 'react-native-webview';
import { X, CheckCircle } from 'lucide-react-native';

import apiClient from '../services/apiClient';

export default function PaymentWebView({ navigation, route }) {
  const { url, reference } = route.params || {};
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleNavigationStateChange = async (navState) => {
    // Check for Paystack success redirect
    if (
      navState.url.includes('callback') ||
      navState.url.includes('checkout-success') ||
      navState.url.includes('status=success')
    ) {
      setTimeout(() => verifyAndClose(), 1000);
    }
  };

  const verifyAndClose = async () => {
    if (verifying || !reference || verified) return;

    setVerifying(true);
    setVerified(true);

    try {
      await apiClient.post('/wallet/verify', { reference });

      Alert.alert(
        'Success! 🎉',
        'Your wallet has been funded successfully!',
        [
          {
            text: 'View Wallet',
            onPress: () => {
              // Navigate to Wallet with refresh flag
              navigation.reset({
                index: 0,
                routes: [
                  { name: 'Wallet', params: { refresh: true } }
                ],
              });
            }
          }
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Verification Error:', error);

      Alert.alert(
        'Verification Pending',
        'Your payment is being processed. Balance will update shortly.',
        [
          {
            text: 'Go to Wallet',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Wallet', params: { refresh: true } }],
              });
            }
          }
        ]
      );
    } finally {
      setVerifying(false);
    }
  };

  if (!url) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Invalid Payment Link</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Cancel Payment?',
              'Are you sure you want to cancel this payment?',
              [
                { text: 'No', style: 'cancel' },
                { text: 'Yes', onPress: () => navigation.goBack() }
              ]
            );
          }}
          disabled={verifying}
        >
          <X size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complete Payment</Text>
        {verifying ? (
          <ActivityIndicator size="small" color="#10B981" />
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      {verified ? (
        <View style={[styles.container, styles.centered]}>
          <CheckCircle size={64} color="#10B981" strokeWidth={2} />
          <Text style={styles.successText}>Payment Verified!</Text>
          <Text style={styles.successSubtext}>Redirecting to wallet...</Text>
        </View>
      ) : (
        <WebView
          source={{ uri: url }}
          onNavigationStateChange={handleNavigationStateChange}
          startInLoadingState={true}
          renderLoading={() => (
            <ActivityIndicator
              style={styles.loadingIndicator}
              size="large"
              color="#10B981"
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  header: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  loadingIndicator: { position: 'absolute', top: '50%', left: '45%' },
  errorText: { fontSize: 18, fontWeight: '700', color: '#EF4444', marginBottom: 20 },
  goBackButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: '#10B981',
    borderRadius: 12,
  },
  goBackText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  successText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#10B981',
    marginTop: 20,
  },
  successSubtext: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 8,
  },
});