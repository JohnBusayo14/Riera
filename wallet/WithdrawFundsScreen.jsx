// import React, { useState, useCallback } from 'react';
// import { 
//   View, Text, StyleSheet, TouchableOpacity, ScrollView, 
//   Alert, SafeAreaView, StatusBar, Modal, TextInput, ActivityIndicator,
// } from 'react-native';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import { 
//   ArrowLeft, ChevronRight, Landmark, Zap, 
//   ShieldCheck, Info 
// } from 'lucide-react-native';
// import Animated, { 
//   FadeInDown, FadeInUp, useSharedValue, 
//   useAnimatedStyle, withTiming, withRepeat, withSequence 
// } from 'react-native-reanimated';

// import { useTheme } from '../context/ThemeContext';
// import apiClient from '../services/apiClient'; 

// export default function WithdrawFundsScreen() {
//   const Navigation = useNavigation();
//   const { colors: Colors, isDark: IsDark } = useTheme();

//   // --- STATE ---
//   const [Amount, setAmount] = useState('');
//   const [IsPinModalVisible, setIsPinModalVisible] = useState(false);
//   const [EnteredPin, setEnteredPin] = useState('');
//   const [IsLoading, setIsLoading] = useState(false);
//   const [IsCheckingSecurity, setIsCheckingSecurity] = useState(true);
//   const [PinErrorMessage, setPinErrorMessage] = useState(''); 
  
//   const QuickAmounts = [500, 1000, 2000, 5000];
//   const shakeOffset = useSharedValue(0);

//   // --- SECURITY CHECK ON FOCUS ---
//   useFocusEffect(
//     useCallback(() => {
//       const checkPinStatus = async () => {
//         try {
//           const response = await apiClient.get('/wallet/status');
//           const data = response.data;
//           const hasPin = data.hasPin ?? data.HasPin;

//           if (hasPin === false) {
//             Alert.alert(
//               "Security Required", 
//               "You must create a transaction PIN before you can withdraw funds.", 
//               [{ text: "Setup PIN", onPress: () => Navigation.navigate('SetPin') }],
//               { cancelable: false }
//             );
//           }
//         } catch (e) {
//           console.error("Security check failed:", e);
//         } finally {
//           setIsCheckingSecurity(false);
//         }
//       };

//       const timer = setTimeout(checkPinStatus, 500);
//       return () => clearTimeout(timer);
//     }, [Navigation])
//   );

//   // --- ANIMATIONS ---
//   const triggerErrorShake = () => {
//     shakeOffset.value = withSequence(
//       withTiming(-10, { duration: 50 }),
//       withRepeat(withTiming(10, { duration: 50 }), 3, true),
//       withTiming(0, { duration: 50 })
//     );
//     // Immediately clear the input so dots reset visually
//     setEnteredPin('');
//   };

//   const animatedShakeStyle = useAnimatedStyle(() => ({
//     transform: [{ translateX: shakeOffset.value }],
//   }));

//   // --- HANDLERS ---
//   const handleWithdrawInitiation = () => {
//     const NumericAmount = parseFloat(Amount.replace(/,/g, ''));
//     if (!Amount || isNaN(NumericAmount) || NumericAmount < 100) {
//       Alert.alert('Amount Too Low', 'The minimum withdrawal amount is R 100.00');
//       return;
//     }
//     setPinErrorMessage(''); 
//     setEnteredPin(''); // Pristine state for the modal
//     setIsPinModalVisible(true);
//   };

//   const finalizeWithdrawal = async (pinValue) => {
//   setIsLoading(true);
//   setPinErrorMessage(''); 
//   const NumericAmount = parseFloat(Amount.replace(/,/g, ''));

//   try {
//     const response = await apiClient.post('/wallet/withdraw', {
//       amount: NumericAmount,
//       pin: pinValue 
//     }, { _silent: true });

//     if (response.status === 200 || response.status === 201) {
//       setIsPinModalVisible(false);
//       setEnteredPin('');
//       Alert.alert("Success", "Withdrawal processing!", [
//         { text: "Done", onPress: () => Navigation.goBack() }
//       ]);
//     }
//   } catch (error) {
//     const errorData = error.response?.data;
//     const errorMsg = errorData?.message || errorData?.Message || "An error occurred";

//     // CHECK: If the backend says no bank is linked
//     if (errorMsg.includes("link a bank account")) {
//       setIsPinModalVisible(false);
//       setEnteredPin('');
      
//       // Navigate to your Bank Details screen
//       Navigation.navigate('LinkBankAccount', { 
//         pin: pinValue, 
//         pendingAmount: NumericAmount 
//       });
//       return;
//     }

//     // Otherwise, handle as a standard PIN error
//     triggerErrorShake();
//     setPinErrorMessage(errorMsg);
//   } finally {
//     setIsLoading(false);
//   }
// };

//   if (IsCheckingSecurity) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.Background }}>
//         <ActivityIndicator size="large" color={Colors.Primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.Container, { backgroundColor: Colors.Background }]}>
//       <StatusBar barStyle={IsDark ? 'light-content' : 'dark-content'} />
      
//       <SafeAreaView style={[styles.HeaderWrapper, { backgroundColor: Colors.Surface }]}>
//         <View style={styles.CompactHeader}>
//           <TouchableOpacity 
//             style={[styles.BackButton, { backgroundColor: IsDark ? '#1e293b' : '#f1f5f9' }]} 
//             onPress={() => Navigation.goBack()}
//           >
//             <ArrowLeft size={22} color={Colors.TextPrimary} />
//           </TouchableOpacity>
//           <Text style={[styles.HeaderTitle, { color: Colors.TextPrimary }]}>Secure Payout</Text>
//           <View style={styles.ShieldIcon}>
//              <ShieldCheck size={20} color={Colors.Primary} />
//           </View>
//         </View>
//       </SafeAreaView>

