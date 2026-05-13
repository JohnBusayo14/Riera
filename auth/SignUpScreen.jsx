// import React, { useState, useMemo } from 'react';
// import { 
//   View, Text, StyleSheet, ScrollView, TouchableOpacity, 
//   Alert, KeyboardAvoidingView, Platform, StatusBar, SafeAreaView,
//   ActivityIndicator, LayoutAnimation, Dimensions 
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import * as Location from 'expo-location';
// import { 
//   AlertCircle, Package, MapPin, RefreshCcw, 
//   User, Mail, Phone, Lock, Eye, EyeOff, Truck, ShoppingBag, ArrowRight, Sparkles, CheckCircle2
// } from 'lucide-react-native';
// import { useTheme } from '../context/ThemeContext';
// import { MotiView } from 'moti';
// import { LinearGradient } from 'expo-linear-gradient';
// import Button from '../components/Button';
// import Input from '../components/Input';
// import { authApi } from '../api/authApi';

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

// // Role configuration
// const ROLES = { 
//   BUYER: { 
//     id: 'BUYER', 
//     label: 'Buyer',
//     icon: ShoppingBag,
//     description: 'Purchase products',
//     gradient: [COLORS.forestGreen, COLORS.darkForest]
//   }, 
//   SELLER: { 
//     id: 'SELLER', 
//     label: 'Seller',
//     icon: Package,
//     description: 'Sell your goods',
//     gradient: [COLORS.forestGreen, COLORS.lightForest]
//   }, 
//   DRIVER: { 
//     id: 'DRIVER', 
//     label: 'Driver',
//     icon: Truck,
//     description: 'Deliver orders',
//     gradient: [COLORS.darkForest, COLORS.forestGreen]
//   }
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

// export default function SignUpScreen() {
//   const navigation = useNavigation();
//   const { isDark: IsDark } = useTheme();
  
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState(ROLES.BUYER.id); 
//   const [showPassword, setShowPassword] = useState(false);
  
//   const [address, setAddress] = useState('');
//   const [addressDetails, setAddressDetails] = useState({
//     street: '',
//     town: '',
//     state: '',
//     postalCode: '',
//     latitude: null,
//     longitude: null
//   });
  
//   const [loading, setLoading] = useState(false);
//   const [locationLoading, setLocationLoading] = useState(false);

//   const [nameErrors, setNameErrors] = useState([]);
//   const [passwordErrors, setPasswordErrors] = useState([]);
//   const [emailErrors, setEmailErrors] = useState([]);
//   const [phoneErrors, setPhoneErrors] = useState([]);
//   const [addressErrors, setAddressErrors] = useState([]);

//   const UI_THEME = useMemo(() => ({
//     Background: IsDark ? COLORS.black : COLORS.lightGray,
//     CardBg: IsDark ? COLORS.darkGray : COLORS.white,
//     TextPrimary: IsDark ? COLORS.white : COLORS.black,
//     TextSecondary: IsDark ? '#94A3B8' : COLORS.mediumGray,
//     Border: IsDark ? '#334155' : '#E2E8F0',
//     Primary: COLORS.forestGreen,
//     Error: COLORS.error
//   }), [IsDark]);

//   const requestLocation = async () => {
//     setAddressErrors([]);
//     setLocationLoading(true);
//     try {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         setAddressErrors(["Location permission denied. Please enable in settings."]);
//         return;
//       }

//       let loc = await Location.getCurrentPositionAsync({});
//       let res = await Location.reverseGeocodeAsync(loc.coords);

//       if (res.length > 0) {
//         const addr = res[0];
//         const displayAddr = `${addr.name || addr.streetNumber || ''} ${addr.street || ''}, ${addr.city || addr.subregion || ''}`;
//         setAddress(displayAddr);

//         setAddressDetails({
//           street: `${addr.name || addr.streetNumber || ''} ${addr.street || ''}`.trim(),
//           town: addr.city || addr.subregion || '',
//           state: addr.region || '',
//           postalCode: addr.postalCode || '',
//           latitude: loc.coords.latitude,
//           longitude: loc.coords.longitude
//         });
//       }
//     } catch (e) { 
//       setAddressErrors(["Unable to fetch location. Please try again."]);
//     } finally { 
//       setLocationLoading(false); 
//     }
//   };

//   const clearErrors = () => {
//     setNameErrors([]); 
//     setEmailErrors([]); 
//     setPhoneErrors([]); 
//     setPasswordErrors([]); 
//     setAddressErrors([]);
//   };

