import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MotiView } from 'moti';
import {
  Package, ChevronRight, Clock,
  Calendar, ShieldCheck, Zap, MapPin,
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

// ─── Theme builder ───────────────────────────────────────────────────────────────
const buildTheme = (isDark) => ({
  card:         isDark ? '#1C2A3F' : '#FFFFFF',
  cardAlt:      isDark ? '#243347' : '#F8FAFC',
  border:       isDark ? '#2A3C55' : '#E8F0FA',
  textPrimary:  isDark ? '#F0F6FF' : '#0D1B2A',
  textSecondary:isDark ? '#8BA4C2' : '#4A6080',
  textMuted:    isDark ? '#4E6A8A' : '#94A3B8',
  primary:      '#10B981',
  shadow:       isDark ? '#000' : '#193B5F',
  actionBg:     isDark ? '#0F2744' : '#0D1B2A',
  actionText:   '#FFFFFF',
  nodeEnd:      '#F59E0B',
  timelineLine: isDark ? '#2A3C55' : '#CBD5E1',
});

// ─── MyOfferCard ─────────────────────────────────────────────────────────────────
const MyOfferCard = ({ item, index, onPress }) => {
  const { isDark } = useTheme();
  const theme = useMemo(() => buildTheme(isDark), [isDark]);

  const displayDate = new Date(item.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
  const displayTime = new Date(item.createdAt).toLocaleTimeString([], {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.94, translateY: 14 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{ type: 'spring', delay: index * 90, damping: 18 }}
    >
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        style={[styles.card, {
          backgroundColor: theme.card,
          borderColor:     theme.border,
          shadowColor:     theme.shadow,
        }]}
      >
        {/* ── Top row: badge + price ── */}
        <View style={styles.cardTop}>
          <View style={styles.badgeGroup}>
            <View style={styles.offerBadge}>
              <Zap size={11} color="#059669" fill="#059669" />
              <Text style={styles.offerBadgeText}>DIRECT OFFER</Text>
            </View>
            <Text style={[styles.refText, { color: theme.textMuted }]}>
              #{item.orderId?.slice(0, 8).toUpperCase()}
            </Text>
          </View>

          <View style={styles.priceBlock}>
            <Text style={[styles.priceCurrency, { color: theme.primary }]}>R</Text>
            <Text style={[styles.priceValue, { color: theme.textPrimary }]}>
              {parseFloat(item.price).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* ── Product info ── */}
        <View style={styles.productRow}>
          <View style={[styles.iconBox, { backgroundColor: theme.primary + '18', borderColor: theme.primary + '30' }]}>
            <Package color={theme.primary} size={22} />
          </View>
          <View style={styles.productMeta}>
            <Text style={[styles.orderTitle, { color: theme.textPrimary }]} numberOfLines={1}>
              {item.orderTitle}
            </Text>
            <View style={styles.timeMeta}>
              <Calendar size={11} color={theme.textMuted} />
              <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>{displayDate}</Text>
              <View style={[styles.metaDot, { backgroundColor: theme.border }]} />
              <Clock size={11} color={theme.textMuted} />
              <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>{displayTime}</Text>
            </View>
          </View>
        </View>

        {/* ── Route timeline ── */}
        <View style={[styles.routeCard, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}>
          {/* Left: visual line */}
          <View style={styles.timeline}>
            <View style={[styles.nodeTop, { backgroundColor: theme.primary }]} />
            <View style={[styles.timelineLine, { borderColor: theme.timelineLine }]} />
            <View style={[styles.nodeBottom, { borderColor: theme.nodeEnd }]} />
          </View>

          {/* Right: address text */}
          <View style={styles.routeAddresses}>
            <View style={styles.addressBlock}>
              <Text style={[styles.addressType, { color: theme.textMuted }]}>PICKUP</Text>
              <Text style={[styles.addressValue, { color: theme.textPrimary }]} numberOfLines={1}>
                Agro-Distribution Center
              </Text>
            </View>
            <View style={[styles.routeDivider, { backgroundColor: theme.border }]} />
            <View style={styles.addressBlock}>
              <Text style={[styles.addressType, { color: theme.textMuted }]}>DELIVERY</Text>
              <Text style={[styles.addressValue, { color: theme.textPrimary }]} numberOfLines={1}>
                {item.deliveryAddress}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Footer: verified badge + CTA ── */}
        <View style={styles.footer}>
          <View style={styles.verifiedBadge}>
            <ShieldCheck size={14} color={theme.primary} />
            <Text style={[styles.verifiedText, { color: theme.textSecondary }]}>Verified Cargo</Text>
          </View>

          <TouchableOpacity
            style={[styles.acceptBtn, { backgroundColor: theme.actionBg }]}
            onPress={onPress}
            activeOpacity={0.85}
          >
            <Text style={[styles.acceptBtnText, { color: theme.actionText }]}>Open</Text>
            <ChevronRight size={16} color={theme.actionText} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 26, padding: 20, marginBottom: 16, borderWidth: 1,
    ...Platform.select({
      ios:     { shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 20 },
      android: { elevation: 5 },
    }),
  },

  // Top row
  cardTop:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  badgeGroup:  { gap: 5 },
  offerBadge:  {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#DCFCE7', paddingHorizontal: 9, paddingVertical: 4,
    borderRadius: 9,
  },
  offerBadgeText: { color: '#166534', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  refText:     { fontSize: 12, fontWeight: '700' },
  priceBlock:  { flexDirection: 'row', alignItems: 'baseline', gap: 1 },
  priceCurrency:{ fontSize: 14, fontWeight: '900' },
  priceValue:  { fontSize: 28, fontWeight: '900', letterSpacing: -0.8 },

  // Product row
  productRow:  { flexDirection: 'row', alignItems: 'center', marginBottom: 18, gap: 14 },
  iconBox: {
    width: 52, height: 52, borderRadius: 17,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1,
  },
  productMeta: { flex: 1 },
  orderTitle:  { fontSize: 17, fontWeight: '800', marginBottom: 6, letterSpacing: -0.3 },
  timeMeta:    { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaLabel:   { fontSize: 12, fontWeight: '600' },
  metaDot:     { width: 3, height: 3, borderRadius: 2 },

  // Route
  routeCard:   {
    flexDirection: 'row', padding: 16, borderRadius: 18,
    marginBottom: 18, borderWidth: 1,
  },
  timeline:    { width: 16, alignItems: 'center', paddingTop: 3 },
  nodeTop:     { width: 10, height: 10, borderRadius: 5 },
  timelineLine:{
    width: 1, flex: 1, borderStyle: 'dashed', borderWidth: 1,
    marginVertical: 5,
  },
  nodeBottom:  { width: 10, height: 10, borderRadius: 5, borderWidth: 2 },
  routeAddresses:{ flex: 1, marginLeft: 14 },
  addressBlock:  { gap: 3 },
  routeDivider:  { height: 1, marginVertical: 10 },
  addressType:   { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  addressValue:  { fontSize: 14, fontWeight: '700' },

  // Footer
  footer:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  verifiedBadge:{ flexDirection: 'row', alignItems: 'center', gap: 6 },
  verifiedText: { fontSize: 12, fontWeight: '700' },
  acceptBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 11, borderRadius: 14,
  },
  acceptBtnText: { fontWeight: '800', fontSize: 14 },
});

export default MyOfferCard;