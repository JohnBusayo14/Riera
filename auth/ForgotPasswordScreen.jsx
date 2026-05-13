// // screens/ForgotPasswordScreen.jsx
// // 🔐 Complete Password Reset with EmailJS - FIXED

// import React, { useState, useRef, useEffect } from 'react';
// import { 
//   View, Text, StyleSheet, TouchableOpacity, 
//   SafeAreaView, Animated, Easing, Alert 
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { ArrowLeft, Mail, KeyRound, CheckCircle2, ShieldCheck, Lock } from 'lucide-react-native';
// import { COLORS } from '../constants';
// import Input from '../components/Input';
// import Button from '../components/Button';
// import { authApi } from '../api/authApi';


// // ═══════════════════════════════════════════════════════════
// // EMAILJS CONFIGURATION
// // ═══════════════════════════════════════════════════════════
// const EMAILJS_CONFIG = {
//   serviceId: 'service_fwldy0q',
//   templateId: 'template_8azkn2q',
//   publicKey: 'oC1buhsbtIYiLvnxbUJxc'  // Get from https://dashboard.emailjs.com/admin/account
// };

// export default function ForgotPasswordScreen() {
//   const navigation = useNavigation();
  
//   // ═══ STATE ═══
//   const [email, setEmail] = useState('');
//   const [token, setToken] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [step, setStep] = useState('request'); // 'request' | 'reset' | 'success'
//   const [emailInitialized, setEmailInitialized] = useState(false);

//   // ═══ ANIMATIONS ═══
//   const slideAnim = useRef(new Animated.Value(20)).current;
//   const opacityAnim = useRef(new Animated.Value(0)).current;

//   // ═══════════════════════════════════════════════════════════
//   // INITIALIZE EMAILJS ON MOUNT
//   // ═══════════════════════════════════════════════════════════
//   useEffect(() => {
//     const initEmailJS = async () => {
//       try {
//         // ✅ Initialize EmailJS with public key
//         await emailjs.init(EMAILJS_CONFIG.publicKey);
//         setEmailInitialized(true);
//         console.log('✅ EmailJS initialized successfully');
//       } catch (error) {
//         console.error('❌ EmailJS initialization failed:', error);
//         setEmailInitialized(false);
//       }
//     };

//     initEmailJS();
//   }, []);

//   // ═══════════════════════════════════════════════════════════
//   // STEP TRANSITION ANIMATION
//   // ═══════════════════════════════════════════════════════════
//   useEffect(() => {
//     opacityAnim.setValue(0);
//     slideAnim.setValue(20);
    
//     Animated.parallel([
//       Animated.timing(opacityAnim, { 
//         toValue: 1, 
//         duration: 400, 
//         useNativeDriver: true 
//       }),
//       Animated.timing(slideAnim, { 
//         toValue: 0, 
//         duration: 400, 
//         easing: Easing.out(Easing.quad), 
//         useNativeDriver: true 
//       })
//     ]).start();
//   }, [step]);

//   // ═══════════════════════════════════════════════════════════
//   // NAVIGATION
//   // ═══════════════════════════════════════════════════════════
//   const handleBack = () => {
//     if (step === 'reset') {
//       setStep('request');
//     } else {
//       navigation.navigate('SignIn');
//     }
//   };

//   // ═══════════════════════════════════════════════════════════
//   // STEP 1: REQUEST RESET CODE
//   // ═══════════════════════════════════════════════════════════
// const handleRequestCode = async () => {
//     // 1. Basic Validation
//     if (!email || !email.includes('@')) {
//       Alert.alert('Invalid Email', 'Please enter a valid email address.');
//       return;
//     }

//     setLoading(true);

//     try {
//       console.log('📧 Requesting reset code from backend...');
      
//       // Step 1: Tell the backend to generate the code AND send the SMTP email
//       const response = await authApi.forgotPassword(email.trim().toLowerCase());
      
//       // Step 2: Check for success
//       // Note: We NO LONGER look for a 'code' in the response. 
//       // The backend sends the email directly to the user's inbox.
//       console.log('✅ Backend successfully handled the request');

