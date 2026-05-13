import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import ContactInfoStep from './steps/ContactInfoStep';
import CargoDetailStep from './steps/CargoDetailStep'; // This is what we want to skip
import QuoteStep from './steps/QuoteStep';
import { COLORS } from '../constants';

export default function UnifiedRequestScreen({ route, onBack, onSubmit, user }) {
  // 1. Check if this is a Shop order by looking at the params we passed in AppContent
  const cartData = route?.params?.cartData;
  const isAgroOrder = !!cartData;

  // 2. DYNAMICALLY GENERATE STEPS ARRAY
  // We use the spread operator to conditionally add the Cargo step
  const steps = [
    { id: 'contact', title: 'Delivery Address', component: ContactInfoStep },
    // Only include Cargo Detail if it is NOT an agro order
    ...(!isAgroOrder ? [{ id: 'cargo', title: 'Item Details', component: CargoDetailStep }] : []),
    { id: 'quote', title: 'Payment Summary', component: QuoteStep }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 3. PRE-FILL FORM DATA
  // If it's an Agro order, we inject the cart weight and items immediately
  const [formData, setFormData] = useState({
    sender: { name: "AgroStore", phone: "System" }, // Pickup is from store
    receiver: {},
    cargo: isAgroOrder ? { 
      weight: cartData.totalWeight, 
      description: `Agro Purchase: ${cartData.items.map(i => i.name).join(', ')}`,
      items: cartData.items 
    } : {}
  });

  const CurrentStep = steps[currentIndex].component;

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onSubmit(formData);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      onBack();
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backLink}>Back</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>{steps[currentIndex].title}</Text>
          <Text style={styles.subtitle}>Step {currentIndex + 1} of {steps.length}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Step Content */}
      <View style={styles.stepContent}>
        <CurrentStep 
          data={formData} 
          cartData={cartData} // Pass the cart details to the Quote/Step components
          onUpdate={(newData) => setFormData({ ...formData, ...newData })} 
        />
      </View>

      {/* Bottom Action */}
      <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
        <Text style={styles.nextBtnText}>
          {currentIndex === steps.length - 1 ? 'Pay & Complete' : 'Continue'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 20, 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderColor: '#f1f5f9',
    paddingTop: 40 
  },
  title: { fontSize: 18, fontWeight: '900', textAlign: 'center', color: '#1e293b' },
  subtitle: { fontSize: 12, color: COLORS.slate400, textAlign: 'center' },
  backLink: { color: COLORS.primary, fontWeight: '700' },
  stepContent: { flex: 1, padding: 20 },
  nextBtn: { backgroundColor: COLORS.primary, margin: 20, padding: 18, borderRadius: 15, alignItems: 'center' },
  nextBtnText: { color: 'white', fontWeight: '900', fontSize: 16 }
});