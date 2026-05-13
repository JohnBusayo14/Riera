import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  FlatList,
  Image,
  ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

// Icons
import { 
  Bell, 
  Package, 
  MapPin,
  Store,
  Wallet,
  ShoppingBag,
  ChevronRight,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react-native';

import { useAuth } from '../auth/AuthContext'; 
import { useTheme } from '../context/ThemeContext';
import apiClient from '../services/apiClient';

// Brand Colors
const COLORS = {
  forestGreen: '#106324',
  darkForest: '#0A4118',
  lightForest: '#1A7A34',
  white: '#FFFFFF',
  black: '#0F172A',
  darkGray: '#1E293B',
  lightGray: '#F8FAFC',
  mediumGray: '#64748B',
  orange: '#F97316',
  blue: '#3B82F6',
};

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  const { currentUser: user } = useAuth(); 
  const { isDark } = useTheme();

  // DASHBOARD STATE
  const [orders, setOrders] = useState([]);
  const [balance, setBalance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  
  // CAROUSEL STATE
  const [promoBanners, setPromoBanners] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [loadingBanners, setLoadingBanners] = useState(true);

  const flatListRef = useRef(null);

  const theme = {
    bg: isDark ? COLORS.black : COLORS.lightGray,
    card: isDark ? COLORS.darkGray : COLORS.white,
    text: isDark ? COLORS.white : COLORS.black,
    subtext: isDark ? '#94A3B8' : COLORS.mediumGray,
    border: isDark ? '#334155' : '#E2E8F0',
    iconBg: isDark ? '#334155' : '#F1F5F9',
    iconColor: isDark ? '#F1F5F9' : COLORS.black,
  };

  // --- AUTOMATIC SLIDING LOGIC ---
  useEffect(() => {
    if (promoBanners.length === 0) return;

    const timer = setInterval(() => {
      let nextSlide = activeSlide + 1;
      
      if (nextSlide >= promoBanners.length) {
        nextSlide = 0;
      }

      flatListRef.current?.scrollToIndex({
        index: nextSlide,
        animated: true,
      });

      setActiveSlide(nextSlide);
    }, 4000);

    return () => clearInterval(timer);
  }, [activeSlide, promoBanners]);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch Wallet
      const walletRes = await apiClient.get('/wallet/balance');
      setBalance(walletRes.data.balance || 0);

      // 2. Fetch Orders
      const ordersRes = await apiClient.get('/orders/marketplace/history');
      const fetchedOrders = ordersRes.data?.orders || ordersRes.data || [];
      setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []);

      // 3. Fetch Admin Managed Banners
      const bannersRes = await apiClient.get('/admin/banners');
      
      const IP_ADDR = '192.168.0.170'; 
      const PORT = '5000';
      const BASE_URL = `https://${IP_ADDR}:${PORT}`; 

      const formattedBanners = bannersRes.data.map(banner => {
        let finalUrl = banner.imageUrl;

        if (!finalUrl.startsWith('http')) {
          const cleanPath = finalUrl.startsWith('/') ? finalUrl : `/${finalUrl}`;
          finalUrl = `${BASE_URL}${cleanPath}`;
        }

        return {
          ...banner,
          imageUrl: finalUrl
        };
      });

      setPromoBanners(formattedBanners);
      setLoadingBanners(false);

    } catch (e) {
      console.error("Dashboard Sync Error:", e);
      setLoadingBanners(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const renderBannerItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.9} style={styles.bannerContainer}>
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.bannerImage}
        defaultSource={require('../assets/default.jpeg')} 
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.85)']}
        style={styles.bannerOverlay}
      >
        <View style={styles.tagContainer}>
          <Sparkles size={10} color={COLORS.white} />
          <Text style={styles.tagText}>{item.tag || item.category}</Text>
        </View>
        <Text style={styles.bannerTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.bannerSubtitle} numberOfLines={2}>{item.subtitle}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const firstName = user?.name?.split(' ')[0] || 'User';
  const activeOrdersCount = orders.length;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* ENHANCED HEADER */}
      <LinearGradient
        colors={isDark ? [COLORS.darkGray, COLORS.black] : [COLORS.white, COLORS.lightGray]}
        style={[styles.headerGradient, { paddingTop: insets.top + 15 }]}
      >
        <View style={styles.headerTopRow}>
          <View
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
          >
            <Text style={[styles.welcomeGreeting, { color: theme.subtext }]}>
              Welcome back 👋
            </Text>
            <Text style={[styles.userName, { color: theme.text }]}>
              {firstName}
            </Text>
           
          </View>

          <View
            transition={{ type: 'spring', damping: 15 }}
          >
            <TouchableOpacity 
              style={[styles.notifButton, { backgroundColor: theme.iconBg }]}
              onPress={() => nav.navigate('Notifications')}
              activeOpacity={0.7}
            >
              <Bell size={22} color={theme.iconColor} strokeWidth={2.5} />
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Row */}
        <View
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.statsRow}
        >
          <View style={[styles.statCard, { backgroundColor: isDark ? '#334155' : '#F0FDF4' }]}>
            <View style={[styles.statIconCircle, { backgroundColor: COLORS.forestGreen }]}>
              <Package size={16} color={COLORS.white} strokeWidth={2.5} />
            </View>
            <View style={styles.statTextContainer}>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {activeOrdersCount}
              </Text>
              <Text style={[styles.statLabel, { color: theme.subtext }]}>
                Active Orders
              </Text>
            </View>
          </View>

          <View style={[styles.statCard, { backgroundColor: isDark ? '#334155' : '#FFF7ED' }]}>
            <View style={[styles.statIconCircle, { backgroundColor: COLORS.orange }]}>
              <TrendingUp size={16} color={COLORS.white} strokeWidth={2.5} />
            </View>
            <View style={styles.statTextContainer}>
              <Text style={[styles.statValue, { color: theme.text }]}>
                R{balance.toLocaleString()}
              </Text>
              <Text style={[styles.statLabel, { color: theme.subtext }]}>
                Balance
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={COLORS.forestGreen}
            colors={[COLORS.forestGreen]}
          />
        }
      >
        
        {/* --- DYNAMIC CAROUSEL --- */}
        <View
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.carouselWrapper}
        >
          {loadingBanners ? (
            <View style={[styles.loaderBox, { backgroundColor: theme.card }]}>
              <ActivityIndicator color={COLORS.forestGreen} size="large" />
              <Text style={[styles.loadingText, { color: theme.subtext }]}>
                Loading promotions...
              </Text>
            </View>
          ) : promoBanners.length > 0 ? (
            <>
              <FlatList
                ref={flatListRef}
                data={promoBanners}
                renderItem={renderBannerItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                  const x = e.nativeEvent.contentOffset.x;
                  setActiveSlide(Math.round(x / width));
                }}
                scrollEventThrottle={16}
              />
              {/* Enhanced Pagination Dots */}
              <View style={styles.pagination}>
                {promoBanners.map((_, index) => (
                  <View
                    key={index}
                    animate={{
                      width: activeSlide === index ? 24 : 8,
                      backgroundColor: activeSlide === index ? COLORS.forestGreen : 'rgba(255,255,255,0.5)',
                    }}
                    transition={{ type: 'spring', damping: 15 }}
                    style={styles.dot}
                  />
                ))}
              </View>
            </>
          ) : (
            <View style={[styles.loaderBox, { backgroundColor: theme.card }]}>
              <Sparkles size={32} color={theme.subtext} />
              <Text style={[styles.loadingText, { color: theme.subtext }]}>
                No promotions available
              </Text>
            </View>
          )}
        </View>

        {/* ENHANCED WALLET CARD */}
        <View
        >
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => nav.navigate('Wallet')}
          >
            <LinearGradient
              colors={[COLORS.forestGreen, COLORS.darkForest]}
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 1 }}
              style={styles.balanceCard}
            >
              {/* Decorative circles */}
              <View style={styles.decorativeCircle1} />
              <View style={styles.decorativeCircle2} />
              
              <View style={styles.balanceContent}>
                <View>
                  <View style={styles.walletLabelRow}>
                    <Wallet size={16} color="rgba(255,255,255,0.8)" strokeWidth={2.5} />
                    <Text style={styles.walletLabel}>Wallet Balance</Text>
                  </View>
                  <Text style={styles.walletAmount}>R {balance.toLocaleString()}</Text>
                  <View style={styles.balanceTrend}>
                    <ArrowUpRight size={14} color="#4ADE80" strokeWidth={2.5} />
                    <Text style={styles.trendText}>+12.5% this month</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.topUpButton}
                  onPress={() => nav.navigate('Wallet')}
                >
                  <Text style={styles.topUpText}>Top Up</Text>
                  <ChevronRight size={18} color={COLORS.forestGreen} strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.actionSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Quick Actions
          </Text>
          <View style={styles.actionGrid}>
            <View
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              style={{ flex: 1 }}
            >
              <TouchableOpacity 
                style={[styles.actionCard, { backgroundColor: theme.card }]}
                onPress={() => nav.navigate('ShopHome')}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={isDark ? ['#064E3B', '#065F46'] : ['#ECFDF5', '#D1FAE5']}
                  style={styles.actionIconGradient}
                >
                  <ShoppingBag color={COLORS.forestGreen} size={24} strokeWidth={2.5} />
                </LinearGradient>
                <Text style={[styles.actionText, { color: theme.text }]}>
                  Marketplace
                </Text>
                <Text style={[styles.actionSubtext, { color: theme.subtext }]}>
                  Browse products
                </Text>
              </TouchableOpacity>
            </View>

            <View
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              style={{ flex: 1 }}
            >
              <TouchableOpacity 
                style={[styles.actionCard, { backgroundColor: theme.card }]}
                onPress={() => nav.navigate('Orders')}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={isDark ? ['#7C2D12', '#9A3412'] : ['#FFF7ED', '#FFEDD5']}
                  style={styles.actionIconGradient}
                >
                  <Package color={COLORS.orange} size={24} strokeWidth={2.5} />
                </LinearGradient>
                <Text style={[styles.actionText, { color: theme.text }]}>
                  My Orders
                </Text>
                <Text style={[styles.actionSubtext, { color: theme.subtext }]}>
                  Track deliveries
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ACTIVE TRACKING */}
        <View style={styles.trackingSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Active Tracking
              </Text>
              <Text style={[styles.sectionSubtitle, { color: theme.subtext }]}>
                Monitor your shipments
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => nav.navigate('Orders')}
              style={styles.viewAllButton}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={16} color={COLORS.forestGreen} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <View style={styles.ordersList}>
            {orders.length === 0 ? (
              <View
                transition={{ type: 'spring', damping: 15 }}
                style={[styles.emptyState, { backgroundColor: theme.card }]}
              >
                <View style={[styles.emptyIconCircle, { backgroundColor: theme.iconBg }]}>
                  <Package size={40} color={theme.subtext} strokeWidth={2} />
                </View>
                <Text style={[styles.emptyTitle, { color: theme.text }]}>
                  No Active Shipments
                </Text>
                <Text style={[styles.emptySubtitle, { color: theme.subtext }]}>
                  Your orders will appear here once placed
                </Text>
                <TouchableOpacity 
                  style={styles.shopNowButton}
                  onPress={() => nav.navigate('ShopHome')}
                >
                  <Text style={styles.shopNowText}>Start Shopping</Text>
                  <ArrowUpRight size={16} color={COLORS.white} strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            ) : (
              orders.slice(0, 3).map((item, idx) => (
                <View
                  key={item.id || idx}
                  from={{ opacity: 0, translateX: -20 }}
                  animate={{ opacity: 1, translateX: 0 }}
                >
                  <TouchableOpacity 
                    style={[styles.orderCard, { backgroundColor: theme.card }]}
                    onPress={() => nav.navigate('TrackingScreen', { order: item })}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.orderIconContainer, { backgroundColor: theme.iconBg }]}>
                      <LinearGradient
                        colors={[COLORS.lightForest, COLORS.forestGreen]}
                        style={styles.orderIconGradient}
                      >
                        <Store size={22} color={COLORS.white} strokeWidth={2.5} />
                      </LinearGradient>
                    </View>
                    
                    <View style={styles.orderContent}>
                      <View style={styles.orderHeader}>
                        <Text style={[styles.orderTitle, { color: theme.text }]}>
                          Order #{item.id?.toString().slice(-6).toUpperCase()}
                        </Text>
                        <View style={styles.statusBadge}>
                          <Clock size={10} color={COLORS.orange} strokeWidth={2.5} />
                          <Text style={styles.statusText}>In Transit</Text>
                        </View>
                      </View>
                      <Text style={[styles.orderAddress, { color: theme.subtext }]} numberOfLines={1}>
                        {item.deliveryAddress || 'Processing order...'}
                      </Text>
                    </View>

                    <View style={styles.orderArrowContainer}>
                      <ChevronRight size={20} color={COLORS.forestGreen} strokeWidth={2.5} />
                    </View>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  
  // Header Styles
  headerGradient: {
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTopRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  welcomeGreeting: { 
    fontSize: 14, 
    fontWeight: '600',
    marginBottom: 4,
  },
  userName: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  locationRow: { 
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 4,
  },
  locationText: { 
    fontSize: 13, 
    fontWeight: '700',
  },
  notifButton: { 
    width: 48, 
    height: 48, 
    borderRadius: 14, 
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'relative',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notifBadge: { 
    position: 'absolute', 
    top: 8, 
    right: 8, 
    backgroundColor: '#EF4444',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  notifBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '900',
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    gap: 12,
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  
  // Carousel Styles
  carouselWrapper: { 
    height: 220, 
    marginTop: 20,
    marginBottom: 20,
  },
  loaderBox: { 
    height: 200,
    marginHorizontal: 24, 
    borderRadius: 24, 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  bannerContainer: { 
    width: width, 
    height: 200, 
    paddingHorizontal: 24,
  },
  bannerImage: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 24,
  },
  bannerOverlay: { 
    position: 'absolute', 
    bottom: 0, 
    left: 24, 
    right: 24, 
    height: '70%', 
    borderBottomLeftRadius: 24, 
    borderBottomRightRadius: 24,
    padding: 20, 
    justifyContent: 'flex-end' 
  },
  tagContainer: { 
    backgroundColor: COLORS.forestGreen,
    alignSelf: 'flex-start', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 10, 
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagText: { 
    color: COLORS.white, 
    fontSize: 11, 
    fontWeight: '900', 
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bannerTitle: { 
    color: COLORS.white, 
    fontSize: 22, 
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  bannerSubtitle: { 
    color: 'rgba(255,255,255,0.9)', 
    fontSize: 13, 
    fontWeight: '600', 
    marginTop: 6,
    lineHeight: 18,
  },
  pagination: { 
    flexDirection: 'row', 
    position: 'absolute', 
    bottom: 20, 
    alignSelf: 'center',
    gap: 6,
  },
  dot: { 
    height: 8, 
    borderRadius: 4,
  },

  // Wallet Card
  balanceCard: { 
    marginHorizontal: 24,
    borderRadius: 24, 
    padding: 24,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: COLORS.forestGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  balanceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  walletLabel: { 
    color: 'rgba(255,255,255,0.8)', 
    fontSize: 13, 
    fontWeight: '700',
  },
  walletAmount: { 
    color: COLORS.white, 
    fontSize: 32, 
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  balanceTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    color: '#4ADE80',
    fontSize: 12,
    fontWeight: '700',
  },
  topUpButton: { 
    backgroundColor: COLORS.white,
    paddingHorizontal: 20, 
    paddingVertical: 12, 
    borderRadius: 14,
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  topUpText: { 
    color: COLORS.forestGreen, 
    fontWeight: '900',
    fontSize: 15,
  },

  // Quick Actions
  actionSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '900',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  actionGrid: { 
    flexDirection: 'row',
    gap: 14,
  },
  actionCard: { 
    flex: 1,
    padding: 20, 
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIconGradient: { 
    width: 56, 
    height: 56, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 12,
  },
  actionText: { 
    fontSize: 14, 
    fontWeight: '800',
    marginBottom: 4,
  },
  actionSubtext: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Tracking Section
  trackingSection: {
    paddingHorizontal: 24,
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  viewAllText: { 
    color: COLORS.forestGreen, 
    fontWeight: '800', 
    fontSize: 13,
  },

  // Orders List
  ordersList: {
    gap: 12,
  },
  orderCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderIconContainer: { 
    width: 52, 
    height: 52, 
    borderRadius: 14,
    padding: 2,
  },
  orderIconGradient: {
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderContent: {
    flex: 1,
    marginLeft: 14,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  orderTitle: { 
    fontSize: 15, 
    fontWeight: '800',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.orange,
  },
  orderAddress: { 
    fontSize: 12,
    marginTop: 2,
  },
  orderArrowContainer: {
    marginLeft: 8,
  },

  // Empty State
  emptyState: { 
    alignItems: 'center', 
    padding: 40, 
    borderRadius: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  shopNowButton: {
    backgroundColor: COLORS.forestGreen,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shopNowText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '900',
  },
});