//       // Move to the 'reset' step where the user enters the 6-digit code
//       setStep('reset');
      
//       Alert.alert(
//         'Code Sent! 📧',
//         `If an account exists for ${email}, a 6-digit reset code has been sent to your inbox.`,
//         [{ text: 'OK' }]
//       );

//     } catch (error) {
//       console.error('❌ Forgot Password Error:', error);
      
//       let errorMessage = 'Could not send reset code. Please try again.';
      
//       // Handle Backend error response
//       if (error.response?.data) {
//         const data = error.response.data;
//         errorMessage = data.message || data.Message || errorMessage;
//       } 
//       else if (error.message) {
//         errorMessage = error.message;
//       }

//       Alert.alert('Failed', errorMessage);
//     } finally {
//       setLoading(false);
//     }
// };

//   // ═══════════════════════════════════════════════════════════
//   // STEP 2: RESET PASSWORD WITH CODE
//   // ═══════════════════════════════════════════════════════════
//   const handleResetPassword = async () => {
//     // Validate inputs
//     if (token.length < 6) {
//       Alert.alert('Invalid Code', 'Please enter the complete 6-digit code.');
//       return;
//     }

//     if (newPassword.length < 6) {
//       Alert.alert('Weak Password', 'Password must be at least 6 characters.');
//       return;
//     }

//     setLoading(true);

//     try {
//       console.log('🔄 Resetting password for:', email);

//       await authApi.resetPassword({ 
//         email: email.trim().toLowerCase(), 
//         token: token.trim(), 
//         newPassword 
//       });

//       console.log('✅ Password reset successful');

//       setStep('success');

//       Alert.alert(
//         'Success! 🎉',
//         'Your password has been reset successfully.',
//         [{ text: 'OK' }]
//       );

//     } catch (error) {
//       console.error('❌ Reset Password Error:', error);
      
//       const errorMsg = error.response?.data?.message || 
//                        error.response?.data?.Message || 
//                        'Invalid code or expired token. Please request a new code.';
      
//       Alert.alert('Reset Failed', errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ═══════════════════════════════════════════════════════════
//   // RENDER CONTENT BASED ON STEP
//   // ═══════════════════════════════════════════════════════════
//   const renderContent = () => {
//     // STEP 1: REQUEST CODE
//     if (step === 'request') {
//       return (
//         <Animated.View 
//           style={[
//             styles.inner, 
//             { opacity: opacityAnim, transform: [{ translateY: slideAnim }] }
//           ]}
//         >
//           <View style={styles.iconBox}>
//             <KeyRound size={32} color={COLORS.primary} strokeWidth={2} />
//           </View>
          
//           <Text style={styles.title}>Forgot Password?</Text>
//           <Text style={styles.subtitle}>
//             Enter your email and we'll send a 6-digit code to reset your password.
//           </Text>

//           <View style={styles.form}>
//             <Input 
//               label="EMAIL ADDRESS"
//               placeholder="name@example.com"
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               autoCapitalize="none"
//               leftIcon={<Mail size={18} color={COLORS.slate400} />}
//             />
            
//             <Button 
//               title={emailInitialized ? "Send Reset Code" : "Loading..."} 
//               onPress={handleRequestCode} 
//               loading={loading}
//               disabled={!emailInitialized || loading}
//               style={styles.submitBtn}
//             />

//             {!emailInitialized && (
//               <Text style={styles.initializingText}>
//                 Initializing email service...
//               </Text>
//             )}
//           </View>
//         </Animated.View>
//       );
//     }

//     // STEP 2: VERIFY CODE & RESET
//     if (step === 'reset') {
//       return (
//         <Animated.View 
//           style={[
//             styles.inner, 
//             { opacity: opacityAnim, transform: [{ translateY: slideAnim }] }
//           ]}
//         >
//           <View style={[styles.iconBox, { backgroundColor: '#eff6ff' }]}>
//             <ShieldCheck size={32} color="#3b82f6" strokeWidth={2} />
//           </View>
          
