
// // import React, { useState } from 'react';
// // import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
// // import { ProduceType, OrderStatus, TransportMode, Incoterms, PackagingType } from '../types';
// // import { COLORS } from '../constants';
// // import { getLogisticsRecommendation } from '../services/geminiService';
// // import Input from '../components/Input';
// // import Button from '../components/Button';
// // import ScreenHeader from '../components/ScreenHeader';
// // import Card from '../components/Card';

// // export default function InternationalRequestScreen({ user, onBack, onSubmit }) {
// //   const [loading, setLoading] = useState(false);
// //   const [rec, setRec] = useState(null);
// //   const [form, setForm] = useState({ 
// //     produce: ProduceType.YAMS, 
// //     qty: '', 
// //     weight: '',
// //     volume: '',
// //     packaging: PackagingType.PALLET,
// //     pickup: '', 
// //     destination: 'United Kingdom',
// //     portOrigin: 'Apapa Port, Lagos',
// //     portDest: 'Port of London',
// //     hsCode: '',
// //     incoterm: Incoterms.FOB,
// //     transport: TransportMode.SEA,
// //     insuranceRequired: true
// //   });

// //   const getQuote = async () => {
// //     if (!form.qty || !form.pickup || !form.destination) return;
// //     setLoading(true);
// //     const result = await getLogisticsRecommendation({
// //       ...form,
// //       produceType: form.produce,
// //       isInternational: true
// //     });
// //     setRec(result);
// //     setLoading(false);
// //   };

// //   const handlePost = () => {
// //     onSubmit({
// //       id: `EXP-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
// //       customerId: user.id,
// //       ...form,
// //       status: OrderStatus.PENDING,
// //       estimatedCost: rec?.estimatedPrice || 850000,
// //       timestamp: Date.now(),
// //       isInternational: true
// //     });
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <ScreenHeader title="Global Export Dashboard" onBack={onBack} />
      
// //       <ScrollView contentContainerStyle={styles.scroll}>
// //         <View style={styles.form}>
          
// //           <Text style={styles.sectionHeader}>1. CARGO & COMMODITY</Text>
// //           <View style={styles.row}>
// //             <View style={{flex: 1}}>
// //               <Text style={styles.label}>PRODUCE</Text>
// //               <View style={styles.smallSelector}><Text style={styles.typeText}>{form.produce}</Text></View>
// //             </View>
// //             <View style={{flex: 1}}>
// //               <Input label="HS CODE (OPTIONAL)" placeholder="e.g. 0714" value={form.hsCode} onChangeText={t => setForm({...form, hsCode: t})} />
// //             </View>
// //           </View>

// //           <View style={styles.row}>
// //              <Input style={{flex: 1}} label="WEIGHT (KG)" value={form.weight} keyboardType="numeric" onChangeText={t => setForm({...form, weight: t})} />
// //              <Input style={{flex: 1}} label="VOLUME (CBM)" value={form.volume} keyboardType="numeric" onChangeText={t => setForm({...form, volume: t})} />
// //           </View>
          
// //           <Text style={styles.sectionHeader}>2. SHIPPING ROUTE</Text>
// //           <Input label="WAREHOUSE PICKUP (NIGERIA)" value={form.pickup} onChangeText={t => setForm({...form, pickup: t})} />
// //           <Input label="PORT OF ORIGIN" value={form.portOrigin} onChangeText={t => setForm({...form, portOrigin: t})} />
// //           <View style={styles.row}>
// //              <Input style={{flex: 1}} label="DESTINATION" value={form.destination} onChangeText={t => setForm({...form, destination: t})} />
// //              <Input style={{flex: 1}} label="FINAL PORT" value={form.portDest} onChangeText={t => setForm({...form, portDest: t})} />
// //           </View>

// //           <Text style={styles.sectionHeader}>3. COMPLIANCE & TERMS</Text>
// //           <View style={styles.row}>
// //              <View style={{flex: 1}}>
// //                 <Text style={styles.label}>INCOTERM</Text>
// //                 <View style={styles.smallSelector}><Text style={styles.smallTypeText}>{form.incoterm}</Text></View>
// //              </View>
// //              <View style={{flex: 1}}>
// //                 <Text style={styles.label}>MODE</Text>
// //                 <View style={styles.smallSelector}><Text style={styles.smallTypeText}>{form.transport}</Text></View>
// //              </View>
// //           </View>

