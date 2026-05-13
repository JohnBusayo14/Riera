// // screens/wallet/LinkBankAccountScreen.jsx
// // 🏦 Complete Bank Linking with KYC Modal

// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   View, Text, StyleSheet, TouchableOpacity, ScrollView,
//   TextInput, ActivityIndicator, SafeAreaView, Alert, StatusBar, Modal
// } from 'react-native';
// import {
//   ArrowLeft, Building2, CheckCircle, AlertCircle, ChevronRight,
//   FileText, X, Shield, Globe
// } from 'lucide-react-native';
// import { useTheme } from '../context/ThemeContext';
// import { getTheme } from '../theme/designSystem';
// import apiClient from '../services/apiClient';

// export default function LinkBankAccountScreen({ navigation, route }) {
//   const { isDark } = useTheme();
//   const theme = useMemo(() => getTheme(isDark), [isDark]);

//   // ═══ STATE ═══
//   const [selectedBank, setSelectedBank] = useState(null);
//   const [accountNumber, setAccountNumber] = useState('');
//   const [accountName, setAccountName] = useState('');
//   const [documentNumber, setDocumentNumber] = useState('');
//   const [isForeigner, setIsForeigner] = useState(false);
//   const [verifying, setVerifying] = useState(false);
//   const [verified, setVerified] = useState(false);
//   const [linking, setLinking] = useState(false);
  
//   // KYC Modal
//   const [showKycModal, setShowKycModal] = useState(false);

//   // ═══ HANDLE BANK SELECTION ═══
//   useEffect(() => {
//     if (route.params?.selectedBank) {
//       setSelectedBank(route.params.selectedBank);
//       navigation.setParams({ selectedBank: null });
//     }
//   }, [route.params?.selectedBank]);

//   // ═══ VERIFY ACCOUNT (Opens KYC Modal) ═══
//   const handleVerifyAccount = () => {
//     if (!selectedBank) {
//       Alert.alert('Select Bank', 'Please select your bank first');
//       return;
//     }

//     if (accountNumber.length !== 10) {
//       Alert.alert('Invalid Account', 'Please enter a valid 10-digit account number');
//       return;
//     }

//     // Open KYC modal for document verification
//     setShowKycModal(true);
//   };

//   // ═══ SUBMIT KYC & VERIFY ═══
//   const handleKycSubmit = async () => {
//     // Validate document number
//     if (!documentNumber.trim()) {
//       Alert.alert('Document Required', 'Please enter your ID or Passport number');
//       return;
//     }

//     // Validate format based on citizenship
//     if (!isForeigner) {
//       // SA ID: 13 digits
//       if (documentNumber.length !== 13 || !/^\d+$/.test(documentNumber)) {
//         Alert.alert(
//           'Invalid ID Number',
//           'South African ID numbers must be 13 digits'
//         );
//         return;
//       }
//     } else {
//       // Passport: Alphanumeric, typically 6-20 characters
//       if (documentNumber.length < 6 || documentNumber.length > 20) {
//         Alert.alert(
//           'Invalid Passport',
//           'Passport numbers must be 6-20 characters'
//         );
//         return;
//       }
//     }

//     setShowKycModal(false);
//     setVerifying(true);
//     setVerified(false);
//     setAccountName('');

//     try {
//       const response = await apiClient.post('/wallet/verify-bank', {
//         accountNumber: accountNumber,
//         bankCode: selectedBank.code,
//         documentNumber: documentNumber,
//         isForeigner: isForeigner
//       });

//       const isValid = response.data.isValid ?? response.data.IsValid;
//       const accName = response.data.accountName ?? response.data.AccountName;
//       const message = response.data.message ?? response.data.Message;

//       if (isValid) {
//         setAccountName(accName);
//         setVerified(true);
//         Alert.alert('✓ Verified', 'Account verified successfully!');
//       } else {
//         Alert.alert('Verification Failed', message || 'Could not verify account');
//       }
//     } catch (error) {
//       console.error('Verification Error:', error);
      
//       const errorMsg = error.response?.data?.message || 
//                        error.response?.data?.Message || 
//                        'Verification failed. Please check your details.';
//       Alert.alert('Error', errorMsg);
//     } finally {
//       setVerifying(false);
//     }
//   };

//   const handleLinkAccount = async () => {
//     setLinking(true);

