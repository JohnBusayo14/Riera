// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   View, Text, StyleSheet, ScrollView, TouchableOpacity,
//   StatusBar, RefreshControl, Alert, ActivityIndicator,
//   Dimensions, Platform, Animated, Image as ProfileImage,
// } from 'react-native';
// import { MotiView, AnimatePresence } from 'moti';
// import { LinearGradient } from 'expo-linear-gradient';
// import {
//   Package, Power, Menu, Bell, ShieldAlert, ShieldCheck,
//   MapPin, ChevronRight, Navigation, Lock, Zap,
//   Wallet, TrendingUp, CircleEllipsis, LayoutGrid,
//   Star, Award, DollarSign, Clock, CheckCircle2, FileCheck,
// } from 'lucide-react-native';
// import { useAuth } from '../auth/AuthContext';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import apiClient from '../services/apiClient';

// import MyOfferCard from './MyOfferCard';

// const { width } = Dimensions.get('window');

// // ─── Poll intervals ────────────────────────────────────────────────────────────
// // When online, poll every 8s so new offers appear quickly.
// // When offline, poll every 15s (lighter — just checking for verification/status changes).
// const POLL_MS_ONLINE  = 8000;
// const POLL_MS_OFFLINE = 15000;

// // 🎨 FOREST GREEN COLOR PALETTE — unchanged from original
// const COLORS = {
//   forestGreen:      '#228B22',
//   forestGreenDark:  '#1a6b1a',
//   forestGreenLight: '#2ea52e',
//   white:            '#FFFFFF',
//   black:            '#0A0E27',
//   grayLight:        '#F5F7FA',
//   grayMedium:       '#8E9AAF',
//   success:          '#10B981',
//   warning:          '#F59E0B',
//   error:            '#EF4444',
//   info:             '#3B82F6',
// };

// // ─── VERIFICATION OVERLAY — identical to original ──────────────────────────────
// const VerificationLock = ({ navigation, status, hasSubmitted }) => {
//   const isPending       = status === 'Pending' || hasSubmitted;
//   const isRejected      = status === 'Rejected';
//   const needsSubmission = !isPending && !isRejected;

//   const getIcon = () => {
//     if (isPending) return <FileCheck color={COLORS.info} size={48} />;
//     if (isRejected) return <ShieldAlert color={COLORS.error} size={48} />;
//     return <ShieldAlert color={COLORS.warning} size={48} />;
//   };
//   const getTitle = () => {
//     if (isPending) return 'Verification In Progress';
//     if (isRejected) return 'Verification Required';
//     return 'Account Verification Required';
//   };
//   const getMessage = () => {
//     if (isPending) return "🔍 Our team is carefully reviewing your documents. This usually takes 24-48 hours. You'll receive a notification once your account is approved.";
//     if (isRejected) return "⚠️ Your previous verification was not approved. Please review your documents and submit again with the correct information.";
//     return "✨ Complete your profile verification to unlock the dashboard and start your earning journey.";
//   };
//   const getIconColor = () => {
//     if (isPending) return COLORS.info;
//     if (isRejected) return COLORS.error;
//     return COLORS.warning;
//   };

//   return (
//     <MotiView
//       from={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       transition={{ type: 'spring', damping: 15 }}
//       style={styles.lockOverlay}
//     >
//       <View style={styles.lockCard}>
//         <MotiView
//           from={{ scale: 0.8 }}
//           animate={{ scale: 1 }}
//           transition={{ type: isPending ? 'timing' : 'spring', duration: isPending ? 1000 : 800, loop: isPending }}
//           style={[styles.lockIconCircle, { backgroundColor: getIconColor() + '15' }]}
//         >
//           {getIcon()}
//         </MotiView>

//         <Text style={styles.lockTitle}>{getTitle()}</Text>
//         <Text style={styles.lockSubtitle}>{getMessage()}</Text>

//         {isPending && (
//           <View style={styles.statusContainer}>
//             <View style={[styles.statusIndicatorBox, { backgroundColor: COLORS.info + '20' }]}>
//               <View style={styles.statusDot}>
//                 <MotiView
//                   from={{ scale: 0.8, opacity: 0.5 }}
//                   animate={{ scale: 1.2, opacity: 1 }}
//                   transition={{ loop: true, duration: 1500 }}
//                   style={[styles.pulseRing, { backgroundColor: COLORS.info }]}
//                 />
//               </View>
//               <View style={{ flex: 1 }}>
//                 <Text style={[styles.statusTitle, { color: COLORS.info }]}>Under Review</Text>
//                 <Text style={styles.statusSubtext}>We're verifying your documents</Text>
//               </View>
//             </View>
//             <View style={styles.timelineContainer}>
//               <View style={styles.timelineItem}>
//                 <CheckCircle2 size={20} color={COLORS.success} fill={COLORS.success} />
//                 <Text style={styles.timelineText}>Documents Submitted</Text>
//               </View>
//               <View style={styles.timelineLine} />
//               <View style={styles.timelineItem}>
//                 <View style={[styles.timelineCircle, { backgroundColor: COLORS.info }]}>
//                   <ActivityIndicator size="small" color={COLORS.white} />
//                 </View>
//                 <Text style={styles.timelineText}>Admin Review</Text>
//               </View>
//               <View style={[styles.timelineLine, { opacity: 0.3 }]} />
//               <View style={styles.timelineItem}>
//                 <View style={[styles.timelineCircle, { backgroundColor: COLORS.grayMedium }]} />
//                 <Text style={[styles.timelineText, { opacity: 0.5 }]}>Account Activation</Text>
//               </View>
//             </View>
//           </View>
//         )}

//         {!isPending && (
//           <TouchableOpacity
//             style={styles.verifyBtn}
//             onPress={() => navigation.navigate('Driververification')}
//             activeOpacity={0.8}
//           >
//             <LinearGradient
//               colors={isRejected ? [COLORS.error, '#DC2626'] : [COLORS.forestGreen, COLORS.forestGreenLight]}
//               start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
//               style={styles.verifyBtnGradient}
//             >
//               <Text style={styles.verifyBtnText}>{isRejected ? 'Resubmit Documents' : 'Get Verified Now'}</Text>
//               <ChevronRight color={COLORS.white} size={22} />
//             </LinearGradient>
//           </TouchableOpacity>
//         )}

//         {isPending && (
//           <View style={styles.waitingFooter}>
//             <Clock size={16} color={COLORS.grayMedium} />
//             <Text style={styles.waitingText}>Expected response time: 24-48 hours</Text>
//           </View>
//         )}
//       </View>
//     </MotiView>
//   );
// };

// // ─── ACTIVE JOB CARD — identical to original ──────────────────────────────────
// const ActiveJobCard = ({ order, navigation }) => {
//   if (!order) return null;
//   return (
//     <MotiView
//       from={{ opacity: 0, translateY: 30 }}
//       animate={{ opacity: 1, translateY: 0 }}
//       transition={{ type: 'spring', damping: 20 }}
//       style={styles.activeCardWrapper}
//     >
//       <LinearGradient
//         colors={[COLORS.forestGreen, COLORS.forestGreenDark]}
//         start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
//         style={styles.activeCardGradient}
//       >
//         <TouchableOpacity
//           onPress={() => navigation.navigate('DriverOrderDetails', {
//             orderId: order?.orderId || order?.id,
//             offerId: order?.offerId || order?.id,
//           })}
//           activeOpacity={0.9}
//         >
//           <View style={styles.activeCardHeader}>
//             <View style={styles.activeBadge}>
//               <MotiView
//                 from={{ scale: 0.8, opacity: 0.5 }}
//                 animate={{ scale: 1.2, opacity: 1 }}
//                 transition={{ loop: true, duration: 1000, type: 'timing' }}
//                 style={styles.pulseDot}
//               />
//               <Text style={styles.activeBadgeText}>● LIVE DELIVERY</Text>
//             </View>
//             <View style={styles.priceContainer}>
//               <Text style={styles.activePriceCurrency}>R</Text>
//               <Text style={styles.activePrice}>{order?.price || '0.00'}</Text>
//             </View>
//           </View>

//           <Text style={styles.activeTitle} numberOfLines={2}>
//             {order?.orderTitle || 'Current Shipment'}
//           </Text>

//           <View style={styles.activeLocRow}>
//             <View style={styles.locIconContainer}>
//               <Navigation size={16} color={COLORS.forestGreen} />
//             </View>
//             <Text style={styles.activeLocText} numberOfLines={1}>
//               {order?.deliveryAddress || 'Address N/A'}
//             </Text>
//           </View>

//           <View style={styles.progressContainer}>
//             <View style={styles.progressBarBg}>
//               <MotiView
//                 from={{ width: '0%' }}
//                 animate={{ width: '70%' }}
//                 transition={{ type: 'timing', duration: 1500 }}
//                 style={styles.progressBarFill}
//               />
//             </View>
//             <View style={styles.progressLabels}>
//               <Text style={styles.progressText}>En Route</Text>
//               <Text style={styles.progressPercentage}>70%</Text>
//             </View>
//           </View>

