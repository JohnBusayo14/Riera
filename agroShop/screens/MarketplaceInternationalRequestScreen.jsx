
import React, { useState, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Alert } from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';
import { COLORS } from '../../constants';
import apiClient from '../../services/apiClient'; // Ensure this is imported

// Modular Step Components
import RouteStep from '../../order/components/RouteStep';
import ReceiverStep from '../../order/components/ReceiverStep';
import MarketplaceQuoteStep from '../components/MarketplaceQuoteStep';

const { width } = Dimensions.get('window');

export default function MarketplaceInternationalRequestScreen({ 
  route, 
  onBack, 
  walletBalance,
  navigation,
  onNavigateToWallet 
}) {
  const { cartData } = route.params || {};

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false); 
  const slideAnim = useRef(new Animated.Value(0)).current;

  const [form, setForm] = useState({ 
    hub: 'Export Terminal A',
    destination: '', 
    weight: cartData?.totalWeight?.toString() || '0',
    items: cartData?.items || [],
    isInternational: true,
    receiverName: '',
    receiverPhone: '',
    receiverEmail: '',
    address: '' 
  });

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
      Animated.timing(slideAnim, {
        toValue: -width * step,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      const newStep = step - 1;
      setStep(newStep);
      Animated.timing(slideAnim, {
        toValue: -width * (newStep - 1),
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      onBack();
    }
  };

  /**
   * handleFinalSubmit
   * Updated to match C# AgroCheckoutRequest DTO requirements perfectly.
   */
  const handleFinalSubmit = async (quoteData) => {
    if (loading) return;
    
    setLoading(true);

    try {
      // 🟢 1. Align with C# PascalCase properties
      // 🟢 2. Send the object directly (No 'request' wrapper)
      const payload = {
        Items: (cartData?.items || form.items).map(item => ({
          ProductId: item.productId,
          Name: item.name || "Product",
          Qty: Math.floor(Number(item.qty || item.quantity || 1)), // Must be integer
          Price: parseFloat(item.price || 0),
          Weight: String(item.weight).includes('kg') ? item.weight : `${item.weight}kg`,
          ImageUrl: item.imageUrl || "",
          GaugeLabel: item.gaugeLabel || ""
        })),
        DeliveryAddress: form.address || form.destination, 
        ReceiverName: form.receiverName,
        ReceiverPhone: form.receiverPhone,
        
        // Required strings from your C# class to avoid validation errors
        Weight: String(form.weight || "0"),
        ProduceType: "Marketplace International",
        Incoterms: "CIF", 
        Origin: "Nigeria",

        IsInternational: true,
        LogisticsCost: parseFloat(quoteData?.logisticsCost || 0),
        CustomsClearingCost: parseFloat(quoteData?.customsClearingCost || 0),
        
        // Triggers the backend InternalDebitLogic
        TotalAmount: parseFloat(quoteData?.totalAmount || 0),
        PaymentMethod: "Wallet"
      };

      console.log("📡 Sending International Payload:", JSON.stringify(payload));

      const response = await apiClient.post('/orders/agro/checkout', payload);

      if (response.status === 200 || response.status === 201) {
        // Navigate to success
        navigation.navigate('OrderSuccessScreen', {
          orderId: response.data?.orderId || 'SUCCESS',
          amount: quoteData.totalAmount
        });
      }
      
    } catch (err) {
      console.error("❌ Checkout Error:", err.response?.data || err.message);
      Alert.alert(
        "Payment Failed", 
        err.response?.data?.message || "Ensure you have sufficient funds in your wallet."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* <ScreenHeader 
        title={step === 3 ? "Payment & Review" : "International Export"} 
        onBack={prevStep} 
      />
      
      <View style={styles.progressBg}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${(step / 3) * 100}%`,
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
          <MarketplaceQuoteStep 
            form={form} 
            cartData={cartData}
            isInternational={true}
            walletBalance={walletBalance}
            onTopUp={() => navigation.navigate('Wallet')}
            onConfirm={handleFinalSubmit} 
            onEdit={() => {
              setStep(1);
              Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
            }} 
            
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  progressBg: { height: 4, backgroundColor: '#f1f5f9', width: '100%' },
  progressFill: { height: '100%' },
  wizard: { flexDirection: 'row', flex: 1, width: width * 3 }
});