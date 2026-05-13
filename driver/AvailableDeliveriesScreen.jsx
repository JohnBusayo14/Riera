// import React, { useState, useCallback, useMemo, useRef } from 'react';
// import {
//   View, Text, StyleSheet, FlatList, TouchableOpacity,
//   SafeAreaView, StatusBar, RefreshControl, ActivityIndicator,
//   Platform, Animated,
// } from 'react-native';
// import { MotiView } from 'moti';
// import {
//   Package, MapPin, ChevronRight, ChevronLeft,
//   Zap, Clock, Filter, Search,
// } from 'lucide-react-native';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import LottieView from 'lottie-react-native';
// import apiClient from '../services/apiClient';
// import { useTheme } from '../context/ThemeContext';

// // ─── Theme builder ──────────────────────────────────────────────────────────────
// const buildTheme = (isDark) => ({
//   bg:           isDark ? '#0B1120' : '#F0F4F8',
//   surface:      isDark ? '#141E30' : '#FFFFFF',
//   card:         isDark ? '#1C2A3F' : '#FFFFFF',
//   border:       isDark ? '#2A3C55' : '#E2EBF4',
//   textPrimary:  isDark ? '#F0F6FF' : '#0D1B2A',
//   textSecondary:isDark ? '#8BA4C2' : '#4A6080',
//   textMuted:    isDark ? '#4E6A8A' : '#8DA0B8',
//   headerTop:    isDark ? '#0D1B2A' : '#0D2137',
//   headerBottom: isDark ? '#0F2744' : '#0A3459',
//   primary:      '#10B981',
//   primaryGlow:  isDark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.08)',
//   white:        '#FFFFFF',
//   shadow:       isDark ? '#000' : '#193B5F',
// });

// // ─── Status config ───────────────────────────────────────────────────────────────
// const STATUS_CONFIG = {
//   PENDING:    { label: 'NEW OFFER',  bg: '#EF444422', text: '#EF4444', dot: '#EF4444' },
//   ACCEPTED:   { label: 'ACCEPTED',   bg: '#3B82F622', text: '#3B82F6', dot: '#3B82F6' },
//   ASSIGNED:   { label: 'ASSIGNED',   bg: '#8B5CF622', text: '#8B5CF6', dot: '#8B5CF6' },
//   DISPATCHED: { label: 'EN ROUTE',   bg: '#F59E0B22', text: '#F59E0B', dot: '#F59E0B' },
//   ARRIVED:    { label: 'ARRIVED',    bg: '#10B98122', text: '#10B981', dot: '#10B981' },
// };

// const getStatusConfig = (status) =>
//   STATUS_CONFIG[status?.toUpperCase()] || STATUS_CONFIG.PENDING;

// // ─── Job Card ────────────────────────────────────────────────────────────────────
// const JobCard = ({ item, index, navigation, theme }) => {
//   const orderId = item.OrderId || item.orderId;
//   const offerId = item.Id || item.id;
//   const status  = (item.OrderStatus || item.status || 'Pending').toUpperCase();
//   const price   = item.Price || item.price || 0;
//   const address = item.DeliveryAddress || item.deliveryAddress || 'Address Unavailable';
//   const title   = item.OrderTitle || item.orderTitle || 'Delivery Job';
//   const cfg     = getStatusConfig(status);
//   const isNew   = status === 'PENDING';

//   return (
//     <MotiView
//       from={{ opacity: 0, translateY: 18 }}
//       animate={{ opacity: 1, translateY: 0 }}
//       transition={{ type: 'spring', delay: index * 70, damping: 18 }}
//     >
//       <TouchableOpacity
//         activeOpacity={0.88}
//         onPress={() => navigation.navigate('DriverOrderDetails', { orderId, offerId })}
//         style={[styles.card, {
//           backgroundColor: theme.card,
//           borderColor: isNew ? '#EF444430' : theme.border,
//           shadowColor: theme.shadow,
//         }]}
//       >
//         {/* Top row: status + price */}
//         <View style={styles.cardTop}>
//           <View style={[styles.statusPill, { backgroundColor: cfg.bg }]}>
//             {isNew && (
//               <MotiView
//                 from={{ opacity: 0.3 }} animate={{ opacity: 1 }}
//                 transition={{ loop: true, duration: 800, type: 'timing' }}
//                 style={[styles.statusDot, { backgroundColor: cfg.dot }]}
//               />
//             )}
//             {!isNew && <View style={[styles.statusDot, { backgroundColor: cfg.dot }]} />}
//             <Text style={[styles.statusText, { color: cfg.text }]}>{cfg.label}</Text>
//           </View>