//       <ScrollView contentContainerStyle={styles.Content}>
//         <Animated.View entering={FadeInDown.delay(100)}>
//             <Text style={[styles.Title, { color: Colors.TextPrimary }]}>Transfer Funds</Text>
//             <Text style={[styles.Subtitle, { color: Colors.TextSecondary }]}>
//               Move your earnings to your local South African bank account.
//             </Text>
//         </Animated.View>

//         <Animated.View entering={FadeInDown.delay(200)} style={[styles.InputBox, { backgroundColor: Colors.Surface }]}>
//           <Text style={[styles.CurrencySymbol, { color: Colors.Primary }]}>R</Text>
//           <TextInput 
//             placeholder="0.00" 
//             keyboardType="decimal-pad" 
//             value={Amount} 
//             onChangeText={setAmount} 
//             style={[styles.InputField, { color: Colors.TextPrimary }]}
//             placeholderTextColor={Colors.TextSecondary}
//           />
//         </Animated.View>

//         <View style={styles.QuickGrid}>
//           {QuickAmounts.map((Amt, index) => (
//             <Animated.View key={Amt} entering={FadeInUp.delay(300 + (index * 50))}>
//                 <TouchableOpacity 
//                   style={[styles.QuickBtn, { backgroundColor: IsDark ? '#1e293b' : '#f1f5f9' }]} 
//                   onPress={() => setAmount(Amt.toString())}
//                 >
//                   <Text style={[styles.QuickText, { color: Colors.TextPrimary }]}>R {Amt.toLocaleString()}</Text>
//                 </TouchableOpacity>
//             </Animated.View>
//           ))}
//         </View>

//         <Text style={[styles.MethodLabel, { color: Colors.TextSecondary }]}>DISBURSEMENT METHODS</Text>

//         {[
//           { id: 'BANK', title: 'Standard Bank Payout', desc: 'Direct EFT (24-48 hours)', icon: <Landmark size={24} color={Colors.Primary} /> },
//           { id: 'OZOW', title: 'Instant EFT', desc: 'Powered by Ozow Secure', icon: <Zap size={24} color="#f59e0b" /> },
//         ].map((Method, index) => (
//           <Animated.View key={Method.id} entering={FadeInUp.delay(500 + (index * 100))}>
//               <TouchableOpacity
//                 style={[styles.MethodCard, { backgroundColor: Colors.Surface, borderColor: Colors.Border, opacity: !Amount ? 0.6 : 1 }]}
//                 onPress={handleWithdrawInitiation}
//                 disabled={!Amount || IsLoading}
//               >
//                 <View style={[styles.MethodIconContainer, { backgroundColor: IsDark ? '#0f172a' : '#f8fafc' }]}>
//                   {Method.icon}
//                 </View>
//                 <View style={{ flex: 1 }}>
//                   <Text style={[styles.MethodTitle, { color: Colors.TextPrimary }]}>{Method.title}</Text>
//                   <Text style={[styles.MethodDesc, { color: Colors.TextSecondary }]}>{Method.desc}</Text>
//                 </View>
//                 <ChevronRight color={Colors.TextSecondary} size={20} />
//               </TouchableOpacity>
//           </Animated.View>
//         ))}
//       </ScrollView>

//       {/* --- PIN MODAL --- */}
//       <Modal visible={IsPinModalVisible} transparent animationType="fade">
//         <View style={styles.ModalOverlay}>
//             <Animated.View style={[styles.PinCard, { backgroundColor: Colors.Surface }, animatedShakeStyle]}>
//                 <ShieldCheck size={40} color={PinErrorMessage ? "#ef4444" : Colors.Primary} style={{ marginBottom: 15 }} />
//                 <Text style={[styles.PinTitle, { color: Colors.TextPrimary }]}>Confirm Transfer</Text>
//                 <Text style={styles.PinSubtitle}>Enter your 4-digit PIN to authorize</Text>
                
//                 {IsLoading ? (
//                   <ActivityIndicator size="large" color={Colors.Primary} style={{ marginVertical: 30 }} />
//                 ) : (
//                   <>
//                     <TextInput
//                         style={styles.HiddenInput}
//                         keyboardType="numeric"
//                         maxLength={4}
//                         autoFocus
//                         value={EnteredPin}
//                         onChangeText={(val) => {
//                             if (PinErrorMessage) setPinErrorMessage(''); 
//                             setEnteredPin(val);
//                             if(val.length === 4) finalizeWithdrawal(val);
//                         }}
//                     />
//                     <View style={styles.DotsRow}>
//                         {[0, 1, 2, 3].map(i => (
//                             <View 
//                               key={i} 
//                               style={[
//                                 styles.PinDot, 
//                                 { backgroundColor: EnteredPin.length > i ? Colors.Primary : Colors.Border },
//                                 // Flash red outline on error before the wipe
//                                 PinErrorMessage ? { backgroundColor: '#ef444433', borderColor: '#ef4444', borderWidth: 1 } : null
//                               ]} 
//                             />
//                         ))}
//                     </View>
                    
//                     {PinErrorMessage ? (
//                       <Text style={styles.ErrorText}>{PinErrorMessage}</Text>
//                     ) : null}
//                   </>
//                 )}

