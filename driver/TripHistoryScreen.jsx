// import React, { useEffect, useState, useMemo, useCallback } from 'react';
// import {
//   View, Text, StyleSheet, FlatList, TouchableOpacity,
//   ActivityIndicator, RefreshControl, SafeAreaView, StatusBar, Platform,
// } from 'react-native';
// import { MotiView } from 'moti';
// import {
//   ChevronLeft, Calendar, MapPin, Package,
//   TrendingUp, Star, DollarSign, Truck, CheckCircle2,
// } from 'lucide-react-native';
// import { useNavigation } from '@react-navigation/native';
// import apiClient from '../services/apiClient';
// import { useTheme } from '../context/ThemeContext';

// // ─── Theme ──────────────────────────────────────────────────────────────────────
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
// });

// // ─── Summary Banner ──────────────────────────────────────────────────────────────
// // ─── Summary Banner ──────────────────────────────────────────────────────────────
// const SummaryBanner = ({ trips, theme }) => {
//   // Fix: Ensure we use Number() and handle undefined/null cases
//   const totalEarned = trips.reduce((sum, t) => sum + Number(t.payout || 0), 0);
  
//   const avgRating   = trips.length
//     ? (trips.reduce((sum, t) => sum + (t.rating || 5), 0) / trips.length).toFixed(1)
//     : '5.0';
    
//   // Added safety here as well
//   const totalItems  = trips.reduce((sum, t) => sum + (t.totalItems || 0), 0);

//   const stats = [
//     { icon: DollarSign, value: `R${totalEarned.toFixed(0)}`, label: 'Total Earned', color: '#10B981' },
//     { icon: Truck,      value: `${trips.length}`,            label: 'Trips Done',   color: '#3B82F6' },
//     { icon: Star,       value: avgRating,                    label: 'Avg Rating',   color: '#F59E0B' },
//     { icon: Package,    value: `${totalItems}`,              label: 'Items Delivered', color: '#8B5CF6' },
//   ];

//   // ... (rest of component)

//   return (
//     <MotiView
//       from={{ opacity: 0, translateY: -10 }}
//       animate={{ opacity: 1, translateY: 0 }}
//       transition={{ type: 'spring', damping: 18 }}
//       style={[styles.summaryBanner, { backgroundColor: theme.card, borderColor: theme.border }]}
//     >
//       {stats.map((s, i) => (
//         <React.Fragment key={i}>
//           <View style={styles.summaryItem}>
//             <View style={[styles.summaryIconRing, { backgroundColor: s.color + '20' }]}>
//               <s.icon size={14} color={s.color} />
//             </View>
//             <Text style={[styles.summaryValue, { color: theme.textPrimary }]}>{s.value}</Text>
//             <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>{s.label}</Text>
//           </View>
//           {i < stats.length - 1 && (
//             <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />
//           )}
//         </React.Fragment>
//       ))}
//     </MotiView>
//   );
// };

// // ─── Trip Card ───────────────────────────────────────────────────────────────────
// const TripCard = ({ item, index, theme }) => {
//   const payout   = Number(item.payout || 0);
//   const date     = new Date(item.completedAt);
//   const dateStr  = date.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
//   const timeStr  = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   const rating   = item.rating || 5;

//   return (
//     <MotiView
//       from={{ opacity: 0, translateX: -16 }}
//       animate={{ opacity: 1, translateX: 0 }}
//       transition={{ type: 'spring', delay: index * 60, damping: 18 }}
//     >
//       <View style={[styles.tripCard, { backgroundColor: theme.card, borderColor: theme.border, shadowColor: theme.shadow }]}>
//         {/* Header row */}
//         <View style={styles.tripCardHeader}>
//           <View style={styles.tripRefRow}>
//             <View style={[styles.tripCompletedDot, { backgroundColor: '#10B98120' }]}>
//               <CheckCircle2 size={14} color="#10B981" />
//             </View>
//             <Text style={[styles.tripRef, { color: theme.textMuted }]}>
//               #{item.orderNumber?.substring(0, 8).toUpperCase() || 'N/A'}
//             </Text>
//           </View>
//           <View style={styles.tripPayoutRow}>
//             <Text style={styles.tripPayout}>+R{payout.toFixed(2)}</Text>
//           </View>
//         </View>

