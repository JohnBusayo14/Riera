import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Linking, Platform,
  StatusBar, Dimensions, Animated, RefreshControl,
} from 'react-native';
import {
  ChevronLeft, MapPin, Phone, Truck, ExternalLink,
  User, Package, CheckCircle2, Clock, Ban, Search,
  Wifi, AlertOctagon, DollarSign, ShoppingBag,
  UserCheck, Star, ChevronRight, Zap,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useFocusEffect } from '@react-navigation/native';

import apiClient from '../services/apiClient';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

// ─── Poll intervals per status ────────────────────────────────────────────────
const POLL_MS = {
  Pending:              5000,   // new order — seller must respond quickly
  Accepted:             6000,
  Confirmed:            6000,
  Assigned:             5000,   // driver assigned — watch for changes
  Dispatched:           5000,
  Shipped:              5000,
  'In Transit':         5000,
  Arrived:              4000,   // buyer needs to confirm — poll fast
  Delivered:            4000,
  AwaitingSellerRating: 4000,   // seller must act now to get paid
  Disputed:             10000,
  Completed:            null,   // terminal
  Settled:              null,
  Cancelled:            null,
};

// ─── Status display config ────────────────────────────────────────────────────
const STATUS_META = {
  Pending:              { label: 'New Order',        color: '#F59E0B', gradient: ['#D97706', '#F59E0B'] },
  Accepted:             { label: 'Accepted',         color: '#10B981', gradient: ['#059669', '#10B981'] },
  Confirmed:            { label: 'Confirmed',        color: '#10B981', gradient: ['#059669', '#10B981'] },
  Assigned:             { label: 'Driver Assigned',  color: '#3B82F6', gradient: ['#2563EB', '#3B82F6'] },
  Dispatched:           { label: 'Dispatched',       color: '#8B5CF6', gradient: ['#7C3AED', '#8B5CF6'] },
  Shipped:              { label: 'In Transit',       color: '#8B5CF6', gradient: ['#7C3AED', '#8B5CF6'] },
  'In Transit':         { label: 'In Transit',       color: '#8B5CF6', gradient: ['#7C3AED', '#8B5CF6'] },
  Arrived:              { label: 'Arrived at Buyer', color: '#10B981', gradient: ['#059669', '#10B981'] },
  Delivered:            { label: 'Delivered',        color: '#10B981', gradient: ['#059669', '#10B981'] },
  AwaitingSellerRating: { label: 'Rate the Buyer',   color: '#F59E0B', gradient: ['#D97706', '#F59E0B'] },
  Disputed:             { label: 'Disputed',         color: '#EF4444', gradient: ['#DC2626', '#EF4444'] },
  Completed:            { label: 'Completed',        color: '#059669', gradient: ['#065F46', '#047857'] },
  Settled:              { label: 'Settled',          color: '#059669', gradient: ['#065F46', '#047857'] },
  Cancelled:            { label: 'Cancelled',        color: '#6B7280', gradient: ['#374151', '#4B5563'] },
};

const getStatusIndex = (status) => {
  switch (status) {
    case 'Pending':                                          return 0;
    case 'Accepted': case 'Confirmed':                      return 1;
    case 'Assigned':                                        return 2;
    case 'Dispatched': case 'Shipped': case 'In Transit':  return 3;
    case 'Arrived':   case 'Delivered':                     return 4;
    case 'AwaitingSellerRating':                            return 5;
    case 'Completed': case 'Settled':                       return 6;
    default:                                                return 0;
  }
};

// Handles C# PascalCase ↔ JS camelCase
const gv = (obj, key) => {
  if (!obj) return null;
  if (obj[key] !== undefined) return obj[key];
  return obj[key.charAt(0).toUpperCase() + key.slice(1)];
};