//           <View style={styles.priceContainer}>
//             <Text style={[styles.priceCurrency, { color: theme.primary }]}>R</Text>
//             <Text style={[styles.priceValue, { color: theme.textPrimary }]}>
//               {Number(price).toFixed(2)}
//             </Text>
//           </View>
//         </View>

//         {/* Body: icon + info */}
//         <View style={styles.cardBody}>
//           <View style={[styles.jobIconRing, { backgroundColor: theme.primary + '20' }]}>
//             <Package color={theme.primary} size={22} />
//           </View>
//           <View style={styles.jobInfo}>
//             <Text style={[styles.jobTitle, { color: theme.textPrimary }]} numberOfLines={1}>
//               {title}
//             </Text>
//             <Text style={[styles.refText, { color: theme.textMuted }]}>
//               REF #{offerId?.toString().slice(-6).toUpperCase()}
//             </Text>
//           </View>
//         </View>

//         {/* Divider */}
//         <View style={[styles.divider, { backgroundColor: theme.border }]} />

//         {/* Footer: address + arrow */}
//         <View style={styles.cardFooter}>
//           <View style={styles.addressRow}>
//             <MapPin size={13} color={theme.textMuted} />
//             <Text style={[styles.addressText, { color: theme.textSecondary }]} numberOfLines={1}>
//               {address}
//             </Text>
//           </View>
//           <View style={[styles.arrowCircle, { backgroundColor: theme.primary }]}>
//             <ChevronRight color="#fff" size={17} />
//           </View>
//         </View>
//       </TouchableOpacity>
//     </MotiView>
//   );
// };

// // ─── Empty State ─────────────────────────────────────────────────────────────────
// const EmptyState = ({ onRefresh, theme }) => (
//   <View style={styles.emptyWrapper}>
//     <LottieView
//       source={require('../assets/lottie/empty-box.json')}
//       autoPlay loop style={styles.lottie}
//     />
//     <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No Jobs Found</Text>
//     <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
//       We'll notify you when new delivery requests arrive.
//     </Text>
//     <TouchableOpacity
//       style={[styles.refreshBtn, { backgroundColor: theme.primary }]}
//       onPress={onRefresh}
//       activeOpacity={0.85}
//     >
//       <Zap size={16} color="#fff" />
//       <Text style={styles.refreshBtnText}>Refresh Now</Text>
//     </TouchableOpacity>
//   </View>
// );

// // ─── Main Screen ─────────────────────────────────────────────────────────────────
// const AvailableDeliveriesScreen = () => {
//   const navigation = useNavigation();
//   const { isDark } = useTheme();
//   const theme = useMemo(() => buildTheme(isDark), [isDark]);

//   const [refreshing, setRefreshing] = useState(false);
//   const [loading,    setLoading]    = useState(true);
//   const [jobs,       setJobs]       = useState([]);

//   const fetchMyOffers = useCallback(async () => {
//     try {
//       const response = await apiClient.get('/driver/my-offers');
//       const validStatuses = ['Pending', 'Accepted', 'Assigned', 'Dispatched', 'Arrived'];
//       const activeJobs = (response.data || []).filter(job => {
//         const status = job.Status || job.status || job.OrderStatus || job.orderStatus;
//         return validStatuses.includes(status);
//       });
//       setJobs(activeJobs);
//     } catch (error) {
//       console.error('Fetch Offers Error:', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useFocusEffect(
//     useCallback(() => { fetchMyOffers(); }, [fetchMyOffers])
//   );

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchMyOffers();
//   }, [fetchMyOffers]);

//   const pendingCount = jobs.filter(j => {
//     const s = j.Status || j.status || j.OrderStatus;
//     return s?.toLowerCase() === 'pending';
//   }).length;

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
//       <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

