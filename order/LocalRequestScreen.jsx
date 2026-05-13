import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';

// Services & Context
import { useAuth } from '../auth/AuthContext'; 
import { orderApi } from '../api/orderApi'; 
import apiClient from '../services/apiClient';

// Constants & Types
import { COLORS } from '../constants';

// Modular Step Components
import ScreenHeader from '../components/ScreenHeader';
import RouteStep from './components/RouteStep';
import ReceiverStep from './components/ReceiverStep';
import CargoStep from './components/CargoStep';
import QuoteStep from './components/QuoteStep';

const { width } = Dimensions.get('window');

/**
 * LocalRequestScreen
 * Multi-step wizard for local logistics.
 * Progress bar and back arrow removed per request.
 */
export default function LocalRequestScreen({ route, onBack }) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { currentUser, walletBalance, setWalletBalance, setOrders } = useAuth();
  
  // Extract cartData if user came from Agro Shop (Marketplace)
  const cartData = route?.params?.cartData || null;

  // 1. STATE DEFINITIONS
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [rec, setRec] = useState(null); 
  const slideAnim = useRef(new Animated.Value(0)).current;

  const [form, setForm] = useState({ 
    produce: cartData ? 'Commercial' : 'Vegetables', 
    boxSize: 'M',
    details: cartData ? ['Marketplace Order'] : ['Breakable Item'],
    qty: cartData ? String(cartData.items.length) : '', 
    weight: '',
    pickup: currentUser?.location || '', 
    dropoff: '',
    receiverName: '',
    receiverPhone: '',
    cargoImage: null,
    cargoImageBase64: null,
  });

  // 2. RESET LOGIC
  useEffect(() => {
    if (isFocused) {
      setStep(1);
      setRec(null);
      slideAnim.setValue(0);
    }
  }, [isFocused]);

  // 3. FETCH QUOTE (Backend Authority)
  const fetchQuote = async () => {
    setLoading(true);
    try {
      const payload = {
        pickupLocation: form.pickup,
        destination: form.dropoff,
        weight: String(form.weight || "0"), 
        isInternational: false, 
        items: cartData?.items || []
      };

      const response = await orderApi.getQuote(payload);
      setRec(response); 
    } catch (error) {
      console.error("Local Quote Error:", error.response?.data || error.message);
      Alert.alert("Error", "Could not calculate shipping.");
      prevStep();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 4 && !rec && !loading) {
      fetchQuote();
    }
  }, [step]);

  // 4. NAVIGATION LOGIC
  const nextStep = () => {
    if (step < 4) {
      const next = step + 1;
      setStep(next);
      Animated.timing(slideAnim, {
        toValue: -width * (next - 1),
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      const prev = step - 1;
      setStep(prev);
      Animated.timing(slideAnim, {
        toValue: -width * (prev - 1),
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      // Logic for when user is on step 1 and tries to go back
      onBack ? onBack() : navigation.goBack();
    }
  };

  // 5. FINAL ORDER SUBMISSION
  const handlePost = async () => {
    if (loading || !rec || !rec.totalAmount) {
      Alert.alert("Invalid Quote", "Please wait for the calculation to complete.");
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        pickupLocation: form.pickup,
        dropoffLocation: form.dropoff,
        produceType: form.produce,
        weight: String(form.weight || "0"),
        receiverName: form.receiverName,
        receiverPhone: form.receiverPhone,
        estimatedCost: rec.totalAmount, 
        items: cartData?.items || [],
        cargoImageBase64: form.cargoImageBase64 || null,
      };

      const endpoint = cartData ? '/orders/agro/checkout' : '/orders/local';
      const response = await apiClient.post(endpoint, orderPayload);
      
      if (response && response.data) {
        if (setWalletBalance && response.data.newBalance !== undefined) {
          setWalletBalance(response.data.newBalance); 
        }

        try {
            const updatedOrders = await orderApi.getMyOrders();
            if (setOrders) setOrders(updatedOrders);
        } catch (e) { 
          console.warn("Silent refresh failed"); 
        }
        
        const successData = {
          order: {
            id: response.data.id || response.data.orderId || 'PENDING',
            estimatedCost: rec.totalAmount,
            produceType: form.produce,
            weight: form.weight,
            pickupLocation: form.pickup,
            destination: form.dropoff,
            type: 'Local' 
          }
        };

        if (navigation && typeof navigation.replace === 'function') {
          navigation.replace('OrderSuccessScreen', successData);
        } else {
          navigation.navigate('OrderSuccessScreen', successData);
        }
      }
    } catch (error) {
      const serverMsg = error.response?.data?.message || "Transaction failed";
      Alert.alert("Payment Error", serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Updated ScreenHeader: 
          Removed back icon by not passing onBack or setting icon to null if your component supports it.
          Removed subtitle for a cleaner look.
      */}
      {/* <ScreenHeader 
        title={cartData ? "Market Checkout" : "New Delivery"} 
        showBack={false} // Assuming ScreenHeader has a toggle
        onBack={null}    // Disable back interaction
      /> */}
      
      {/* Progress Bar Removed From Here */}

      <Animated.View style={[styles.wizard, { transform: [{ translateX: slideAnim }] }]}>
        <View style={{ width }}>
          <RouteStep form={form} setForm={setForm} onNext={nextStep} isInternational={false} />
        </View>
        
        <View style={{ width }}>
          <ReceiverStep form={form} setForm={setForm} onNext={nextStep} isInternational={false} />
        </View>
        
        <View style={{ width }}>
          <CargoStep form={form} setForm={setForm} onNext={nextStep} cartData={cartData} isInternational={false} />
        </View>
        
        <View style={{ width }}>
          <QuoteStep 
            form={form} 
            rec={rec} 
            loading={loading} 
            onConfirm={handlePost} 
            onEdit={prevStep} 
            walletBalance={walletBalance}
            onTopUp={() => navigation.navigate('Wallet')}
            cartData={cartData} 
            isInternational={false}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  wizard: { 
    flexDirection: 'row', 
    width: width * 4, 
    flex: 1 
  }
});