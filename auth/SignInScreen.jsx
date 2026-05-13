// import React, { useState, useMemo } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   StatusBar,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Platform,
//   LayoutAnimation,
//   Dimensions
// } from 'react-native';
// import { useNavigation, CommonActions } from '@react-navigation/native';
// import { Package, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Sparkles } from 'lucide-react-native';
// import { useTheme } from '../context/ThemeContext';
// import { MotiView } from 'moti';
// import Button from '../components/Button';
// import Input from '../components/Input';
// import { authApi } from '../api/authApi';
// import { useAuth } from '../auth/AuthContext';
// import { LinearGradient } from 'expo-linear-gradient';

// const { width } = Dimensions.get('window');

// // Brand Colors
// const COLORS = {
//   forestGreen: '#106324',
//   darkForest: '#0A4118',
//   lightForest: '#1A7A34',
//   white: '#FFFFFF',
//   black: '#0F172A',
//   darkGray: '#1E293B',
//   lightGray: '#F8FAFC',
//   mediumGray: '#64748B',
//   error: '#EF4444',
//   errorBg: '#FEF2F2',
//   successBg: '#F0FDF4',
// };

// // --- ENHANCED FIELD COMPONENT ---
// const EnhancedField = ({ 
//   label, 
//   icon: Icon, 
//   theme, 
//   errors, 
//   hasError, 
//   children, 
//   rightAction,
//   isDark 
// }) => (
//   <MotiView
//     from={{ opacity: 0, translateY: 20 }}
//     animate={{ opacity: 1, translateY: 0 }}
//     transition={{ type: 'timing', duration: 400 }}
//     style={{ marginBottom: 20 }}
//   >
//     <View style={[
//       styles.fieldCard, 
//       { 
//         backgroundColor: isDark ? COLORS.darkGray : COLORS.white,
//         borderColor: hasError ? COLORS.error : (isDark ? '#334155' : '#E2E8F0'),
//         shadowColor: hasError ? COLORS.error : COLORS.black,
//         shadowOffset: { width: 0, height: hasError ? 4 : 2 },
//         shadowOpacity: hasError ? 0.2 : 0.05,
//         shadowRadius: hasError ? 8 : 4,
//         elevation: hasError ? 4 : 2,
//       }
//     ]}>
//       <View style={styles.cardHeader}>
//         <View style={[
//           styles.iconCircle, 
//           { 
//             backgroundColor: hasError 
//               ? `${COLORS.error}15` 
//               : isDark 
//                 ? `${COLORS.forestGreen}20` 
//                 : COLORS.successBg 
//           }
//         ]}>
//           <Icon size={20} color={hasError ? COLORS.error : COLORS.forestGreen} strokeWidth={2.5} />
//         </View>
//         <Text style={[
//           styles.fieldLabel, 
//           { color: hasError ? COLORS.error : theme.TextSecondary }
//         ]}>
//           {label}
//         </Text>
//       </View>
      
//       <View style={styles.inputRow}>
//         <View style={{ flex: 1 }}>
//           {children}
//         </View>
//         {rightAction && <View style={{ marginLeft: 12 }}>{rightAction}</View>}
//       </View>

//       {errors && errors.length > 0 && (
//         <MotiView
//           from={{ opacity: 0, height: 0 }}
//           animate={{ opacity: 1, height: 'auto' }}
//           transition={{ type: 'timing', duration: 300 }}
//           style={[
//             styles.errorContainer,
//             { 
//               backgroundColor: isDark ? `${COLORS.error}10` : COLORS.errorBg,
//               borderColor: `${COLORS.error}30`
//             }
//           ]}
//         >
//           {errors.map((err, idx) => (
//             <View key={idx} style={styles.errorRow}>
//               <AlertCircle size={14} color={COLORS.error} />
//               <Text style={[styles.errorText, { color: COLORS.error }]}>{err}</Text>
//             </View>
//           ))}
//         </MotiView>
//       )}
//     </View>
//   </MotiView>
// );

// export default function SignInScreen() {
//   const navigation = useNavigation();
//   const { login } = useAuth();
//   const { isDark: IsDark } = useTheme();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Error States
//   const [emailErrors, setEmailErrors] = useState([]);
//   const [passwordErrors, setPasswordErrors] = useState([]);

