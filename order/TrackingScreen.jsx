// import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
// import {
//   View, Text, StyleSheet, ScrollView, TouchableOpacity,
//   SafeAreaView, RefreshControl, ActivityIndicator,
//   StatusBar, Animated, Platform,
// } from 'react-native';
// import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
// import { MotiView } from 'moti';
// import { LinearGradient } from 'expo-linear-gradient';
// import {
//   ArrowLeft, ShoppingBag, CheckCircle2, Truck,
//   Package, Check, ChevronRight, MapPin, Clock,
//   UserCheck, DollarSign, AlertOctagon, FileText, Wifi,
// } from 'lucide-react-native';

// import apiClient from '../services/apiClient';
// import { useTheme } from '../context/ThemeContext';
// import ProfessionalModal from '../components/ProfessionalModal';
// import MutualRatingModal from '../components/MutualRatingModal';
// import DisputeModal from '../components/DisputeModal';

// // ─── Theme builder ────────────────────────────────────────────────────────────
// const buildTheme = (isDark) => ({
//   bg:           isDark ? '#0B1120' : '#F0F4F8',
//   surface:      isDark ? '#141E30' : '#FFFFFF',
//   card:         isDark ? '#1C2A3F' : '#FFFFFF',
//   border:       isDark ? '#2A3C55' : '#E2EBF4',
//   textPrimary:  isDark ? '#F0F6FF' : '#0D1B2A',
//   textSecondary:isDark ? '#8BA4C2' : '#4A6080',
//   textMuted:    isDark ? '#4E6A8A' : '#8DA0B8',
//   headerTop:    isDark ? '#0D1B2A' : '#0D2137',
//   primary:      '#10B981',
//   white:        '#FFFFFF',
//   shadow:       isDark ? '#000' : '#193B5F',
//   footer:       isDark ? '#0F1B2D' : '#FFFFFF',
// });

// // ─── Poll intervals ────────────────────────────────────────────────────────────
// const POLL_MS = {
//   Pending: 8000, Accepted: 8000, Confirmed: 8000,
//   Assigned: 6000, Dispatched: 5000, Shipped: 5000,
//   'In Transit': 5000, Processing: 6000,
//   Arrived: 4000, Delivered: 4000,
//   AwaitingSellerRating: 7000, Disputed: 12000,
//   Completed: null, Settled: null, Cancelled: null,
// };

// const STATUS_HINT = {
//   Pending:              'Waiting for seller to confirm…',
//   Accepted:             'Seller has confirmed your order',
//   Confirmed:            'Seller has confirmed your order',
//   Assigned:             'Driver has accepted the delivery',
//   Dispatched:           'Your order is on the way!',
//   Shipped:              'Your order is on the way!',
//   'In Transit':         'Your order is on the way!',
//   Processing:           'Processing your order',
//   Arrived:              'Package at your location — please confirm',
//   Delivered:            'Package at your location — please confirm',
//   AwaitingSellerRating: 'Waiting for seller to rate you',
//   Disputed:             'Under review by our support team',
//   Completed:            'Order complete — payments released',
//   Settled:              'Order complete — payments released',
//   Cancelled:            'Order was cancelled',
// };

// // ─── Status index ─────────────────────────────────────────────────────────────
// const getStatusIndex = (status) => {
//   switch (status) {
//     case 'Pending':                                                         return 0;
//     case 'Accepted': case 'Confirmed':                                      return 1;
//     case 'Assigned':                                                        return 2;
//     case 'Dispatched': case 'Shipped': case 'In Transit': case 'Processing':return 3;
//     case 'Arrived':   case 'Delivered':                                     return 4;
//     case 'AwaitingSellerRating':                                            return 5;
//     case 'Completed': case 'Settled':                                       return 6;
//     case 'Disputed':                                                        return 4;
//     default:                                                                return 0;
//   }
// };

// // ─── Section Card ─────────────────────────────────────────────────────────────
// const SectionCard = ({ title, badge, children, theme, delay = 0 }) => (
//   <MotiView
//     from={{ opacity: 0, translateY: 10 }}
//     animate={{ opacity: 1, translateY: 0 }}
//     transition={{ type: 'spring', delay, damping: 18 }}
//   >
//     <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, shadowColor: theme.shadow }]}>
//       <View style={styles.cardHeaderRow}>
//         <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{title}</Text>
//         {badge}
//       </View>
//       {children}
//     </View>
//   </MotiView>
// );

// // ─── Main Screen ──────────────────────────────────────────────────────────────
// export default function TrackingScreen() {
//   const route      = useRoute();
//   const navigation = useNavigation();
//   const { isDark } = useTheme();
//   const theme      = useMemo(() => buildTheme(isDark), [isDark]);

//   const initialOrder = route.params?.order || null;
//   const [order,            setOrder]            = useState(initialOrder);
//   const [refreshing,       setRefreshing]       = useState(false);
//   const [isPolling,        setIsPolling]        = useState(false);
//   const [modalConfig,      setModalConfig]      = useState({ visible: false, type: 'info', title: '', message: '', buttons: [] });
//   const [showRatingModal,  setShowRatingModal]  = useState(false);
//   const [showDisputeModal, setShowDisputeModal] = useState(false);
//   const [ratingLoading,    setRatingLoading]    = useState(false);
//   const [disputeLoading,   setDisputeLoading]   = useState(false);

//   const intervalRef = useRef(null);
//   const pulseAnim   = useRef(new Animated.Value(1)).current;

//   const orderId = order?.id || route.params?.orderId || route.params?.order?.id;

//   // ─── Fetch ────────────────────────────────────────────────────────────────
//   const fetchOrderDetails = useCallback(async (silent = false) => {
//     if (!orderId) return;
//     if (!silent) setRefreshing(true);
//     try {
//       const res = await apiClient.get(`/orders/marketplace/${orderId}`);
//       setOrder(res.data);
//     } catch (err) {
//       if (!silent) {
//         setModalConfig({
//           visible: true, type: 'error', title: 'Connection Error',
//           message: 'Failed to load order details. Pull down to retry.',
//           buttons: [{ text: 'OK' }],
//         });
//       }
//     } finally {
//       if (!silent) setRefreshing(false);
//     }
//   }, [orderId]);

//   // ─── Polling ──────────────────────────────────────────────────────────────
//   const startPolling = useCallback((status) => {
//     if (intervalRef.current) clearInterval(intervalRef.current);
//     const ms = POLL_MS[status] ?? null;
//     if (!ms) { setIsPolling(false); return; }
//     setIsPolling(true);
//     intervalRef.current = setInterval(() => fetchOrderDetails(true), ms);
//   }, [fetchOrderDetails]);

//   useFocusEffect(
//     useCallback(() => {
//       fetchOrderDetails();
//       return () => { if (intervalRef.current) clearInterval(intervalRef.current); setIsPolling(false); };
//     }, [fetchOrderDetails])
//   );

//   useEffect(() => { if (order?.status) startPolling(order.status); }, [order?.status, startPolling]);

//   useEffect(() => {
//     if (orderId && !order) fetchOrderDetails();
//   }, [orderId, order, fetchOrderDetails]);

