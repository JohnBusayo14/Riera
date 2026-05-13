// // import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
// // import {
// //   View, Text, StyleSheet, ScrollView, TouchableOpacity,
// //   SafeAreaView, ActivityIndicator, Linking, Alert, Platform,
// //   Animated, StatusBar,
// // } from 'react-native';
// // import {
// //   MapPin, Phone, Package, ChevronLeft, Truck, User,
// //   CheckCircle, XCircle, Navigation, Info, ShoppingBag,
// //   Clock, CheckCircle2, AlertCircle,
// // } from 'lucide-react-native';
// // import { MotiView } from 'moti';
// // import { LinearGradient } from 'expo-linear-gradient';
// // import { useFocusEffect } from '@react-navigation/native';
// // import apiClient from '../services/apiClient';
// // import { useTheme } from '../context/ThemeContext';

// // // ─── Poll intervals ──────────────────────────────────────────────────────────────
// // const POLL_INTERVALS = {
// //   Assigned:   6000,
// //   Dispatched: 5000,
// //   Arrived:    4000,
// //   Completed:  null,
// //   Cancelled:  null,
// // };
// // const DEFAULT_POLL_MS = 8000;

// // // ─── Theme builder ───────────────────────────────────────────────────────────────
// // const buildTheme = (isDark) => ({
// //   bg:           isDark ? '#0B1120' : '#F0F4F8',
// //   surface:      isDark ? '#141E30' : '#FFFFFF',
// //   card:         isDark ? '#1C2A3F' : '#FFFFFF',
// //   cardElevated: isDark ? '#243347' : '#F7FAFC',
// //   border:       isDark ? '#2A3C55' : '#E2EBF4',
// //   textPrimary:  isDark ? '#F0F6FF' : '#0D1B2A',
// //   textSecondary:isDark ? '#8BA4C2' : '#4A6080',
// //   textMuted:    isDark ? '#4E6A8A' : '#8DA0B8',
// //   headerTop:    isDark ? '#0D1B2A' : '#0D2137',
// //   primary:      '#10B981',
// //   white:        '#FFFFFF',
// //   shadow:       isDark ? '#000' : '#193B5F',
// //   footer:       isDark ? '#0F1B2D' : '#FFFFFF',
// //   footerBorder: isDark ? '#1E2E45' : '#E2EBF4',
// // });

// // // ─── C# PascalCase ↔ JS camelCase helper ────────────────────────────────────────
// // const getVal = (obj, key) => {
// //   if (!obj) return null;
// //   return obj[key] !== undefined
// //     ? obj[key]
// //     : obj[key.charAt(0).toUpperCase() + key.slice(1)];
// // };

// // // ─── Section Card ────────────────────────────────────────────────────────────────
// // const SectionCard = ({ icon: Icon, iconColor, title, children, delay = 0, theme }) => (
// //   <MotiView
// //     from={{ opacity: 0, translateX: -18 }}
// //     animate={{ opacity: 1, translateX: 0 }}
// //     transition={{ type: 'spring', delay, damping: 18 }}
// //   >
// //     <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border, shadowColor: theme.shadow }]}>
// //       <View style={styles.sectionHeader}>
// //         <View style={[styles.iconCircle, { backgroundColor: iconColor + '18' }]}>
// //           <Icon size={17} color={iconColor} />
// //         </View>
// //         <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>{title}</Text>
// //       </View>
// //       {children}
// //     </View>
// //   </MotiView>
// // );

// // // ─── Main Component ──────────────────────────────────────────────────────────────
// // const DriverOrderDetails = ({ route, navigation }) => {
// //   const { orderId, offerId } = route.params;
// //   const { isDark } = useTheme();
// //   const theme = useMemo(() => buildTheme(isDark), [isDark]);

// //   const [loading,       setLoading]       = useState(true);
// //   const [order,         setOrder]         = useState(null);
// //   const [actionLoading, setActionLoading] = useState(false);
// //   const [isPolling,     setIsPolling]     = useState(false);

// //   const intervalRef = useRef(null);
// //   const pulseAnim   = useRef(new Animated.Value(1)).current;

// //   // ─── Fetch ───────────────────────────────────────────────────────────────────
// //   const fetchOrderDetails = useCallback(async (silent = false) => {
// //     if (!orderId) return;
// //     if (!silent) setLoading(true);
// //     try {
// //       const response = await apiClient.get(`/driver/order-details/${orderId}`);
// //       setOrder(response.data);
// //     } catch (error) {
// //       console.error('Fetch Details Error:', error);
// //       if (!silent) {
// //         Alert.alert('Error', 'Could not load order details.');
// //         navigation.goBack();
// //       }
// //     } finally {
// //       if (!silent) setLoading(false);
// //     }
// //   }, [orderId, navigation]);

// //   // ─── Polling ──────────────────────────────────────────────────────────────────
// //   const startPolling = useCallback((currentStatus) => {
// //     if (intervalRef.current) clearInterval(intervalRef.current);
// //     const ms = currentStatus !== undefined
// //       ? (POLL_INTERVALS[currentStatus] !== undefined ? POLL_INTERVALS[currentStatus] : DEFAULT_POLL_MS)
// //       : DEFAULT_POLL_MS;
// //     if (!ms) { setIsPolling(false); return; }
// //     setIsPolling(true);
// //     intervalRef.current = setInterval(() => fetchOrderDetails(true), ms);
// //   }, [fetchOrderDetails]);

// //   useFocusEffect(
// //     useCallback(() => {
// //       fetchOrderDetails(false);
// //       startPolling(undefined);
// //       return () => {
// //         if (intervalRef.current) clearInterval(intervalRef.current);
// //         setIsPolling(false);
// //       };
// //     }, [fetchOrderDetails, startPolling])
// //   );

// //   useEffect(() => {
// //     const status = getVal(order, 'status');
// //     if (status) startPolling(status);
// //   }, [order, startPolling]);

// //   useEffect(() => {
// //     if (!isPolling) { pulseAnim.setValue(1); return; }
// //     const loop = Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(pulseAnim, { toValue: 0.15, duration: 850, useNativeDriver: true }),
// //         Animated.timing(pulseAnim, { toValue: 1,    duration: 850, useNativeDriver: true }),
// //       ])
// //     );
// //     loop.start();
// //     return () => loop.stop();
// //   }, [isPolling, pulseAnim]);

// //   // ─── Actions ──────────────────────────────────────────────────────────────────
// //   const handleAcceptOffer = async () => {
// //     setActionLoading(true);
// //     try {
// //       await apiClient.post(`/driver/offers/${offerId}/accept`);
// //       Alert.alert('✅ Offer Accepted', 'Wait for the seller to dispatch the order.');
// //       fetchOrderDetails(false);
// //     } catch (error) {
// //       Alert.alert('Error', error.response?.data?.message || 'Failed to accept offer.');
// //     } finally {
// //       setActionLoading(false);
// //     }
// //   };

// //   const handleRejectOffer = async () => {
// //     setActionLoading(true);
// //     try {
// //       await apiClient.post(`/driver/offers/${offerId}/reject`);
// //       Alert.alert('Offer Declined', 'You have declined this delivery request.', [
// //         { text: 'OK', onPress: () => navigation.goBack() }
// //       ]);
// //     } catch (error) {
// //       Alert.alert('Error', error.response?.data?.message || 'Failed to reject offer.');
// //       setActionLoading(false);
// //     }
// //   };

// //   const handleProgressUpdate = async (newStatus) => {
// //     if (!newStatus) return;
// //     setActionLoading(true);
// //     try {
// //       await apiClient.post(`/driver/orders/${orderId}/progress`, { status: newStatus });
// //       fetchOrderDetails(false);
// //     } catch (error) {
// //       Alert.alert('Update Failed', error.response?.data?.message || 'Could not update progress.');
// //     } finally {
// //       setActionLoading(false);
// //     }
// //   };

// //   // ─── Derived data ─────────────────────────────────────────────────────────────
// //   const status    = getVal(order, 'status');
// //   const createdAt = getVal(order, 'createdAt');
// //   const logistics = getVal(order, 'logistics') || {};
// //   const delivery  = getVal(order, 'delivery')  || {};
// //   const customer  = getVal(order, 'customer')  || {};
// //   const items     = getVal(order, 'items')     || [];

// //   const driverPayout  = getVal(logistics, 'driverPayout') || getVal(logistics, 'shippingFee') || 0;
// //   const courierName   = getVal(logistics, 'courierName');
// //   const receiverName  = getVal(delivery,  'receiverName');
// //   const receiverPhone = getVal(delivery,  'receiverPhone');
// //   const address       = getVal(delivery,  'address');
// //   const customerName  = getVal(customer,  'name');

// //   const isOfferPending = ['Pending', 'Accepted', 'Confirmed'].includes(status) && !getVal(order, 'driverId');

// //   const openInMaps = (addr) => {
// //     const url = Platform.select({
// //       ios:     `maps:0,0?q=${addr}`,
// //       android: `geo:0,0?q=${addr}`,
// //     });
// //     Linking.openURL(url);
// //   };