//           <View style={styles.deliveryMetrics}>
//             <View style={styles.metricItem}>
//               <Clock size={14} color={COLORS.white} />
//               <Text style={styles.metricText}>25 min</Text>
//             </View>
//             <View style={styles.metricDivider} />
//             <View style={styles.metricItem}>
//               <MapPin size={14} color={COLORS.white} />
//               <Text style={styles.metricText}>8.5 km</Text>
//             </View>
//           </View>
//         </TouchableOpacity>
//       </LinearGradient>
//     </MotiView>
//   );
// };

// // ─── MAIN DASHBOARD ────────────────────────────────────────────────────────────
// const DriverDashboard = () => {
//   const { currentUser: UserData } = useAuth();
//   const navigation = useNavigation();

//   // ✅ FIX 1: Hard false — NEVER read UserData?.isAvailable.
//   // Drivers must manually tap "Go Online" every session.
//   // This prevents stale/offline drivers from being visible to sellers.
//   const [isOnline,                 setIsOnline]                 = useState(false);
//   const [isTogglingStatus,         setIsTogglingStatus]         = useState(false);
//   const [refreshing,               setRefreshing]               = useState(false);
//   const [activeJob,                setActiveJob]                = useState(null);
//   const [myOffers,                 setMyOffers]                 = useState([]);
//   const [hasSubmittedVerification, setHasSubmittedVerification] = useState(false);
//   const [checkingVerification,     setCheckingVerification]     = useState(true);

//   // ✅ FIX 3: Refs for polling interval and pulse animation
//   const intervalRef = useRef(null);
//   const pulseAnim   = useRef(new Animated.Value(1)).current;

//   const userStatus = UserData?.status || UserData?.Status;
//   const isVerified = UserData?.isVerified === true ||
//                      userStatus === 'Approved' ||
//                      userStatus === 'Active';
//   const isPending  = userStatus === 'Pending' || hasSubmittedVerification;
//   const isRejected = userStatus === 'Rejected';

//   // ─── Verification check — unchanged ─────────────────────────────────────
//   const checkVerificationStatus = useCallback(async () => {
//     try {
//       const response = await apiClient.get('/driver/verification-status');
//       setHasSubmittedVerification(response.data?.hasSubmitted || false);
//     } catch (error) {
//       console.error('Error checking verification:', error);
//     } finally {
//       setCheckingVerification(false);
//     }
//   }, []);

//   // ─── Dashboard data fetch ────────────────────────────────────────────────
//   // silent=true → background poll, no spinner. silent=false → manual refresh.
//   // ✅ FIX 2: /driver/active-order 404 = no active job, NOT an error.
//   // validateStatus tells axios to treat 404 as a valid response so it never
//   // throws, never logs an error, and we cleanly set activeJob = null.
//   const fetchDashboardData = useCallback(async (silent = false) => {
//     if (!isVerified) return;
//     try {
//       const [activeRes, offersRes] = await Promise.all([
//         apiClient.get('/driver/active-order', {
//           validateStatus: (s) => s === 200 || s === 404,
//         }).catch(() => ({ status: 404, data: null })),
//         apiClient.get('/driver/my-offers').catch(() => ({ data: [] })),
//       ]);

//       // 404 means "no active job" — treat as null, not an error
//       setActiveJob(activeRes.status === 404 ? null : (activeRes.data || null));
//       setMyOffers(Array.isArray(offersRes.data) ? offersRes.data : []);
//     } catch (error) {
//       console.log('Dashboard sync error:', error?.message);
//     }
//   }, [isVerified]);

//   // ─── Auto-poll setup ─────────────────────────────────────────────────────
//   // ✅ FIX 3: setInterval-based polling. Faster when online (offers arrive),
//   // slower when offline. useFocusEffect cleans up interval on screen blur.
//   const startPolling = useCallback(() => {
//     if (intervalRef.current) clearInterval(intervalRef.current);
//     if (!isVerified) return;
//     const ms = isOnline ? POLL_MS_ONLINE : POLL_MS_OFFLINE;
//     intervalRef.current = setInterval(() => fetchDashboardData(true), ms);
//   }, [isVerified, isOnline, fetchDashboardData]);

//   // Screen focused → fetch immediately + start polling
//   // Screen blurred  → clear interval to save battery
//   useFocusEffect(
//     useCallback(() => {
//       checkVerificationStatus();
//       fetchDashboardData(false);
//       startPolling();
//       return () => {
//         if (intervalRef.current) clearInterval(intervalRef.current);
//       };
//     }, [checkVerificationStatus, fetchDashboardData, startPolling])
//   );

//   // Restart polling when online/offline state changes (different intervals)
//   useEffect(() => {
//     startPolling();
//     return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
//   }, [isOnline, startPolling]);

//   // Pulsing green dot animation — starts when polling, stops on blur
//   useEffect(() => {
//     const loop = Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, { toValue: 0.2, duration: 900, useNativeDriver: true }),
//         Animated.timing(pulseAnim, { toValue: 1,   duration: 900, useNativeDriver: true }),
//       ])
//     );
//     loop.start();
//     return () => loop.stop();
//   }, [pulseAnim]);

//   // ─── Toggle online / offline — original logic unchanged ─────────────────
//   const toggleOnlineStatus = async () => {
//     if (isTogglingStatus) return;
//     setIsTogglingStatus(true);
//     const newStatus = !isOnline;
//     try {
//       const response = await apiClient.patch('/driver/status', {
//         isOnline: newStatus,
//         latitude: null,
//         longitude: null,
//       });
//       setIsOnline(response.data?.isOnline ?? newStatus);
//       console.log('[DRIVER STATUS]', response.data?.isOnline ? 'ONLINE ✅' : 'OFFLINE ⭕');
//       Alert.alert(
//         newStatus ? "✅ You're Online" : "⭕ You're Offline",
//         newStatus
//           ? 'You can now receive delivery offers from sellers.'
//           : "You won't receive new offers until you go back online.",
//         [{ text: 'OK' }]
//       );
//     } catch (error) {
//       console.error('[STATUS TOGGLE ERROR]', error);
//       if (error.response?.data?.message?.includes('delivery is in progress')) {
//         Alert.alert('❌ Cannot Go Online', 'You have an active delivery in progress. Please complete it first before going online again.', [{ text: 'OK' }]);
//       } else {
//         Alert.alert('Error', 'Failed to update status. Please check your connection and try again.', [{ text: 'OK' }]);
//       }
//       // Do NOT update local state if API failed
//     } finally {
//       setIsTogglingStatus(false);
//     }
//   };

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await Promise.all([checkVerificationStatus(), fetchDashboardData(false)]);
//     setRefreshing(false);
//   }, [checkVerificationStatus, fetchDashboardData]);

//   const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return 'Good Morning';
//     if (hour < 18) return 'Good Afternoon';
//     return 'Good Evening';
//   };

//   // ✅ FIX 4: Detect if any offer in the list is already accepted.
//   // This is passed to MyOfferCard to hide the "Accept Offer" button
//   // when the driver already has an accepted offer this session.
//   const hasAcceptedOffer = myOffers.some(
//     (o) => o.status === 'Accepted' || o.isAccepted === true
//   );

//   // ─── RENDER — all JSX identical to original except 3 targeted additions ──
//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

//       {/* HEADER — unchanged */}
//       <View style={styles.headerWrapper}>
//         <LinearGradient
//           colors={[COLORS.forestGreenDark, COLORS.forestGreenDark]}
//           style={styles.headerGradient}
//         >
//           <View style={styles.headerContent}>
//             {/* Top Navigation Row */}
//             <View style={styles.navRow}>
//               <TouchableOpacity
//                 onPress={() => navigation.openDrawer()}
//                 style={styles.glassBtn}
//                 activeOpacity={0.7}
//               >
//                 <Menu color={COLORS.white} size={24} />
//               </TouchableOpacity>

//               <MotiView
//                 from={{ scale: 0.8, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 transition={{ type: 'spring' }}
//               >
//                 <Text style={styles.brandTitle}>
//                   RieRa <Text style={styles.brandPro}>PRO</Text>
//                 </Text>
//               </MotiView>

//               {/* ✅ ADDED: pulsing live dot inside bell button area */}
//               <View style={styles.bellWrapper}>
//                 <Animated.View style={[styles.livePulseDot, { opacity: pulseAnim }]} />
//                 <TouchableOpacity
//                   style={styles.glassBtn}
//                   activeOpacity={0.7}
//                   onPress={() => navigation.navigate('Notifications')}
//                 >
//                   <Bell color={COLORS.white} size={24} />
//                   <View style={styles.notificationDot} />
//                 </TouchableOpacity>
//               </View>
//             </View>

//               {/* Profile Section — shows real photo when available */}
//             <MotiView
//               from={{ opacity: 0, translateY: 20 }}
//               animate={{ opacity: 1, translateY: 0 }}
//               transition={{ type: 'spring', delay: 200 }}
//               style={styles.profileSection}
//             >
//               <View style={styles.profilePhotoContainer}>
//                 {UserData?.profilePictureUrl ? (
//                   // ✅ Real profile image from verification upload
//                   <View style={[styles.profilePhoto, { overflow: 'hidden', padding: 0 }]}>
//                     <ProfileImage
//                       source={{ uri: UserData.profilePictureUrl }}
//                       style={{ width: '100%', height: '100%', borderRadius: 17 }}
//                       resizeMode="cover"
//                     />
//                   </View>
//                 ) : (
//                   // Fallback: initials gradient
//                   <LinearGradient
//                     colors={[COLORS.white, COLORS.grayLight]}
//                     style={styles.profilePhoto}
//                   >
//                     <Text style={styles.profilePhotoText}>
//                       {UserData?.name?.[0]?.toUpperCase() || 'D'}
//                     </Text>
//                   </LinearGradient>
//                 )}
//                 {isOnline && isVerified && (
//                   <MotiView
//                     from={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     transition={{ type: 'spring' }}
//                     style={styles.onlineIndicator}
//                   />
//                 )}
//               </View>