//   // Pulse animation
//   useEffect(() => {
//     if (!isPolling) { pulseAnim.setValue(1); return; }
//     const loop = Animated.loop(Animated.sequence([
//       Animated.timing(pulseAnim, { toValue: 0.2, duration: 850, useNativeDriver: true }),
//       Animated.timing(pulseAnim, { toValue: 1,   duration: 850, useNativeDriver: true }),
//     ]));
//     loop.start();
//     return () => loop.stop();
//   }, [isPolling, pulseAnim]);

//   // ─── Handlers ─────────────────────────────────────────────────────────────
//   const handleSubmitRatings = async (ratingsData) => {
//     setRatingLoading(true);
//     try {
//       if (!ratingsData.sellerRating || !ratingsData.driverRating) {
//         setModalConfig({ visible: true, type: 'warning', title: 'Ratings Required',
//           message: 'Please rate both the seller and the driver before completing.',
//           buttons: [{ text: 'OK', style: 'cancel' }] });
//         return;
//       }
//       await apiClient.post(`/orders/${orderId}/complete-with-ratings`, {
//         SellerRating: ratingsData.sellerRating, SellerReview: ratingsData.sellerReview || '',
//         DriverRating: ratingsData.driverRating, DriverReview: ratingsData.driverReview || '',
//       });
//       setShowRatingModal(false);
//       await fetchOrderDetails(true);
//       setModalConfig({ visible: true, type: 'success', title: 'Order Complete! 🎉',
//         message: 'Your ratings have been saved and payments released.',
//         buttons: [{ text: 'Done', onPress: () => setModalConfig(p => ({ ...p, visible: false })) }] });
//     } catch (error) {
//       const errMsg = error.response?.data?.errors
//         ? Object.values(error.response.data.errors)[0][0]
//         : (error.response?.data?.message || 'Failed to submit ratings.');
//       setModalConfig({ visible: true, type: 'error', title: 'Submission Failed',
//         message: errMsg, buttons: [{ text: 'Try Again', style: 'cancel' }] });
//     } finally {
//       setRatingLoading(false);
//     }
//   };

//   const handleSubmitDispute = async (disputeData) => {
//     setDisputeLoading(true);
//     try {
//       await apiClient.post(`/orders/${orderId}/dispute`, { reason: disputeData.reason, description: disputeData.description });
//       setShowDisputeModal(false);
//       await fetchOrderDetails(true);
//       setModalConfig({ visible: true, type: 'success', title: 'Dispute Submitted',
//         message: 'Your dispute has been raised. Our team will investigate within 24-48 hours.',
//         buttons: [{ text: 'OK' }] });
//     } catch (error) {
//       setModalConfig({ visible: true, type: 'error', title: 'Error',
//         message: error.response?.data?.message || 'Failed to submit dispute.',
//         buttons: [{ text: 'OK' }] });
//     } finally {
//       setDisputeLoading(false);
//     }
//   };

//   // ─── Loading ──────────────────────────────────────────────────────────────
//   if (!order) {
//     return (
//       <View style={[styles.center, { backgroundColor: theme.bg }]}>
//         <ActivityIndicator size="large" color={theme.primary} />
//         <Text style={[styles.loadingText, { color: theme.textMuted }]}>Loading order…</Text>
//       </View>
//     );
//   }

//   // ─── Derived state ────────────────────────────────────────────────────────
//   const currentStatus        = order.status || 'Pending';
//   const statusIndex          = getStatusIndex(currentStatus);
//   const isArrived            = ['Arrived', 'Delivered'].includes(currentStatus);
//   const isAwaitingSellerRating = currentStatus === 'AwaitingSellerRating';
//   const isDisputed           = currentStatus === 'Disputed';
//   const isCompleted          = ['Completed', 'Settled'].includes(currentStatus);
//   const isCancelled          = currentStatus === 'Cancelled';

//   const getSellerName = () => order.items?.[0]?.product?.sellerName || 'the seller';
//   const getDriverName = () => order.driverName || order.driver?.name || 'the driver';

//   const heroGradient = isDisputed  ? ['#7F1D1D', '#991B1B']
//     : isCompleted ? ['#065F46', '#047857']
//     : isCancelled ? ['#1E293B', '#374151']
//     : ['#0D7A52', '#10B981'];

//   const STEPS = [
//     { label: 'Order Placed',     icon: ShoppingBag, index: 0 },
//     { label: 'Seller Confirmed', icon: UserCheck,   index: 1 },
//     { label: 'Driver Assigned',  icon: Truck,       index: 2 },
//     { label: 'In Transit',       icon: Package,     index: 3 },
//     { label: 'Arrived',          icon: MapPin,      index: 4 },
//     { label: 'Completed',        icon: CheckCircle2, index: isDisputed ? 4 : isAwaitingSellerRating ? 5 : 6 },
//   ];

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
//       <StatusBar barStyle="#000000" translucent backgroundColor="transparent" />

//       {/* ─── Header ─── */}
//     {/* ─── Header ─── */}
// <View style={styles.header}>
//   <TouchableOpacity
//     style={[styles.navBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderColor: 'transparent' }]}
//     onPress={() => navigation.goBack()}
//     activeOpacity={0.7}
//   >
//     {/* Dynamic color for the icon based on theme */}
//     <ArrowLeft size={21} color={theme.textPrimary} />
//   </TouchableOpacity>

//   <View style={styles.headerCenter}>
//     <Text style={[styles.headerLabel, { color: theme.textMuted }]}>ORDER TRACKING</Text>
//     <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
//       #{order.id?.toString().slice(-8).toUpperCase() || 'N/A'}
//     </Text>
//   </View>

//   <View style={styles.navBtn}>
//     {isPolling ? (
//       <View style={styles.liveBadge}>
//         <Animated.View style={[styles.liveDot, { opacity: pulseAnim }]} />
//         <Text style={styles.liveText}>LIVE</Text>
//       </View>
//     ) : null}
//   </View>
// </View>

//       {/* ─── Scroll ─── */}
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={() => { setRefreshing(true); fetchOrderDetails(false); }}
//             tintColor={theme.primary}
//             colors={[theme.primary]}
//           />
//         }
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* Status hero */}
//         <MotiView
//           from={{ opacity: 0, scale: 0.96, translateY: 14 }}
//           animate={{ opacity: 1, scale: 1, translateY: 0 }}
//           transition={{ type: 'spring', damping: 16 }}
//         >
//           <LinearGradient colors={heroGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCard}>
//             <View style={styles.heroOrb1} />
//             <View style={styles.heroOrb2} />

//             <View style={styles.heroContent}>
//               <View style={{ flex: 1, zIndex: 1 }}>
//                 <Text style={styles.heroEyebrow}>CURRENT STATUS</Text>
//                 <Text style={styles.heroStatus}>{currentStatus}</Text>
//                 <Text style={styles.heroHint}>{STATUS_HINT[currentStatus] || currentStatus}</Text>
//                 <View style={styles.heroPriceRow}>
//                   <DollarSign size={16} color="rgba(255,255,255,0.8)" />
//                   <Text style={styles.heroPrice}>R{Number(order.totalAmount || 0).toFixed(2)}</Text>
//                 </View>
//               </View>
//               <View style={styles.heroIconRing}>
//                 <Package size={34} color="#fff" strokeWidth={1.5} />
//               </View>
//             </View>
//           </LinearGradient>
//         </MotiView>