//       {/* ─── Header ─── */}
//       <View style={[styles.header, { backgroundColor: theme.headerTop, borderBottomColor: theme.border }]}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={[styles.navBtn, { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.15)' }]}
//           activeOpacity={0.7}
//         >
//           <ChevronLeft color="#fff" size={22} />
//         </TouchableOpacity>

//         <View style={styles.headerCenter}>
//           <Text style={styles.headerTitle}>Delivery Feed</Text>
//           {pendingCount > 0 && (
//             <View style={styles.pendingBadge}>
//               <Text style={styles.pendingBadgeText}>{pendingCount} new</Text>
//             </View>
//           )}
//         </View>

//         <View style={[styles.navBtn, { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.15)' }]}>
//           <Filter color="#fff" size={18} />
//         </View>
//       </View>

//       {/* ─── Stats bar ─── */}
//       {!loading && jobs.length > 0 && (
//         <View style={[styles.statsBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
//           <View style={styles.statItem}>
//             <Text style={[styles.statValue, { color: theme.primary }]}>{jobs.length}</Text>
//             <Text style={[styles.statLabel, { color: theme.textMuted }]}>Total Offers</Text>
//           </View>
//           <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
//           <View style={styles.statItem}>
//             <Text style={[styles.statValue, { color: '#EF4444' }]}>{pendingCount}</Text>
//             <Text style={[styles.statLabel, { color: theme.textMuted }]}>Pending</Text>
//           </View>
//           <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
//           <View style={styles.statItem}>
//             <Text style={[styles.statValue, { color: '#F59E0B' }]}>
//               {jobs.filter(j => {
//                 const s = j.Status || j.status || j.OrderStatus;
//                 return ['dispatched', 'arrived'].includes(s?.toLowerCase());
//               }).length}
//             </Text>
//             <Text style={[styles.statLabel, { color: theme.textMuted }]}>Active</Text>
//           </View>
//         </View>
//       )}

//       {/* ─── Content ─── */}
//       {loading && !refreshing ? (
//         <View style={styles.center}>
//           <ActivityIndicator size="large" color={theme.primary} />
//           <Text style={[styles.loadingText, { color: theme.textMuted }]}>Loading offers…</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={jobs}
//           renderItem={({ item, index }) => (
//             <JobCard item={item} index={index} navigation={navigation} theme={theme} />
//           )}
//           keyExtractor={item => (item.Id || item.id || item.orderId).toString()}
//           contentContainerStyle={[styles.list, jobs.length === 0 && styles.listEmpty]}
//           showsVerticalScrollIndicator={false}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               tintColor={theme.primary}
//               colors={[theme.primary]}
//             />
//           }
//           ListEmptyComponent={<EmptyState onRefresh={onRefresh} theme={theme} />}
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },

//   header: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//     paddingHorizontal: 16, paddingVertical: 14,
//     borderBottomWidth: 1,
//     paddingTop: Platform.OS === 'ios' ? 14 : 14,
//   },
//   headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   headerTitle: { fontSize: 18, fontWeight: '900', color: '#fff', letterSpacing: -0.4 },
//   pendingBadge: {
//     backgroundColor: '#EF4444', borderRadius: 10,
//     paddingHorizontal: 8, paddingVertical: 3,
//   },
//   pendingBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
//   navBtn: {
//     width: 42, height: 42, borderRadius: 13,
//     justifyContent: 'center', alignItems: 'center',
//     borderWidth: 1,
//   },

//   statsBar: {
//     flexDirection: 'row', alignItems: 'center',
//     paddingVertical: 12, borderBottomWidth: 1,
//   },
//   statItem: { flex: 1, alignItems: 'center' },
//   statValue: { fontSize: 18, fontWeight: '900', letterSpacing: -0.3 },
//   statLabel: { fontSize: 11, fontWeight: '600', marginTop: 1 },
//   statDivider: { width: 1, height: 30 },

//   list:      { padding: 16, paddingBottom: 100 },
//   listEmpty: { flex: 1, justifyContent: 'center' },
//   center:    { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
//   loadingText: { fontSize: 14, fontWeight: '600' },