//   const UI_THEME = useMemo(() => ({
//     Background: IsDark ? COLORS.black : COLORS.lightGray,
//     CardBg: IsDark ? COLORS.darkGray : COLORS.white,
//     TextPrimary: IsDark ? COLORS.white : COLORS.black,
//     TextSecondary: IsDark ? '#94A3B8' : COLORS.mediumGray,
//     Border: IsDark ? '#334155' : '#E2E8F0',
//     Primary: COLORS.forestGreen,
//     Error: COLORS.error
//   }), [IsDark]);

// const handleSignIn = async () => {
//   LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//   setEmailErrors([]);
//   setPasswordErrors([]);
  
//   // 1. Validation Logic (Stays the same)
//   let hasErrors = false;
//   if (!email.trim()) {
//     setEmailErrors(["Email address is required"]);
//     hasErrors = true;
//   } else if (!/\S+@\S+\.\S+/.test(email)) {
//     setEmailErrors(["Please enter a valid email address"]);
//     hasErrors = true;
//   }
  
//   if (!password) {
//     setPasswordErrors(["Password is required"]);
//     hasErrors = true;
//   } else if (password.length < 6) {
//     setPasswordErrors(["Password must be at least 6 characters"]);
//     hasErrors = true;
//   }

//   if (hasErrors) return;

//   setLoading(true);
//   try {
//     const response = await authApi.login({
//       Email: email.trim().toLowerCase(),
//       Password: password,
//     });

//     const userData = response.User || response.user;
//     const token = response.Token || response.token;

//     if (!userData || !token) throw new Error("Invalid server response.");

//     // 2. State-Based Navigation
//     // Once this runs, AppNavigator.jsx detects the user and 
//     // automatically mounts the correct Stack (Driver or Seller).
//     // NO manual navigation.dispatch is needed here!
//     await login(userData, token);

//   } catch (error) {
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//     const message = error.response?.data?.Message || 
//                     error.response?.data?.message || 
//                     "Invalid email or password.";
    
//     if (message.toLowerCase().includes("email") || message.toLowerCase().includes("user")) {
//       setEmailErrors([message]);
//     } else {
//       setPasswordErrors([message]);
//     }
//   } finally {
//     // We only set loading false if we aren't unmounting
//     setLoading(false);
//   }
// };

//   const inputProps = {
//     containerStyle: { backgroundColor: 'transparent', paddingHorizontal: 0 },
//     inputContainerStyle: { borderBottomWidth: 0, height: 44, backgroundColor: 'transparent' },
//     inputStyle: { 
//       color: UI_THEME.TextPrimary, 
//       fontSize: 16, 
//       fontWeight: '600', 
//       marginLeft: 0 
//     },
//     placeholderTextColor: IsDark ? '#475569' : '#94A3B8',
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: UI_THEME.Background }}>
//       <StatusBar barStyle={IsDark ? 'light-content' : 'dark-content'} />
//       <KeyboardAvoidingView 
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
//         style={{ flex: 1 }}
//       >
//         <ScrollView 
//           contentContainerStyle={styles.scrollContent} 
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//         >
          
//           {/* HEADER SECTION */}
//           <MotiView
//             from={{ opacity: 0, translateY: -30 }}
//             animate={{ opacity: 1, translateY: 0 }}
//             transition={{ type: 'timing', duration: 600 }}
//             style={styles.header}
//           >
//             <LinearGradient
//               colors={[COLORS.forestGreen, COLORS.darkForest]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.logoGradient}
//             >
//               <Package color={COLORS.white} size={36} strokeWidth={2.5} />
//             </LinearGradient>
            
//             <View style={styles.headerTextContainer}>
//               <Text style={[styles.title, { color: UI_THEME.TextPrimary }]}>
//                 Welcome Back
//               </Text>
//               <View style={styles.subtitleRow}>
//                 <Sparkles size={16} color={COLORS.forestGreen} />
//                 <Text style={[styles.subtitle, { color: UI_THEME.TextSecondary }]}>
//                   Sign in to access your account
//                 </Text>
//               </View>
//             </View>
//           </MotiView>