//         {/* View full order details */}
//         <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', delay: 80, damping: 18 }}>
//           <TouchableOpacity
//             style={[styles.detailsBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
//             onPress={() => navigation.navigate('BuyerOrderDetails', { order })}
//             activeOpacity={0.82}
//           >
//             <View style={[styles.detailsBtnIcon, { backgroundColor: theme.primary + '18' }]}>
//               <FileText size={17} color={theme.primary} />
//             </View>
//             <Text style={[styles.detailsBtnText, { color: theme.textPrimary }]}>View Full Order Details</Text>
//             <ChevronRight size={17} color={theme.textMuted} />
//           </TouchableOpacity>
//         </MotiView>

//         {/* Disputed alert */}
//         {isDisputed && (
//           <MotiView from={{ opacity: 0, translateY: -14 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', delay: 100, damping: 18 }}>
//             <View style={[styles.alertCard, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
//               <View style={[styles.alertIconBox, { backgroundColor: '#FEE2E2' }]}>
//                 <AlertOctagon size={22} color="#EF4444" />
//               </View>
//               <View style={{ flex: 1 }}>
//                 <Text style={[styles.alertTitle, { color: '#991B1B' }]}>Dispute in Progress</Text>
//                 <Text style={[styles.alertSubtitle, { color: '#B91C1C' }]}>
//                   Our team is reviewing. Driver has been paid; seller funds held in escrow.
//                 </Text>
//               </View>
//             </View>
//           </MotiView>
//         )}

//         {/* Awaiting seller rating */}
//         {isAwaitingSellerRating && (
//           <MotiView from={{ opacity: 0, translateY: -14 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', delay: 100, damping: 18 }}>
//             <View style={[styles.alertCard, { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7' }]}>
//               <View style={[styles.alertIconBox, { backgroundColor: '#FEF3C7' }]}>
//                 <Clock size={22} color="#F59E0B" />
//               </View>
//               <View style={{ flex: 1 }}>
//                 <Text style={[styles.alertTitle, { color: '#92400E' }]}>Waiting for Seller</Text>
//                 <Text style={[styles.alertSubtitle, { color: '#B45309' }]}>
//                   Driver has been paid. Seller will receive payment once they rate you.
//                 </Text>
//               </View>
//             </View>
//           </MotiView>
//         )}

//         {/* Completed alert */}
//         {isCompleted && (
//           <MotiView from={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', delay: 100, damping: 18 }}>
//             <View style={[styles.alertCard, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
//               <View style={[styles.alertIconBox, { backgroundColor: '#D1FAE5' }]}>
//                 <CheckCircle2 size={22} color="#059669" />
//               </View>
//               <View style={{ flex: 1 }}>
//                 <Text style={[styles.alertTitle, { color: '#065F46' }]}>Order Complete!</Text>
//                 <Text style={[styles.alertSubtitle, { color: '#047857' }]}>
//                   All payments released. Thank you for your order!
//                 </Text>
//               </View>
//             </View>
//           </MotiView>
//         )}

//         {/* Action buttons — Arrived */}
//         {isArrived && !isDisputed && (
//           <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', delay: 160, damping: 18 }}>
//             <View style={styles.actionRow}>
//               <TouchableOpacity style={styles.disputeBtn} onPress={() => setShowDisputeModal(true)} activeOpacity={0.85}>
//                 <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.actionBtnGradient}>
//                   <AlertOctagon size={19} color="#fff" />
//                   <Text style={styles.actionBtnText}>Raise Dispute</Text>
//                 </LinearGradient>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.completeBtn} onPress={() => setShowRatingModal(true)} activeOpacity={0.85}>
//                 <LinearGradient colors={['#10B981', '#059669']} style={styles.actionBtnGradient}>
//                   <CheckCircle2 size={19} color="#fff" />
//                   <Text style={styles.actionBtnText}>Complete Order</Text>
//                 </LinearGradient>
//               </TouchableOpacity>
//             </View>
//           </MotiView>
//         )}

//         {/* Progress steps */}
//         <SectionCard
//           title="Order Progress"
//           theme={theme}
//           delay={200}
//           badge={isPolling ? (
//             <View style={styles.autoBadge}>
//               <Animated.View style={[styles.autoDot, { opacity: pulseAnim }]} />
//               <Wifi size={10} color={theme.primary} />
//               <Text style={[styles.autoText, { color: theme.primary }]}>Auto-updating</Text>
//             </View>
//           ) : null}
//         >
//           {STEPS.map((step, i) => {
//             const isActive  = statusIndex >= step.index;
//             const isCurrent = statusIndex === step.index;
//             const Icon      = step.icon;

//             return (
//               <View key={i}>
//                 <View style={styles.stepRow}>
//                   <MotiView
//                     animate={{
//                       backgroundColor: isActive ? theme.primary : theme.border,
//                       borderColor: isCurrent ? '#34D399' : 'transparent',
//                     }}
//                     transition={{ type: 'timing', duration: 350 }}
//                     style={[styles.stepIcon, { borderWidth: isCurrent ? 2.5 : 0 }]}
//                   >
//                     <Icon size={19} color={isActive ? '#fff' : theme.textMuted} strokeWidth={2.5} />
//                   </MotiView>

//                   <View style={{ flex: 1 }}>
//                     <Text style={[styles.stepLabel, {
//                       color: isActive ? theme.textPrimary : theme.textMuted,
//                       fontWeight: isCurrent ? '900' : '600',
//                     }]}>
//                       {step.label}
//                     </Text>
//                     {isCurrent && (
//                       <Text style={[styles.stepHint, { color: theme.primary }]}>
//                         {STATUS_HINT[currentStatus] || 'In progress…'}
//                       </Text>
//                     )}
//                   </View>

//                   {isActive && <Check size={15} color="#10B981" strokeWidth={3} />}
//                 </View>

//                 {i < STEPS.length - 1 && (
//                   <MotiView
//                     animate={{ backgroundColor: statusIndex > step.index ? theme.primary : theme.border }}
//                     transition={{ type: 'timing', duration: 350 }}
//                     style={styles.stepLine}
//                   />
//                 )}
//               </View>
//             );
//           })}
//         </SectionCard>

//         {/* Driver card */}
//         {(order.driverName || order.driver?.name) && (
//           <SectionCard title="Your Driver" theme={theme} delay={260}>
//             <View style={styles.driverRow}>
//               <View style={[styles.driverAvatar, { backgroundColor: theme.primary + '18' }]}>
//                 <Truck size={21} color={theme.primary} />
//               </View>
//               <View style={{ flex: 1 }}>
//                 <Text style={[styles.driverName, { color: theme.textPrimary }]}>{getDriverName()}</Text>
//                 <Text style={[styles.driverSub,  { color: theme.textSecondary }]}>
//                   {order.driver?.vehicleType || 'Delivery Driver'}
//                 </Text>
//               </View>
//               {statusIndex >= 3 && statusIndex < 5 && (
//                 <View style={styles.enRoutePill}>
//                   <Text style={styles.enRouteText}>EN ROUTE</Text>
//                 </View>
//               )}
//             </View>
//           </SectionCard>
//         )}