//               <View style={styles.profileInfo}>
//                 <Text style={styles.greeting}>{getGreeting()},</Text>
//                 <Text style={styles.name}>{UserData?.name || 'Partner'}</Text>

//                 <View style={styles.statsRow}>
//                   <View style={styles.statItem}>
//                     <Star size={16} color={COLORS.warning} fill={COLORS.warning} />
//                     <Text style={styles.statText}>{Number(UserData?.averageRating || 5).toFixed(1)}</Text>
//                   </View>
//                   <View style={styles.statDivider} />
//                   <View style={styles.statItem}>
//                     <Package size={16} color={COLORS.white} />
//                     <Text style={styles.statText}>{UserData?.completedDeliveries || '0'} trips</Text>
//                   </View>
//                   <View style={styles.statDivider} />
//                   <TouchableOpacity 
//                     style={styles.statItem}
//                     onPress={() => navigation.navigate('Wallet')}
//                     activeOpacity={0.7}
//                   >
//                     <Wallet size={16} color={COLORS.white} />
//                     <Text style={styles.statText}>R{UserData?.walletBalance || '0'}</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </MotiView>
//           </View>
//         </LinearGradient>
//       </View>

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor={COLORS.forestGreen}
//             colors={[COLORS.forestGreen]}
//           />
//         }
//       >
//         {/* Verification overlay — unchanged */}
//         {!isVerified && !checkingVerification && (
//           <VerificationLock
//             navigation={navigation}
//             status={userStatus}
//             hasSubmitted={hasSubmittedVerification}
//           />
//         )}

//         <View style={{ opacity: isVerified ? 1 : 0.4, pointerEvents: isVerified ? 'auto' : 'none' }}>

//           {/* ONLINE/OFFLINE TOGGLE — unchanged */}
//           {!activeJob && (
//             <MotiView
//               from={{ opacity: 0, translateY: 20 }}
//               animate={{ opacity: 1, translateY: 0 }}
//               transition={{ type: 'spring', delay: 300 }}
//             >
//               <TouchableOpacity
//                 disabled={!isVerified || isTogglingStatus}
//                 onPress={toggleOnlineStatus}
//                 activeOpacity={0.9}
//                 style={styles.toggleCard}
//               >
//                 <LinearGradient
//                   colors={isOnline
//                     ? [COLORS.forestGreen + '10', COLORS.forestGreen + '20']
//                     : [COLORS.grayLight, COLORS.grayLight]}
//                   style={styles.toggleGradient}
//                 >
//                   <View style={styles.toggleContent}>
//                     <View style={styles.toggleInfo}>
//                       <MotiView
//                         from={{ scale: 1 }}
//                         animate={{ scale: isOnline ? 1.3 : 1 }}
//                         transition={{ loop: isOnline, type: 'timing', duration: 1000 }}
//                         style={[styles.statusIndicator, {
//                           backgroundColor: isOnline ? COLORS.forestGreen : COLORS.grayMedium,
//                         }]}
//                       />
//                       <View>
//                         <Text style={[styles.statusLabelText, {
//                           color: isOnline ? COLORS.forestGreen : COLORS.grayMedium,
//                         }]}>
//                           {isTogglingStatus ? 'Updating...' : (isOnline ? "You're Online" : "You're Offline")}
//                         </Text>
//                         <Text style={styles.statusSubtext}>
//                           {isTogglingStatus
//                             ? 'Please wait...'
//                             : (isOnline ? 'Ready to accept deliveries' : 'Tap to go online')}
//                         </Text>
//                       </View>
//                     </View>

//                     {isTogglingStatus ? (
//                       <ActivityIndicator size="small" color={COLORS.forestGreen} />
//                     ) : (
//                       <MotiView
//                         animate={{
//                           rotate: isOnline ? '0deg' : '180deg',
//                           backgroundColor: isOnline ? COLORS.forestGreen : COLORS.grayMedium,
//                         }}
//                         transition={{ type: 'spring' }}
//                         style={styles.powerBtn}
//                       >
//                         <Power color={COLORS.white} size={20} />
//                       </MotiView>
//                     )}
//                   </View>
//                 </LinearGradient>
//               </TouchableOpacity>
//             </MotiView>
//           )}

//           {/* MAIN CONTENT SECTION — unchanged except hasAcceptedOffer prop */}
//           <View style={styles.section}>
//             {activeJob ? (
//               <>
//                 <View style={styles.sectionHeader}>
//                   <Text style={styles.sectionTitle}>Active Delivery</Text>
//                   <MotiView
//                     from={{ rotate: '0deg' }}
//                     animate={{ rotate: '360deg' }}
//                     transition={{ loop: true, type: 'timing', duration: 3000 }}
//                   >
//                     <CircleEllipsis size={22} color={COLORS.forestGreen} />
//                   </MotiView>
//                 </View>

//                 <ActiveJobCard order={activeJob} navigation={navigation} />

//                 <View style={styles.lockInfoBox}>
//                   <Lock size={14} color={COLORS.grayMedium} />
//                   <Text style={styles.lockInfoText}>
//                     Marketplace locked during active delivery
//                   </Text>
//                 </View>
//               </>
//             ) : (
//               <>
//                 <View style={styles.sectionHeader}>
//                   <Text style={styles.sectionTitle}>Your Offers</Text>
//                   <View style={styles.zapBadge}>
//                     <Zap size={16} color={COLORS.warning} fill={COLORS.warning} />
//                   </View>
//                 </View>

//                 {myOffers.length > 0 ? (
//                   myOffers.map((offer, index) => (
//                     <MotiView
//                       key={offer.id || offer.orderId}
//                       from={{ opacity: 0, translateX: -20 }}
//                       animate={{ opacity: 1, translateX: 0 }}
//                       transition={{ type: 'spring', delay: index * 100, damping: 15 }}
//                     >
//                       {/* ✅ FIX 4: hasAcceptedOffer tells the card to hide
//                           "Accept Offer" when driver has already accepted one */}
//                       <MyOfferCard
//                         item={offer}
//                         index={index}
//                         hasAcceptedOffer={hasAcceptedOffer}
//                         onPress={() => navigation.navigate('DriverOrderDetails', {
//                           orderId: offer.orderId,
//                           offerId: offer.id,
//                         })}
//                       />
//                     </MotiView>
//                   ))
//                 ) : (
//                   <MotiView
//                     from={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ type: 'spring' }}
//                     style={styles.emptyContainer}
//                   >
//                     <View style={styles.emptyIconCircle}>
//                       <Package size={48} color={COLORS.forestGreen} opacity={0.3} />
//                     </View>
//                     <Text style={styles.emptyTitle}>
//                       {isOnline ? 'No Active Offers' : "You're Offline"}
//                     </Text>
//                     <Text style={styles.emptySub}>
//                       {isOnline
//                         ? 'Direct assignments from sellers will appear here'
//                         : 'Go online to start receiving delivery offers'}
//                     </Text>
//                   </MotiView>
//                 )}

//                 {/* MARKETPLACE PREVIEW — unchanged */}
//                 <MotiView
//                   from={{ opacity: 0, translateY: 20 }}
//                   animate={{ opacity: 1, translateY: 0 }}
//                   transition={{ type: 'spring', delay: 400 }}
//                 >
//                   <TouchableOpacity
//                     style={styles.marketPreview}
//                     onPress={() => navigation.navigate('AvailableDeliveries')}
//                     activeOpacity={0.8}
//                   >
//                     <LinearGradient
//                       colors={[COLORS.forestGreen + '15', COLORS.forestGreen + '08']}
//                       start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
//                       style={styles.marketGradient}
//                     >
//                       <View style={styles.marketIconContainer}>
//                         <LayoutGrid color={COLORS.white} size={22} />
//                       </View>
//                       <View style={{ flex: 1 }}>
//                         <Text style={styles.marketTitle}>Open Marketplace</Text>
//                         <Text style={styles.marketSub}>
//                           Browse public loads available to all drivers
//                         </Text>
//                       </View>
//                       <ChevronRight color={COLORS.forestGreen} size={24} />
//                     </LinearGradient>
//                   </TouchableOpacity>
//                 </MotiView>
//               </>
//             )}
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// // ─── STYLES — 100% original, two new styles added at the bottom ───────────────
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.white },
//   headerWrapper: {},
//   headerGradient: {
//     paddingHorizontal: 24,
//     paddingTop: Platform.OS === 'ios' ? 60 : 50,
//     paddingBottom: 32,
//   },
//   headerContent: {},
//   navRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 28,
//   },
//   glassBtn: {
//     width: 48, height: 48, borderRadius: 16,
//     backgroundColor: 'rgba(255,255,255,0.15)',
//     justifyContent: 'center', alignItems: 'center',
//     borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
//   },
//   notificationDot: {
//     position: 'absolute', top: 10, right: 10,
//     width: 8, height: 8, borderRadius: 4,
//     backgroundColor: COLORS.error,
//     borderWidth: 2, borderColor: COLORS.white,
//   },
//   brandTitle: { color: COLORS.white, fontWeight: '900', fontSize: 22, letterSpacing: -0.5 },
//   brandPro: { color: COLORS.white, fontWeight: '900', fontSize: 22, opacity: 0.7 },

