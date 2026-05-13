// import React, { useState, useMemo, useEffect, useCallback } from 'react';
// import { 
//   View, Text, StyleSheet, ScrollView, TextInput, 
//   TouchableOpacity, RefreshControl, ActivityIndicator,
//   SafeAreaView, Image, Alert, StatusBar, Platform 
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { MotiView, AnimatePresence } from 'moti';
// import { 
//   ArrowLeft, Search, Calendar, MapPin, 
//   XCircle, Package, Trash2, Eye
// } from 'lucide-react-native';

// import { useTheme } from '../context/ThemeContext';
// import apiClient from '../services/apiClient';

// // 🎨 DESIGN SYSTEM
// const COLORS = {
//   forestGreen: {
//     400: '#66BB6A',
//     500: '#1B4D3E',
//     600: '#164239',
//     700: '#113731',
//     800: '#0C2B24',
//     900: '#081F1A',
//   },
//   white: '#FFFFFF',
//   offWhite: '#F8F9FA',
//   lightGray: '#E9ECEF',
//   gray: '#ADB5BD',
//   darkGray: '#495057',
//   charcoal: '#212529',
//   success: '#2D5F4C',
//   warning: '#D4A574',
//   error: '#C1554D',
// };

// export default function OrderHistoryScreen() {
//   const Navigation = useNavigation();
//   const { isDark: IsDark } = useTheme();

//   const [DbOrders, setDbOrders] = useState([]);
//   const [Loading, setLoading] = useState(true);
//   const [Refreshing, setRefreshing] = useState(false);
//   const [SearchQuery, setSearchQuery] = useState('');
//   const [ActiveFilter, setActiveFilter] = useState('All');
  
//   const Filters = ['All', 'Pending', 'Confirmed', 'In Transit', 'Settled', 'Completed', 'Cancelled'];

//   // HELPER: Reliable data extraction for C# PascalCase vs JS camelCase
//   const getVal = (obj, key) => {
//     if (!obj) return null;
//     const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
//     return obj[key] !== undefined ? obj[key] : obj[pascalKey];
//   };

//   const UI_THEME = {
//     Background: IsDark ? COLORS.forestGreen[900] : COLORS.offWhite,
//     Surface: IsDark ? COLORS.forestGreen[800] : COLORS.white,
//     CardSurface: IsDark ? COLORS.forestGreen[700] : COLORS.white,
//     TextPrimary: IsDark ? COLORS.white : COLORS.charcoal,
//     TextSecondary: IsDark ? COLORS.gray : COLORS.darkGray,
//     Primary: COLORS.forestGreen[500],
//     Border: IsDark ? COLORS.forestGreen[600] : COLORS.lightGray,
//     CardAlt: IsDark ? COLORS.forestGreen[800] : COLORS.offWhite,
//     Danger: COLORS.error,
//     Shadow: IsDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(27, 77, 62, 0.08)',
//   };

//   const FetchOrders = useCallback(async () => {
//     try {
//       const Response = await apiClient.get('/orders/marketplace/history');
//       setDbOrders(Response.data || []);
//     } catch (Err) {
//       console.error("Fetch Error:", Err);
//       Alert.alert('Error', 'Failed to load order history.');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => { FetchOrders(); }, [FetchOrders]);

//   const FilteredOrders = useMemo(() => {
//     let Result = [...DbOrders];
    
//     if (ActiveFilter !== 'All') {
//       Result = Result.filter(O => getVal(O, 'status')?.toLowerCase() === ActiveFilter.toLowerCase());
//     }
    
//     if (SearchQuery.trim() !== '') {
//       const Q = SearchQuery.toLowerCase();
//       Result = Result.filter(O => {
//         const idMatch = String(getVal(O, 'id')).toLowerCase().includes(Q);
//         const items = getVal(O, 'items') || [];
//         const productMatch = items.some(i => getVal(i, 'productName')?.toLowerCase().includes(Q));
//         return idMatch || productMatch;
//       });
//     }
    
//     return Result.sort((a, b) => new Date(getVal(b, 'createdAt')) - new Date(getVal(a, 'createdAt')));
//   }, [DbOrders, ActiveFilter, SearchQuery]);

