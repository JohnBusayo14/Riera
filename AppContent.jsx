import React, { useState, useRef } from 'react';
import { 
  View, StyleSheet, SafeAreaView, TouchableOpacity, 
  Text, Dimensions, Animated, Alert, Platform 
} from 'react-native';
import { useApp } from './AppProvider';
import { COLORS, Icons } from './constants';
import apiClient from './services/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- SCREEN IMPORTS ---
import SignInScreen from './auth/SignInScreen';
import SignUpScreen from './auth/SignUpScreen';
import ForgotPasswordScreen from './auth/ForgotPasswordScreen';
import OTPScreen from './screens/OTPScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import DashboardScreen from './screens/DashboardScreen';
import ProfileScreen from './screens/ProfileScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import SettingsScreen from './settings/SettingsScreen';
import AccountSettingsScreen from './settings/AccountSettingsScreen';
import NotificationSettingsScreen from './settings/NotificationSettingsScreen';
import ExperienceSettingsScreen from './settings/ExperienceSettingsScreen';
import SupportSettingsScreen from './settings/SupportSettingsScreen';
import LegalSettingsScreen from './settings/LegalSettingsScreen';
import UnifiedRequestScreen from './order/LocalRequestScreen'; 
import InternationalRequestScreen from './order/InternationalRequestScreen';
import TrackingScreen from './order/TrackingScreen';
import OrderDetailsScreen from './order/OrderDetailsScreen';
import OrderSuccessScreen from './order/OrderSuccessScreen';
import WalletScreen from './wallet/WalletScreen';
import AddFundsScreen from './wallet/AddFundsScreen';
import CardPaymentScreen from './wallet/CardPaymentScreen';
import BankTransferScreen from './wallet/BankTransferScreen';
import NotificationScreen from './screens/NotificationScreen'; 
import FAQScreen from './settings/components/FAQScreen';
import FeedbackScreen from './settings/components/FeedbackScreen';

// --- NEW LEGAL & SUPPORT SCREENS ---
import TermsScreen from './settings/components/TermsScreen';
import PrivacyPolicyScreen from './settings/components/PrivacyPolicyScreen';
import AboutCompanyScreen from './settings/components/AboutCompanyScreen';
import DataUsagePolicyScreen from './settings/components/DataUsagePolicyScreen';
import ReportProblemScreen from './settings/components/ReportProblemScreen';

// Shop Screens
import ShopHomeScreen from './agroShop/screens/ShopHomeScreen'; 
import CartScreen from './agroShop/components/CartScreen';
import MarketplaceLocalRequestScreen from './agroShop/screens/MarketplaceLocalRequestScreen';
import MarketplaceInternationalRequestScreen from './agroShop/screens/MarketplaceInternationalRequestScreen';

const { width } = Dimensions.get('window');

