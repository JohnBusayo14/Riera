import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  Dimensions,
  Platform
} from 'react-native';
import { ArrowLeft, Trash2, Minus, Plus, ShoppingBag, ChevronRight, Truck } from 'lucide-react-native';
import { COLORS } from '../../constants';
import { useCart } from '../../context/CartContext'; // Adjust path based on your folder structure
import CheckoutTypeModal from '../components/CheckoutTypeModal';

const { height } = Dimensions.get('window');

/**
 * CART SCREEN
 * [2026-01-09] Calculations verified by backend via GPS.
 * [2026-01-19] Logistics handled by individual sellers.
 */
export default function CartScreen({ navigation }) {
  // Use global context instead of route.params to avoid non-serializable warnings
  const { cart, updateQty, removeFromCart } = useCart();
  const [isTypeModalVisible, setIsTypeModalVisible] = useState(false);

  // Instant removal without Alert
  const onRemove = (identifier) => {
    removeFromCart(identifier);
  };

  // Internal UI calculations for immediate feedback
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalWeight = cart.reduce((sum, item) => sum + ((item.weight || 0) * item.quantity), 0);

  const handleTypeSelect = (type) => {
    setIsTypeModalVisible(false);
    
    // Prepare items for the next screen
    const formattedItems = cart.map(item => ({
      productId: item.productId || item.id,
      gaugeId: item.gaugeId,
      quantity: item.quantity,
      name: item.name,
      price: item.price,
      image: item.image,
      gaugeLabel: item.gaugeLabel,
      weight: item.weight
    }));

    navigation.navigate(type === 'local' ? 'MarketplaceLocal' : 'MarketplaceInternational', { 
      cartItems: formattedItems,
      totals: { subtotal, totalWeight }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color={COLORS.slate900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {cart.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
              <ShoppingBag size={50} color={COLORS.slate300} />
            </View>
            <Text style={styles.emptyTitle}>Cart is empty</Text>
            <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.shopBtnText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sectionLabel}>Items ({cart.length})</Text>
            
            {cart.map((item) => {
              const itemKey = item.cartId || item.id;
              
              return (
                <View key={itemKey} style={styles.cartItem}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                  
                  <View style={styles.itemDetails}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                      <TouchableOpacity onPress={() => onRemove(itemKey)}>
                        <Trash2 size={18} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.itemGauge}>{item.gaugeLabel} • {item.weight}kg</Text>
                    
                    <View style={styles.itemFooter}>
                      <Text style={styles.itemPrice}>₦{(item.price * item.quantity).toLocaleString()}</Text>
                      
                      <View style={styles.qtyPicker}>
                        <TouchableOpacity 
                          onPress={() => updateQty(itemKey, Math.max(1, item.quantity - 1))} 
                          style={styles.qtyBtn}
                        >
                          <Minus size={14} color={COLORS.slate900} />
                        </TouchableOpacity>
                        
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                        
                        <TouchableOpacity 
                          onPress={() => updateQty(itemKey, item.quantity + 1)} 
                          style={styles.qtyBtn}
                        >
                          <Plus size={14} color={COLORS.slate900} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}

            {/* BILLING SUMMARY */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Cart Summary</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Item Subtotal</Text>
                <Text style={styles.summaryValue}>₦{subtotal.toLocaleString()}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Weight</Text>
                <Text style={styles.summaryValue}>{totalWeight.toFixed(2)} kg</Text>
              </View>
              
              <View style={styles.infoBox}>
                <Truck size={16} color={COLORS.primary} />
                <Text style={styles.infoText}>
                  Shipping costs are verification-dependent and handled by sellers.
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* FIXED FOOTER */}
      {cart.length > 0 && (
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerLabel}>Subtotal</Text>
            <Text style={styles.footerAmount}>₦{subtotal.toLocaleString()}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.checkoutBtn} 
            onPress={() => setIsTypeModalVisible(true)}
          >
            <Text style={styles.checkoutText}>Choose Delivery</Text>
            <ChevronRight size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}

      <CheckoutTypeModal 
        visible={isTypeModalVisible} 
        onClose={() => setIsTypeModalVisible(false)}
        onSelect={handleTypeSelect}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingBottom: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingTop: Platform.OS === 'ios' ? 60 : 20
  },
  headerTitle: { fontSize: 18, fontWeight: '900', color: COLORS.slate900 },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  scrollContent: { padding: 20, paddingBottom: 120 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: COLORS.slate400, textTransform: 'uppercase', marginBottom: 15, letterSpacing: 1 },
  cartItem: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 20, padding: 12, marginBottom: 15, borderWidth: 1, borderColor: '#F1F5F9' },
  itemImage: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#F8FAFC' },
  itemDetails: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  itemName: { fontSize: 15, fontWeight: '800', color: COLORS.slate900, flex: 1 },
  itemGauge: { fontSize: 12, color: COLORS.slate400, fontWeight: '600' },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemPrice: { fontSize: 16, fontWeight: '900', color: COLORS.primary },
  qtyPicker: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 10, padding: 3 },
  qtyBtn: { width: 28, height: 28, backgroundColor: 'white', borderRadius: 8, justifyContent: 'center', alignItems: 'center', elevation: 1 },
  qtyText: { marginHorizontal: 10, fontWeight: '800', fontSize: 14 },
  summaryCard: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginTop: 10, borderWidth: 1, borderColor: '#F1F5F9' },
  summaryTitle: { fontSize: 16, fontWeight: '800', marginBottom: 15, color: COLORS.slate900 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { color: COLORS.slate500, fontWeight: '600' },
  summaryValue: { fontWeight: '800', color: COLORS.slate900 },
  infoBox: { flexDirection: 'row', backgroundColor: '#F0FDF4', padding: 12, borderRadius: 12, marginTop: 10, alignItems: 'center' },
  infoText: { flex: 1, fontSize: 11, color: COLORS.primary, marginLeft: 8, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', marginTop: height * 0.2 },
  emptyIconBg: { width: 100, height: 100, backgroundColor: 'white', borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 20, elevation: 2 },
  emptyTitle: { fontSize: 20, fontWeight: '900', color: COLORS.slate900 },
  shopBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 25, paddingVertical: 12, borderRadius: 12, marginTop: 20 },
  shopBtnText: { color: 'white', fontWeight: '800' },
  footer: { 
    position: 'absolute', 
    bottom: 0, left: 0, right: 0, 
    backgroundColor: 'white', 
    padding: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderTopWidth: 1, 
    borderTopColor: '#F1F5F9', 
    paddingBottom: Platform.OS === 'ios' ? 40 : 20 
  },
  footerLabel: { fontSize: 11, color: COLORS.slate400, fontWeight: '700', textTransform: 'uppercase' },
  footerAmount: { fontSize: 22, fontWeight: '900', color: COLORS.slate900 },
  checkoutBtn: { backgroundColor: COLORS.slate900, flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 16 },
  checkoutText: { color: 'white', fontWeight: '800', marginRight: 8 }
});