// //   // ─── Status badge config ──────────────────────────────────────────────────────
// //   const getStatusStyle = (s) => {
// //     const map = {
// //       Dispatched: { bg: '#F59E0B25', text: '#F59E0B' },
// //       Arrived:    { bg: '#3B82F625', text: '#3B82F6' },
// //       Completed:  { bg: '#10B98125', text: '#10B981' },
// //       Cancelled:  { bg: '#EF444425', text: '#EF4444' },
// //       Assigned:   { bg: '#8B5CF625', text: '#8B5CF6' },
// //     };
// //     return map[s] || { bg: 'rgba(255,255,255,0.18)', text: '#fff' };
// //   };

// //   // ─── Loading ──────────────────────────────────────────────────────────────────
// //   if (loading) return (
// //     <View style={[styles.center, { backgroundColor: theme.bg }]}>
// //       <ActivityIndicator size="large" color={theme.primary} />
// //     </View>
// //   );

// //   if (!order) return null;

// //   const statusStyle = getStatusStyle(status);

// //   return (
// //     <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
// //       <StatusBar barStyle="light-content" />

// //       {/* ─── Header ─── */}
// //       <View style={[styles.header, { backgroundColor: theme.headerTop, borderBottomColor: theme.border }]}>
// //         <TouchableOpacity
// //           onPress={() => navigation.goBack()}
// //           style={[styles.navBtn, { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.15)' }]}
// //           activeOpacity={0.7}
// //         >
// //           <ChevronLeft color="#fff" size={22} />
// //         </TouchableOpacity>

// //         <View style={styles.headerCenter}>
// //           <Text style={styles.headerTitle}>Order Details</Text>
// //           <Text style={styles.headerRef}>#{orderId?.toString().slice(-8).toUpperCase()}</Text>
// //         </View>

// //         <View style={[styles.navBtn, {
// //           backgroundColor: 'rgba(255,255,255,0.1)',
// //           borderColor: 'rgba(255,255,255,0.15)',
// //           justifyContent: 'center', alignItems: 'center',
// //         }]}>
// //           {isPolling
// //             ? <Animated.View style={[styles.liveIndicator, { opacity: pulseAnim }]} />
// //             : <View style={styles.liveIndicatorOff} />
// //           }
// //         </View>
// //       </View>

// //       {/* ─── Scroll body ─── */}
// //       <ScrollView
// //         showsVerticalScrollIndicator={false}
// //         contentContainerStyle={[styles.scrollContent, { paddingBottom: 180 }]}
// //       >
// //         {/* Payout hero card */}
// //         <MotiView
// //           from={{ opacity: 0, scale: 0.95, translateY: 16 }}
// //           animate={{ opacity: 1, scale: 1, translateY: 0 }}
// //           transition={{ type: 'spring', damping: 16 }}
// //         >
// //           <LinearGradient
// //             colors={['#0D7A52', '#10B981']}
// //             start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
// //             style={styles.payoutCard}
// //           >
// //             {/* Decorative orbs */}
// //             <View style={styles.decorOrb1} />
// //             <View style={styles.decorOrb2} />

// //             <View style={{ flex: 1, zIndex: 1 }}>
// //               <View style={styles.payoutHeaderRow}>
// //                 <Truck size={18} color="rgba(255,255,255,0.75)" />
// //                 <Text style={styles.payoutLabel}>Your Payout</Text>
// //               </View>
// //               <View style={styles.payoutAmountRow}>
// //                 <Text style={styles.payoutCurrency}>R</Text>
// //                 <Text style={styles.payoutAmount}>{Number(driverPayout).toFixed(2)}</Text>
// //               </View>
// //               {createdAt && (
// //                 <Text style={styles.payoutDate}>
// //                   Placed {new Date(createdAt).toLocaleDateString('en-ZA', {
// //                     day: 'numeric', month: 'short', year: 'numeric',
// //                   })}
// //                 </Text>
// //               )}
// //             </View>

// //             <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
// //               <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>
// //                 {status?.toUpperCase()}
// //               </Text>
// //             </View>
// //           </LinearGradient>
// //         </MotiView>

// //         {/* Logistics / Seller */}
// //         <SectionCard icon={ShoppingBag} iconColor="#10B981" title="LOGISTICS PROVIDER" delay={80} theme={theme}>
// //           <Text style={[styles.contactName, { color: theme.textPrimary }]}>
// //             {courierName || 'Marketplace Seller'}
// //           </Text>
// //           <View style={styles.infoRow}>
// //             <Info size={13} color={theme.textMuted} />
// //             <Text style={[styles.helperText, { color: theme.textMuted }]}>
// //               Ref: #{orderId?.toString().slice(-8).toUpperCase()}
// //             </Text>
// //           </View>
// //         </SectionCard>

// //         {/* Recipient */}
// //         <SectionCard icon={User} iconColor="#3B82F6" title="RECIPIENT" delay={160} theme={theme}>
// //           <View style={styles.contactRow}>
// //             <View style={{ flex: 1 }}>
// //               <Text style={[styles.contactName, { color: theme.textPrimary }]}>
// //                 {receiverName || customerName || 'Client'}
// //               </Text>
// //               <Text style={[styles.contactPhone, { color: theme.textSecondary }]}>
// //                 {isOfferPending ? 'Phone hidden until accepted' : (receiverPhone || 'No phone provided')}
// //               </Text>
// //             </View>
// //             {!isOfferPending && receiverPhone && (
// //               <TouchableOpacity
// //                 onPress={() => Linking.openURL(`tel:${receiverPhone}`)}
// //                 style={styles.phoneBtn}
// //                 activeOpacity={0.8}
// //               >
// //                 <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.phoneBtnGradient}>
// //                   <Phone size={19} color="#fff" />
// //                 </LinearGradient>
// //               </TouchableOpacity>
// //             )}
// //           </View>
// //         </SectionCard>

// //         {/* Drop-off */}
// //         <SectionCard icon={MapPin} iconColor="#EF4444" title="DROP-OFF LOCATION" delay={240} theme={theme}>
// //           <Text style={[styles.addressText, { color: theme.textPrimary }]}>
// //             {address || 'Address unavailable'}
// //           </Text>
// //           {!isOfferPending && address && (
// //             <TouchableOpacity
// //               style={[styles.navButton, { backgroundColor: '#3B82F615', borderColor: '#3B82F630' }]}
// //               onPress={() => openInMaps(address)}
// //               activeOpacity={0.8}
// //             >
// //               <Navigation size={17} color="#3B82F6" />
// //               <Text style={[styles.navButtonText, { color: '#3B82F6' }]}>Start Navigation</Text>
// //             </TouchableOpacity>
// //           )}
// //         </SectionCard>

// //         {/* Items */}
// //         <SectionCard icon={Package} iconColor="#F59E0B" title="PARCEL CONTENTS" delay={320} theme={theme}>
// //           {items.map((item, index) => (
// //             <View
// //               key={index}
// //               style={[styles.itemRow, {
// //                 borderBottomColor: theme.border,
// //                 borderBottomWidth: index < items.length - 1 ? 1 : 0,
// //               }]}
// //             >
// //               <View style={[styles.itemQtyBadge, { backgroundColor: theme.primary + '18' }]}>
// //                 <Text style={[styles.itemQtyText, { color: theme.primary }]}>
// //                   {getVal(item, 'quantity')}
// //                 </Text>
// //               </View>
// //               <View style={{ flex: 1 }}>
// //                 <Text style={[styles.itemName, { color: theme.textPrimary }]}>
// //                   {getVal(item, 'productName')}
// //                 </Text>
// //                 <Text style={[styles.itemSub, { color: theme.textMuted }]}>
// //                   {getVal(item, 'gaugeLabel') || 'Standard Unit'}
// //                 </Text>
// //               </View>
// //               <View style={[styles.weightPill, { backgroundColor: theme.cardElevated || theme.border + '60' }]}>
// //                 <Text style={[styles.weightText, { color: theme.textSecondary }]}>
// //                   {getVal(item, 'weight') || '0'}kg
// //                 </Text>
// //               </View>
// //             </View>
// //           ))}
// //         </SectionCard>
// //       </ScrollView>

// //       {/* ─── Footer actions ─── */}
// //       <View style={[styles.footer, { backgroundColor: theme.footer, borderTopColor: theme.footerBorder }]}>

// //         {isOfferPending ? (
// //           <View style={styles.dualBtnRow}>
// //             {/* Reject */}
// //             <TouchableOpacity
// //               style={[styles.actionBtn, actionLoading && { opacity: 0.6 }]}
// //               onPress={handleRejectOffer}
// //               disabled={actionLoading}
// //               activeOpacity={0.85}
// //             >
// //               <View style={[styles.actionBtnInner, { backgroundColor: '#EF444415', borderColor: '#EF444440', borderWidth: 1.5 }]}>
// //                 <XCircle color="#EF4444" size={20} />
// //                 <Text style={[styles.btnText, { color: '#EF4444' }]}>Decline</Text>
// //               </View>
// //             </TouchableOpacity>

