import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  ScrollView, 
  AppState, 
  RefreshControl, 
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Platform
} from 'react-native';
import { ArrowLeft, ShieldCheck, Wallet, RefreshCw } from 'lucide-react-native';
import { COLORS } from '../../constants';
import Button from '../../components/Button';
import Card from '../../components/Card';
import apiClient from '../../services/apiClient'; 

const { width } = Dimensions.get('window');

/**
 * QuoteStep Component
 * Final stage of the booking flow. 
 * [cite: 2026-01-09] All calculations are done in the backend.
 */
export default function QuoteStep({ 
  form, 
  onConfirm, 
  onEdit, 
  isInternational, 
  walletBalance: initialBalance = 0, 
  onTopUp,
  cartData = null 
}) {
  const [currentBalance, setCurrentBalance] = useState(Number(initialBalance));
  const [refreshing, setRefreshing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // BACKEND QUOTE STATES
  const [serverQuote, setServerQuote] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(true);

  const primaryColor = isInternational ? COLORS.international : COLORS.primary;

  /**
   * 1. FETCH UNIFIED QUOTE FROM BACKEND
   */
  const fetchQuote = useCallback(async () => {
    try {
      setLoadingQuote(true);
      
      const payload = {
        items: cartData?.items?.map(item => ({
          productId: item.productId,
          price: item.price,
          qty: item.quantity || 1,
          weight: item.weight || "0"
        })) || [],
        
        isInternational: isInternational, 
        origin: form.hub || form.pickup,
        deliveryAddress: form.receiverAddress || form.destination,
        weight: String(form.weight || "0"),
        produceType: form.produce === 'Others' ? form.otherSpecify : (form.produce || ""),
        incoterms: form.incoterm || 'DDP'
      };

      const response = await apiClient.post('/orders/quote', payload);
      setServerQuote(response.data);
    } catch (err) {
      console.error("Quote Error:", err);
      Alert.alert("Connection Error", "Could not reach the pricing engine.");
    } finally {
      setLoadingQuote(false);
    }
  }, [form, cartData, isInternational]);

  /**
   * 2. REAL-TIME WALLET SYNC
   */
  const syncBalance = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await apiClient.get('/wallet/balance');
      const newBalance = res.data?.balance ?? res.data;
      if (newBalance !== undefined) {
        setCurrentBalance(Number(newBalance));
      }
    } catch (err) {
      console.log("Wallet sync failed:", err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchQuote();
    syncBalance();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        syncBalance();
        fetchQuote();
      }
    });
    return () => subscription.remove();
  }, [syncBalance, fetchQuote]);

  const grandTotal = serverQuote?.totalAmount || 0;
  const hasEnoughFunds = currentBalance >= grandTotal;
  const deficit = grandTotal - currentBalance;

  /**
   * 3. FINAL PAYMENT HANDLER
   */
  const handlePayment = async () => {
    if (!serverQuote) {
      Alert.alert("Pending", "Please wait for the quote to refresh.");
      return;
    }

    if (!hasEnoughFunds) {
      Alert.alert(
        "Insufficient Balance",
        `You need an additional ₦${deficit.toLocaleString()} to complete this order.`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Top Up Wallet", onPress: () => onTopUp(grandTotal) }
        ]
      );
      return;
    }

    setIsProcessing(true);
    try {
      await onConfirm({
        ...serverQuote,
        isInternational: isInternational 
      }); 
    } catch (error) {
      console.error("Payment Error:", error);
      Alert.alert("Error", "Order processing failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loadingQuote) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={primaryColor} />
        <Text style={styles.loaderText}>Backend is calculating total payable...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color={COLORS.slate900} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
           <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '100%', backgroundColor: primaryColor }]} />
           </View>
           <Text style={styles.stepCount}>Review & Pay</Text>
        </View>
        <TouchableOpacity onPress={() => { syncBalance(); fetchQuote(); }} style={styles.refreshBtn}>
          <RefreshCw size={20} color={COLORS.slate400} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={() => { syncBalance(); fetchQuote(); }} 
            tintColor={primaryColor} 
          />
        }
      >
        <Text style={styles.title}>
          {cartData ? "Final Checkout" : "Confirm Quote"}
        </Text>
        
        <Card style={[styles.quoteCard, cartData && styles.shopCard]}>
          <View style={styles.breakdownContainer}>
            <View style={styles.breakdownHeader}>
               <Text style={styles.sectionLabel}>BILLING BREAKDOWN</Text>
               <ShieldCheck size={16} color={COLORS.primary} />
            </View>
             
            {/* Marketplace Items */}
            {serverQuote?.itemSubtotal > 0 && (
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Marketplace Items</Text>
                <Text style={styles.breakdownValue}>₦{serverQuote?.itemSubtotal?.toLocaleString()}</Text>
              </View>
            )}

            {/* Logistics Service */}
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>
                {isInternational ? 'Global Freight Service' : 'Local Delivery Fee'}
              </Text>
              <Text style={styles.breakdownValue}>₦{serverQuote?.shippingCost?.toLocaleString()}</Text>
            </View>

            {/* International Extras */}
            {isInternational && (
              <>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Customs & Clearing</Text>
                  <Text style={styles.breakdownValue}>₦{serverQuote?.customsCost?.toLocaleString() || '0'}</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Incoterms applied</Text>
                  <Text style={styles.breakdownValue}>{form.incoterm || 'DDP'}</Text>
                </View>
              </>
            )}

            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Verified Weight</Text>
              <Text style={styles.breakdownValue}>{serverQuote?.totalWeight || form.weight || 0} kg</Text>
            </View>

            <View style={styles.divider} />
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>TOTAL AMOUNT DUE</Text>
            <Text style={[styles.price, { color: primaryColor }]}>
              ₦{grandTotal.toLocaleString()}
            </Text>
          </View>
          
          <Text style={styles.advice}>
            Escrow protection is active. Funds are held securely until delivery is confirmed.
          </Text>

          {/* WALLET STATUS */}
          <View style={styles.balanceInfo}>
            <View style={styles.balanceHeader}>
              <View style={styles.walletRow}>
                <Wallet size={14} color={COLORS.slate400} style={{marginRight: 6}} />
                <Text style={styles.balanceLabel}>YOUR WALLET BALANCE</Text>
              </View>
              {refreshing && <ActivityIndicator size="small" color={primaryColor} />}
            </View>
            <Text style={[styles.balanceValue, !hasEnoughFunds && styles.insufficientText]}>
              ₦{currentBalance.toLocaleString()}
            </Text>
            
            {!hasEnoughFunds && (
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                  ⚠️ Top up ₦{deficit.toLocaleString()} to proceed.
                </Text>
              </View>
            )}
          </View>

          {/* ACTIONS */}
          <View style={styles.buttonGroup}>
            <Button 
              title={hasEnoughFunds ? "Confirm & Pay" : "Top Up Wallet"} 
              onPress={handlePayment} 
              loading={isProcessing}
              style={[styles.confirmBtn, { backgroundColor: hasEnoughFunds ? primaryColor : '#64748b' }]} 
            />
            
            <Button 
              title="Change Order Details" 
              variant="outline" 
              onPress={onEdit} 
              disabled={isProcessing}
              style={styles.editBtn} 
            />
          </View>
        </Card>

        <Text style={styles.secureNote}>
          🔒 Calculations verified by RieRa Secure Engine
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    paddingBottom: 10
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  refreshBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  progressContainer: { flex: 1, alignItems: 'center', paddingHorizontal: 20 },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 2,
    marginBottom: 4
  },
  progressFill: { height: '100%', borderRadius: 2 },
  stepCount: { fontSize: 10, fontWeight: '800', color: '#94a3b8', letterSpacing: 0.5 },
  
  container: { width: width, flex: 1, backgroundColor: '#f8fafc' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 15, color: '#64748b', fontWeight: '600' },
  title: { fontSize: 26, fontWeight: '900', color: '#0f172a', marginBottom: 20, paddingHorizontal: 5 },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 60 },
  
  quoteCard: { 
    padding: 25, 
    borderWidth: 1, 
    backgroundColor: '#ffffff', 
    borderColor: '#e2e8f0', 
    borderRadius: 24, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3 
  },
  shopCard: { borderColor: COLORS.primary + '30' },
  breakdownHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionLabel: { fontSize: 10, fontWeight: '900', color: '#94a3b8', letterSpacing: 1 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  breakdownLabel: { fontSize: 14, color: '#64748b', fontWeight: '600' },
  breakdownValue: { fontSize: 14, color: '#1e293b', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 15 },
  priceRow: { marginBottom: 15 },
  totalLabel: { fontSize: 11, fontWeight: '900', color: '#475569', letterSpacing: 1, marginBottom: 4 },
  price: { fontSize: 36, fontWeight: '900' },
  advice: { fontSize: 13, color: '#64748b', marginBottom: 25, fontStyle: 'italic', lineHeight: 18 },
  
  balanceInfo: { padding: 18, borderRadius: 20, marginBottom: 25, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' },
  walletRow: { flexDirection: 'row', alignItems: 'center' },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  balanceLabel: { fontSize: 10, fontWeight: '900', color: '#64748b' },
  balanceValue: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
  insufficientText: { color: '#ef4444' },
  warningBox: { marginTop: 10, padding: 10, backgroundColor: '#fef2f2', borderRadius: 10 },
  warningText: { fontSize: 12, color: '#b91c1c', fontWeight: '700' },
  
  buttonGroup: { gap: 12 },
  confirmBtn: { paddingVertical: 18, borderRadius: 18 },
  editBtn: { borderWidth: 0, marginTop: 5 },
  secureNote: { textAlign: 'center', color: '#94a3b8', fontSize: 11, fontWeight: '600', marginTop: 25 }
});