//           <Text style={styles.title}>Verify Code</Text>
//           <Text style={styles.subtitle}>
//             We sent a code to{' '}
//             <Text style={{ fontWeight: '700', color: '#0f172a' }}>
//               {email}
//             </Text>
//           </Text>

//           <View style={styles.form}>
//             <Input 
//               label="6-DIGIT CODE"
//               placeholder="123456"
//               value={token}
//               onChangeText={setToken}
//               keyboardType="number-pad"
//               maxLength={6}
//               leftIcon={<Lock size={18} color={COLORS.slate400} />}
//             />
            
//             <Input 
//               label="NEW PASSWORD"
//               placeholder="••••••••"
//               value={newPassword}
//               onChangeText={setNewPassword}
//               secureTextEntry
//               leftIcon={<Lock size={18} color={COLORS.slate400} />}
//             />
            
//             <Button 
//               title="Update Password" 
//               onPress={handleResetPassword} 
//               loading={loading}
//               style={[styles.submitBtn, { backgroundColor: '#3b82f6' }]}
//             />
            
//             <TouchableOpacity 
//               onPress={() => {
//                 setStep('request');
//                 setToken('');
//                 setNewPassword('');
//               }} 
//               style={styles.resendBtn}
//             >
//               <Text style={styles.resendText}>
//                 Didn't get a code?{' '}
//                 <Text style={styles.resendAction}>Resend</Text>
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </Animated.View>
//       );
//     }

//     // STEP 3: SUCCESS
//     return (
//       <Animated.View 
//         style={[
//           styles.successContent, 
//           { opacity: opacityAnim }
//         ]}
//       >
//         <CheckCircle2 size={80} color={COLORS.primary} strokeWidth={1.5} />
        
//         <Text style={styles.successTitle}>Password Reset!</Text>
//         <Text style={styles.successSub}>
//           Your password has been successfully updated. You can now log in with your new credentials.
//         </Text>
        
//         <Button 
//           title="Proceed to Login" 
//           onPress={() => navigation.navigate('SignIn')} 
//           style={styles.backToSignInBtn}
//         />
//       </Animated.View>
//     );
//   };

//   // ═══════════════════════════════════════════════════════════
//   // RENDER
//   // ═══════════════════════════════════════════════════════════
//   return (
//     <View style={styles.container}>
//       <SafeAreaView style={styles.headerWrapper}>
//         <View style={styles.compactHeader}>
//           <TouchableOpacity style={styles.backButton} onPress={handleBack}>
//             <ArrowLeft size={22} color="#0f172a" strokeWidth={2.5} />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>
//             {step === 'reset' ? 'Verify Account' : 'Reset Password'}
//           </Text>
//           <View style={{ width: 40 }} />
//         </View>
//       </SafeAreaView>
      
//       <View style={styles.content}>
//         {renderContent()}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: '#fff' 
//   },
//   headerWrapper: { 
//     backgroundColor: 'white', 
//     borderBottomWidth: 1, 
//     borderBottomColor: '#f1f5f9' 
//   },
//   compactHeader: { 
//     height: 50, 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'space-between', 
//     paddingHorizontal: 15 
//   },
//   backButton: { 
//     width: 40, 
//     height: 40, 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   headerTitle: { 
//     fontSize: 17, 
//     fontWeight: '800', 
//     color: '#0f172a' 
//   },
//   content: { 
//     flex: 1, 
//     padding: 30, 
//     justifyContent: 'center' 
//   },
//   inner: { 
//     width: '100%', 
//     alignItems: 'center' 
//   },
//   iconBox: { 
//     width: 70, 
//     height: 70, 
//     borderRadius: 24, 
//     backgroundColor: '#f0fdf4',
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     marginBottom: 25
//   },
//   title: { 
//     fontSize: 26, 
//     fontWeight: '900', 
//     color: '#0f172a', 
//     marginBottom: 12 
//   },
//   subtitle: { 
//     fontSize: 15, 
//     color: '#64748b', 
//     textAlign: 'center', 
//     lineHeight: 22, 
//     paddingHorizontal: 10 
//   },
//   form: { 
//     width: '100%', 
//     marginTop: 20 
//   },
//   submitBtn: { 
//     height: 56, 
//     borderRadius: 16, 
//     marginTop: 10 
//   },
//   initializingText: {
//     fontSize: 13,
//     color: '#94a3b8',
//     textAlign: 'center',
//     marginTop: 12,
//     fontWeight: '600'
//   },
//   successContent: { 
//     alignItems: 'center' 
//   },
//   successTitle: { 
//     fontSize: 24, 
//     fontWeight: '900', 
//     color: '#0f172a', 
//     marginTop: 20 
//   },
//   successSub: { 
//     fontSize: 15, 
//     color: '#64748b', 
//     textAlign: 'center', 
//     marginTop: 12, 
//     lineHeight: 24, 
//     paddingHorizontal: 20 
//   },
//   resendBtn: { 
//     marginTop: 20, 
//     alignSelf: 'center' 
//   },
//   resendText: { 
//     fontSize: 14, 
//     color: '#64748b' 
//   },
//   resendAction: { 
//     color: COLORS.primary, 
//     fontWeight: '800' 
//   },
//   backToSignInBtn: { 
//     width: '100%', 
//     height: 56, 
//     borderRadius: 16, 
//     marginTop: 40, 
//     backgroundColor: '#0f172a' 
//   }
// });