//     try {
//       // ✅ Use PascalCase keys to match the C# LinkBankRequest DTO
//       // ✅ Include all required South African compliance fields
//       const response = await apiClient.post('/wallet/link-bank', {
//         AccountNumber: accountNumber,
//         BankCode: selectedBank.code,
//         BankName: selectedBank.name,
//         AccountName: accountName,
//         DocumentNumber: documentNumber,
//         IsForeigner: isForeigner,
//         SetAsPrimary: true
//       });

//       // Extract the new bank ID if the backend returns the object
//       const newBankId = response.data?.bankAccount?.id;

//       Alert.alert(
//         'Success! 🎉',
//         'Bank account linked successfully!',
//         [
//           {
//             text: 'Done',
//             onPress: () => {
//               // ✅ Check if we came from the Withdrawal flow
//               if (route.params?.fromWithdrawal) {
//                 // Navigate back and pass 'refresh' to trigger useFocusEffect 
//                 // and 'linkedBankId' to auto-select the new account
//                 navigation.navigate('WithdrawFunds', { 
//                   refresh: true,
//                   linkedBankId: newBankId 
//                 });
//               } else {
//                 navigation.goBack();
//               }
//             }
//           }
//         ]
//       );
//     } catch (error) {
//       // ✅ Handle both standard error messages and .NET validation errors
//       const validationErrors = error.response?.data?.errors;
//       let errorMsg = error.response?.data?.message || error.response?.data?.Message;

//       if (validationErrors) {
//         // Extracts the first validation error (e.g., "The DocumentNumber field is required")
//         const firstErrorKey = Object.keys(validationErrors)[0];
//         errorMsg = validationErrors[firstErrorKey][0];
//       }

//       console.error('Link Bank Error:', error.response?.data);
//       Alert.alert('Link Error', errorMsg || 'Failed to link account');
//     } finally {
//       setLinking(false);
//     }
//   };

//   return (
//     <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
//       <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

//       {/* ═══ HEADER ═══ */}
//       <SafeAreaView style={[styles.header, { backgroundColor: theme.colors.card }]}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
//           <ArrowLeft size={24} color={theme.colors.textPrimary} strokeWidth={2.5} />
//         </TouchableOpacity>
//         <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>
//           Link Bank Account
//         </Text>
//         <View style={{ width: 44 }} />
//       </SafeAreaView>

//       <ScrollView contentContainerStyle={styles.content}>
//         {/* ═══ PROGRESS STEPS ═══ */}
//         <View style={styles.progressContainer}>
//           <View style={styles.stepsRow}>
//             <View style={[styles.stepCircle, { backgroundColor: theme.colors.primary }]}>
//               <Text style={styles.stepNumber}>1</Text>
//             </View>
//             <View style={[
//               styles.stepLine,
//               { backgroundColor: verified ? theme.colors.primary : theme.colors.border }
//             ]} />
//             <View style={[
//               styles.stepCircle,
//               { backgroundColor: verified ? theme.colors.primary : theme.colors.border }
//             ]}>
//               <Text style={[
//                 styles.stepNumber,
//                 { color: verified ? '#FFF' : theme.colors.textMuted }
//               ]}>
//                 2
//               </Text>
//             </View>
//           </View>
//           <View style={styles.stepLabels}>
//             <Text style={[styles.stepLabel, { color: theme.colors.textSecondary }]}>
//               Enter Details
//             </Text>
//             <Text style={[styles.stepLabel, { color: theme.colors.textSecondary }]}>
//               Verify KYC
//             </Text>
//           </View>
//         </View>

//         {/* ═══ SELECT BANK ═══ */}
//         <View style={styles.section}>
//           <Text style={[theme.typography.labelLarge, { color: theme.colors.textMuted }]}>
//             SELECT YOUR BANK
//           </Text>
          
//           <TouchableOpacity
//             style={[
//               styles.bankSelector,
//               {
//                 backgroundColor: theme.colors.card,
//                 borderColor: selectedBank ? theme.colors.primary : theme.colors.border,
//                 borderWidth: selectedBank ? 2 : 1,
//               },
//               theme.shadows.sm
//             ]}
//             onPress={() => navigation.navigate('BankSelector')}
//           >
//             <View style={[styles.bankIcon, { backgroundColor: theme.colors.primary + '20' }]}>
//               <Building2 size={24} color={theme.colors.primary} strokeWidth={2.5} />
//             </View>
            