//   const getStatusColor = (status) => {
//     switch(status?.toLowerCase()) {
//       case 'delivered': case 'completed': case 'settled': return COLORS.success;
//       case 'in transit': case 'shipped': case 'confirmed': return COLORS.forestGreen[400];
//       case 'pending': return COLORS.warning;
//       case 'cancelled': return COLORS.error;
//       default: return UI_THEME.Primary;
//     }
//   };

//   const OrderCard = ({ order, index }) => {
//     const items = getVal(order, 'items') || [];
//     const firstItem = items[0] || {};
//     // Extract image using the specific keys sent by your new backend logic
//     const orderImage = getVal(firstItem, 'imageUrl') || getVal(firstItem, 'image');
//     const status = getVal(order, 'status') || 'Pending';
//     const statusColor = getStatusColor(status);
//     const orderId = String(getVal(order, 'id'));
//     const totalAmount = getVal(order, 'totalAmount');

//     return (
//       <MotiView
//         from={{ opacity: 0, translateY: 20 }}
//         animate={{ opacity: 1, translateY: 0 }}
//         transition={{ delay: index * 50 }}
//         style={[styles.OrderCard, { backgroundColor: UI_THEME.CardSurface, borderColor: UI_THEME.Border }]}
//       >
//         <View style={[styles.StatusIndicator, { backgroundColor: statusColor }]} />
        
//         <View style={styles.CardBody}>
//           <View style={styles.CardHeader}>
//             <View style={[styles.IdBadge, { backgroundColor: UI_THEME.CardAlt }]}>
//               <Text style={[styles.IdText, { color: UI_THEME.TextSecondary }]}>
//                 #{orderId.substring(0, 8).toUpperCase()}
//               </Text>
//             </View>
//             <View style={[styles.StatusBadge, { borderColor: statusColor + '40' }]}>
//               <View style={[styles.StatusDot, { backgroundColor: statusColor }]} />
//               <Text style={[styles.StatusText, { color: statusColor }]}>{status}</Text>
//             </View>
//           </View>

//           <TouchableOpacity 
//             activeOpacity={0.8}
//             onPress={() => Navigation.navigate('TrackingScreen', { orderId, order })}
//           >
//             <View style={styles.MainRow}>
//               <Image 
//                 source={{ uri: orderImage || 'https://via.placeholder.com/150' }} 
//                 style={[styles.OrderImg, { borderColor: UI_THEME.Border }]} 
//               />
//               <View style={styles.DetailsContainer}>
//                 <Text style={[styles.ProductName, { color: UI_THEME.TextPrimary }]} numberOfLines={1}>
//                   {getVal(firstItem, 'productName') || 'Marketplace Order'}
//                 </Text>
//                 <Text style={[styles.ItemCount, { color: UI_THEME.Primary }]}>
//                   {items.length} {items.length === 1 ? 'item' : 'items'}
//                 </Text>
//                 <View style={styles.LocationRow}>
//                   <MapPin size={12} color={UI_THEME.TextSecondary} />
//                   <Text style={[styles.LocationText, { color: UI_THEME.TextSecondary }]} numberOfLines={1}>
//                     {getVal(order, 'deliveryAddress') || 'Address not set'}
//                   </Text>
//                 </View>
//               </View>
//               <View style={styles.PriceContainer}>
//                 <Text style={[styles.PriceText, { color: UI_THEME.TextPrimary }]}>
//                   R{parseFloat(totalAmount || 0).toFixed(2)}
//                 </Text>
//               </View>
//             </View>
//           </TouchableOpacity>

//           <View style={[styles.CardFooter, { borderTopColor: UI_THEME.Border }]}>
//             <View style={styles.FooterInfo}>
//               <Calendar size={14} color={UI_THEME.TextSecondary} />
//               <Text style={[styles.FooterText, { color: UI_THEME.TextSecondary }]}>
//                 {new Date(getVal(order, 'createdAt')).toLocaleDateString()}
//               </Text>
//             </View>
//             <TouchableOpacity 
//               onPress={() => Navigation.navigate('TrackingScreen', { orderId, order })}
//               style={[styles.ViewButton, { backgroundColor: UI_THEME.Primary }]}
//             >
//               <Eye size={14} color={COLORS.white} />
//               <Text style={styles.ViewButtonText}>View Details</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </MotiView>
//     );
//   };