export default function SellerOrderDetails({ route, navigation }) {
  const { isDark } = useTheme();
  const OrderId = route.params?.orderId || route.params?.id;

  const [Order,      setOrder]      = useState(null);
  const [Loading,    setLoading]    = useState(true);
  const [Refreshing, setRefreshing] = useState(false);
  const [Processing, setProcessing] = useState(false);
  const [isPolling,  setIsPolling]  = useState(false);

  const intervalRef = useRef(null);
  const pulseAnim   = useRef(new Animated.Value(1)).current;

  const C = {
    bg:      isDark ? '#0F172A' : '#F1F5F9',
    card:    isDark ? '#1E293B' : '#FFFFFF',
    text:    isDark ? '#F8FAFC' : '#0F172A',
    muted:   isDark ? '#94A3B8' : '#64748B',
    primary: '#1B4D3E',
    accent:  '#10B981',
    border:  isDark ? '#334155' : '#E2E8F0',
    danger:  '#EF4444',
    secBg:   isDark ? '#334155' : '#F8FAFC',
    infoBg:  isDark ? 'rgba(27,77,62,0.15)' : '#F0FDF4',
  };

  // ─── Fetch ────────────────────────────────────────────────────────────────
  const fetchOrder = useCallback(async (silent = false) => {
    if (!OrderId) return;
    if (!silent) { setLoading(prev => prev); setRefreshing(true); }
    try {
      const res = await apiClient.get(`/seller/orders/${OrderId}`);
      setOrder(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [OrderId]);

  // ─── Polling ──────────────────────────────────────────────────────────────
  const startPolling = useCallback((status) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const ms = POLL_MS[status] ?? null;
    if (!ms) { setIsPolling(false); return; }
    setIsPolling(true);
    intervalRef.current = setInterval(() => fetchOrder(true), ms);
  }, [fetchOrder]);

  useFocusEffect(
    useCallback(() => {
      fetchOrder();
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsPolling(false);
      };
    }, [fetchOrder])
  );

  useEffect(() => {
    if (Order?.status) startPolling(Order.status);
  }, [Order?.status, startPolling]);

  // Pulse animation
  useEffect(() => {
    if (!isPolling) { pulseAnim.setValue(1); return; }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.15, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isPolling, pulseAnim]);

  // ─── Actions ──────────────────────────────────────────────────────────────
  const handleAccept = async () => {
    setProcessing(true);
    try {
      await apiClient.post(`/seller/orders/${OrderId}/action`, { action: 'confirm' });
      await fetchOrder(true);
    } catch (err) {
      console.error('Accept error:', err);
    } finally { setProcessing(false); }
  };

  const handleDecline = async () => {
    setProcessing(true);
    try {
      await apiClient.post(`/seller/orders/${OrderId}/action`, { action: 'cancel' });
      await fetchOrder(true);
    } catch (err) {
      console.error('Decline error:', err);
    } finally { setProcessing(false); }
  };

  const handleDispatch = async () => {
    if (!gv(Order, 'driverId')) return;
    setProcessing(true);
    try {
      await apiClient.post(`/seller/orders/${OrderId}/dispatch`);
      await fetchOrder(true);
    } catch (err) {
      console.error('Dispatch error:', err);
    } finally { setProcessing(false); }
  };

  const handleFindRider = () => {
    navigation.navigate('DriverSearch', {
      orderId:  OrderId,
      orderLat: gv(Order, 'latitude'),
      orderLng: gv(Order, 'longitude'),
    });
  };

  // ─── Loading screen ───────────────────────────────────────────────────────
  if (Loading) {
    return (
      <View style={[styles.Center, { backgroundColor: C.bg }]}>
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={[styles.LoadingText, { color: C.muted }]}>Loading order…</Text>
      </View>
    );
  }

  if (!Order) return null;

  // ─── Derived values ───────────────────────────────────────────────────────
  const CurrentStatus = gv(Order, 'status') || 'Pending';
  const StatusIdx     = getStatusIndex(CurrentStatus);
  const Meta          = STATUS_META[CurrentStatus] || STATUS_META['Pending'];

  const IsPending    = CurrentStatus === 'Pending';
  const IsConfirmed  = ['Confirmed', 'Accepted', 'Assigned'].includes(CurrentStatus);
  const IsDispatched = ['Dispatched', 'Shipped', 'In Transit', 'Arrived', 'Delivered'].includes(CurrentStatus);
  const IsArrived    = CurrentStatus === 'Arrived' || CurrentStatus === 'Delivered';
  const IsAwaiting   = CurrentStatus === 'AwaitingSellerRating';
  const IsDisputed   = CurrentStatus === 'Disputed';
  const IsCompleted  = CurrentStatus === 'Completed' || CurrentStatus === 'Settled';
  const IsCancelled  = CurrentStatus === 'Cancelled';

  // Financials
  const LogisticsFee = Number(gv(Order, 'shippingFee') || gv(Order, 'logisticsFee') || 0);
  const GrossTotal   = Number(gv(Order, 'totalAmount') || 0);
  const ItemsTotal   = GrossTotal - LogisticsFee;
  const Commission   = Number((ItemsTotal * 0.05).toFixed(2));
  const NetPayout    = Number((ItemsTotal - Commission).toFixed(2));

  const receiverName  = gv(Order, 'receiverName')    || 'Customer';
  const receiverPhone = gv(Order, 'receiverPhone')   || '';
  const deliveryAddr  = gv(Order, 'deliveryAddress') || '';
  const driverId      = gv(Order, 'driverId');
  const driverName    = gv(Order, 'driverName') || (driverId ? 'Driver Assigned' : null);

  // Timeline steps for hero
  const TIMELINE_STEPS = [
    { icon: ShoppingBag,  step: 0 },
    { icon: UserCheck,    step: 1 },
    { icon: Truck,        step: 2 },
    { icon: Package,      step: 3 },
    { icon: MapPin,       step: 4 },
    { icon: CheckCircle2, step: 5 },
  ];

  return (
    <SafeAreaView style={[styles.Main, { backgroundColor: C.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={[styles.Header, { backgroundColor: C.card, borderBottomColor: C.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.HeaderBtn, { backgroundColor: C.secBg }]}>
          <ChevronLeft color={C.text} size={26} strokeWidth={2.5} />
        </TouchableOpacity>

        <View style={styles.HeaderCenter}>
          <Text style={[styles.HeaderSup, { color: C.muted }]}>SELLER ORDER</Text>
          <Text style={[styles.HeaderId,  { color: C.text  }]}>
            #{OrderId?.toString().substring(0, 8).toUpperCase()}
          </Text>
        </View>

        {/* Live dot + manual refresh */}
        <TouchableOpacity
          onPress={() => fetchOrder(false)}
          style={[styles.HeaderBtn, { backgroundColor: C.secBg }]}
          activeOpacity={0.7}
        >
          {Refreshing
            ? <ActivityIndicator size="small" color={C.primary} />
            : isPolling
              ? (
                <View style={styles.HeaderLive}>
                  <Animated.View style={[styles.LiveDot, { opacity: pulseAnim }]} />
                  <Wifi size={15} color={C.primary} strokeWidth={2.5} />
                </View>
              )
              : <Wifi size={18} color={C.muted} strokeWidth={2} />
          }
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.Scroll}
        refreshControl={
          <RefreshControl refreshing={Refreshing} onRefresh={() => fetchOrder(false)}
            colors={[C.primary]} tintColor={C.primary} />
        }
      >

        {/* ── Hero Gradient Card ────────────────────────────────────────────── */}
        <MotiView from={{ opacity: 0, translateY: -10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 350 }}>
          <LinearGradient colors={Meta.gradient} style={styles.Hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>

            {/* Status + payout */}
            <View style={styles.HeroRow}>
              <View style={{ flex: 1 }}>
                {isPolling && (
                  <View style={styles.HeroLiveBadge}>
                    <Animated.View style={[styles.HeroLiveDot, { opacity: pulseAnim }]} />
                    <Text style={styles.HeroLiveText}>LIVE</Text>
                  </View>
                )}
                <Text style={styles.HeroStatusLabel}>CURRENT STATUS</Text>
                <Text style={styles.HeroStatus}>{Meta.label}</Text>
                <Text style={styles.HeroRaw}>{CurrentStatus}</Text>
              </View>
              <View style={styles.HeroPayoutCard}>
                <Text style={styles.HeroPayoutLabel}>Your Payout</Text>
                <Text style={styles.HeroPayoutVal}>R{NetPayout.toFixed(2)}</Text>
                <View style={styles.HeroFeeBadge}>
                  <Text style={styles.HeroFeeText}>5% FEE</Text>
                </View>
              </View>
            </View>

            {/* Progress timeline dots */}
            <View style={styles.TimelineRow}>
              {TIMELINE_STEPS.map((T, I) => {
                const done    = StatusIdx > T.step;
                const current = StatusIdx === T.step;
                const Icon    = T.icon;
                return (
                  <React.Fragment key={I}>
                    <View style={styles.TNode}>
                      <View style={[
                        styles.TDot,
                        done    && styles.TDotDone,
                        current && styles.TDotCurrent,
                      ]}>
                        <Icon size={10} color={done || current ? Meta.gradient[0] : 'rgba(255,255,255,0.4)'} strokeWidth={2.5} />
                      </View>
                    </View>
                    {I < TIMELINE_STEPS.length - 1 && (
                      <View style={[styles.TLine, done && styles.TLineDone]} />
                    )}
                  </React.Fragment>
                );
              })}
            </View>
          </LinearGradient>
        </MotiView>

        {/* ── Action Required Banners ───────────────────────────────────────── */}

        {/* NEW ORDER banner — urgent */}
        {IsPending && (
          <MotiView from={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 350 }}>
            <View style={[styles.UrgentBanner, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
              <Zap size={18} color="#D97706" strokeWidth={2.5} fill="#D97706" />
              <Text style={[styles.UrgentText, { color: '#92400E' }]}>
                New order waiting — accept or decline
              </Text>
            </View>
          </MotiView>
        )}

        {/* AWAITING RATING — highest urgency, seller gets paid when they act */}
        {IsAwaiting && (
          <MotiView from={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 350 }}>
            <TouchableOpacity
              style={[styles.ActionBanner, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}
              onPress={() => navigation.navigate('RateOrder', { orderId: OrderId })}
              activeOpacity={0.85}
            >
              <View style={[styles.BannerIcon, { backgroundColor: '#FEF3C7' }]}>
                <Star size={20} color="#D97706" strokeWidth={2.5} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.BannerTitle,  { color: '#92400E' }]}>Rate Buyer → Get Paid</Text>
                <Text style={[styles.BannerBody,   { color: '#B45309' }]}>
                  Buyer completed the order. Rate them now to release your R{NetPayout.toFixed(2)}.
                </Text>
              </View>
              <ChevronRight size={18} color="#D97706" strokeWidth={2.5} />
            </TouchableOpacity>
          </MotiView>
        )}

        {/* DISPUTED */}
        {IsDisputed && (
          <MotiView from={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 350 }}>
            <View style={[styles.ActionBanner, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
              <View style={[styles.BannerIcon, { backgroundColor: '#FEE2E2' }]}>
                <AlertOctagon size={20} color="#EF4444" strokeWidth={2.5} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.BannerTitle, { color: '#991B1B' }]}>Dispute in Progress</Text>
                <Text style={[styles.BannerBody,  { color: '#B91C1C' }]}>
                  Your payment is held while our team reviews. We'll notify you of the outcome.
                </Text>
              </View>
            </View>
          </MotiView>
        )}

        {/* NO DRIVER YET warning */}
        {IsConfirmed && !driverId && !IsDispatched && (
          <MotiView from={{ opacity: 0, translateY: -8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 350 }}>
            <View style={[styles.ActionBanner, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
              <View style={[styles.BannerIcon, { backgroundColor: '#FEF3C7' }]}>
                <Truck size={20} color="#D97706" strokeWidth={2.5} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.BannerTitle, { color: '#92400E' }]}>No Driver Assigned</Text>
                <Text style={[styles.BannerBody,  { color: '#B45309' }]}>
                  Find and assign a driver before you can dispatch this order.
                </Text>
              </View>
            </View>
          </MotiView>
        )}

        {/* ARRIVED — waiting for buyer */}
        {IsArrived && !IsAwaiting && !IsCompleted && !IsDisputed && (
          <View style={[styles.ActionBanner, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
            <View style={[styles.BannerIcon, { backgroundColor: '#D1FAE5' }]}>
              <MapPin size={20} color="#059669" strokeWidth={2.5} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.BannerTitle, { color: '#065F46' }]}>Arrived — Waiting for Buyer</Text>
              <Text style={[styles.BannerBody,  { color: '#047857' }]}>
                Package is at the buyer's location. Waiting for them to confirm receipt.
              </Text>
            </View>
          </View>
        )}

        {/* ── Financial Breakdown ───────────────────────────────────────────── */}
        <SectionLabel label="PAYMENT BREAKDOWN" color={C.muted} />
        <View style={[styles.Card, { backgroundColor: C.card, borderColor: C.border }]}>
          <FinRow label="Items Subtotal"          val={`R${ItemsTotal.toFixed(2)}`}     vc={C.text}    lc={C.muted} />
          <FinRow label="Logistics Fee"           val={`R${LogisticsFee.toFixed(2)}`}   vc={C.text}    lc={C.muted} />
          <View style={[styles.Divider, { backgroundColor: C.border }]} />
          <FinRow label="Platform Commission (5%)" val={`-R${Commission.toFixed(2)}`}   vc={C.danger}  lc={C.muted} />
          <View style={[styles.TotalRow, { borderTopColor: C.border }]}>
            <Text style={[styles.TotalLabel, { color: C.primary }]}>Your Net Payout</Text>
            <Text style={[styles.TotalVal,   { color: C.primary }]}>R{NetPayout.toFixed(2)}</Text>
          </View>
        </View>

        {/* ── Customer Details ──────────────────────────────────────────────── */}
        <SectionLabel label="CUSTOMER" color={C.muted} />
        <View style={[styles.Card, { backgroundColor: C.card, borderColor: C.border }]}>
          <View style={styles.PersonRow}>
            <View style={[styles.Avatar, { backgroundColor: C.infoBg }]}>
              <User color={C.primary} size={22} strokeWidth={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.PersonName, { color: C.text  }]}>{receiverName}</Text>
              <Text style={[styles.PersonSub,  { color: C.muted }]}>{receiverPhone || 'No phone'}</Text>
            </View>
            {receiverPhone ? (
              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${receiverPhone}`)}
                style={[styles.CircleBtn, { backgroundColor: C.primary + '15' }]}
              >
                <Phone color={C.primary} size={17} strokeWidth={2} />
              </TouchableOpacity>
            ) : null}
          </View>

          {deliveryAddr ? (
            <>
              <View style={[styles.Divider, { backgroundColor: C.border }]} />
              <TouchableOpacity
                style={styles.AddressRow}
                onPress={() => Linking.openURL(
                  Platform.OS === 'ios'
                    ? `maps:0,0?q=${deliveryAddr}`
                    : `geo:0,0?q=${deliveryAddr}`
                )}
                activeOpacity={0.75}
              >
                <MapPin color={C.muted} size={18} strokeWidth={2} />
                <Text style={[styles.AddressText, { color: C.text }]} numberOfLines={2}>{deliveryAddr}</Text>
                <ExternalLink color={C.primary} size={15} strokeWidth={2} />
              </TouchableOpacity>
            </>
          ) : null}
        </View>

        {/* ── Driver Details (when assigned) ───────────────────────────────── */}
        {driverName && (
          <>
            <SectionLabel label="DRIVER" color={C.muted} />
            <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 350 }}>
              <View style={[styles.Card, { backgroundColor: C.card, borderColor: C.border }]}>
                <View style={styles.PersonRow}>
                  <View style={[styles.Avatar, { backgroundColor: C.primary + '15' }]}>
                    <Truck color={C.primary} size={22} strokeWidth={2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.PersonName, { color: C.text  }]}>{driverName}</Text>
                    <Text style={[styles.PersonSub,  { color: C.muted }]}>
                      {IsDispatched ? 'En route to buyer' : 'Awaiting dispatch signal'}
                    </Text>
                  </View>
                  {IsDispatched && (
                    <View style={[styles.EnRouteBadge, { backgroundColor: '#ECFDF5' }]}>
                      <Text style={styles.EnRouteText}>EN ROUTE</Text>
                    </View>
                  )}
                </View>
              </View>
            </MotiView>
          </>
        )}

        {/* ── Items ─────────────────────────────────────────────────────────── */}
        <SectionLabel label="ITEMS" color={C.muted} />
        <View style={[styles.Card, { backgroundColor: C.card, borderColor: C.border }]}>
          {Order.items?.map((item, I) => (
            <View key={I}>
              <View style={styles.ItemRow}>
                <View style={[styles.ItemIcon, { backgroundColor: C.secBg }]}>
                  <Package color={C.muted} size={17} strokeWidth={2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.ItemName,  { color: C.text  }]}>
                    {item.productName || item.name || 'Product'}
                  </Text>
                  <Text style={[styles.ItemMeta, { color: C.muted }]}>
                    {item.quantity} × R{Number(item.priceAtPurchase || 0).toFixed(2)}
                  </Text>
                </View>
                <Text style={[styles.ItemPrice, { color: C.text }]}>
                  R{(item.quantity * Number(item.priceAtPurchase || 0)).toFixed(2)}
                </Text>
              </View>
              {I < Order.items.length - 1 && (
                <View style={[styles.Divider, { backgroundColor: C.border, marginVertical: 8 }]} />
              )}
            </View>
          ))}
          <View style={[styles.Divider, { backgroundColor: C.border, marginTop: 12 }]} />
          <FinRow label="Subtotal" val={`R${ItemsTotal.toFixed(2)}`}   vc={C.text}    lc={C.muted} />
          <FinRow label="Shipping" val={`R${LogisticsFee.toFixed(2)}`} vc={C.text}    lc={C.muted} />
          <View style={[styles.TotalRow, { borderTopColor: C.border }]}>
            <Text style={[styles.TotalLabel, { color: C.text }]}>Order Total</Text>
            <Text style={[styles.TotalVal,   { color: C.primary }]}>R{GrossTotal.toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ height: 130 }} />
      </ScrollView>

      {/* ── Sticky Footer Actions ─────────────────────────────────────────── */}
      <View style={[styles.Footer, { backgroundColor: C.card, borderTopColor: C.border }]}>

        {/* PENDING: Accept or Decline */}
        {IsPending && (
          <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 300 }}>
            <View style={styles.FooterRow}>
              <TouchableOpacity
                style={[styles.BtnSec, { borderColor: C.danger, flex: 1 }]}
                onPress={handleDecline} disabled={Processing}
              >
                <Ban color={C.danger} size={18} strokeWidth={2.5} />
                <Text style={[styles.BtnSecLabel, { color: C.danger }]}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.BtnPrim, { backgroundColor: C.primary, flex: 2 }]}
                onPress={handleAccept} disabled={Processing}
              >
                {Processing
                  ? <ActivityIndicator color="#FFF" />
                  : <>
                      <CheckCircle2 color="#FFF" size={18} strokeWidth={2.5} />
                      <Text style={styles.BtnPrimLabel}>Accept Order</Text>
                    </>
                }
              </TouchableOpacity>
            </View>
          </MotiView>
        )}

        {/* CONFIRMED: Find Rider + Dispatch */}
        {IsConfirmed && !IsDispatched && (
          <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 300 }}>
            <View style={styles.FooterRow}>
              {!driverId && (
                <TouchableOpacity
                  style={[styles.BtnSec, { borderColor: C.primary, backgroundColor: C.infoBg, flex: 1 }]}
                  onPress={handleFindRider} disabled={Processing}
                >
                  <Search color={C.primary} size={18} strokeWidth={2.5} />
                  <Text style={[styles.BtnSecLabel, { color: C.primary }]}>Find Rider</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.BtnPrim, {
                  backgroundColor: driverId ? C.primary : '#94A3B8',
                  flex: driverId ? 1 : 1.6,
                }]}
                onPress={handleDispatch}
                disabled={Processing || !driverId}
              >
                {Processing
                  ? <ActivityIndicator color="#FFF" />
                  : <>
                      <Truck color="#FFF" size={18} strokeWidth={2.5} />
                      <Text style={styles.BtnPrimLabel}>
                        {driverId ? 'Dispatch Now' : 'Awaiting Rider'}
                      </Text>
                    </>
                }
              </TouchableOpacity>
            </View>
          </MotiView>
        )}

        {/* AWAITING RATING: Rate buyer CTA */}
        {IsAwaiting && (
          <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 300 }}>
            <LinearGradient colors={['#D97706', '#F59E0B']} style={styles.BtnGradient}>
              <TouchableOpacity
                style={styles.BtnGradientInner}
                onPress={() => navigation.navigate('RateOrder', { orderId: OrderId })}
              >
                <Star color="#FFF" size={18} strokeWidth={2.5} fill="#FFF" />
                <Text style={styles.BtnPrimLabel}>Rate Buyer & Receive R{NetPayout.toFixed(2)}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </MotiView>
        )}

        {/* IN TRANSIT status pill */}
        {IsDispatched && !IsArrived && !IsAwaiting && !IsCompleted && !IsDisputed && (
          <View style={[styles.StatusPill, { backgroundColor: C.infoBg }]}>
            <Truck color={C.primary} size={17} strokeWidth={2} />
            <Text style={[styles.StatusPillText, { color: C.primary }]}>
              Order is out for delivery — tracking live
            </Text>
            {isPolling && <Animated.View style={[styles.PillDot, { opacity: pulseAnim }]} />}
          </View>
        )}

        {/* COMPLETED */}
        {IsCompleted && (
          <View style={[styles.StatusPill, { backgroundColor: '#ECFDF5' }]}>
            <CheckCircle2 color="#059669" size={17} strokeWidth={2} />
            <Text style={[styles.StatusPillText, { color: '#059669' }]}>
              Complete — R{NetPayout.toFixed(2)} paid to your wallet
            </Text>
          </View>
        )}

        {/* DISPUTED */}
        {IsDisputed && (
          <View style={[styles.StatusPill, { backgroundColor: '#FEF2F2' }]}>
            <AlertOctagon color="#EF4444" size={17} strokeWidth={2} />
            <Text style={[styles.StatusPillText, { color: '#EF4444' }]}>Dispute under review — payment held</Text>
          </View>
        )}

        {/* CANCELLED */}
        {IsCancelled && (
          <View style={[styles.StatusPill, { backgroundColor: C.secBg }]}>
            <Ban color={C.muted} size={17} strokeWidth={2} />
            <Text style={[styles.StatusPillText, { color: C.muted }]}>Order cancelled</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

// ─── Tiny reusable components ─────────────────────────────────────────────────
const SectionLabel = ({ label, color }) => (
  <Text style={[styles.Section, { color }]}>{label}</Text>
);

const FinRow = ({ label, val, lc, vc }) => (
  <View style={styles.FinRow}>
    <Text style={[styles.FinLabel, { color: lc }]}>{label}</Text>
    <Text style={[styles.FinVal,   { color: vc }]}>{val}</Text>
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  Main:        { flex: 1 },
  Center:      { flex: 1, justifyContent: 'center', alignItems: 'center' },
  LoadingText: { marginTop: 14, fontSize: 14, fontWeight: '600' },

  // Header
  Header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, height: 64, borderBottomWidth: 1,
  },
  HeaderBtn:    { width: 42, height: 42, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  HeaderCenter: { flex: 1, alignItems: 'center' },
  HeaderSup:    { fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 1 },
  HeaderId:     { fontSize: 16, fontWeight: '900', letterSpacing: -0.3 },
  HeaderLive:   { alignItems: 'center', justifyContent: 'center' },
  LiveDot:      { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginBottom: 2 },

  Scroll: { padding: 16, paddingTop: 14 },

  // Hero
  Hero: { borderRadius: 24, padding: 22, marginBottom: 14 },
  HeroRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  HeroLiveBadge:  { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  HeroLiveDot:    { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF' },
  HeroLiveText:   { fontSize: 9, fontWeight: '900', color: 'rgba(255,255,255,0.9)', letterSpacing: 1 },
  HeroStatusLabel:{ fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.65)', letterSpacing: 1.2, marginBottom: 4 },
  HeroStatus:     { fontSize: 22, fontWeight: '900', color: '#FFF', letterSpacing: -0.5 },
  HeroRaw:        { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.55)', marginTop: 2 },
  HeroPayoutCard: { alignItems: 'flex-end' },
  HeroPayoutLabel:{ fontSize: 9,  fontWeight: '700', color: 'rgba(255,255,255,0.65)', marginBottom: 3 },
  HeroPayoutVal:  { fontSize: 22, fontWeight: '900', color: '#FFF', letterSpacing: -0.5 },
  HeroFeeBadge:   { marginTop: 5, backgroundColor: 'rgba(0,0,0,0.18)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 7 },
  HeroFeeText:    { fontSize: 9, fontWeight: '900', color: 'rgba(255,255,255,0.8)', letterSpacing: 0.5 },

  // Timeline
  TimelineRow: { flexDirection: 'row', alignItems: 'center' },
  TNode:  { alignItems: 'center' },
  TDot: {
    width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  TDotDone:    { backgroundColor: '#FFF' },
  TDotCurrent: { backgroundColor: 'rgba(255,255,255,0.4)', borderWidth: 2, borderColor: '#FFF' },
  TLine:       { flex: 1, height: 2, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 1, marginHorizontal: 3 },
  TLineDone:   { backgroundColor: 'rgba(255,255,255,0.7)' },

  // Banners
  UrgentBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 12, borderRadius: 14, borderWidth: 1, marginBottom: 12,
  },
  UrgentText: { fontSize: 13, fontWeight: '700', flex: 1 },

  ActionBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 12,
  },
  BannerIcon:  { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  BannerTitle: { fontSize: 14, fontWeight: '900', marginBottom: 3 },
  BannerBody:  { fontSize: 12, fontWeight: '600', lineHeight: 17 },

  Section: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 8, marginTop: 4 },

  // Cards
  Card: {
    borderRadius: 20, borderWidth: 1, padding: 18, marginBottom: 14,
    elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8,
  },
  Divider:  { height: 1, marginVertical: 10 },
  FinRow:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  FinLabel: { fontSize: 13, fontWeight: '600' },
  FinVal:   { fontSize: 13, fontWeight: '700' },
  TotalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, marginTop: 2, borderTopWidth: 1 },
  TotalLabel:{ fontSize: 14, fontWeight: '800' },
  TotalVal:  { fontSize: 17, fontWeight: '900' },

  // Person row
  PersonRow:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  Avatar:     { width: 46, height: 46, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  PersonName: { fontSize: 15, fontWeight: '800' },
  PersonSub:  { fontSize: 12, fontWeight: '600', marginTop: 2 },
  CircleBtn:  { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  AddressRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  AddressText:{ flex: 1, fontSize: 13, fontWeight: '600', lineHeight: 19 },
  EnRouteBadge:{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  EnRouteText: { fontSize: 10, fontWeight: '900', color: '#059669', letterSpacing: 0.4 },

  // Items
  ItemRow:   { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ItemIcon:  { width: 40, height: 40, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  ItemName:  { fontSize: 14, fontWeight: '700' },
  ItemMeta:  { fontSize: 11, fontWeight: '600', marginTop: 2 },
  ItemPrice: { fontSize: 14, fontWeight: '800' },

  // Footer
  Footer: {
    position: 'absolute', bottom: 0, width,
    padding: 16, borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  FooterRow: { flexDirection: 'row', gap: 12 },

  BtnPrim: {
    height: 54, borderRadius: 17, justifyContent: 'center', alignItems: 'center',
    flexDirection: 'row', gap: 8,
    elevation: 3, shadowColor: '#1B4D3E',
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6,
  },
  BtnPrimLabel: { color: '#FFF', fontSize: 15, fontWeight: '900' },

  BtnSec: {
    height: 54, borderRadius: 17, borderWidth: 1.5,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  BtnSecLabel: { fontSize: 14, fontWeight: '800' },

  BtnGradient: { borderRadius: 17, overflow: 'hidden' },
  BtnGradientInner: {
    height: 54, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10, paddingHorizontal: 16,
  },

  StatusPill: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 9, padding: 14, borderRadius: 16,
  },
  StatusPillText: { fontSize: 13, fontWeight: '700', flex: 1 },
  PillDot:   { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
});