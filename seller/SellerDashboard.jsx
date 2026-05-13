import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, RefreshControl,
  ActivityIndicator, Dimensions, Animated, Platform,
} from 'react-native';
import {
  Menu, Bell, Plus, Package, Wallet,
  ShoppingBag, ClipboardList, BarChart2, Lock, Star, TrendingUp,
  ChevronRight, Shield, AlertTriangle, ArrowUpRight, CheckCircle2,
} from 'lucide-react-native';
import { DrawerActions, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';

import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../context/ThemeContext';
import apiClient from '../services/apiClient';
import ProfessionalModal from '../components/ProfessionalModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const WALLET_GREEN = '#0D7A52';

const buildTheme = (isDark) => ({
  bg:           isDark ? '#0B1120' : '#F0F4F8',
  surface:      isDark ? '#141E30' : '#FFFFFF',
  card:         isDark ? '#1C2A3F' : '#FFFFFF',
  cardAlt:      isDark ? '#243347' : '#F7FAFC',
  border:       isDark ? '#2A3C55' : '#E2EBF4',
  textPrimary:  isDark ? '#F0F6FF' : '#0D1B2A',
  textSecondary:isDark ? '#8BA4C2' : '#4A6080',
  textMuted:    isDark ? '#4E6A8A' : '#8DA0B8',
  headerTop:    isDark ? '#0B1120' : '#F0F4F8', // Matches BG
  primary:      '#10B981',
  primaryDark:  '#059669',
  warning:      '#F59E0B',
  error:        '#EF4444',
  white:        '#FFFFFF',
  shadow:       isDark ? '#000' : '#193B5F',
});

const QUICK_ACTIONS = [
  { id: 'AddProduct',   label: 'Add Items',  icon: Plus,          color: '#8B5CF6' },
  { id: 'ActiveOrders', label: 'Orders',     icon: ClipboardList, color: '#F59E0B' },
  { id: 'Wallet',       label: 'Payouts',    icon: ShoppingBag,   color: '#10B981' },
  { id: 'Inventory',    label: 'Inventory',  icon: BarChart2,     color: '#3B82F6' },
];

const StatCard = ({ icon: Icon, label, value, color, locked, theme, delay = 0 }) => (
  <MotiView
    from={{ opacity: 0, translateY: 12 }}
    animate={{ opacity: 1, translateY: 0 }}
    transition={{ type: 'spring', delay, damping: 18 }}
    style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border, opacity: locked ? 0.55 : 1 }]}
  >
    <View style={[styles.statIconBox, { backgroundColor: color + '20' }]}>
      <Icon size={18} color={color} strokeWidth={2.5} />
    </View>
    <Text style={[styles.statLabel, { color: theme.textMuted }]}>{label}</Text>
    <Text style={[styles.statValue, { color: theme.textPrimary }]}>{value}</Text>
    {locked && (
      <View style={styles.lockedOverlay}>
        <Lock size={14} color={theme.textMuted} />
      </View>
    )}
  </MotiView>
);