//   // ✅ NEW: wrapper so live pulse dot sits just above the bell button
//   bellWrapper: { alignItems: 'center' },
//   livePulseDot: {
//     width: 6, height: 6, borderRadius: 3,
//     backgroundColor: '#22C55E',
//     marginBottom: 4,
//   },

//   profileSection: { flexDirection: 'row', alignItems: 'center', gap: 16 },
//   profilePhotoContainer: { position: 'relative' },
//   profilePhoto: {
//     width: 72, height: 72, borderRadius: 20,
//     justifyContent: 'center', alignItems: 'center',
//     borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)',
//   },
//   profilePhotoText: { color: COLORS.forestGreenDark, fontSize: 28, fontWeight: '900' },
//   onlineIndicator: {
//     position: 'absolute', bottom: 2, right: 2,
//     width: 18, height: 18, borderRadius: 9,
//     backgroundColor: '#22C55E',
//     borderWidth: 3, borderColor: COLORS.forestGreenDark,
//   },
//   profileInfo: { flex: 1 },
//   greeting: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '600', marginBottom: 4 },
//   name: { color: COLORS.white, fontSize: 24, fontWeight: '900', marginBottom: 12, letterSpacing: -0.5 },
//   statsRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//   statText: { color: COLORS.white, fontSize: 13, fontWeight: '700' },
//   statDivider: { width: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.3)' },

//   scrollContent: { paddingBottom: 40, backgroundColor: COLORS.white },

//   toggleCard: {
//     marginHorizontal: 24, marginTop: 24, borderRadius: 24,
//     overflow: 'hidden', elevation: 4,
//     shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1, shadowRadius: 8,
//   },
//   toggleGradient: { padding: 20 },
//   toggleContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
//   toggleInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   statusIndicator: { width: 12, height: 12, borderRadius: 6 },
//   statusLabelText: { fontWeight: '800', fontSize: 16, marginBottom: 2 },
//   statusSubtext: { fontSize: 12, color: COLORS.grayMedium, fontWeight: '600' },
//   powerBtn: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },

//   section: { paddingHorizontal: 24, marginTop: 32 },
//   sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
//   sectionTitle: { fontSize: 22, fontWeight: '900', color: COLORS.black, letterSpacing: -0.5 },
//   zapBadge: { backgroundColor: COLORS.warning + '20', padding: 8, borderRadius: 12 },

//   activeCardWrapper: {
//     borderRadius: 28, overflow: 'hidden', elevation: 12,
//     shadowColor: COLORS.forestGreen,
//     shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16,
//   },
//   activeCardGradient: { padding: 24, borderRadius: 28 },
//   activeCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
//   activeBadge: {
//     flexDirection: 'row', alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14,
//     borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
//   },
//   activeBadgeText: { color: COLORS.white, fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
//   pulseDot: { width: 0, height: 0 },
//   priceContainer: { flexDirection: 'row', alignItems: 'baseline' },
//   activePriceCurrency: { color: COLORS.white, fontSize: 18, fontWeight: '700', marginRight: 2, opacity: 0.9 },
//   activePrice: { color: COLORS.white, fontSize: 32, fontWeight: '900', letterSpacing: -1 },
//   activeTitle: { color: COLORS.white, fontSize: 20, fontWeight: '800', marginBottom: 16, lineHeight: 26 },
//   activeLocRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
//   locIconContainer: { width: 32, height: 32, borderRadius: 10, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
//   activeLocText: { color: COLORS.white, fontSize: 14, fontWeight: '600', flex: 1, opacity: 0.95 },
//   progressContainer: { gap: 10, marginBottom: 16 },
//   progressBarBg: { height: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 5, overflow: 'hidden' },
//   progressBarFill: { height: '100%', backgroundColor: COLORS.white, borderRadius: 5 },
//   progressLabels: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   progressText: { color: COLORS.white, fontSize: 13, fontWeight: '800' },
//   progressPercentage: { color: COLORS.white, fontSize: 13, fontWeight: '700', opacity: 0.8 },
//   deliveryMetrics: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 16, gap: 16 },
//   metricItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//   metricText: { color: COLORS.white, fontSize: 13, fontWeight: '700' },
//   metricDivider: { width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.3)' },

//   lockInfoBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16, gap: 8, backgroundColor: COLORS.white, padding: 12, borderRadius: 16 },
//   lockInfoText: { color: COLORS.grayMedium, fontSize: 13, fontWeight: '700' },

//   emptyContainer: { alignItems: 'center', paddingVertical: 48, backgroundColor: COLORS.white, borderRadius: 24, marginBottom: 16 },
//   emptyIconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.forestGreen + '10', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
//   emptyTitle: { fontSize: 20, fontWeight: '900', color: COLORS.black, marginBottom: 8 },
//   emptySub: { fontSize: 14, color: COLORS.grayMedium, textAlign: 'center', lineHeight: 20, paddingHorizontal: 40, fontWeight: '600' },

//   marketPreview: { marginTop: 16, borderRadius: 24, overflow: 'hidden', elevation: 4, shadowColor: COLORS.forestGreen, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12 },
//   marketGradient: { padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
//   marketIconContainer: { width: 52, height: 52, borderRadius: 16, backgroundColor: COLORS.forestGreen, justifyContent: 'center', alignItems: 'center' },
//   marketTitle: { fontSize: 17, fontWeight: '900', color: COLORS.black, marginBottom: 4 },
//   marketSub: { fontSize: 13, color: COLORS.forestGreen, fontWeight: '700', lineHeight: 18 },

//   // Verification overlay
//   lockOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(245, 247, 250, 0.98)', zIndex: 100, justifyContent: 'center', padding: 24 },
//   lockCard: { backgroundColor: COLORS.white, borderRadius: 32, padding: 32, alignItems: 'center', elevation: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20 },
//   lockIconCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
//   lockTitle: { fontSize: 26, fontWeight: '900', color: COLORS.black, marginBottom: 12, textAlign: 'center' },
//   lockSubtitle: { fontSize: 15, color: COLORS.grayMedium, textAlign: 'center', lineHeight: 22, marginBottom: 32, paddingHorizontal: 8, fontWeight: '600' },

//   statusContainer: { width: '100%', marginBottom: 24 },
//   statusIndicatorBox: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, padding: 20, marginBottom: 20 },
//   statusDot: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.info + '20', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
//   pulseRing: { width: 12, height: 12, borderRadius: 6 },
//   statusTitle: { fontSize: 16, fontWeight: '900', marginBottom: 4 },
//   statusSubtext: { fontSize: 13, color: COLORS.grayMedium, fontWeight: '600' },

//   timelineContainer: { backgroundColor: COLORS.grayLight, borderRadius: 20, padding: 20 },
//   timelineItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   timelineCircle: { width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
//   timelineText: { fontSize: 14, fontWeight: '700', color: COLORS.black, flex: 1 },
//   timelineLine: { width: 2, height: 24, backgroundColor: COLORS.grayMedium, marginLeft: 10, marginVertical: 8 },

//   waitingFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.grayLight, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 16, marginTop: 8 },
//   waitingText: { fontSize: 13, color: COLORS.grayMedium, fontWeight: '700' },

//   verifyBtn: { width: '100%', borderRadius: 20, overflow: 'hidden', elevation: 4 },
//   verifyBtnGradient: { paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
//   verifyBtnText: { color: COLORS.white, fontWeight: '800', fontSize: 17 },
// });

// export default DriverDashboard;













import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, RefreshControl, Alert, ActivityIndicator,
  Dimensions, Platform, Animated, Image as ProfileImage,
} from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import {
  Package, Power, Menu, Bell, ShieldAlert,
  MapPin, ChevronRight, Navigation, Lock, Zap,
  Wallet, LayoutGrid, Star, DollarSign, Clock,
  CheckCircle2, FileCheck, TrendingUp, Award,
  Sun, Moon, Activity, Target, ArrowUpRight,
  Truck, BarChart3, CircleEllipsis,
} from 'lucide-react-native';
import { useAuth } from '../auth/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import apiClient from '../services/apiClient';
import { useTheme } from '../context/ThemeContext';
import MyOfferCard from './MyOfferCard';

const { width } = Dimensions.get('window');

// ─── Poll intervals ─────────────────────────────────────────────────────────────
const POLL_MS_ONLINE  = 8000;
const POLL_MS_OFFLINE = 15000;

// ─── SEMANTIC STATUS COLORS (theme-agnostic) ────────────────────────────────────
const STATUS_COLORS = {
  success:    '#10B981',
  warning:    '#F59E0B',
  error:      '#EF4444',
  info:       '#3B82F6',
  purple:     '#8B5CF6',
};

