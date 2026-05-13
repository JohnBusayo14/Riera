// import React, { useState, useEffect, useCallback } from 'react';
// import { 
//   View, Text, StyleSheet, FlatList, TouchableOpacity, 
//   SafeAreaView, Alert, Dimensions, RefreshControl, ActivityIndicator
// } from 'react-native';
// import { ChevronLeft, RotateCcw, Truck, Clock } from 'lucide-react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import apiClient from '../services/apiClient.jsx';
// import DriverCard from './components/DriverCard.jsx'; 

// const { width } = Dimensions.get('window');

// const DriverSearchScreen = ({ route, navigation }) => {
//   const { orderId } = route.params;
//   const [drivers, setDrivers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [sendingOffer, setSendingOffer] = useState(null);
//   const [radius, setRadius] = useState(99999);
  
//   const [pendingDriver, setPendingDriver] = useState(null);

//   const THEME = {
//     forestGreen: '#228B22',
//     forestGreenDark: '#1a6b1a',
//     white: '#FFFFFF',
//     black: '#0F172A',
//     gray: '#64748B',
//     error: '#EF4444'
//   };

//   const fetchNearbyDrivers = useCallback(async (selectedRadius = radius) => {
//     try {
//       const response = await apiClient.get(`/seller/orders/search-drivers`, {
//         params: { orderId: orderId, radiusKm: selectedRadius }
//       });
//       setDrivers(response.data);
//     } catch (error) {
//       console.error("Fetch Drivers Error:", error);
//       Alert.alert("Error", "Failed to find nearby drivers.");
//     }
//   }, [orderId, radius]);

//   const checkPendingOffer = useCallback(async () => {
//     try {
//       const response = await apiClient.get(`/driver/orders/${orderId}/pending-offer`);
      
//       if (response.data && response.data.hasPendingOffer) {
//         setPendingDriver(response.data.driver);
//         setDrivers([]); 
//       } else {
//         // If an offer was pending but is now gone (expired), unlock the list
//         setPendingDriver(null);
//         await fetchNearbyDrivers(); 
//       }
//     } catch (error) {
//       console.error("Status Check Error:", error);
//       fetchNearbyDrivers(); 
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [orderId, fetchNearbyDrivers]);

//   // 1. Initial Load
//   useEffect(() => {
//     checkPendingOffer();
//   }, [checkPendingOffer]);

//   /**
//    * 2. POLLING LOGIC
//    * Since the window is only 2 minutes, we check the status every 20 seconds.
//    * This automatically clears the 'Pending' view if the offer expires on the backend.
//    */
//   useEffect(() => {
//     let interval;
//     if (pendingDriver) {
//       interval = setInterval(() => {
//         checkPendingOffer();
//       }, 20000); // Poll every 20 seconds
//     }
//     return () => clearInterval(interval);
//   }, [pendingDriver, checkPendingOffer]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     checkPendingOffer();
//   };

//   const sendOfferToDriver = async (driver) => {
//     setSendingOffer(driver.id);
//     try {
//       await apiClient.post(`/seller/orders/${orderId}/send-offer/${driver.id}`);
//       setDrivers([]); 
//       setPendingDriver(driver);
//     } catch (error) {
//       Alert.alert("Failed", error.response?.data?.message || "Could not send offer.");
//     } finally {
//       setSendingOffer(null);
//     }
//   };

//   const cancelOffer = async () => {
//     setSendingOffer(pendingDriver?.id); 
//     try {
//       await apiClient.post(`/driver/orders/${orderId}/cancel-offer`);
//       setPendingDriver(null);
//       await fetchNearbyDrivers();
//       Alert.alert("Cancelled", "Request withdrawn. You can now select other drivers.");
//     } catch (error) {
//       Alert.alert("Error", "Could not cancel the offer.");
//     } finally {
//       setSendingOffer(null);
//     }
//   };

//   useEffect(() => {
//   let interval;
  