//             <View style={{ flex: 1 }}>
//               <Text style={[
//                 theme.typography.bodyMedium,
//                 { color: selectedBank ? theme.colors.textPrimary : theme.colors.textMuted }
//               ]}>
//                 {selectedBank ? selectedBank.name : 'Tap to choose your bank'}
//               </Text>
//               {selectedBank && (
//                 <Text style={[styles.bankCode, { color: theme.colors.textMuted }]}>
//                   Code: {selectedBank.code}
//                 </Text>
//               )}
//             </View>

//             <ChevronRight size={20} color={theme.colors.textMuted} strokeWidth={2.5} />
//           </TouchableOpacity>
//         </View>

//         {/* ═══ ACCOUNT NUMBER ═══ */}
//         <View style={styles.section}>
//           <Text style={[theme.typography.labelLarge, { color: theme.colors.textMuted }]}>
//             ACCOUNT NUMBER
//           </Text>
          
//           <TextInput
//             style={[
//               styles.input,
//               {
//                 backgroundColor: theme.colors.card,
//                 color: theme.colors.textPrimary,
//                 borderColor: verified ? theme.colors.primary : theme.colors.border,
//                 borderWidth: verified ? 2 : 1,
//               },
//               theme.shadows.sm
//             ]}
//             placeholder="Enter 10-digit account number"
//             placeholderTextColor={theme.colors.textMuted}
//             keyboardType="number-pad"
//             maxLength={10}
//             value={accountNumber}
//             onChangeText={(val) => {
//               setAccountNumber(val);
//               setVerified(false);
//               setAccountName('');
//             }}
//             editable={!verified}
//           />

//           {accountNumber.length === 10 && !verified && (
//             <Text style={[styles.hint, { color: theme.colors.success }]}>
//               ✓ Ready to verify with KYC
//             </Text>
//           )}
//         </View>

//         {/* ═══ VERIFY BUTTON ═══ */}
//         {!verified && (
//           <TouchableOpacity
//             style={[
//               styles.verifyButton,
//               {
//                 backgroundColor: selectedBank && accountNumber.length === 10
//                   ? theme.colors.primary
//                   : theme.colors.surface,
//                 opacity: selectedBank && accountNumber.length === 10 ? 1 : 0.6,
//               },
//               theme.shadows.md
//             ]}
//             onPress={handleVerifyAccount}
//             disabled={!selectedBank || accountNumber.length !== 10 || verifying}
//           >
//             {verifying ? (
//               <ActivityIndicator color="#FFF" />
//             ) : (
//               <>
//                 <Shield size={20} color="#FFF" strokeWidth={2.5} />
//                 <Text style={[styles.buttonText, { marginLeft: 8 }]}>
//                   Verify with KYC
//                 </Text>
//               </>
//             )}
//           </TouchableOpacity>
//         )}

//         {/* ═══ VERIFIED CARD ═══ */}
//         {verified && (
//           <View style={[
//             styles.verifiedCard,
//             { backgroundColor: '#10B98120', borderColor: '#10B981' },
//             theme.shadows.md
//           ]}>
//             <CheckCircle size={48} color="#10B981" strokeWidth={2.5} />
//             <View style={{ flex: 1, marginLeft: 16 }}>
//               <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>
//                 Account Verified ✓
//               </Text>
//               <Text style={[styles.verifiedName, { color: theme.colors.textSecondary }]}>
//                 {accountName}
//               </Text>
//               <Text style={[styles.verifiedDetails, { color: theme.colors.textMuted }]}>
//                 {accountNumber} • {selectedBank?.name}
//               </Text>
//               <View style={styles.kycBadge}>
//                 <Shield size={14} color="#10B981" strokeWidth={2.5} />
//                 <Text style={[styles.kycBadgeText, { color: '#10B981' }]}>
//                   KYC Verified
//                 </Text>
//               </View>
//             </View>
//           </View>
//         )}