//   card: {
//     borderRadius: 22, padding: 18, marginBottom: 14,
//     borderWidth: 1.5,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1, shadowRadius: 12,
//     elevation: 4,
//   },
//   cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
//   statusPill: {
//     flexDirection: 'row', alignItems: 'center', gap: 6,
//     paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
//   },
//   statusDot:  { width: 7, height: 7, borderRadius: 3.5 },
//   statusText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
//   priceContainer: { flexDirection: 'row', alignItems: 'baseline', gap: 1 },
//   priceCurrency: { fontSize: 14, fontWeight: '800' },
//   priceValue:    { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },

//   cardBody:   { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
//   jobIconRing:{ width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
//   jobInfo:    { flex: 1 },
//   jobTitle:   { fontSize: 16, fontWeight: '800', marginBottom: 4, letterSpacing: -0.2 },
//   refText:    { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },

//   divider: { height: 1, marginVertical: 0, marginBottom: 14 },

//   cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   addressRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
//   addressText:{ fontSize: 13, fontWeight: '600', flex: 1 },
//   arrowCircle:{ width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },

//   emptyWrapper: { alignItems: 'center', paddingHorizontal: 40, paddingTop: 60 },
//   lottie:       { width: 180, height: 180 },
//   emptyTitle:   { fontSize: 20, fontWeight: '900', marginTop: 8, letterSpacing: -0.3 },
//   emptySub:     { fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20, fontWeight: '500' },
//   refreshBtn:   {
//     flexDirection: 'row', alignItems: 'center', gap: 8,
//     marginTop: 24, paddingHorizontal: 28, paddingVertical: 14,
//     borderRadius: 16,
//   },
//   refreshBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
// });

// export default AvailableDeliveriesScreen;











import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, StatusBar, RefreshControl, ActivityIndicator,
  Platform, Animated,
} from 'react-native';
import { MotiView } from 'moti';
import {
  Package, MapPin, ChevronRight, ChevronLeft,
  Zap, Clock, Filter, Search,
} from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import apiClient from '../services/apiClient';
import { useTheme } from '../context/ThemeContext';

// ─── Theme builder ──────────────────────────────────────────────────────────────
const buildTheme = (isDark) => ({
  bg:           isDark ? '#0B1120' : '#F0F4F8',
  surface:      isDark ? '#141E30' : '#FFFFFF',
  card:         isDark ? '#1C2A3F' : '#FFFFFF',
  border:       isDark ? '#2A3C55' : '#E2EBF4',
  textPrimary:  isDark ? '#F0F6FF' : '#0D1B2A',
  textSecondary:isDark ? '#8BA4C2' : '#4A6080',
  textMuted:    isDark ? '#4E6A8A' : '#8DA0B8',
  headerTop:    isDark ? '#0D1B2A' : '#0D2137',
  headerBottom: isDark ? '#0F2744' : '#0A3459',
  primary:      '#10B981',
  primaryGlow:  isDark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.08)',
  white:        '#FFFFFF',
  shadow:       isDark ? '#000' : '#193B5F',
});

// ─── Status config ───────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  PENDING:    { label: 'NEW OFFER',   bg: '#EF444422', text: '#EF4444', dot: '#EF4444' },
  ACCEPTED:   { label: 'ACCEPTED',    bg: '#3B82F622', text: '#3B82F6', dot: '#3B82F6' },
  ASSIGNED:   { label: 'ASSIGNED',    bg: '#8B5CF622', text: '#8B5CF6', dot: '#8B5CF6' },
  DISPATCHED: { label: 'EN ROUTE',    bg: '#F59E0B22', text: '#F59E0B', dot: '#F59E0B' },
  ARRIVED:    { label: 'ARRIVED',     bg: '#10B98122', text: '#10B981', dot: '#10B981' },
};

const getStatusConfig = (status) =>
  STATUS_CONFIG[status?.toUpperCase()] || STATUS_CONFIG.PENDING;