//         {/* Order items */}
//         <SectionCard title="Order Items" theme={theme} delay={320}>
//           {order.items?.map((item, i) => (
//             <View key={i} style={[styles.itemRow, i < order.items.length - 1 && { borderBottomColor: theme.border, borderBottomWidth: 1 }]}>
//               <View style={{ flex: 1 }}>
//                 <Text style={[styles.itemName, { color: theme.textPrimary }]}>
//                   {item.productName || item.product?.label || 'Product'}
//                 </Text>
//                 <Text style={[styles.itemQty, { color: theme.textSecondary }]}>
//                   {item.quantity}x @ R{Number(item.priceAtPurchase || 0).toFixed(2)}
//                 </Text>
//               </View>
//               <Text style={[styles.itemTotal, { color: theme.primary }]}>
//                 R{((item.quantity || 0) * (item.priceAtPurchase || 0)).toFixed(2)}
//               </Text>
//             </View>
//           ))}

//           <View style={[styles.itemDivider, { backgroundColor: theme.border }]} />
//           <View style={styles.itemRow}>
//             <Text style={[styles.itemQty, { color: theme.textSecondary }]}>Shipping</Text>
//             <Text style={[styles.itemQty, { color: theme.textSecondary }]}>
//               R{Number(order.shippingFee || 0).toFixed(2)}
//             </Text>
//           </View>
//           <View style={styles.itemRow}>
//             <Text style={[styles.itemName, { color: theme.textPrimary }]}>Total</Text>
//             <Text style={[styles.itemTotal, { color: theme.primary }]}>
//               R{Number(order.totalAmount || 0).toFixed(2)}
//             </Text>
//           </View>
//         </SectionCard>

//         {/* Delivery address */}
//         <SectionCard title="Delivery Address" theme={theme} delay={380}>
//           <View style={styles.addressRow}>
//             <View style={[styles.addressIconBox, { backgroundColor: '#EF444418' }]}>
//               <MapPin size={16} color="#EF4444" />
//             </View>
//             <Text style={[styles.addressText, { color: theme.textSecondary }]}>
//               {order.deliveryAddress || 'No address provided'}
//             </Text>
//           </View>
//         </SectionCard>

//         <View style={{ height: 48 }} />
//       </ScrollView>

//       {/* ─── Modals ─── */}
//       <ProfessionalModal
//         visible={modalConfig.visible}
//         onClose={() => setModalConfig(p => ({ ...p, visible: false }))}
//         type={modalConfig.type} title={modalConfig.title}
//         message={modalConfig.message} buttons={modalConfig.buttons}
//       />
//       <MutualRatingModal
//         visible={showRatingModal}
//         onClose={() => setShowRatingModal(false)}
//         onSubmit={handleSubmitRatings}
//         sellerName={getSellerName()} driverName={getDriverName()}
//         loading={ratingLoading}
//       />
//       <DisputeModal
//         visible={showDisputeModal}
//         onClose={() => setShowDisputeModal(false)}
//         onSubmit={handleSubmitDispute}
//         loading={disputeLoading}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   center:    { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
//   loadingText: { fontSize: 14, fontWeight: '600' },

//   header: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//     paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1,
//   },
//   navBtn: {
//     width: 42, height: 42, borderRadius: 13,
//     justifyContent: 'center', alignItems: 'center', borderWidth: 1,
//   },
//   headerCenter: { alignItems: 'center' },
//   headerLabel:  { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.5)', letterSpacing: 1, marginBottom: 2 },
//   headerTitle:  { fontSize: 17, fontWeight: '900', color: '#fff', letterSpacing: -0.4 },
//   liveBadge:    { flexDirection: 'row', alignItems: 'center', gap: 4 },
//   liveDot:      { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' },
//   liveText:     { fontSize: 9, fontWeight: '900', color: '#22C55E', letterSpacing: 0.5 },

//   scrollContent: { padding: 16 },

//   // Hero card
//   heroCard: {
//     borderRadius: 26, padding: 24, marginBottom: 14,
//     overflow: 'hidden', position: 'relative',
//     shadowColor: '#10B981', shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.35, shadowRadius: 18, elevation: 10,
//   },
//   heroOrb1: { position: 'absolute', top: -50, right: -50, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.07)' },
//   heroOrb2: { position: 'absolute', bottom: -40, left: -40, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,255,255,0.04)' },
//   heroContent: { flexDirection: 'row', alignItems: 'center' },
//   heroEyebrow: { fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.6)', letterSpacing: 1, marginBottom: 6 },
//   heroStatus:  { fontSize: 26, fontWeight: '900', color: '#fff', letterSpacing: -0.7, marginBottom: 4 },
//   heroHint:    { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.7)', marginBottom: 12 },
//   heroPriceRow:{ flexDirection: 'row', alignItems: 'center', gap: 4 },
//   heroPrice:   { fontSize: 20, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
//   heroIconRing:{
//     width: 70, height: 70, borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.12)',
//     justifyContent: 'center', alignItems: 'center',
//     borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)',
//   },

//   // Details button
//   detailsBtn: {
//     flexDirection: 'row', alignItems: 'center', gap: 12,
//     padding: 14, borderRadius: 18, borderWidth: 1, marginBottom: 14,
//   },
//   detailsBtnIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
//   detailsBtnText: { flex: 1, fontSize: 15, fontWeight: '700' },

//   // Alert cards
//   alertCard: {
//     flexDirection: 'row', alignItems: 'flex-start', gap: 14,
//     borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 1,
//   },
//   alertIconBox: { width: 46, height: 46, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
//   alertTitle:   { fontSize: 15, fontWeight: '900', marginBottom: 4 },
//   alertSubtitle:{ fontSize: 12, fontWeight: '600', lineHeight: 18 },

//   // Action buttons
//   actionRow:   { flexDirection: 'row', gap: 12, marginBottom: 14 },
//   disputeBtn:  { flex: 1, borderRadius: 18, overflow: 'hidden', shadowColor: '#EF4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
//   completeBtn: { flex: 1, borderRadius: 18, overflow: 'hidden', shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
//   actionBtnGradient:{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, gap: 8 },
//   actionBtnText:    { color: '#fff', fontSize: 14, fontWeight: '900' },

//   // Section card
//   card: {
//     borderRadius: 22, padding: 20, marginBottom: 14, borderWidth: 1,
//     shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
//   },
//   cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
//   cardTitle:     { fontSize: 17, fontWeight: '900', letterSpacing: -0.3 },
//   autoBadge:     { flexDirection: 'row', alignItems: 'center', gap: 4 },
//   autoDot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
//   autoText:      { fontSize: 10, fontWeight: '800', letterSpacing: 0.3 },