// ─── THEME HELPER ───────────────────────────────────────────────────────────────
const buildTheme = (isDark) => ({
  bg:           isDark ? '#0B1120' : '#F0F4F8',
  surface:      isDark ? '#141E30' : '#FFFFFF',
  card:         isDark ? '#1C2A3F' : '#FFFFFF',
  cardElevated: isDark ? '#243347' : '#F7FAFC',
  border:       isDark ? '#2A3C55' : '#E2EBF4',
  primary:      '#10B981',
  primaryDark:  '#059669',
  primaryLight: '#34D399',
  primaryGlow:  isDark ? 'rgba(16,185,129,0.18)' : 'rgba(16,185,129,0.10)',
  headerTop:    isDark ? '#0D1B2A' : '#0D2137',
  headerBottom: isDark ? '#0F2744' : '#0A3459',
  textPrimary:  isDark ? '#F0F6FF' : '#0D1B2A',
  textSecondary:isDark ? '#8BA4C2' : '#4A6080',
  textMuted:    isDark ? '#4E6A8A' : '#8DA0B8',
  divider:      isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
  white:        '#FFFFFF',
  shadow:       isDark ? '#000' : '#193B5F',
  offlineBg:    isDark ? '#1A1A2E' : '#F5F7FA',
});

// ─── THEME TOGGLE BUTTON ────────────────────────────────────────────────────────
const ThemeToggle = ({ isDark, toggleTheme, theme }) => (
  <TouchableOpacity
    onPress={toggleTheme}
    activeOpacity={0.75}
    style={[styles.glassBtn, { backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.18)' }]}
  >
    {isDark
      ? <Sun color={theme.white} size={20} />
      : <Moon color={theme.white} size={20} />
    }
  </TouchableOpacity>
);

// ─── STAT CHIP ──────────────────────────────────────────────────────────────────
const StatChip = ({ icon: Icon, value, label, color, onPress, theme }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.75 : 1} style={styles.statChipWrapper}>
    <View style={[styles.statChipIcon, { backgroundColor: color + '22' }]}>
      <Icon size={14} color={color} />
    </View>
    <View>
      <Text style={[styles.statChipValue, { color: theme.white }]}>{value}</Text>
      <Text style={[styles.statChipLabel, { color: 'rgba(255,255,255,0.55)' }]}>{label}</Text>
    </View>
  </TouchableOpacity>
);

// ─── PERFORMANCE BANNER ─────────────────────────────────────────────────────────
const PerformanceBanner = ({ stats, theme }) => {
  const rating   = Number(stats?.averageRating || 5).toFixed(1);
  const trips    = stats?.completedDeliveries || stats?.totalTrips || 0;
  const earned   = stats?.totalEarned || 0;
  const streak   = stats?.currentStreak || 0;

  const items = [
    { icon: Star,       value: rating,               sub: 'Rating',    color: STATUS_COLORS.warning },
    { icon: Truck,      value: trips,                 sub: 'Trips',     color: STATUS_COLORS.info    },
    { icon: DollarSign, value: `R${earned}`,          sub: 'Earned',    color: STATUS_COLORS.success },
    { icon: Target,     value: `${streak}d`,          sub: 'Streak',    color: STATUS_COLORS.purple  },
  ];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 16 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', delay: 100, damping: 18 }}
      style={[styles.perfBanner, { backgroundColor: theme.card, borderColor: theme.border }]}
    >
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <View style={styles.perfItem}>
            <View style={[styles.perfIconRing, { backgroundColor: item.color + '20' }]}>
              <item.icon size={15} color={item.color} fill={item.icon === Star ? item.color : 'none'} />
            </View>
            <Text style={[styles.perfValue, { color: theme.textPrimary }]}>{item.value}</Text>
            <Text style={[styles.perfSub, { color: theme.textMuted }]}>{item.sub}</Text>
          </View>
          {i < items.length - 1 && (
            <View style={[styles.perfDivider, { backgroundColor: theme.border }]} />
          )}
        </React.Fragment>
      ))}
    </MotiView>
  );
};

// ─── VERIFICATION LOCK ──────────────────────────────────────────────────────────
const VerificationLock = ({ navigation, status, hasSubmitted, theme }) => {
  const isPending       = status === 'Pending' || hasSubmitted;
  const isRejected      = status === 'Rejected';

  const iconColor = isPending ? STATUS_COLORS.info : isRejected ? STATUS_COLORS.error : STATUS_COLORS.warning;
  const title     = isPending ? 'Verification In Progress'
                  : isRejected ? 'Verification Rejected'
                  : 'Account Verification Required';
  const message   = isPending
    ? '🔍 Our team is carefully reviewing your documents. This usually takes 24-48 hours.'
    : isRejected
    ? '⚠️ Your previous verification was not approved. Please resubmit correct documents.'
    : '✨ Complete your profile verification to unlock the dashboard and start earning.';

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 15 }}
      style={[styles.lockOverlay, { backgroundColor: theme.bg + 'FA' }]}
    >
      <View style={[styles.lockCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <MotiView
          from={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: isPending ? 'timing' : 'spring', duration: isPending ? 1200 : 800, loop: isPending }}
          style={[styles.lockIconCircle, { backgroundColor: iconColor + '18' }]}
        >
          {isPending
            ? <FileCheck color={iconColor} size={48} />
            : <ShieldAlert color={iconColor} size={48} />
          }
        </MotiView>

        <Text style={[styles.lockTitle, { color: theme.textPrimary }]}>{title}</Text>
        <Text style={[styles.lockSubtitle, { color: theme.textSecondary }]}>{message}</Text>

        {isPending && (
          <View style={styles.timelineContainer}>
            {[
              { label: 'Documents Submitted', done: true },
              { label: 'Admin Review',         done: false, loading: true },
              { label: 'Account Activation',   done: false },
            ].map((step, i) => (
              <React.Fragment key={i}>
                <View style={styles.timelineItem}>
                  {step.done ? (
                    <CheckCircle2 size={22} color={STATUS_COLORS.success} fill={STATUS_COLORS.success} />
                  ) : step.loading ? (
                    <View style={[styles.timelineCircle, { backgroundColor: iconColor }]}>
                      <ActivityIndicator size="small" color="#fff" />
                    </View>
                  ) : (
                    <View style={[styles.timelineCircle, { backgroundColor: theme.border }]} />
                  )}
                  <Text style={[styles.timelineText, { color: step.done || step.loading ? theme.textPrimary : theme.textMuted }]}>
                    {step.label}
                  </Text>
                </View>
                {i < 2 && <View style={[styles.timelineLine, { backgroundColor: theme.border }]} />}
              </React.Fragment>
            ))}
          </View>
        )}

        {!isPending && (
          <TouchableOpacity
            style={styles.verifyBtn}
            onPress={() => navigation.navigate('Driververification')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={isRejected ? [STATUS_COLORS.error, '#DC2626'] : ['#10B981', '#059669']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.verifyBtnGradient}
            >
              <Text style={styles.verifyBtnText}>
                {isRejected ? 'Resubmit Documents' : 'Get Verified Now'}
              </Text>
              <ChevronRight color="#fff" size={22} />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {isPending && (
          <View style={[styles.waitingFooter, { backgroundColor: theme.cardElevated }]}>
            <Clock size={14} color={theme.textMuted} />
            <Text style={[styles.waitingText, { color: theme.textMuted }]}>
              Expected response time: 24–48 hours
            </Text>
          </View>
        )}
      </View>
    </MotiView>
  );
};

// ─── ACTIVE JOB CARD ─────────────────────────────────────────────────────────────
const ActiveJobCard = ({ order, navigation }) => {
  if (!order) return null;
  return (
    <MotiView
      from={{ opacity: 0, translateY: 28 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 18 }}
      style={styles.activeCardWrapper}
    >
      <LinearGradient
        colors={['#0D7A52', '#10B981']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.activeCardGradient}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('DriverOrderDetails', {
            orderId: order?.orderId || order?.id,
            offerId: order?.offerId || order?.id,
          })}
          activeOpacity={0.9}
        >
          <View style={styles.activeCardHeader}>
            <View style={styles.activeBadge}>
              <MotiView
                from={{ opacity: 0.3 }} animate={{ opacity: 1 }}
                transition={{ loop: true, duration: 900, type: 'timing' }}
                style={styles.activePulseDot}
              />
              <Text style={styles.activeBadgeText}>LIVE DELIVERY</Text>
            </View>
            <View style={styles.priceTag}>
              <Text style={styles.activePriceCurrency}>R</Text>
              <Text style={styles.activePrice}>{order?.price || '0.00'}</Text>
            </View>
          </View>

          <Text style={styles.activeTitle} numberOfLines={2}>
            {order?.orderTitle || 'Current Shipment'}
          </Text>

          <View style={styles.activeLocRow}>
            <View style={styles.locIconContainer}>
              <Navigation size={16} color="#10B981" />
            </View>
            <Text style={styles.activeLocText} numberOfLines={1}>
              {order?.deliveryAddress || 'Address N/A'}
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <MotiView
                from={{ width: '0%' }} animate={{ width: '70%' }}
                transition={{ type: 'timing', duration: 1600 }}
                style={styles.progressBarFill}
              />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressText}>En Route</Text>
              <Text style={styles.progressPercentage}>70%</Text>
            </View>
          </View>

          <View style={styles.deliveryMetrics}>
            {[
              { icon: Clock,  text: '25 min' },
              { icon: MapPin, text: '8.5 km' },
              { icon: ArrowUpRight, text: 'On time' },
            ].map((m, i) => (
              <React.Fragment key={i}>
                <View style={styles.metricItem}>
                  <m.icon size={13} color="rgba(255,255,255,0.85)" />
                  <Text style={styles.metricText}>{m.text}</Text>
                </View>
                {i < 2 && <View style={styles.metricDivider} />}
              </React.Fragment>
            ))}
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </MotiView>
  );
};