// // screens/ForgotPasswordScreen.jsx
// // 🔐 Password Reset - Backend SMTP Integrated

// import React, { useState, useRef, useEffect } from 'react';
// import { 
//   View, Text, StyleSheet, TouchableOpacity, 
//   SafeAreaView, Animated, Easing, Alert 
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { ArrowLeft, Mail, KeyRound, CheckCircle2, ShieldCheck, Lock } from 'lucide-react-native';
// import { COLORS } from '../constants';
// import Input from '../components/Input';
// import Button from '../components/Button';
// import { authApi } from '../api/authApi';

// export default function ForgotPasswordScreen() {
//   const navigation = useNavigation();
  
//   // ═══ STATE ═══
//   const [email, setEmail] = useState('');
//   const [token, setToken] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [step, setStep] = useState('request'); // 'request' | 'reset' | 'success'

//   // ═══ ANIMATIONS ═══
//   const slideAnim = useRef(new Animated.Value(20)).current;
//   const opacityAnim = useRef(new Animated.Value(0)).current;

//   // ═══════════════════════════════════════════════════════════
//   // STEP TRANSITION ANIMATION
//   // ═══════════════════════════════════════════════════════════
//   useEffect(() => {
//     opacityAnim.setValue(0);
//     slideAnim.setValue(20);
    
//     Animated.parallel([
//       Animated.timing(opacityAnim, { 
//         toValue: 1, 
//         duration: 400, 
//         useNativeDriver: true 
//       }),
//       Animated.timing(slideAnim, { 
//         toValue: 0, 
//         duration: 400, 
//         easing: Easing.out(Easing.quad), 
//         useNativeDriver: true 
//       })
//     ]).start();
//   }, [step]);

//   // ═══════════════════════════════════════════════════════════
//   // NAVIGATION
//   // ═══════════════════════════════════════════════════════════
//   const handleBack = () => {
//     if (step === 'reset') {
//       setStep('request');
//     } else {
//       navigation.navigate('SignIn');
//     }
//   };

//   // ═══════════════════════════════════════════════════════════
//   // STEP 1: REQUEST RESET CODE (Backend handles Email)
//   // ═══════════════════════════════════════════════════════════
//   const handleRequestCode = async () => {
//     if (!email || !email.includes('@')) {
//       Alert.alert('Invalid Email', 'Please enter a valid email address.');
//       return;
//     }

//     setLoading(true);

//     try {
//       console.log('📧 Requesting reset code from backend...');
      
//       // The C# backend generates the code AND sends the email via SMTP
//       await authApi.forgotPassword(email.trim().toLowerCase());
      
//       console.log('✅ Backend successfully processed request');

//       setStep('reset');
      
//       Alert.alert(
//         'Code Sent! 📧',
//         `If an account exists for ${email}, a 6-digit reset code has been sent to your inbox.`,
//         [{ text: 'OK' }]
//       );