//   const handleSubmit = async () => {
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//     clearErrors();
//     let hasFrontErrors = false;

//     // Validation
//     if (!name.trim()) { 
//       setNameErrors(["Full name is required"]); 
//       hasFrontErrors = true; 
//     } else if (name.trim().length < 3) {
//       setNameErrors(["Name must be at least 3 characters"]);
//       hasFrontErrors = true;
//     }

//     if (!email.trim()) { 
//       setEmailErrors(["Email address is required"]); 
//       hasFrontErrors = true; 
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       setEmailErrors(["Please enter a valid email address"]);
//       hasFrontErrors = true;
//     }

//     if (!phone.trim()) { 
//       setPhoneErrors(["Phone number is required"]); 
//       hasFrontErrors = true; 
//     } else if (phone.length < 10) {
//       setPhoneErrors(["Please enter a valid phone number"]);
//       hasFrontErrors = true;
//     }

//     if (!password) { 
//       setPasswordErrors(["Password is required"]); 
//       hasFrontErrors = true; 
//     } else if (password.length < 8) {
//       setPasswordErrors(["Password must be at least 8 characters"]);
//       hasFrontErrors = true;
//     }
    
//     // Location required for Sellers and Drivers
//     if ((role === ROLES.SELLER.id || role === ROLES.DRIVER.id) && !address) { 
//       setAddressErrors([`Location is required for ${ROLES[role].label.toLowerCase()}s`]); 
//       hasFrontErrors = true; 
//     }

//     if (hasFrontErrors) return;

//     setLoading(true);
//     try {
//       await authApi.register({ 
//         Name: name.trim(), 
//         Email: email.trim().toLowerCase(), 
//         Phone: phone.trim(), 
//         Password: password, 
//         Role: role,
//         Location: address,
//         Street: addressDetails.street,
//         Town: addressDetails.town,
//         State: addressDetails.state,
//         PostalCode: addressDetails.postalCode,
//         Latitude: addressDetails.latitude,
//         Longitude: addressDetails.longitude
//       });
      
//       Alert.alert(
//         "Account Created! 🎉", 
//         "Welcome to RieRa! You can now sign in.", 
//         [{ text: "Sign In", onPress: () => navigation.navigate('SignIn') }]
//       );
//     } catch (error) {
//       LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//       const data = error.response?.data;
//       if (data?.errors) {
//         setPasswordErrors(Array.isArray(data.errors) ? data.errors : [data.errors]);
//       } else if (data?.message?.toLowerCase().includes("email")) {
//         setEmailErrors([data.message]);
//       } else {
//         Alert.alert("Registration Failed", data?.message || "Unable to create account. Please try again.");
//       }
//     } finally { 
//       setLoading(false); 
//     }
//   };

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

//   const currentRole = ROLES[role];

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
//               colors={currentRole.gradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.logoGradient}
//             >
//               {React.createElement(currentRole.icon, { 
//                 color: COLORS.white, 
//                 size: 36, 
//                 strokeWidth: 2.5 
//               })}
//             </LinearGradient>
            
//             <View style={styles.headerTextContainer}>
//               <Text style={[styles.title, { color: UI_THEME.TextPrimary }]}>
//                 Join RieRa
//               </Text>
//               <View style={styles.subtitleRow}>
//                 <Sparkles size={16} color={COLORS.forestGreen} />
//                 <Text style={[styles.subtitle, { color: UI_THEME.TextSecondary }]}>
//                   Start your journey with us today
//                 </Text>
//               </View>
//             </View>
//           </MotiView>