// ─── EMPTY OFFERS STATE ──────────────────────────────────────────────────────────
const EmptyOffers = ({ isOnline, theme }) => (
  <MotiView
    from={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: 'spring' }}
    style={[styles.emptyContainer, { backgroundColor: theme.card, borderColor: theme.border }]}
  >
    <View style={[styles.emptyIconCircle, { backgroundColor: '#10B981' + '18' }]}>
      <Package size={44} color="#10B981" opacity={0.6} />
    </View>
    <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
      {isOnline ? 'No Active Offers' : "You're Offline"}
    </Text>
    <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
      {isOnline
        ? 'Direct assignments from sellers will appear here automatically'
        : 'Tap the power button above to start receiving delivery offers'}
    </Text>
    {!isOnline && (
      <View style={[styles.emptyHint, { backgroundColor: '#10B981' + '15' }]}>
        <Activity size={14} color="#10B981" />
        <Text style={[styles.emptyHintText, { color: '#10B981' }]}>Go online to earn</Text>
      </View>
    )}
  </MotiView>
);

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────────
const DriverDashboard = () => {
  const { currentUser: UserData } = useAuth();
  const navigation = useNavigation();

  // ── Theme ─────────────────────────────────────────────────────────────────────
  const { isDark, toggleTheme } = useTheme();
  const theme = useMemo(() => buildTheme(isDark), [isDark]);

  // ── Core state ────────────────────────────────────────────────────────────────
  const [isOnline,                 setIsOnline]                 = useState(false);
  const [isTogglingStatus,         setIsTogglingStatus]         = useState(false);
  const [refreshing,               setRefreshing]               = useState(false);

  // ── Data state (split for granular updates / fast API) ────────────────────────
  const [activeJob,                setActiveJob]                = useState(null);
  const [myOffers,                 setMyOffers]                 = useState([]);
  const [driverStats,              setDriverStats]              = useState(null); // rating, trips, earnings
  const [hasSubmittedVerification, setHasSubmittedVerification] = useState(false);
  const [checkingVerification,     setCheckingVerification]     = useState(true);

  // ── Loading flags (separate so partial data can show while rest loads) ─────────
  const [statsLoading,             setStatsLoading]             = useState(true);
  const [offersLoading,            setOffersLoading]            = useState(true);

  // ── Refs ──────────────────────────────────────────────────────────────────────
  const intervalRef = useRef(null);
  const pulseAnim   = useRef(new Animated.Value(1)).current;

  // ── Derived values ────────────────────────────────────────────────────────────
  const userStatus = UserData?.status || UserData?.Status;
  const isVerified = UserData?.isVerified === true
                  || userStatus === 'Approved'
                  || userStatus === 'Active';
  const isPending  = userStatus === 'Pending' || hasSubmittedVerification;
  const isRejected = userStatus === 'Rejected';
  const hasAcceptedOffer = myOffers.some(o => o.status === 'Accepted' || o.isAccepted === true);
const [location, setLocation] = useState(null);

useEffect(() => {
  (async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);
  })();
}, []);
  // ── Merge UserData stats with fetched stats (UserData wins when fresh) ─────────
 const mergedStats = useMemo(() => ({
  // Map 'rating' from backend to 'averageRating' for the UI
  averageRating:       driverStats?.rating           ?? UserData?.rating           ?? 5,
  totalTrips:          driverStats?.totalTrips       ?? UserData?.totalTrips       ?? 0,
  totalEarned:         driverStats?.totalEarnings    ?? UserData?.totalEarnings    ?? 0,
  // Keep others as fallbacks
  walletBalance:       driverStats?.walletBalance    ?? UserData?.walletBalance    ?? 0,
  currentStreak:       driverStats?.currentStreak    ?? UserData?.currentStreak    ?? 0,
}), [driverStats, UserData]);

  // ── Greeting ──────────────────────────────────────────────────────────────────
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  // ── Verification check ────────────────────────────────────────────────────────
  const checkVerificationStatus = useCallback(async () => {
    try {
      const res = await apiClient.get('/driver/verification-status');
      setHasSubmittedVerification(res.data?.hasSubmitted || false);
    } catch (e) {
      console.log('Verification check error:', e?.message);
    } finally {
      setCheckingVerification(false);
    }
  }, []);

  // ── Stats fetch (separate — lightweight, cached-friendly) ─────────────────────
  const fetchStats = useCallback(async () => {
    if (!isVerified) return;
    try {
      const res = await apiClient.get('/driver/stats').catch(() => ({ data: null }));
      if (res.data) setDriverStats(res.data);
    } catch (e) {
      console.log('Stats fetch error:', e?.message);
    } finally {
      setStatsLoading(false);
    }
  }, [isVerified]);

  // ── Dashboard data fetch (active job + offers) — fast parallel calls ──────────