//         {/* Info rows */}
//         <View style={styles.tripInfoBlock}>
//           <View style={styles.infoRow}>
//             <Calendar size={13} color={theme.textMuted} />
//             <Text style={[styles.infoText, { color: theme.textSecondary }]}>
//               {dateStr} · {timeStr}
//             </Text>
//           </View>
//           <View style={styles.infoRow}>
//             <MapPin size={13} color={theme.textMuted} />
//             <Text style={[styles.infoText, { color: theme.textSecondary }]} numberOfLines={1}>
//               {item.deliveryAddress || 'Address N/A'}
//             </Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Package size={13} color={theme.textMuted} />
//             <Text style={[styles.infoText, { color: theme.textSecondary }]}>
//               {item.totalItems || 0} items delivered
//             </Text>
//           </View>
//         </View>

//         {/* Footer: rating */}
//         <View style={[styles.tripCardFooter, { borderTopColor: theme.border }]}>
//           <View style={styles.starsRow}>
//             {[1, 2, 3, 4, 5].map(n => (
//               <Star
//                 key={n}
//                 size={13}
//                 color="#F59E0B"
//                 fill={n <= rating ? '#F59E0B' : 'transparent'}
//               />
//             ))}
//             <Text style={[styles.ratingText, { color: theme.textMuted }]}>{rating}.0</Text>
//           </View>
//           <View style={[styles.completedPill, { backgroundColor: '#10B98115' }]}>
//             <Text style={styles.completedPillText}>Completed</Text>
//           </View>
//         </View>
//       </View>
//     </MotiView>
//   );
// };

// // ─── Main Screen ─────────────────────────────────────────────────────────────────
// const TripHistoryScreen = () => {
//   const navigation = useNavigation();
//   const { isDark } = useTheme();
//   const theme = useMemo(() => buildTheme(isDark), [isDark]);

//   const [trips,      setTrips]      = useState([]);
//   const [loading,    setLoading]    = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchHistory = useCallback(async () => {
//     try {
//       const response = await apiClient.get('/driver/history');
//       setTrips(response.data?.trips || response.data || []);
//     } catch (error) {
//       console.error('Failed to load history:', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => { fetchHistory(); }, [fetchHistory]);

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchHistory();
//   }, [fetchHistory]);

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
//           <Text style={styles.headerTitle}>Trip History</Text>
//           {!loading && (
//             <View style={[styles.countBadge, { backgroundColor: theme.primary + '30' }]}>
//               <Text style={[styles.countBadgeText, { color: theme.primary }]}>{trips.length}</Text>
//             </View>
//           )}
//         </View>

//         <View style={[styles.navBtn, { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.15)' }]}>
//           <TrendingUp color="#fff" size={18} />
//         </View>
//       </View>

//       {loading ? (
//         <View style={styles.center}>
//           <ActivityIndicator size="large" color={theme.primary} />
//           <Text style={[styles.loadingText, { color: theme.textMuted }]}>Loading history…</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={trips}
//           renderItem={({ item, index }) => (
//             <TripCard item={item} index={index} theme={theme} />
//           )}
//           keyExtractor={item => item.id?.toString() || Math.random().toString()}
//           contentContainerStyle={[styles.list, trips.length === 0 && styles.listEmpty]}
//           showsVerticalScrollIndicator={false}
//           ListHeaderComponent={
//             trips.length > 0
//               ? <SummaryBanner trips={trips} theme={theme} />
//               : null
//           }
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               tintColor={theme.primary}
//               colors={[theme.primary]}
//             />
//           }
//           ListEmptyComponent={
//             <View style={styles.emptyWrapper}>
//               <View style={[styles.emptyIconRing, { backgroundColor: theme.primary + '15' }]}>
//                 <Truck size={40} color={theme.primary} opacity={0.5} />
//               </View>
//               <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No Trips Yet</Text>
//               <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
//                 Your completed deliveries will appear here.
//               </Text>
//             </View>
//           }
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
//   },
//   headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   headerTitle: { fontSize: 18, fontWeight: '900', color: '#fff', letterSpacing: -0.4 },
//   countBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
//   countBadgeText: { fontSize: 12, fontWeight: '800' },
//   navBtn: {
//     width: 42, height: 42, borderRadius: 13,
//     justifyContent: 'center', alignItems: 'center', borderWidth: 1,
//   },