//         {/* ═══ LINK BUTTON ═══ */}
//         {verified && (
//           <TouchableOpacity
//             style={[
//               styles.linkButton,
//               { backgroundColor: theme.colors.primary },
//               theme.shadows.lg
//             ]}
//             onPress={handleLinkAccount}
//             disabled={linking}
//           >
//             {linking ? (
//               <ActivityIndicator color="#FFF" />
//             ) : (
//               <>
//                 <Text style={styles.buttonText}>Link This Account</Text>
//                 <ChevronRight size={20} color="#FFF" strokeWidth={3} />
//               </>
//             )}
//           </TouchableOpacity>
//         )}

//         {/* ═══ INFO CARD ═══ */}
//         <View style={[styles.infoCard, { backgroundColor: theme.colors.primary + '10' }]}>
//           <AlertCircle size={20} color={theme.colors.primary} strokeWidth={2.5} />
//           <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
//             Your bank details and ID/Passport are encrypted and verified through Paystack. We never store your banking password.
//           </Text>
//         </View>
//       </ScrollView>

//       {/* ═══════════════════════════════════════════════════════════
//           KYC VERIFICATION MODAL
//       ═══════════════════════════════════════════════════════════ */}
//       <Modal
//         visible={showKycModal}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setShowKycModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={[styles.modalContent, { backgroundColor: theme.colors.card }, theme.shadows.lg]}>
//             {/* Modal Header */}
//             <View style={styles.modalHeader}>
//               <View style={[styles.modalIconCircle, { backgroundColor: theme.colors.primary + '20' }]}>
//                 <Shield size={32} color={theme.colors.primary} strokeWidth={2.5} />
//               </View>
//               <TouchableOpacity
//                 onPress={() => setShowKycModal(false)}
//                 style={styles.modalClose}
//               >
//                 <X size={24} color={theme.colors.textMuted} strokeWidth={2.5} />
//               </TouchableOpacity>
//             </View>

//             {/* Modal Title */}
//             <Text style={[theme.typography.h2, { color: theme.colors.textPrimary, textAlign: 'center', marginBottom: 8 }]}>
//               KYC Verification
//             </Text>
//             <Text style={[theme.typography.bodyMedium, { color: theme.colors.textMuted, textAlign: 'center', marginBottom: 32 }]}>
//               Required by Paystack for secure bank account verification
//             </Text>

//             <ScrollView showsVerticalScrollIndicator={false}>
//               {/* Citizenship Toggle */}
//               <View style={styles.toggleSection}>
//                 <Text style={[theme.typography.labelLarge, { color: theme.colors.textMuted, marginBottom: 16 }]}>
//                   CITIZENSHIP STATUS
//                 </Text>
                
//                 <View style={styles.toggleButtons}>
//                   <TouchableOpacity
//                     style={[
//                       styles.toggleButton,
//                       {
//                         backgroundColor: !isForeigner ? theme.colors.primary : theme.colors.surface,
//                         borderColor: !isForeigner ? theme.colors.primary : theme.colors.border,
//                       }
//                     ]}
//                     onPress={() => {
//                       setIsForeigner(false);
//                       setDocumentNumber('');
//                     }}
//                   >
//                     <Text style={[
//                       styles.toggleButtonText,
//                       { color: !isForeigner ? '#FFF' : theme.colors.textMuted }
//                     ]}>
//                       🇿🇦 South African Citizen
//                     </Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     style={[
//                       styles.toggleButton,
//                       {
//                         backgroundColor: isForeigner ? theme.colors.primary : theme.colors.surface,
//                         borderColor: isForeigner ? theme.colors.primary : theme.colors.border,
//                       }
//                     ]}
//                     onPress={() => {
//                       setIsForeigner(true);
//                       setDocumentNumber('');
//                     }}
//                   >
//                     <Globe size={18} color={isForeigner ? '#FFF' : theme.colors.textMuted} />
//                     <Text style={[
//                       styles.toggleButtonText,
//                       { color: isForeigner ? '#FFF' : theme.colors.textMuted, marginLeft: 8 }
//                     ]}>
//                       Foreign Passport
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>

//               {/* Document Number Input */}
//               <View style={styles.inputSection}>
//                 <Text style={[theme.typography.labelLarge, { color: theme.colors.textMuted, marginBottom: 12 }]}>
//                   {isForeigner ? 'PASSPORT NUMBER' : 'SA ID NUMBER'}
//                 </Text>
                