//   // Only auto-refresh if we're not in pending offer state
//   if (!pendingDriver && !loading) {
//     interval = setInterval(() => {
//       console.log('[AUTO-REFRESH] Updating driver list...');
//       fetchNearbyDrivers(radius);
//     }, 10000); // Refresh every 10 seconds
//   }
  
//   return () => {
//     if (interval) clearInterval(interval);
//   };
// }, [pendingDriver, loading, fetchNearbyDrivers, radius]);

//   const renderEmptyState = () => (
//     <View style={styles.emptyState}>
//       <View style={styles.emptyIconCircle}>
//         <Truck size={48} color={THEME.gray} />
//       </View>
//       <Text style={styles.emptyTitle}>No Drivers Found</Text>
//       <Text style={styles.emptyText}>Try expanding your search radius or refreshing.</Text>
//       <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
//         <LinearGradient colors={[THEME.forestGreen, THEME.forestGreenDark]} style={styles.refreshButtonGradient}>
//           <RotateCcw size={20} color="#FFF" />
//           <Text style={styles.refreshButtonText}>Refresh Search</Text>
//         </LinearGradient>
//       </TouchableOpacity>
//     </View>
//   );

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.centerContent}>
//         <ActivityIndicator size="large" color={THEME.forestGreen} />
//         <Text style={styles.loadingText}>Syncing search status...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <SafeAreaView style={{ backgroundColor: THEME.white }} />
      
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//           <ChevronLeft color={THEME.black} size={24} />
//         </TouchableOpacity>
//         <View style={styles.headerCenter}>
//           <Text style={styles.headerTitle}>
//             {pendingDriver ? "Pending Offer" : "Available Drivers"}
//           </Text>
//           <Text style={styles.headerSubtitle}>
//             {pendingDriver ? "Waiting for response" : `${drivers.length} found nearby`}
//           </Text>
//         </View>
//         <View style={{ width: 44 }} />
//       </View>

//       {pendingDriver ? (
//         <View style={styles.pendingContainer}>
//           <View style={styles.statusBanner}>
//             <Clock size={16} color={THEME.forestGreen} />
//             {/* UPDATED TEXT TO 2 MINS */}
//             <Text style={styles.statusText}>This driver has 2 mins to respond...</Text>
//           </View>
          
//           <DriverCard 
//             item={pendingDriver} 
//             onSendOffer={cancelOffer} 
//             isSending={sendingOffer === pendingDriver.id}
//             baseURL={apiClient.defaults.baseURL}
//             isCancelMode={true} 
//           />

//           <Text style={styles.helperText}>
//             While an offer is pending, you cannot send offers to other drivers. 
//             The request will automatically expire in 2 minutes.
//           </Text>
//         </View>
//       ) : (
//         <FlatList
//           data={drivers}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={({ item }) => (
//             <DriverCard 
//               item={item} 
//               onSendOffer={() => sendOfferToDriver(item)}
//               isSending={sendingOffer === item.id}
//               baseURL={apiClient.defaults.baseURL} 
//             />
//           )}
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[THEME.forestGreen]} />
//           }
//           ListEmptyComponent={renderEmptyState}
//           contentContainerStyle={styles.listContent}
//         />
//       )}
//     </View>
//   );
// };


// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F8FAFC' },
//   centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   loadingText: { marginTop: 15, color: '#64748B', fontWeight: '600' },
//   header: { 
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
//     paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFF',
//     borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
//   },
//   backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
//   headerCenter: { flex: 1, alignItems: 'center' },
//   headerTitle: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
//   headerSubtitle: { fontSize: 12, color: '#64748B', fontWeight: '600' },
//   listContent: { padding: 20, paddingBottom: 40 },
//   pendingContainer: { padding: 20 },
//   statusBanner: { 
//     flexDirection: 'row', alignItems: 'center', gap: 8, 
//     backgroundColor: '#DCFCE7', padding: 12, borderRadius: 12, marginBottom: 20 
//   },
//   statusText: { color: '#166534', fontWeight: '700', fontSize: 13 },
//   helperText: { textAlign: 'center', color: '#94A3B8', fontSize: 12, marginTop: 20, paddingHorizontal: 30, lineHeight: 18 },
//   emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 60 },
//   emptyIconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
//   emptyTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A', marginBottom: 10 },
//   emptyText: { textAlign: 'center', color: '#64748B', paddingHorizontal: 40, lineHeight: 20, marginBottom: 25 },
//   refreshButton: { borderRadius: 15, overflow: 'hidden' },
//   refreshButtonGradient: { flexDirection: 'row', paddingHorizontal: 25, paddingVertical: 15, alignItems: 'center', gap: 10 },
//   refreshButtonText: { color: '#FFF', fontWeight: '800' }
// });