const AlertBanner = ({ icon: Icon, iconColor, title, subtitle, onPress, accentColor, theme, delay = 0 }) => (
  <MotiView
    from={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: 'spring', delay, damping: 18 }}
  >
    <TouchableOpacity
      style={[styles.alertBanner, {
        backgroundColor: accentColor + '12',
        borderLeftColor: accentColor,
      }]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      <View style={[styles.alertIconBox, { backgroundColor: accentColor + '20' }]}>
        <Icon size={20} color={accentColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.alertTitle, { color: accentColor }]}>{title}</Text>
        <Text style={[styles.alertSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
      </View>
      <ChevronRight size={18} color={accentColor} />
    </TouchableOpacity>
  </MotiView>
);

const SellerDashboard = ({ navigation }) => {
  const { currentUser: User } = useAuth();
  const { isDark } = useTheme();
  const theme = useMemo(() => buildTheme(isDark), [isDark]);

  const [refreshing,         setRefreshing]         = useState(false);
  const [loading,            setLoading]            = useState(true);
  const [activeProductCount, setActiveProductCount] = useState(0);
  const [walletBalance,      setWalletBalance]      = useState(0);
  const [averageRating,      setAverageRating]      = useState(0);
  const [totalSales,         setTotalSales]         = useState(0);
  const [dashboardData,      setDashboardData]      = useState({
    statusOverview: [], statusDistribution: [], lowStock: [],
    topMovers: [], topProducts: [],
  });
  const [modalConfig, setModalConfig] = useState({
    visible: false, type: 'info', title: '', message: '', buttons: [],
  });

  const isVerified = User?.isVerified === true;
  const isSeller   = User?.role?.toUpperCase() === 'SELLER';

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const fetchDashboardData = useCallback(async () => {
    if (!isSeller) { setLoading(false); return; }
    try {
      const [prodRes, walletRes, statsRes, overviewRes, distroRes, stockRes, moversRes, topRes] =
        await Promise.allSettled([
          apiClient.get('/Products/seller/my-products'),
          apiClient.get('/wallet/balance'),
          apiClient.get('/seller/orders/profile-stats'),
          apiClient.get('/seller/orders/status-overview'),
          apiClient.get('/seller/orders/status-distribution'),
          apiClient.get('/seller/orders/low-stock-alerts'),
          apiClient.get('/seller/orders/top-movers'),
          apiClient.get('/seller/orders/top-products'),
        ]);

      if (prodRes.status === 'fulfilled')   setActiveProductCount(prodRes.value.data.length);
      if (walletRes.status === 'fulfilled') setWalletBalance(walletRes.value.data?.balance ?? 0);
      if (statsRes.status === 'fulfilled') {
        const s = statsRes.value.data;
        setAverageRating(s.averageRating ?? 0);
        setTotalSales(s.totalSales ?? s.completedOrders ?? 0);
      }

      setDashboardData({
        statusOverview:    overviewRes.status === 'fulfilled' ? overviewRes.value.data : [],
        statusDistribution:distroRes.status   === 'fulfilled' ? distroRes.value.data  : [],
        lowStock:          stockRes.status    === 'fulfilled' ? stockRes.value.data   : [],
        topMovers:         moversRes.status   === 'fulfilled' ? moversRes.value.data  : [],
        topProducts:       topRes.status      === 'fulfilled' ? topRes.value.data     : [],
      });

    } catch (err) {
      console.warn('Dashboard Sync Error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isSeller]);

  useFocusEffect(
    useCallback(() => { fetchDashboardData(); }, [fetchDashboardData])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  }, [fetchDashboardData]);

  const handleFeatureAccess = (navigateTo) => {
    if (!isVerified) {
      setModalConfig({
        visible: true, type: 'warning',
        title: 'Verification Required',
        message: 'Complete seller verification to unlock all features.',
        buttons: [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Get Verified', onPress: () => navigation.navigate('SellerVerification') },
        ],
      });
      return;
    }
    navigation.navigate(navigateTo);
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.textMuted }]}>Loading your dashboard…</Text>
      </View>
    );
  }

  const stats = [
    { label: 'Products',    value: isVerified ? activeProductCount                    : '•••', icon: Package,    color: '#10B981' },
    { label: 'Avg Rating',  value: isVerified ? Number(averageRating || 0).toFixed(1) : '•••', icon: Star,       color: '#FBBF24' },
    { label: 'Total Sales', value: isVerified ? totalSales                            : '•••', icon: TrendingUp, color: '#3B82F6' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>

      <StatusBar
        backgroundColor={theme.bg}
        barStyle={isDark ? "light-content" : "dark-content"}
        translucent={false}
      />

      {/* ═══ HEADER — Background Removed ══════════════════════════════════ */}
      <View style={[styles.header, { backgroundColor: theme.bg }]}>
        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          activeOpacity={0.7}
        >
          <Menu color={theme.textPrimary} size={21} />
        </TouchableOpacity>

        <View style={styles.headerBrand}>
          <View style={[styles.brandDot, { backgroundColor: theme.primary }]} />
          <Text style={[styles.brandTitle, { color: theme.textPrimary }]}>Merchant Studio</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.7}
          >
            <Bell color={theme.textPrimary} size={21} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      >
        {/* Welcome row — Animation Removed */}
        <View style={styles.welcomeRow}>
          <View>
            <Text style={[styles.welcomeSub, { color: theme.textSecondary }]}>{greeting},</Text>
            <Text style={[styles.welcomeName, { color: theme.textPrimary }]}>{User?.name || 'Partner'}</Text>
          </View>
          <View style={[
            styles.verifiedChip,
            {
              backgroundColor: isVerified ? theme.primary + '20' : theme.warning + '20',
              borderColor:     isVerified ? theme.primary        : theme.warning,
            },
          ]}>
            <View style={[styles.chipDot, { backgroundColor: isVerified ? theme.primary : theme.warning }]} />
            <Text style={[styles.chipText, { color: isVerified ? theme.primary : theme.warning }]}>
              {isVerified ? 'VERIFIED' : 'PENDING'}
            </Text>
          </View>
        </View>

        {!isVerified && (
          <AlertBanner
            icon={Shield}
            iconColor={theme.warning}
            title="Verification Required"
            subtitle="Complete verification to unlock all seller features"
            onPress={() => navigation.navigate('SellerVerification')}
            accentColor={theme.warning}
            theme={theme}
            delay={80}
          />
        )}

        {isVerified && dashboardData.lowStock.length > 0 && (
          <AlertBanner
            icon={AlertTriangle}
            iconColor={theme.error}
            title="Low Stock Alert"
            subtitle={`${dashboardData.lowStock.length} items need restocking`}
            onPress={() => handleFeatureAccess('Inventory')}
            accentColor={theme.error}
            theme={theme}
            delay={80}
          />
        )}

        <MotiView
          from={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', delay: 100, damping: 18 }}
          style={{ opacity: isVerified ? 1 : 0.6 }}
        >
          <TouchableOpacity
            onPress={() => handleFeatureAccess('Wallet')}
            activeOpacity={0.88}
            disabled={!isVerified}
          >
            <LinearGradient
              colors={[WALLET_GREEN, '#10B981']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.walletCard}
            >
              <View style={styles.walletOrb1} />
              <View style={styles.walletOrb2} />

              <View style={styles.walletHeader}>
                <View style={styles.walletIconBox}>
                  <Wallet size={22} color="#fff" />
                </View>
                {isVerified
                  ? <CheckCircle2 size={18} color="rgba(255,255,255,0.7)" />
                  : <Lock size={18} color="rgba(255,255,255,0.7)" />
                }
              </View>

              <Text style={styles.walletLabel}>Available Balance</Text>
              <Text style={styles.walletBalance}>
                {isVerified ? `R ${Number(walletBalance).toFixed(2)}` : 'R ••••'}
              </Text>
              <Text style={styles.walletSub}>
                {isVerified ? 'Settlements active · Next payout in 3 days' : 'Verify to access wallet'}
              </Text>

              {isVerified && (
                <View style={styles.walletBtn}>
                  <Text style={styles.walletBtnText}>Manage Wallet</Text>
                  <ArrowUpRight size={15} color={WALLET_GREEN} />
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </MotiView>

        <View style={styles.statsGrid}>
          {stats.map((s, i) => (
            <StatCard
              key={i}
              icon={s.icon}
              label={s.label}
              value={s.value}
              color={s.color}
              locked={!isVerified}
              theme={theme}
              delay={i * 60 + 150}
            />
          ))}
        </View>

        {isVerified && dashboardData.topMovers.length > 0 && (
          <MotiView
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', delay: 300, damping: 18 }}
          >
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionAccent, { backgroundColor: theme.primary }]} />
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Top Movers</Text>
            </View>
            <View style={styles.moversList}>
              {dashboardData.topMovers.slice(0, 3).map((item, i) => (
                <View
                  key={i}
                  style={[styles.moverItem, { backgroundColor: theme.card, borderColor: theme.border }]}
                >
                  <View style={[styles.moverRank, { backgroundColor: theme.primary + '18' }]}>
                    <Text style={[styles.moverRankText, { color: theme.primary }]}>#{i + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.moverName, { color: theme.textPrimary }]}>{item.productName}</Text>
                    <Text style={[styles.moverMeta, { color: theme.textMuted }]}>{item.totalSold} units sold</Text>
                  </View>
                  <ArrowUpRight size={18} color={theme.primary} />
                </View>
              ))}
            </View>
          </MotiView>
        )}

        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', delay: 360, damping: 18 }}
        >
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionAccent, { backgroundColor: '#8B5CF6' }]} />
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Quick Actions</Text>
          </View>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((a) => (
              <TouchableOpacity
                key={a.id}
                onPress={() => handleFeatureAccess(a.id)}
                style={[styles.actionCard, {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  opacity: !isVerified ? 0.58 : 1,
                }]}
                activeOpacity={0.82}
              >
                <View style={[styles.actionIconBox, { backgroundColor: a.color + '18' }]}>
                  <a.icon color={a.color} size={22} />
                </View>
                <Text style={[styles.actionLabel, { color: theme.textPrimary }]}>{a.label}</Text>
                {!isVerified && <Lock size={13} color={theme.textMuted} style={{ marginTop: 4 }} />}
              </TouchableOpacity>
            ))}
          </View>
        </MotiView>

        <View style={{ height: 48 }} />
      </ScrollView>

      <ProfessionalModal
        visible={modalConfig.visible}
        onClose={() => setModalConfig(p => ({ ...p, visible: false }))}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        buttons={modalConfig.buttons}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:  { flex: 1 },
  center:     { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText:{ fontSize: 14, fontWeight: '600' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 14,
    paddingBottom: 10,
  },
  headerBtn: {
    width: 42, height: 42, borderRadius: 13,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1,
  },
  headerBrand: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  brandDot:    { width: 8, height: 8, borderRadius: 4 },
  brandTitle:  { fontSize: 18, fontWeight: '900', letterSpacing: -0.4 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  notifDot: {
    position: 'absolute', top: 8, right: 8,
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: '#fff',
  },

  scroll: { padding: 20, paddingTop: 8 },

  welcomeRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  welcomeSub:  { fontSize: 13, fontWeight: '600', marginBottom: 3 },
  welcomeName: { fontSize: 26, fontWeight: '900', letterSpacing: -0.6 },
  verifiedChip:{
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1,
  },
  chipDot:  { width: 7, height: 7, borderRadius: 3.5 },
  chipText: { fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },

  alertBanner: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, borderRadius: 18, marginBottom: 14,
    borderLeftWidth: 4, gap: 12,
  },
  alertIconBox:  { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  alertTitle:    { fontSize: 14, fontWeight: '900', marginBottom: 2 },
  alertSubtitle: { fontSize: 12, fontWeight: '600' },

  walletCard: {
    borderRadius: 26, padding: 24, marginBottom: 20,
    overflow: 'hidden', position: 'relative',
  },
  walletOrb1: { position: 'absolute', top: -50, right: -50, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.07)' },
  walletOrb2: { position: 'absolute', bottom: -40, left: -40, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,255,255,0.04)' },
  walletHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  walletIconBox: { width: 46, height: 46, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.18)', justifyContent: 'center', alignItems: 'center' },
  walletLabel:   { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '700', marginBottom: 6 },
  walletBalance: { color: '#fff', fontSize: 34, fontWeight: '900', letterSpacing: -1, marginBottom: 6 },
  walletSub:     { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600', marginBottom: 20 },
  walletBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', paddingVertical: 12, borderRadius: 12, gap: 7,
  },
  walletBtnText: { fontSize: 14, fontWeight: '900', color: WALLET_GREEN },

  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1, padding: 16, borderRadius: 20, borderWidth: 1,
    position: 'relative',
  },
  statIconBox: { width: 38, height: 38, borderRadius: 11, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statLabel:   { fontSize: 10, fontWeight: '700', letterSpacing: 0.3, marginBottom: 4 },
  statValue:   { fontSize: 19, fontWeight: '900', letterSpacing: -0.4 },
  lockedOverlay:{ position: 'absolute', top: 10, right: 10 },

  sectionHeaderRow:{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  sectionAccent:   { width: 4, height: 20, borderRadius: 2 },
  sectionTitle:    { fontSize: 18, fontWeight: '900', letterSpacing: -0.3 },

  moversList: { marginBottom: 24 },
  moverItem:  {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 16, borderRadius: 18, borderWidth: 1, marginBottom: 10,
  },
  moverRank:      { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  moverRankText: { fontSize: 13, fontWeight: '900' },
  moverName:      { fontSize: 15, fontWeight: '800', marginBottom: 2 },
  moverMeta:      { fontSize: 12, fontWeight: '600' },

  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard:  {
    width: (SCREEN_WIDTH - 52) / 2, padding: 20,
    borderRadius: 20, borderWidth: 1, alignItems: 'center',
  },
  actionIconBox: { width: 54, height: 54, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  actionLabel:   { fontSize: 14, fontWeight: '800' },
});

export default SellerDashboard;