// ─── Job Card ────────────────────────────────────────────────────────────────────
const JobCard = ({ item, index, navigation, theme }) => {
  const orderId = item.OrderId || item.orderId;
  const offerId = item.Id || item.id;
  const status  = (item.OrderStatus || item.status || 'Pending').toUpperCase();
  const price   = item.Price || item.price || 0;
  const address = item.DeliveryAddress || item.deliveryAddress || 'Address Unavailable';
  const title   = item.OrderTitle || item.orderTitle || 'Delivery Job';
  const cfg     = getStatusConfig(status);
  const isNew   = status === 'PENDING';

  return (
    <MotiView
      from={{ opacity: 0, translateY: 18 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', delay: index * 70, damping: 18 }}
    >
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => navigation.navigate('DriverOrderDetails', { orderId, offerId })}
        style={[styles.card, {
          backgroundColor: theme.card,
          borderColor: isNew ? '#EF444430' : theme.border,
          shadowColor: theme.shadow,
        }]}
      >
        <View style={styles.cardTop}>
          <View style={[styles.statusPill, { backgroundColor: cfg.bg }]}>
            {isNew && (
              <MotiView
                from={{ opacity: 0.3 }} animate={{ opacity: 1 }}
                transition={{ loop: true, duration: 800, type: 'timing' }}
                style={[styles.statusDot, { backgroundColor: cfg.dot }]}
              />
            )}
            {!isNew && <View style={[styles.statusDot, { backgroundColor: cfg.dot }]} />}
            <Text style={[styles.statusText, { color: cfg.text }]}>{cfg.label}</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={[styles.priceCurrency, { color: theme.primary }]}>R</Text>
            <Text style={[styles.priceValue, { color: theme.textPrimary }]}>
              {Number(price).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={[styles.jobIconRing, { backgroundColor: theme.primary + '20' }]}>
            <Package color={theme.primary} size={22} />
          </View>
          <View style={styles.jobInfo}>
            <Text style={[styles.jobTitle, { color: theme.textPrimary }]} numberOfLines={1}>
              {title}
            </Text>
            <Text style={[styles.refText, { color: theme.textMuted }]}>
              REF #{offerId?.toString().slice(-6).toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.cardFooter}>
          <View style={styles.addressRow}>
            <MapPin size={13} color={theme.textMuted} />
            <Text style={[styles.addressText, { color: theme.textSecondary }]} numberOfLines={1}>
              {address}
            </Text>
          </View>
          <View style={[styles.arrowCircle, { backgroundColor: theme.primary }]}>
            <ChevronRight color="#fff" size={17} />
          </View>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
};

// ─── Empty State ─────────────────────────────────────────────────────────────────
const EmptyState = ({ onRefresh, theme }) => (
  <View style={styles.emptyWrapper}>
    <LottieView
      source={require('../assets/lottie/empty-box.json')}
      autoPlay loop style={styles.lottie}
    />
    <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No Jobs Found</Text>
    <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
      We'll notify you when new delivery requests arrive.
    </Text>
    <TouchableOpacity
      style={[styles.refreshBtn, { backgroundColor: theme.primary }]}
      onPress={onRefresh}
      activeOpacity={0.85}
    >
      <Zap size={16} color="#fff" />
      <Text style={styles.refreshBtnText}>Refresh Now</Text>
    </TouchableOpacity>
  </View>
);

// ─── Main Screen ─────────────────────────────────────────────────────────────────
const AvailableDeliveriesScreen = () => {
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const theme = useMemo(() => buildTheme(isDark), [isDark]);

  const [refreshing, setRefreshing] = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [jobs,       setJobs]       = useState([]);

  const fetchMyOffers = useCallback(async () => {
    try {
      const response = await apiClient.get('/driver/my-offers');
      const validStatuses = ['Pending', 'Accepted', 'Assigned', 'Dispatched', 'Arrived'];
      const activeJobs = (response.data || []).filter(job => {
        const status = job.Status || job.status || job.OrderStatus || job.orderStatus;
        return validStatuses.includes(status);
      });
      setJobs(activeJobs);
    } catch (error) {
      console.error('Fetch Offers Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => { fetchMyOffers(); }, [fetchMyOffers])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMyOffers();
  }, [fetchMyOffers]);

  const pendingCount = jobs.filter(j => {
    const s = j.Status || j.status || j.OrderStatus;
    return s?.toLowerCase() === 'pending';
  }).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* ─── Adaptive StatusBar ─── */}
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        translucent 
        backgroundColor="transparent" 
      />

      {/* ─── Header (Background Removed) ─── */}
      <View style={[styles.header, { backgroundColor: 'transparent', borderBottomWidth: 0 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.navBtn, { 
            backgroundColor: theme.card, 
            borderColor: theme.border,
            shadowColor: theme.shadow 
          }]}
          activeOpacity={0.7}
        >
          <ChevronLeft color={theme.textPrimary} size={22} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Delivery Feed</Text>
          {pendingCount > 0 && (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>{pendingCount} new</Text>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.navBtn, { 
            backgroundColor: theme.card, 
            borderColor: theme.border,
            shadowColor: theme.shadow 
          }]}
          activeOpacity={0.7}
        >
          <Filter color={theme.textPrimary} size={18} />
        </TouchableOpacity>
      </View>

      {/* ─── Stats bar ─── */}
      {!loading && jobs.length > 0 && (
        <View style={[styles.statsBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.primary }]}>{jobs.length}</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Total Offers</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#EF4444' }]}>{pendingCount}</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Pending</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#F59E0B' }]}>
              {jobs.filter(j => {
                const s = j.Status || j.status || j.OrderStatus;
                return ['dispatched', 'arrived'].includes(s?.toLowerCase());
              }).length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Active</Text>
          </View>
        </View>
      )}

      {/* ─── Content ─── */}
      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textMuted }]}>Loading offers…</Text>
        </View>
      ) : (
        <FlatList
          data={jobs}
          renderItem={({ item, index }) => (
            <JobCard item={item} index={index} navigation={navigation} theme={theme} />
          )}
          keyExtractor={item => (item.Id || item.id || item.orderId).toString()}
          contentContainerStyle={[styles.list, jobs.length === 0 && styles.listEmpty]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
              colors={[theme.primary]}
            />
          }
          ListEmptyComponent={<EmptyState onRefresh={onRefresh} theme={theme} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 18, fontWeight: '900', letterSpacing: -0.4 },
  pendingBadge: {
    backgroundColor: '#EF4444', borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  pendingBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  navBtn: {
    width: 42, height: 42, borderRadius: 13,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1,
    // Add subtle shadow for visibility against bg
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  statsBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '900', letterSpacing: -0.3 },
  statLabel: { fontSize: 11, fontWeight: '600', marginTop: 1 },
  statDivider: { width: 1, height: 30 },

  list:      { padding: 16, paddingBottom: 100 },
  listEmpty: { flex: 1, justifyContent: 'center' },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  loadingText: { fontSize: 14, fontWeight: '600' },

  card: {
    borderRadius: 22, padding: 18, marginBottom: 14,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 12,
    elevation: 4,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
  },
  statusDot:  { width: 7, height: 7, borderRadius: 3.5 },
  statusText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  priceContainer: { flexDirection: 'row', alignItems: 'baseline', gap: 1 },
  priceCurrency: { fontSize: 14, fontWeight: '800' },
  priceValue:     { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },

  cardBody:   { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  jobIconRing:{ width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  jobInfo:    { flex: 1 },
  jobTitle:   { fontSize: 16, fontWeight: '800', marginBottom: 4, letterSpacing: -0.2 },
  refText:    { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },

  divider: { height: 1, marginVertical: 0, marginBottom: 14 },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  addressText:{ fontSize: 13, fontWeight: '600', flex: 1 },
  arrowCircle:{ width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },

  emptyWrapper: { alignItems: 'center', paddingHorizontal: 40, paddingTop: 60 },
  lottie:       { width: 180, height: 180 },
  emptyTitle:   { fontSize: 20, fontWeight: '900', marginTop: 8, letterSpacing: -0.3 },
  emptySub:     { fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20, fontWeight: '500' },
  refreshBtn:   {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 24, paddingHorizontal: 28, paddingVertical: 14,
    borderRadius: 16,
  },
  refreshBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});

export default AvailableDeliveriesScreen;