//                 <View style={[
//                   styles.documentInput,
//                   {
//                     backgroundColor: theme.colors.surface,
//                     borderColor: theme.colors.border,
//                   }
//                 ]}>
//                   <FileText size={20} color={theme.colors.primary} strokeWidth={2.5} />
//                   <TextInput
//                     style={[styles.documentTextInput, { color: theme.colors.textPrimary }]}
//                     placeholder={
//                       isForeigner 
//                         ? 'Enter passport number (e.g., A12345678)' 
//                         : 'Enter 13-digit ID number'
//                     }
//                     placeholderTextColor={theme.colors.textMuted}
//                     value={documentNumber}
//                     onChangeText={setDocumentNumber}
//                     keyboardType={isForeigner ? 'default' : 'number-pad'}
//                     maxLength={isForeigner ? 20 : 13}
//                     autoCapitalize={isForeigner ? 'characters' : 'none'}
//                   />
//                 </View>

//                 {/* Helper Text */}
//                 <View style={[styles.helperBox, { backgroundColor: theme.colors.surface }]}>
//                   <Text style={[styles.helperText, { color: theme.colors.textMuted }]}>
//                     {isForeigner ? (
//                       <>
//                         💡 Enter your passport number as shown on your document.
//                         {'\n'}Example: A12345678 or P987654321
//                       </>
//                     ) : (
//                       <>
//                         💡 Your South African ID number is 13 digits.
//                         {'\n'}Example: 9001015800087
//                       </>
//                     )}
//                   </Text>
//                 </View>
//               </View>

//               {/* Security Notice */}
//               <View style={[styles.securityNotice, { backgroundColor: '#10B98110', borderColor: '#10B981' }]}>
//                 <Shield size={20} color="#10B981" strokeWidth={2.5} />
//                 <Text style={[styles.securityText, { color: theme.colors.textSecondary }]}>
//                   Your document details are encrypted end-to-end and only used for Paystack KYC verification. We never share your information.
//                 </Text>
//               </View>

//               {/* Submit Button */}
//               <TouchableOpacity
//                 style={[
//                   styles.kycSubmitButton,
//                   {
//                     backgroundColor: documentNumber.trim() ? theme.colors.primary : theme.colors.surface,
//                     opacity: documentNumber.trim() ? 1 : 0.6,
//                   },
//                   theme.shadows.lg
//                 ]}
//                 onPress={handleKycSubmit}
//                 disabled={!documentNumber.trim()}
//               >
//                 <Text style={[
//                   styles.kycSubmitText,
//                   { color: documentNumber.trim() ? '#FFF' : theme.colors.textMuted }
//                 ]}>
//                   Verify & Continue
//                 </Text>
//               </TouchableOpacity>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
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

//   // Progress
//   progressContainer: {
//     marginBottom: 32,
//   },
//   stepsRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   stepCircle: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   stepNumber: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: '900',
//   },
//   stepLine: {
//     flex: 1,
//     height: 3,
//     marginHorizontal: 8,
//   },
//   stepLabels: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 8,
//   },
//   stepLabel: {
//     fontSize: 12,
//     fontWeight: '600',
//   },

//   // Section
//   section: {
//     marginBottom: 24,
//   },

//   // Bank Selector
//   bankSelector: {
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
//   bankCode: {
//     fontSize: 12,
//     fontWeight: '600',
//     marginTop: 2,
//   },

//   // Input
//   input: {
//     padding: 16,
//     borderRadius: 16,
//     fontSize: 18,
//     fontWeight: '700',
//     marginTop: 12,
//   },
//   hint: {
//     fontSize: 13,
//     fontWeight: '600',
//     marginTop: 8,
//     marginLeft: 4,
//   },

//   // Buttons
//   verifyButton: {
//     flexDirection: 'row',
//     paddingVertical: 18,
//     borderRadius: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 24,
//   },
//   linkButton: {
//     flexDirection: 'row',
//     paddingVertical: 18,
//     borderRadius: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//     marginBottom: 24,
//   },
//   buttonText: {
//     fontSize: 16,
//     fontWeight: '900',
//     color: '#FFF',
//   },