// //             {/* Accept */}
// //             <TouchableOpacity
// //               style={[styles.actionBtn, actionLoading && { opacity: 0.6 }]}
// //               onPress={handleAcceptOffer}
// //               disabled={actionLoading}
// //               activeOpacity={0.85}
// //             >
// //               <LinearGradient
// //                 colors={['#10B981', '#059669']}
// //                 start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
// //                 style={styles.actionBtnInner}
// //               >
// //                 {actionLoading
// //                   ? <ActivityIndicator color="#fff" size="small" />
// //                   : <><CheckCircle color="#fff" size={20} /><Text style={[styles.btnText, { color: '#fff' }]}>Accept</Text></>
// //                 }
// //               </LinearGradient>
// //             </TouchableOpacity>
// //           </View>

// //         ) : status === 'Assigned' ? (
// //           <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }}>
// //             <View style={[styles.waitingCard, { backgroundColor: '#F59E0B12', borderColor: '#F59E0B35' }]}>
// //               <View style={[styles.waitingIconBox, { backgroundColor: '#F59E0B20' }]}>
// //                 <MotiView
// //                   from={{ rotate: '0deg' }} animate={{ rotate: '360deg' }}
// //                   transition={{ loop: true, type: 'timing', duration: 2200 }}
// //                 >
// //                   <Clock size={28} color="#F59E0B" />
// //                 </MotiView>
// //               </View>
// //               <View style={{ flex: 1 }}>
// //                 <Text style={[styles.waitingTitle, { color: theme.textPrimary }]}>Waiting for Seller</Text>
// //                 <Text style={[styles.waitingText, { color: theme.textSecondary }]}>
// //                   The seller needs to dispatch before you can start.
// //                 </Text>
// //               </View>
// //             </View>
// //           </MotiView>

// //         ) : status === 'Arrived' ? (
// //           <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }}>
// //             <View style={[styles.waitingCard, { backgroundColor: '#3B82F612', borderColor: '#3B82F635' }]}>
// //               <View style={[styles.waitingIconBox, { backgroundColor: '#3B82F620' }]}>
// //                 <MotiView
// //                   from={{ rotate: '0deg' }} animate={{ rotate: '360deg' }}
// //                   transition={{ loop: true, type: 'timing', duration: 2200 }}
// //                 >
// //                   <Clock size={28} color="#3B82F6" />
// //                 </MotiView>
// //               </View>
// //               <View style={{ flex: 1 }}>
// //                 <Text style={[styles.waitingTitle, { color: theme.textPrimary }]}>Waiting for Buyer</Text>
// //                 <Text style={[styles.waitingText, { color: theme.textSecondary }]}>
// //                   Buyer must confirm receipt to complete this delivery.
// //                 </Text>
// //               </View>
// //             </View>
// //           </MotiView>

// //         ) : status === 'Completed' ? (
// //           <View style={[styles.completedCard, { backgroundColor: '#10B98112', borderColor: '#10B98130' }]}>
// //             <CheckCircle2 size={44} color="#10B981" />
// //             <Text style={[styles.completedTitle, { color: theme.textPrimary }]}>Delivery Complete 🎉</Text>
// //             <Text style={[styles.completedSub, { color: theme.textSecondary }]}>
// //               Your payout will be processed shortly.
// //             </Text>
// //           </View>

// //         ) : status === 'Dispatched' ? (
// //           <TouchableOpacity
// //             style={[styles.fullBtn, actionLoading && { opacity: 0.75 }]}
// //             onPress={() => handleProgressUpdate('Arrived')}
// //             disabled={actionLoading}
// //             activeOpacity={0.88}
// //           >
// //             <LinearGradient
// //               colors={['#F59E0B', '#D97706']}
// //               start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
// //               style={styles.fullBtnInner}
// //             >
// //               {actionLoading
// //                 ? <ActivityIndicator color="#fff" size="small" />
// //                 : <>
// //                     <Navigation size={21} color="#fff" />
// //                     <Text style={styles.fullBtnText}>Mark as Arrived</Text>
// //                   </>
// //               }
// //             </LinearGradient>
// //           </TouchableOpacity>

// //         ) : null}
// //       </View>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: { flex: 1 },
// //   center:    { flex: 1, justifyContent: 'center', alignItems: 'center' },

// //   // Header
// //   header: {
// //     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
// //     paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1,
// //   },
// //   headerCenter: { alignItems: 'center' },
// //   headerTitle:  { fontSize: 17, fontWeight: '900', color: '#fff', letterSpacing: -0.4 },
// //   headerRef:    { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.55)', marginTop: 2, letterSpacing: 0.5 },
// //   navBtn: {
// //     width: 42, height: 42, borderRadius: 13,
// //     justifyContent: 'center', alignItems: 'center', borderWidth: 1,
// //   },
// //   liveIndicator:    { width: 10, height: 10, borderRadius: 5, backgroundColor: '#22C55E' },
// //   liveIndicatorOff: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'transparent' },

// //   scrollContent: { padding: 16 },

// //   // Payout hero
// //   payoutCard: {
// //     borderRadius: 26, padding: 24, marginBottom: 16,
// //     flexDirection: 'row', alignItems: 'center',
// //     overflow: 'hidden', position: 'relative',
// //     shadowColor: '#10B981', shadowOffset: { width: 0, height: 8 },
// //     shadowOpacity: 0.35, shadowRadius: 18, elevation: 10,
// //   },
// //   decorOrb1: { position: 'absolute', top: -50, right: -50, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(255,255,255,0.08)' },
// //   decorOrb2: { position: 'absolute', bottom: -40, left: -40, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,255,255,0.05)' },
// //   payoutHeaderRow:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
// //   payoutLabel:      { color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: '700' },
// //   payoutAmountRow:  { flexDirection: 'row', alignItems: 'baseline', gap: 2, marginBottom: 6 },
// //   payoutCurrency:   { color: 'rgba(255,255,255,0.8)', fontSize: 18, fontWeight: '700' },
// //   payoutAmount:     { color: '#fff', fontSize: 34, fontWeight: '900', letterSpacing: -1 },
// //   payoutDate:       { color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: '600' },
// //   statusBadge:      { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14 },
// //   statusBadgeText:  { fontWeight: '900', fontSize: 11, letterSpacing: 0.5 },

// //   // Section Card
// //   section: {
// //     borderRadius: 22, padding: 20, marginBottom: 14, borderWidth: 1,
// //     shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
// //   },
// //   sectionHeader:{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
// //   iconCircle:   { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
// //   sectionTitle: { fontSize: 11, fontWeight: '900', letterSpacing: 0.8 },

// //   // Contact
// //   contactRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
// //   contactName:  { fontSize: 17, fontWeight: '800', marginBottom: 4 },
// //   contactPhone: { fontSize: 14, fontWeight: '600' },
// //   phoneBtn:     { width: 50, height: 50, borderRadius: 16, overflow: 'hidden' },
// //   phoneBtnGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },

// //   infoRow:    { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
// //   helperText: { fontSize: 13, fontWeight: '600' },

// //   // Address
// //   addressText: { fontSize: 15, fontWeight: '600', lineHeight: 22, marginBottom: 14 },
// //   navButton:   {
// //     flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
// //     gap: 8, paddingVertical: 12, borderRadius: 14, borderWidth: 1,
// //   },
// //   navButtonText: { fontWeight: '800', fontSize: 14 },

// //   // Items
// //   itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
// //   itemQtyBadge: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
// //   itemQtyText:  { fontSize: 14, fontWeight: '900' },
// //   itemName:     { fontSize: 15, fontWeight: '700', marginBottom: 2 },
// //   itemSub:      { fontSize: 12, fontWeight: '600' },
// //   weightPill:   { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
// //   weightText:   { fontSize: 12, fontWeight: '800' },

// //   // Footer
// //   footer: {
// //     padding: 16, paddingBottom: Platform.OS === 'ios' ? 36 : 20,
// //     borderTopWidth: 1,
// //     position: 'absolute', bottom: 0, left: 0, right: 0,
// //     shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
// //     shadowOpacity: 0.12, shadowRadius: 12, elevation: 10,
// //   },
// //   dualBtnRow: { flexDirection: 'row', gap: 12 },
// //   actionBtn:  { flex: 1, borderRadius: 16, overflow: 'hidden' },
// //   actionBtnInner: {
// //     height: 56, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
// //     borderRadius: 16,
// //   },
// //   btnText: { fontSize: 15, fontWeight: '900' },
// //   fullBtn: {
// //     borderRadius: 16, overflow: 'hidden',
// //     shadowColor: '#F59E0B', shadowOffset: { width: 0, height: 6 },
// //     shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
// //   },
// //   fullBtnInner: { height: 56, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10 },
// //   fullBtnText:  { color: '#fff', fontSize: 16, fontWeight: '900' },

// //   // Waiting cards
// //   waitingCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 18, borderWidth: 1.5, gap: 14 },
// //   waitingIconBox: { width: 54, height: 54, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
// //   waitingTitle: { fontSize: 15, fontWeight: '900', marginBottom: 4 },
// //   waitingText:  { fontSize: 13, fontWeight: '500', lineHeight: 18 },

// //   // Completed
// //   completedCard: { alignItems: 'center', padding: 20, borderRadius: 18, borderWidth: 1.5, gap: 8 },
// //   completedTitle: { fontSize: 18, fontWeight: '900' },
// //   completedSub:   { fontSize: 13, fontWeight: '500', textAlign: 'center' },
// // });

// // export default DriverOrderDetails;