//                 {!IsLoading && (
//                   <TouchableOpacity 
//                     onPress={() => {
//                       setIsPinModalVisible(false);
//                       setPinErrorMessage('');
//                       setEnteredPin('');
//                     }} 
//                     style={styles.CancelBtn}
//                   >
//                     <Text style={{ color: Colors.TextSecondary, fontWeight: 'bold' }}>Cancel</Text>
//                   </TouchableOpacity>
//                 )}
//             </Animated.View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   Container: { flex: 1 },
//   HeaderWrapper: { borderBottomWidth: 0.5, borderColor: '#ccc' },
//   CompactHeader: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
//   BackButton: { width: 42, height: 42, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
//   HeaderTitle: { fontSize: 17, fontWeight: '800' },
//   ShieldIcon: { width: 42, height: 42, justifyContent: 'center', alignItems: 'center' },
//   Content: { padding: 25 },
//   Title: { fontSize: 28, fontWeight: '900', marginBottom: 8, letterSpacing: -0.5 },
//   Subtitle: { fontSize: 15, fontWeight: '500', marginBottom: 30, lineHeight: 22, opacity: 0.7 },
//   InputBox: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     borderRadius: 24, 
//     paddingHorizontal: 25, 
//     paddingVertical: 15, 
//     marginBottom: 25,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.05,
//     shadowRadius: 20,
//     elevation: 5
//   },
//   CurrencySymbol: { fontSize: 42, fontWeight: '900', marginRight: 12 },
//   InputField: { flex: 1, fontSize: 42, fontWeight: '900' },
//   QuickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 35 },
//   QuickBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 15, minWidth: 90, alignItems: 'center' },
//   QuickText: { fontWeight: '700', fontSize: 14 },
//   MethodLabel: { fontSize: 12, fontWeight: '900', letterSpacing: 1.5, marginBottom: 15, opacity: 0.5 },
//   MethodCard: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     padding: 18, 
//     borderRadius: 24, 
//     borderWidth: 1, 
//     marginBottom: 16 
//   },
//   MethodIconContainer: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
//   MethodTitle: { fontSize: 16, fontWeight: '800' },
//   MethodDesc: { fontSize: 13, opacity: 0.6, marginTop: 2 },
//   ModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
//   PinCard: { width: '85%', padding: 30, borderRadius: 30, alignItems: 'center' },
//   PinTitle: { fontSize: 22, fontWeight: '900' },
//   PinSubtitle: { fontSize: 14, opacity: 0.6, marginVertical: 10 },
//   DotsRow: { flexDirection: 'row', gap: 15, marginVertical: 20 },
//   PinDot: { width: 15, height: 15, borderRadius: 7.5 },
//   HiddenInput: { position: 'absolute', opacity: 0, width: '100%', height: '100%' },
//   CancelBtn: { marginTop: 15, padding: 10 },
//   ErrorText: { 
//     color: '#ef4444', 
//     fontSize: 13, 
//     fontWeight: '700', 
//     marginBottom: 10, 
//     textAlign: 'center' 
//   },
// });













// // screens/wallet/WithdrawFundsScreen.jsx
// // 💸 Complete Withdraw Flow with PIN & Bank Selection

// import React, { useState, useCallback, useMemo } from 'react';
// import {
//   View, Text, StyleSheet, TouchableOpacity, ScrollView,
//   TextInput, SafeAreaView, StatusBar, Alert, Modal, ActivityIndicator
// } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import {
//   ArrowLeft, Landmark, ChevronRight, ShieldCheck,
//   AlertCircle, CheckCircle, Info
// } from 'lucide-react-native';
// import Animated, {
//   useSharedValue, useAnimatedStyle, withSequence, withTiming
// } from 'react-native-reanimated';

// import { useTheme } from '../context/ThemeContext';
// import { getTheme } from '../theme/designSystem';
// import apiClient from '../services/apiClient';

// export default function WithdrawFundsScreen({ navigation }) {
//   const { isDark } = useTheme();
//   const theme = useMemo(() => getTheme(isDark), [isDark]);

//   // ═══ STATE ═══
//   const [amount, setAmount] = useState('');
//   const [balance, setBalance] = useState(0);
//   const [bankAccounts, setBankAccounts] = useState([]);
//   const [selectedBank, setSelectedBank] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showPinModal, setShowPinModal] = useState(false);
//   const [pin, setPin] = useState('');
//   const [pinError, setPinError] = useState('');
//   const [withdrawing, setWithdrawing] = useState(false);

//   const shakeOffset = useSharedValue(0);

//   // ═══ QUICK AMOUNTS ═══
//   const quickAmounts = [500, 1000, 2000, 5000];

//   // ═══ FETCH DATA ═══
//   const fetchData = useCallback(async () => {
//     try {
//       const [balanceRes, banksRes] = await Promise.all([
//         apiClient.get('/wallet/balance'),
//         apiClient.get('/wallet/bank-accounts')
//       ]);

//       setBalance(balanceRes.data?.balance || 0);
      
//       const accounts = Array.isArray(banksRes.data) ? banksRes.data : [];
//       setBankAccounts(accounts);
      
//       // Auto-select primary bank
//       const primary = accounts.find(b => b.isPrimary);
//       if (primary) setSelectedBank(primary);
//       else if (accounts.length > 0) setSelectedBank(accounts[0]);

//     } catch (error) {
//       console.error('Fetch error:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       fetchData();
//     }, [fetchData])
//   );

//   // ═══ ANIMATIONS ═══
//   const triggerShake = () => {
//     shakeOffset.value = withSequence(
//       withTiming(-10, { duration: 50 }),
//       withTiming(10, { duration: 50 }),
//       withTiming(-10, { duration: 50 }),
//       withTiming(10, { duration: 50 }),
//       withTiming(0, { duration: 50 })
//     );
//     setPin('');
//   };

//   const animatedShake = useAnimatedStyle(() => ({
//     transform: [{ translateX: shakeOffset.value }],
//   }));

//   // ═══ HANDLERS ═══
//   const handleInitiateWithdraw = () => {
//     const numAmount = parseFloat(amount);

//     if (!amount || isNaN(numAmount) || numAmount <= 0) {
//       Alert.alert('Invalid Amount', 'Please enter a valid amount');
//       return;
//     }

//     if (numAmount < 100) {
//       Alert.alert('Amount Too Low', 'Minimum withdrawal is R100');
//       return;
//     }