//     } catch (error) {
//       console.error('❌ Forgot Password Error:', error);
      
//       let errorMessage = 'Could not send reset code. Please try again.';
//       if (error.response?.data) {
//         const data = error.response.data;
//         errorMessage = data.message || data.Message || errorMessage;
//       } 
//       else if (error.message) {
//         errorMessage = error.message;
//       }

//       Alert.alert('Failed', errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ═══════════════════════════════════════════════════════════
//   // STEP 2: RESET PASSWORD WITH CODE
//   // ═══════════════════════════════════════════════════════════
//   const handleResetPassword = async () => {
//     if (token.length < 6) {
//       Alert.alert('Invalid Code', 'Please enter the complete 6-digit code.');
//       return;
//     }

//     if (newPassword.length < 8) {
//       Alert.alert('Password Too Short', 'For security, password must be at least 8 characters.');
//       return;
//     }

//     setLoading(true);

//     try {
//       console.log('🔄 Resetting password for:', email);

//       await authApi.resetPassword({ 
//         email: email.trim().toLowerCase(), 
//         token: token.trim(), 
//         newPassword 
//       });

//       console.log('✅ Password reset successful');
//       setStep('success');

//     } catch (error) {
//       console.error('❌ Reset Password Error:', error);
//       const errorMsg = error.response?.data?.message || 'Invalid code or expired token.';
//       Alert.alert('Reset Failed', errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ═══════════════════════════════════════════════════════════
//   // RENDER CONTENT
//   // ═══════════════════════════════════════════════════════════
//   const renderContent = () => {
//     if (step === 'request') {
//       return (
//         <Animated.View 
//           style={[
//             styles.inner, 
//             { opacity: opacityAnim, transform: [{ translateY: slideAnim }] }
//           ]}
//         >
//           <View style={styles.iconBox}>
//             <KeyRound size={32} color={COLORS.primary} strokeWidth={2} />
//           </View>
          
//           <Text style={styles.title}>Forgot Password?</Text>
//           <Text style={styles.subtitle}>
//             Enter your email and we'll send a 6-digit code to reset your password.
//           </Text>

//           <View style={styles.form}>
//             <Input 
//               label="EMAIL ADDRESS"
//               placeholder="name@example.com"
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               autoCapitalize="none"
//               leftIcon={<Mail size={18} color={COLORS.slate400} />}
//             />
            
//             <Button 
//               title="Send Reset Code" 
//               onPress={handleRequestCode} 
//               loading={loading}
//               style={styles.submitBtn}
//             />
//           </View>
//         </Animated.View>
//       );
//     }

//     if (step === 'reset') {
//       return (
//         <Animated.View 
//           style={[
//             styles.inner, 
//             { opacity: opacityAnim, transform: [{ translateY: slideAnim }] }
//           ]}
//         >
//           <View style={[styles.iconBox, { backgroundColor: '#eff6ff' }]}>
//             <ShieldCheck size={32} color="#3b82f6" strokeWidth={2} />
//           </View>
          
//           <Text style={styles.title}>Verify Code</Text>
//           <Text style={styles.subtitle}>
//             We sent a code to{' '}
//             <Text style={{ fontWeight: '700', color: '#0f172a' }}>
//               {email}
//             </Text>
//           </Text>

//           <View style={styles.form}>
//             <Input 
//               label="6-DIGIT CODE"
//               placeholder="123456"
//               value={token}
//               onChangeText={setToken}
//               keyboardType="number-pad"
//               maxLength={6}
//               leftIcon={<Lock size={18} color={COLORS.slate400} />}
//             />
            
//             <Input 
//               label="NEW PASSWORD"
//               placeholder="••••••••"
//               value={newPassword}
//               onChangeText={setNewPassword}
//               secureTextEntry
//               leftIcon={<Lock size={18} color={COLORS.slate400} />}
//             />
            
//             <Button 
//               title="Update Password" 
//               onPress={handleResetPassword} 
//               loading={loading}
//               style={[styles.submitBtn, { backgroundColor: '#3b82f6' }]}
//             />
            