//           {/* FORM SECTION */}
//           <View style={styles.form}>
//             <EnhancedField 
//               label="Email Address" 
//               icon={Mail} 
//               theme={UI_THEME} 
//               errors={emailErrors} 
//               hasError={emailErrors.length > 0}
//               isDark={IsDark}
//             >
//               <Input 
//                 {...inputProps} 
//                 placeholder="your.email@example.com" 
//                 value={email} 
//                 onChangeText={(text) => {
//                   setEmail(text);
//                   if (emailErrors.length > 0) setEmailErrors([]);
//                 }} 
//                 autoCapitalize="none" 
//                 keyboardType="email-address"
//                 autoComplete="email"
//               />
//             </EnhancedField>

//             <EnhancedField 
//               label="Password" 
//               icon={Lock} 
//               theme={UI_THEME} 
//               errors={passwordErrors} 
//               hasError={passwordErrors.length > 0}
//               isDark={IsDark}
//               rightAction={
//                 <TouchableOpacity 
//                   onPress={() => setShowPassword(!showPassword)} 
//                   style={styles.eyeButton}
//                   activeOpacity={0.7}
//                 >
//                   <View style={[
//                     styles.eyeButtonInner,
//                     { backgroundColor: IsDark ? `${COLORS.forestGreen}20` : COLORS.successBg }
//                   ]}>
//                     {showPassword ? (
//                       <EyeOff size={18} color={COLORS.forestGreen} strokeWidth={2.5} />
//                     ) : (
//                       <Eye size={18} color={COLORS.forestGreen} strokeWidth={2.5} />
//                     )}
//                   </View>
//                 </TouchableOpacity>
//               }
//             >
//               <Input 
//                 {...inputProps} 
//                 placeholder="Enter your password" 
//                 value={password} 
//                 onChangeText={(text) => {
//                   setPassword(text);
//                   if (passwordErrors.length > 0) setPasswordErrors([]);
//                 }} 
//                 secureTextEntry={!showPassword}
//                 autoComplete="password"
//               />
//             </EnhancedField>
            
//             <TouchableOpacity 
//               onPress={() => navigation.navigate('ForgotPassword')} 
//               style={styles.forgotPasswordContainer}
//               activeOpacity={0.7}
//             >
//               <Text style={[styles.forgotText, { color: COLORS.forestGreen }]}>
//                 Forgot Password?
//               </Text>
//             </TouchableOpacity>

//             {/* SIGN IN BUTTON */}
//             <MotiView
//               from={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ type: 'timing', duration: 400, delay: 200 }}
//             >
//               <TouchableOpacity
//                 onPress={handleSignIn}
//                 disabled={loading}
//                 activeOpacity={0.9}
//                 style={styles.signInButton}
//               >
//                 <LinearGradient
//                   colors={[COLORS.forestGreen, COLORS.darkForest]}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 0 }}
//                   style={styles.signInGradient}
//                 >
//                   {loading ? (
//                     <Text style={styles.signInText}>Signing In...</Text>
//                   ) : (
//                     <>
//                       <Text style={styles.signInText}>Sign In</Text>
//                       <ArrowRight color={COLORS.white} size={22} strokeWidth={3} />
//                     </>
//                   )}
//                 </LinearGradient>
//               </TouchableOpacity>
//             </MotiView>

//             {/* DIVIDER */}
//             <View style={styles.dividerContainer}>
//               <View style={[styles.divider, { backgroundColor: UI_THEME.Border }]} />
//               <Text style={[styles.dividerText, { color: UI_THEME.TextSecondary }]}>
//                 OR
//               </Text>
//               <View style={[styles.divider, { backgroundColor: UI_THEME.Border }]} />
//             </View>

//             {/* SIGN UP LINK */}
//             <MotiView
//               from={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ type: 'timing', duration: 400, delay: 400 }}
//             >
//               <TouchableOpacity 
//                 onPress={() => navigation.navigate('SignUp')} 
//                 style={[
//                   styles.signUpContainer,
//                   { 
//                     backgroundColor: IsDark ? COLORS.darkGray : COLORS.white,
//                     borderColor: UI_THEME.Border
//                   }
//                 ]}
//                 activeOpacity={0.7}
//               >
//                 <Text style={[styles.signUpText, { color: UI_THEME.TextSecondary }]}>
//                   Don't have an account?{' '}
//                   <Text style={[styles.signUpLink, { color: COLORS.forestGreen }]}>
//                     Sign Up
//                   </Text>
//                 </Text>
//               </TouchableOpacity>
//             </MotiView>
//           </View>