//     if (numAmount > balance) {
//       Alert.alert('Insufficient Funds', `You only have R${(Number(balance) || 0).toFixed(2)} available`);
//       return;
//     }

//     if (!selectedBank) {
//       Alert.alert(
//         'No Bank Account',
//         'Please link a bank account first',
//         [{ text: 'Link Bank', onPress: () => navigation.navigate('LinkBankAccount') }]
//       );
//       return;
//     }

//     setPinError('');
//     setPin('');
//     setShowPinModal(true);
//   };

//   const handleConfirmWithdraw = async () => {
//     if (pin.length !== 4) return;

//     setWithdrawing(true);
//     setPinError('');

//     try {
//       const response = await apiClient.post('/wallet/withdraw', {
//         amount: parseFloat(amount),
//         pin: pin,
//         bankAccountId: selectedBank.id
//       });

//       setShowPinModal(false);
//       setPin('');
      
//       Alert.alert(
//         'Withdrawal Initiated',
//         'Your withdrawal is being processed. Funds should arrive within 24-48 hours.',
//         [
//           {
//             text: 'View Transactions',
//             onPress: () => navigation.navigate('TransactionHistory')
//           },
//           {
//             text: 'Done',
//             onPress: () => navigation.goBack()
//           }
//         ]
//       );
//     } catch (error) {
//       const errorMsg = error.response?.data?.message || 'Withdrawal failed';
      
//       if (errorMsg.includes('link a bank account')) {
//         setShowPinModal(false);
//         Alert.alert(
//           'Bank Account Required',
//           'Please link a bank account to continue',
//           [{ text: 'Link Bank', onPress: () => navigation.navigate('LinkBankAccount') }]
//         );
//       } else if (errorMsg.includes('PIN') || errorMsg.includes('Incorrect')) {
//         setPinError(errorMsg);
//         triggerShake();
//       } else {
//         setShowPinModal(false);
//         Alert.alert('Error', errorMsg);
//       }
//     } finally {
//       setWithdrawing(false);
//     }
//   };

//   // Handle PIN input
//   const handlePinChange = (value) => {
//     if (value.length <= 4 && /^\d*$/.test(value)) {
//       setPin(value);
//       setPinError('');
//       if (value.length === 4) {
//         setTimeout(() => handleConfirmWithdraw(), 100);
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
//         <ActivityIndicator size="large" color={theme.colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
//       <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

//       {/* ═══ HEADER ═══ */}
//       <SafeAreaView style={[styles.header, { backgroundColor: theme.colors.card }]}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
//           <ArrowLeft size={24} color={theme.colors.textPrimary} strokeWidth={2.5} />
//         </TouchableOpacity>
//         <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>
//           Withdraw Funds
//         </Text>
//         <View style={{ width: 44 }} />
//       </SafeAreaView>

//       <ScrollView contentContainerStyle={styles.content}>
//         {/* Balance Display */}
//         <View style={[styles.balanceCard, { backgroundColor: theme.colors.card }, theme.shadows.sm]}>
//           <Text style={[styles.balanceLabel, { color: theme.colors.textMuted }]}>
//             Available Balance
//           </Text>
//           <Text style={[styles.balanceAmount, { color: theme.colors.textPrimary }]}>
//             R{(Number(balance) || 0).toFixed(2)}
//           </Text>
//         </View>

//         {/* Amount Input */}
//         <View style={styles.section}>
//           <Text style={[theme.typography.labelLarge, { color: theme.colors.textMuted }]}>
//             ENTER AMOUNT
//           </Text>
//           <View style={[styles.amountInput, { backgroundColor: theme.colors.surface }]}>
//             <Text style={[styles.currencySymbol, { color: theme.colors.primary }]}>R</Text>
//             <TextInput
//               style={[styles.input, { color: theme.colors.textPrimary }]}
//               placeholder="0.00"
//               placeholderTextColor={theme.colors.textMuted}
//               keyboardType="decimal-pad"
//               value={amount}
//               onChangeText={setAmount}
//             />
//           </View>

//           {/* Quick Amounts */}
//           <View style={styles.quickAmounts}>
//             {quickAmounts.map(amt => (
//               <TouchableOpacity
//                 key={amt}
//                 style={[
//                   styles.quickChip,
//                   { 
//                     backgroundColor: amount === amt.toString() ? theme.colors.primary : theme.colors.surface,
//                     borderColor: theme.colors.border,
//                   }
//                 ]}
//                 onPress={() => setAmount(amt.toString())}
//               >
//                 <Text style={[
//                   styles.quickText,
//                   { color: amount === amt.toString() ? '#FFF' : theme.colors.textPrimary }
//                 ]}>
//                   R{amt}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* Bank Selection */}
//         <View style={styles.section}>
//           <Text style={[theme.typography.labelLarge, { color: theme.colors.textMuted }]}>
//             WITHDRAWAL METHOD
//           </Text>

//           {bankAccounts.length === 0 ? (
//             <TouchableOpacity
//               style={[styles.noBankCard, { backgroundColor: theme.colors.surface }]}
//               onPress={() => navigation.navigate('LinkBankAccount')}
//             >
//               <AlertCircle size={24} color={theme.colors.warning} />
//               <View style={{ flex: 1, marginLeft: 12 }}>
//                 <Text style={[theme.typography.bodyLarge, { color: theme.colors.textPrimary }]}>
//                   No Bank Account Linked
//                 </Text>
//                 <Text style={[styles.noBankText, { color: theme.colors.textMuted }]}>
//                   Tap to add your bank details
//                 </Text>
//               </View>
//               <ChevronRight size={20} color={theme.colors.textMuted} />
//             </TouchableOpacity>
//           ) : (
//             <>
//               {bankAccounts.map(bank => (
//                 <TouchableOpacity
//                   key={bank.id}
//                   style={[
//                     styles.bankCard,
//                     {
//                       backgroundColor: theme.colors.card,
//                       borderColor: selectedBank?.id === bank.id ? theme.colors.primary : theme.colors.border,
//                       borderWidth: selectedBank?.id === bank.id ? 2 : 1,
//                     },
//                     theme.shadows.sm
//                   ]}
//                   onPress={() => setSelectedBank(bank)}
//                 >
//                   <View style={[styles.bankIcon, { backgroundColor: theme.colors.primary + '20' }]}>
//                     <Landmark size={24} color={theme.colors.primary} strokeWidth={2.5} />
//                   </View>