// import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
// import {
//   View, Text, StyleSheet, ScrollView, TouchableOpacity,
//   SafeAreaView, ActivityIndicator, Linking, Alert, Platform,
//   Animated, StatusBar,
// } from 'react-native';
// import {
//   MapPin, Phone, Package, ChevronLeft, Truck, User,
//   CheckCircle, XCircle, Navigation, Info, ShoppingBag,
//   Clock, CheckCircle2, AlertCircle,
// } from 'lucide-react-native';
// import { MotiView } from 'moti';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useFocusEffect } from '@react-navigation/native';
// import apiClient from '../services/apiClient';
// import { useTheme } from '../context/ThemeContext';

// // ─── Poll intervals ──────────────────────────────────────────────────────────────
// const POLL_INTERVALS = {
//   Assigned:   6000,
//   Dispatched: 5000,
//   Arrived:    4000,
//   Completed:  null,
//   Cancelled:  null,
// };
// const DEFAULT_POLL_MS = 8000;

// // ─── Theme builder ───────────────────────────────────────────────────────────────
// const buildTheme = (isDark) => ({
//   bg:           isDark ? '#0B1120' : '#F0F4F8',
//   surface:      isDark ? '#141E30' : '#FFFFFF',
//   card:         isDark ? '#1C2A3F' : '#FFFFFF',
//   cardElevated: isDark ? '#243347' : '#F7FAFC',
//   border:       isDark ? '#2A3C55' : '#E2EBF4',
//   textPrimary:  isDark ? '#F0F6FF' : '#0D1B2A',
//   textSecondary:isDark ? '#8BA4C2' : '#4A6080',
//   textMuted:    isDark ? '#4E6A8A' : '#8DA0B8',
//   headerTop:    isDark ? '#0D1B2A' : '#0D2137',
//   primary:      '#10B981',
//   white:        '#FFFFFF',
//   shadow:       isDark ? '#000' : '#193B5F',
//   footer:       isDark ? '#0F1B2D' : '#FFFFFF',
//   footerBorder: isDark ? '#1E2E45' : '#E2EBF4',
// });

// // ─── C# PascalCase ↔ JS camelCase helper ────────────────────────────────────────
// const getVal = (obj, key) => {
//   if (!obj) return null;
//   return obj[key] !== undefined
//     ? obj[key]
//     : obj[key.charAt(0).toUpperCase() + key.slice(1)];
// };

// // ─── Info Row inside the combined card ──────────────────────────────────────────
// const InfoSection = ({ icon: Icon, iconColor, title, children }) => (
//   <View style={styles.infoSection}>
//     <View style={styles.infoSectionHeader}>
//       <View style={[styles.iconCircle, { backgroundColor: iconColor + '18' }]}>
//         <Icon size={17} color={iconColor} />
//       </View>
//       <Text style={styles.infoSectionTitle}>{title}</Text>
//     </View>
//     {children}
//   </View>
// );

// // ─── Main Component ──────────────────────────────────────────────────────────────
// const DriverOrderDetails = ({ route, navigation }) => {
//   const { orderId, offerId } = route.params;
//   const { isDark } = useTheme();
//   const theme = useMemo(() => buildTheme(isDark), [isDark]);

//   const [loading,       setLoading]       = useState(true);
//   const [order,         setOrder]         = useState(null);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [isPolling,     setIsPolling]     = useState(false);

//   const intervalRef = useRef(null);
//   const pulseAnim   = useRef(new Animated.Value(1)).current;

//   // ─── Fetch ───────────────────────────────────────────────────────────────────
//   const fetchOrderDetails = useCallback(async (silent = false) => {
//     if (!orderId) return;
//     if (!silent) setLoading(true);
//     try {
//       const response = await apiClient.get(`/driver/order-details/${orderId}`);
//       setOrder(response.data);
//     } catch (error) {
//       console.error('Fetch Details Error:', error);
//       if (!silent) {
//         Alert.alert('Error', 'Could not load order details.');
//         navigation.goBack();
//       }
//     } finally {
//       if (!silent) setLoading(false);
//     }
//   }, [orderId, navigation]);

//   // ─── Polling ──────────────────────────────────────────────────────────────────
//   const startPolling = useCallback((currentStatus) => {
//     if (intervalRef.current) clearInterval(intervalRef.current);
//     const ms = currentStatus !== undefined
//       ? (POLL_INTERVALS[currentStatus] !== undefined ? POLL_INTERVALS[currentStatus] : DEFAULT_POLL_MS)
//       : DEFAULT_POLL_MS;
//     if (!ms) { setIsPolling(false); return; }
//     setIsPolling(true);
//     intervalRef.current = setInterval(() => fetchOrderDetails(true), ms);
//   }, [fetchOrderDetails]);

//   useFocusEffect(
//     useCallback(() => {
//       fetchOrderDetails(false);
//       startPolling(undefined);
//       return () => {
//         if (intervalRef.current) clearInterval(intervalRef.current);
//         setIsPolling(false);
//       };
//     }, [fetchOrderDetails, startPolling])
//   );

//   useEffect(() => {
//     const status = getVal(order, 'status');
//     if (status) startPolling(status);
//   }, [order, startPolling]);

//   useEffect(() => {
//     if (!isPolling) { pulseAnim.setValue(1); return; }
//     const loop = Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, { toValue: 0.15, duration: 850, useNativeDriver: true }),
//         Animated.timing(pulseAnim, { toValue: 1,    duration: 850, useNativeDriver: true }),
//       ])
//     );
//     loop.start();
//     return () => loop.stop();
//   }, [isPolling, pulseAnim]);

//   // ─── Actions ──────────────────────────────────────────────────────────────────
//   const handleAcceptOffer = async () => {
//     setActionLoading(true);
//     try {
//       await apiClient.post(`/driver/offers/${offerId}/accept`);
//       Alert.alert('✅ Offer Accepted', 'Wait for the seller to dispatch the order.');
//       fetchOrderDetails(false);
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.message || 'Failed to accept offer.');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleRejectOffer = async () => {
//     setActionLoading(true);
//     try {
//       await apiClient.post(`/driver/offers/${offerId}/reject`);
//       Alert.alert('Offer Declined', 'You have declined this delivery request.', [
//         { text: 'OK', onPress: () => navigation.goBack() }
//       ]);
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.message || 'Failed to reject offer.');
//       setActionLoading(false);
//     }
//   };

//   const handleProgressUpdate = async (newStatus) => {
//     if (!newStatus) return;
//     setActionLoading(true);
//     try {
//       await apiClient.post(`/driver/orders/${orderId}/progress`, { status: newStatus });
//       fetchOrderDetails(false);
//     } catch (error) {
//       Alert.alert('Update Failed', error.response?.data?.message || 'Could not update progress.');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // ─── Derived data ─────────────────────────────────────────────────────────────
//   const status    = getVal(order, 'status');
//   const createdAt = getVal(order, 'createdAt');
//   const logistics = getVal(order, 'logistics') || {};
//   const delivery  = getVal(order, 'delivery')  || {};
//   const customer  = getVal(order, 'customer')  || {};
//   const items     = getVal(order, 'items')     || [];

//   const driverPayout  = getVal(logistics, 'driverPayout') || getVal(logistics, 'shippingFee') || 0;
//   const courierName   = getVal(logistics, 'courierName');
//   const receiverName  = getVal(delivery,  'receiverName');
//   const receiverPhone = getVal(delivery,  'receiverPhone');
//   const address       = getVal(delivery,  'address');
//   const customerName  = getVal(customer,  'name');

//   const isOfferPending = ['Pending', 'Accepted', 'Confirmed'].includes(status) && !getVal(order, 'driverId');

//   const openInMaps = (addr) => {
//     const url = Platform.select({
//       ios:     `maps:0,0?q=${addr}`,
//       android: `geo:0,0?q=${addr}`,
//     });
//     Linking.openURL(url);
//   };

//   // ─── Status badge config ──────────────────────────────────────────────────────
//   const getStatusStyle = (s) => {
//     const map = {
//       Dispatched: { bg: '#F59E0B25', text: '#F59E0B' },
//       Arrived:    { bg: '#3B82F625', text: '#3B82F6' },
//       Completed:  { bg: '#10B98125', text: '#10B981' },
//       Cancelled:  { bg: '#EF444425', text: '#EF4444' },
//       Assigned:   { bg: '#8B5CF625', text: '#8B5CF6' },
//     };
//     return map[s] || { bg: 'rgba(255,255,255,0.18)', text: '#fff' };
//   };

//   // ─── Loading ──────────────────────────────────────────────────────────────────
//   if (loading) return (
//     <View style={[styles.center, { backgroundColor: theme.bg }]}>
//       <ActivityIndicator size="large" color={theme.primary} />
//     </View>
//   );

//   if (!order) return null;

//   const statusStyle = getStatusStyle(status);

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
//       <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

//       {/* ─── Header — white background ─── */}
//       <View style={[styles.header, { backgroundColor: '#FFFFFF', borderBottomColor: theme.border }]}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={[styles.navBtn, { backgroundColor: '#F0F4F8', borderColor: theme.border }]}
//           activeOpacity={0.7}
//         >
//           <ChevronLeft color={theme.textPrimary} size={22} />
//         </TouchableOpacity>

