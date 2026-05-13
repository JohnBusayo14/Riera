// import React, { useState, useEffect } from 'react';
// import { 
//   View, Text, StyleSheet, TouchableOpacity, 
//   Image, ActivityIndicator 
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Star, Navigation, Send, Truck, CheckCircle2, XCircle } from 'lucide-react-native';
// import apiClient from '../../services/apiClient.jsx'; 

// const THEME = {
//   forestGreen: '#228B22',
//   forestGreenDark: '#1a6b1a',
//   forestGreenLight: '#2ea52e',
//   white: '#FFFFFF',
//   black: '#0F172A',
//   gray: '#64748B',
//   warning: '#F59E0B',
//   success: '#10B981',
//   danger: '#EF4444',
//   dangerDark: '#B91C1C',
// };

// const DriverCard = ({ item, onSendOffer, isSending, baseURL, isCancelMode }) => {
//   const [details, setDetails] = useState(null);
//   const [loadingDetails, setLoadingDetails] = useState(!isCancelMode);
//   const [imageError, setImageError] = useState(false);

//   useEffect(() => {
//     // If we are in cancel mode, 'item' usually already has the database DTO data
//     if (isCancelMode) {
//       setLoadingDetails(false);
//       return;
//     }

//     const fetchDetails = async () => {
//       try {
//         setLoadingDetails(true);
//         const response = await apiClient.get(`/driver/admin/driver-details/${item.id}`);
//         setDetails(response.data);
//       } catch (error) {
//         console.error(`Error fetching details for driver ${item.id}:`, error);
//       } finally {
//         setLoadingDetails(false);
//       }
//     };
//     fetchDetails();
//   }, [item.id, isCancelMode]);

//   // SAFE RATING LOGIC: Prevents ".toFixed is not a function"
//   const renderRating = () => {
//     const rawRating = item.rating ?? item.averageRating ?? details?.averageRating;
//     const numericRating = parseFloat(rawRating);
    
//     if (isNaN(numericRating)) return "5.0";
//     return numericRating.toFixed(1);
//   };

//   const getFullImageUrl = () => {
//     // Priority: item.profilePictureUrl (from DTO) -> details.verification.profileImage (from full fetch)
//     const path = item.profilePictureUrl || details?.verification?.profileImage;
//     if (!path || !baseURL) return null;
    
//     const cleanBase = baseURL.replace(/\/api\/?$/, '');
//     const cleanPath = path.startsWith('/') ? path : `/${path}`;
//     return `${cleanBase}${cleanPath}`;
//   };

//   const profileImageUrl = getFullImageUrl();

//   return (
//     <View style={[styles.driverCard, isCancelMode && styles.pendingCardBorder]}>
//       <View style={styles.cardHeader}>
//         <View style={styles.avatarContainer}>
//           {loadingDetails ? (
//             <View style={styles.avatarGradientLoading}>
//               <ActivityIndicator size="small" color={THEME.forestGreen} />
//             </View>
//           ) : (profileImageUrl && !imageError) ? (
//             <Image 
//               source={{ uri: profileImageUrl }} 
//               style={styles.avatarImage}
//               resizeMode="cover"
//               onError={() => setImageError(true)}
//             />
//           ) : (
//             <LinearGradient
//               colors={[THEME.forestGreenLight, THEME.forestGreen]}
//               style={styles.avatarGradient}
//             >
//               <Text style={styles.avatarText}>
//                 {item.name?.charAt(0).toUpperCase() || 'D'}
//               </Text>
//             </LinearGradient>
//           )}
          
//           <View style={styles.onlinePulseContainer}>
//             <View style={styles.onlinePulse} />
//             <View style={styles.onlineBadge} />
//           </View>
//         </View>

//         <View style={styles.driverInfo}>
//           <View style={styles.nameRow}>
//             <Text style={styles.driverName} numberOfLines={1}>
//               {item.name}
//             </Text>
//             {(item.isVerified || details?.verification?.status === "Approved") && (
//               <CheckCircle2 size={16} color={THEME.success} fill={THEME.success} />
//             )}
//           </View>