//   // Verified Card
//   verifiedCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 20,
//     borderRadius: 16,
//     borderWidth: 2,
//     marginBottom: 24,
//   },
//   verifiedName: {
//     fontSize: 18,
//     fontWeight: '800',
//     marginTop: 8,
//   },
//   verifiedDetails: {
//     fontSize: 13,
//     fontWeight: '600',
//     marginTop: 4,
//   },
//   kycBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     marginTop: 8,
//   },
//   kycBadgeText: {
//     fontSize: 12,
//     fontWeight: '700',
//   },

//   // Info Card
//   infoCard: {
//     flexDirection: 'row',
//     padding: 16,
//     borderRadius: 12,
//     gap: 12,
//   },
//   infoText: {
//     flex: 1,
//     fontSize: 13,
//     fontWeight: '600',
//     lineHeight: 20,
//   },

//   // ═══════════════════════════════════════════════════════════
//   // KYC MODAL STYLES
//   // ═══════════════════════════════════════════════════════════
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     borderTopLeftRadius: 32,
//     borderTopRightRadius: 32,
//     paddingTop: 24,
//     paddingHorizontal: 24,
//     paddingBottom: 40,
//     maxHeight: '90%',
//   },
//   modalHeader: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   modalIconCircle: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalClose: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   // Toggle Section
//   toggleSection: {
//     marginBottom: 32,
//   },
//   toggleButtons: {
//     gap: 12,
//   },
//   toggleButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 16,
//     borderRadius: 16,
//     borderWidth: 2,
//   },
//   toggleButtonText: {
//     fontSize: 15,
//     fontWeight: '800',
//   },

//   // Document Input
//   inputSection: {
//     marginBottom: 24,
//   },
//   documentInput: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderRadius: 16,
//     borderWidth: 1.5,
//     gap: 12,
//   },
//   documentTextInput: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: '700',
//   },

//   // Helper Box
//   helperBox: {
//     padding: 12,
//     borderRadius: 12,
//     marginTop: 12,
//   },
//   helperText: {
//     fontSize: 13,
//     fontWeight: '600',
//     lineHeight: 20,
//   },

//   // Security Notice
//   securityNotice: {
//     flexDirection: 'row',
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//     gap: 12,
//     marginBottom: 24,
//   },
//   securityText: {
//     flex: 1,
//     fontSize: 13,
//     fontWeight: '600',
//     lineHeight: 20,
//   },

//   // Submit Button
//   kycSubmitButton: {
//     paddingVertical: 18,
//     borderRadius: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   kycSubmitText: {
//     fontSize: 16,
//     fontWeight: '900',
//   },
// });









