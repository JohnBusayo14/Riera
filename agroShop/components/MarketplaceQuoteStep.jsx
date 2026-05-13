import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, ActivityIndicator, TextInput,
  TouchableOpacity, Alert, SafeAreaView, RefreshControl, Dimensions, Platform
} from 'react-native';
import { MotiView, MotiText, AnimatePresence } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ShieldCheck, AlertTriangle, RefreshCw, Package, Wallet, PencilLine, 
  ChevronRight, Truck, Ticket, CheckCircle2, PlusCircle, Leaf, Wheat, 
  Carrot, MapPin, Sparkles, ArrowRight
} from 'lucide-react-native';

import { useTheme } from '../../context/ThemeContext';
import { walletApi } from '../../api/walletApi';
import apiClient from '../../services/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

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
  gold: '#F59E0B',
  error: '#EF4444',
};

export default function MarketplaceQuoteStep({ 
  form, cartData, activeStep, onConfirm, onTopUp, navigation, onEdit 
}) {
  const { isDark: IsDark } = useTheme();

  const UI_THEME = {
    Background: IsDark ? COLORS.black : COLORS.lightGray,
    Surface: IsDark ? COLORS.darkGray : COLORS.white,
    TextPrimary: IsDark ? COLORS.white : COLORS.black,
    TextSecondary: IsDark ? '#94A3B8' : COLORS.mediumGray,
    Border: IsDark ? '#334155' : '#E2E8F0',
    Primary: COLORS.forestGreen,
    PrimarySoft: IsDark ? COLORS.darkForest : '#ECFDF5',
    Warning: COLORS.error,
  };

  const [IsLoading, SetIsLoading] = useState(true);
  const [IsSubmitting, SetIsSubmitting] = useState(false);
  const [ErrorMessage, SetErrorMessage] = useState(null); 
  const [QuoteData, SetQuoteData] = useState(null);
  const [CurrentWalletBalance, SetCurrentWalletBalance] = useState(0);

  const [ShowCouponField, SetShowCouponField] = useState(false);
  const [CouponInput, SetCouponInput] = useState('');
  const [AppliedCoupon, SetAppliedCoupon] = useState(null);
  const [IsApplying, SetIsApplying] = useState(false);

  const CartItems = useMemo(() => {
    const Items = cartData?.items || form?.items || [];
    return Array.isArray(Items) ? Items : [];
  }, [cartData, form?.items]);

  const FetchBackendQuote = useCallback(async () => {
    if (CartItems.length === 0) {
      SetIsLoading(false);
      SetErrorMessage("Your cart is empty.");
      return;
    }
    try {
      SetIsLoading(true);
      const UserRaw = await AsyncStorage.getItem('agro_user');
      const CurrentUser = UserRaw ? JSON.parse(UserRaw) : null;

      const Payload = {
        BuyerId: CurrentUser?.id,
        DeliveryAddress: form.destinationAddress || form.dropoff || form.deliveryAddress || '',
        PostalCode: form.postalCode || '',
        Latitude: parseFloat(form.latitude) || 0,
        Longitude: parseFloat(form.longitude) || 0,
        Items: CartItems.map(Item => ({
          ProductId: Item.productId || Item.id,
          GaugeId: Item.gaugeId || Item.GaugeId, 
          Quantity: Item.qty || Item.quantity || 1
        }))
      };

      const [QuoteRes, BalanceRes] = await Promise.all([
        apiClient.post('/orders/quote', Payload),
        walletApi.getBalance()
      ]);

      SetQuoteData(QuoteRes.data);
      SetCurrentWalletBalance(BalanceRes?.Balance ?? BalanceRes?.balance ?? BalanceRes ?? 0);
    } catch (Err) {
      SetErrorMessage(Err.response?.data?.Message || "Failed to calculate quote.");
    } finally {
      SetIsLoading(false);
    }
  }, [form, CartItems]);

  useEffect(() => {
    if (activeStep === 3) FetchBackendQuote();
  }, [activeStep, FetchBackendQuote]);

  const HandleFinalSubmit = async () => {
    if (IsSubmitting || !QuoteData || IsInsufficient) {
      if (IsInsufficient) Alert.alert("Insufficient Funds", "Please top up your wallet first.");
      return;
    }

    SetIsSubmitting(true);
    
    try {
      const Payload = {
        Items: CartItems.map(Item => ({
          ProductId: Item.productId || Item.id,
          GaugeId: Item.gaugeId || Item.GaugeId,
          Quantity: Item.qty || Item.quantity || 1,
        })),
        DeliveryAddress: form.destinationAddress || form.dropoff || form.deliveryAddress || '',
        PostalCode: form.postalCode || '',
        ReceiverName: form.receiverName || '',
        ReceiverPhone: form.receiverPhone || '',
        CouponCode: AppliedCoupon?.code || null, 
        Latitude: parseFloat(form.latitude) || 0,
        Longitude: parseFloat(form.longitude) || 0
      };

      const Response = await apiClient.post('/orders/agro/checkout', Payload);

      if (Response.data && Response.data.orderId) {
        if (onConfirm) onConfirm(Response.data);

        navigation.navigate('OrderSuccessScreen', { 
          OrderId: Response.data.orderId,
          TotalAmount: Response.data.summary?.total || TotalAmount, 
          Summary: Response.data.summary || {
             total: TotalAmount,
             shipping: LogisticFee,
             discount: DiscountAmount
          }
        });
      } else {
        throw new Error("Server did not return an Order ID.");
      }
    } catch (Err) {
      console.error("Checkout Error:", Err);
      const serverMsg = Err.response?.data?.message || Err.response?.data?.Message;
      Alert.alert("Order Failed", serverMsg || "Transaction failed. Please try again.");
    } finally {
      SetIsSubmitting(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!CouponInput) return;
    try {
      SetIsApplying(true);
      const res = await apiClient.get(`/api/orders/validate-coupon/${CouponInput}`);
      SetAppliedCoupon(res.data);
    } catch (err) {
      Alert.alert("Invalid Code", "This coupon does not exist or has expired.");
      SetAppliedCoupon(null);
    } finally {
      SetIsApplying(false);
    }
  };

  const LogisticFee = QuoteData?.shippingCost || 0;
  const ItemSubtotal = QuoteData?.itemSubtotal || 0;
  const DiscountAmount = useMemo(() => {
    if (!AppliedCoupon) return 0;
    return AppliedCoupon.isPercentage 
      ? (ItemSubtotal * (AppliedCoupon.discountValue / 100)) 
      : AppliedCoupon.discountValue;
  }, [AppliedCoupon, ItemSubtotal]);

  const TotalAmount = Math.max(0, (QuoteData?.totalAmount || 0) - DiscountAmount);
  const IsInsufficient = CurrentWalletBalance < TotalAmount;
  const Shortfall = IsInsufficient ? TotalAmount - CurrentWalletBalance : 0;

  if (IsLoading && !QuoteData) {
    return (
      <View style={[styles.Center, { backgroundColor: UI_THEME.Background }]}>
        <MotiView 
          from={{ rotate: '0deg' }} 
          animate={{ rotate: '360deg' }} 
          transition={{ loop: true, duration: 2000, type: 'timing' }}
        >
          <RefreshCw size={48} color={COLORS.forestGreen} strokeWidth={2.5} />
        </MotiView>
        <Text style={[styles.LoaderText, { color: UI_THEME.TextPrimary }]}>
          Calculating your quote...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.SafeArea, { backgroundColor: UI_THEME.Background }]}>
      
      {/* DECORATIVE BACKGROUND */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <MotiView 
          from={{ translateY: 0, rotate: '0deg' }} 
          animate={{ translateY: -20, rotate: '10deg' }} 
          transition={{ loop: true, type: 'timing', duration: 3000, repeatReverse: true }}
          style={{ position: 'absolute', top: 100, right: 20, opacity: 0.05 }}
        >
          <Wheat size={80} color={COLORS.forestGreen} />
        </MotiView>
        <MotiView 
          from={{ translateY: 0, rotate: '0deg' }} 
          animate={{ translateY: 25, rotate: '-15deg' }} 
          transition={{ loop: true, type: 'timing', duration: 4000, repeatReverse: true }}
          style={{ position: 'absolute', bottom: 200, left: -10, opacity: 0.05 }}
        >
          <Carrot size={100} color={COLORS.forestGreen} />
        </MotiView>
        <MotiView 
          from={{ scale: 1 }} 
          animate={{ scale: 1.2 }} 
          transition={{ loop: true, type: 'timing', duration: 5000, repeatReverse: true }}
          style={{ position: 'absolute', top: height * 0.4, right: -30, opacity: 0.03 }}
        >
          <Leaf size={120} color={COLORS.forestGreen} />
        </MotiView>
      </View>

      <ScrollView 
        contentContainerStyle={styles.ScrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={IsLoading} 
            onRefresh={FetchBackendQuote} 
            tintColor={COLORS.forestGreen}
            colors={[COLORS.forestGreen]}
          />
        }
      >
        {/* HEADER */}
        <MotiView 
          from={{ opacity: 0, translateY: -20 }} 
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
        >
          <View style={styles.HeaderContainer}>
            <View style={styles.HeaderIconCircle}>
              {/* <Sparkles size={24} color={COLORS.forestGreen} strokeWidth={2.5} /> */}
            </View>
            <Text style={[styles.HeaderTitle, { color: UI_THEME.TextPrimary }]}>
              Review & Confirm
            </Text>
            <Text style={[styles.HeaderSubtitle, { color: UI_THEME.TextSecondary }]}>
              Secure checkout for your order
            </Text>
          </View>
        </MotiView>

        {/* MAIN CARD */}
        <MotiView 
          from={{ opacity: 0, scale: 0.98, translateY: 20 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 200 }}
          style={[styles.MainCard, { backgroundColor: UI_THEME.Surface, borderColor: UI_THEME.Border }]}
        >
          {/* ITEMS SECTION */}
          <View style={styles.SectionHeader}>
            <View style={[styles.SectionIconCircle, { backgroundColor: UI_THEME.PrimarySoft }]}>
              <Package size={18} color={COLORS.forestGreen} strokeWidth={2.5} />
            </View>
            <Text style={[styles.SectionTitle, { color: UI_THEME.TextPrimary }]}>
              Order Items
            </Text>
          </View>
          
          {CartItems.map((Item, Index) => (
            <MotiView
              key={Index}
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'timing', duration: 300, delay: 300 + (Index * 50) }}
            >
              <View style={styles.ItemRow}>
                <View style={styles.ItemInfo}>
                  <Text style={[styles.ItemName, { color: UI_THEME.TextPrimary }]}>
                    {Item.name || Item.label}
                  </Text>
                  <Text style={[styles.ItemMeta, { color: UI_THEME.TextSecondary }]}>
                    Quantity: {Item.qty || Item.quantity} × R{Item.price.toLocaleString()}
                  </Text>
                </View>
                <Text style={[styles.ItemPrice, { color: COLORS.forestGreen }]}>
                  R{(Item.price * (Item.qty || Item.quantity)).toLocaleString()}
                </Text>
              </View>
            </MotiView>
          ))}

          <View style={[styles.Divider, { backgroundColor: UI_THEME.Border }]} />

          {/* DELIVERY ADDRESS */}
          <View style={styles.SectionHeader}>
            <View style={[styles.SectionIconCircle, { backgroundColor: UI_THEME.PrimarySoft }]}>
              <MapPin size={18} color={COLORS.forestGreen} strokeWidth={2.5} />
            </View>
            <Text style={[styles.SectionTitle, { color: UI_THEME.TextPrimary }]}>
              Delivery Location
            </Text>
          </View>

          <View style={[styles.AddressCard, { backgroundColor: UI_THEME.Background }]}>
            <Text style={[styles.AddressText, { color: UI_THEME.TextPrimary }]} numberOfLines={2}>
              {form.destinationAddress || form.dropoff || form.deliveryAddress}
            </Text>
            <TouchableOpacity 
              onPress={onEdit} 
              style={[styles.EditButton, { backgroundColor: UI_THEME.PrimarySoft }]}
              activeOpacity={0.7}
            >
              <PencilLine size={16} color={COLORS.forestGreen} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          {/* COUPON SECTION */}
          <View style={styles.CouponSection}>
            <AnimatePresence exitBeforeEnter>
              {!ShowCouponField && !AppliedCoupon ? (
                <MotiView
                  from={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <TouchableOpacity 
                    onPress={() => SetShowCouponField(true)} 
                    style={styles.AddCouponButton}
                    activeOpacity={0.7}
                  >
                    <Ticket size={18} color={COLORS.forestGreen} strokeWidth={2.5} />
                    <Text style={[styles.AddCouponText, { color: COLORS.forestGreen }]}>
                      Add Promo Code
                    </Text>
                    <PlusCircle size={16} color={COLORS.forestGreen} strokeWidth={2.5} />
                  </TouchableOpacity>
                </MotiView>
              ) : (
                <MotiView 
                  from={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: 'timing', duration: 300 }}
                >
                  <View style={[styles.CouponInputContainer, { borderColor: UI_THEME.Border }]}>
                    <TextInput 
                      placeholder="Enter promo code" 
                      placeholderTextColor={UI_THEME.TextSecondary}
                      value={CouponInput} 
                      onChangeText={SetCouponInput}
                      autoCapitalize="characters" 
                      editable={!AppliedCoupon}
                      style={[styles.CouponInput, { color: UI_THEME.TextPrimary }]}
                    />
                    <TouchableOpacity 
                      onPress={AppliedCoupon ? () => {SetAppliedCoupon(null); SetShowCouponField(false)} : handleApplyCoupon}
                      style={[
                        styles.CouponApplyButton,
                        { backgroundColor: AppliedCoupon ? COLORS.error : COLORS.forestGreen }
                      ]}
                      disabled={IsApplying}
                      activeOpacity={0.8}
                    >
                      {IsApplying ? (
                        <ActivityIndicator size="small" color={COLORS.white} />
                      ) : (
                        <Text style={styles.CouponApplyText}>
                          {AppliedCoupon ? 'Remove' : 'Apply'}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                  {AppliedCoupon && (
                    <MotiView
                      from={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'timing', duration: 300 }}
                      style={[styles.CouponAppliedBadge, { backgroundColor: `${COLORS.forestGreen}15` }]}
                    >
                      <CheckCircle2 size={16} color={COLORS.forestGreen} strokeWidth={2.5} />
                      <Text style={[styles.CouponAppliedText, { color: COLORS.forestGreen }]}>
                        Code applied successfully!
                      </Text>
                    </MotiView>
                  )}
                </MotiView>
              )}
            </AnimatePresence>
          </View>

          <View style={[styles.Divider, { backgroundColor: UI_THEME.Border }]} />

          {/* COST BREAKDOWN */}
          <View style={styles.BreakdownSection}>
            <View style={styles.BreakdownRow}>
              <Text style={[styles.BreakdownLabel, { color: UI_THEME.TextSecondary }]}>
                Subtotal
              </Text>
              <Text style={[styles.BreakdownValue, { color: UI_THEME.TextPrimary }]}>
                R{ItemSubtotal.toLocaleString()}
              </Text>
            </View>
            
            <View style={styles.BreakdownRow}>
              <View style={styles.ShippingLabelRow}>
                <Text style={[styles.BreakdownLabel, { color: UI_THEME.TextSecondary }]}>
                  Shipping
                </Text>
                {QuoteData?.distance && (
                  <View style={[styles.DistanceBadge, { backgroundColor: UI_THEME.Background }]}>
                    <Truck size={10} color={COLORS.forestGreen} strokeWidth={2} />
                    <Text style={[styles.DistanceText, { color: COLORS.forestGreen }]}>
                      {QuoteData.distance}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[styles.BreakdownValue, { color: UI_THEME.TextPrimary }]}>
                R{LogisticFee.toLocaleString()}
              </Text>
            </View>
            
            {DiscountAmount > 0 && (
              <MotiView
                from={{ opacity: 0, translateX: -10 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 300 }}
              >
                <View style={styles.BreakdownRow}>
                  <Text style={[styles.BreakdownLabel, { color: COLORS.forestGreen }]}>
                    Discount
                  </Text>
                  <Text style={[styles.BreakdownValue, { color: COLORS.forestGreen }]}>
                    -R{DiscountAmount.toLocaleString()}
                  </Text>
                </View>
              </MotiView>
            )}
          </View>

          {/* TOTAL BANNER */}
          <View style={styles.TotalBannerContainer}>
            <LinearGradient
              colors={IsInsufficient ? [COLORS.error, '#DC2626'] : [COLORS.forestGreen, COLORS.darkForest]}
              style={styles.TotalBanner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View>
                <Text style={styles.TotalLabel}>TOTAL AMOUNT</Text>
                <Text style={styles.TotalAmount}>R{TotalAmount.toLocaleString()}</Text>
              </View>
              <ShieldCheck size={40} color="rgba(255,255,255,0.25)" strokeWidth={2} />
            </LinearGradient>
          </View>

          {/* WALLET INFO */}
          <View style={[styles.WalletCard, { backgroundColor: UI_THEME.Background }]}>
            <View style={styles.WalletIconCircle}>
              <Wallet size={20} color={COLORS.forestGreen} strokeWidth={2.5} />
            </View>
            <View style={styles.WalletInfo}>
              <Text style={[styles.WalletLabel, { color: UI_THEME.TextSecondary }]}>
                Wallet Balance
              </Text>
              <Text style={[styles.WalletBalance, { color: UI_THEME.TextPrimary }]}>
                R{CurrentWalletBalance.toLocaleString()}
              </Text>
            </View>
            {IsInsufficient && (
              <View style={[styles.InsufficientBadge, { backgroundColor: `${COLORS.error}15` }]}>
                <AlertTriangle size={14} color={COLORS.error} strokeWidth={2.5} />
                <Text style={[styles.InsufficientText, { color: COLORS.error }]}>
                  Low Balance
                </Text>
              </View>
            )}
          </View>
        </MotiView>

        {/* ACTION BUTTONS */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 600 }}
          style={styles.ActionSection}
        >
          {IsInsufficient ? (
            <TouchableOpacity 
              style={styles.TopUpButton}
              onPress={() => onTopUp(Shortfall)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[COLORS.error, '#DC2626']}
                style={styles.ActionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Wallet size={22} color={COLORS.white} strokeWidth={2.5} />
                <Text style={styles.ActionButtonText}>
                  Top Up R{Shortfall.toLocaleString()}
                </Text>
                <ArrowRight size={22} color={COLORS.white} strokeWidth={2.5} />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.ConfirmButton}
              onPress={HandleFinalSubmit}
              disabled={IsSubmitting}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[COLORS.forestGreen, COLORS.darkForest]}
                style={styles.ActionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {IsSubmitting ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <>
                    <CheckCircle2 size={22} color={COLORS.white} strokeWidth={2.5} />
                    <Text style={styles.ActionButtonText}>Confirm Payment</Text>
                    <ArrowRight size={22} color={COLORS.white} strokeWidth={2.5} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            onPress={onEdit} 
            style={styles.BackButton}
            activeOpacity={0.7}
          >
            <Text style={[styles.BackButtonText, { color: UI_THEME.TextSecondary }]}>
              Back to Shipping Details
            </Text>
          </TouchableOpacity>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  SafeArea: { 
    flex: 1,
  },
  ScrollContent: { 
    padding: 24, 
    paddingBottom: 80,
  },
  Center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    gap: 20,
  },
  LoaderText: { 
    fontSize: 16, 
    fontWeight: '700',
  },
  
  // Header
  HeaderContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  HeaderIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: `${COLORS.forestGreen}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  HeaderTitle: { 
    fontSize: 32, 
    fontWeight: '900', 
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 8,
  },
  HeaderSubtitle: { 
    fontSize: 15, 
    fontWeight: '600',
    textAlign: 'center',
  },

  // Main Card
  MainCard: { 
    borderRadius: 24, 
    borderWidth: 1,
    padding: 24,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  
  // Section Headers
  SectionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    marginBottom: 16,
  },
  SectionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  SectionTitle: { 
    fontSize: 17, 
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  
  // Items
  ItemRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  ItemInfo: {
    flex: 1,
  },
  ItemName: { 
    fontSize: 16, 
    fontWeight: '800',
    marginBottom: 4,
  },
  ItemMeta: { 
    fontSize: 13, 
    fontWeight: '600',
  },
  ItemPrice: { 
    fontSize: 17, 
    fontWeight: '900',
  },
  
  // Divider
  Divider: { 
    height: 1,
    marginVertical: 24,
  },
  
  // Address
  AddressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    gap: 12,
  },
  AddressText: { 
    fontSize: 14, 
    fontWeight: '700',
    flex: 1,
    lineHeight: 20,
  },
  EditButton: { 
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Coupon
  CouponSection: {
    marginBottom: 24,
  },
  AddCouponButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8,
    paddingVertical: 8,
  },
  AddCouponText: { 
    fontSize: 15, 
    fontWeight: '800',
    flex: 1,
  },
  CouponInputContainer: { 
    flexDirection: 'row', 
    borderRadius: 14, 
    borderWidth: 2,
    overflow: 'hidden',
  },
  CouponInput: { 
    flex: 1, 
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontWeight: '700',
    fontSize: 15,
  },
  CouponApplyButton: { 
    paddingHorizontal: 24,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 90,
  },
  CouponApplyText: { 
    color: COLORS.white, 
    fontWeight: '900', 
    fontSize: 14,
  },
  CouponAppliedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  CouponAppliedText: {
    fontSize: 13,
    fontWeight: '700',
  },

  // Breakdown
  BreakdownSection: { 
    gap: 12,
    marginBottom: 24,
  },
  BreakdownRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  BreakdownLabel: { 
    fontSize: 14, 
    fontWeight: '600',
  },
  BreakdownValue: { 
    fontSize: 16, 
    fontWeight: '800',
  },
  ShippingLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  DistanceBadge: { 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 8,
  },
  DistanceText: { 
    fontSize: 10, 
    fontWeight: '800',
  },

  // Total Banner
  TotalBannerContainer: {
    marginBottom: 16,
  },
  TotalBanner: { 
    borderRadius: 20, 
    padding: 24, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  TotalLabel: { 
    color: 'rgba(255,255,255,0.8)', 
    fontSize: 12, 
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  TotalAmount: { 
    color: COLORS.white, 
    fontSize: 32, 
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  
  // Wallet
  WalletCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 16,
    gap: 12,
  },
  WalletIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: `${COLORS.forestGreen}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  WalletInfo: {
    flex: 1,
  },
  WalletLabel: { 
    fontSize: 12, 
    fontWeight: '600',
    marginBottom: 2,
  },
  WalletBalance: { 
    fontSize: 18, 
    fontWeight: '900',
  },
  InsufficientBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  InsufficientText: {
    fontSize: 11,
    fontWeight: '800',
  },

  // Actions
  ActionSection: { 
    marginTop: 24,
  },
  TopUpButton: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  ConfirmButton: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: COLORS.forestGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  ActionButtonGradient: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  ActionButtonText: { 
    color: COLORS.white, 
    fontSize: 18, 
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  BackButton: { 
    marginTop: 20, 
    alignItems: 'center',
    paddingVertical: 12,
  },
  BackButtonText: { 
    fontSize: 15, 
    fontWeight: '700',
  },
});