//           {/* FOOTER */}
//           <MotiView
//             from={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ type: 'timing', duration: 600, delay: 600 }}
//             style={styles.footer}
//           >
//             <Text style={[styles.footerText, { color: UI_THEME.TextSecondary }]}>
//               By signing in, you agree to our{' '}
//               <Text style={{ color: COLORS.forestGreen, fontWeight: '700' }}>
//                 Terms
//               </Text>
//               {' '}and{' '}
//               <Text style={{ color: COLORS.forestGreen, fontWeight: '700' }}>
//                 Privacy Policy
//               </Text>
//             </Text>
//           </MotiView>

//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContent: { 
//     paddingHorizontal: 24, 
//     paddingTop: 60,
//     paddingBottom: 40,
//     flexGrow: 1, 
//     justifyContent: 'center',
//     minHeight: '100%'
//   },
  
//   // Header Styles
//   header: { 
//     alignItems: 'center', 
//     marginBottom: 48 
//   },
//   logoGradient: {
//     width: 80,
//     height: 80,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//     shadowColor: COLORS.forestGreen,
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 16,
//     elevation: 8,
//   },
//   headerTextContainer: {
//     alignItems: 'center',
//   },
//   title: { 
//     fontSize: 32, 
//     fontWeight: '900', 
//     letterSpacing: -0.5,
//     marginBottom: 8
//   },
//   subtitleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   subtitle: { 
//     fontSize: 15, 
//     fontWeight: '600',
//     textAlign: 'center',
//   },
  
//   // Form Styles
//   form: { 
//     width: '100%' 
//   },
//   fieldCard: { 
//     borderRadius: 20, 
//     padding: 20,
//     borderWidth: 2,
//   },
//   cardHeader: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     marginBottom: 12 
//   },
//   iconCircle: { 
//     width: 36, 
//     height: 36, 
//     borderRadius: 12, 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     marginRight: 12 
//   },
//   fieldLabel: { 
//     fontSize: 12, 
//     fontWeight: '800', 
//     textTransform: 'uppercase', 
//     letterSpacing: 1.2 
//   },
//   inputRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'space-between' 
//   },
//   eyeButton: {
//     padding: 4,
//   },
//   eyeButtonInner: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
  
//   // Error Styles
//   errorContainer: { 
//     marginTop: 14, 
//     paddingTop: 14,
//     paddingHorizontal: 12,
//     paddingBottom: 4,
//     borderTopWidth: 1,
//     borderRadius: 12,
//     marginHorizontal: -4,
//   },
//   errorRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     marginBottom: 6 
//   },
//   errorText: { 
//     fontSize: 12, 
//     fontWeight: '600', 
//     marginLeft: 8,
//     flex: 1
//   },
  
//   // Forgot Password
//   forgotPasswordContainer: { 
//     alignSelf: 'flex-end', 
//     marginBottom: 28,
//     paddingVertical: 4
//   },
//   forgotText: { 
//     fontWeight: '800', 
//     fontSize: 14,
//     letterSpacing: 0.2
//   },
  
//   // Sign In Button
//   signInButton: {
//     borderRadius: 18,
//     overflow: 'hidden',
//     shadowColor: COLORS.forestGreen,
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 16,
//     elevation: 8,
//   },
//   signInGradient: {
//     height: 64,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 12,
//   },
//   signInText: {
//     color: COLORS.white,
//     fontSize: 18,
//     fontWeight: '900',
//     letterSpacing: 0.5,
//   },
  
//   // Divider
//   dividerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 32,
//   },
//   divider: {
//     flex: 1,
//     height: 1,
//   },
//   dividerText: {
//     fontSize: 12,
//     fontWeight: '700',
//     paddingHorizontal: 16,
//     letterSpacing: 1,
//   },
  
//   // Sign Up Link
//   signUpContainer: {
//     padding: 20,
//     borderRadius: 18,
//     borderWidth: 2,
//     alignItems: 'center',
//   },
//   signUpText: {
//     fontSize: 15,
//     fontWeight: '600',
//   },
//   signUpLink: {
//     fontWeight: '900',
//     letterSpacing: 0.3,
//   },
  