export default function AppContent() {
  const { 
    currentUser, setCurrentUser, logout, 
    orders, setOrders, 
    walletBalance, setWalletBalance,
    transactions, setTransactions
  } = useApp();

  const [currentScreen, setCurrentScreen] = useState('sign_in');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(2); 
  const [screenParams, setScreenParams] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerAnim = useRef(new Animated.Value(-width)).current;
  const [loading, setLoading] = useState(false);

  const navigationEmulator = {
    navigate: (screenName, params = {}) => {
      setScreenParams(params);
      const screenMap = {
        'ShopHome': 'shop_home',
        'CartScreen': 'cart',
        'Dashboard': 'dashboard',
        'MarketplaceLocal': 'market_local_req',
        'MarketplaceInternational': 'market_intl_req',
        'Wallet': 'wallet',
        'History': 'history'
      };
      setCurrentScreen(screenMap[screenName] || screenName);
    },
    goBack: () => {
      if (currentScreen === 'cart') setCurrentScreen('shop_home');
      else setCurrentScreen('dashboard');
    }
  };

  const toggleDrawer = (open) => {
    setIsDrawerOpen(open);
    Animated.timing(drawerAnim, { 
        toValue: open ? 0 : -width, 
        duration: 300, 
        useNativeDriver: false 
    }).start();
  };

  const handleAddFunds = (amount, method) => {
    const newTx = {
      id: `TX-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      amount, method, type: 'CREDIT', timestamp: Date.now(),
      status: method === 'BANK_TRANSFER' ? 'PENDING' : 'SUCCESS'
    };
    setWalletBalance(prev => prev + amount);
    setTransactions([newTx, ...transactions]);
    setCurrentScreen('wallet');
  };

  /**
   * 1. DEDICATED MARKETPLACE HANDLER
   * Specifically for Agro Shop orders.
   */
  // const handleAgroOrderSubmit = async (orderPayload) => {
  //   setLoading(true);
  //   try {
  //     const finalCost = Number(orderPayload.totalAmount || 0);

  //     // Dedicated Endpoint for Marketplace (Matching the C# Controller)
  //     const response = await apiClient.post('/orders/agro', orderPayload);

  //     if (response.data) {
  //       setWalletBalance(prev => prev - finalCost);
        
  //       // Shop Cleanup
  //       await AsyncStorage.removeItem('agro_cart');
        
  //       setSelectedOrder(response.data);
  //       setCurrentScreen('order_success');
  //     }
  //   } catch (e) {
  //     console.error("Agro Shop Error:", e.response?.data || e.message);
  //     Alert.alert("Checkout Failed", e.response?.data?.message || "Payment failed.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleAgroOrderSubmit = async (orderPayload) => {
    setLoading(true);
    try {
      // Send the request to the Marketplace endpoint
      const response = await apiClient.post('/orders/agro', orderPayload);

      if (response.data) {
        // IMPORTANT: We don't manually subtract here anymore.
        // We fetch the real balance from the backend.
        await refreshUserData();
        
        // Shop Cleanup
        await AsyncStorage.removeItem('agro_cart');
        
        setSelectedOrder(response.data);
        setCurrentScreen('order_success');
      }
    } catch (e) {
      console.error("Agro Shop Error:", e.response?.data || e.message);
      Alert.alert("Checkout Failed", e.response?.data?.message || "Payment failed.");
    } finally {
      setLoading(false);
    }
  };
  /**
   * 2. DEDICATED LOGISTICS HANDLER
   * Specifically for Shipment booking (Local & Intl).
   */
const handleLogout = async () => {
  try {
    // 1. Mark driver as offline in the Users table before clearing tokens
    // This prevents the DriverAvailabilityService from waiting 10 minutes to expire them
    if (userRole === 'DRIVER') {
      await apiClient.post('/driver/logout-cleanup'); 
    }
  } catch (error) {
    // Log error but proceed so the user isn't "trapped" in the app
    console.error("Failed to update online status during logout:", error);
  } finally {
    // 2. Perform your existing full server + local logout logic
    await logout(); 

    // 3. Reset navigation stack to login screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }], 
    });
  }
};

const refreshUserData = async () => {
    try {
      // This calls your C# AuthController/GetProfile endpoint
      const response = await apiClient.get('/auth/profile');
      if (response.data) {
        // Update the user object (which usually contains the wallet)
        setCurrentUser(response.data);
        
        // If your backend returns the balance inside a wallet object:
        if (response.data.wallet && response.data.wallet.balance !== undefined) {
          setWalletBalance(response.data.wallet.balance);
        } 
        // Or if it returns it directly on the user object:
        else if (response.data.balance !== undefined) {
          setWalletBalance(response.data.balance);
        }
      }
    } catch (e) {
      console.error("Sync Error:", e.message);
    }
  };






const handleLogisticsOrderSubmit = async (orderPayload) => {
    setLoading(true);
    try {
      const isIntl = !!(orderPayload.isInternational || orderPayload.destinationCountry);
      const endpoint = isIntl ? '/orders/international' : '/orders/local';

      // FIX: Ensure the backend gets the value in 'estimatedCost'
      // Many frontend forms use 'totalAmount', but your C# DTO uses 'estimatedCost'
      const sanitizedPayload = {
        ...orderPayload,
        estimatedCost: orderPayload.estimatedCost || orderPayload.totalAmount || 0
      };

      const response = await apiClient.post(endpoint, sanitizedPayload);

      if (response.data) {
        // Refresh the user data from the backend to get the ACTUAL new balance
        await refreshUserData(); 
        
        setSelectedOrder(response.data);
        setCurrentScreen('order_success');
      }
    } catch (e) {
      console.error("Logistics Error:", e.response?.data || e.message);
      Alert.alert("Booking Failed", e.response?.data?.message || "Check your balance.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 3. THE SWITCHER
   * Decides which specialized handler to use based on the payload.
   */
  const handleOrderSubmit = async (payload) => {
    const isMarketplace = payload.items && payload.items.length > 0;
    
    if (isMarketplace) {
      await handleAgroOrderSubmit(payload);
    } else {
      await handleLogisticsOrderSubmit(payload);
    }
  };

  const renderScreen = () => {
    const route = { params: screenParams };
    
    switch (currentScreen) {
      case 'sign_in': return <SignInScreen onLogin={(u) => { setCurrentUser(u); setCurrentScreen('otp'); }} onNavigate={setCurrentScreen} />;
      case 'sign_up': return <SignUpScreen onLogin={(u) => { setCurrentUser(u); setCurrentScreen('otp'); }} onNavigate={setCurrentScreen} />;
      case 'forgot_password': return <ForgotPasswordScreen onBack={() => setCurrentScreen('sign_in')} />;
      case 'otp': return <OTPScreen onVerify={() => setCurrentScreen(currentUser?.onboarded ? 'dashboard' : 'onboarding')} onBack={() => setCurrentScreen('sign_in')} />;
      case 'onboarding': return <OnboardingScreen user={currentUser} onComplete={(u) => { setCurrentUser(u); setCurrentScreen('dashboard'); }} />;
      
      case 'dashboard': return (
        <DashboardScreen 
          navigation={navigationEmulator} user={currentUser} orders={orders} 
          onNewRequest={() => setCurrentScreen('new_request')} 
          onInternationalRequest={() => setCurrentScreen('international_request')} 
          onSelectOrder={(o) => { setSelectedOrder(o); setCurrentScreen('tracking'); }} 
        />
      );
      case 'notifications': return <NotificationScreen onBack={() => { setCurrentScreen('dashboard'); setUnreadNotifications(0); }} />;
      case 'profile': return <ProfileScreen user={currentUser} onBack={() => setCurrentScreen('dashboard')} />;
      
      case 'new_request': return <UnifiedRequestScreen user={currentUser} walletBalance={walletBalance} onBack={() => setCurrentScreen('dashboard')} onSubmit={handleOrderSubmit} />;
      case 'international_request': return <InternationalRequestScreen user={currentUser} walletBalance={walletBalance} onBack={() => setCurrentScreen('dashboard')} onSubmit={handleOrderSubmit} onNavigateToWallet={() => setCurrentScreen('wallet')} />;
      case 'order_success': return <OrderSuccessScreen order={selectedOrder} onTrack={() => setCurrentScreen('tracking')} onHome={() => setCurrentScreen('dashboard')} />;
      case 'tracking': return <TrackingScreen order={selectedOrder} onBack={() => setCurrentScreen('dashboard')} onShowDetails={() => setCurrentScreen('order_details')} />;
      case 'order_details': return <OrderDetailsScreen order={selectedOrder} onBack={() => setCurrentScreen('tracking')} />;
      case 'history': return <OrderHistoryScreen user={currentUser} orders={orders} onSelectOrder={(o) => { setSelectedOrder(o); setCurrentScreen('tracking'); }} onBack={() => setCurrentScreen('dashboard')} />;

      case 'wallet': return <WalletScreen balance={walletBalance} transactions={transactions} onAddFunds={() => setCurrentScreen('add_funds')} onBack={() => setCurrentScreen('dashboard')} />;
      case 'add_funds': return <AddFundsScreen onBack={() => setCurrentScreen('wallet')} onSelectMethod={(m, a) => { setPendingAmount(a || 0); setCurrentScreen(m === 'CARD' ? 'card_payment' : 'bank_transfer'); }} />;
      case 'card_payment': return <CardPaymentScreen amount={pendingAmount} onBack={() => setCurrentScreen('add_funds')} onSuccess={(amt) => handleAddFunds(amt, 'CARD')} />;
      case 'bank_transfer': return <BankTransferScreen amount={pendingAmount} onBack={() => setCurrentScreen('add_funds')} onDone={(amt) => handleAddFunds(amt, 'BANK_TRANSFER')} />;

      case 'settings': return <SettingsScreen user={currentUser} onBack={() => setCurrentScreen('dashboard')} onLogout={logout} onNavigate={setCurrentScreen} />;
      case 'account_settings': return <AccountSettingsScreen user={currentUser} onBack={() => setCurrentScreen('settings')} />;
      
      case 'support_settings': return (
        <SupportSettingsScreen 
          onBack={() => setCurrentScreen('settings')} 
          onNavigateToFAQs={() => setCurrentScreen('faqs')}
          onNavigateToFeedback={() => setCurrentScreen('feedback')}
          onNavigateToReport={() => setCurrentScreen('report_problem')}
        />
      );
      case 'faqs': return <FAQScreen onBack={() => setCurrentScreen('support_settings')} />;
      case 'feedback': return <FeedbackScreen onBack={() => setCurrentScreen('support_settings')} />;
      case 'report_problem': return <ReportProblemScreen onBack={() => setCurrentScreen('support_settings')} />;

      case 'legal_settings': return (
        <LegalSettingsScreen 
          onBack={() => setCurrentScreen('settings')} 
          onNavigateToTerms={() => setCurrentScreen('terms')}
          onNavigateToPrivacy={() => setCurrentScreen('privacy')}
          onNavigateToAbout={() => setCurrentScreen('about')}
          onNavigateToData={() => setCurrentScreen('data_usage')}
        />
      );
      case 'terms': return <TermsScreen onBack={() => setCurrentScreen('legal_settings')} />;
      case 'privacy': return <PrivacyPolicyScreen onBack={() => setCurrentScreen('legal_settings')} />;
      case 'about': return <AboutCompanyScreen onBack={() => setCurrentScreen('legal_settings')} />;
      case 'data_usage': return <DataUsagePolicyScreen onBack={() => setCurrentScreen('legal_settings')} />;

      case 'notification_settings': return <NotificationSettingsScreen onBack={() => setCurrentScreen('settings')} />;
      case 'experience_settings': return <ExperienceSettingsScreen onBack={() => setCurrentScreen('settings')} />;

      case 'shop_home': return <ShopHomeScreen user={currentUser} onBack={() => setCurrentScreen('dashboard')} navigation={navigationEmulator} />;
      case 'cart': return <CartScreen route={route} navigation={navigationEmulator} />;

      case 'market_local_req': 
        return (
          <MarketplaceLocalRequestScreen 
            route={route} 
            user={currentUser} 
            walletBalance={walletBalance} 
            onBack={() => setCurrentScreen('shop_home')} 
            onSubmit={handleOrderSubmit} 
            onNavigateToWallet={() => setCurrentScreen('wallet')} 
          />
        );

      case 'market_intl_req': 
        return (
          <MarketplaceInternationalRequestScreen 
            route={route} 
            user={currentUser} 
            walletBalance={walletBalance} 
            onBack={() => setCurrentScreen('shop_home')} 
            onSubmit={handleOrderSubmit} 
            onNavigateToWallet={() => setCurrentScreen('wallet')} 
          />
        );
      default: return <DashboardScreen user={currentUser} orders={orders} />;
    }
  };

  const authScreens = ['sign_in', 'sign_up', 'forgot_password', 'otp', 'onboarding'];
  const isAuthView = authScreens.includes(currentScreen);

  if (isAuthView) return <View style={styles.container}>{renderScreen()}</View>;

  return (
    <SafeAreaView style={styles.container}>
      {isDrawerOpen && <TouchableOpacity activeOpacity={1} style={styles.drawerOverlay} onPress={() => toggleDrawer(false)} />}
      
      <Animated.View style={[styles.drawer, { left: drawerAnim }]}>
        <View style={styles.drawerHeader}>
          <TouchableOpacity style={styles.drawerAvatar} onPress={() => { setCurrentScreen('profile'); toggleDrawer(false); }}>
            <Text style={styles.drawerAvatarText}>{currentUser?.name?.[0] || 'U'}</Text>
          </TouchableOpacity>
          <Text style={styles.drawerName}>{currentUser?.name || 'User'}</Text>
          <Text style={styles.drawerRole}>{currentUser?.role || 'Guest'}</Text>
        </View>
        <View style={styles.drawerContent}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Icons.Package },
            { id: 'history', label: 'My Shipments', icon: Icons.Map },
            { id: 'wallet', label: 'Wallet', icon: Icons.Wallet },
            { id: 'settings', label: 'Settings', icon: Icons.Settings },
            { id: 'shop_home', label: 'Agro Shop', icon: Icons.ShoppingBag || Icons.Package },
          ].map((item) => (
            <TouchableOpacity key={item.id} style={styles.drawerItem} onPress={() => { setCurrentScreen(item.id); toggleDrawer(false); }}>
              <item.icon color={COLORS.slate700} />
              <Text style={styles.drawerItemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.drawerLogout} onPress={handleLogout}>
            <Text style={styles.drawerLogoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {currentScreen === 'dashboard' && (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => toggleDrawer(true)} style={styles.headerBtn}>
                <Icons.Menu color={COLORS.slate900} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>RieRa</Text>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.notiIconBtn} onPress={() => setCurrentScreen('notifications')}>
                <Icons.Bell color={COLORS.slate900} size={22} />
                {unreadNotifications > 0 && (
                  <View style={styles.badge}><Text style={styles.badgeText}>{unreadNotifications}</Text></View>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.avatar} onPress={() => setCurrentScreen('profile')}>
                <Text style={styles.avatarText}>{currentUser?.name?.[0] || 'U'}</Text>
              </TouchableOpacity>
            </View>
        </View>
      )}

      <View style={styles.content}>{renderScreen()}</View>

      {!isAuthView && ['dashboard', 'history', 'wallet'].includes(currentScreen) && (
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('dashboard')}>
            <Icons.Package color={currentScreen === 'dashboard' ? COLORS.primary : COLORS.slate400} />
            <Text style={[styles.navText, currentScreen === 'dashboard' && styles.navActive]}>HOME</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('history')}>
            <Icons.Map color={currentScreen === 'history' ? COLORS.primary : COLORS.slate400} />
            <Text style={[styles.navText, currentScreen === 'history' && styles.navActive]}>HISTORY</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('wallet')}>
            <Icons.Wallet color={currentScreen === 'wallet' ? COLORS.primary : COLORS.slate400} />
            <Text style={[styles.navText, currentScreen === 'wallet' && styles.navActive]}>WALLET</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 20, paddingVertical: 12, backgroundColor: 'white', 
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9' 
  },
  headerBtn: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: COLORS.primary, letterSpacing: -0.5 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  notiIconBtn: { marginRight: 15, padding: 8, position: 'relative' },
  badge: { 
    position: 'absolute', top: 5, right: 5, backgroundColor: '#ef4444', 
    minWidth: 16, height: 16, borderRadius: 8, alignItems: 'center', 
    justifyContent: 'center', borderWidth: 1.5, borderColor: 'white' 
  },
  badgeText: { color: 'white', fontSize: 8, fontWeight: '900' },
  avatar: { 
    width: 36, height: 36, borderRadius: 12, backgroundColor: COLORS.primary + '15', 
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.primary + '20' 
  },
  avatarText: { fontWeight: '900', color: COLORS.primary, fontSize: 14 },
  content: { flex: 1 },
  navBar: { 
    flexDirection: 'row', height: 80, backgroundColor: 'white', 
    borderTopWidth: 1, borderTopColor: '#f1f5f9', justifyContent: 'space-around', 
    alignItems: 'center', paddingBottom: Platform.OS === 'ios' ? 25 : 10 
  },
  navItem: { alignItems: 'center', flex: 1 },
  navText: { fontSize: 10, fontWeight: '900', color: COLORS.slate400, marginTop: 4 },
  navActive: { color: COLORS.primary },
  drawerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 99 },
  drawer: { position: 'absolute', top: 0, bottom: 0, width: width * 0.82, backgroundColor: 'white', zIndex: 100, paddingVertical: 40 },
  drawerHeader: { padding: 30, backgroundColor: COLORS.background, marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  drawerAvatar: { width: 64, height: 64, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  drawerAvatarText: { color: 'white', fontSize: 26, fontWeight: '900' },
  drawerName: { fontSize: 20, fontWeight: '900', color: COLORS.slate900 },
  drawerRole: { fontSize: 11, fontWeight: '900', color: COLORS.slate400, textTransform: 'uppercase', letterSpacing: 1 },
  drawerContent: { paddingHorizontal: 15, flex: 1 },
  drawerItem: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 12 },
  drawerItemText: { marginLeft: 15, fontSize: 16, fontWeight: '800', color: COLORS.slate700 },
  drawerLogout: { padding: 18, backgroundColor: '#fee2e2', borderRadius: 18, alignItems: 'center', marginTop: 'auto' },
  drawerLogoutText: { color: '#ef4444', fontWeight: '900', fontSize: 15 }
});