// screens/wallet/LinkBankAccountScreen.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, ActivityIndicator, SafeAreaView, Alert, StatusBar, Modal
} from 'react-native';
import {
  ArrowLeft, Building2, CheckCircle, AlertCircle, ChevronRight,
  FileText, X, Shield, Globe, Lock, User as UserIcon
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../theme/designSystem';
import apiClient from '../services/apiClient';

export default function LinkBankAccountScreen({ navigation, route }) {
  const { isDark } = useTheme();
  const theme = useMemo(() => getTheme(isDark), [isDark]);

  // ═══ STATE ═══
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState(''); // Manually typed
  const [documentNumber, setDocumentNumber] = useState('');
  const [pin, setPin] = useState(''); // Transaction PIN
  const [isForeigner, setIsForeigner] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [linking, setLinking] = useState(false);
  
  // KYC Modal
  const [showKycModal, setShowKycModal] = useState(false);

  // ═══ HANDLE BANK SELECTION ═══
  useEffect(() => {
    if (route.params?.selectedBank) {
      setSelectedBank(route.params.selectedBank);
      navigation.setParams({ selectedBank: null });
    }
  }, [route.params?.selectedBank]);

  // ═══ VERIFY ACCOUNT (Opens KYC Modal) ═══
  const handleVerifyAccount = () => {
    if (!selectedBank) {
      Alert.alert('Select Bank', 'Please select your bank first');
      return;
    }
    if (accountNumber.length < 7) {
      Alert.alert('Invalid Account', 'Please enter a valid account number');
      return;
    }
    if (!accountName.trim()) {
      Alert.alert('Name Required', 'Please enter the account holder name exactly as it appears on your bank statement');
      return;
    }
    setShowKycModal(true);
  };

  // ═══ SUBMIT KYC & VERIFY ═══
 // ═══ SUBMIT KYC & VERIFY ═══
// ═══ SUBMIT KYC & VERIFY ═══
  const handleKycSubmit = async () => {
    if (!documentNumber.trim()) {
      Alert.alert('Document Required', 'Please enter your ID or Passport number');
      return;
    }

    setShowKycModal(false);
    setVerifying(true);
    setVerified(false);

    try {
      // POST to /wallet/verify-bank
      const response = await apiClient.post('/wallet/verify-bank', {
        accountNumber: accountNumber,
        bankCode: selectedBank.code,
        accountName: accountName,
        documentNumber: documentNumber,
        isForeigner: isForeigner,
        accountType: "personal" // ✅ Added: Required by Paystack SA Validation
      });

      const isValid = response.data.isValid ?? response.data.IsValid;

      if (isValid) {
        setVerified(true);
        Alert.alert('✓ Match Found', 'Identity and bank account linked successfully.');
      } else {
        Alert.alert('Verification Failed', response.data.message || 'Details do not match bank records');
      }
    } catch (error) {
      console.error("Verification Error:", error.response?.data);
      const errorMsg = error.response?.data?.message || 'Verification failed. Please check your ID and Account number.';
      Alert.alert('Error', errorMsg);
    } finally {
      setVerifying(false);
    }
  };

  // ═══ COMPLETE LINKING ═══
  const handleLinkAccount = async () => {
    if (pin.length !== 4) {
      Alert.alert('PIN Required', 'Please enter your 4-digit transaction PIN');
      return;
    }

    setLinking(true);
    try {
      const response = await apiClient.post('/wallet/link-bank', {
        accountNumber: accountNumber,
        bankCode: selectedBank.code,
        bankName: selectedBank.name,
        accountName: accountName,
        documentNumber: documentNumber,
        isForeigner: isForeigner,
        accountType: "personal", // ✅ Added for consistency
        pin: pin, 
        setAsPrimary: true
      });

      const newBankId = response.data?.bankAccount?.id;

      Alert.alert('Success! 🎉', 'Bank account linked successfully!', [
        {
          text: 'Done',
          onPress: () => {
            if (route.params?.fromWithdrawal) {
              navigation.navigate('WithdrawFunds', { refresh: true, linkedBankId: newBankId });
            } else {
              navigation.goBack();
            }
          }
        }
      ]);
    } catch (error) {
      console.error("Linking Error:", error.response?.data);
      const errorMsg = error.response?.data?.message || 'Failed to link account. Check your PIN.';
      Alert.alert('Link Error', errorMsg);
    } finally {
      setLinking(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <SafeAreaView style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <ArrowLeft size={24} color={theme.colors.textPrimary} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>Link Bank Account</Text>
        <View style={{ width: 44 }} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content}>
        {/* PROGRESS STEPS */}
        <View style={styles.progressContainer}>
          <View style={styles.stepsRow}>
            <View style={[styles.stepCircle, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <View style={[styles.stepLine, { backgroundColor: verified ? theme.colors.primary : theme.colors.border }]} />
            <View style={[styles.stepCircle, { backgroundColor: verified ? theme.colors.primary : theme.colors.border }]}>
              <Text style={[styles.stepNumber, { color: verified ? '#FFF' : theme.colors.textMuted }]}>2</Text>
            </View>
          </View>
        </View>

        {/* 1. SELECT BANK */}
        <View style={styles.section}>
          <Text style={[theme.typography.labelLarge, { color: theme.colors.textMuted }]}>SELECT BANK</Text>
          <TouchableOpacity
            style={[styles.bankSelector, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 1 }]}
            onPress={() => navigation.navigate('BankSelector')}
            disabled={verified}
          >
            <Building2 size={24} color={theme.colors.primary} />
            <Text style={{ flex: 1, marginLeft: 12, color: theme.colors.textPrimary }}>
              {selectedBank ? selectedBank.name : 'Choose bank'}
            </Text>
            <ChevronRight size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* 2. ACCOUNT HOLDER NAME (New Required Field for SA) */}
        <View style={styles.section}>
          <Text style={[theme.typography.labelLarge, { color: theme.colors.textMuted }]}>ACCOUNT HOLDER NAME</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.textPrimary, borderColor: theme.colors.border, borderWidth: 1 }]}
            placeholder="e.g. JOHN DOE"
            placeholderTextColor={theme.colors.textMuted}
            value={accountName}
            onChangeText={setAccountName}
            editable={!verified}
          />
        </View>

        {/* 3. ACCOUNT NUMBER */}
        <View style={styles.section}>
          <Text style={[theme.typography.labelLarge, { color: theme.colors.textMuted }]}>ACCOUNT NUMBER</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.textPrimary, borderColor: theme.colors.border, borderWidth: 1 }]}
            placeholder="Enter account number"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="number-pad"
            value={accountNumber}
            onChangeText={(val) => { setAccountNumber(val); setVerified(false); }}
            editable={!verified}
          />
        </View>

        {!verified ? (
          <TouchableOpacity
            style={[styles.verifyButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleVerifyAccount}
            disabled={verifying}
          >
            {verifying ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Verify Identity</Text>}
          </TouchableOpacity>
        ) : (
          <View style={styles.section}>
             {/* 4. TRANSACTION PIN (Required for final linking) */}
             <Text style={[theme.typography.labelLarge, { color: theme.colors.textMuted }]}>TRANSACTION PIN</Text>
             <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.primary, borderWidth: 1 }]}>
                <Lock size={20} color={theme.colors.primary} style={{ marginLeft: 15 }} />
                <TextInput
                    style={[styles.inputField, { color: theme.colors.textPrimary }]}
                    placeholder="Enter 4-digit PIN"
                    placeholderTextColor={theme.colors.textMuted}
                    keyboardType="number-pad"
                    secureTextEntry
                    maxLength={4}
                    value={pin}
                    onChangeText={setPin}
                />
             </View>

             <TouchableOpacity
                style={[styles.linkButton, { backgroundColor: theme.colors.primary, marginTop: 20 }]}
                onPress={handleLinkAccount}
                disabled={linking || pin.length !== 4}
              >
                {linking ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Complete Linking</Text>}
              </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* KYC MODAL (Remains similar but ensures it uses the states correctly) */}
      <Modal visible={showKycModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
                <Text style={[theme.typography.h3, { color: theme.colors.textPrimary, textAlign: 'center' }]}>Identity Check</Text>
                <View style={styles.toggleButtons}>
                    <TouchableOpacity 
                        onPress={() => setIsForeigner(false)}
                        style={[styles.toggleButton, !isForeigner && { backgroundColor: theme.colors.primary }]}
                    >
                        <Text style={{ color: !isForeigner ? '#FFF' : theme.colors.textPrimary }}>SA Citizen (ID)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => setIsForeigner(true)}
                        style={[styles.toggleButton, isForeigner && { backgroundColor: theme.colors.primary }]}
                    >
                        <Text style={{ color: isForeigner ? '#FFF' : theme.colors.textPrimary }}>Foreigner (Passport)</Text>
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary }]}
                    placeholder={isForeigner ? "Passport Number" : "13-digit ID Number"}
                    value={documentNumber}
                    onChangeText={setDocumentNumber}
                    keyboardType={isForeigner ? "default" : "number-pad"}
                />
                <TouchableOpacity style={[styles.kycSubmitButton, { backgroundColor: theme.colors.primary }]} onPress={handleKycSubmit}>
                    <Text style={styles.buttonText}>Confirm & Verify</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowKycModal(false)} style={{ marginTop: 15 }}>
                    <Text style={{ color: theme.colors.textMuted, textAlign: 'center' }}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  content: { padding: 16 },
  section: { marginBottom: 20 },
  bankSelector: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12 },
  input: { padding: 16, borderRadius: 12, fontSize: 16, fontWeight: '600' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, height: 55 },
  inputField: { flex: 1, paddingHorizontal: 15, fontSize: 16, fontWeight: 'bold' },
  verifyButton: { padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  linkButton: { padding: 18, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalContent: { padding: 24, borderRadius: 20 },
  toggleButtons: { flexDirection: 'row', gap: 10, marginVertical: 20 },
  toggleButton: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#ddd' },
  kycSubmitButton: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  progressContainer: { marginBottom: 20 },
  stepsRow: { flexDirection: 'row', alignItems: 'center' },
  stepCircle: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  stepNumber: { color: '#FFF', fontWeight: 'bold' },
  stepLine: { flex: 1, height: 2, marginHorizontal: 5 }
});