//   return (
//     <SafeAreaView style={[styles.MainContainer, { backgroundColor: UI_THEME.Background }]}>
//       <View style={[styles.Header, { backgroundColor: UI_THEME.Surface }]}>
//         <TouchableOpacity onPress={() => Navigation.goBack()} style={styles.BackBtn}>
//           <ArrowLeft size={24} color={UI_THEME.TextPrimary} />
//         </TouchableOpacity>
//         <View style={styles.HeaderCenter}>
//           <Text style={[styles.HeaderTitle, { color: UI_THEME.TextPrimary }]}>My Orders</Text>
//         </View>
//         <View style={styles.HeaderIcon}><Package size={22} color={UI_THEME.Primary} /></View>
//       </View>

//       <View style={[styles.FilterBar, { backgroundColor: UI_THEME.Surface }]}>
//         <View style={[styles.SearchBox, { backgroundColor: UI_THEME.CardAlt }]}>
//           <Search size={18} color={UI_THEME.TextSecondary} />
//           <TextInput 
//             placeholder="Search your history..." 
//             style={[styles.SearchInput, { color: UI_THEME.TextPrimary }]}
//             value={SearchQuery}
//             onChangeText={setSearchQuery}
//             placeholderTextColor={UI_THEME.TextSecondary}
//           />
//         </View>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ChipScroll} contentContainerStyle={{ paddingHorizontal: 20 }}>
//           {Filters.map(F => (
//             <TouchableOpacity 
//               key={F} 
//               onPress={() => setActiveFilter(F)}
//               style={[styles.Chip, { backgroundColor: ActiveFilter === F ? UI_THEME.Primary : UI_THEME.CardAlt }]}
//             >
//               <Text style={[styles.ChipText, { color: ActiveFilter === F ? COLORS.white : UI_THEME.TextSecondary }]}>{F}</Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       {Loading ? (
//         <View style={styles.Center}><ActivityIndicator size="large" color={UI_THEME.Primary} /></View>
//       ) : (
//         <ScrollView 
//           contentContainerStyle={styles.ListContent}
//           refreshControl={<RefreshControl refreshing={Refreshing} onRefresh={() => {setRefreshing(true); FetchOrders();}} tintColor={UI_THEME.Primary}/>}
//         >
//           {FilteredOrders.length === 0 ? (
//             <View style={styles.EmptyBox}>
//               <Package size={60} color={UI_THEME.Border} />
//               <Text style={[styles.EmptyTitle, { color: UI_THEME.TextPrimary }]}>No orders found</Text>
//             </View>
//           ) : (
//             FilteredOrders.map((order, index) => <OrderCard key={getVal(order, 'id')} order={order} index={index} />)
//           )}
//         </ScrollView>
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   MainContainer: { flex: 1 },
//   Header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
//   BackBtn: { width: 40, height: 40, justifyContent: 'center' },
//   HeaderCenter: { flex: 1, alignItems: 'center' },
//   HeaderTitle: { fontSize: 18, fontWeight: '800' },
//   HeaderIcon: { width: 40, alignItems: 'flex-end' },
//   FilterBar: { paddingBottom: 12 },
//   SearchBox: { flexDirection: 'row', alignItems: 'center', margin: 16, paddingHorizontal: 12, borderRadius: 12, height: 45 },
//   SearchInput: { flex: 1, marginLeft: 8, fontSize: 14, fontWeight: '600' },
//   ChipScroll: { marginBottom: 4 },
//   Chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
//   ChipText: { fontSize: 12, fontWeight: '700' },
//   ListContent: { padding: 16 },
//   OrderCard: { borderRadius: 20, marginBottom: 16, borderWidth: 1, flexDirection: 'row', overflow: 'hidden' },
//   StatusIndicator: { width: 4 },
//   CardBody: { flex: 1, padding: 16 },
//   CardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
//   IdBadge: { padding: 6, borderRadius: 6 },
//   IdText: { fontSize: 10, fontWeight: '800' },
//   StatusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, gap: 4 },
//   StatusDot: { width: 6, height: 6, borderRadius: 3 },
//   StatusText: { fontSize: 10, fontWeight: '800' },
//   MainRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
//   OrderImg: { width: 60, height: 60, borderRadius: 12, borderWidth: 1 },
//   DetailsContainer: { flex: 1, marginLeft: 12 },
//   ProductName: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
//   ItemCount: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
//   LocationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
//   LocationText: { fontSize: 11, fontWeight: '500', flex: 1 },
//   PriceContainer: { alignItems: 'flex-end' },
//   PriceText: { fontSize: 16, fontWeight: '900' },
//   CardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, paddingTop: 12 },
//   FooterInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//   FooterText: { fontSize: 11, fontWeight: '700' },
//   ViewButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
//   ViewButtonText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
//   EmptyBox: { alignItems: 'center', marginTop: 100 },
//   EmptyTitle: { fontSize: 16, fontWeight: '700', marginTop: 12 },
//   Center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
// });