// //           <View style={styles.insuranceRow}>
// //              <Text style={styles.insuranceLabel}>Global Cargo Insurance Required?</Text>
// //              <Switch 
// //                 value={form.insuranceRequired} 
// //                 onValueChange={v => setForm({...form, insuranceRequired: v})} 
// //                 trackColor={{ true: COLORS.international }}
// //              />
// //           </View>

// //           {!rec ? (
// //             <Button 
// //               title="Generate Export Quote 🌐" 
// //               onPress={getQuote} 
// //               loading={loading}
// //               style={styles.quoteBtn} 
// //             />
// //           ) : (
// //             <Card style={styles.recCard}>
// //               <View style={styles.recHeader}>
// //                  <Text style={styles.recPrice}>₦{rec.estimatedPrice.toLocaleString()}</Text>
// //                  <Text style={styles.recTime}>{rec.estimatedTime}</Text>
// //               </View>
// //               <Text style={styles.recVehicle}>Method: {rec.recommendedVehicle}</Text>
// //               <Text style={styles.recAdvice}>{rec.specialAdvice}</Text>
              
// //               {rec.documentRequirements && (
// //                 <View style={styles.docs}>
// //                    <Text style={styles.docsTitle}>Required Documents:</Text>
// //                    {rec.documentRequirements.map((doc, i) => (
// //                      <Text key={i} style={styles.docItem}>• {doc}</Text>
// //                    ))}
// //                 </View>
// //               )}

// //               <Button title="Proceed to Custom Clearing" onPress={handlePost} style={styles.submitBtn} />
// //             </Card>
// //           )}
// //         </View>
// //       </ScrollView>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#fcfcfc' },
// //   scroll: { paddingBottom: 60 },
// //   form: { padding: 20, gap: 4 },
// //   sectionHeader: { fontSize: 11, fontWeight: '900', color: COLORS.international, marginTop: 25, marginBottom: 12, letterSpacing: 1.5, textTransform: 'uppercase' },
// //   label: { fontSize: 10, fontWeight: '800', color: COLORS.slate400, marginBottom: 8, letterSpacing: 1 },
// //   row: { flexDirection: 'row', gap: 12 },
// //   smallSelector: { backgroundColor: '#f1f5f9', padding: 15, borderRadius: 12, marginBottom: 16 },
// //   typeText: { fontSize: 14, fontWeight: '700', color: COLORS.slate700 },
// //   smallTypeText: { fontSize: 12, fontWeight: '700', color: COLORS.slate700 },
// //   insuranceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#eff6ff', padding: 15, borderRadius: 16, marginTop: 10 },
// //   insuranceLabel: { fontWeight: '700', color: COLORS.international, fontSize: 13 },
// //   quoteBtn: { marginTop: 30, backgroundColor: COLORS.international },
// //   recCard: { backgroundColor: '#f0f9ff', borderStyle: 'solid', borderColor: '#bae6fd', marginTop: 20 },
// //   recHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
// //   recPrice: { fontSize: 24, fontWeight: '900', color: COLORS.international },
// //   recTime: { fontSize: 12, fontWeight: '700', color: COLORS.slate400 },
// //   recVehicle: { fontWeight: '700', color: COLORS.slate900, marginTop: 4 },
// //   recAdvice: { fontSize: 12, color: COLORS.slate700, fontStyle: 'italic', marginTop: 8 },
// //   docs: { marginTop: 15, backgroundColor: 'white', padding: 12, borderRadius: 12 },
// //   docsTitle: { fontSize: 11, fontWeight: '900', color: COLORS.slate400, marginBottom: 5 },
// //   docItem: { fontSize: 11, color: COLORS.slate700, marginBottom: 2 },
// //   submitBtn: { marginTop: 20, backgroundColor: COLORS.international },
// // });


// import React, { useState, useRef } from 'react';
// import { View, StyleSheet, Animated, Dimensions } from 'react-native';
// import { OrderStatus, TransportMode, Incoterms, PackagingType, ProduceType } from '../types';
// import { getLogisticsRecommendation } from '../services/geminiService';
// import ScreenHeader from '../components/ScreenHeader';
// import { COLORS } from '../constants';

// // Modular Step Components
// import RouteStep from './components/RouteStep';
// import ReceiverStep from './components/ReceiverStep';
// import InternationalCargoStep from './components/InternationalCargoStep'; // Using the specialized component
// import QuoteStep from './components/QuoteStep';

// const { width } = Dimensions.get('window');