//         <View style={styles.headerCenter}>
//           <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Order Details</Text>
//           <Text style={[styles.headerRef, { color: theme.textMuted }]}>
//             #{orderId?.toString().slice(-8).toUpperCase()}
//           </Text>
//         </View>

//         <View style={[styles.navBtn, {
//           backgroundColor: '#F0F4F8',
//           borderColor: theme.border,
//           justifyContent: 'center', alignItems: 'center',
//         }]}>
//           {isPolling
//             ? <Animated.View style={[styles.liveIndicator, { opacity: pulseAnim }]} />
//             : <View style={styles.liveIndicatorOff} />
//           }
//         </View>
//       </View>

//       {/* ─── Scroll body ─── */}
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={[styles.scrollContent, { paddingBottom: 180 }]}
//       >
//         {/* ── Payout hero card — standalone, unchanged ── */}
//         <MotiView
//           from={{ opacity: 0, scale: 0.95, translateY: 16 }}
//           animate={{ opacity: 1, scale: 1, translateY: 0 }}
//           transition={{ type: 'spring', damping: 16 }}
//         >
//           <LinearGradient
//             colors={['#0D7A52', '#10B981']}
//             start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
//             style={styles.payoutCard}
//           >
//             <View style={styles.decorOrb1} />
//             <View style={styles.decorOrb2} />

//             <View style={{ flex: 1, zIndex: 1 }}>
//               <View style={styles.payoutHeaderRow}>
//                 <Truck size={18} color="rgba(255,255,255,0.75)" />
//                 <Text style={styles.payoutLabel}>Your Payout</Text>
//               </View>
//               <View style={styles.payoutAmountRow}>
//                 <Text style={styles.payoutCurrency}>R</Text>
//                 <Text style={styles.payoutAmount}>{Number(driverPayout).toFixed(2)}</Text>
//               </View>
//               {createdAt && (
//                 <Text style={styles.payoutDate}>
//                   Placed {new Date(createdAt).toLocaleDateString('en-ZA', {
//                     day: 'numeric', month: 'short', year: 'numeric',
//                   })}
//                 </Text>
//               )}
//             </View>

//             <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
//               <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>
//                 {status?.toUpperCase()}
//               </Text>
//             </View>
//           </LinearGradient>
//         </MotiView>

//         {/* ── Combined card: Logistics + Recipient + Drop-off + Items ── */}
//         <MotiView
//           from={{ opacity: 0, translateY: 18 }}
//           animate={{ opacity: 1, translateY: 0 }}
//           transition={{ type: 'spring', delay: 80, damping: 18 }}
//         >
//           <View style={[styles.combinedCard, { backgroundColor: theme.card, borderColor: theme.border }]}>

//             {/* Logistics / Seller */}
//             <InfoSection icon={ShoppingBag} iconColor="#10B981" title="LOGISTICS PROVIDER">
//               <Text style={[styles.contactName, { color: theme.textPrimary }]}>
//                 {courierName || 'Marketplace Seller'}
//               </Text>
//               <View style={styles.infoRow}>
//                 <Info size={13} color={theme.textMuted} />
//                 <Text style={[styles.helperText, { color: theme.textMuted }]}>
//                   Ref: #{orderId?.toString().slice(-8).toUpperCase()}
//                 </Text>
//               </View>
//             </InfoSection>

//             <View style={[styles.divider, { backgroundColor: theme.border }]} />

//             {/* Recipient */}
//             <InfoSection icon={User} iconColor="#3B82F6" title="RECIPIENT">
//               <View style={styles.contactRow}>
//                 <View style={{ flex: 1 }}>
//                   <Text style={[styles.contactName, { color: theme.textPrimary }]}>
//                     {receiverName || customerName || 'Client'}
//                   </Text>
//                   <Text style={[styles.contactPhone, { color: theme.textSecondary }]}>
//                     {isOfferPending ? 'Phone hidden until accepted' : (receiverPhone || 'No phone provided')}
//                   </Text>
//                 </View>
//                 {!isOfferPending && receiverPhone && (
//                   <TouchableOpacity
//                     onPress={() => Linking.openURL(`tel:${receiverPhone}`)}
//                     style={styles.phoneBtn}
//                     activeOpacity={0.8}
//                   >
//                     <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.phoneBtnGradient}>
//                       <Phone size={19} color="#fff" />
//                     </LinearGradient>
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </InfoSection>

//             <View style={[styles.divider, { backgroundColor: theme.border }]} />

//             {/* Drop-off */}
//             <InfoSection icon={MapPin} iconColor="#EF4444" title="DROP-OFF LOCATION">
//               <Text style={[styles.addressText, { color: theme.textPrimary }]}>
//                 {address || 'Address unavailable'}
//               </Text>
//               {!isOfferPending && address && (
//                 <TouchableOpacity
//                   style={[styles.navButton, { backgroundColor: '#3B82F615', borderColor: '#3B82F630' }]}
//                   onPress={() => openInMaps(address)}
//                   activeOpacity={0.8}
//                 >
//                   <Navigation size={17} color="#3B82F6" />
//                   <Text style={[styles.navButtonText, { color: '#3B82F6' }]}>Start Navigation</Text>
//                 </TouchableOpacity>
//               )}
//             </InfoSection>

//             <View style={[styles.divider, { backgroundColor: theme.border }]} />

//             {/* Items */}
//             <InfoSection icon={Package} iconColor="#F59E0B" title="PARCEL CONTENTS">
//               {items.map((item, index) => (
//                 <View
//                   key={index}
//                   style={[styles.itemRow, {
//                     borderBottomColor: theme.border,
//                     borderBottomWidth: index < items.length - 1 ? 1 : 0,
//                   }]}
//                 >
//                   <View style={[styles.itemQtyBadge, { backgroundColor: theme.primary + '18' }]}>
//                     <Text style={[styles.itemQtyText, { color: theme.primary }]}>
//                       {getVal(item, 'quantity')}
//                     </Text>
//                   </View>
//                   <View style={{ flex: 1 }}>
//                     <Text style={[styles.itemName, { color: theme.textPrimary }]}>
//                       {getVal(item, 'productName')}
//                     </Text>
//                     <Text style={[styles.itemSub, { color: theme.textMuted }]}>
//                       {getVal(item, 'gaugeLabel') || 'Standard Unit'}
//                     </Text>
//                   </View>
//                   <View style={[styles.weightPill, { backgroundColor: theme.cardElevated || theme.border + '60' }]}>
//                     <Text style={[styles.weightText, { color: theme.textSecondary }]}>
//                       {getVal(item, 'weight') || '0'}kg
//                     </Text>
//                   </View>
//                 </View>
//               ))}
//             </InfoSection>

//           </View>
//         </MotiView>
//       </ScrollView>

//       {/* ─── Footer actions ─── */}
//       <View style={[styles.footer, { backgroundColor: theme.footer, borderTopColor: theme.footerBorder }]}>

//         {isOfferPending ? (
//           <View style={styles.dualBtnRow}>
//             <TouchableOpacity
//               style={[styles.actionBtn, actionLoading && { opacity: 0.6 }]}
//               onPress={handleRejectOffer}
//               disabled={actionLoading}
//               activeOpacity={0.85}
//             >
//               <View style={[styles.actionBtnInner, { backgroundColor: '#EF444415', borderColor: '#EF444440', borderWidth: 1.5 }]}>
//                 <XCircle color="#EF4444" size={20} />
//                 <Text style={[styles.btnText, { color: '#EF4444' }]}>Decline</Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.actionBtn, actionLoading && { opacity: 0.6 }]}
//               onPress={handleAcceptOffer}
//               disabled={actionLoading}
//               activeOpacity={0.85}
//             >
//               <LinearGradient
//                 colors={['#10B981', '#059669']}
//                 start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
//                 style={styles.actionBtnInner}
//               >
//                 {actionLoading
//                   ? <ActivityIndicator color="#fff" size="small" />
//                   : <><CheckCircle color="#fff" size={20} /><Text style={[styles.btnText, { color: '#fff' }]}>Accept</Text></>
//                 }
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>

//         ) : status === 'Assigned' ? (
//           <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }}>
//             <View style={[styles.waitingCard, { backgroundColor: '#F59E0B12', borderColor: '#F59E0B35' }]}>
//               <View style={[styles.waitingIconBox, { backgroundColor: '#F59E0B20' }]}>
//                 <MotiView
//                   from={{ rotate: '0deg' }} animate={{ rotate: '360deg' }}
//                   transition={{ loop: true, type: 'timing', duration: 2200 }}
//                 >
//                   <Clock size={28} color="#F59E0B" />
//                 </MotiView>
//               </View>
//               <View style={{ flex: 1 }}>
//                 <Text style={[styles.waitingTitle, { color: theme.textPrimary }]}>Waiting for Seller</Text>
//                 <Text style={[styles.waitingText, { color: theme.textSecondary }]}>
//                   The seller needs to dispatch before you can start.
//                 </Text>
//               </View>
//             </View>
//           </MotiView>