import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, 
  TouchableOpacity, RefreshControl, ActivityIndicator,
  SafeAreaView, Image, Alert, StatusBar, Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MotiView, AnimatePresence } from 'moti';
import { 
  ArrowLeft, Search, Calendar, MapPin, 
  XCircle, Package, Trash2, Eye
} from 'lucide-react-native';

import { useTheme } from '../context/ThemeContext';
import apiClient from '../services/apiClient';

// ─── Theme builder — mirrors DriverDashboard exactly ─────────────────────────────
const buildTheme = (isDark) => ({
  bg:           isDark ? '#0B1120' : '#F0F4F8',
  surface:      isDark ? '#141E30' : '#FFFFFF',
  card:         isDark ? '#1C2A3F' : '#FFFFFF',
  cardElevated: isDark ? '#243347' : '#F7FAFC',
  border:       isDark ? '#2A3C55' : '#E2EBF4',
  primary:      '#10B981',
  primaryDark:  '#059669',
  primaryGlow:  isDark ? 'rgba(16,185,129,0.18)' : 'rgba(16,185,129,0.10)',
  textPrimary:  isDark ? '#F0F6FF' : '#0D1B2A',
  textSecondary:isDark ? '#8BA4C2' : '#4A6080',
  textMuted:    isDark ? '#4E6A8A' : '#8DA0B8',
  divider:      isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
  shadow:       isDark ? '#000' : '#193B5F',
  success:      '#10B981',
  warning:      '#F59E0B',
  error:        '#EF4444',
  info:         '#3B82F6',
  white:        '#FFFFFF',
});

