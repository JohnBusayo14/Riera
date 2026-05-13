import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { useNavigation } from '@react-navigation/native';

// Context & Services
import { useAuth } from '../auth/AuthContext'; 
import { useTheme } from '../context/ThemeContext';
import apiClient from '../services/apiClient';

// --- SCREEN IMPORTS ---
import DashboardScreen from '../screens/DashboardScreen';
import WalletScreen from '../wallet/WalletScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SettingsScreen from '../settings/SettingsScreen';
import AccountSettingsScreen from '../settings/AccountSettingsScreen';
import SupportSettingsScreen from '../settings/SupportSettingsScreen';
import LegalSettingsScreen from '../settings/LegalSettingsScreen';
import ShopHomeScreen from '../agroShop/screens/ShopHomeScreen';
import MarketplaceLocalRequestScreen from '../agroShop/screens/MarketplaceLocalRequestScreen';
import MarketplaceInternationalRequestScreen from '../agroShop/screens/MarketplaceInternationalRequestScreen';
import LocalRequestScreen from '../order/LocalRequestScreen';
import InternationalRequestScreen from '../order/InternationalRequestScreen';
import AddFundsScreen from '../wallet/AddFundsScreen';
import CardPaymentScreen from '../wallet/CardPaymentScreen';
import BankTransferScreen from '../wallet/BankTransferScreen';
import OrderSuccessScreen from '../order/OrderSuccessScreen';
import TrackingScreen from '../order/TrackingScreen';
import ExperienceSettingsScreen from '../settings/ExperienceSettingsScreen';
import NotificationSettingsScreen from '../settings/NotificationSettingsScreen';
import TermsScreen from '../settings/components/TermsScreen';
import PrivacyPolicyScreen from '../settings/components/PrivacyPolicyScreen';
import DataUsagePolicyScreen from '../settings/components/DataUsagePolicyScreen';
import AboutCompanyScreen from '../settings/components/AboutCompanyScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import FAQScreen from '../settings/components/FAQScreen';
import PaymentWebView from '../wallet/PaymentWebView';
import SellerDashboard from '../seller/SellerDashboard';
import SellerVerificationScreen from '../seller/SellerVerificationScreen';
import AddProduct from '../seller/AddProduct';
import Inventory from '../seller/Inventory';
import ActiveOrders from '../seller/ActiveOrders';
import DisputeScreen from '../screens/DisputeScreen';
import CartScreen from '../agroShop/components/CartScreen';
import MarketplaceDestinationStep from '../agroShop/components/MarketplaceDestinationStep';
import OzowPaymentScreen from '../wallet/OzowPaymentScreen';
import WithdrawFundsScreen from '../wallet/WithdrawFundsScreen';
import ProfileScreen from '../settings/AccountSettingsScreen';
import EditProductModal from '../seller/EditProductModal';
import SetPinScreen from '../wallet/SetPinScreen';
import LinkBankAccountScreen from '../wallet/LinkBankAccountScreen';
import BobGoSearchScreen from '../seller/BobGoSearchScreen';
import DriverDashboard from '../driver/DriverDashboard';
import MarketplaceQuoteStep from '../agroShop/components/MarketplaceQuoteStep';
import AvailableDeliveriesScreen from '../driver/AvailableDeliveriesScreen';
import DriverSearchScreen from '../seller/DriverSearchScreen';
import DriverOrderDetails from '../driver/DriverOrderDetails';
import OrderDetailsScreen from '../order/OrderDetailsScreen';
import SellerOrderDetails from '../seller/SellerOrderDetails';
import DriverVerificationScreen from '../driver/DriverVerificationScreen';
import BankSelectorScreen from '../wallet/BankSelectorScreen';
import TripHistoryScreen from '../driver/TripHistoryScreen';
import ForgotPasswordScreen from '../auth/ForgotPasswordScreen';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

/**
 * 1. BOTTOM TABS (For Buyers/Sellers)
 */
const BottomTabs = () => {
  const { colors: Colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.TabBar, { backgroundColor: Colors.Surface, borderTopColor: Colors.Border }],
        tabBarActiveTintColor: Colors.Primary,
        tabBarInactiveTintColor: Colors.TextSecondary,
        tabBarLabelStyle: { fontWeight: '900', fontSize: 10, marginBottom: 5 }
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: 'HOME', tabBarIcon: ({ color }) => <Icon name="grid-outline" size={22} color={color} /> }} />
      <Tab.Screen name="ShopHome" component={ShopHomeScreen} options={{ tabBarLabel: 'MARKET', tabBarIcon: ({ color }) => <Icon name="cart-outline" size={22} color={color} /> }} />
      <Tab.Screen name="Orders" component={OrderHistoryScreen} options={{ tabBarLabel: 'HISTORY', tabBarIcon: ({ color }) => <Icon name="receipt-outline" size={22} color={color} /> }} />
      <Tab.Screen name="Wallet" component={WalletScreen} options={{ tabBarLabel: 'WALLET', tabBarIcon: ({ color }) => <Icon name="wallet-outline" size={22} color={color} /> }} />
      <Tab.Screen name="SettingsTab" component={SettingsScreen} options={{ tabBarLabel: 'SETTINGS', tabBarIcon: ({ color }) => <Icon name="settings-outline" size={22} color={color} /> }} />
    </Tab.Navigator>
  );
};