//           {/* ROLE SELECTOR */}
//           <MotiView
//             from={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ type: 'timing', duration: 400, delay: 200 }}
//           >
//             <Text style={[styles.sectionTitle, { color: UI_THEME.TextPrimary }]}>
//               Join As:
//             </Text>
//             <View style={styles.roleGrid}>
//               {Object.values(ROLES).map((r, index) => (
//                 <MotiView
//                   key={r.id}
//                   from={{ opacity: 0, translateY: 20 }}
//                   animate={{ opacity: 1, translateY: 0 }}
//                   transition={{ type: 'timing', duration: 300, delay: 300 + (index * 100) }}
//                   style={{ flex: 1 }}
//                 >
//                   <TouchableOpacity 
//                     style={[
//                       styles.roleCard,
//                       { 
//                         backgroundColor: IsDark ? COLORS.darkGray : COLORS.white,
//                         borderColor: role === r.id ? COLORS.forestGreen : (IsDark ? '#334155' : '#E2E8F0'),
//                         borderWidth: role === r.id ? 2.5 : 1.5,
//                       }
//                     ]} 
//                     onPress={() => { 
//                       LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); 
//                       setRole(r.id); 
//                       clearErrors(); 
//                     }}
//                     activeOpacity={0.7}
//                   >
//                     <View style={[
//                       styles.roleIconContainer,
//                       { backgroundColor: role === r.id ? COLORS.forestGreen : (IsDark ? `${COLORS.forestGreen}20` : COLORS.successBg) }
//                     ]}>
//                       {React.createElement(r.icon, { 
//                         color: role === r.id ? COLORS.white : COLORS.forestGreen, 
//                         size: 24,
//                         strokeWidth: 2.5
//                       })}
//                     </View>
//                     <Text style={[
//                       styles.roleLabel, 
//                       { color: role === r.id ? COLORS.forestGreen : UI_THEME.TextPrimary }
//                     ]}>
//                       {r.label}
//                     </Text>
//                     <Text style={[styles.roleDescription, { color: UI_THEME.TextSecondary }]}>
//                       {r.description}
//                     </Text>
//                     {role === r.id && (
//                       <MotiView
//                         from={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         transition={{ type: 'spring', damping: 10 }}
//                         style={styles.roleCheckmark}
//                       >
//                         <CheckCircle2 color={COLORS.forestGreen} size={20} />
//                       </MotiView>
//                     )}
//                   </TouchableOpacity>
//                 </MotiView>
//               ))}
//             </View>
//           </MotiView>

//           {/* FORM SECTION */}
//           <View style={styles.form}>
//             <EnhancedField 
//               label="Full Name" 
//               icon={User} 
//               theme={UI_THEME} 
//               errors={nameErrors} 
//               hasError={nameErrors.length > 0}
//               isDark={IsDark}
//             >
//               <Input 
//                 {...inputProps} 
//                 placeholder="John Doe" 
//                 value={name} 
//                 onChangeText={(text) => {
//                   setName(text);
//                   if (nameErrors.length > 0) setNameErrors([]);
//                 }}
//                 autoComplete="name"
//               />
//             </EnhancedField>

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
//               label="Phone Number" 
//               icon={Phone} 
//               theme={UI_THEME} 
//               errors={phoneErrors} 
//               hasError={phoneErrors.length > 0}
//               isDark={IsDark}
//             >
//               <Input 
//                 {...inputProps} 
//                 placeholder="+27 800 000 0000" 
//                 value={phone} 
//                 onChangeText={(text) => {
//                   setPhone(text.replace(/[^0-9+]/g, ''));
//                   if (phoneErrors.length > 0) setPhoneErrors([]);
//                 }}
//                 keyboardType="phone-pad"
//                 autoComplete="tel"
//               />
//             </EnhancedField>

//             {/* LOCATION FIELD - For Sellers and Drivers */}
//             {(role === ROLES.SELLER.id || role === ROLES.DRIVER.id) && (
//               <EnhancedField 
//                 label={role === ROLES.DRIVER.id ? "Dispatch Base Location" : "Business Location"} 
//                 icon={MapPin} 
//                 theme={UI_THEME} 
//                 errors={addressErrors}
//                 hasError={addressErrors.length > 0}
//                 isDark={IsDark}
//                 rightAction={
//                   <TouchableOpacity 
//                     onPress={requestLocation} 
//                     style={styles.locationButton}
//                     activeOpacity={0.7}
//                     disabled={locationLoading}
//                   >
//                     <View style={[
//                       styles.locationButtonInner,
//                       { backgroundColor: IsDark ? `${COLORS.forestGreen}20` : COLORS.successBg }
//                     ]}>
//                       {locationLoading ? (
//                         <ActivityIndicator size="small" color={COLORS.forestGreen} />
//                       ) : (
//                         <RefreshCcw size={18} color={COLORS.forestGreen} strokeWidth={2.5} />
//                       )}
//                     </View>
//                   </TouchableOpacity>
//                 }
//               >
//                 <TouchableOpacity 
//                   onPress={requestLocation}
//                   disabled={locationLoading}
//                   style={{ flex: 1 }}
//                 >
//                   <Text 
//                     numberOfLines={2} 
//                     style={[
//                       styles.addressDisplay, 
//                       { 
//                         color: address ? UI_THEME.TextPrimary : UI_THEME.TextSecondary,
//                         fontWeight: address ? '600' : '500'
//                       }
//                     ]}
//                   >
//                     {address || (role === ROLES.DRIVER.id 
//                       ? "Tap to set your dispatch base" 
//                       : "Tap to locate your business")}
//                   </Text>
//                 </TouchableOpacity>
//               </EnhancedField>
//             )}

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
//                 placeholder="Create a secure password" 
//                 value={password} 
//                 onChangeText={(text) => {
//                   setPassword(text);
//                   if (passwordErrors.length > 0) setPasswordErrors([]);
//                 }}
//                 secureTextEntry={!showPassword}
//                 autoComplete="password-new"
//               />
//             </EnhancedField>