export default function OrderHistoryScreen() {
  const Navigation = useNavigation();
  const { isDark } = useTheme();
  const theme = useMemo(() => buildTheme(isDark), [isDark]);

  const [DbOrders, setDbOrders] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [Refreshing, setRefreshing] = useState(false);
  const [SearchQuery, setSearchQuery] = useState('');
  const [ActiveFilter, setActiveFilter] = useState('All');
  
  const Filters = ['All', 'Pending', 'Confirmed', 'In Transit', 'Settled', 'Completed', 'Cancelled'];

  // HELPER: Reliable data extraction for C# PascalCase vs JS camelCase
  const getVal = (obj, key) => {
    if (!obj) return null;
    const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
    return obj[key] !== undefined ? obj[key] : obj[pascalKey];
  };

  const FetchOrders = useCallback(async () => {
    try {
      const Response = await apiClient.get('/orders/marketplace/history');
      setDbOrders(Response.data || []);
    } catch (Err) {
      console.error("Fetch Error:", Err);
      Alert.alert('Error', 'Failed to load order history.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { FetchOrders(); }, [FetchOrders]);

  const FilteredOrders = useMemo(() => {
    let Result = [...DbOrders];
    
    if (ActiveFilter !== 'All') {
      Result = Result.filter(O => getVal(O, 'status')?.toLowerCase() === ActiveFilter.toLowerCase());
    }
    
    if (SearchQuery.trim() !== '') {
      const Q = SearchQuery.toLowerCase();
      Result = Result.filter(O => {
        const idMatch = String(getVal(O, 'id')).toLowerCase().includes(Q);
        const items = getVal(O, 'items') || [];
        const productMatch = items.some(i => getVal(i, 'productName')?.toLowerCase().includes(Q));
        return idMatch || productMatch;
      });
    }
    
    return Result.sort((a, b) => new Date(getVal(b, 'createdAt')) - new Date(getVal(a, 'createdAt')));
  }, [DbOrders, ActiveFilter, SearchQuery]);

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': case 'completed': case 'settled': return theme.success;
      case 'in transit': case 'shipped': case 'confirmed': return theme.info;
      case 'pending': return theme.warning;
      case 'cancelled': return theme.error;
      default: return theme.primary;
    }
  };

  const OrderCard = ({ order, index }) => {
    const items = getVal(order, 'items') || [];
    const firstItem = items[0] || {};
    const orderImage = getVal(firstItem, 'imageUrl') || getVal(firstItem, 'image');
    const status = getVal(order, 'status') || 'Pending';
    const statusColor = getStatusColor(status);
    const orderId = String(getVal(order, 'id'));
    const totalAmount = getVal(order, 'totalAmount');

    return (
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: index * 50 }}
        style={[styles.OrderCard, { backgroundColor: theme.card, borderColor: theme.border }]}
      >
        <View style={[styles.StatusIndicator, { backgroundColor: statusColor }]} />
        
        <View style={styles.CardBody}>
          <View style={styles.CardHeader}>
            <View style={[styles.IdBadge, { backgroundColor: theme.cardElevated }]}>
              <Text style={[styles.IdText, { color: theme.textMuted }]}>
                #{orderId.substring(0, 8).toUpperCase()}
              </Text>
            </View>
            <View style={[styles.StatusBadge, { borderColor: statusColor + '40' }]}>
              <View style={[styles.StatusDot, { backgroundColor: statusColor }]} />
              <Text style={[styles.StatusText, { color: statusColor }]}>{status}</Text>
            </View>
          </View>

          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => Navigation.navigate('TrackingScreen', { orderId, order })}
          >
            <View style={styles.MainRow}>
              <Image 
                source={{ uri: orderImage || 'https://via.placeholder.com/150' }} 
                style={[styles.OrderImg, { borderColor: theme.border }]} 
              />
              <View style={styles.DetailsContainer}>
                <Text style={[styles.ProductName, { color: theme.textPrimary }]} numberOfLines={1}>
                  {getVal(firstItem, 'productName') || 'Marketplace Order'}
                </Text>
                <Text style={[styles.ItemCount, { color: theme.primary }]}>
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </Text>
                <View style={styles.LocationRow}>
                  <MapPin size={12} color={theme.textSecondary} />
                  <Text style={[styles.LocationText, { color: theme.textSecondary }]} numberOfLines={1}>
                    {getVal(order, 'deliveryAddress') || 'Address not set'}
                  </Text>
                </View>
              </View>
              <View style={styles.PriceContainer}>
                <Text style={[styles.PriceText, { color: theme.textPrimary }]}>
                  R{parseFloat(totalAmount || 0).toFixed(2)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={[styles.CardFooter, { borderTopColor: theme.border }]}>
            <View style={styles.FooterInfo}>
              <Calendar size={14} color={theme.textSecondary} />
              <Text style={[styles.FooterText, { color: theme.textSecondary }]}>
                {new Date(getVal(order, 'createdAt')).toLocaleDateString()}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => Navigation.navigate('TrackingScreen', { orderId, order })}
              style={[styles.ViewButton, { backgroundColor: theme.primary }]}
            >
              <Eye size={14} color={theme.white} />
              <Text style={styles.ViewButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </MotiView>
    );
  };

  return (
    <SafeAreaView style={[styles.MainContainer, { backgroundColor: theme.bg }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.surface}
      />

      <View style={[styles.Header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => Navigation.goBack()} style={styles.BackBtn}>
          <ArrowLeft size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.HeaderCenter}>
          <Text style={[styles.HeaderTitle, { color: theme.textPrimary }]}>My Orders</Text>
        </View>
        <View style={styles.HeaderIcon}><Package size={22} color={theme.primary} /></View>
      </View>

      <View style={[styles.FilterBar, { backgroundColor: theme.surface }]}>
        <View style={[styles.SearchBox, { backgroundColor: theme.cardElevated, borderColor: theme.border }]}>
          <Search size={18} color={theme.textMuted} />
          <TextInput 
            placeholder="Search your history..." 
            style={[styles.SearchInput, { color: theme.textPrimary }]}
            value={SearchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.textMuted}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ChipScroll} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {Filters.map(F => (
            <TouchableOpacity 
              key={F} 
              onPress={() => setActiveFilter(F)}
              style={[
                styles.Chip,
                {
                  backgroundColor: ActiveFilter === F ? theme.primary : theme.cardElevated,
                  borderColor: ActiveFilter === F ? theme.primary : theme.border,
                }
              ]}
            >
              <Text style={[
                styles.ChipText,
                { color: ActiveFilter === F ? theme.white : theme.textSecondary }
              ]}>
                {F}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {Loading ? (
        <View style={styles.Center}><ActivityIndicator size="large" color={theme.primary} /></View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.ListContent}
          refreshControl={
            <RefreshControl
              refreshing={Refreshing}
              onRefresh={() => { setRefreshing(true); FetchOrders(); }}
              tintColor={theme.primary}
              colors={[theme.primary]}
            />
          }
        >
          {FilteredOrders.length === 0 ? (
            <View style={styles.EmptyBox}>
              <Package size={60} color={theme.border} />
              <Text style={[styles.EmptyTitle, { color: theme.textPrimary }]}>No orders found</Text>
              <Text style={[styles.EmptySubtitle, { color: theme.textMuted }]}>
                Try adjusting your search or filter
              </Text>
            </View>
          ) : (
            FilteredOrders.map((order, index) => (
              <OrderCard key={getVal(order, 'id')} order={order} index={index} />
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  MainContainer: { flex: 1 },
  Header: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, borderBottomWidth: 1,
  },
  BackBtn: { width: 40, height: 40, justifyContent: 'center' },
  HeaderCenter: { flex: 1, alignItems: 'center' },
  HeaderTitle: { fontSize: 18, fontWeight: '800' },
  HeaderIcon: { width: 40, alignItems: 'flex-end' },
  FilterBar: { paddingBottom: 12 },
  SearchBox: {
    flexDirection: 'row', alignItems: 'center',
    margin: 16, paddingHorizontal: 12,
    borderRadius: 12, height: 45, borderWidth: 1,
  },
  SearchInput: { flex: 1, marginLeft: 8, fontSize: 14, fontWeight: '600' },
  ChipScroll: { marginBottom: 4 },
  Chip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, marginRight: 8, borderWidth: 1,
  },
  ChipText: { fontSize: 12, fontWeight: '700' },
  ListContent: { padding: 16 },
  OrderCard: {
    borderRadius: 20, marginBottom: 16, borderWidth: 1,
    flexDirection: 'row', overflow: 'hidden',
  },
  StatusIndicator: { width: 4 },
  CardBody: { flex: 1, padding: 16 },
  CardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  IdBadge: { padding: 6, borderRadius: 6 },
  IdText: { fontSize: 10, fontWeight: '800' },
  StatusBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 12, borderWidth: 1, gap: 4,
  },
  StatusDot: { width: 6, height: 6, borderRadius: 3 },
  StatusText: { fontSize: 10, fontWeight: '800' },
  MainRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  OrderImg: { width: 60, height: 60, borderRadius: 12, borderWidth: 1 },
  DetailsContainer: { flex: 1, marginLeft: 12 },
  ProductName: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
  ItemCount: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  LocationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  LocationText: { fontSize: 11, fontWeight: '500', flex: 1 },
  PriceContainer: { alignItems: 'flex-end' },
  PriceText: { fontSize: 16, fontWeight: '900' },
  CardFooter: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', borderTopWidth: 1, paddingTop: 12,
  },
  FooterInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  FooterText: { fontSize: 11, fontWeight: '700' },
  ViewButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8,
  },
  ViewButtonText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  EmptyBox: { alignItems: 'center', marginTop: 100 },
  EmptyTitle: { fontSize: 16, fontWeight: '700', marginTop: 12 },
  EmptySubtitle: { fontSize: 13, fontWeight: '500', marginTop: 4 },
  Center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});