//                   <View style={{ flex: 1 }}>
//                     <View style={styles.bankHeader}>
//                       <Text style={[theme.typography.bodyLarge, { color: theme.colors.textPrimary }]}>
//                         {bank.bankName}
//                       </Text>
//                       {bank.isPrimary && (
//                         <View style={[styles.primaryBadge, { backgroundColor: theme.colors.primary + '20' }]}>
//                           <Text style={[styles.primaryText, { color: theme.colors.primary }]}>
//                             PRIMARY
//                           </Text>
//                         </View>
//                       )}
//                     </View>
//                     <Text style={[styles.accountNumber, { color: theme.colors.textMuted }]}>
//                       {bank.accountNumber}
//                     </Text>
//                     <Text style={[styles.accountName, { color: theme.colors.textSecondary }]}>
//                       {bank.accountName}
//                     </Text>
//                   </View>

//                   {selectedBank?.id === bank.id && (
//                     <CheckCircle size={24} color={theme.colors.primary} strokeWidth={2.5} />
//                   )}
//                 </TouchableOpacity>
//               ))}

//               <TouchableOpacity
//                 style={[styles.addBankButton, { backgroundColor: theme.colors.surface }]}
//                 onPress={() => navigation.navigate('LinkBankAccount')}
//               >
//                 <Text style={[styles.addBankText, { color: theme.colors.primary }]}>
//                   + Add Another Bank
//                 </Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>

//         {/* Info Notice */}
//         <View style={[styles.infoCard, { backgroundColor: theme.colors.primary + '10' }]}>
//           <Info size={20} color={theme.colors.primary} strokeWidth={2.5} />
//           <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
//             Withdrawals typically arrive within 24-48 hours. Minimum amount is R100.
//           </Text>
//         </View>

//         {/* Withdraw Button */}
//         <TouchableOpacity
//           style={[
//             styles.withdrawButton,
//             { 
//               backgroundColor: amount && selectedBank ? theme.colors.primary : theme.colors.surface,
//               opacity: amount && selectedBank ? 1 : 0.5,
//             },
//             theme.shadows.md
//           ]}
//           onPress={handleInitiateWithdraw}
//           disabled={!amount || !selectedBank}
//         >
//           <Text style={[
//             styles.withdrawButtonText,
//             { color: amount && selectedBank ? '#FFF' : theme.colors.textMuted }
//           ]}>
//             Continue to Verify
//           </Text>
//         </TouchableOpacity>
//       </ScrollView>

//       {/* ═══ PIN MODAL ═══ */}
//       <Modal visible={showPinModal} transparent animationType="fade">
//         <View style={styles.modalOverlay}>
//           <Animated.View 
//             style={[
//               styles.pinModal,
//               { backgroundColor: theme.colors.card },
//               animatedShake,
//               theme.shadows.lg
//             ]}
//           >
//             <ShieldCheck 
//               size={48} 
//               color={pinError ? '#EF4444' : theme.colors.primary} 
//               strokeWidth={2}
//             />
            
//             <Text style={[theme.typography.h2, { color: theme.colors.textPrimary, marginTop: 16 }]}>
//               Confirm Withdrawal
//             </Text>
//             <Text style={[styles.pinSubtitle, { color: theme.colors.textMuted }]}>
//               Withdrawing R{amount} to {selectedBank?.bankName}
//             </Text>

//             {withdrawing ? (
//               <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 30 }} />
//             ) : (
//               <>
//                 <TextInput
//                   style={styles.hiddenInput}
//                   keyboardType="numeric"
//                   maxLength={4}
//                   autoFocus
//                   value={pin}
//                   onChangeText={handlePinChange}
//                   secureTextEntry
//                 />

//                 <View style={styles.pinDots}>
//                   {[0, 1, 2, 3].map(index => (
//                     <View
//                       key={index}
//                       style={[
//                         styles.pinDot,
//                         {
//                           backgroundColor: pin.length > index ? theme.colors.primary : theme.colors.surface,
//                           borderColor: pinError ? '#EF4444' : theme.colors.border,
//                         }
//                       ]}
//                     />
//                   ))}
//                 </View>

//                 {pinError && (
//                   <Text style={styles.errorText}>{pinError}</Text>
//                 )}

//                 <Text style={[styles.pinHint, { color: theme.colors.textMuted }]}>
//                   Enter your 4-digit transaction PIN
//                 </Text>
//               </>
//             )}

//             {!withdrawing && (
//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={() => {
//                   setShowPinModal(false);
//                   setPin('');
//                   setPinError('');
//                 }}
//               >
//                 <Text style={[styles.cancelText, { color: theme.colors.textSecondary }]}>
//                   Cancel
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </Animated.View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   centered: { justifyContent: 'center', alignItems: 'center' },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0,0,0,0.05)',
//   },
//   headerButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   content: {
//     padding: 16,
//     paddingBottom: 100,
//   },

//   // Balance
//   balanceCard: {
//     padding: 20,
//     borderRadius: 16,
//     marginBottom: 24,
//     alignItems: 'center',
//   },
//   balanceLabel: {
//     fontSize: 13,
//     fontWeight: '700',
//     marginBottom: 8,
//   },
//   balanceAmount: {
//     fontSize: 32,
//     fontWeight: '900',
//   },