//   center:      { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
//   loadingText: { fontSize: 14, fontWeight: '600' },

//   list:      { padding: 16, paddingBottom: 100 },
//   listEmpty: { flexGrow: 1, justifyContent: 'center' },

//   // Summary Banner
//   summaryBanner: {
//     flexDirection: 'row', alignItems: 'center',
//     borderRadius: 20, padding: 16, marginBottom: 20,
//     borderWidth: 1,
//   },
//   summaryItem:   { flex: 1, alignItems: 'center', gap: 4 },
//   summaryIconRing:{ width: 30, height: 30, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
//   summaryValue:  { fontSize: 15, fontWeight: '900', letterSpacing: -0.3 },
//   summaryLabel:  { fontSize: 10, fontWeight: '600' },
//   summaryDivider:{ width: 1, height: 40, marginHorizontal: 4 },

//   // Trip Card
//   tripCard: {
//     borderRadius: 20, padding: 18, marginBottom: 14,
//     borderWidth: 1,
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
//   },
//   tripCardHeader: {
//     flexDirection: 'row', justifyContent: 'space-between',
//     alignItems: 'center', marginBottom: 14,
//   },
//   tripRefRow:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   tripCompletedDot: { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
//   tripRef:       { fontSize: 13, fontWeight: '700', letterSpacing: 0.3 },
//   tripPayoutRow: { alignItems: 'flex-end' },
//   tripPayout:    { fontSize: 20, fontWeight: '900', color: '#10B981', letterSpacing: -0.5 },

//   tripInfoBlock: { gap: 8, marginBottom: 14 },
//   infoRow:       { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   infoText:      { fontSize: 13, fontWeight: '500', flex: 1 },

//   tripCardFooter:{
//     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
//     paddingTop: 12, borderTopWidth: 1,
//   },
//   starsRow:      { flexDirection: 'row', alignItems: 'center', gap: 3 },
//   ratingText:    { fontSize: 12, fontWeight: '700', marginLeft: 4 },
//   completedPill: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
//   completedPillText: { fontSize: 11, fontWeight: '800', color: '#10B981' },

//   // Empty
//   emptyWrapper:  { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 },
//   emptyIconRing: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
//   emptyTitle:    { fontSize: 20, fontWeight: '900', letterSpacing: -0.3, marginBottom: 8 },
//   emptySub:      { fontSize: 14, textAlign: 'center', lineHeight: 20, fontWeight: '500' },
// });

// export default TripHistoryScreen;