/**
 * 2. CUSTOM DRAWER CONTENT (Role-Aware)
 */
const CustomDrawerContent = (props) => {
  const { currentUser: User, logout: Logout } = useAuth(); 
  const { colors: Colors, isDark: IsDark } = useTheme();
  const LOGOUT_BG = IsDark ? '#450a0a' : '#fee2e2';

  return (
    <View style={{ flex: 1, backgroundColor: Colors.Background }}>
      <View style={[styles.DrawerHeader, { backgroundColor: IsDark ? '#1e293b' : '#F8FAFC', borderBottomColor: Colors.Border }]}>
        <View style={[styles.DrawerAvatar, { backgroundColor: Colors.Primary }]}>
          <Text style={styles.DrawerAvatarText}>{User?.name?.charAt(0).toUpperCase() || 'A'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.DrawerName, { color: Colors.TextPrimary }]} numberOfLines={1}>{User?.name || 'RieRa User'}</Text>
          <View style={[styles.RoleBadge, { backgroundColor: Colors.Primary + '20' }]}>
            <Text style={[styles.DrawerRole, { color: Colors.Primary }]}>{User?.Role || User?.role || 'SENDER'}</Text>
          </View>
        </View>
      </View>

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} activeTintColor={Colors.Primary} activeBackgroundColor={Colors.Primary + '15'} labelStyle={{ fontWeight: '800' }} />
      </DrawerContentScrollView>
      
      <TouchableOpacity style={[styles.DrawerLogout, { backgroundColor: LOGOUT_BG }]} onPress={Logout}>
        <Icon name="log-out" size={20} color="#ef4444" style={{ marginRight: 10 }} />
        <Text style={styles.DrawerLogoutText}>Secure Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * 3. DRAWER NAVIGATOR (Handles Initial Route per Role)
 */
const AppDrawer = () => {
  const { currentUser: User } = useAuth();
  const { colors: Colors } = useTheme();
  
  // Normalized Role Check
  const userRole = (User?.Role || User?.role || '').toUpperCase();
  const IsSeller = userRole === 'SELLER';
  const IsDriver = userRole === 'DRIVER';

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      // This ensures if a driver is in MainStack, they still see their dashboard first
      initialRouteName={IsDriver ? "DriverConsole" : IsSeller ? "SellerHome" : "MainTabs"}
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: Dimensions.get('window').width * 0.8, backgroundColor: Colors.Background },
        drawerActiveTintColor: Colors.Primary,
        drawerLabelStyle: { fontWeight: '800', marginLeft: -10 }
      }}
    >
      {/* Driver View (Hidden from Buyers/Sellers) */}
      {IsDriver && (
        <Drawer.Screen 
          name="DriverConsole" 
          component={DriverDashboard} 
          options={{ title: 'Driver Dashboard', drawerIcon: ({ color }) => <Icon name="speedometer-outline" size={20} color={color} /> }} 
        />
      )}

      {/* Seller View */}
      {IsSeller && (
        <Drawer.Screen 
          name="SellerHome" 
          component={SellerDashboard} 
          options={{ title: 'Seller Console', drawerIcon: ({ color }) => <Icon name="storefront-outline" size={20} color={color} /> }} 
        />
      )}

      {/* Shared Tabs (Buyer Experience) */}
      <Drawer.Screen 
        name="MainTabs" 
        component={BottomTabs} 
        options={{ title: IsSeller || IsDriver ? 'Switch to Buying' : 'Dashboard', drawerIcon: ({ color }) => <Icon name="grid-outline" size={20} color={color} /> }} 
      />
      
      <Drawer.Screen name="Notifications" component={NotificationScreen} options={{ drawerIcon: ({ color }) => <Icon name="notifications-outline" size={20} color={color} /> }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ drawerIcon: ({ color }) => <Icon name="settings-outline" size={20} color={color} /> }} />
    </Drawer.Navigator>
  );
};

/**
 * 4. MAIN STACK (The Root of Logged-In Navigation)
 */