// export default function InternationalRequestScreen({ user, onBack, onSubmit, walletBalance, onNavigateToWallet }) {
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [rec, setRec] = useState(null);
//   const slideAnim = useRef(new Animated.Value(0)).current;

//   // Comprehensive Form State mapped to Backend requirements
//   const [form, setForm] = useState({ 
//     // Location Data
//     pickupLocation: user.location || '', 
//     destinationCountry: '', 
    
//     // Cargo Details
//     produceType: ProduceType.YAMS, 
//     weight: '',
//     volume: '',
//     containerSize: '20ft',
//     hsCode: '',
//     cargoImageBase64: null,

//     // Shipping Logistics
//     incoterm: Incoterms.FOB,
//     transportMode: TransportMode.SEA,
//     insuranceRequired: true,
    
//     // Consignee (Receiver) Details
//     consigneeName: '',
//     consigneeEmail: '',
//     consigneePhone: '',
//     consigneeAddress: '',

//     // Legacy/Local compatibility (if needed by sub-components)
//     pickup: user.location || '',
//     destination: '', 
//   });

//   const nextStep = () => {
//     if (step < 4) {
//       const newStep = step + 1;
//       setStep(newStep);
//       Animated.timing(slideAnim, {
//         toValue: -width * step,
//         duration: 400,
//         useNativeDriver: true,
//       }).start();
      
//       if (newStep === 4) getQuote();
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
//     try {
//       const result = await getLogisticsRecommendation({
//         ...form,
//         isInternational: true
//       });
//       setRec(result);
//     } catch (error) {
//       console.error("AI Quote Error:", error);
//       // Fallback defaults
//       setRec({
//         estimatedPrice: 1200000,
//         estimatedTime: "14-21 Days",
//         recommendedVehicle: "Maersk Shared Container",
//         specialAdvice: "Ensure phytosanitary certificates are attached."
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePost = () => {
//     // Final data structure combining UI form and AI results for the backend
//     const finalData = {
//       // Backend Identity
//       id: `INT-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
//       customerId: user.id,
//       status: OrderStatus.PENDING,
//       isInternational: true,
//       timestamp: Date.now(),

//       // Form Data
//       ...form,

//       // AI Result Data
//       estimatedCost: rec?.estimatedPrice || 0,
//       recommendedVehicle: rec?.recommendedVehicle,
//       specialAdvice: rec?.specialAdvice,
//       estimatedTime: rec?.estimatedTime,
      
//       // Ensure specific naming for API mapping
//       pickupLocation: form.pickup, 
//       destinationCountry: form.destination,
//     };

//     onSubmit(finalData);
//   };

//   return (
//     <View style={styles.container}>
//       <ScreenHeader title="Global Export" onBack={prevStep} />
      
//       <View style={styles.progressBg}>
//         <View style={[styles.progressFill, { width: `${(step / 4) * 100}%` }]} />
//       </View>

//       <Animated.View style={[styles.wizard, { transform: [{ translateX: slideAnim }] }]}>
//         {/* STEP 1: ROUTE (Updates pickup & destination) */}
//         <RouteStep 
//           form={form} 
//           setForm={setForm} 
//           onNext={nextStep} 
//           isInternational={true} 
//         />

//         {/* STEP 2: RECEIVER (Updates consignee info) */}
//         <ReceiverStep 
//           form={form} 
//           setForm={setForm} 
//           onNext={nextStep} 
//           isInternational={true} 
//         />

//         {/* STEP 3: INTERNATIONAL CARGO (HS Code, Incoterms, Volume, Transport) */}
//         <InternationalCargoStep 
//           form={form} 
//           setForm={setForm} 
//           onNext={nextStep} 
//         />

//         {/* STEP 4: QUOTE & PAYMENT */}
//         <QuoteStep 
//           rec={rec} 
//           loading={loading} 
//           onConfirm={handlePost} 
//           onEdit={prevStep} 
//           walletBalance={walletBalance}
//           onTopUp={onNavigateToWallet}
//           isInternational={true} 
//         />
//       </Animated.View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'white' },
//   progressBg: { 
//     height: 6, 
//     backgroundColor: '#f1f5f9', 
//     marginHorizontal: 25, 
//     marginTop: 10, 
//     borderRadius: 10 
//   },
//   progressFill: { 
//     height: '100%', 
//     backgroundColor: COLORS.international, 
//     borderRadius: 10 
//   },
//   wizard: { 
//     flexDirection: 'row', 
//     width: width * 4, 
//     flex: 1 
//   }
// });