import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl, SafeAreaView, StatusBar, Platform,
} from 'react-native';
import { MotiView } from 'moti';
import {
  ChevronLeft, Calendar, MapPin, Package,
  TrendingUp, Star, DollarSign, Truck, CheckCircle2,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../services/apiClient';
import { useTheme } from '../context/ThemeContext';

// ─── Theme ──────────────────────────────────────────────────────────────────────
const buildTheme = (isDark) => ({
  bg:           isDark ? '#0B1120' : '#F0F4F8',
  surface:      isDark ? '#141E30' : '#FFFFFF',
  card:         isDark ? '#1C2A3F' : '#FFFFFF',
  border:       isDark ? '#2A3C55' : '#E2EBF4',
  textPrimary:  isDark ? '#F0F6FF' : '#0D1B2A',
  textSecondary:isDark ? '#8BA4C2' : '#4A6080',
  textMuted:    isDark ? '#4E6A8A' : '#8DA0B8',
  headerTop:    isDark ? '#0D1B2A' : '#0D2137',
  primary:      '#10B981',
  white:        '#FFFFFF',
  shadow:       isDark ? '#000' : '#193B5F',
});

// ─── Summary Banner ──────────────────────────────────────────────────────────────
const SummaryBanner = ({ trips, theme }) => {
  const totalEarned = trips.reduce((sum, t) => sum + Number(t.payout || 0), 0);
  
  const avgRating   = trips.length
    ? (trips.reduce((sum, t) => sum + (t.rating || 5), 0) / trips.length).toFixed(1)
    : '5.0';
    
  const totalItems  = trips.reduce((sum, t) => sum + (t.totalItems || 0), 0);

  const stats = [
    { icon: DollarSign, value: `R${totalEarned.toFixed(0)}`, label: 'Total Earned', color: '#10B981' },
    { icon: Truck,      value: `${trips.length}`,            label: 'Trips Done',   color: '#3B82F6' },
    { icon: Star,       value: avgRating,                    label: 'Avg Rating',   color: '#F59E0B' },
    { icon: Package,    value: `${totalItems}`,              label: 'Items Delivered', color: '#8B5CF6' },
  ];

  return (
    <MotiView
      from={{ opacity: 0, translateY: -10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 18 }}
      style={[styles.summaryBanner, { backgroundColor: theme.card, borderColor: theme.border }]}
    >
      {stats.map((s, i) => (
        <React.Fragment key={i}>
          <View style={styles.summaryItem}>
            <View style={[styles.summaryIconRing, { backgroundColor: s.color + '20' }]}>
              <s.icon size={14} color={s.color} />
            </View>
            <Text style={[styles.summaryValue, { color: theme.textPrimary }]}>{s.value}</Text>
            <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>{s.label}</Text>
          </View>
          {i < stats.length - 1 && (
            <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />
          )}
        </React.Fragment>
      ))}
    </MotiView>
  );
};

// ─── Trip Card ───────────────────────────────────────────────────────────────────
const TripCard = ({ item, index, theme }) => {
  const payout   = Number(item.payout || 0);
  const date     = new Date(item.completedAt);
  const dateStr  = date.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr  = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const rating   = item.rating || 5;

  return (
    <MotiView
      from={{ opacity: 0, translateX: -16 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: 'spring', delay: index * 60, damping: 18 }}
    >
      <View style={[styles.tripCard, { backgroundColor: theme.card, borderColor: theme.border, shadowColor: theme.shadow }]}>
        <View style={styles.tripCardHeader}>
          <View style={styles.tripRefRow}>
            <View style={[styles.tripCompletedDot, { backgroundColor: '#10B98120' }]}>
              <CheckCircle2 size={14} color="#10B981" />
            </View>
            <Text style={[styles.tripRef, { color: theme.textMuted }]}>
              #{item.orderNumber?.substring(0, 8).toUpperCase() || 'N/A'}
            </Text>
          </View>
          <View style={styles.tripPayoutRow}>
            <Text style={styles.tripPayout}>+R{payout.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.tripInfoBlock}>
          <View style={styles.infoRow}>
            <Calendar size={13} color={theme.textMuted} />
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              {dateStr} · {timeStr}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <MapPin size={13} color={theme.textMuted} />
            <Text style={[styles.infoText, { color: theme.textSecondary }]} numberOfLines={1}>
              {item.deliveryAddress || 'Address N/A'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Package size={13} color={theme.textMuted} />
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              {item.totalItems || 0} items delivered
            </Text>
          </View>
        </View>

        <View style={[styles.tripCardFooter, { borderTopColor: theme.border }]}>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(n => (
              <Star
                key={n}
                size={13}
                color="#F59E0B"
                fill={n <= rating ? '#F59E0B' : 'transparent'}
              />
            ))}
            <Text style={[styles.ratingText, { color: theme.textMuted }]}>{rating}.0</Text>
          </View>
          <View style={[styles.completedPill, { backgroundColor: '#10B98115' }]}>
            <Text style={styles.completedPillText}>Completed</Text>
          </View>
        </View>
      </View>
    </MotiView>
  );
};

// ─── Main Screen ─────────────────────────────────────────────────────────────────
const TripHistoryScreen = () => {
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const theme = useMemo(() => buildTheme(isDark), [isDark]);

  const [trips,      setTrips]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      const response = await apiClient.get('/driver/history');
      setTrips(response.data?.trips || response.data || []);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHistory();
  }, [fetchHistory]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        translucent 
        backgroundColor="transparent" 
      />

      {/* ─── Header (Removed Background) ─── */}
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
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Trip History</Text>
          {!loading && (
            <View style={[styles.countBadge, { backgroundColor: theme.primary + '30' }]}>
              <Text style={[styles.countBadgeText, { color: theme.primary }]}>{trips.length}</Text>
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
          <TrendingUp color={theme.textPrimary} size={18} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textMuted }]}>Loading history…</Text>
        </View>
      ) : (
        <FlatList
          data={trips}
          renderItem={({ item, index }) => (
            <TripCard item={item} index={index} theme={theme} />
          )}
          keyExtractor={item => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={[styles.list, trips.length === 0 && styles.listEmpty]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            trips.length > 0
              ? <SummaryBanner trips={trips} theme={theme} />
              : null
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
              colors={[theme.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyWrapper}>
              <View style={[styles.emptyIconRing, { backgroundColor: theme.primary + '15' }]}>
                <Truck size={40} color={theme.primary} opacity={0.5} />
              </View>
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No Trips Yet</Text>
              <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
                Your completed deliveries will appear here.
              </Text>
            </View>
          }
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
  countBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  countBadgeText: { fontSize: 12, fontWeight: '800' },
  navBtn: {
    width: 42, height: 42, borderRadius: 13,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  center:      { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  loadingText: { fontSize: 14, fontWeight: '600' },

  list:      { padding: 16, paddingBottom: 100 },
  listEmpty: { flexGrow: 1, justifyContent: 'center' },

  // Summary Banner
  summaryBanner: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 20, padding: 16, marginBottom: 20,
    borderWidth: 1,
  },
  summaryItem:   { flex: 1, alignItems: 'center', gap: 4 },
  summaryIconRing:{ width: 30, height: 30, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  summaryValue:  { fontSize: 15, fontWeight: '900', letterSpacing: -0.3 },
  summaryLabel:  { fontSize: 10, fontWeight: '600' },
  summaryDivider:{ width: 1, height: 40, marginHorizontal: 4 },

  // Trip Card
  tripCard: {
    borderRadius: 20, padding: 18, marginBottom: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
  },
  tripCardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14,
  },
  tripRefRow:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tripCompletedDot: { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  tripRef:       { fontSize: 13, fontWeight: '700', letterSpacing: 0.3 },
  tripPayoutRow: { alignItems: 'flex-end' },
  tripPayout:    { fontSize: 20, fontWeight: '900', color: '#10B981', letterSpacing: -0.5 },

  tripInfoBlock: { gap: 8, marginBottom: 14 },
  infoRow:       { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText:      { fontSize: 13, fontWeight: '500', flex: 1 },

  tripCardFooter:{
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 12, borderTopWidth: 1,
  },
  starsRow:      { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText:    { fontSize: 12, fontWeight: '700', marginLeft: 4 },
  completedPill: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  completedPillText: { fontSize: 11, fontWeight: '800', color: '#10B981' },

  // Empty
  emptyWrapper:  { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyIconRing: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyTitle:    { fontSize: 20, fontWeight: '900', letterSpacing: -0.3, marginBottom: 8 },
  emptySub:      { fontSize: 14, textAlign: 'center', lineHeight: 20, fontWeight: '500' },
});

export default TripHistoryScreen;