//   // Section
//   section: {
//     marginBottom: 24,
//   },

//   // Amount Input
//   amountInput: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderRadius: 16,
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     marginTop: 12,
//     marginBottom: 16,
//   },
//   currencySymbol: {
//     fontSize: 32,
//     fontWeight: '900',
//     marginRight: 12,
//   },
//   input: {
//     flex: 1,
//     fontSize: 32,
//     fontWeight: '900',
//   },

//   // Quick Amounts
//   quickAmounts: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   quickChip: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 12,
//     alignItems: 'center',
//     borderWidth: 1,
//   },
//   quickText: {
//     fontSize: 14,
//     fontWeight: '700',
//   },

//   // Bank Cards
//   noBankCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderRadius: 16,
//     marginTop: 12,
//   },
//   noBankText: {
//     fontSize: 13,
//     fontWeight: '600',
//     marginTop: 2,
//   },
//   bankCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderRadius: 16,
//     marginTop: 12,
//   },
//   bankIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   bankHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 4,
//   },
//   primaryBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 8,
//   },
//   primaryText: {
//     fontSize: 9,
//     fontWeight: '900',
//   },
//   accountNumber: {
//     fontSize: 14,
//     fontWeight: '700',
//     marginBottom: 2,
//   },
//   accountName: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   addBankButton: {
//     paddingVertical: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginTop: 12,
//   },
//   addBankText: {
//     fontSize: 15,
//     fontWeight: '800',
//   },

//   // Info
//   infoCard: {
//     flexDirection: 'row',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 24,
//     gap: 12,
//   },
//   infoText: {
//     flex: 1,
//     fontSize: 13,
//     fontWeight: '600',
//     lineHeight: 20,
//   },

//   // Withdraw Button
//   withdrawButton: {
//     paddingVertical: 18,
//     borderRadius: 16,
//     alignItems: 'center',
//   },
//   withdrawButtonText: {
//     fontSize: 16,
//     fontWeight: '900',
//   },

//   // PIN Modal
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   pinModal: {
//     width: '85%',
//     padding: 32,
//     borderRadius: 24,
//     alignItems: 'center',
//   },
//   pinSubtitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     textAlign: 'center',
//     marginTop: 8,
//     marginBottom: 24,
//   },
//   hiddenInput: {
//     position: 'absolute',
//     opacity: 0,
//   },
//   pinDots: {
//     flexDirection: 'row',
//     gap: 16,
//     marginBottom: 16,
//   },
//   pinDot: {
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     borderWidth: 2,
//   },
//   errorText: {
//     color: '#EF4444',
//     fontSize: 13,
//     fontWeight: '700',
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   pinHint: {
//     fontSize: 13,
//     fontWeight: '600',
//     marginBottom: 20,
//   },
//   cancelButton: {
//     paddingVertical: 12,
//   },
//   cancelText: {
//     fontSize: 15,
//     fontWeight: '700',
//   },
// });











// screens/wallet/WithdrawFundsScreen.jsx
// 💸 Complete Withdraw Flow with PIN & Bank Selection

import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, SafeAreaView, StatusBar, Alert, Modal, ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  ArrowLeft, Landmark, ChevronRight, ShieldCheck,
  AlertCircle, CheckCircle, Info, Trash2
} from 'lucide-react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSequence, withTiming
} from 'react-native-reanimated';

import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../theme/designSystem';
import apiClient from '../services/apiClient';