//             <TouchableOpacity 
//               onPress={() => setStep('request')} 
//               style={styles.resendBtn}
//             >
//               <Text style={styles.resendText}>
//                 Didn't get a code? <Text style={styles.resendAction}>Resend</Text>
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </Animated.View>
//       );
//     }

//     return (
//       <Animated.View style={[styles.successContent, { opacity: opacityAnim }]}>
//         <CheckCircle2 size={80} color={COLORS.primary} strokeWidth={1.5} />
//         <Text style={styles.successTitle}>Password Reset!</Text>
//         <Text style={styles.successSub}>
//           Your password has been updated. You can now log in with your new credentials.
//         </Text>
//         <Button 
//           title="Proceed to Login" 
//           onPress={() => navigation.navigate('SignIn')} 
//           style={styles.backToSignInBtn}
//         />
//       </Animated.View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <SafeAreaView style={styles.headerWrapper}>
//         <View style={styles.compactHeader}>
//           <TouchableOpacity style={styles.backButton} onPress={handleBack}>
//             <ArrowLeft size={22} color="#0f172a" strokeWidth={2.5} />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>
//             {step === 'reset' ? 'Verify Account' : 'Reset Password'}
//           </Text>
//           <View style={{ width: 40 }} />
//         </View>
//       </SafeAreaView>
      
//       <View style={styles.content}>
//         {renderContent()}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   headerWrapper: { backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
//   compactHeader: { height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
//   backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
//   headerTitle: { fontSize: 17, fontWeight: '800', color: '#0f172a' },
//   content: { flex: 1, padding: 30, justifyContent: 'center' },
//   inner: { width: '100%', alignItems: 'center' },
//   iconBox: { width: 70, height: 70, borderRadius: 24, backgroundColor: '#f0fdf4', justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
//   title: { fontSize: 26, fontWeight: '900', color: '#0f172a', marginBottom: 12 },
//   subtitle: { fontSize: 15, color: '#64748b', textAlign: 'center', lineHeight: 22, paddingHorizontal: 10 },
//   form: { width: '100%', marginTop: 20 },
//   submitBtn: { height: 56, borderRadius: 16, marginTop: 10 },
//   successContent: { alignItems: 'center' },
//   successTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a', marginTop: 20 },
//   successSub: { fontSize: 15, color: '#64748b', textAlign: 'center', marginTop: 12, lineHeight: 24, paddingHorizontal: 20 },
//   resendBtn: { marginTop: 20, alignSelf: 'center' },
//   resendText: { fontSize: 14, color: '#64748b' },
//   resendAction: { color: COLORS.primary, fontWeight: '800' },
//   backToSignInBtn: { width: '100%', height: 56, borderRadius: 16, marginTop: 40, backgroundColor: '#0f172a' }
// });





import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  SafeAreaView, Animated, Easing, Alert,
  KeyboardAvoidingView, ScrollView, Platform,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Mail, KeyRound, CheckCircle2, ShieldCheck, Lock } from 'lucide-react-native';
import { COLORS } from '../constants';
import Input from '../components/Input';
import Button from '../components/Button';
import { authApi } from '../api/authApi';