//   // Steps
//   stepRow:  { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 7, gap: 14 },
//   stepIcon: { width: 38, height: 38, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
//   stepLabel:{ flex: 1, fontSize: 14, paddingTop: 3, letterSpacing: -0.1 },
//   stepHint: { fontSize: 11, fontWeight: '600', marginTop: 2 },
//   stepLine: { width: 2, height: 20, marginLeft: 18, marginVertical: 2, borderRadius: 1 },

//   // Driver card
//   driverRow:   { flexDirection: 'row', alignItems: 'center', gap: 14 },
//   driverAvatar:{ width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
//   driverName:  { fontSize: 16, fontWeight: '800', marginBottom: 2 },
//   driverSub:   { fontSize: 12, fontWeight: '600' },
//   enRoutePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: '#ECFDF5' },
//   enRouteText: { fontSize: 10, fontWeight: '900', color: '#059669', letterSpacing: 0.5 },

//   // Items
//   itemRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 10 },
//   itemName:   { fontSize: 14, fontWeight: '800', marginBottom: 3 },
//   itemQty:    { fontSize: 12, fontWeight: '600' },
//   itemTotal:  { fontSize: 15, fontWeight: '900' },
//   itemDivider:{ height: 1, marginVertical: 8 },

//   // Address
//   addressRow:    { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
//   addressIconBox:{ width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
//   addressText:   { flex: 1, fontSize: 15, fontWeight: '600', lineHeight: 22 },
// });











import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, RefreshControl, ActivityIndicator,
  StatusBar, Animated, Platform,
} from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft, ShoppingBag, CheckCircle2, Truck,
  Package, Clock, ChevronRight, MapPin,
  UserCheck, DollarSign, AlertOctagon, FileText, Wifi,
} from 'lucide-react-native';

import apiClient from '../services/apiClient';
import { useTheme } from '../context/ThemeContext';
import ProfessionalModal from '../components/ProfessionalModal';
import MutualRatingModal from '../components/MutualRatingModal';
import DisputeModal from '../components/DisputeModal';

// ─── Theme builder ────────────────────────────────────────────────────────────
const buildTheme = (isDark) => ({
  bg:            isDark ? '#0B1120' : '#F0F4F8',
  surface:       isDark ? '#141E30' : '#FFFFFF',
  card:          isDark ? '#1C2A3F' : '#FFFFFF',
  border:        isDark ? '#2A3C55' : '#E2EBF4',
  textPrimary:   isDark ? '#F0F6FF' : '#0D1B2A',
  textSecondary: isDark ? '#8BA4C2' : '#4A6080',
  textMuted:     isDark ? '#4E6A8A' : '#8DA0B8',
  primary:       '#10B981',
  white:         '#FFFFFF',
  shadow:        isDark ? '#000' : '#193B5F',
  footer:        isDark ? '#0F1B2D' : '#FFFFFF',
  // Header colours matching SupportSettingsScreen
  headerBg:      isDark ? '#1E293B' : '#FFFFFF',
  headerBorder:  isDark ? '#334155' : '#E2E8F0',
  backBtnBg:     isDark ? '#334155' : '#F1F5F9',
});

// ─── Poll intervals ────────────────────────────────────────────────────────────
const POLL_MS = {
  Pending: 8000, Accepted: 8000, Confirmed: 8000,
  Assigned: 6000, Dispatched: 5000, Shipped: 5000,
  'In Transit': 5000, Processing: 6000,
  Arrived: 4000, Delivered: 4000,
  AwaitingSellerRating: 7000, Disputed: 12000,
  Completed: null, Settled: null, Cancelled: null,
};

const STATUS_HINT = {
  Pending:              'Waiting for seller to confirm…',
  Accepted:             'Seller has confirmed your order',
  Confirmed:            'Seller has confirmed your order',
  Assigned:             'Driver has accepted the delivery',
  Dispatched:           'Your order is on the way!',
  Shipped:              'Your order is on the way!',
  'In Transit':         'Your order is on the way!',
  Processing:           'Processing your order',
  Arrived:              'Package at your location — please confirm',
  Delivered:            'Package at your location — please confirm',
  AwaitingSellerRating: 'Waiting for seller to rate you',
  Disputed:             'Under review by our support team',
  Completed:            'Order complete — payments released',
  Settled:              'Order complete — payments released',
  Cancelled:            'Order was cancelled',
};

// ─── Step timestamps (static labels shown per step) ──────────────────────────
const STEP_TIME_LABELS = [
  'Order received',
  'Confirmed by seller',
  'Driver en route',
  'Out for delivery',
  'At your location',
  'All done',
];

// ─── Status index ─────────────────────────────────────────────────────────────
const getStatusIndex = (status) => {
  switch (status) {
    case 'Pending':                                                              return 0;
    case 'Accepted': case 'Confirmed':                                           return 1;
    case 'Assigned':                                                             return 2;
    case 'Dispatched': case 'Shipped': case 'In Transit': case 'Processing':    return 3;
    case 'Arrived':   case 'Delivered':                                          return 4;
    case 'AwaitingSellerRating':                                                 return 5;
    case 'Completed': case 'Settled':                                            return 6;
    case 'Disputed':                                                             return 4;
    default:                                                                     return 0;
  }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatTime = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', hour12: false });
};