export default function WithdrawFundsScreen({ navigation }) {
  const { isDark } = useTheme();
  const theme = useMemo(() => getTheme(isDark), [isDark]);

  // ═══ STATE ═══
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // tracks which bank is being deleted

  const shakeOffset = useSharedValue(0);

  // ═══ QUICK AMOUNTS ═══
  const quickAmounts = [500, 1000, 2000, 5000];

  // ═══ FETCH DATA ═══
  const fetchData = useCallback(async () => {
    try {
      const [balanceRes, banksRes] = await Promise.all([
        apiClient.get('/wallet/balance'),
        apiClient.get('/wallet/bank-accounts')
      ]);

      setBalance(balanceRes.data?.balance || 0);

      const accounts = Array.isArray(banksRes.data) ? banksRes.data : [];
      setBankAccounts(accounts);

      // Auto-select primary bank
      const primary = accounts.find(b => b.isPrimary);
      if (primary) setSelectedBank(primary);
      else if (accounts.length > 0) setSelectedBank(accounts[0]);

    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  // ═══ ANIMATIONS ═══
  const triggerShake = () => {
    shakeOffset.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
    setPin('');
  };

  const animatedShake = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  // ═══ DELETE BANK ACCOUNT ═══
  const handleDeleteBank = (bank) => {
    Alert.alert(
      'Remove Bank Account',
      `Are you sure you want to remove ${bank.bankName} (${bank.accountNumber})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(bank.id);
            try {
              await apiClient.delete(`/wallet/bank-accounts/${bank.id}`);

              // Remove from local state
              const updated = bankAccounts.filter(b => b.id !== bank.id);
              setBankAccounts(updated);

              // If the deleted bank was selected, auto-select another
              if (selectedBank?.id === bank.id) {
                const nextPrimary = updated.find(b => b.isPrimary);
                setSelectedBank(nextPrimary || updated[0] || null);
              }

              Alert.alert('Removed', 'Bank account removed successfully.');
            } catch (error) {
              const msg = error.response?.data?.message || 'Failed to remove bank account.';
              Alert.alert('Error', msg);
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  // ═══ HANDLERS ═══
  const handleInitiateWithdraw = () => {
    const numAmount = parseFloat(amount);

    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    if (numAmount < 100) {
      Alert.alert('Amount Too Low', 'Minimum withdrawal is R100');
      return;
    }

    if (numAmount > balance) {
      Alert.alert('Insufficient Funds', `You only have R${(Number(balance) || 0).toFixed(2)} available`);
      return;
    }

    if (!selectedBank) {
      Alert.alert(
        'No Bank Account',
        'Please link a bank account first',
        [{ text: 'Link Bank', onPress: () => navigation.navigate('LinkBankAccount') }]
      );
      return;
    }

    setPinError('');
    setPin('');
    setShowPinModal(true);
  };

  const handleConfirmWithdraw = async () => {
    if (pin.length !== 4) {
      setPinError('Please enter all 4 digits');
      return;
    }

    setWithdrawing(true);
    setPinError('');

    try {
      const response = await apiClient.post('/wallet/withdraw', {
        amount: parseFloat(amount),
        pin: pin,
        bankAccountId: selectedBank.id
      });

      setShowPinModal(false);
      setPin('');

      Alert.alert(
        'Withdrawal Initiated',
        'Your withdrawal is being processed. Funds should arrive within 24-48 hours.',
        [
          {
            text: 'View Transactions',
            onPress: () => navigation.navigate('TransactionHistory')
          },
          {
            text: 'Done',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Withdrawal failed';

      if (errorMsg.includes('link a bank account')) {
        setShowPinModal(false);
        Alert.alert(
          'Bank Account Required',
          'Please link a bank account to continue',
          [{ text: 'Link Bank', onPress: () => navigation.navigate('LinkBankAccount') }]
        );
      } else if (errorMsg.includes('PIN') || errorMsg.includes('Incorrect')) {
        setPinError(errorMsg);
        triggerShake();
      } else {
        setShowPinModal(false);
        Alert.alert('Error', errorMsg);
      }
    } finally {
      setWithdrawing(false);
    }
  };

  // Handle PIN digit input — auto-submits only when all 4 entered via keyboard
  const handlePinChange = (value) => {
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setPin(value);
      setPinError('');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* ═══ HEADER ═══ */}
      <SafeAreaView style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <ArrowLeft size={24} color={theme.colors.textPrimary} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>
          Withdraw Funds
        </Text>
        <View style={{ width: 44 }} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Balance Display */}
        <View style={[styles.balanceCard, { backgroundColor: theme.colors.card }, theme.shadows.sm]}>
          <Text style={[styles.balanceLabel, { color: theme.colors.textMuted }]}>
            Available Balance
          </Text>
          <Text style={[styles.balanceAmount, { color: theme.colors.textPrimary }]}>
            R{(Number(balance) || 0).toFixed(2)}
          </Text>
        </View>

        {/* Amount Input */}
        <View style={styles.section}>
          <Text style={[theme.typography.labelLarge, { color: theme.colors.textMuted }]}>
            ENTER AMOUNT
          </Text>
          <View style={[styles.amountInput, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.currencySymbol, { color: theme.colors.primary }]}>R</Text>
            <TextInput
              style={[styles.input, { color: theme.colors.textPrimary }]}
              placeholder="0.00"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          {/* Quick Amounts */}
          <View style={styles.quickAmounts}>
            {quickAmounts.map(amt => (
              <TouchableOpacity
                key={amt}
                style={[
                  styles.quickChip,
                  {
                    backgroundColor: amount === amt.toString() ? theme.colors.primary : theme.colors.surface,
                    borderColor: theme.colors.border,
                  }
                ]}
                onPress={() => setAmount(amt.toString())}
              >
                <Text style={[
                  styles.quickText,
                  { color: amount === amt.toString() ? '#FFF' : theme.colors.textPrimary }
                ]}>
                  R{amt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bank Selection */}
        <View style={styles.section}>
          <Text style={[theme.typography.labelLarge, { color: theme.colors.textMuted }]}>
            WITHDRAWAL METHOD
          </Text>

          {bankAccounts.length === 0 ? (
            <TouchableOpacity
              style={[styles.noBankCard, { backgroundColor: theme.colors.surface }]}
              onPress={() => navigation.navigate('LinkBankAccount')}
            >
              <AlertCircle size={24} color={theme.colors.warning} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[theme.typography.bodyLarge, { color: theme.colors.textPrimary }]}>
                  No Bank Account Linked
                </Text>
                <Text style={[styles.noBankText, { color: theme.colors.textMuted }]}>
                  Tap to add your bank details
                </Text>
              </View>
              <ChevronRight size={20} color={theme.colors.textMuted} />
            </TouchableOpacity>
          ) : (
            <>
              {bankAccounts.map(bank => (
                <View
                  key={bank.id}
                  style={[
                    styles.bankCard,
                    {
                      backgroundColor: theme.colors.card,
                      borderColor: selectedBank?.id === bank.id ? theme.colors.primary : theme.colors.border,
                      borderWidth: selectedBank?.id === bank.id ? 2 : 1,
                    },
                    theme.shadows.sm
                  ]}
                >
                  {/* Tappable area selects the bank */}
                  <TouchableOpacity
                    style={styles.bankCardSelectable}
                    onPress={() => setSelectedBank(bank)}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.bankIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                      <Landmark size={24} color={theme.colors.primary} strokeWidth={2.5} />
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={styles.bankHeader}>
                        <Text style={[theme.typography.bodyLarge, { color: theme.colors.textPrimary }]}>
                          {bank.bankName}
                        </Text>
                        {bank.isPrimary && (
                          <View style={[styles.primaryBadge, { backgroundColor: theme.colors.primary + '20' }]}>
                            <Text style={[styles.primaryText, { color: theme.colors.primary }]}>
                              PRIMARY
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.accountNumber, { color: theme.colors.textMuted }]}>
                        {bank.accountNumber}
                      </Text>
                      <Text style={[styles.accountName, { color: theme.colors.textSecondary }]}>
                        {bank.accountName}
                      </Text>
                    </View>

                    {selectedBank?.id === bank.id && (
                      <CheckCircle size={24} color={theme.colors.primary} strokeWidth={2.5} />
                    )}
                  </TouchableOpacity>

                  {/* Delete button — separated so it doesn't trigger bank selection */}
                  <TouchableOpacity
                    style={[styles.deleteBtn, { borderTopColor: theme.colors.border }]}
                    onPress={() => handleDeleteBank(bank)}
                    disabled={deletingId === bank.id}
                    activeOpacity={0.7}
                  >
                    {deletingId === bank.id ? (
                      <ActivityIndicator size="small" color="#EF4444" />
                    ) : (
                      <>
                        <Trash2 size={15} color="#EF4444" strokeWidth={2.5} />
                        <Text style={styles.deleteBtnText}>Remove</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity
                style={[styles.addBankButton, { backgroundColor: theme.colors.surface }]}
                onPress={() => navigation.navigate('LinkBankAccount')}
              >
                <Text style={[styles.addBankText, { color: theme.colors.primary }]}>
                  + Add Another Bank
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Info Notice */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.primary + '10' }]}>
          <Info size={20} color={theme.colors.primary} strokeWidth={2.5} />
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            Withdrawals typically arrive within 24-48 hours. Minimum amount is R100.
          </Text>
        </View>

        {/* Withdraw Button */}
        <TouchableOpacity
          style={[
            styles.withdrawButton,
            {
              backgroundColor: amount && selectedBank ? theme.colors.primary : theme.colors.surface,
              opacity: amount && selectedBank ? 1 : 0.5,
            },
            theme.shadows.md
          ]}
          onPress={handleInitiateWithdraw}
          disabled={!amount || !selectedBank}
        >
          <Text style={[
            styles.withdrawButtonText,
            { color: amount && selectedBank ? '#FFF' : theme.colors.textMuted }
          ]}>
            Continue to Verify
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ═══ PIN MODAL ═══ */}
      <Modal visible={showPinModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.pinModal,
              { backgroundColor: theme.colors.card },
              animatedShake,
              theme.shadows.lg
            ]}
          >
            <ShieldCheck
              size={48}
              color={pinError ? '#EF4444' : theme.colors.primary}
              strokeWidth={2}
            />

            <Text style={[theme.typography.h2, { color: theme.colors.textPrimary, marginTop: 16 }]}>
              Confirm Withdrawal
            </Text>
            <Text style={[styles.pinSubtitle, { color: theme.colors.textMuted }]}>
              Withdrawing R{amount} to {selectedBank?.bankName}
            </Text>

            {withdrawing ? (
              <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 30 }} />
            ) : (
              <>
                {/* Hidden input captures keyboard on mobile */}
                <TextInput
                  style={styles.hiddenInput}
                  keyboardType="numeric"
                  maxLength={4}
                  autoFocus
                  value={pin}
                  onChangeText={handlePinChange}
                  secureTextEntry
                />

                {/* PIN dot indicators */}
                <View style={styles.pinDots}>
                  {[0, 1, 2, 3].map(index => (
                    <View
                      key={index}
                      style={[
                        styles.pinDot,
                        {
                          backgroundColor: pin.length > index ? theme.colors.primary : theme.colors.surface,
                          borderColor: pinError ? '#EF4444' : theme.colors.border,
                        }
                      ]}
                    />
                  ))}
                </View>

                {pinError ? (
                  <Text style={styles.errorText}>{pinError}</Text>
                ) : (
                  <Text style={[styles.pinHint, { color: theme.colors.textMuted }]}>
                    Enter your 4-digit transaction PIN
                  </Text>
                )}

                {/* ── Explicit submit button ── */}
                <TouchableOpacity
                  style={[
                    styles.submitPinBtn,
                    {
                      backgroundColor: pin.length === 4 ? theme.colors.primary : theme.colors.surface,
                      opacity: pin.length === 4 ? 1 : 0.45,
                    }
                  ]}
                  onPress={handleConfirmWithdraw}
                  disabled={pin.length !== 4}
                  activeOpacity={0.85}
                >
                  <Text style={[
                    styles.submitPinBtnText,
                    { color: pin.length === 4 ? '#FFF' : theme.colors.textMuted }
                  ]}>
                    Confirm Withdrawal
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowPinModal(false);
                    setPin('');
                    setPinError('');
                  }}
                >
                  <Text style={[styles.cancelText, { color: theme.colors.textSecondary }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },

  // Balance
  balanceCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '900',
  },

  // Section
  section: {
    marginBottom: 24,
  },

  // Amount Input
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '900',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 32,
    fontWeight: '900',
  },

  // Quick Amounts
  quickAmounts: {
    flexDirection: 'row',
    gap: 12,
  },
  quickChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  quickText: {
    fontSize: 14,
    fontWeight: '700',
  },

  // Bank Cards
  noBankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginTop: 12,
  },
  noBankText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  bankCard: {
    borderRadius: 16,
    marginTop: 12,
    overflow: 'hidden',
  },
  // Selectable top area of the bank card
  bankCardSelectable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  bankIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  primaryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  primaryText: {
    fontSize: 9,
    fontWeight: '900',
  },
  accountNumber: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  accountName: {
    fontSize: 12,
    fontWeight: '600',
  },
  // Delete button strip at bottom of each bank card
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },
  addBankButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  addBankText: {
    fontSize: 15,
    fontWeight: '800',
  },

  // Info
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 20,
  },

  // Withdraw Button
  withdrawButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  withdrawButtonText: {
    fontSize: 16,
    fontWeight: '900',
  },

  // PIN Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinModal: {
    width: '85%',
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
  },
  pinSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  pinDots: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  pinHint: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  // Explicit submit button inside PIN modal
  submitPinBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  submitPinBtnText: {
    fontSize: 16,
    fontWeight: '900',
  },
  cancelButton: {
    paddingVertical: 12,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '700',
  },
});