


import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert, Platform, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ArrowLeft, HelpCircle, Clock } from 'lucide-react-native'; 

import { useTheme } from '../context/ThemeContext';
import DocumentSection from './components/DocumentSection';
import apiClient from '../services/apiClient';

export default function OrderDetailsScreen() {
  const Route = useRoute();
  const Navigation = useNavigation();
  const { colors: Colors, isDark: IsDark } = useTheme();
  
  const [isCancelling, setIsCancelling] = useState(false);

  const Order = Route.params?.order;

  const UI_THEME = {
    // MODIFIED BACKGROUND LOGIC: 
    // If Dark Mode, use '#0F172A' (Deep Navy) or '#000000' (Black). 
    // Otherwise, use the default theme background.
    Background: IsDark ? '#0F172A' : Colors.Background, 
    Card: Colors.Surface,
    TextPrimary: Colors.TextPrimary,
    TextSecondary: Colors.TextSecondary,
    Border: Colors.Border,
    Primary: Colors.Primary,
    Muted: Colors.Slate400,
  };

  const handleCancelOrder = async () => {
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this shipment? Funds will be returned to your wallet balance.",
      [
        { text: "Keep Order", style: "cancel" },
        { 
          text: "Yes, Cancel", 
          style: "destructive",
          onPress: async () => {
            try {
              setIsCancelling(true);
              await apiClient.post(`/orders/${Order.id}/cancel`);
              Alert.alert("Order Cancelled", "Your order has been cancelled and funds have been refunded to your wallet.");
              Navigation.goBack();
            } catch (error) {
              const msg = error.response?.data?.message || "Failed to cancel order.";
              Alert.alert("Error", msg);
            } finally {
              setIsCancelling(false);
            }
          }
        }
      ]
    );
  };

  if (!Order) {
    return (
      <SafeAreaView style={[styles.ErrorContainer, { backgroundColor: UI_THEME.Background }]}>
        <Text style={[styles.ErrorText, { color: UI_THEME.TextSecondary }]}>No order details found.</Text>
        <TouchableOpacity 
          onPress={() => Navigation.goBack()} 
          style={[styles.BackBtn, { backgroundColor: UI_THEME.Card, borderColor: UI_THEME.Border }]}
        >
          <Text style={{ color: UI_THEME.Primary }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const IsInternational = Order.isInternational;
  const RawStatus = Order.status ? Order.status.toUpperCase().replace(/\s+/g, '') : 'PENDING';

  const GetStatusStyle = (Status) => {
    switch (Status) {
      case 'PENDING': 
        return { bg: IsDark ? '#2D1A05' : '#fff7ed', text: '#f97316', label: 'Awaiting Pickup' };
      case 'CONFIRMED':
      case 'ACCEPTED': 
        return { bg: IsDark ? '#062010' : '#f0fdf4', text: '#16a34a', label: 'Confirmed' };
      case 'SHIPPED':
      case 'INTRANSIT': 
        return { bg: IsDark ? '#081C36' : '#eff6ff', text: '#2563eb', label: 'In Transit' };
      case 'DELIVERED': 
        return { bg: IsDark ? '#042117' : '#ecfdf5', text: '#059669', label: 'Delivered' };
      case 'CANCELLED': 
        return { bg: IsDark ? '#2D0A0A' : '#fef2f2', text: '#dc2626', label: 'Cancelled' };
      default: 
        return { bg: UI_THEME.Card, text: UI_THEME.TextSecondary, label: Status };
    }
  };

  const StatusStyle = GetStatusStyle(RawStatus);
  const Cost = Order.totalAmount || Order.estimatedCost || 0;

  const OrderDate = Order.createdAt 
    ? new Date(Order.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }) 
    : 'Pending';
    
  const ArrivalDate = Order.estimatedArrival 
    ? new Date(Order.estimatedArrival).toLocaleString('en-ZA', { 
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
      })
    : (IsInternational ? "7-14 Days" : "Awaiting Seller ETA");

  return (
    <SafeAreaView style={[styles.Container, { backgroundColor: UI_THEME.Background }]}>
      <View style={[styles.Header, { borderBottomColor: UI_THEME.Border, backgroundColor: UI_THEME.Background }]}>
        <TouchableOpacity 
          onPress={() => Navigation.goBack()} 
          style={[styles.BackBtn, { backgroundColor: UI_THEME.Card, borderColor: UI_THEME.Border }]}
        >
          <ArrowLeft size={24} color={UI_THEME.TextPrimary} />
        </TouchableOpacity>
        <View style={styles.HeaderTextContainer}>
            <Text style={[styles.HeaderLabel, { color: UI_THEME.Muted }]}>ORDER REFERENCE</Text>
            <Text style={[styles.HeaderTitle, { color: UI_THEME.TextPrimary }]}>#{Order.id?.toString().slice(-8).toUpperCase() || 'NEW'}</Text>
        </View>
        <TouchableOpacity style={styles.HelpBtn} onPress={() => Linking.openURL('mailto:support@agro-move.za')}>
          <HelpCircle size={22} color={UI_THEME.TextSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.Scroll}>
        <View style={[styles.Banner, { backgroundColor: UI_THEME.Card, borderColor: UI_THEME.Border }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.BannerLabel, { color: UI_THEME.TextSecondary }]}>CURRENT STATUS</Text>
            <Text style={[styles.BannerStatus, { color: StatusStyle.text }]}>{StatusStyle.label}</Text>
          </View>
          <View style={[styles.StatusBadge, { backgroundColor: StatusStyle.bg }]}>
              <Text style={{ fontSize: 22 }}>{IsInternational ? '🌍' : '🚚'}</Text>
          </View>
        </View>

        {Order.estimatedArrival && (
          <View style={[styles.EtaBanner, { backgroundColor: IsDark ? '#042117' : '#ecfdf5' }]}>
             <Clock size={16} color="#059669" />
             <Text style={styles.EtaText}>Scheduled for: {ArrivalDate}</Text>
          </View>
        )}

        <Text style={[styles.SectionTitle, { color: UI_THEME.TextPrimary }]}>Logistics Path</Text>
        <View style={[styles.RouteCard, { backgroundColor: UI_THEME.Card, borderColor: UI_THEME.Border }]}>
          <View style={styles.RouteLineContainer}>
            <View style={[styles.Dot, { backgroundColor: '#10b981' }]} />
            <View style={[styles.VerticalLine, { backgroundColor: UI_THEME.Border }]} />
            <View style={[styles.Dot, { backgroundColor: IsInternational ? '#3b82f6' : '#10b981' }]} />
          </View>
          <View style={styles.LocationBlock}>
            <View>
              <Text style={[styles.LocationLabel, { color: UI_THEME.Muted }]}>PICKUP FROM</Text>
              <Text style={[styles.LocationValue, { color: UI_THEME.TextPrimary }]}>{Order.pickupLocation || 'Seller Warehouse'}</Text>
            </View>
            <View style={{ marginTop: 24 }}>
              <Text style={[styles.LocationLabel, { color: UI_THEME.Muted }]}>DESTINATION</Text>
              <Text style={[styles.LocationValue, { color: UI_THEME.TextPrimary }]}>
                {Order.deliveryAddress || Order.destination || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.ScheduleRow, { backgroundColor: UI_THEME.Card }]}>
            <View style={styles.ScheduleItem}>
                <Text style={[styles.ScheduleLabel, { color: UI_THEME.TextSecondary }]}>BOOKING DATE</Text>
                <Text style={[styles.ScheduleValue, { color: UI_THEME.TextPrimary }]}>{OrderDate}</Text>
            </View>
            <View style={[styles.ScheduleItem, { borderLeftWidth: 1, borderLeftColor: UI_THEME.Border }]}>
                <Text style={[styles.ScheduleLabel, { color: UI_THEME.TextSecondary }]}>EST. ARRIVAL</Text>
                <Text style={[styles.ScheduleValue, { color: UI_THEME.TextPrimary }]}>{ArrivalDate}</Text>
            </View>
        </View>

        <DocumentSection isInternational={IsInternational} docs={Order.documents} />

        <Text style={[styles.SectionTitle, { color: UI_THEME.TextPrimary }]}>Cargo Information</Text>
        <View style={styles.Grid}>
          <View style={[styles.GridItem, { backgroundColor: UI_THEME.Card, borderColor: UI_THEME.Border }]}>
            <Text style={[styles.GridLabel, { color: UI_THEME.Muted }]}>COMMODITY</Text>
            <Text style={[styles.GridValue, { color: UI_THEME.TextPrimary }]}>{Order.produceType || 'General Agro'}</Text>
          </View>
          <View style={[styles.GridItem, { backgroundColor: UI_THEME.Card, borderColor: UI_THEME.Border }]}>
            <Text style={[styles.GridLabel, { color: UI_THEME.Muted }]}>WEIGHT</Text>
            <Text style={[styles.GridValue, { color: UI_THEME.TextPrimary }]}>{Order.weight || '0'} KG</Text>
          </View>
        </View>

        <Text style={[styles.SectionTitle, { color: UI_THEME.TextPrimary }]}>Financial Summary</Text>
        <View style={[styles.PaymentBox, { backgroundColor: UI_THEME.Card, borderColor: UI_THEME.Border }]}>
          <View style={styles.PaymentDetailRow}>
            <Text style={[styles.PaymentLabel, { color: UI_THEME.TextSecondary }]}>Product & Logistics</Text>
            <Text style={[styles.PaymentVal, { color: UI_THEME.TextPrimary }]}>R {(Cost * 0.92).toLocaleString()}</Text>
          </View>
          <View style={styles.PaymentDetailRow}>
            <Text style={[styles.PaymentLabel, { color: UI_THEME.TextSecondary }]}>VAT & Service Fee (8%)</Text>
            <Text style={[styles.PaymentVal, { color: UI_THEME.TextPrimary }]}>R {(Cost * 0.08).toLocaleString()}</Text>
          </View>
          <View style={[styles.Divider, { backgroundColor: UI_THEME.Border }]} />
          <View style={styles.TotalRow}>
            <Text style={[styles.TotalLabel, { color: UI_THEME.TextPrimary }]}>Total Paid (ZAR)</Text>
            <Text style={[styles.TotalValue, { color: IsInternational ? '#2563eb' : '#059669' }]}>
                R {Cost.toLocaleString()}
            </Text>
          </View>
        </View>

        {(RawStatus === 'PENDING' || RawStatus === 'ACCEPTED') && (
          <TouchableOpacity 
            style={[
              styles.CancelButton, 
              { 
                backgroundColor: IsDark ? '#311' : '#fff1f2', 
                borderColor: IsDark ? '#611' : '#ffe4e6',
                opacity: isCancelling ? 0.7 : 1 
              }
            ]} 
            onPress={handleCancelOrder}
            disabled={isCancelling}
          >
            {isCancelling ? (
              <ActivityIndicator color="#dc2626" />
            ) : (
              <Text style={styles.CancelButtonText}>Cancel Shipment & Refund</Text>
            )}
          </TouchableOpacity>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: { flex: 1 },
  ErrorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  ErrorText: { fontSize: 16, marginBottom: 10 },
  Header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 0 : 20, paddingBottom: 15, borderBottomWidth: 1 },
  HeaderTextContainer: { alignItems: 'center' },
  HeaderLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  HeaderTitle: { fontSize: 18, fontWeight: '900', marginTop: 2 },
  BackBtn: { width: 45, height: 45, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  HelpBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  Scroll: { padding: 20 },
  Banner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, padding: 20, borderRadius: 24, borderWidth: 1 },
  BannerLabel: { fontSize: 11, fontWeight: '800', marginBottom: 4 },
  BannerStatus: { fontSize: 20, fontWeight: '900' },
  StatusBadge: { width: 50, height: 50, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  EtaBanner: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 15, gap: 8, marginBottom: 20 },
  EtaText: { color: '#059669', fontWeight: '700', fontSize: 13 },
  SectionTitle: { fontSize: 16, fontWeight: '900', marginBottom: 15, marginTop: 10 },
  RouteCard: { padding: 24, borderRadius: 24, flexDirection: 'row', borderWidth: 1, marginBottom: 20 },
  RouteLineContainer: { alignItems: 'center', width: 20, marginRight: 15, paddingTop: 8 },
  Dot: { width: 12, height: 12, borderRadius: 6 },
  VerticalLine: { width: 2, height: 50, marginVertical: 4 },
  LocationBlock: { flex: 1 },
  LocationLabel: { fontSize: 10, fontWeight: '800', marginBottom: 4 },
  LocationValue: { fontSize: 16, fontWeight: '800', lineHeight: 22 },
  ScheduleRow: { flexDirection: 'row', borderRadius: 20, marginBottom: 25, paddingVertical: 18 },
  ScheduleItem: { flex: 1, alignItems: 'center' },
  ScheduleLabel: { fontSize: 9, fontWeight: '800', marginBottom: 4 },
  ScheduleValue: { fontSize: 14, fontWeight: '900' },
  Grid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  GridItem: { flex: 1, padding: 18, borderRadius: 20, borderWidth: 1 },
  GridLabel: { fontSize: 10, fontWeight: '800', marginBottom: 6 },
  GridValue: { fontSize: 15, fontWeight: '800' },
  PaymentBox: { padding: 20, borderRadius: 24, borderWidth: 1 },
  PaymentDetailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  PaymentLabel: { fontWeight: '600', fontSize: 14 },
  PaymentVal: { fontWeight: '700', fontSize: 14 },
  Divider: { height: 1, marginVertical: 15 },
  TotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  TotalLabel: { fontSize: 16, fontWeight: '800' },
  TotalValue: { fontSize: 24, fontWeight: '900' },
  CancelButton: { marginTop: 30, alignItems: 'center', padding: 20, borderRadius: 20, borderWidth: 1 },
  CancelButtonText: { fontSize: 15, fontWeight: '800', color: '#dc2626' }
});