//         ) : status === 'Arrived' ? (
//           <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }}>
//             <View style={[styles.waitingCard, { backgroundColor: '#3B82F612', borderColor: '#3B82F635' }]}>
//               <View style={[styles.waitingIconBox, { backgroundColor: '#3B82F620' }]}>
//                 <MotiView
//                   from={{ rotate: '0deg' }} animate={{ rotate: '360deg' }}
//                   transition={{ loop: true, type: 'timing', duration: 2200 }}
//                 >
//                   <Clock size={28} color="#3B82F6" />
//                 </MotiView>
//               </View>
//               <View style={{ flex: 1 }}>
//                 <Text style={[styles.waitingTitle, { color: theme.textPrimary }]}>Waiting for Buyer</Text>
//                 <Text style={[styles.waitingText, { color: theme.textSecondary }]}>
//                   Buyer must confirm receipt to complete this delivery.
//                 </Text>
//               </View>
//             </View>
//           </MotiView>

//         ) : status === 'Completed' ? (
//           <View style={[styles.completedCard, { backgroundColor: '#10B98112', borderColor: '#10B98130' }]}>
//             <CheckCircle2 size={44} color="#10B981" />
//             <Text style={[styles.completedTitle, { color: theme.textPrimary }]}>Delivery Complete 🎉</Text>
//             <Text style={[styles.completedSub, { color: theme.textSecondary }]}>
//               Your payout will be processed shortly.
//             </Text>
//           </View>

//         ) : status === 'Dispatched' ? (
//           <TouchableOpacity
//             style={[styles.fullBtn, actionLoading && { opacity: 0.75 }]}
//             onPress={() => handleProgressUpdate('Arrived')}
//             disabled={actionLoading}
//             activeOpacity={0.88}
//           >
//             <LinearGradient
//               colors={['#F59E0B', '#D97706']}
//               start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
//               style={styles.fullBtnInner}
//             >
//               {actionLoading
//                 ? <ActivityIndicator color="#fff" size="small" />
//                 : <>
//                     <Navigation size={21} color="#fff" />
//                     <Text style={styles.fullBtnText}>Mark as Arrived</Text>
//                   </>
//               }
//             </LinearGradient>
//           </TouchableOpacity>

//         ) : null}
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   center:    { flex: 1, justifyContent: 'center', alignItems: 'center' },

//   // Header — white
//   header: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//     paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1,
//   },
//   headerCenter: { alignItems: 'center' },
//   headerTitle:  { fontSize: 17, fontWeight: '900', letterSpacing: -0.4 },
//   headerRef:    { fontSize: 11, fontWeight: '700', marginTop: 2, letterSpacing: 0.5 },
//   navBtn: {
//     width: 42, height: 42, borderRadius: 13,
//     justifyContent: 'center', alignItems: 'center', borderWidth: 1,
//   },
//   liveIndicator:    { width: 10, height: 10, borderRadius: 5, backgroundColor: '#22C55E' },
//   liveIndicatorOff: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'transparent' },

//   scrollContent: { padding: 16 },

//   // Payout hero — unchanged
//   payoutCard: {
//     borderRadius: 26, padding: 24, marginBottom: 16,
//     flexDirection: 'row', alignItems: 'center',
//     overflow: 'hidden', position: 'relative',
//   },
//   decorOrb1: { position: 'absolute', top: -50, right: -50, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(255,255,255,0.08)' },
//   decorOrb2: { position: 'absolute', bottom: -40, left: -40, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,255,255,0.05)' },
//   payoutHeaderRow:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
//   payoutLabel:      { color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: '700' },
//   payoutAmountRow:  { flexDirection: 'row', alignItems: 'baseline', gap: 2, marginBottom: 6 },
//   payoutCurrency:   { color: 'rgba(255,255,255,0.8)', fontSize: 18, fontWeight: '700' },
//   payoutAmount:     { color: '#fff', fontSize: 34, fontWeight: '900', letterSpacing: -1 },
//   payoutDate:       { color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: '600' },
//   statusBadge:      { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14 },
//   statusBadgeText:  { fontWeight: '900', fontSize: 11, letterSpacing: 0.5 },

//   // Combined card
//   combinedCard: {
//     borderRadius: 22, borderWidth: 1, overflow: 'hidden', marginBottom: 14,
//   },

//   // Info section (rows inside the combined card)
//   infoSection:       { padding: 20 },
//   infoSectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
//   iconCircle:        { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
//   infoSectionTitle:  { fontSize: 11, fontWeight: '900', letterSpacing: 0.8, color: '#8DA0B8' },

//   // Divider between sections inside the card
//   divider: { height: 1, marginHorizontal: 0 },

//   // Contact
//   contactRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   contactName:  { fontSize: 17, fontWeight: '800', marginBottom: 4 },
//   contactPhone: { fontSize: 14, fontWeight: '600' },
//   phoneBtn:     { width: 50, height: 50, borderRadius: 16, overflow: 'hidden' },
//   phoneBtnGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },

//   infoRow:    { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
//   helperText: { fontSize: 13, fontWeight: '600' },

//   // Address
//   addressText: { fontSize: 15, fontWeight: '600', lineHeight: 22, marginBottom: 14 },
//   navButton:   {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
//     gap: 8, paddingVertical: 12, borderRadius: 14, borderWidth: 1,
//   },
//   navButtonText: { fontWeight: '800', fontSize: 14 },

//   // Items
//   itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
//   itemQtyBadge: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
//   itemQtyText:  { fontSize: 14, fontWeight: '900' },
//   itemName:     { fontSize: 15, fontWeight: '700', marginBottom: 2 },
//   itemSub:      { fontSize: 12, fontWeight: '600' },
//   weightPill:   { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
//   weightText:   { fontSize: 12, fontWeight: '800' },

//   // Footer
//   footer: {
//     padding: 16, paddingBottom: Platform.OS === 'ios' ? 36 : 20,
//     borderTopWidth: 1,
//     position: 'absolute', bottom: 0, left: 0, right: 0,
//   },
//   dualBtnRow: { flexDirection: 'row', gap: 12 },
//   actionBtn:  { flex: 1, borderRadius: 16, overflow: 'hidden' },
//   actionBtnInner: {
//     height: 56, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
//     borderRadius: 16,
//   },
//   btnText: { fontSize: 15, fontWeight: '900' },
//   fullBtn: { borderRadius: 16, overflow: 'hidden' },
//   fullBtnInner: { height: 56, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10 },
//   fullBtnText:  { color: '#fff', fontSize: 16, fontWeight: '900' },

//   // Waiting cards
//   waitingCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 18, borderWidth: 1.5, gap: 14 },
//   waitingIconBox: { width: 54, height: 54, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
//   waitingTitle: { fontSize: 15, fontWeight: '900', marginBottom: 4 },
//   waitingText:  { fontSize: 13, fontWeight: '500', lineHeight: 18 },

//   // Completed
//   completedCard: { alignItems: 'center', padding: 20, borderRadius: 18, borderWidth: 1.5, gap: 8 },
//   completedTitle: { fontSize: 18, fontWeight: '900' },
//   completedSub:   { fontSize: 13, fontWeight: '500', textAlign: 'center' },
// });

// export default DriverOrderDetails;














import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Linking, Alert, Platform,
  Animated, StatusBar,
} from 'react-native';
import {
  MapPin, Phone, Package, ChevronLeft, Truck, User,
  CheckCircle, XCircle, Navigation, Info, ShoppingBag,
  Clock, CheckCircle2, AlertCircle,
} from 'lucide-react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../services/apiClient';
import { useTheme } from '../context/ThemeContext';

// ─── Poll intervals ──────────────────────────────────────────────────────────────
const POLL_INTERVALS = {
  Assigned:   6000,
  Dispatched: 5000,
  Arrived:    4000,
  Completed:  null,
  Cancelled:  null,
};
const DEFAULT_POLL_MS = 8000;

// ─── Theme builder ───────────────────────────────────────────────────────────────
const buildTheme = (isDark) => ({
  bg:           isDark ? '#0B1120' : '#F0F4F8',
  surface:      isDark ? '#141E30' : '#FFFFFF',
  card:         isDark ? '#1C2A3F' : '#FFFFFF',
  cardElevated: isDark ? '#243347' : '#F7FAFC',
  border:       isDark ? '#2A3C55' : '#E2EBF4',
  textPrimary:  isDark ? '#F0F6FF' : '#0D1B2A',
  textSecondary:isDark ? '#8BA4C2' : '#4A6080',
  textMuted:    isDark ? '#4E6A8A' : '#8DA0B8',
  headerTop:    isDark ? '#0D1B2A' : '#0D2137',
  primary:      '#10B981',
  white:        '#FFFFFF',
  shadow:       isDark ? '#000' : '#193B5F',
  footer:       isDark ? '#0F1B2D' : '#FFFFFF',
  footerBorder: isDark ? '#1E2E45' : '#E2EBF4',
});

// ─── C# PascalCase ↔ JS camelCase helper ────────────────────────────────────────
const getVal = (obj, key) => {
  if (!obj) return null;
  return obj[key] !== undefined
    ? obj[key]
    : obj[key.charAt(0).toUpperCase() + key.slice(1)];
};

