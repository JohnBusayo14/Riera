import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { OrderStatus, TransportMode, Incoterms, ProduceType } from '../types';
import ScreenHeader from '../components/ScreenHeader';
import { COLORS } from '../constants';
import apiClient from '../services/apiClient';
import { useAuth } from '../auth/AuthContext';
import { orderApi } from '../api/orderApi';

// Modular Step Components
import RouteStep from './components/RouteStep';
import ReceiverStep from './components/ReceiverStep';
import CargoStep from './components/CargoStep'; 
import QuoteStep from './components/QuoteStep';

const { width } = Dimensions.get('window');

export default function InternationalRequestScreen({ 
  onBack, 
  cartData = null 
}) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { currentUser, setOrders, setWalletBalance } = useAuth(); 
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [walletBalanceLocal, setWalletBalanceLocal] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // 1. INITIAL STATE
  const [form, setForm] = useState({ 
    pickup: currentUser?.location || '',
    destination: '',
    produce: cartData ? 'Commercial' : ProduceType.YAMS,
    weight: '',
    volume: '',          
    boxSize: '20ft',
    hsCode: '',          
    incoterm: Incoterms.FOB,
    transportMode: TransportMode.SEA,
    cargoImageBase64: null,
    receiverName: '',
    receiverEmail: '',
    receiverPhone: '',
    receiverAddress: '',
  });

  // Reset step logic when screen comes into focus
  useEffect(() => {
    if (isFocused) {
      setStep(1);
      slideAnim.setValue(0);
    }
  }, [isFocused]);

  // Fetch Wallet Balance and Sync Global Context
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await apiClient.get('/wallet/balance');
        const balance = response.data?.balance ?? response.data;
        setWalletBalanceLocal(Number(balance));
        if (setWalletBalance) setWalletBalance(Number(balance));
      } catch (err) {
        console.error("Balance fetch error", err);
      }
    };
    if (isFocused) fetchBalance();
  }, [isFocused]);

  const nextStep = () => {
    if (step < 4) {
      const nextIdx = step;
      setStep(step + 1);
      Animated.timing(slideAnim, {
        toValue: -width * nextIdx,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      Animated.timing(slideAnim, {
        toValue: -width * (step - 2),
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      onBack ? onBack() : navigation.goBack();
    }
  };

 
/**
   * HANDLE POST
   * [cite: 2026-01-09] All calculations are done in the backend.
   * This sends the validated quote back to the server for debiting and order creation.
   */
  const handlePost = async (serverQuote) => {
    // 1. Validate that we have a valid quote from the backend before proceeding
    if (loading || !serverQuote || !serverQuote.totalAmount || serverQuote.totalAmount <= 0) {
      Alert.alert("Invalid Quote", "Please wait for the price calculation to complete.");
      return;
    }

    setLoading(true);

    try {
      // Structure matches the CreateInternationalOrderRequest DTO in your C# backend
      const payload = {
        pickupLocation: form.pickup,
        destinationCountry: form.destination, // Matches the backend property name
        produceType: form.produce,
        weight: String(form.weight || "0"),
        receiverName: form.receiverName,
        receiverPhone: form.receiverPhone,
        
        // CRITICAL: Send the totalAmount calculated by the backend.
        // The backend uses this to verify the wallet debit amount.
        estimatedCost: serverQuote.totalAmount, 

        // Metadata for the order model
        items: cartData?.items || [],
        cargoImageBase64: form.cargoImageBase64 || null,
        isInternational: true
      };

      // Determine endpoint: Use marketplace checkout if cartData exists, otherwise standalone export
      const endpoint = cartData ? '/orders/agro/checkout' : '/orders/international';
      
      const response = await apiClient.post(endpoint, payload);

      // 2. DEFENSIVE CHECK: Ensure response and response.data exist to avoid "undefined" crash
      if (response && response.data) {
        
        // 3. Update Global Wallet Balance immediately if the backend returned the new balance
        if (setWalletBalance && response.data.newBalance !== undefined) {
          setWalletBalance(response.data.newBalance);
        }

        // 4. Background refresh of the orders list
        try {
          const updatedOrders = await orderApi.getMyOrders();
          if (setOrders) setOrders(updatedOrders);
        } catch (refreshErr) {
          console.warn("Orders list refresh failed, but order was successfully placed.");
        }

        // 5. SUCCESS NAVIGATION
        // Use .replace to remove the form from the navigation stack (prevents double-billing)
        navigation.replace('OrderSuccessScreen', {
          order: {
            id: response.data.id || response.data.orderId || 'PENDING',
            estimatedCost: serverQuote.totalAmount,
            produceType: form.produce,
            weight: form.weight,
            pickupLocation: form.pickup,
            destination: form.destination,
            type: 'International' // Correctly identifies the order type for the success theme
          }
        });
      }
    } catch (error) {
      // 6. IMPROVED ERROR HANDLING: Prevents "Submission Error: undefined"
      console.error("International Submission Error:", error.response?.data || error.message);
      
      let errorMessage = "An unexpected error occurred. Check your connection and try again.";
      
      if (error.response) {
        // Handle specific backend validation/balance errors
        errorMessage = error.response.data?.message || error.response.data?.title || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Transaction Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* <ScreenHeader 
        title={cartData ? "Market Checkout" : "Global Export"} 
        subtitle={`Step ${step} of 4`}
        onBack={prevStep} 
      />
      
      <View style={styles.progressBg}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${(step / 4) * 100}%`,
              backgroundColor: COLORS.international 
            }
          ]} 
        />
      </View> */}

      <Animated.View style={[styles.wizard, { transform: [{ translateX: slideAnim }] }]}>
        <View style={{ width }}>
          <RouteStep 
            form={form} 
            setForm={setForm} 
            onNext={nextStep} 
            isInternational={true} 
          />
        </View>
        
        <View style={{ width }}>
          <ReceiverStep 
            form={form} 
            setForm={setForm} 
            onNext={nextStep} 
            isInternational={true} 
          />
        </View>

        <View style={{ width }}>
          <CargoStep 
            form={form} 
            setForm={setForm} 
            onNext={nextStep} 
            isInternational={true}
            cartData={cartData} 
          />
        </View>

        <View style={{ width }}>
          <QuoteStep 
            form={form}
            loading={loading} 
            onConfirm={handlePost} 
            onEdit={prevStep} 
            walletBalance={walletBalanceLocal}
            onTopUp={() => navigation.navigate('Wallet')}
            isInternational={true} 
            cartData={cartData} 
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  progressBg: { 
    height: 6, 
    backgroundColor: '#f1f5f9', 
    marginHorizontal: 25, 
    marginTop: 10, 
    borderRadius: 10 
  },
  progressFill: { 
    height: '100%', 
    borderRadius: 10 
  }, 
  wizard: { 
    flexDirection: 'row', 
    width: width * 4, 
    flex: 1 
  }
});