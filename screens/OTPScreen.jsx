
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants';
import Button from '../components/Button';
import ScreenHeader from '../components/ScreenHeader';

export default function OTPScreen({ phone, onVerify, onBack }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Enter Phone, 2: Enter OTP
  const [loading, setLoading] = useState(false);

  const handleRequestOTP = () => {
    if (phoneNumber.length < 10) return;
    setLoading(true);
    // Simulate sending SMS
    setTimeout(() => {
      setStep(2);
      setLoading(false);
    }, 1500);
  };

  const handleVerifyOTP = () => {
    if (otp.length < 4) return;
    setLoading(true);
    // Simulate verifying code
    setTimeout(() => {
      onVerify();
      setLoading(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Phone Verification" onBack={onBack} />
      
      <View style={styles.content}>
        <Text style={styles.title}>
          {step === 1 ? "Enter your phone number 📱" : "Verify your number ✅"}
        </Text>
        <Text style={styles.subtitle}>
          {step === 1 
            ? "We'll send a 4-digit code to verify your identity and secure your account." 
            : `Enter the code we sent to your number ending in ${phoneNumber.slice(-4)}`}
        </Text>

        {step === 1 ? (
          <View style={styles.inputContainer}>
            <View style={styles.prefix}>
              <Text style={styles.prefixText}>+234</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="801 234 5678"
              keyboardType="phone-pad"
              maxLength={10}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              autoFocus
            />
          </View>
        ) : (
          <View style={styles.otpContainer}>
            <TextInput
              style={styles.otpInput}
              placeholder="0 0 0 0"
              keyboardType="number-pad"
              maxLength={4}
              value={otp}
              onChangeText={setOtp}
              letterSpacing={20}
              autoFocus
            />
          </View>
        )}

        <Button 
          title={step === 1 ? "Send Code" : "Verify Code"} 
          onPress={step === 1 ? handleRequestOTP : handleVerifyOTP} 
          loading={loading}
          style={styles.btn}
        />

        {step === 2 && (
          <TouchableOpacity style={styles.resend} onPress={() => setStep(1)}>
            <Text style={styles.resendText}>Change number or resend?</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  content: { padding: 30, flex: 1, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '900', color: COLORS.slate900, marginBottom: 12 },
  subtitle: { fontSize: 16, color: COLORS.slate400, marginBottom: 40, lineHeight: 24 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 20 },
  prefix: { borderRightWidth: 1, borderRightColor: '#e2e8f0', paddingRight: 15, marginRight: 15 },
  prefixText: { fontWeight: 'bold', color: COLORS.slate700, fontSize: 18 },
  input: { flex: 1, paddingVertical: 20, fontSize: 18, fontWeight: '700', color: COLORS.slate900 },
  otpContainer: { alignItems: 'center' },
  otpInput: { fontSize: 32, fontWeight: '900', borderBottomWidth: 2, borderBottomColor: COLORS.primary, width: '60%', textAlign: 'center', paddingVertical: 10 },
  btn: { marginTop: 40 },
  resend: { marginTop: 25, alignItems: 'center' },
  resendText: { color: COLORS.primary, fontWeight: '700' }
});
