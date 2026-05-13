
// import React, { useState, useRef } from 'react';
// import { View, StyleSheet, Animated, Dimensions } from 'react-native';
// import { OrderStatus } from '../types';
// import { getLogisticsRecommendation } from '../services/geminiService';
// import ScreenHeader from '../components/ScreenHeader';

// // Modular Step Components
// import RouteStep from './components/RouteStep';
// import ReceiverStep from './components/ReceiverStep';
// import CargoStep from './components/CargoStep';
// import QuoteStep from './components/QuoteStep';

// const { width } = Dimensions.get('window');

// export default function LocalRequestScreen({ user, onBack, onSubmit }) {
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [rec, setRec] = useState(null);
//   const slideAnim = useRef(new Animated.Value(0)).current;

//   const [form, setForm] = useState({ 
//     produce: 'Vegetables', 
//     boxSize: 'M',
//     details: ['Breakable Item'],
//     qty: '', 
//     weight: '',
//     pickup: user.location || '', 
//     dropoff: '',
//     receiverName: '',
//     receiverPhone: '',
//   });

//   const nextStep = () => {
//     if (step < 4) {
//       setStep(step + 1);
//       Animated.timing(slideAnim, {
//         toValue: -width * step,
//         duration: 400,
//         useNativeDriver: true,
//       }).start();
      
//       // If moving to quote step, trigger AI
//       if (step === 3) getQuote();
//     }
//   };

//   const prevStep = () => {
//     if (step > 1) {
//       setStep(step - 1);
//       Animated.timing(slideAnim, {
//         toValue: -width * (step - 2),
//         duration: 400,
//         useNativeDriver: true,
//       }).start();
//     } else {
//       onBack();
//     }
//   };

//   const getQuote = async () => {
//     setLoading(true);
//     const result = await getLogisticsRecommendation({
//       produceType: form.produce,
//       quantity: form.qty,
//       weight: form.weight,
//       pickup: form.pickup,
//       dropoff: form.dropoff
//     });
//     setRec(result);
//     setLoading(false);
//   };

//   const handlePost = () => {
//     onSubmit({
//       id: `LOC-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
//       customerId: user.id,
//       shipper: { name: user.name, phone: user.phone, address: form.pickup },
//       consignee: { name: form.receiverName, phone: form.receiverPhone, address: form.dropoff },
//       cargo: { type: form.produce, boxSize: form.boxSize, details: form.details, weight: form.weight },
//       status: OrderStatus.PENDING,
//       estimatedCost: rec?.estimatedPrice || 25000,
//       timestamp: Date.now(),
//       isInternational: false,
//       ...form
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <ScreenHeader title="New Order" onBack={prevStep} />
      
//       <View style={styles.progressBg}>
//         <View style={[styles.progressFill, { width: `${(step / 4) * 100}%` }]} />
//       </View>

//       <Animated.View style={[styles.wizard, { transform: [{ translateX: slideAnim }] }]}>
//         <RouteStep form={form} setForm={setForm} onNext={nextStep} />
//         <ReceiverStep form={form} setForm={setForm} onNext={nextStep} />
//         <CargoStep form={form} setForm={setForm} onNext={nextStep} />
//         <QuoteStep rec={rec} loading={loading} onConfirm={handlePost} onEdit={prevStep} />
//       </Animated.View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'white' },
//   progressBg: { height: 6, backgroundColor: '#f1f5f9' },
//   progressFill: { height: '100%', backgroundColor: '#166534' },
//   wizard: { flexDirection: 'row', width: width * 4, flex: 1 }
// });