//             {/* CREATE ACCOUNT BUTTON */}
//             <MotiView
//               from={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ type: 'timing', duration: 400, delay: 200 }}
//             >
//               <TouchableOpacity
//                 onPress={handleSubmit}
//                 disabled={loading}
//                 activeOpacity={0.9}
//                 style={styles.submitButton}
//               >
//                 <LinearGradient
//                   colors={currentRole.gradient}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 0 }}
//                   style={styles.submitGradient}
//                 >
//                   {loading ? (
//                     <ActivityIndicator color={COLORS.white} size="small" />
//                   ) : (
//                     <>
//                       <Text style={styles.submitText}>
//                         {role === ROLES.DRIVER.id ? "Register as Partner" : "Create Account"}
//                       </Text>
//                       <ArrowRight color={COLORS.white} size={22} strokeWidth={3} />
//                     </>
//                   )}
//                 </LinearGradient>
//               </TouchableOpacity>
//             </MotiView>

//             {/* SIGN IN LINK */}
//             <MotiView
//               from={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ type: 'timing', duration: 400, delay: 400 }}
//             >
//               <TouchableOpacity 
//                 onPress={() => navigation.navigate('SignIn')} 
//                 style={[
//                   styles.signInContainer,
//                   { 
//                     backgroundColor: IsDark ? COLORS.darkGray : COLORS.white,
//                     borderColor: UI_THEME.Border
//                   }
//                 ]}
//                 activeOpacity={0.7}
//               >
//                 <Text style={[styles.signInText, { color: UI_THEME.TextSecondary }]}>
//                   Already have an account?{' '}
//                   <Text style={[styles.signInLink, { color: COLORS.forestGreen }]}>
//                     Sign In
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
//               By creating an account, you agree to our{' '}
//               <Text style={{ color: COLORS.forestGreen, fontWeight: '700' }}>
//                 Terms of Service
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
//     paddingTop: 50,
//     paddingBottom: 40,
//   },
  
//   // Header Styles
//   header: { 
//     alignItems: 'center', 
//     marginBottom: 40 
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
  