// ─── Section Card ─────────────────────────────────────────────────────────────
const SectionCard = ({ title, badge, children, theme, delay = 0 }) => (
  <MotiView
    from={{ opacity: 0, translateY: 10 }}
    animate={{ opacity: 1, translateY: 0 }}
    transition={{ type: 'spring', delay, damping: 18 }}
  >
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, shadowColor: theme.shadow }]}>
      <View style={styles.cardHeaderRow}>
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{title}</Text>
        {badge}
      </View>
      {children}
    </View>
  </MotiView>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function TrackingScreen() {
  const route      = useRoute();
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const theme      = useMemo(() => buildTheme(isDark), [isDark]);

  const initialOrder = route.params?.order || null;
  const [order,            setOrder]            = useState(initialOrder);
  const [refreshing,       setRefreshing]       = useState(false);
  const [isPolling,        setIsPolling]        = useState(false);
  const [modalConfig,      setModalConfig]      = useState({ visible: false, type: 'info', title: '', message: '', buttons: [] });
  const [showRatingModal,  setShowRatingModal]  = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [ratingLoading,    setRatingLoading]    = useState(false);
  const [disputeLoading,   setDisputeLoading]   = useState(false);

  const intervalRef = useRef(null);
  const pulseAnim   = useRef(new Animated.Value(1)).current;

  const orderId = order?.id || route.params?.orderId || route.params?.order?.id;

  // ─── Fetch ────────────────────────────────────────────────────────────────
  const fetchOrderDetails = useCallback(async (silent = false) => {
    if (!orderId) return;
    if (!silent) setRefreshing(true);
    try {
      const res = await apiClient.get(`/orders/marketplace/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      if (!silent) {
        setModalConfig({
          visible: true, type: 'error', title: 'Connection Error',
          message: 'Failed to load order details. Pull down to retry.',
          buttons: [{ text: 'OK' }],
        });
      }
    } finally {
      if (!silent) setRefreshing(false);
    }
  }, [orderId]);

  // ─── Polling ──────────────────────────────────────────────────────────────
  const startPolling = useCallback((status) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const ms = POLL_MS[status] ?? null;
    if (!ms) { setIsPolling(false); return; }
    setIsPolling(true);
    intervalRef.current = setInterval(() => fetchOrderDetails(true), ms);
  }, [fetchOrderDetails]);

  useFocusEffect(
    useCallback(() => {
      fetchOrderDetails();
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); setIsPolling(false); };
    }, [fetchOrderDetails])
  );

  useEffect(() => { if (order?.status) startPolling(order.status); }, [order?.status, startPolling]);
  useEffect(() => { if (orderId && !order) fetchOrderDetails(); }, [orderId, order, fetchOrderDetails]);

  // Pulse animation
  useEffect(() => {
    if (!isPolling) { pulseAnim.setValue(1); return; }
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 0.2, duration: 850, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1,   duration: 850, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [isPolling, pulseAnim]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleSubmitRatings = async (ratingsData) => {
    setRatingLoading(true);
    try {
      if (!ratingsData.sellerRating || !ratingsData.driverRating) {
        setModalConfig({ visible: true, type: 'warning', title: 'Ratings Required',
          message: 'Please rate both the seller and the driver before completing.',
          buttons: [{ text: 'OK', style: 'cancel' }] });
        return;
      }
      await apiClient.post(`/orders/${orderId}/complete-with-ratings`, {
        SellerRating: ratingsData.sellerRating, SellerReview: ratingsData.sellerReview || '',
        DriverRating: ratingsData.driverRating, DriverReview: ratingsData.driverReview || '',
      });
      setShowRatingModal(false);
      await fetchOrderDetails(true);
      setModalConfig({ visible: true, type: 'success', title: 'Order Complete! 🎉',
        message: 'Your ratings have been saved and payments released.',
        buttons: [{ text: 'Done', onPress: () => setModalConfig(p => ({ ...p, visible: false })) }] });
    } catch (error) {
      const errMsg = error.response?.data?.errors
        ? Object.values(error.response.data.errors)[0][0]
        : (error.response?.data?.message || 'Failed to submit ratings.');
      setModalConfig({ visible: true, type: 'error', title: 'Submission Failed',
        message: errMsg, buttons: [{ text: 'Try Again', style: 'cancel' }] });
    } finally {
      setRatingLoading(false);
    }
  };

  const handleSubmitDispute = async (disputeData) => {
    setDisputeLoading(true);
    try {
      await apiClient.post(`/orders/${orderId}/dispute`, { reason: disputeData.reason, description: disputeData.description });
      setShowDisputeModal(false);
      await fetchOrderDetails(true);
      setModalConfig({ visible: true, type: 'success', title: 'Dispute Submitted',
        message: 'Your dispute has been raised. Our team will investigate within 24-48 hours.',
        buttons: [{ text: 'OK' }] });
    } catch (error) {
      setModalConfig({ visible: true, type: 'error', title: 'Error',
        message: error.response?.data?.message || 'Failed to submit dispute.',
        buttons: [{ text: 'OK' }] });
    } finally {
      setDisputeLoading(false);
    }
  };

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (!order) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.textMuted }]}>Loading order…</Text>
      </View>
    );
  }

  // ─── Derived state ────────────────────────────────────────────────────────
  const currentStatus          = order.status || 'Pending';
  const statusIndex            = getStatusIndex(currentStatus);
  const isArrived              = ['Arrived', 'Delivered'].includes(currentStatus);
  const isAwaitingSellerRating = currentStatus === 'AwaitingSellerRating';
  const isDisputed             = currentStatus === 'Disputed';
  const isCompleted            = ['Completed', 'Settled'].includes(currentStatus);
  const isCancelled            = currentStatus === 'Cancelled';

  const getSellerName = () => order.items?.[0]?.product?.sellerName || 'the seller';
  const getDriverName = () => order.driverName || order.driver?.name || 'the driver';

  const heroGradient = isDisputed  ? ['#7F1D1D', '#991B1B']
    : isCompleted ? ['#065F46', '#047857']
    : isCancelled ? ['#1E293B', '#374151']
    : ['#0D7A52', '#10B981'];

  // Step timestamps pulled from order object (backend may supply them)
  const stepTimestamps = [
    order.createdAt,
    order.acceptedAt || order.confirmedAt,
    order.assignedAt,
    order.dispatchedAt || order.shippedAt,
    order.arrivedAt   || order.deliveredAt,
    order.completedAt || order.settledAt,
  ];

  const STEPS = [
    { label: 'Order Placed',      icon: ShoppingBag,  index: 0 },
    { label: 'Seller Confirmed',  icon: UserCheck,    index: 1 },
    { label: 'Driver Assigned',   icon: Truck,        index: 2 },
    { label: 'In Transit',        icon: Package,      index: 3 },
    { label: 'Arrived',           icon: MapPin,       index: 4 },
    { label: 'Completed',         icon: CheckCircle2, index: isDisputed ? 4 : isAwaitingSellerRating ? 5 : 6 },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.headerBg} />

      {/* ══════════ HEADER — matches SupportSettingsScreen ══════════ */}
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.headerBorder }]}>
        <View style={styles.headerContent}>

          {/* Back button */}
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: theme.backBtnBg }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.75}
          >
            <ArrowLeft size={22} color={theme.textPrimary} strokeWidth={2.5} />
          </TouchableOpacity>

          {/* Title block */}
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
              Order Tracking
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.textMuted }]}>
              #{order.id?.toString().slice(-8).toUpperCase() || 'N/A'}
            </Text>
          </View>

          {/* Right slot — LIVE badge or placeholder */}
          <View style={[styles.backBtn, { backgroundColor: 'transparent' }]}>
            {isPolling ? (
              <View style={styles.liveBadge}>
                <Animated.View style={[styles.liveDot, { opacity: pulseAnim }]} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            ) : null}
          </View>

        </View>
      </View>

      {/* ─── Scroll ─── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchOrderDetails(false); }}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >

        {/* Status hero */}
        <MotiView
          from={{ opacity: 0, scale: 0.96, translateY: 14 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 16 }}
        >
          <LinearGradient colors={heroGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCard}>
            <View style={styles.heroOrb1} />
            <View style={styles.heroOrb2} />
            <View style={styles.heroContent}>
              <View style={{ flex: 1, zIndex: 1 }}>
                <Text style={styles.heroEyebrow}>CURRENT STATUS</Text>
                <Text style={styles.heroStatus}>{currentStatus}</Text>
                <Text style={styles.heroHint}>{STATUS_HINT[currentStatus] || currentStatus}</Text>
                <View style={styles.heroPriceRow}>
                  <DollarSign size={16} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.heroPrice}>R{Number(order.totalAmount || 0).toFixed(2)}</Text>
                </View>
              </View>
              <View style={styles.heroIconRing}>
                <Package size={34} color="#fff" strokeWidth={1.5} />
              </View>
            </View>
          </LinearGradient>
        </MotiView>

        {/* View full order details */}
        <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', delay: 80, damping: 18 }}>
          <TouchableOpacity
            style={[styles.detailsBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => navigation.navigate('BuyerOrderDetails', { order })}
            activeOpacity={0.82}
          >
            <View style={[styles.detailsBtnIcon, { backgroundColor: theme.primary + '18' }]}>
              <FileText size={17} color={theme.primary} />
            </View>
            <Text style={[styles.detailsBtnText, { color: theme.textPrimary }]}>View Full Order Details</Text>
            <ChevronRight size={17} color={theme.textMuted} />
          </TouchableOpacity>
        </MotiView>

        {/* Disputed alert */}
        {isDisputed && (
          <MotiView from={{ opacity: 0, translateY: -14 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', delay: 100, damping: 18 }}>
            <View style={[styles.alertCard, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
              <View style={[styles.alertIconBox, { backgroundColor: '#FEE2E2' }]}>
                <AlertOctagon size={22} color="#EF4444" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.alertTitle, { color: '#991B1B' }]}>Dispute in Progress</Text>
                <Text style={[styles.alertSubtitle, { color: '#B91C1C' }]}>
                  Our team is reviewing. Driver has been paid; seller funds held in escrow.
                </Text>
              </View>
            </View>
          </MotiView>
        )}

        {/* Awaiting seller rating */}
        {isAwaitingSellerRating && (
          <MotiView from={{ opacity: 0, translateY: -14 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', delay: 100, damping: 18 }}>
            <View style={[styles.alertCard, { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7' }]}>
              <View style={[styles.alertIconBox, { backgroundColor: '#FEF3C7' }]}>
                <Clock size={22} color="#F59E0B" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.alertTitle, { color: '#92400E' }]}>Waiting for Seller</Text>
                <Text style={[styles.alertSubtitle, { color: '#B45309' }]}>
                  Driver has been paid. Seller will receive payment once they rate you.
                </Text>
              </View>
            </View>
          </MotiView>
        )}

        {/* Completed alert */}
        {isCompleted && (
          <MotiView from={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', delay: 100, damping: 18 }}>
            <View style={[styles.alertCard, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
              <View style={[styles.alertIconBox, { backgroundColor: '#D1FAE5' }]}>
                <CheckCircle2 size={22} color="#059669" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.alertTitle, { color: '#065F46' }]}>Order Complete!</Text>
                <Text style={[styles.alertSubtitle, { color: '#047857' }]}>
                  All payments released. Thank you for your order!
                </Text>
              </View>
            </View>
          </MotiView>
        )}

        {/* Action buttons — Arrived */}
        {isArrived && !isDisputed && (
          <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', delay: 160, damping: 18 }}>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.disputeBtn} onPress={() => setShowDisputeModal(true)} activeOpacity={0.85}>
                <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.actionBtnGradient}>
                  <AlertOctagon size={19} color="#fff" />
                  <Text style={styles.actionBtnText}>Raise Dispute</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.completeBtn} onPress={() => setShowRatingModal(true)} activeOpacity={0.85}>
                <LinearGradient colors={['#10B981', '#059669']} style={styles.actionBtnGradient}>
                  <CheckCircle2 size={19} color="#fff" />
                  <Text style={styles.actionBtnText}>Complete Order</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </MotiView>
        )}

        {/* ══════════ PROGRESS STEPS with timestamps ══════════ */}
        <SectionCard
          title="Order Progress"
          theme={theme}
          delay={200}
          badge={isPolling ? (
            <View style={styles.autoBadge}>
              <Animated.View style={[styles.autoDot, { opacity: pulseAnim }]} />
              <Wifi size={10} color={theme.primary} />
              <Text style={[styles.autoText, { color: theme.primary }]}>Auto-updating</Text>
            </View>
          ) : null}
        >
          {STEPS.map((step, i) => {
            const isActive  = statusIndex >= step.index;
            const isCurrent = statusIndex === step.index;
            const Icon      = step.icon;
            const timestamp = stepTimestamps[i];
            const timeStr   = formatTime(timestamp);

            return (
              <View key={i}>
                <View style={styles.stepRow}>

                  {/* Step icon circle */}
                  <MotiView
                    animate={{
                      backgroundColor: isActive ? theme.primary : theme.border,
                      borderColor: isCurrent ? '#34D399' : 'transparent',
                    }}
                    transition={{ type: 'timing', duration: 350 }}
                    style={[styles.stepIcon, { borderWidth: isCurrent ? 2.5 : 0 }]}
                  >
                    <Icon size={19} color={isActive ? '#fff' : theme.textMuted} strokeWidth={2.5} />
                  </MotiView>

                  {/* Step label + hint */}
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.stepLabel, {
                      color: isActive ? theme.textPrimary : theme.textMuted,
                      fontWeight: isCurrent ? '900' : '600',
                    }]}>
                      {step.label}
                    </Text>
                    {isCurrent && (
                      <Text style={[styles.stepHint, { color: theme.primary }]}>
                        {STATUS_HINT[currentStatus] || 'In progress…'}
                      </Text>
                    )}
                    {!isCurrent && isActive && (
                      <Text style={[styles.stepHint, { color: theme.textMuted }]}>
                        {STEP_TIME_LABELS[i]}
                      </Text>
                    )}
                  </View>

                  {/* ✅ TIME instead of checkmark */}
                  <View style={styles.stepTimeCol}>
                    {isActive ? (
                      <View style={[
                        styles.stepTimePill,
                        {
                          backgroundColor: isCurrent
                            ? theme.primary + '22'
                            : theme.border,
                        }
                      ]}>
                        <Clock
                          size={11}
                          color={isCurrent ? theme.primary : theme.textMuted}
                          strokeWidth={2.5}
                        />
                        <Text style={[
                          styles.stepTimeText,
                          { color: isCurrent ? theme.primary : theme.textMuted }
                        ]}>
                          {timeStr || (isCurrent ? 'Now' : 'Done')}
                        </Text>
                      </View>
                    ) : (
                      // Future step — empty placeholder keeps alignment
                      <View style={styles.stepTimePillEmpty} />
                    )}
                  </View>

                </View>

                {i < STEPS.length - 1 && (
                  <MotiView
                    animate={{ backgroundColor: statusIndex > step.index ? theme.primary : theme.border }}
                    transition={{ type: 'timing', duration: 350 }}
                    style={styles.stepLine}
                  />
                )}
              </View>
            );
          })}
        </SectionCard>

        {/* Driver card */}
        {(order.driverName || order.driver?.name) && (
          <SectionCard title="Your Driver" theme={theme} delay={260}>
            <View style={styles.driverRow}>
              <View style={[styles.driverAvatar, { backgroundColor: theme.primary + '18' }]}>
                <Truck size={21} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.driverName, { color: theme.textPrimary }]}>{getDriverName()}</Text>
                <Text style={[styles.driverSub,  { color: theme.textSecondary }]}>
                  {order.driver?.vehicleType || 'Delivery Driver'}
                </Text>
              </View>
              {statusIndex >= 3 && statusIndex < 5 && (
                <View style={styles.enRoutePill}>
                  <Text style={styles.enRouteText}>EN ROUTE</Text>
                </View>
              )}
            </View>
          </SectionCard>
        )}

        {/* Order items */}
        <SectionCard title="Order Items" theme={theme} delay={320}>
          {order.items?.map((item, i) => (
            <View key={i} style={[styles.itemRow, i < order.items.length - 1 && { borderBottomColor: theme.border, borderBottomWidth: 1 }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemName, { color: theme.textPrimary }]}>
                  {item.productName || item.product?.label || 'Product'}
                </Text>
                <Text style={[styles.itemQty, { color: theme.textSecondary }]}>
                  {item.quantity}x @ R{Number(item.priceAtPurchase || 0).toFixed(2)}
                </Text>
              </View>
              <Text style={[styles.itemTotal, { color: theme.primary }]}>
                R{((item.quantity || 0) * (item.priceAtPurchase || 0)).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={[styles.itemDivider, { backgroundColor: theme.border }]} />
          <View style={styles.itemRow}>
            <Text style={[styles.itemQty, { color: theme.textSecondary }]}>Shipping</Text>
            <Text style={[styles.itemQty, { color: theme.textSecondary }]}>
              R{Number(order.shippingFee || 0).toFixed(2)}
            </Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={[styles.itemName, { color: theme.textPrimary }]}>Total</Text>
            <Text style={[styles.itemTotal, { color: theme.primary }]}>
              R{Number(order.totalAmount || 0).toFixed(2)}
            </Text>
          </View>
        </SectionCard>

        {/* Delivery address */}
        <SectionCard title="Delivery Address" theme={theme} delay={380}>
          <View style={styles.addressRow}>
            <View style={[styles.addressIconBox, { backgroundColor: '#EF444418' }]}>
              <MapPin size={16} color="#EF4444" />
            </View>
            <Text style={[styles.addressText, { color: theme.textSecondary }]}>
              {order.deliveryAddress || 'No address provided'}
            </Text>
          </View>
        </SectionCard>

        <View style={{ height: 48 }} />
      </ScrollView>

      {/* ─── Modals ─── */}
      <ProfessionalModal
        visible={modalConfig.visible}
        onClose={() => setModalConfig(p => ({ ...p, visible: false }))}
        type={modalConfig.type} title={modalConfig.title}
        message={modalConfig.message} buttons={modalConfig.buttons}
      />
      <MutualRatingModal
        visible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleSubmitRatings}
        sellerName={getSellerName()} driverName={getDriverName()}
        loading={ratingLoading}
      />
      <DisputeModal
        visible={showDisputeModal}
        onClose={() => setShowDisputeModal(false)}
        onSubmit={handleSubmitDispute}
        loading={disputeLoading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 14, fontWeight: '600' },

  // ══════════ HEADER — SupportSettingsScreen style ══════════
  header: {
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  headerContent: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  headerCenter: { alignItems: 'center' },
  headerTitle: {
    fontSize: 20, fontWeight: '900', letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12, fontWeight: '700', marginTop: 2, letterSpacing: 0.5,
  },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  liveDot:   { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' },
  liveText:  { fontSize: 9, fontWeight: '900', color: '#22C55E', letterSpacing: 0.5 },

  scrollContent: { padding: 16 },

  // Hero card
  heroCard: {
    borderRadius: 26, padding: 24, marginBottom: 14,
    overflow: 'hidden', position: 'relative',
    shadowColor: '#10B981', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 18, elevation: 10,
  },
  heroOrb1: { position: 'absolute', top: -50, right: -50, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.07)' },
  heroOrb2: { position: 'absolute', bottom: -40, left: -40, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,255,255,0.04)' },
  heroContent: { flexDirection: 'row', alignItems: 'center' },
  heroEyebrow: { fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.6)', letterSpacing: 1, marginBottom: 6 },
  heroStatus:  { fontSize: 26, fontWeight: '900', color: '#fff', letterSpacing: -0.7, marginBottom: 4 },
  heroHint:    { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.7)', marginBottom: 12 },
  heroPriceRow:{ flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroPrice:   { fontSize: 20, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  heroIconRing:{
    width: 70, height: 70, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)',
  },

  // Details button
  detailsBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderRadius: 18, borderWidth: 1, marginBottom: 14,
  },
  detailsBtnIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  detailsBtnText: { flex: 1, fontSize: 15, fontWeight: '700' },

  // Alert cards
  alertCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 1,
  },
  alertIconBox: { width: 46, height: 46, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  alertTitle:   { fontSize: 15, fontWeight: '900', marginBottom: 4 },
  alertSubtitle:{ fontSize: 12, fontWeight: '600', lineHeight: 18 },

  // Action buttons
  actionRow:        { flexDirection: 'row', gap: 12, marginBottom: 14 },
  disputeBtn:       { flex: 1, borderRadius: 18, overflow: 'hidden', shadowColor: '#EF4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  completeBtn:      { flex: 1, borderRadius: 18, overflow: 'hidden', shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  actionBtnGradient:{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, gap: 8 },
  actionBtnText:    { color: '#fff', fontSize: 14, fontWeight: '900' },

  // Section card
  card: {
    borderRadius: 22, padding: 20, marginBottom: 14, borderWidth: 1,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  cardTitle:     { fontSize: 17, fontWeight: '900', letterSpacing: -0.3 },
  autoBadge:     { flexDirection: 'row', alignItems: 'center', gap: 4 },
  autoDot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  autoText:      { fontSize: 10, fontWeight: '800', letterSpacing: 0.3 },

  // Steps
  stepRow:  { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 7, gap: 14 },
  stepIcon: { width: 38, height: 38, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  stepLabel:{ fontSize: 14, paddingTop: 3, letterSpacing: -0.1 },
  stepHint: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  stepLine: { width: 2, height: 20, marginLeft: 18, marginVertical: 2, borderRadius: 1 },

  // ✅ Time pill replacing the old checkmark
  stepTimeCol: { justifyContent: 'center', alignItems: 'flex-end', minWidth: 64 },
  stepTimePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  stepTimePillEmpty: { width: 64, height: 24 },
  stepTimeText: { fontSize: 11, fontWeight: '800' },

  // Driver card
  driverRow:    { flexDirection: 'row', alignItems: 'center', gap: 14 },
  driverAvatar: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  driverName:   { fontSize: 16, fontWeight: '800', marginBottom: 2 },
  driverSub:    { fontSize: 12, fontWeight: '600' },
  enRoutePill:  { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: '#ECFDF5' },
  enRouteText:  { fontSize: 10, fontWeight: '900', color: '#059669', letterSpacing: 0.5 },

  // Items
  itemRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 10 },
  itemName:   { fontSize: 14, fontWeight: '800', marginBottom: 3 },
  itemQty:    { fontSize: 12, fontWeight: '600' },
  itemTotal:  { fontSize: 15, fontWeight: '900' },
  itemDivider:{ height: 1, marginVertical: 8 },

  // Address
  addressRow:    { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  addressIconBox:{ width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  addressText:   { flex: 1, fontSize: 15, fontWeight: '600', lineHeight: 22 },
});