//           <View style={styles.statsContainer}>
//             <View style={[styles.statChip, { backgroundColor: THEME.forestGreen + '15' }]}>
//               <Truck size={12} color={THEME.forestGreen} />
//               <Text style={[styles.statChipText, { color: THEME.forestGreen }]}>
//                 {isCancelMode ? (item.vehicleType || "Vehicle") : (details?.verification?.vehicleType || item.vehicleType || "Pro")}
//               </Text>
//             </View>
            
//             <View style={[styles.statChip, { backgroundColor: THEME.warning + '15' }]}>
//               <Star size={12} color={THEME.warning} fill={THEME.warning} />
//               <Text style={[styles.statChipText, { color: THEME.warning }]}>
//                 {renderRating()}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.distanceRow}>
//             <View style={styles.distanceIconCircle}>
//               <Navigation size={14} color={THEME.forestGreen} />
//             </View>
//             <Text style={styles.distanceText}>
//               {item.calculatedDistance 
//                 ? `${parseFloat(item.calculatedDistance).toFixed(1)} km away` 
//                 : isCancelMode ? 'Active Request' : 'Nearby'}
//             </Text>
//           </View>
//         </View>
//       </View>

//       <TouchableOpacity 
//         style={styles.offerButton}
//         onPress={() => onSendOffer(item)}
//         disabled={isSending}
//         activeOpacity={0.8}
//       >
//         <LinearGradient
//           colors={
//             isCancelMode 
//               ? [THEME.danger, THEME.dangerDark] 
//               : isSending 
//                 ? ['#94A3B8', '#64748B'] 
//                 : [THEME.forestGreen, THEME.forestGreenDark]
//           }
//           start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
//           style={styles.offerButtonGradient}
//         >
//           {isSending ? (
//             <ActivityIndicator size="small" color="#FFF" />
//           ) : (
//             <>
//               {isCancelMode ? <XCircle size={18} color={THEME.white} /> : <Send size={18} color={THEME.white} />}
//               <Text style={styles.offerButtonText}>
//                 {isCancelMode ? "Cancel Request" : "Send Delivery Offer"}
//               </Text>
//             </>
//           )}
//         </LinearGradient>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   driverCard: { 
//     backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 16,
//     borderWidth: 1, borderColor: '#F1F5F9', elevation: 4,
//     shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1, shadowRadius: 4,
//   },
//   pendingCardBorder: { borderColor: THEME.danger + '40', borderWidth: 2 },
//   cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
//   avatarContainer: { position: 'relative', marginRight: 16 },
//   avatarImage: { width: 70, height: 70, borderRadius: 20, borderWidth: 3, borderColor: '#FFF' },
//   avatarGradient: { width: 70, height: 70, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFF' },
//   avatarGradientLoading: { width: 70, height: 70, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F5F9', borderWidth: 3, borderColor: '#FFF' },
//   avatarText: { color: '#FFF', fontSize: 26, fontWeight: '900' },
//   onlinePulseContainer: { position: 'absolute', bottom: 2, right: 2 },
//   onlinePulse: { position: 'absolute', width: 20, height: 20, borderRadius: 10, backgroundColor: '#22C55E40' },
//   onlineBadge: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#22C55E', borderWidth: 3, borderColor: '#FFF' },
//   driverInfo: { flex: 1 },
//   nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
//   driverName: { fontSize: 18, fontWeight: '900', color: '#0F172A', flex: 1 },
//   statsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
//   statChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, gap: 5 },
//   statChipText: { fontSize: 12, fontWeight: '800' },
//   distanceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   distanceIconCircle: { width: 28, height: 28, borderRadius: 9, backgroundColor: '#228B2220', justifyContent: 'center', alignItems: 'center' },
//   distanceText: { fontSize: 13, color: '#228B22', fontWeight: '800' },
//   offerButton: { borderRadius: 18, overflow: 'hidden' },
//   offerButtonGradient: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
//   offerButtonText: { color: '#FFF', fontWeight: '900', fontSize: 16 },
// });

// export default DriverCard;














// components/DriverCard.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, ActivityIndicator, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import {
  Star, Truck, Send, XCircle,
  CheckCircle2, Navigation,
} from 'lucide-react-native';
import apiClient from '../../services/apiClient.jsx';