//   // Role Selector
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '800',
//     marginBottom: 16,
//     letterSpacing: 0.2,
//   },
//   roleGrid: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 32,
//   },
//   roleCard: {
//     padding: 16,
//     borderRadius: 20,
//     alignItems: 'center',
//     position: 'relative',
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   roleIconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 14,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   roleLabel: {
//     fontSize: 14,
//     fontWeight: '800',
//     marginBottom: 4,
//     letterSpacing: 0.3,
//   },
//   roleDescription: {
//     fontSize: 11,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   roleCheckmark: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//   },
  
//   // Form Styles
//   form: { 
//     width: '100%' 
//   },
//   fieldCard: { 
//     borderRadius: 20, 
//     padding: 20,
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
  
//   // Action Buttons
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
//   locationButton: {
//     padding: 4,
//   },
//   locationButtonInner: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
  
//   // Address Display
//   addressDisplay: { 
//     fontSize: 15, 
//     paddingVertical: 10,
//     lineHeight: 22,
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
  
//   // Submit Button
//   submitButton: {
//     borderRadius: 18,
//     overflow: 'hidden',
//     marginTop: 8,
//     shadowColor: COLORS.forestGreen,
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 16,
//     elevation: 8,
//   },
//   submitGradient: {
//     height: 64,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 12,
//   },
//   submitText: {
//     color: COLORS.white,
//     fontSize: 18,
//     fontWeight: '900',
//     letterSpacing: 0.5,
//   },
  
//   // Sign In Link
//   signInContainer: {
//     padding: 20,
//     borderRadius: 18,
//     borderWidth: 2,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   signInText: {
//     fontSize: 15,
//     fontWeight: '600',
//   },
//   signInLink: {
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
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Alert, KeyboardAvoidingView, Platform, StatusBar, SafeAreaView,
  ActivityIndicator, LayoutAnimation, Dimensions, TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { 
  AlertCircle, Package, MapPin, RefreshCcw, 
  User, Mail, Phone, Lock, Eye, EyeOff, Truck, ShoppingBag, ArrowRight, Sparkles, CheckCircle2
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { authApi } from '../api/authApi';

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

// Role configuration
const ROLES = { 
  BUYER: { 
    id: 'BUYER', 
    label: 'Buyer',
    icon: ShoppingBag,
    description: 'Purchase products',
    gradient: [COLORS.forestGreen, COLORS.darkForest]
  }, 
  SELLER: { 
    id: 'SELLER', 
    label: 'Seller',
    icon: Package,
    description: 'Sell your goods',
    gradient: [COLORS.forestGreen, COLORS.lightForest]
  }, 
  DRIVER: { 
    id: 'DRIVER', 
    label: 'Driver',
    icon: Truck,
    description: 'Deliver orders',
    gradient: [COLORS.darkForest, COLORS.forestGreen]
  }
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

export default function SignUpScreen() {
  const navigation = useNavigation();
  const { isDark: IsDark } = useTheme();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(ROLES.BUYER.id); 
  const [showPassword, setShowPassword] = useState(false);
  
  const [address, setAddress] = useState('');
  const [addressDetails, setAddressDetails] = useState({
    street: '',
    town: '',
    state: '',
    postalCode: '',
    latitude: null,
    longitude: null
  });
  
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const [nameErrors, setNameErrors] = useState([]);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [emailErrors, setEmailErrors] = useState([]);
  const [phoneErrors, setPhoneErrors] = useState([]);
  const [addressErrors, setAddressErrors] = useState([]);

  const UI_THEME = useMemo(() => ({
    Background:   IsDark ? COLORS.black     : COLORS.lightGray,
    CardBg:       IsDark ? COLORS.darkGray  : COLORS.white,
    // ✅ The actual TextInput background — dark = dark card, light = light surface
    InputBg:      IsDark ? '#0F172A'        : '#F1F5F9',
    TextPrimary:  IsDark ? COLORS.white     : COLORS.black,
    TextSecondary:IsDark ? '#94A3B8'        : COLORS.mediumGray,
    PlaceholderColor: IsDark ? '#475569'    : '#94A3B8',
    Border:       IsDark ? '#334155'        : '#E2E8F0',
    Primary:      COLORS.forestGreen,
    Error:        COLORS.error,
  }), [IsDark]);

  const requestLocation = async () => {
    setAddressErrors([]);
    setLocationLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setAddressErrors(["Location permission denied. Please enable in settings."]);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      let res = await Location.reverseGeocodeAsync(loc.coords);
      if (res.length > 0) {
        const addr = res[0];
        const displayAddr = `${addr.name || addr.streetNumber || ''} ${addr.street || ''}, ${addr.city || addr.subregion || ''}`;
        setAddress(displayAddr);
        setAddressDetails({
          street: `${addr.name || addr.streetNumber || ''} ${addr.street || ''}`.trim(),
          town: addr.city || addr.subregion || '',
          state: addr.region || '',
          postalCode: addr.postalCode || '',
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude
        });
      }
    } catch (e) { 
      setAddressErrors(["Unable to fetch location. Please try again."]);
    } finally { 
      setLocationLoading(false); 
    }
  };

  const clearErrors = () => {
    setNameErrors([]); 
    setEmailErrors([]); 
    setPhoneErrors([]); 
    setPasswordErrors([]); 
    setAddressErrors([]);
  };

  const handleSubmit = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    clearErrors();
    let hasFrontErrors = false;

    if (!name.trim()) { 
      setNameErrors(["Full name is required"]); 
      hasFrontErrors = true; 
    } else if (name.trim().length < 3) {
      setNameErrors(["Name must be at least 3 characters"]);
      hasFrontErrors = true;
    }
    if (!email.trim()) { 
      setEmailErrors(["Email address is required"]); 
      hasFrontErrors = true; 
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailErrors(["Please enter a valid email address"]);
      hasFrontErrors = true;
    }
    if (!phone.trim()) { 
      setPhoneErrors(["Phone number is required"]); 
      hasFrontErrors = true; 
    } else if (phone.length < 10) {
      setPhoneErrors(["Please enter a valid phone number"]);
      hasFrontErrors = true;
    }
    if (!password) { 
      setPasswordErrors(["Password is required"]); 
      hasFrontErrors = true; 
    } else if (password.length < 8) {
      setPasswordErrors(["Password must be at least 8 characters"]);
      hasFrontErrors = true;
    }
    if ((role === ROLES.SELLER.id || role === ROLES.DRIVER.id) && !address) { 
      setAddressErrors([`Location is required for ${ROLES[role].label.toLowerCase()}s`]); 
      hasFrontErrors = true; 
    }
    if (hasFrontErrors) return;

    setLoading(true);
    try {
      await authApi.register({ 
        Name: name.trim(), 
        Email: email.trim().toLowerCase(), 
        Phone: phone.trim(), 
        Password: password, 
        Role: role,
        Location: address,
        Street: addressDetails.street,
        Town: addressDetails.town,
        State: addressDetails.state,
        PostalCode: addressDetails.postalCode,
        Latitude: addressDetails.latitude,
        Longitude: addressDetails.longitude
      });
      Alert.alert(
        "Account Created! 🎉", 
        "Welcome to RieRa! You can now sign in.", 
        [{ text: "Sign In", onPress: () => navigation.navigate('SignIn') }]
      );
    } catch (error) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const data = error.response?.data;
      if (data?.errors) {
        setPasswordErrors(Array.isArray(data.errors) ? data.errors : [data.errors]);
      } else if (data?.message?.toLowerCase().includes("email")) {
        setEmailErrors([data.message]);
      } else {
        Alert.alert("Registration Failed", data?.message || "Unable to create account. Please try again.");
      }
    } finally { 
      setLoading(false); 
    }
  };

  const currentRole = ROLES[role];

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
              colors={currentRole.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoGradient}
            >
              {React.createElement(currentRole.icon, { 
                color: COLORS.white, size: 36, strokeWidth: 2.5 
              })}
            </LinearGradient>
            <View style={styles.headerTextContainer}>
              <Text style={[styles.title, { color: UI_THEME.TextPrimary }]}>
                Join RieRa
              </Text>
              <View style={styles.subtitleRow}>
                <Sparkles size={16} color={COLORS.forestGreen} />
                <Text style={[styles.subtitle, { color: UI_THEME.TextSecondary }]}>
                  Start your journey with us today
                </Text>
              </View>
            </View>
          </MotiView>

          {/* ROLE SELECTOR */}
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 400, delay: 200 }}
          >
            <Text style={[styles.sectionTitle, { color: UI_THEME.TextPrimary }]}>
              Join As:
            </Text>
            <View style={styles.roleGrid}>
              {Object.values(ROLES).map((r, index) => (
                <MotiView
                  key={r.id}
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'timing', duration: 300, delay: 300 + (index * 100) }}
                  style={{ flex: 1 }}
                >
                  <TouchableOpacity 
                    style={[
                      styles.roleCard,
                      { 
                        backgroundColor: IsDark ? COLORS.darkGray : COLORS.white,
                        borderColor: role === r.id ? COLORS.forestGreen : (IsDark ? '#334155' : '#E2E8F0'),
                        borderWidth: role === r.id ? 2.5 : 1.5,
                      }
                    ]} 
                    onPress={() => { 
                      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); 
                      setRole(r.id); 
                      clearErrors(); 
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.roleIconContainer,
                      { backgroundColor: role === r.id ? COLORS.forestGreen : (IsDark ? `${COLORS.forestGreen}20` : COLORS.successBg) }
                    ]}>
                      {React.createElement(r.icon, { 
                        color: role === r.id ? COLORS.white : COLORS.forestGreen, 
                        size: 24, strokeWidth: 2.5
                      })}
                    </View>
                    <Text style={[
                      styles.roleLabel, 
                      { color: role === r.id ? COLORS.forestGreen : UI_THEME.TextPrimary }
                    ]}>
                      {r.label}
                    </Text>
                    <Text style={[styles.roleDescription, { color: UI_THEME.TextSecondary }]}>
                      {r.description}
                    </Text>
                    {role === r.id && (
                      <MotiView
                        from={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 10 }}
                        style={styles.roleCheckmark}
                      >
                        <CheckCircle2 color={COLORS.forestGreen} size={20} />
                      </MotiView>
                    )}
                  </TouchableOpacity>
                </MotiView>
              ))}
            </View>
          </MotiView>

          {/* FORM */}
          <View style={styles.form}>

            {/* Full Name */}
            <EnhancedField 
              label="Full Name" icon={User} theme={UI_THEME} 
              errors={nameErrors} hasError={nameErrors.length > 0} isDark={IsDark}
            >
              <TextInput
                style={[styles.textInput, { 
                  color: UI_THEME.TextPrimary, 
                  backgroundColor: UI_THEME.InputBg,
                }]}
                placeholder="John Doe"
                placeholderTextColor={UI_THEME.PlaceholderColor}
                value={name}
                onChangeText={(text) => { setName(text); if (nameErrors.length > 0) setNameErrors([]); }}
                autoComplete="name"
              />
            </EnhancedField>

            {/* Email */}
            <EnhancedField 
              label="Email Address" icon={Mail} theme={UI_THEME} 
              errors={emailErrors} hasError={emailErrors.length > 0} isDark={IsDark}
            >
              <TextInput
                style={[styles.textInput, { 
                  color: UI_THEME.TextPrimary, 
                  backgroundColor: UI_THEME.InputBg,
                }]}
                placeholder="your.email@example.com"
                placeholderTextColor={UI_THEME.PlaceholderColor}
                value={email}
                onChangeText={(text) => { setEmail(text); if (emailErrors.length > 0) setEmailErrors([]); }}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </EnhancedField>

            {/* Phone */}
            <EnhancedField 
              label="Phone Number" icon={Phone} theme={UI_THEME} 
              errors={phoneErrors} hasError={phoneErrors.length > 0} isDark={IsDark}
            >
              <TextInput
                style={[styles.textInput, { 
                  color: UI_THEME.TextPrimary, 
                  backgroundColor: UI_THEME.InputBg,
                }]}
                placeholder="+27 800 000 0000"
                placeholderTextColor={UI_THEME.PlaceholderColor}
                value={phone}
                onChangeText={(text) => { 
                  setPhone(text.replace(/[^0-9+]/g, '')); 
                  if (phoneErrors.length > 0) setPhoneErrors([]); 
                }}
                keyboardType="phone-pad"
                autoComplete="tel"
              />
            </EnhancedField>

            {/* Location — Sellers and Drivers only */}
            {(role === ROLES.SELLER.id || role === ROLES.DRIVER.id) && (
              <EnhancedField 
                label={role === ROLES.DRIVER.id ? "Dispatch Base Location" : "Business Location"} 
                icon={MapPin} theme={UI_THEME} 
                errors={addressErrors} hasError={addressErrors.length > 0} isDark={IsDark}
                rightAction={
                  <TouchableOpacity 
                    onPress={requestLocation} style={styles.locationButton}
                    activeOpacity={0.7} disabled={locationLoading}
                  >
                    <View style={[
                      styles.locationButtonInner,
                      { backgroundColor: IsDark ? `${COLORS.forestGreen}20` : COLORS.successBg }
                    ]}>
                      {locationLoading 
                        ? <ActivityIndicator size="small" color={COLORS.forestGreen} />
                        : <RefreshCcw size={18} color={COLORS.forestGreen} strokeWidth={2.5} />
                      }
                    </View>
                  </TouchableOpacity>
                }
              >
                <TouchableOpacity onPress={requestLocation} disabled={locationLoading} style={{ flex: 1 }}>
                  <Text 
                    numberOfLines={2} 
                    style={[
                      styles.addressDisplay, 
                      { 
                        color: address ? UI_THEME.TextPrimary : UI_THEME.PlaceholderColor,
                        fontWeight: address ? '600' : '500'
                      }
                    ]}
                  >
                    {address || (role === ROLES.DRIVER.id 
                      ? "Tap to set your dispatch base" 
                      : "Tap to locate your business")}
                  </Text>
                </TouchableOpacity>
              </EnhancedField>
            )}

            {/* Password */}
            <EnhancedField 
              label="Password" icon={Lock} theme={UI_THEME} 
              errors={passwordErrors} hasError={passwordErrors.length > 0} isDark={IsDark}
              rightAction={
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)} 
                  style={styles.eyeButton} activeOpacity={0.7}
                >
                  <View style={[
                    styles.eyeButtonInner,
                    { backgroundColor: IsDark ? `${COLORS.forestGreen}20` : COLORS.successBg }
                  ]}>
                    {showPassword 
                      ? <EyeOff size={18} color={COLORS.forestGreen} strokeWidth={2.5} />
                      : <Eye size={18} color={COLORS.forestGreen} strokeWidth={2.5} />
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
                placeholder="Create a secure password"
                placeholderTextColor={UI_THEME.PlaceholderColor}
                value={password}
                onChangeText={(text) => { setPassword(text); if (passwordErrors.length > 0) setPasswordErrors([]); }}
                secureTextEntry={!showPassword}
                autoComplete="password-new"
              />
            </EnhancedField>

            {/* CREATE ACCOUNT BUTTON */}
            <MotiView
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 400, delay: 200 }}
            >
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.9}
                style={styles.submitButton}
              >
                <LinearGradient
                  colors={currentRole.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitGradient}
                >
                  {loading ? (
                    <ActivityIndicator color={COLORS.white} size="small" />
                  ) : (
                    <>
                      <Text style={styles.submitText}>
                        {role === ROLES.DRIVER.id ? "Register as Partner" : "Create Account"}
                      </Text>
                      <ArrowRight color={COLORS.white} size={22} strokeWidth={3} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </MotiView>

            {/* SIGN IN LINK */}
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'timing', duration: 400, delay: 400 }}
            >
              <TouchableOpacity 
                onPress={() => navigation.navigate('SignIn')} 
                style={[
                  styles.signInContainer,
                  { 
                    backgroundColor: IsDark ? COLORS.darkGray : COLORS.white,
                    borderColor: UI_THEME.Border
                  }
                ]}
                activeOpacity={0.7}
              >
                <Text style={[styles.signInText, { color: UI_THEME.TextSecondary }]}>
                  Already have an account?{' '}
                  <Text style={[styles.signInLink, { color: COLORS.forestGreen }]}>
                    Sign In
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
              By creating an account, you agree to our{' '}
              <Text style={{ color: COLORS.forestGreen, fontWeight: '700' }}>Terms of Service</Text>
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
    paddingTop: 50,
    paddingBottom: 40,
  },
  
  // Header
  header: { alignItems: 'center', marginBottom: 40 },
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
  
  // Role Selector
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16, letterSpacing: 0.2 },
  roleGrid: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  roleCard: {
    padding: 16, borderRadius: 20, alignItems: 'center', position: 'relative',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  roleIconContainer: {
    width: 48, height: 48, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  roleLabel: { fontSize: 14, fontWeight: '800', marginBottom: 4, letterSpacing: 0.3 },
  roleDescription: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  roleCheckmark: { position: 'absolute', top: 8, right: 8 },
  
  // Form
  form: { width: '100%' },
  fieldCard: { borderRadius: 20, padding: 20 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconCircle: { 
    width: 36, height: 36, borderRadius: 12, 
    justifyContent: 'center', alignItems: 'center', marginRight: 12 
  },
  fieldLabel: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.2 },
  inputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  // ✅ Native TextInput — background is fully controlled by UI_THEME.InputBg
  textInput: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '600',
  },

  // Action Buttons
  eyeButton: { padding: 4 },
  eyeButtonInner: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  locationButton: { padding: 4 },
  locationButtonInner: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  
  // Address
  addressDisplay: { fontSize: 15, paddingVertical: 10, lineHeight: 22 },
  
  // Errors
  errorContainer: { 
    marginTop: 14, paddingTop: 14, paddingHorizontal: 12, paddingBottom: 4,
    borderTopWidth: 1, borderRadius: 12, marginHorizontal: -4,
  },
  errorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  errorText: { fontSize: 12, fontWeight: '600', marginLeft: 8, flex: 1 },
  
  // Submit
  submitButton: {
    borderRadius: 18, overflow: 'hidden', marginTop: 8,
    shadowColor: COLORS.forestGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  submitGradient: {
    height: 64, flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center', gap: 12,
  },
  submitText: { color: COLORS.white, fontSize: 18, fontWeight: '900', letterSpacing: 0.5 },
  
  // Sign In
  signInContainer: {
    padding: 20, borderRadius: 18, borderWidth: 2,
    alignItems: 'center', marginTop: 20,
  },
  signInText: { fontSize: 15, fontWeight: '600' },
  signInLink: { fontWeight: '900', letterSpacing: 0.3 },
  
  // Footer
  footer: { marginTop: 32, paddingHorizontal: 16 },
  footerText: { fontSize: 12, fontWeight: '500', textAlign: 'center', lineHeight: 18 },
});