import React, { useEffect, useState, useCallback } from 'react';
import { 
  StyleSheet, Text, View, FlatList, Linking, Platform,
  TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl, StatusBar
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { 
  Package, ChevronRight, MapPin, ArrowLeft, 
  User, Phone, ExternalLink, Navigation as NavIcon 
} from 'lucide-react-native';

import apiClient from '../services/apiClient'; 
import { useTheme } from '../context/ThemeContext';

/**
 * ActiveOrders Screen (Seller Fulfillment View)
 * Theme: Professional Navy / Logistics-Focused
 */
const ActiveOrders = () => {
  const Navigation = useNavigation();
  const { colors: Colors, isDark: IsDark } = useTheme();

  const [Orders, setOrders] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [Refreshing, setRefreshing] = useState(false);

  // UI THEME MAPPING - Consistent with Inventory and AddProduct
  const UI = {
    Bg: IsDark ? '#0F172A' : '#F8FAFC',
    Card: IsDark ? '#1E293B' : '#FFFFFF',
    Text: IsDark ? '#F8FAFC' : '#0F172A',
    Muted: IsDark ? '#94A3B8' : '#64748B',
    Primary: '#008148',
    Border: IsDark ? '#334155' : '#E2E8F0',
    Accent: IsDark ? '#0F172A' : '#F1F5F9'
  };

  useFocusEffect(
    useCallback(() => {
      FetchActiveOrders();
    }, [])
  );

  const FetchActiveOrders = async () => {
    try {
      setLoading(true);
      const Response = await apiClient.get('/seller/orders/active'); 
      setOrders(Response.data || []);
    } catch (Err) {
      console.error("Fulfillment Fetch Error:", Err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const OpenInMaps = (Address) => {
    const Url = Platform.select({
      ios: `maps:0,0?q=${Address}`,
      android: `geo:0,0?q=${Address}`,
    });
    Linking.openURL(Url);
  };

  const MakeCall = (PhoneNumber) => {
    if (!PhoneNumber) return;
    Linking.openURL(`tel:${PhoneNumber}`);
  };

  const GetStatusStyles = (Status) => {
    switch (Status?.toLowerCase()) {
      case 'pending': return { bg: '#FEF3C7', text: '#D97706' };
      case 'accepted': return { bg: '#DBEAFE', text: '#2563EB' };
      case 'dispatched': return { bg: '#F3E8FF', text: '#7C3AED' };
      case 'arrived': return { bg: '#DCFCE7', text: '#16A34A' };
      default: return { bg: UI.Accent, text: UI.Muted };
    }
  };

  const RenderOrderCard = ({ item: Item }) => {
    const OrderIdStr = (Item.OrderId || Item.orderId || '').toString();
    const Address = Item.ShippingDetails?.Address || Item.shippingDetails?.address || Item.deliveryAddress || 'Address not provided';
    const Customer = Item.ShippingDetails?.CustomerName || Item.shippingDetails?.customerName || 'Guest Buyer';
    const Contact = Item.ShippingDetails?.ReceiverPhone || Item.shippingDetails?.receiverPhone || Item.receiverPhone;
    const StatusStyle = GetStatusStyles(Item.Status || Item.status);

    return (
      <View style={[styles.Card, { backgroundColor: UI.Card, borderColor: UI.Border }]}>
        {/* CARD TOP: ID & STATUS */}
        <TouchableOpacity 
           activeOpacity={0.8}
           onPress={() => Navigation.navigate('CustomerOrders', { orderId: Item.OrderId || Item.orderId })}
           style={[styles.CardHeader, { borderBottomColor: UI.Border }]}
        >
          <View style={[styles.IdBadge, { backgroundColor: UI.Bg }]}>
            <Text style={[styles.IdText, { color: UI.Text }]}>#{OrderIdStr.toUpperCase().slice(0, 8)}</Text>
          </View>
          <View style={[styles.StatusBadge, { backgroundColor: StatusStyle.bg }]}>
            <View style={[styles.StatusDot, { backgroundColor: StatusStyle.text }]} />
            <Text style={[styles.StatusText, { color: StatusStyle.text }]}>
              {(Item.Status || Item.status || 'Pending').toUpperCase()}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.CardBody}>
          {/* INTERACTIVE DELIVERY SECTION */}
          <TouchableOpacity 
            style={[styles.AddressBox, { backgroundColor: UI.Bg, borderColor: UI.Border }]} 
            onPress={() => OpenInMaps(Address)}
          >
            <View style={[styles.IconCircle, { backgroundColor: UI.Card }]}>
              <NavIcon size={18} color={UI.Primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.MiniLabel, { color: UI.Muted }]}>Ship To</Text>
              <Text style={[styles.AddressText, { color: UI.Text }]} numberOfLines={2}>{Address}</Text>
            </View>
            <ExternalLink size={16} color={UI.Muted} />
          </TouchableOpacity>

          {/* CUSTOMER INFO & QUICK CALL */}
          <View style={styles.CustomerRow}>
            <View style={styles.UserInfo}>
               <View style={[styles.Avatar, { backgroundColor: UI.Accent }]}>
                 <User size={16} color={UI.Primary} />
               </View>
               <View>
                 <Text style={[styles.MiniLabel, { color: UI.Muted }]}>Customer</Text>
                 <Text style={[styles.CustomerName, { color: UI.Text }]}>{Customer}</Text>
               </View>
            </View>

            {Contact && (
              <TouchableOpacity 
                style={[styles.CallAction, { backgroundColor: UI.Primary }]} 
                onPress={() => MakeCall(Contact)}
              >
                <Phone size={14} color="#FFF" />
                <Text style={styles.CallActionText}>Call</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={[styles.Divider, { backgroundColor: UI.Border }]} />
          
          {/* FOOTER: EARNINGS & NAVIGATION */}
          <View style={styles.CardFooter}>
            <View>
              <Text style={[styles.MiniLabel, { color: UI.Muted }]}>Earnings (ZAR)</Text>
              <Text style={[styles.PriceVal, { color: UI.Text }]}>
                R {(Number(Item.TotalAmount || Item.totalAmount) || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <TouchableOpacity 
                onPress={() => Navigation.navigate('SellerOrderDetails', { orderId: Item.OrderId || Item.orderId })}
                style={[styles.DetailsBtn, { backgroundColor: UI.Primary + '15' }]}
            >
              <Text style={[styles.DetailsBtnText, { color: UI.Primary }]}>View Items</Text>
              <ChevronRight size={16} color={UI.Primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.Main, { backgroundColor: UI.Bg }]}>
      <StatusBar barStyle={IsDark ? 'light-content' : 'dark-content'} />
      
      <View style={[styles.Header, { backgroundColor: UI.Card, borderBottomColor: UI.Border }]}>
        <TouchableOpacity style={[styles.BackBtn, { backgroundColor: UI.Bg }]} onPress={() => Navigation.goBack()}>
          <ArrowLeft color={UI.Text} size={24} />
        </TouchableOpacity>
        <View style={styles.HeaderTitleArea}>
          <Text style={[styles.HeaderTitle, { color: UI.Text }]}>Active Shipments</Text>
          <Text style={[styles.HeaderSub, { color: UI.Muted }]}>{Orders.length} pending fulfillment</Text>
        </View>
        <Package size={24} color={UI.Primary} />
      </View>

      <FlatList
        data={Orders}
        renderItem={RenderOrderCard}
        keyExtractor={Item => (Item.OrderId || Item.orderId || Math.random()).toString()}
        contentContainerStyle={styles.ListContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={Refreshing} onRefresh={FetchActiveOrders} tintColor={UI.Primary} />}
        ListEmptyComponent={
          <View style={styles.EmptyState}>
            <Package size={80} color={UI.Border} strokeWidth={1} />
            <Text style={[styles.EmptyTitle, { color: UI.Text }]}>All caught up!</Text>
            <Text style={[styles.EmptySub, { color: UI.Muted }]}>New orders will appear here for processing.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Main: { flex: 1 },
  Header: { 
    paddingHorizontal: 20, paddingVertical: 18, 
    flexDirection: 'row', alignItems: 'center',
    borderBottomWidth: 1
  },
  HeaderTitleArea: { flex: 1, marginLeft: 15 },
  HeaderTitle: { fontSize: 20, fontWeight: '900' },
  HeaderSub: { fontSize: 12, fontWeight: '600' },
  BackBtn: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  
  ListContainer: { padding: 16, paddingBottom: 40 },
  Card: { borderRadius: 28, marginBottom: 16, borderWidth: 1, overflow: 'hidden' },
  CardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  IdBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  IdText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  StatusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
  StatusDot: { width: 6, height: 6, borderRadius: 3 },
  StatusText: { fontSize: 10, fontWeight: '900' },
  
  CardBody: { padding: 16 },
  AddressBox: { 
    flexDirection: 'row', alignItems: 'center', 
    padding: 14, borderRadius: 20, gap: 12, borderWidth: 1 
  },
  IconCircle: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  MiniLabel: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 },
  AddressText: { fontSize: 14, fontWeight: '700', lineHeight: 20 },
  
  CustomerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  UserInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  Avatar: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  CustomerName: { fontSize: 15, fontWeight: '800' },
  
  CallAction: { 
    flexDirection: 'row', alignItems: 'center', 
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, gap: 6 
  },
  CallActionText: { color: '#FFF', fontSize: 13, fontWeight: '900' },

  Divider: { height: 1, marginVertical: 16 },
  CardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  PriceVal: { fontSize: 20, fontWeight: '900' },
  DetailsBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, gap: 4 },
  DetailsBtnText: { fontSize: 13, fontWeight: '800' },

  EmptyState: { alignItems: 'center', marginTop: 120, paddingHorizontal: 40 },
  EmptyTitle: { fontSize: 22, fontWeight: '900', marginTop: 20 },
  EmptySub: { textAlign: 'center', marginTop: 8, fontSize: 14, fontWeight: '600' }
});

export default ActiveOrders;