// ─── Info Row inside the combined card ──────────────────────────────────────────
const InfoSection = ({ icon: Icon, iconColor, title, children }) => (
  <View style={styles.infoSection}>
    <View style={styles.infoSectionHeader}>
      <View style={[styles.iconCircle, { backgroundColor: iconColor + '18' }]}>
        <Icon size={17} color={iconColor} />
      </View>
      <Text style={styles.infoSectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

// ─── Main Component ──────────────────────────────────────────────────────────────
const DriverOrderDetails = ({ route, navigation }) => {
  const { orderId, offerId } = route.params;
  const { isDark } = useTheme();
  const theme = useMemo(() => buildTheme(isDark), [isDark]);

  const [loading,       setLoading]       = useState(true);
  const [order,         setOrder]         = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isPolling,     setIsPolling]     = useState(false);

  const intervalRef = useRef(null);
  const pulseAnim   = useRef(new Animated.Value(1)).current;

  // ─── Fetch ───────────────────────────────────────────────────────────────────
  const fetchOrderDetails = useCallback(async (silent = false) => {
    if (!orderId) return;
    if (!silent) setLoading(true);
    try {
      const response = await apiClient.get(`/driver/order-details/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Fetch Details Error:', error);
      if (!silent) {
        Alert.alert('Error', 'Could not load order details.');
        navigation.goBack();
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [orderId, navigation]);

  // ─── Polling ──────────────────────────────────────────────────────────────────
  const startPolling = useCallback((currentStatus) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const ms = currentStatus !== undefined
      ? (POLL_INTERVALS[currentStatus] !== undefined ? POLL_INTERVALS[currentStatus] : DEFAULT_POLL_MS)
      : DEFAULT_POLL_MS;
    if (!ms) { setIsPolling(false); return; }
    setIsPolling(true);
    intervalRef.current = setInterval(() => fetchOrderDetails(true), ms);
  }, [fetchOrderDetails]);

  useFocusEffect(
    useCallback(() => {
      fetchOrderDetails(false);
      startPolling(undefined);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsPolling(false);
      };
    }, [fetchOrderDetails, startPolling])
  );

  useEffect(() => {
    const status = getVal(order, 'status');
    if (status) startPolling(status);
  }, [order, startPolling]);

  useEffect(() => {
    if (!isPolling) { pulseAnim.setValue(1); return; }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.15, duration: 850, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 850, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isPolling, pulseAnim]);

  // ─── Actions ──────────────────────────────────────────────────────────────────
  const handleAcceptOffer = async () => {
    setActionLoading(true);
    try {
      await apiClient.post(`/driver/offers/${offerId}/accept`);
      Alert.alert('✅ Offer Accepted', 'Wait for the seller to dispatch the order.');
      fetchOrderDetails(false);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to accept offer.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectOffer = async () => {
    setActionLoading(true);
    try {
      await apiClient.post(`/driver/offers/${offerId}/reject`);
      Alert.alert('Offer Declined', 'You have declined this delivery request.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to reject offer.');
      setActionLoading(false);
    }
  };

  const handleProgressUpdate = async (newStatus) => {
    if (!newStatus) return;
    setActionLoading(true);
    try {
      await apiClient.post(`/driver/orders/${orderId}/progress`, { status: newStatus });
      fetchOrderDetails(false);
    } catch (error) {
      Alert.alert('Update Failed', error.response?.data?.message || 'Could not update progress.');
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Derived data ─────────────────────────────────────────────────────────────
  const status    = getVal(order, 'status');
  const createdAt = getVal(order, 'createdAt');
  const logistics = getVal(order, 'logistics') || {};
  const delivery  = getVal(order, 'delivery')  || {};
  const customer  = getVal(order, 'customer')  || {};
  const items     = getVal(order, 'items')     || [];

  const driverPayout  = getVal(logistics, 'driverPayout') || getVal(logistics, 'shippingFee') || 0;
  const courierName   = getVal(logistics, 'courierName');
  const receiverName  = getVal(delivery,  'receiverName');
  const receiverPhone = getVal(delivery,  'receiverPhone');
  const address       = getVal(delivery,  'address');
  const customerName  = getVal(customer,  'name');

  const isOfferPending = ['Pending', 'Accepted', 'Confirmed'].includes(status) && !getVal(order, 'driverId');

  const openInMaps = (addr) => {
    const url = Platform.select({
      ios:     `maps:0,0?q=${addr}`,
      android: `geo:0,0?q=${addr}`,
    });
    Linking.openURL(url);
  };

  // ─── Status badge config ──────────────────────────────────────────────────────
  const getStatusStyle = (s) => {
    const map = {
      Dispatched: { bg: '#F59E0B25', text: '#F59E0B' },
      Arrived:    { bg: '#3B82F625', text: '#3B82F6' },
      Completed:  { bg: '#10B98125', text: '#10B981' },
      Cancelled:  { bg: '#EF444425', text: '#EF4444' },
      Assigned:   { bg: '#8B5CF625', text: '#8B5CF6' },
    };
    return map[s] || { bg: 'rgba(255,255,255,0.18)', text: '#fff' };
  };

  // ─── Loading ──────────────────────────────────────────────────────────────────
  if (loading) return (
    <View style={[styles.center, { backgroundColor: theme.bg }]}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );

  if (!order) return null;

  const statusStyle = getStatusStyle(status);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />

      {/* ─── Header — Background removed ─── */}
      <View style={[styles.header, { backgroundColor: 'transparent', borderBottomWidth: 0 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.navBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
          activeOpacity={0.7}
        >
          <ChevronLeft color={theme.textPrimary} size={22} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Order Details</Text>
          <Text style={[styles.headerRef, { color: theme.textMuted }]}>
            #{orderId?.toString().slice(-8).toUpperCase()}
          </Text>
        </View>

        <View style={[styles.navBtn, {
          backgroundColor: theme.card,
          borderColor: theme.border,
          justifyContent: 'center', alignItems: 'center',
        }]}>
          {isPolling
            ? <Animated.View style={[styles.liveIndicator, { opacity: pulseAnim }]} />
            : <View style={styles.liveIndicatorOff} />
          }
        </View>
      </View>

      {/* ─── Scroll body ─── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 180 }]}
      >
        {/* ── Payout hero card ── */}
        <MotiView
          from={{ opacity: 0, scale: 0.95, translateY: 16 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 16 }}
        >
          <LinearGradient
            colors={['#0D7A52', '#10B981']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.payoutCard}
          >
            <View style={styles.decorOrb1} />
            <View style={styles.decorOrb2} />

            <View style={{ flex: 1, zIndex: 1 }}>
              <View style={styles.payoutHeaderRow}>
                <Truck size={18} color="rgba(255,255,255,0.75)" />
                <Text style={styles.payoutLabel}>Your Payout</Text>
              </View>
              <View style={styles.payoutAmountRow}>
                <Text style={styles.payoutCurrency}>R</Text>
                <Text style={styles.payoutAmount}>{Number(driverPayout).toFixed(2)}</Text>
              </View>
              {createdAt && (
                <Text style={styles.payoutDate}>
                  Placed {new Date(createdAt).toLocaleDateString('en-ZA', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </Text>
              )}
            </View>

            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>
                {status?.toUpperCase()}
              </Text>
            </View>
          </LinearGradient>
        </MotiView>

        {/* ── Combined card ── */}
        <MotiView
          from={{ opacity: 0, translateY: 18 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', delay: 80, damping: 18 }}
        >
          <View style={[styles.combinedCard, { backgroundColor: theme.card, borderColor: theme.border }]}>

            {/* Logistics / Seller */}
            <InfoSection icon={ShoppingBag} iconColor="#10B981" title="LOGISTICS PROVIDER">
              <Text style={[styles.contactName, { color: theme.textPrimary }]}>
                {courierName || 'Marketplace Seller'}
              </Text>
              <View style={styles.infoRow}>
                <Info size={13} color={theme.textMuted} />
                <Text style={[styles.helperText, { color: theme.textMuted }]}>
                  Ref: #{orderId?.toString().slice(-8).toUpperCase()}
                </Text>
              </View>
            </InfoSection>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Recipient */}
            <InfoSection icon={User} iconColor="#3B82F6" title="RECIPIENT">
              <View style={styles.contactRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.contactName, { color: theme.textPrimary }]}>
                    {receiverName || customerName || 'Client'}
                  </Text>
                  <Text style={[styles.contactPhone, { color: theme.textSecondary }]}>
                    {isOfferPending ? 'Phone hidden until accepted' : (receiverPhone || 'No phone provided')}
                  </Text>
                </View>
                {!isOfferPending && receiverPhone && (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(`tel:${receiverPhone}`)}
                    style={styles.phoneBtn}
                    activeOpacity={0.8}
                  >
                    <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.phoneBtnGradient}>
                      <Phone size={19} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            </InfoSection>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Drop-off */}
            <InfoSection icon={MapPin} iconColor="#EF4444" title="DROP-OFF LOCATION">
              <Text style={[styles.addressText, { color: theme.textPrimary }]}>
                {address || 'Address unavailable'}
              </Text>
              {!isOfferPending && address && (
                <TouchableOpacity
                  style={[styles.navButton, { backgroundColor: '#3B82F615', borderColor: '#3B82F630' }]}
                  onPress={() => openInMaps(address)}
                  activeOpacity={0.8}
                >
                  <Navigation size={17} color="#3B82F6" />
                  <Text style={[styles.navButtonText, { color: '#3B82F6' }]}>Start Navigation</Text>
                </TouchableOpacity>
              )}
            </InfoSection>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Items */}
            <InfoSection icon={Package} iconColor="#F59E0B" title="PARCEL CONTENTS">
              {items.map((item, index) => (
                <View
                  key={index}
                  style={[styles.itemRow, {
                    borderBottomColor: theme.border,
                    borderBottomWidth: index < items.length - 1 ? 1 : 0,
                  }]}
                >
                  <View style={[styles.itemQtyBadge, { backgroundColor: theme.primary + '18' }]}>
                    <Text style={[styles.itemQtyText, { color: theme.primary }]}>
                      {getVal(item, 'quantity')}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemName, { color: theme.textPrimary }]}>
                      {getVal(item, 'productName')}
                    </Text>
                    <Text style={[styles.itemSub, { color: theme.textMuted }]}>
                      {getVal(item, 'gaugeLabel') || 'Standard Unit'}
                    </Text>
                  </View>
                  <View style={[styles.weightPill, { backgroundColor: theme.cardElevated || theme.border + '60' }]}>
                    <Text style={[styles.weightText, { color: theme.textSecondary }]}>
                      {getVal(item, 'weight') || '0'}kg
                    </Text>
                  </View>
                </View>
              ))}
            </InfoSection>

          </View>
        </MotiView>
      </ScrollView>

      {/* ─── Footer actions ─── */}
      <View style={[styles.footer, { backgroundColor: theme.footer, borderTopColor: theme.footerBorder }]}>

        {isOfferPending ? (
          <View style={styles.dualBtnRow}>
            <TouchableOpacity
              style={[styles.actionBtn, actionLoading && { opacity: 0.6 }]}
              onPress={handleRejectOffer}
              disabled={actionLoading}
              activeOpacity={0.85}
            >
              <View style={[styles.actionBtnInner, { backgroundColor: '#EF444415', borderColor: '#EF444440', borderWidth: 1.5 }]}>
                <XCircle color="#EF4444" size={20} />
                <Text style={[styles.btnText, { color: '#EF4444' }]}>Decline</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, actionLoading && { opacity: 0.6 }]}
              onPress={handleAcceptOffer}
              disabled={actionLoading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.actionBtnInner}
              >
                {actionLoading
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <><CheckCircle color="#fff" size={20} /><Text style={[styles.btnText, { color: '#fff' }]}>Accept</Text></>
                }
              </LinearGradient>
            </TouchableOpacity>
          </View>

        ) : status === 'Assigned' ? (
          <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }}>
            <View style={[styles.waitingCard, { backgroundColor: '#F59E0B12', borderColor: '#F59E0B35' }]}>
              <View style={[styles.waitingIconBox, { backgroundColor: '#F59E0B20' }]}>
                <MotiView
                  from={{ rotate: '0deg' }} animate={{ rotate: '360deg' }}
                  transition={{ loop: true, type: 'timing', duration: 2200 }}
                >
                  <Clock size={28} color="#F59E0B" />
                </MotiView>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.waitingTitle, { color: theme.textPrimary }]}>Waiting for Seller</Text>
                <Text style={[styles.waitingText, { color: theme.textSecondary }]}>
                  The seller needs to dispatch before you can start.
                </Text>
              </View>
            </View>
          </MotiView>

        ) : status === 'Arrived' ? (
          <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }}>
            <View style={[styles.waitingCard, { backgroundColor: '#3B82F612', borderColor: '#3B82F635' }]}>
              <View style={[styles.waitingIconBox, { backgroundColor: '#3B82F620' }]}>
                <MotiView
                  from={{ rotate: '0deg' }} animate={{ rotate: '360deg' }}
                  transition={{ loop: true, type: 'timing', duration: 2200 }}
                >
                  <Clock size={28} color="#3B82F6" />
                </MotiView>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.waitingTitle, { color: theme.textPrimary }]}>Waiting for Buyer</Text>
                <Text style={[styles.waitingText, { color: theme.textSecondary }]}>
                  Buyer must confirm receipt to complete this delivery.
                </Text>
              </View>
            </View>
          </MotiView>

        ) : status === 'Completed' ? (
          <View style={[styles.completedCard, { backgroundColor: '#10B98112', borderColor: '#10B98130' }]}>
            <CheckCircle2 size={44} color="#10B981" />
            <Text style={[styles.completedTitle, { color: theme.textPrimary }]}>Delivery Complete 🎉</Text>
            <Text style={[styles.completedSub, { color: theme.textSecondary }]}>
              Your payout will be processed shortly.
            </Text>
          </View>

        ) : status === 'Dispatched' ? (
          <TouchableOpacity
            style={[styles.fullBtn, actionLoading && { opacity: 0.75 }]}
            onPress={() => handleProgressUpdate('Arrived')}
            disabled={actionLoading}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.fullBtnInner}
            >
              {actionLoading
                ? <ActivityIndicator color="#fff" size="small" />
                : <>
                    <Navigation size={21} color="#fff" />
                    <Text style={styles.fullBtnText}>Mark as Arrived</Text>
                  </>
              }
            </LinearGradient>
          </TouchableOpacity>

        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
  },
  headerCenter: { alignItems: 'center' },
  headerTitle:  { fontSize: 17, fontWeight: '900', letterSpacing: -0.4 },
  headerRef:    { fontSize: 11, fontWeight: '700', marginTop: 2, letterSpacing: 0.5 },
  navBtn: {
    width: 42, height: 42, borderRadius: 13,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1,
  },
  liveIndicator:    { width: 10, height: 10, borderRadius: 5, backgroundColor: '#22C55E' },
  liveIndicatorOff: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'transparent' },

  scrollContent: { padding: 16 },

  payoutCard: {
    borderRadius: 26, padding: 24, marginBottom: 16,
    flexDirection: 'row', alignItems: 'center',
    overflow: 'hidden', position: 'relative',
  },
  decorOrb1: { position: 'absolute', top: -50, right: -50, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(255,255,255,0.08)' },
  decorOrb2: { position: 'absolute', bottom: -40, left: -40, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,255,255,0.05)' },
  payoutHeaderRow:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  payoutLabel:      { color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: '700' },
  payoutAmountRow:  { flexDirection: 'row', alignItems: 'baseline', gap: 2, marginBottom: 6 },
  payoutCurrency:   { color: 'rgba(255,255,255,0.8)', fontSize: 18, fontWeight: '700' },
  payoutAmount:     { color: '#fff', fontSize: 34, fontWeight: '900', letterSpacing: -1 },
  payoutDate:       { color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: '600' },
  statusBadge:      { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14 },
  statusBadgeText:  { fontWeight: '900', fontSize: 11, letterSpacing: 0.5 },

  combinedCard: {
    borderRadius: 22, borderWidth: 1, overflow: 'hidden', marginBottom: 14,
  },

  infoSection:       { padding: 20 },
  infoSectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  iconCircle:        { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  infoSectionTitle:  { fontSize: 11, fontWeight: '900', letterSpacing: 0.8, color: '#8DA0B8' },

  divider: { height: 1, marginHorizontal: 0 },

  contactRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  contactName:  { fontSize: 17, fontWeight: '800', marginBottom: 4 },
  contactPhone: { fontSize: 14, fontWeight: '600' },
  phoneBtn:     { width: 50, height: 50, borderRadius: 16, overflow: 'hidden' },
  phoneBtnGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  infoRow:    { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  helperText: { fontSize: 13, fontWeight: '600' },

  addressText: { fontSize: 15, fontWeight: '600', lineHeight: 22, marginBottom: 14 },
  navButton:   {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 12, borderRadius: 14, borderWidth: 1,
  },
  navButtonText: { fontWeight: '800', fontSize: 14 },

  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  itemQtyBadge: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  itemQtyText:  { fontSize: 14, fontWeight: '900' },
  itemName:     { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  itemSub:      { fontSize: 12, fontWeight: '600' },
  weightPill:   { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  weightText:   { fontSize: 12, fontWeight: '800' },

  footer: {
    padding: 16, paddingBottom: Platform.OS === 'ios' ? 36 : 20,
    borderTopWidth: 1,
    position: 'absolute', bottom: 0, left: 0, right: 0,
  },
  dualBtnRow: { flexDirection: 'row', gap: 12 },
  actionBtn:  { flex: 1, borderRadius: 16, overflow: 'hidden' },
  actionBtnInner: {
    height: 56, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    borderRadius: 16,
  },
  btnText: { fontSize: 15, fontWeight: '900' },
  fullBtn: { borderRadius: 16, overflow: 'hidden' },
  fullBtnInner: { height: 56, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10 },
  fullBtnText:  { color: '#fff', fontSize: 16, fontWeight: '900' },

  waitingCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 18, borderWidth: 1.5, gap: 14 },
  waitingIconBox: { width: 54, height: 54, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  waitingTitle: { fontSize: 15, fontWeight: '900', marginBottom: 4 },
  waitingText:  { fontSize: 13, fontWeight: '500', lineHeight: 18 },

  completedCard: { alignItems: 'center', padding: 20, borderRadius: 18, borderWidth: 1.5, gap: 8 },
  completedTitle: { fontSize: 18, fontWeight: '900' },
  completedSub:   { fontSize: 13, fontWeight: '500', textAlign: 'center' },
});

export default DriverOrderDetails;