//   // Footer
//   footer: {
//     marginTop: 32,
//     paddingHorizontal: 16,
//   },
//   footerText: {
//     fontSize: 12,
//     fontWeight: '500',
//     textAlign: 'center',
//     lineHeight: 18,
//   },
// });





import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
  Dimensions,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Package, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Sparkles } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { MotiView } from 'moti';
import { authApi } from '../api/authApi';
import { useAuth } from '../auth/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Brand Colors
const COLORS = {
  forestGreen: '#106324',
  darkForest: '#0A4118',
  lightForest: '#1A7A34',
  white: '#FFFFFF',
  black: '#0F172A',
  darkGray: '#1E293B',
  lightGray: '#F8FAFC',
  mediumGray: '#64748B',
  error: '#EF4444',
  errorBg: '#FEF2F2',
  successBg: '#F0FDF4',
};

// --- ENHANCED FIELD COMPONENT ---
const EnhancedField = ({ 
  label, 
  icon: Icon, 
  theme, 
  errors, 
  hasError, 
  children, 
  rightAction,
  isDark 
}) => (
  <MotiView
    from={{ opacity: 0, translateY: 20 }}
    animate={{ opacity: 1, translateY: 0 }}
    transition={{ type: 'timing', duration: 400 }}
    style={{ marginBottom: 20 }}
  >
    <View style={[
      styles.fieldCard, 
      { 
        backgroundColor: isDark ? COLORS.darkGray : COLORS.white,
        borderColor: hasError ? COLORS.error : (isDark ? '#334155' : '#E2E8F0'),
        shadowColor: hasError ? COLORS.error : COLORS.black,
        shadowOffset: { width: 0, height: hasError ? 4 : 2 },
        shadowOpacity: hasError ? 0.2 : 0.05,
        shadowRadius: hasError ? 8 : 4,
        elevation: hasError ? 4 : 2,
      }
    ]}>
      <View style={styles.cardHeader}>
        <View style={[
          styles.iconCircle, 
          { 
            backgroundColor: hasError 
              ? `${COLORS.error}15` 
              : isDark 
                ? `${COLORS.forestGreen}20` 
                : COLORS.successBg 
          }
        ]}>
          <Icon size={20} color={hasError ? COLORS.error : COLORS.forestGreen} strokeWidth={2.5} />
        </View>
        <Text style={[
          styles.fieldLabel, 
          { color: hasError ? COLORS.error : theme.TextSecondary }
        ]}>
          {label}
        </Text>
      </View>
      
      <View style={styles.inputRow}>
        <View style={{ flex: 1 }}>
          {children}
        </View>
        {rightAction && <View style={{ marginLeft: 12 }}>{rightAction}</View>}
      </View>

      {errors && errors.length > 0 && (
        <MotiView
          from={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ type: 'timing', duration: 300 }}
          style={[
            styles.errorContainer,
            { 
              backgroundColor: isDark ? `${COLORS.error}10` : COLORS.errorBg,
              borderColor: `${COLORS.error}30`
            }
          ]}
        >
          {errors.map((err, idx) => (
            <View key={idx} style={styles.errorRow}>
              <AlertCircle size={14} color={COLORS.error} />
              <Text style={[styles.errorText, { color: COLORS.error }]}>{err}</Text>
            </View>
          ))}
        </MotiView>
      )}
    </View>
  </MotiView>
);