export default function MainStack() {
  const Navigation = useNavigation();
  const { currentUser: User } = useAuth();
  const [WalletBalance, setWalletBalance] = useState(0);

  const FetchWalletBalance = async () => {
    try {
      const Response = await apiClient.get('/wallet/balance');
      setWalletBalance(Response.data.balance || 0);
    } catch (Err) { console.error("Balance Sync Error:", Err); }
  };

  useEffect(() => { FetchWalletBalance(); }, []);

  const HandleAgroCheckout = async (Payload) => {
    try {
      const FinalRequest = {
        request: {
          items: Payload.items.map(Item => ({
            productId: Item.productId,
            qty: Math.floor(Number(Item.qty || Item.quantity || 1)),
            price: parseFloat(Item.price || 0),
            weight: String(Item.weight).includes('kg') ? Item.weight : `${Item.weight}kg`
          })),
          totalAmount: parseFloat(Payload.totalAmount || 0),
          logisticsCost: parseFloat(Payload.logisticsCost || 0),
          paymentMethod: "Wallet",
          isInternational: Boolean(Payload.isInternational),
          deliveryAddress: Payload.deliveryAddress,
          receiverName: Payload.receiverName,
          receiverPhone: Payload.receiverPhone
        }
      };
      const Response = await apiClient.post('/orders/agro/checkout', FinalRequest);
      if (Response.status === 200 || Response.status === 201) {
        await FetchWalletBalance(); 
        Navigation.navigate('OrderSuccessScreen', { OrderId: Response.data?.orderId || 'Success', TotalAmount: Payload.totalAmount });
      }
    } catch (Err) {
      Alert.alert("Payment Error", Err.response?.data?.message || "Insufficient wallet funds.");
    }
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="DrawerRoot" component={AppDrawer} />
      
      {/* Order & Wallet Flow */}
      <Stack.Screen name="NewRequest" component={LocalRequestScreen} />
      <Stack.Screen name="InternationalRequest" component={InternationalRequestScreen} />
      <Stack.Screen name="BuyerOrderDetails" component={OrderDetailsScreen} />
      <Stack.Screen name="TrackingScreen" component={TrackingScreen} />
      <Stack.Screen name="OrderSuccessScreen" component={OrderSuccessScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="MarketQuote" component={MarketplaceQuoteStep} />
      <Stack.Screen name="AddFunds" component={AddFundsScreen} />
      <Stack.Screen name="CardPayment" component={CardPaymentScreen} />
      <Stack.Screen name="BankPayment" component={BankTransferScreen} />
      <Stack.Screen name="OzowPayment" component={OzowPaymentScreen} />
      <Stack.Screen name="WithdrawFunds" component={WithdrawFundsScreen} />
      <Stack.Screen name="PaymentWebView" component={PaymentWebView} options={{ presentation: 'modal' }} />
      
      {/* Seller Flow */}
      <Stack.Screen name="SellerVerification" component={SellerVerificationScreen} />
      <Stack.Screen name="AddProduct" component={AddProduct} />
      <Stack.Screen name="Inventory" component={Inventory} />
      <Stack.Screen name="ActiveOrders" component={ActiveOrders} />
      <Stack.Screen name="EditProduct" component={EditProductModal} />
      
      {/* Settings Flow */}
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
      <Stack.Screen name="ExperienceSettings" component={ExperienceSettingsScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="SupportSettings" component={SupportSettingsScreen} />
      <Stack.Screen name="LegalSettings" component={LegalSettingsScreen} />
      <Stack.Screen name="FAQs" component={FAQScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="Privacy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="DataUsage" component={DataUsagePolicyScreen} />
      <Stack.Screen name="About" component={AboutCompanyScreen} />
      <Stack.Screen name="AvailableDeliveries" component={AvailableDeliveriesScreen} />
      <Stack.Screen name="DriverSearch" component={DriverSearchScreen} />
      <Stack.Screen name="DriverOrderDetails" component={DriverOrderDetails} />
      <Stack.Screen name="SellerOrderDetails" component={SellerOrderDetails} />
      {/* Security & Misc */}
      <Stack.Screen name="SetPin" component={SetPinScreen} />
      <Stack.Screen name="LinkBankAccount" component={LinkBankAccountScreen} />
      <Stack.Screen name="DisputeScreen" component={DisputeScreen} />
      <Stack.Screen name="Driververification" component={DriverVerificationScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="BankSelector" component={BankSelectorScreen} />
      <Stack.Screen name="TripHistory" component={TripHistoryScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      
      {/* Marketplace Conditional Rendering */}
      <Stack.Screen name="MarketplaceLocal">
        {(props) => <MarketplaceLocalRequestScreen {...props} onSubmit={HandleAgroCheckout} walletBalance={WalletBalance} />}
      </Stack.Screen>
      <Stack.Screen name="MarketplaceInternational">
        {(props) => <MarketplaceInternationalRequestScreen {...props} onSubmit={HandleAgroCheckout} walletBalance={WalletBalance} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  TabBar: { 
    height: Platform.OS === 'ios' ? 92 : 75, 
    paddingBottom: Platform.OS === 'ios' ? 32 : 12, 
    borderTopWidth: 1.5,
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 12 }
    })
  },
  DrawerHeader: { padding: 24, paddingTop: Platform.OS === 'ios' ? 60 : 50, borderBottomWidth: 1.5, flexDirection: 'row', alignItems: 'center', gap: 15 },
  DrawerAvatar: { width: 60, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  DrawerAvatarText: { color: 'white', fontSize: 24, fontWeight: '900' },
  DrawerName: { fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
  RoleBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
  DrawerRole: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  DrawerLogout: { padding: 16, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 20, marginBottom: Platform.OS === 'ios' ? 40 : 25 },
  DrawerLogoutText: { color: '#ef4444', fontWeight: '900', fontSize: 15 },
});