// File: components/CartModal.jsx (New External Cart Component)
import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, 
  SafeAreaView, Platform 
} from 'react-native';
import { X, Trash2, ShoppingBag, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../../constants';
import CheckoutTypeModal from '../components/CheckoutTypeModal';

const CartModal = ({ visible, onClose, cart, removeFromCart, clearCart, onCheckout }) => {
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalWeight = cart.reduce((sum, item) => sum + (item.weight * item.qty), 0);
  const [showCheckoutType, setShowCheckoutType] = React.useState(false);

  const handleCheckout = (type) => {
    setShowCheckoutType(false);
    onCheckout(type, { items: cart, subtotal: totalAmount, totalWeight });
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={COLORS.slate900} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Basket ({cart.length} items)</Text>
          <TouchableOpacity onPress={clearCart}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {cart.length === 0 ? (
            <View style={styles.emptyCart}>
              <ShoppingBag size={80} color={COLORS.slate200} />
              <Text style={styles.emptyText}>Your basket is empty</Text>
            </View>
          ) : (
            cart.map(item => (
              <View key={item.cartId} style={styles.cartRow}>
                <Image source={{ uri: item.image }} style={styles.cartImg} />
                <View style={styles.itemInfo}>
                  <Text style={styles.cartProdName}>{item.name}</Text>
                  <Text style={styles.cartProdInfo}>{item.gaugeLabel} • {item.weight}kg</Text>
                  <Text style={styles.cartProdPrice}>₦{(item.price * item.qty).toLocaleString()}</Text>
                </View>
                <View style={styles.cartQtyControl}>
                  <TouchableOpacity onPress={() => removeFromCart(item.cartId)}>
                    <Trash2 size={18} color="#ef4444" />
                  </TouchableOpacity>
                  <View style={styles.miniQty}>
                    <Text style={styles.miniQtyText}>x{item.qty}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {cart.length > 0 && (
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.sumLabel}>Total Weight</Text>
              <Text style={styles.sumVal}>{totalWeight}kg</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.sumLabel}>Subtotal</Text>
              <Text style={styles.sumPrice}>₦{totalAmount.toLocaleString()}</Text>
            </View>
            <TouchableOpacity style={styles.finalBtn} onPress={() => setShowCheckoutType(true)}>
              <Text style={styles.finalBtnText}>Proceed to Checkout</Text>
              <ChevronRight size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}

        <CheckoutTypeModal
          visible={showCheckoutType}
          onClose={() => setShowCheckoutType(false)}
          onSelect={handleCheckout}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#F1F5F9' },
  headerTitle: { fontSize: 18, fontWeight: '900' },
  clearText: { color: '#ef4444', fontWeight: '600' },
  content: { padding: 20 },
  emptyCart: { marginTop: 100, alignItems: 'center' },
  emptyText: { marginTop: 20, fontSize: 16, color: COLORS.slate300, fontWeight: '800' },
  cartRow: { flexDirection: 'row', marginBottom: 20, alignItems: 'center' },
  cartImg: { width: 70, height: 70, borderRadius: 15 },
  itemInfo: { flex: 1, paddingHorizontal: 12 },
  cartProdName: { fontSize: 16, fontWeight: '800', color: COLORS.slate900 },
  cartProdInfo: { fontSize: 12, color: COLORS.slate400, marginVertical: 2 },
  cartProdPrice: { fontSize: 15, fontWeight: '900', color: COLORS.primary },
  cartQtyControl: { alignItems: 'flex-end', gap: 10 },
  miniQty: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  miniQtyText: { fontWeight: '800', fontSize: 12 },
  summary: { padding: 25, borderTopWidth: 1, borderColor: '#F1F5F9' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  sumLabel: { color: COLORS.slate400, fontWeight: '600' },
  sumVal: { fontWeight: '800', color: COLORS.slate900 },
  sumPrice: { fontSize: 20, fontWeight: '900', color: COLORS.slate900 },
  finalBtn: { backgroundColor: COLORS.primary, height: 65, borderRadius: 22, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15, gap: 10 },
  finalBtnText: { color: 'white', fontSize: 16, fontWeight: '900' }
});

export default CartModal;