// ─── Color tokens ─────────────────────────────────────────────────────────────────
const C = {
  green:       '#0D7A52',
  greenMid:    '#10B981',
  amber:       '#F59E0B',
  amberGlow:   'rgba(245,158,11,0.10)',
  blue:        '#3B82F6',
  red:         '#EF4444',
  textPrimary: '#0D1B2A',
  textMuted:   '#8DA0B8',
  border:      '#E2EBF4',
  cardBg:      '#FFFFFF',
  surface:     '#F7FAFC',
};

// ─── Compact inline stat pill ─────────────────────────────────────────────────────
const StatPill = ({ icon: Icon, value, color, fillIcon = false }) => (
  <View style={styles.statPill}>
    <Icon size={11} color={color} strokeWidth={2.5} fill={fillIcon ? color : 'none'} />
    <Text style={[styles.statPillText, { color }]}>{value}</Text>
  </View>
);

// ─── DriverCard ───────────────────────────────────────────────────────────────────
const DriverCard = ({
  item,
  onSendOffer,
  isSending,
  baseURL,
  isCancelMode = false,
  index = 0,
}) => {
  const [details,      setDetails]      = useState(null);
  const [imageError,   setImageError]   = useState(false);
  const [loadingExtra, setLoadingExtra] = useState(!isCancelMode);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isCancelMode) { pulseAnim.setValue(1); return; }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.25, duration: 850, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 850, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isCancelMode, pulseAnim]);

  useEffect(() => {
    if (isCancelMode) { setLoadingExtra(false); return; }
    const driverId = item?.Id || item?.id;
    if (!driverId) { setLoadingExtra(false); return; }
    const run = async () => {
      try {
        const res = await apiClient.get(`/driver/admin/driver-details/${driverId}`);
        setDetails(res.data);
      } catch { /* non-fatal */ } finally {
        setLoadingExtra(false);
      }
    };
    run();
  }, [item?.Id, item?.id, isCancelMode]);

  // ── Field resolution ──────────────────────────────────────────────────────────
  const driverName  = item?.Name        || item?.name        || 'Driver';
  const vehicle     = item?.VehicleType || item?.vehicleType || details?.verification?.vehicleType || 'Vehicle';
  const rawRating   = item?.Rating      ?? item?.rating      ?? details?.averageRating ?? 5;
  const rating      = parseFloat(rawRating).toFixed(1);
  const distance    = item?.CalculatedDistance ?? item?.calculatedDistance ?? item?.distanceKm;
  const distanceStr = distance != null ? `${parseFloat(distance).toFixed(1)} km` : 'Nearby';
  const isOnline    = item?.IsOnline    ?? item?.isOnline    ?? false;
  const isVerified  = item?.isVerified  || details?.verification?.status === 'Approved';
  const rawPic      = item?.ProfilePictureUrl || item?.profilePictureUrl || details?.verification?.profileImage || null;
  const initials    = driverName.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const avatarUri = (() => {
    if (!rawPic || imageError) return null;
    if (rawPic.startsWith('http')) return rawPic;
    const base = (baseURL || '').replace(/\/api\/?$/, '');
    return `${base}${rawPic.startsWith('/') ? rawPic : '/' + rawPic}`;
  })();

  const accentColor = isCancelMode ? C.amber : C.greenMid;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 14 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', delay: index * 60, damping: 18 }}
      style={[styles.card, { borderColor: isCancelMode ? C.amber + '50' : C.border }]}
    >
      {/* Left accent stripe */}
      <View style={[styles.accentStripe, { backgroundColor: accentColor }]} />

      <View style={styles.inner}>

        {/* ── Single row: avatar | name+vehicle+stats | button ── */}
        <View style={styles.row}>

          {/* Avatar */}
          <View style={styles.avatarShell}>
            {loadingExtra ? (
              <View style={[styles.avatar, styles.avatarLoader]}>
                <ActivityIndicator size="small" color={C.greenMid} />
              </View>
            ) : avatarUri ? (
              <Image
                source={{ uri: avatarUri }}
                style={styles.avatar}
                resizeMode="cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <LinearGradient
                colors={isCancelMode ? [C.amber, '#D97706'] : [C.green, C.greenMid]}
                style={styles.avatar}
              >
                <Text style={styles.avatarInitials}>{initials}</Text>
              </LinearGradient>
            )}
            {/* Online dot */}
            <View style={[styles.onlineDot, { backgroundColor: isOnline ? '#22C55E' : C.textMuted }]} />
          </View>

          {/* Name + vehicle + inline stats */}
          <View style={styles.info}>
            <View style={styles.nameRow}>
              <Text style={styles.driverName} numberOfLines={1}>{driverName}</Text>
              {isVerified && <CheckCircle2 size={13} color={C.greenMid} fill={C.greenMid} />}
            </View>

            <View style={styles.metaRow}>
              <Truck size={11} color={C.textMuted} strokeWidth={2} />
              <Text style={styles.vehicleText}>{vehicle}</Text>
              <View style={styles.dot} />
              <StatPill icon={Star}       value={rating}      color={C.amber} fillIcon />
              <View style={styles.dot} />
              <StatPill icon={Navigation} value={distanceStr} color={C.blue} />
            </View>
          </View>

        </View>

        {/* Pending hint */}
        {isCancelMode && (
          <View style={[styles.pendingHint, { backgroundColor: C.amberGlow, borderColor: C.amber + '30' }]}>
            <Text style={styles.pendingHintText}>
              Waiting for driver to accept · Auto-expires in 2 mins
            </Text>
          </View>
        )}

        {/* Action button */}
        <TouchableOpacity
          onPress={() => onSendOffer(item)}
          disabled={isSending}
          activeOpacity={0.85}
          style={styles.btnOuter}
        >
          {isCancelMode ? (
            <View style={[styles.btn, styles.cancelBtn]}>
              {isSending
                ? <ActivityIndicator color={C.red} size="small" />
                : <><XCircle size={16} color={C.red} strokeWidth={2.5} /><Text style={[styles.btnText, { color: C.red }]}>Cancel Request</Text></>
              }
            </View>
          ) : (
            <LinearGradient
              colors={isSending ? ['#6B7280', '#4B5563'] : [C.green, C.greenMid]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.btn}
            >
              {isSending
                ? <ActivityIndicator color="#fff" size="small" />
                : <><Send size={15} color="#fff" strokeWidth={2.5} /><Text style={[styles.btnText, { color: '#fff' }]}>Send Delivery Offer</Text></>
              }
            </LinearGradient>
          )}
        </TouchableOpacity>

      </View>
    </MotiView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: C.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
  },
  accentStripe: {
    width: 3,
  },
  inner: {
    flex: 1,
    padding: 12,
    gap: 10,
  },

  // Single content row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // Avatar — 44px, compact
  avatarShell: { position: 'relative' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLoader: { backgroundColor: C.surface },
  avatarInitials: { color: '#fff', fontSize: 15, fontWeight: '900' },
  onlineDot: {
    position: 'absolute',
    bottom: -2, right: -2,
    width: 10, height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: C.cardBg,
  },

  // Info block
  info: { flex: 1, gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  driverName: {
    fontSize: 14,
    fontWeight: '900',
    color: C.textPrimary,
    letterSpacing: -0.2,
    flex: 1,
  },

  // Meta row — vehicle · rating · distance all inline
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexWrap: 'wrap',
  },
  vehicleText: { fontSize: 11, fontWeight: '600', color: C.textMuted },
  dot: {
    width: 3, height: 3, borderRadius: 1.5,
    backgroundColor: C.border,
  },

  // Stat pill — icon + value inline, no label
  statPill: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  statPillText: { fontSize: 11, fontWeight: '800' },

  // Pending hint
  pendingHint: {
    borderRadius: 9,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pendingHintText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
    textAlign: 'center',
  },

  // Button
  btnOuter: { borderRadius: 11, overflow: 'hidden' },
  btn: {
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 11,
  },
  cancelBtn: {
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(239,68,68,0.30)',
  },
  btnText: { fontSize: 13, fontWeight: '900', letterSpacing: -0.2 },
});

export default DriverCard;