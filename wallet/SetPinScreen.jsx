import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Alert, 
  SafeAreaView, ActivityIndicator, StatusBar 
} from 'react-native';
import Animated, { 
  useSharedValue, useAnimatedStyle, withTiming, withSequence, withRepeat 
} from 'react-native-reanimated';
import { ShieldCheck, Delete, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import apiClient from '../services/apiClient';

export default function SetPinScreen({ navigation }) {
  const { colors: Colors } = useTheme();
  
  // --- STATE ---
  const [Pin, setPin] = useState('');
  const [ConfirmPin, setConfirmPin] = useState('');
  const [IsConfirming, setIsConfirming] = useState(false);
  const [IsLoading, setIsLoading] = useState(false);
  
  const shakeOffset = useSharedValue(0);

  // --- LOGIC ---
  const handleFinalizePin = async () => {
    // 1. Validate first entry
    if (!IsConfirming) {
      if (Pin.length < 4) return;
      setIsConfirming(true);
      return;
    }

    // 2. Validate Match
    if (Pin !== ConfirmPin) {
      triggerShake();
      Alert.alert("Mismatch", "PINs do not match. Please try again.");
      setConfirmPin('');
      return;
    }

    // 3. API Call
    setIsLoading(true);
    try {
      const response = await apiClient.post('/wallet/set-pin', { 
        pin: Pin // Ensure your .NET DTO matches this key
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Security Set", "Your transaction PIN is now active.", [
          { text: "Perfect", onPress: () => navigation.goBack() }
        ]);
      }
    } catch (e) {
      console.error("Set PIN Error:", e);
      const errorMsg = e.response?.data?.message || "Connection failed. Please check your server.";
      Alert.alert("Error", errorMsg);
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  const triggerShake = () => {
    shakeOffset.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withRepeat(withTiming(10, { duration: 50 }), 3, true),
      withTiming(0, { duration: 50 })
    );
    // Reset confirmation if it fails
    if (IsConfirming) setConfirmPin('');
    else setPin('');
  };

  const animatedShake = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  const onPressNumber = (num) => {
    if (!IsConfirming) {
      if (Pin.length < 4) setPin(prev => prev + num);
    } else {
      if (ConfirmPin.length < 4) setConfirmPin(prev => prev + num);
    }
  };

  const onPressDelete = () => {
    if (!IsConfirming) setPin(prev => prev.slice(0, -1));
    else setConfirmPin(prev => prev.slice(0, -1));
  };

  const renderDot = (index) => {
    const currentVal = IsConfirming ? ConfirmPin : Pin;
    const isActive = currentVal.length > index;
    return (
      <View key={index} style={[styles.Dot, { 
        backgroundColor: isActive ? '#99e2b4' : 'rgba(255,255,255,0.1)',
        borderColor: isActive ? '#99e2b4' : '#555',
        transform: [{ scale: isActive ? 1.2 : 1 }]
      }]} />
    );
  };

  const currentPinLength = IsConfirming ? ConfirmPin.length : Pin.length;

  return (
    <SafeAreaView style={[styles.Container, { backgroundColor: '#002d1a' }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.BackBtn} 
        onPress={() => IsConfirming ? setIsConfirming(false) : navigation.goBack()}
      >
        <ArrowLeft color="#99e2b4" size={24} />
      </TouchableOpacity>

      <View style={styles.Header}>
        <ShieldCheck color="#99e2b4" size={54} strokeWidth={1.5} />
        <Text style={styles.Title}>
          {IsConfirming ? "Confirm PIN" : "Transaction PIN"}
        </Text>
        <Text style={styles.Subtitle}>
          {IsConfirming 
            ? "Repeat the 4-digit code to confirm." 
            : "Create a security code for your RieRa withdrawals."}
        </Text>
      </View>

      <Animated.View style={[styles.DotsContainer, animatedShake]}>
        {[0, 1, 2, 3].map(renderDot)}
      </Animated.View>

      <View style={styles.Keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <TouchableOpacity 
            key={num} 
            style={styles.Key} 
            onPress={() => onPressNumber(num)}
            disabled={IsLoading}
          >
            <Text style={styles.KeyText}>{num}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.Key} /> 
        <TouchableOpacity 
          style={styles.Key} 
          onPress={() => onPressNumber(0)}
          disabled={IsLoading}
        >
          <Text style={styles.KeyText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.Key} 
          onPress={onPressDelete}
          disabled={IsLoading}
        >
          <Delete color="#fff" size={28} />
        </TouchableOpacity>
      </View>

      <View style={styles.Footer}>
        <TouchableOpacity 
          style={[
            styles.SubmitButton, 
            { backgroundColor: currentPinLength === 4 ? '#99e2b4' : 'rgba(153, 226, 180, 0.1)' }
          ]} 
          onPress={handleFinalizePin}
          disabled={currentPinLength < 4 || IsLoading}
        >
          {IsLoading ? (
            <ActivityIndicator color="#002d1a" />
          ) : (
            <Text style={[styles.SubmitText, { color: currentPinLength === 4 ? '#002d1a' : '#666' }]}>
              {IsConfirming ? "VERIFY & SAVE" : "NEXT STEP"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: { flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20 },
  BackBtn: { alignSelf: 'flex-start', marginLeft: 25, marginTop: 10, padding: 10 },
  Header: { alignItems: 'center', paddingHorizontal: 40 },
  Title: { fontSize: 28, fontWeight: '900', color: '#fff', marginTop: 10, letterSpacing: 0.5 },
  Subtitle: { fontSize: 14, color: '#a0a0a0', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  DotsContainer: { flexDirection: 'row', gap: 20, marginVertical: 30 },
  Dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5 },
  Keypad: { flexDirection: 'row', flexWrap: 'wrap', width: '85%', justifyContent: 'center' },
  Key: { width: '33%', height: 75, alignItems: 'center', justifyContent: 'center' },
  KeyText: { color: '#fff', fontSize: 32, fontWeight: '500' },
  Footer: { width: '100%', paddingHorizontal: 40, marginBottom: 20 },
  SubmitButton: { 
    height: 60, 
    borderRadius: 18, 
    justifyContent: 'center', 
    alignItems: 'center',
    width: '100%'
  },
  SubmitText: { fontSize: 15, fontWeight: '900', letterSpacing: 1.2 }
});