const fetchDashboardData = useCallback(async (silent = false) => {
  if (!isVerified) return;
  if (!silent) setOffersLoading(true);

  try {
    const [activeRes, offersRes, statsRes] = await Promise.all([
      apiClient.get('/driver/active-order', {
        validateStatus: (s) => s === 200 || s === 404,
      }).catch(() => ({ status: 404, data: null })),
      
      apiClient.get('/driver/my-offers').catch(() => ({ data: [] })),
      
      // Fetch the latest rating, trips, and earnings
      apiClient.get('/driver/stats').catch(() => ({ data: null })),
    ]);

    setActiveJob(activeRes.status === 404 ? null : (activeRes.data || null));
    setMyOffers(Array.isArray(offersRes.data) ? offersRes.data : []);

    // ✅ FIX: Update 'driverStats' (not driverData) to sync with your UI logic
    if (statsRes.data) {
      setDriverStats(statsRes.data); 
      // This matches the state used by your 'mergedStats' useMemo
    }

  } catch (e) {
    console.log('Dashboard sync error:', e?.message);
  } finally {
    setOffersLoading(false);
  }
}, [isVerified]);

  // ── Polling ───────────────────────────────────────────────────────────────────
  const startPolling = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!isVerified) return;
    const ms = isOnline ? POLL_MS_ONLINE : POLL_MS_OFFLINE;
    intervalRef.current = setInterval(() => fetchDashboardData(true), ms);
  }, [isVerified, isOnline, fetchDashboardData]);

  useFocusEffect(
    useCallback(() => {
      checkVerificationStatus();
      // Fire all fetches in parallel on focus — no sequential blocking
      Promise.all([
        fetchDashboardData(false),
        fetchStats(),
      ]);
      startPolling();
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, [checkVerificationStatus, fetchDashboardData, fetchStats, startPolling])
  );

  useEffect(() => {
    startPolling();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isOnline, startPolling]);

  // ── Pulse animation ───────────────────────────────────────────────────────────
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.15, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  // ── Toggle online/offline ─────────────────────────────────────────────────────
const toggleOnlineStatus = async () => {
  if (isTogglingStatus) return;
  setIsTogglingStatus(true);
  
  const newStatus = !isOnline;

  try {
    let lat = null;
    let lng = null;

    // 1. Only request high-accuracy location if turning Online
    if (newStatus) {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const currentPos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          lat = currentPos.coords.latitude;
          lng = currentPos.coords.longitude;
        } else {
          Alert.alert("Permission Required", "Location is needed to show you nearby orders.");
          setIsTogglingStatus(false);
          return;
        }
      } catch (locError) {
        console.warn("Location fetch failed:", locError);
        // We continue anyway, but the server might reject if Lat/Lng are 0
      }
    }

    // 2. ✅ Matches [HttpPost("toggle-availability")]
    // ✅ Matches ToggleAvailabilityRequest { IsOnline, Latitude, Longitude }
    const res = await apiClient.post('/driver/toggle-availability', {
      IsOnline: newStatus,
      Latitude: lat,
      Longitude: lng,
    });

    // 3. Sync UI with Server Response
    const serverData = res.data;
    const serverIsOnline = serverData?.isOnline ?? serverData?.IsOnline;
    
    setIsOnline(serverIsOnline !== undefined ? serverIsOnline : newStatus);

    Alert.alert(
      newStatus ? "✅ You're Online" : "⭕ You're Offline", 
      newStatus 
        ? "You are now visible to sellers for new delivery offers." 
        : "You won't receive new offers until you go back online."
    );

  } catch (error) {
    if (error.response) {
      const errorMsg = error.response.data?.message || error.response.data?.Message;
      
      // Handle the "Busy Guard" from the backend
      if (error.response.status === 400 && errorMsg) {
        Alert.alert('Action Blocked', errorMsg);
      } else {
        Alert.alert('Update Failed', errorMsg || 'The server rejected the status update.');
      }
    } else {
      Alert.alert('Connection Error', 'Could not reach the server. Check your internet.');
    }
  } finally {
    setIsTogglingStatus(false);
  }
};

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([checkVerificationStatus(), fetchDashboardData(false), fetchStats()]);
    setRefreshing(false);
  }, [checkVerificationStatus, fetchDashboardData, fetchStats]);

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ═══ HEADER ═══════════════════════════════════════════════════════════════ */}
      <LinearGradient
        colors={[theme.headerTop, theme.headerBottom]}
        start={{ x: 0, y: 0 }} end={{ x: 0.8, y: 1 }}
        style={styles.header}
      >
        {/* Decorative glow orb */}
        <View style={styles.headerGlowOrb} />

        {/* Nav row */}
        <View style={styles.navRow}>
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.glassBtn} activeOpacity={0.7}>
            <Menu color="#fff" size={22} />
          </TouchableOpacity>

          <MotiView
            from={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring' }}
            style={styles.brandContainer}
          >
            <View style={[styles.brandDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.brandTitle}>RieRa</Text>
            <View style={[styles.brandBadge]}>
              <Text style={styles.brandBadgeText}>PRO</Text>
            </View>
          </MotiView>

          <View style={styles.headerActions}>
            <View style={styles.bellWrapper}>
              <Animated.View style={[styles.livePulseDot, { opacity: pulseAnim }]} />
              <TouchableOpacity
                style={styles.glassBtn}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Notifications')}
              >
                <Bell color="#fff" size={22} />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
            </View>
            <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} theme={theme} />
          </View>
        </View>

        {/* Profile row */}
        <MotiView
          from={{ opacity: 0, translateY: 24 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', delay: 150, damping: 18 }}
          style={styles.profileSection}
        >
          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            {UserData?.profilePictureUrl ? (
              <ProfileImage
                source={{ uri: UserData.profilePictureUrl }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <LinearGradient
                colors={['#34D399', '#10B981']}
                style={styles.avatarPlaceholder}
              >
                <Text style={styles.avatarInitial}>
                  {UserData?.name?.[0]?.toUpperCase() || 'D'}
                </Text>
              </LinearGradient>
            )}
            {isOnline && isVerified && (
              <MotiView
                from={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                style={styles.onlineRing}
              />
            )}
          </View>

          {/* Info */}
          <View style={styles.profileInfo}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.driverName} numberOfLines={1}>
              {UserData?.name || 'Partner'}
            </Text>

            {/* Inline stat chips */}
            <View style={styles.statChipRow}>
              <StatChip
                icon={Star}
                value={Number(mergedStats.averageRating).toFixed(1)}
                label="Rating"
                color={STATUS_COLORS.warning}
                theme={theme}
              />
              <View style={styles.statChipDivider} />
              <StatChip
                icon={Truck}
                value={`${mergedStats.completedDeliveries || mergedStats.totalTrips}`}
                label="Trips"
                color={STATUS_COLORS.info}
                theme={theme}
              />
              <View style={styles.statChipDivider} />
              <StatChip
                icon={Wallet}
                value={`R${mergedStats.walletBalance}`}
                label="Wallet"
                color={STATUS_COLORS.success}
                onPress={() => navigation.navigate('Wallet')}
                theme={theme}
              />
            </View>
          </View>
        </MotiView>
      </LinearGradient>

      {/* ═══ SCROLL BODY ══════════════════════════════════════════════════════════ */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 48 }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#10B981"
            colors={['#10B981']}
          />
        }
      >
        {/* Verification overlay */}
        {!isVerified && !checkingVerification && (
          <VerificationLock
            navigation={navigation}
            status={userStatus}
            hasSubmitted={hasSubmittedVerification}
            theme={theme}
          />
        )}

        <View style={{ opacity: isVerified ? 1 : 0.35, pointerEvents: isVerified ? 'auto' : 'none' }}>

          {/* PERFORMANCE BANNER */}
          {!statsLoading && (
            <View style={styles.sectionPad}>
              <PerformanceBanner stats={mergedStats} theme={theme} />
            </View>
          )}

          {/* ONLINE / OFFLINE TOGGLE */}
          {!activeJob && (
            <MotiView
              from={{ opacity: 0, translateY: 16 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'spring', delay: 200, damping: 18 }}
              style={styles.sectionPad}
            >
              <TouchableOpacity
                disabled={!isVerified || isTogglingStatus}
                onPress={toggleOnlineStatus}
                activeOpacity={0.88}
              >
                <LinearGradient
                  colors={isOnline
                    ? ['#10B981' + '22', '#10B981' + '10']
                    : [theme.card, theme.card]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[styles.toggleCard, {
                    borderColor: isOnline ? '#10B981' + '55' : theme.border,
                  }]}
                >
                  <View style={styles.toggleContent}>
                    <View style={styles.toggleLeft}>
                      <View style={[
                        styles.toggleIconRing,
                        { backgroundColor: isOnline ? '#10B981' + '20' : theme.border + '80' }
                      ]}>
                        {isOnline
                          ? <Activity size={20} color="#10B981" />
                          : <Power size={20} color={theme.textMuted} />
                        }
                      </View>
                      <View>
                        <Text style={[styles.toggleStatusText, {
                          color: isOnline ? '#10B981' : theme.textPrimary,
                        }]}>
                          {isTogglingStatus ? 'Updating…' : isOnline ? 'Youre Online' : 'Youre Offline'}
                        </Text>
                        <Text style={[styles.toggleSubText, { color: theme.textMuted }]}>
                          {isTogglingStatus
                            ? 'Please wait…'
                            : isOnline ? 'Receiving delivery offers' : 'Tap to go online'}
                        </Text>
                      </View>
                    </View>

                    {isTogglingStatus ? (
                      <ActivityIndicator size="small" color="#10B981" />
                    ) : (
                      <MotiView
                        animate={{ backgroundColor: isOnline ? '#10B981' : theme.textMuted }}
                        transition={{ type: 'spring' }}
                        style={styles.powerBtn}
                      >
                        <Power color="#fff" size={18} />
                      </MotiView>
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </MotiView>
          )}

          {/* MAIN CONTENT SECTION */}
          <View style={styles.sectionPad}>

            {activeJob ? (
              <>
                {/* Section header */}
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleRow}>
                    <View style={[styles.sectionAccent, { backgroundColor: '#10B981' }]} />
                    <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                      Active Delivery
                    </Text>
                  </View>
                  <MotiView
                    from={{ rotate: '0deg' }} animate={{ rotate: '360deg' }}
                    transition={{ loop: true, type: 'timing', duration: 3200 }}
                  >
                    <CircleEllipsis size={20} color="#10B981" />
                  </MotiView>
                </View>

                <ActiveJobCard order={activeJob} navigation={navigation} />

                <View style={[styles.lockInfoBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <Lock size={13} color={theme.textMuted} />
                  <Text style={[styles.lockInfoText, { color: theme.textMuted }]}>
                    Marketplace locked during active delivery
                  </Text>
                </View>
              </>
            ) : (
              <>
                {/* Section header */}
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleRow}>
                    <View style={[styles.sectionAccent, { backgroundColor: STATUS_COLORS.warning }]} />
                    <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                      Your Offers
                    </Text>
                  </View>
                  <View style={[styles.zapBadge, { backgroundColor: STATUS_COLORS.warning + '20' }]}>
                    <Zap size={15} color={STATUS_COLORS.warning} fill={STATUS_COLORS.warning} />
                    <Text style={[styles.zapCount, { color: STATUS_COLORS.warning }]}>
                      {myOffers.length}
                    </Text>
                  </View>
                </View>

                {offersLoading ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator size="small" color="#10B981" />
                    <Text style={[styles.loadingText, { color: theme.textMuted }]}>
                      Loading offers…
                    </Text>
                  </View>
                ) : myOffers.length > 0 ? (
                  myOffers.map((offer, index) => (
                    <MotiView
                      key={offer.id || offer.orderId}
                      from={{ opacity: 0, translateX: -18 }}
                      animate={{ opacity: 1, translateX: 0 }}
                      transition={{ type: 'spring', delay: index * 80, damping: 16 }}
                    >
                      <MyOfferCard
                        item={offer}
                        index={index}
                        hasAcceptedOffer={hasAcceptedOffer}
                        onPress={() => navigation.navigate('DriverOrderDetails', {
                          orderId: offer.orderId,
                          offerId: offer.id,
                        })}
                      />
                    </MotiView>
                  ))
                ) : (
                  <EmptyOffers isOnline={isOnline} theme={theme} />
                )}

                {/* MARKETPLACE PREVIEW */}
                <MotiView
                  from={{ opacity: 0, translateY: 16 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'spring', delay: 350, damping: 18 }}
                  style={{ marginTop: 16 }}
                >
                  <TouchableOpacity
                    onPress={() => navigation.navigate('AvailableDeliveries')}
                    activeOpacity={0.82}
                  >
                    <LinearGradient
                      colors={['#10B981' + '18', '#10B981' + '08']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                      style={[styles.marketCard, { borderColor: '#10B981' + '40' }]}
                    >
                      <View style={styles.marketIconContainer}>
                        <LayoutGrid color="#fff" size={22} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.marketTitle, { color: theme.textPrimary }]}>
                          Open Marketplace
                        </Text>
                        <Text style={[styles.marketSub, { color: '#10B981' }]}>
                          Browse public loads available to all drivers
                        </Text>
                      </View>
                      <ChevronRight color="#10B981" size={22} />
                    </LinearGradient>
                  </TouchableOpacity>
                </MotiView>

                {/* QUICK STATS ROW */}
                <MotiView
                  from={{ opacity: 0, translateY: 16 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'spring', delay: 450, damping: 18 }}
                  style={{ marginTop: 16 }}
                >
                  <View style={styles.quickStatsRow}>
                    {[
                      {
                        label: 'This Week',
                        value: `R${Number(mergedStats.totalEarned || 0).toFixed(0)}`,
                        sub: 'Total earned',
                        icon: TrendingUp,
                        color: STATUS_COLORS.success,
                        nav: 'Earnings',
                      },
                      {
                        label: 'All Time',
                        value: `${mergedStats.completedDeliveries || 0}`,
                        sub: 'Deliveries',
                        icon: Award,
                        color: STATUS_COLORS.purple,
                        nav: 'TripHistory',
                      },
                    ].map((item, i) => (
                      <TouchableOpacity
                        key={i}
                        style={[styles.quickStatCard, {
                          backgroundColor: theme.card,
                          borderColor: theme.border,
                          marginLeft: i > 0 ? 12 : 0,
                        }]}
                        onPress={() => navigation.navigate(item.nav)}
                        activeOpacity={0.8}
                      >
                        <View style={[styles.quickStatIcon, { backgroundColor: item.color + '18' }]}>
                          <item.icon size={18} color={item.color} />
                        </View>
                        <Text style={[styles.quickStatValue, { color: theme.textPrimary }]}>
                          {item.value}
                        </Text>
                        <Text style={[styles.quickStatSub, { color: theme.textMuted }]}>
                          {item.sub}
                        </Text>
                        <View style={styles.quickStatFooter}>
                          <Text style={[styles.quickStatLabel, { color: item.color }]}>
                            {item.label}
                          </Text>
                          <BarChart3 size={12} color={item.color} />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </MotiView>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 58 : 48,
    paddingBottom: 28,
    overflow: 'hidden',
  },
  headerGlowOrb: {
    position: 'absolute', top: -40, right: -40,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(16,185,129,0.08)',
  },
  navRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 24,
  },
  glassBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  brandContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  brandDot: { width: 8, height: 8, borderRadius: 4 },
  brandTitle: { color: '#fff', fontWeight: '900', fontSize: 20, letterSpacing: -0.3 },
  brandBadge: {
    backgroundColor: 'rgba(16,185,129,0.35)', borderRadius: 8,
    paddingHorizontal: 7, paddingVertical: 2,
    borderWidth: 1, borderColor: 'rgba(16,185,129,0.5)',
  },
  brandBadgeText: { color: '#10B981', fontWeight: '900', fontSize: 10, letterSpacing: 1 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bellWrapper: { alignItems: 'center' },
  livePulseDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: '#22C55E', marginBottom: 2,
  },
  notificationDot: {
    position: 'absolute', top: 9, right: 9,
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: '#EF4444',
    borderWidth: 1.5, borderColor: '#fff',
  },

  // Profile section
  profileSection: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatarWrapper: { position: 'relative' },
  avatarImage: {
    width: 72, height: 72, borderRadius: 22,
    borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.25)',
  },
  avatarPlaceholder: {
    width: 72, height: 72, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarInitial: { color: '#fff', fontSize: 30, fontWeight: '900' },
  onlineRing: {
    position: 'absolute', bottom: 3, right: 3,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: '#22C55E',
    borderWidth: 2.5, borderColor: '#0D1B2A',
  },
  profileInfo: { flex: 1 },
  greeting: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '600', marginBottom: 3 },
  driverName: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: -0.4, marginBottom: 10 },
  statChipRow: { flexDirection: 'row', alignItems: 'center', gap: 0 },
  statChipWrapper: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statChipIcon: { width: 26, height: 26, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  statChipValue: { fontSize: 14, fontWeight: '800', letterSpacing: -0.2 },
  statChipLabel: { fontSize: 10, fontWeight: '600' },
  statChipDivider: { width: 1, height: 22, backgroundColor: 'rgba(255,255,255,0.18)', marginHorizontal: 10 },

  // Performance banner
  perfBanner: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 20, padding: 16,
    borderWidth: 1,
  },
  perfItem: { flex: 1, alignItems: 'center', gap: 4 },
  perfIconRing: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  perfValue: { fontSize: 17, fontWeight: '900', letterSpacing: -0.3 },
  perfSub: { fontSize: 11, fontWeight: '600' },
  perfDivider: { width: 1, height: 44, marginHorizontal: 4 },

  // Toggle
  toggleCard: {
    borderRadius: 20, padding: 18,
    borderWidth: 1.5,
  },
  toggleContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  toggleIconRing: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  toggleStatusText: { fontSize: 16, fontWeight: '800', marginBottom: 2 },
  toggleSubText: { fontSize: 13, fontWeight: '600' },
  powerBtn: {
    width: 44, height: 44, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },

  // Section layout
  sectionPad: { paddingHorizontal: 20, marginTop: 20 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionAccent: { width: 4, height: 22, borderRadius: 2 },
  sectionTitle: { fontSize: 20, fontWeight: '900', letterSpacing: -0.4 },
  zapBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  zapCount: { fontSize: 13, fontWeight: '800' },

  // Active job card
  activeCardWrapper: {
    borderRadius: 24, overflow: 'hidden',
    shadowColor: '#10B981', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 20, elevation: 12,
  },
  activeCardGradient: { padding: 22, borderRadius: 24 },
  activeCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  activeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 12,
  },
  activePulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' },
  activeBadgeText: { color: '#fff', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  priceTag: { flexDirection: 'row', alignItems: 'baseline', gap: 1 },
  activePriceCurrency: { color: 'rgba(255,255,255,0.75)', fontSize: 16, fontWeight: '700' },
  activePrice: { color: '#fff', fontSize: 30, fontWeight: '900', letterSpacing: -1 },
  activeTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 14, lineHeight: 24 },
  activeLocRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  locIconContainer: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  activeLocText: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '600', flex: 1 },
  progressContainer: { gap: 8, marginBottom: 14 },
  progressBarBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#fff', borderRadius: 4 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  progressPercentage: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '700' },
  deliveryMetrics: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingVertical: 10, paddingHorizontal: 14, borderRadius: 14, gap: 16,
  },
  metricItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metricText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  metricDivider: { width: 1, height: 18, backgroundColor: 'rgba(255,255,255,0.25)' },

  // Lock info
  lockInfoBox: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: 14, gap: 7, borderWidth: 1, padding: 12, borderRadius: 14,
  },
  lockInfoText: { fontSize: 13, fontWeight: '700' },

  // Empty state
  emptyContainer: {
    alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24,
    borderRadius: 24, borderWidth: 1, marginBottom: 4,
  },
  emptyIconCircle: {
    width: 88, height: 88, borderRadius: 44,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: '900', marginBottom: 8, letterSpacing: -0.3 },
  emptySub: { fontSize: 14, textAlign: 'center', lineHeight: 20, fontWeight: '500', marginBottom: 16 },
  emptyHint: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
  },
  emptyHintText: { fontSize: 13, fontWeight: '700' },

  // Marketplace card
  marketCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderRadius: 20, padding: 18, borderWidth: 1.5,
  },
  marketIconContainer: {
    width: 50, height: 50, borderRadius: 15,
    backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center',
  },
  marketTitle: { fontSize: 16, fontWeight: '900', marginBottom: 3 },
  marketSub: { fontSize: 13, fontWeight: '600', lineHeight: 18 },

  // Quick stats
  quickStatsRow: { flexDirection: 'row' },
  quickStatCard: {
    flex: 1, borderRadius: 20, padding: 18, borderWidth: 1,
  },
  quickStatIcon: { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  quickStatValue: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5, marginBottom: 3 },
  quickStatSub: { fontSize: 12, fontWeight: '600', marginBottom: 12 },
  quickStatFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  quickStatLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.3 },

  // Loading
  loadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 28 },
  loadingText: { fontSize: 14, fontWeight: '600' },

  // Scroll
  scrollContent: { paddingBottom: 48 },

  // Verification overlay
  lockOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 100, justifyContent: 'center', padding: 24,
  },
  lockCard: {
    borderRadius: 28, padding: 28, alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25, shadowRadius: 24, elevation: 20,
  },
  lockIconCircle: { width: 96, height: 96, borderRadius: 48, justifyContent: 'center', alignItems: 'center', marginBottom: 22 },
  lockTitle: { fontSize: 24, fontWeight: '900', textAlign: 'center', marginBottom: 10, letterSpacing: -0.4 },
  lockSubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 21, marginBottom: 28, fontWeight: '500' },
  timelineContainer: { width: '100%', marginBottom: 24 },
  timelineItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  timelineCircle: { width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  timelineText: { fontSize: 14, fontWeight: '700', flex: 1 },
  timelineLine: { width: 2, height: 20, marginLeft: 10, marginVertical: 6, borderRadius: 1 },
  waitingFooter: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    paddingVertical: 11, paddingHorizontal: 18, borderRadius: 14, marginTop: 6,
  },
  waitingText: { fontSize: 13, fontWeight: '700' },
  verifyBtn: { width: '100%', borderRadius: 18, overflow: 'hidden', marginTop: 4 },
  verifyBtnGradient: {
    paddingVertical: 17, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  verifyBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});

export default DriverDashboard;