export default function SignInScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const { isDark: IsDark } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [emailErrors, setEmailErrors] = useState([]);
  const [passwordErrors, setPasswordErrors] = useState([]);

  const UI_THEME = useMemo(() => ({
    Background:      IsDark ? COLORS.black    : COLORS.lightGray,
    CardBg:          IsDark ? COLORS.darkGray : COLORS.white,
    // ✅ Native TextInput background — fully controlled
    InputBg:         IsDark ? '#0F172A'       : '#F1F5F9',
    TextPrimary:     IsDark ? COLORS.white    : COLORS.black,
    TextSecondary:   IsDark ? '#94A3B8'       : COLORS.mediumGray,
    PlaceholderColor:IsDark ? '#475569'       : '#94A3B8',
    Border:          IsDark ? '#334155'       : '#E2E8F0',
    Primary:         COLORS.forestGreen,
    Error:           COLORS.error,
  }), [IsDark]);

  const handleSignIn = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setEmailErrors([]);
    setPasswordErrors([]);

    let hasErrors = false;
    if (!email.trim()) {
      setEmailErrors(["Email address is required"]);
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailErrors(["Please enter a valid email address"]);
      hasErrors = true;
    }
    if (!password) {
      setPasswordErrors(["Password is required"]);
      hasErrors = true;
    } else if (password.length < 6) {
      setPasswordErrors(["Password must be at least 6 characters"]);
      hasErrors = true;
    }
    if (hasErrors) return;

    setLoading(true);
    try {
      const response = await authApi.login({
        Email: email.trim().toLowerCase(),
        Password: password,
      });

      const userData = response.User || response.user;
      const token    = response.Token || response.token;
      if (!userData || !token) throw new Error("Invalid server response.");

      await login(userData, token);
    } catch (error) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const message = error.response?.data?.Message ||
                      error.response?.data?.message ||
                      "Invalid email or password.";
      if (message.toLowerCase().includes("email") || message.toLowerCase().includes("user")) {
        setEmailErrors([message]);
      } else {
        setPasswordErrors([message]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: UI_THEME.Background }}>
      <StatusBar barStyle={IsDark ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* HEADER */}
          <MotiView
            from={{ opacity: 0, translateY: -30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600 }}
            style={styles.header}
          >
            <LinearGradient
              colors={[COLORS.forestGreen, COLORS.darkForest]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoGradient}
            >
              <Package color={COLORS.white} size={36} strokeWidth={2.5} />
            </LinearGradient>

            <View style={styles.headerTextContainer}>
              <Text style={[styles.title, { color: UI_THEME.TextPrimary }]}>
                Welcome Back
              </Text>
              <View style={styles.subtitleRow}>
                <Sparkles size={16} color={COLORS.forestGreen} />
                <Text style={[styles.subtitle, { color: UI_THEME.TextSecondary }]}>
                  Sign in to access your account
                </Text>
              </View>
            </View>
          </MotiView>

          {/* FORM */}
          <View style={styles.form}>

            {/* Email */}
            <EnhancedField
              label="Email Address"
              icon={Mail}
              theme={UI_THEME}
              errors={emailErrors}
              hasError={emailErrors.length > 0}
              isDark={IsDark}
            >
              <TextInput
                style={[styles.textInput, {
                  color: UI_THEME.TextPrimary,
                  backgroundColor: UI_THEME.InputBg,
                }]}
                placeholder="your.email@example.com"
                placeholderTextColor={UI_THEME.PlaceholderColor}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailErrors.length > 0) setEmailErrors([]);
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </EnhancedField>

            {/* Password */}
            <EnhancedField
              label="Password"
              icon={Lock}
              theme={UI_THEME}
              errors={passwordErrors}
              hasError={passwordErrors.length > 0}
              isDark={IsDark}
              rightAction={
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.eyeButtonInner,
                    { backgroundColor: IsDark ? `${COLORS.forestGreen}20` : COLORS.successBg }
                  ]}>
                    {showPassword
                      ? <EyeOff size={18} color={COLORS.forestGreen} strokeWidth={2.5} />
                      : <Eye    size={18} color={COLORS.forestGreen} strokeWidth={2.5} />
                    }
                  </View>
                </TouchableOpacity>
              }
            >
              <TextInput
                style={[styles.textInput, {
                  color: UI_THEME.TextPrimary,
                  backgroundColor: UI_THEME.InputBg,
                }]}
                placeholder="Enter your password"
                placeholderTextColor={UI_THEME.PlaceholderColor}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordErrors.length > 0) setPasswordErrors([]);
                }}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
            </EnhancedField>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotPasswordContainer}
              activeOpacity={0.7}
            >
              <Text style={[styles.forgotText, { color: COLORS.forestGreen }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <MotiView
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 400, delay: 200 }}
            >
              <TouchableOpacity
                onPress={handleSignIn}
                disabled={loading}
                activeOpacity={0.9}
                style={styles.signInButton}
              >
                <LinearGradient
                  colors={[COLORS.forestGreen, COLORS.darkForest]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.signInGradient}
                >
                  {loading ? (
                    <Text style={styles.signInText}>Signing In...</Text>
                  ) : (
                    <>
                      <Text style={styles.signInText}>Sign In</Text>
                      <ArrowRight color={COLORS.white} size={22} strokeWidth={3} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </MotiView>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.divider, { backgroundColor: UI_THEME.Border }]} />
              <Text style={[styles.dividerText, { color: UI_THEME.TextSecondary }]}>OR</Text>
              <View style={[styles.divider, { backgroundColor: UI_THEME.Border }]} />
            </View>

            {/* Sign Up Link */}
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'timing', duration: 400, delay: 400 }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate('SignUp')}
                style={[
                  styles.signUpContainer,
                  {
                    backgroundColor: IsDark ? COLORS.darkGray : COLORS.white,
                    borderColor: UI_THEME.Border,
                  }
                ]}
                activeOpacity={0.7}
              >
                <Text style={[styles.signUpText, { color: UI_THEME.TextSecondary }]}>
                  Don't have an account?{' '}
                  <Text style={[styles.signUpLink, { color: COLORS.forestGreen }]}>
                    Sign Up
                  </Text>
                </Text>
              </TouchableOpacity>
            </MotiView>
          </View>

          {/* FOOTER */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 600, delay: 600 }}
            style={styles.footer}
          >
            <Text style={[styles.footerText, { color: UI_THEME.TextSecondary }]}>
              By signing in, you agree to our{' '}
              <Text style={{ color: COLORS.forestGreen, fontWeight: '700' }}>Terms</Text>
              {' '}and{' '}
              <Text style={{ color: COLORS.forestGreen, fontWeight: '700' }}>Privacy Policy</Text>
            </Text>
          </MotiView>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: '100%',
  },

  // Header
  header: { alignItems: 'center', marginBottom: 48 },
  logoGradient: {
    width: 80, height: 80, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
    shadowColor: COLORS.forestGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  headerTextContainer: { alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '900', letterSpacing: -0.5, marginBottom: 8 },
  subtitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  subtitle: { fontSize: 15, fontWeight: '600', textAlign: 'center' },

  // Form
  form: { width: '100%' },
  fieldCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconCircle: {
    width: 36, height: 36, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  fieldLabel: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.2 },
  inputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  // ✅ Native TextInput — background fully controlled by UI_THEME.InputBg
  textInput: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '600',
  },

  // Eye toggle
  eyeButton: { padding: 4 },
  eyeButtonInner: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },

  // Errors
  errorContainer: {
    marginTop: 14, paddingTop: 14, paddingHorizontal: 12,
    paddingBottom: 4, borderTopWidth: 1, borderRadius: 12, marginHorizontal: -4,
  },
  errorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  errorText: { fontSize: 12, fontWeight: '600', marginLeft: 8, flex: 1 },

  // Forgot password
  forgotPasswordContainer: { alignSelf: 'flex-end', marginBottom: 28, paddingVertical: 4 },
  forgotText: { fontWeight: '800', fontSize: 14, letterSpacing: 0.2 },

  // Sign In button
  signInButton: {
    borderRadius: 18, overflow: 'hidden',
    shadowColor: COLORS.forestGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  signInGradient: {
    height: 64, flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center', gap: 12,
  },
  signInText: { color: COLORS.white, fontSize: 18, fontWeight: '900', letterSpacing: 0.5 },

  // Divider
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 32 },
  divider: { flex: 1, height: 1 },
  dividerText: { fontSize: 12, fontWeight: '700', paddingHorizontal: 16, letterSpacing: 1 },

  // Sign Up link
  signUpContainer: {
    padding: 20, borderRadius: 18, borderWidth: 2, alignItems: 'center',
  },
  signUpText: { fontSize: 15, fontWeight: '600' },
  signUpLink: { fontWeight: '900', letterSpacing: 0.3 },

  // Footer
  footer: { marginTop: 32, paddingHorizontal: 16 },
  footerText: { fontSize: 12, fontWeight: '500', textAlign: 'center', lineHeight: 18 },
});