const { width } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('request'); 

  const slideAnim = useRef(new Animated.Value(20)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    opacityAnim.setValue(0);
    slideAnim.setValue(20);
    
    Animated.parallel([
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, easing: Easing.out(Easing.quad), useNativeDriver: true })
    ]).start();
  }, [step]);

  const handleBack = () => {
    if (step === 'reset') setStep('request');
    else navigation.navigate('SignIn');
  };

  const handleRequestCode = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim().toLowerCase());
      setStep('reset');
      Alert.alert('Code Sent! 📧', `A 6-digit reset code has been sent to ${email}.`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Could not send reset code.';
      Alert.alert('Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (token.length < 6) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit code.');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Short Password', 'Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword({ 
        email: email.trim().toLowerCase(), 
        token: token.trim(), 
        newPassword 
      });
      setStep('success');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Invalid code or expired token.';
      Alert.alert('Reset Failed', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (step === 'request') {
      return (
        <Animated.View style={[styles.inner, { opacity: opacityAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.iconBox}>
            <KeyRound size={32} color={COLORS.primary || '#166534'} strokeWidth={2} />
          </View>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>Enter your email to receive a 6-digit reset code.</Text>
          <View style={styles.form}>
            <Input 
              label="EMAIL ADDRESS"
              placeholder="name@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={18} color="#94a3b8" />}
            />
            <Button 
              title="Send Reset Code" 
              onPress={handleRequestCode} 
              loading={loading}
              style={[styles.submitBtn, { backgroundColor: COLORS.primary || '#166534' }]}
            />
          </View>
        </Animated.View>
      );
    }

    if (step === 'reset') {
      return (
        <Animated.View style={[styles.inner, { opacity: opacityAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={[styles.iconBox, { backgroundColor: '#eff6ff' }]}>
            <ShieldCheck size={32} color="#3b82f6" strokeWidth={2} />
          </View>
          <Text style={styles.title}>Verify Code</Text>
          <Text style={styles.subtitle}>Sent to <Text style={{ fontWeight: '700', color: '#0f172a' }}>{email}</Text></Text>
          <View style={styles.form}>
            <Input 
              label="6-DIGIT CODE"
              placeholder="123456"
              value={token}
              onChangeText={setToken}
              keyboardType="number-pad"
              maxLength={6}
              leftIcon={<Lock size={18} color="#94a3b8" />}
            />
            <Input 
              label="NEW PASSWORD"
              placeholder="••••••••"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              leftIcon={<Lock size={18} color="#94a3b8" />}
            />
            <Button 
              title="Update Password" 
              onPress={handleResetPassword} 
              loading={loading}
              style={[styles.submitBtn, { backgroundColor: '#3b82f6' }]}
            />
            <TouchableOpacity onPress={() => setStep('request')} style={styles.resendBtn}>
              <Text style={styles.resendText}>Didn't get a code? <Text style={styles.resendAction}>Resend</Text></Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      );
    }

    return (
      <Animated.View style={[styles.successContent, { opacity: opacityAnim }]}>
        <CheckCircle2 size={80} color={COLORS.primary || '#166534'} strokeWidth={1.5} />
        <Text style={styles.successTitle}>Password Reset!</Text>
        <Text style={styles.successSub}>Your password has been updated. You can now log in.</Text>
        <Button 
          title="Proceed to Login" 
          onPress={() => navigation.navigate('SignIn')} 
          style={[styles.backToSignInBtn, { backgroundColor: '#0f172a' }]}
        />
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerWrapper}>
        <View style={styles.compactHeader}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={22} color="#0f172a" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{step === 'reset' ? 'Verify Account' : 'Reset Password'}</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {renderContent()}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerWrapper: { backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  compactHeader: { height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#0f172a' },
  
  // ═══ RESPONSIVE TOP-ALIGNED CONTENT ═══
  scrollContent: { 
    flexGrow: 1, 
    paddingHorizontal: width > 400 ? 40 : 25, // More padding for larger screens
    paddingTop: 40, // Content starts near the top
    paddingBottom: 40,
    justifyContent: 'flex-start' // Force content to stay at top
  },
  
  inner: { width: '100%', alignItems: 'center' },
  iconBox: { width: 70, height: 70, borderRadius: 24, backgroundColor: '#f0fdf4', justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
  title: { fontSize: 26, fontWeight: '900', color: '#0f172a', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#64748b', textAlign: 'center', lineHeight: 22, paddingHorizontal: 10 },
  form: { width: '100%', marginTop: 20 },
  submitBtn: { height: 56, borderRadius: 16, marginTop: 10 },
  successContent: { alignItems: 'center', padding: 20, paddingTop: 60 },
  successTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a', marginTop: 20 },
  successSub: { fontSize: 15, color: '#64748b', textAlign: 'center', marginTop: 12, lineHeight: 24 },
  resendBtn: { marginTop: 20, alignSelf: 'center', padding: 10 },
  resendText: { fontSize: 14, color: '#64748b' },
  resendAction: { color: '#166534', fontWeight: '800' },
  backToSignInBtn: { width: '100%', height: 56, borderRadius: 16, marginTop: 40 }
});