// export default DriverSearchScreen;












// screens/DriverSearchScreen.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, Alert, Dimensions, RefreshControl,
  ActivityIndicator, Animated,
} from 'react-native';
import { ChevronLeft, RotateCcw, Truck, Clock, CheckCircle2, XCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import apiClient from '../services/apiClient.jsx';
import DriverCard from './components/DriverCard.jsx';

const { width } = Dimensions.get('window');

// ─── Poll intervals ───────────────────────────────────────────────────────────────
const POLL_PENDING_MS   = 4000;  // Fast: check every 4s while offer is pending (catches instant accept/decline)
const POLL_BROWSING_MS  = 10000; // Normal: refresh driver list every 10s while browsing

// ─── Offer result banner ──────────────────────────────────────────────────────────
// Shown briefly when a driver accepts or declines
const ResultBanner = ({ result, driverName }) => {
  const accepted = result === 'accepted';
  return (
    <MotiView
      from={{ opacity: 0, translateY: -20, scale: 0.95 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{ type: 'spring', damping: 16 }}
      style={[
        styles.resultBanner,
        { backgroundColor: accepted ? '#10B98118' : '#EF444418',
          borderColor:      accepted ? '#10B98140' : '#EF444440' }
      ]}
    >
      {accepted
        ? <CheckCircle2 size={20} color="#10B981" />
        : <XCircle      size={20} color="#EF4444" />
      }
      <Text style={[styles.resultBannerText, { color: accepted ? '#10B981' : '#EF4444' }]}>
        {accepted
          ? `${driverName} accepted the offer!`
          : `${driverName} declined. Select another driver.`
        }
      </Text>
    </MotiView>
  );
};

// ─── Countdown ticker (shows time remaining on pending offer) ─────────────────────
const CountdownTicker = ({ startedAt, durationSecs = 120 }) => {
  const [remaining, setRemaining] = useState(durationSecs);

  useEffect(() => {
    if (!startedAt) return;
    const tick = setInterval(() => {
      const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
      const left = Math.max(0, durationSecs - elapsed);
      setRemaining(left);
      if (left === 0) clearInterval(tick);
    }, 1000);
    return () => clearInterval(tick);
  }, [startedAt, durationSecs]);

  const mins = Math.floor(remaining / 60);
  const secs = String(remaining % 60).padStart(2, '0');
  const isUrgent = remaining <= 30;

  return (
    <View style={[styles.countdownRow, { borderColor: isUrgent ? '#EF444430' : '#F59E0B30' }]}>
      <Clock size={14} color={isUrgent ? '#EF4444' : '#F59E0B'} />
      <Text style={[styles.countdownText, { color: isUrgent ? '#EF4444' : '#166534' }]}>
        {remaining === 0
          ? 'Offer expired — refreshing…'
          : `Driver has ${mins}:${secs} to respond`
        }
      </Text>
      {/* Live pulse dot */}
      <MotiView
        from={{ opacity: 0.2 }} animate={{ opacity: 1 }}
        transition={{ loop: true, duration: 700, type: 'timing' }}
        style={[styles.liveDot, { backgroundColor: isUrgent ? '#EF4444' : '#F59E0B' }]}
      />
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────────
const DriverSearchScreen = ({ route, navigation }) => {
  const { orderId } = route.params;

  const [drivers,       setDrivers]       = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [refreshing,    setRefreshing]    = useState(false);
  const [sendingOffer,  setSendingOffer]  = useState(null);
  const [pendingDriver, setPendingDriver] = useState(null);
  const [offerSentAt,   setOfferSentAt]   = useState(null);  // ISO timestamp when offer was sent
  const [offerResult,   setOfferResult]   = useState(null);  // 'accepted' | 'declined' | null
  const [resultName,    setResultName]    = useState('');

  const pollRef         = useRef(null);
  const resultTimerRef  = useRef(null);

  const THEME = {
    forestGreen:     '#0D7A52',
    forestGreenMid:  '#10B981',
    forestGreenDark: '#059669',
    white:           '#FFFFFF',
    bg:              '#F0F4F8',
    black:           '#0D1B2A',
    textMuted:       '#8DA0B8',
    border:          '#E2EBF4',
    error:           '#EF4444',
    warning:         '#F59E0B',
  };

  // ─── Clear any running polls ──────────────────────────────────────────────────
  const stopPolling = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = null;
  }, []);

  // ─── Show result banner, then clear it after 3.5s ────────────────────────────
  const showResult = useCallback((type, name) => {
    setOfferResult(type);
    setResultName(name);
    if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
    resultTimerRef.current = setTimeout(() => setOfferResult(null), 3500);
  }, []);

  // ─── Fetch nearby available drivers ──────────────────────────────────────────
  const fetchNearbyDrivers = useCallback(async (silent = false) => {
    try {
      const res = await apiClient.get('/seller/orders/search-drivers', {
        params: { orderId, radiusKm: 99999 },
      });
      setDrivers(res.data || []);
    } catch (err) {
      console.error('Fetch Drivers Error:', err);
      if (!silent) Alert.alert('Error', 'Failed to find nearby drivers.');
    }
  }, [orderId]);

  // ─── Check pending offer status ───────────────────────────────────────────────
  // Called on initial load and every POLL_PENDING_MS while an offer is pending.
  // Detects instant accept/decline from the driver.
  const checkPendingOffer = useCallback(async (silent = false) => {
    try {
      const res = await apiClient.get(`/driver/orders/${orderId}/pending-offer`);
      const data = res.data;

      if (data?.hasPendingOffer) {
        // Offer still pending — keep waiting
        setPendingDriver(data.driver);
        setOfferSentAt(prev => prev || data.sentAt || new Date().toISOString());
        setDrivers([]);
      } else if (data?.offerAccepted) {
        // ✅ Driver accepted instantly
        stopPolling();
        const name = pendingDriver?.name || data.driver?.name || 'The driver';
        showResult('accepted', name);
        setPendingDriver(null);
        setOfferSentAt(null);
        // Small delay then navigate to order tracking
        setTimeout(() => {
          navigation.replace('TrackingScreen', { orderId });
        }, 2000);
      } else if (data?.offerDeclined) {
        // ❌ Driver declined — show result, refresh list
        stopPolling();
        const name = pendingDriver?.name || data.driver?.name || 'The driver';
        showResult('declined', name);
        setPendingDriver(null);
        setOfferSentAt(null);
        await fetchNearbyDrivers(true);
      } else {
        // Offer expired or was cancelled — unlock the list
        if (pendingDriver) {
          stopPolling();
          setPendingDriver(null);
          setOfferSentAt(null);
        }
        await fetchNearbyDrivers(silent);
      }
    } catch (err) {
      console.error('Status Check Error:', err);
      await fetchNearbyDrivers(silent);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [orderId, pendingDriver, fetchNearbyDrivers, stopPolling, showResult, navigation]);

  // ─── Start fast poll while offer is pending ───────────────────────────────────
  const startPendingPoll = useCallback(() => {
    stopPolling();
    pollRef.current = setInterval(() => checkPendingOffer(true), POLL_PENDING_MS);
  }, [stopPolling, checkPendingOffer]);

  // ─── Start slow background refresh while browsing ────────────────────────────
  const startBrowsingPoll = useCallback(() => {
    stopPolling();
    pollRef.current = setInterval(() => fetchNearbyDrivers(true), POLL_BROWSING_MS);
  }, [stopPolling, fetchNearbyDrivers]);

  // Initial load
  useEffect(() => {
    checkPendingOffer(false);
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // Switch poll mode based on pending state
  useEffect(() => {
    if (loading) return;
    if (pendingDriver) {
      startPendingPoll();
    } else {
      startBrowsingPoll();
    }
    return () => stopPolling();
  }, [pendingDriver, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
    };
  }, [stopPolling]);

  // ─── Pull-to-refresh ─────────────────────────────────────────────────────────
  const onRefresh = () => {
    setRefreshing(true);
    checkPendingOffer(false);
  };

  // ─── Send offer ───────────────────────────────────────────────────────────────
  const sendOfferToDriver = async (driver) => {
    setSendingOffer(driver.id);
    try {
      await apiClient.post(`/seller/orders/${orderId}/send-offer/${driver.id}`);
      setDrivers([]);
      setPendingDriver(driver);
      setOfferSentAt(new Date().toISOString());
      // Immediately start fast polling
      startPendingPoll();
    } catch (error) {
      Alert.alert('Failed', error.response?.data?.message || 'Could not send offer.');
    } finally {
      setSendingOffer(null);
    }
  };

  // ─── Cancel offer ─────────────────────────────────────────────────────────────
  const cancelOffer = async () => {
    if (!pendingDriver) return;
    setSendingOffer(pendingDriver.id);
    try {
      await apiClient.post(`/driver/orders/${orderId}/cancel-offer`);
      stopPolling();
      setPendingDriver(null);
      setOfferSentAt(null);
      await fetchNearbyDrivers(false);
      startBrowsingPoll();
    } catch (error) {
      Alert.alert('Error', 'Could not cancel the offer.');
    } finally {
      setSendingOffer(null);
    }
  };

  // ─── Empty state ──────────────────────────────────────────────────────────────
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <LinearGradient
        colors={['#10B98118', '#10B98108']}
        style={styles.emptyIconCircle}
      >
        <Truck size={40} color="#10B981" strokeWidth={1.5} />
      </LinearGradient>
      <Text style={styles.emptyTitle}>No Drivers Found</Text>
      <Text style={styles.emptyText}>
        Try refreshing to find available drivers nearby.
      </Text>
      <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
        <LinearGradient
          colors={['#0D7A52', '#10B981']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.refreshBtnInner}
        >
          <RotateCcw size={17} color="#fff" strokeWidth={2.5} />
          <Text style={styles.refreshBtnText}>Refresh Search</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  // ─── Loading splash ───────────────────────────────────────────────────────────
  if (loading && !refreshing) {
    return (
      <View style={[styles.center, { backgroundColor: THEME.bg }]}>
        <ActivityIndicator size="large" color={THEME.forestGreenMid} />
        <Text style={[styles.loadingText, { color: THEME.textMuted }]}>Syncing search status…</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: THEME.bg }]}>
      <SafeAreaView style={{ backgroundColor: THEME.white }} />

      {/* ─── Header ─── */}
      <View style={[styles.header, { backgroundColor: THEME.white, borderBottomColor: THEME.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: '#F0F4F8' }]}>
          <ChevronLeft color={THEME.black} size={22} strokeWidth={2.5} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: THEME.black }]}>
            {pendingDriver ? 'Offer Sent' : 'Available Drivers'}
          </Text>
          <Text style={[styles.headerSubtitle, { color: THEME.textMuted }]}>
            {pendingDriver
              ? 'Awaiting driver response…'
              : `${drivers.length} driver${drivers.length !== 1 ? 's' : ''} found nearby`
            }
          </Text>
        </View>

        {/* Live indicator dot */}
        <View style={[styles.liveBtn, { backgroundColor: '#F0F4F8' }]}>
          <MotiView
            from={{ opacity: 0.2 }} animate={{ opacity: 1 }}
            transition={{ loop: true, duration: 900, type: 'timing' }}
            style={[styles.headerLiveDot, { backgroundColor: pendingDriver ? THEME.warning : THEME.forestGreenMid }]}
          />
        </View>
      </View>

      {/* ─── Result banner (accept / decline flash) ─── */}
      {offerResult && (
        <View style={styles.bannerWrapper}>
          <ResultBanner result={offerResult} driverName={resultName} />
        </View>
      )}

      {/* ─── Pending offer view ─── */}
      {pendingDriver ? (
        <FlatList
          data={[pendingDriver]}
          keyExtractor={() => 'pending'}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[THEME.forestGreenMid]} tintColor={THEME.forestGreenMid} />
          }
          ListHeaderComponent={() => (
            <>
              {/* Countdown */}
              <CountdownTicker startedAt={offerSentAt} durationSecs={120} />

              {/* Helper text */}
              <View style={[styles.infoCard, { backgroundColor: '#F59E0B12', borderColor: '#F59E0B30' }]}>
                <Clock size={14} color="#F59E0B" />
                <Text style={[styles.infoText, { color: '#92400E' }]}>
                  While an offer is pending you cannot contact other drivers.
                  The request expires automatically after 2 minutes.
                </Text>
              </View>
            </>
          )}
          renderItem={() => (
            <DriverCard
              item={pendingDriver}
              onSendOffer={cancelOffer}
              isSending={sendingOffer === pendingDriver.id}
              baseURL={apiClient.defaults?.baseURL}
              isCancelMode
              index={0}
            />
          )}
        />
      ) : (
        /* ─── Driver list ─── */
        <FlatList
          data={drivers}
          keyExtractor={item => item.id?.toString()}
          renderItem={({ item, index }) => (
            <DriverCard
              item={item}
              onSendOffer={() => sendOfferToDriver(item)}
              isSending={sendingOffer === item.id}
              baseURL={apiClient.defaults?.baseURL}
              index={index}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[THEME.forestGreenMid]} tintColor={THEME.forestGreenMid} />
          }
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={[
            styles.listContent,
            drivers.length === 0 && styles.listContentEmpty,
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container:    { flex: 1 },
  center:       { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText:  { fontSize: 14, fontWeight: '600' },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1,
  },
  backBtn: {
    width: 42, height: 42, borderRadius: 13,
    justifyContent: 'center', alignItems: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle:  { fontSize: 17, fontWeight: '900', letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  liveBtn: {
    width: 42, height: 42, borderRadius: 13,
    justifyContent: 'center', alignItems: 'center',
  },
  headerLiveDot: { width: 10, height: 10, borderRadius: 5 },

  // Result banner
  bannerWrapper: { paddingHorizontal: 16, paddingTop: 12 },
  resultBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 14, borderRadius: 16, borderWidth: 1,
  },
  resultBannerText: { flex: 1, fontSize: 14, fontWeight: '700' },

  // List
  listContent:      { padding: 16, paddingBottom: 40 },
  listContentEmpty: { flex: 1 },

  // Countdown
  countdownRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    padding: 12, borderRadius: 14, marginBottom: 12,
  },
  countdownText: { flex: 1, fontSize: 13, fontWeight: '700' },
  liveDot: { width: 8, height: 8, borderRadius: 4 },

  // Info card
  infoCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 16,
  },
  infoText: { flex: 1, fontSize: 13, fontWeight: '600', lineHeight: 19 },

  // Empty state
  emptyState: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    marginTop: 60, paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 90, height: 90, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  emptyTitle: { fontSize: 20, fontWeight: '900', color: '#0D1B2A', marginBottom: 8 },
  emptyText:  { textAlign: 'center', color: '#8DA0B8', lineHeight: 20, marginBottom: 28 },
  refreshBtn: { borderRadius: 14, overflow: 'hidden' },
  refreshBtnInner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 24, paddingVertical: 14,
  },
  refreshBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});

export default DriverSearchScreen;