
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, Platform } from 'react-native';
import { ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react-native';

// Added onViewCart to the props
export default function CartOverlay({ cartItems, onCheckout, onViewCart }) {
  if (!cartItems || cartItems.length === 0) return null;

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalWeight = cartItems.reduce((sum, item) => sum + (item.weight * item.quantity), 0);

  const messageSeller = () => {
    const lastItem = cartItems[cartItems.length - 1];
    const phoneNumber = lastItem.sellerPhone || "2348000000000"; 
    const message = `Hello, I'm interested in the ${lastItem.name}. I have ${totalItems} items in my cart.`;
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    Linking.canOpenURL(url).then(supported => {
      if (supported) { Linking.openURL(url); } 
      else { Alert.alert("Error", "WhatsApp is not installed."); }
    });
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.chatBubble} onPress={messageSeller}>
        <MessageCircle color="#fff" size={18} />
        <Text style={styles.chatBubbleText}>Message Seller</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        {/* Wrap the left side in a TouchableOpacity to view the cart */}
        <TouchableOpacity 
          style={styles.left} 
          onPress={onViewCart} 
          activeOpacity={0.7}
        >
          <View style={styles.badge}>
            <ShoppingBag color="#fff" size={18} />
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{totalItems}</Text>
            </View>
          </View>
          <View style={styles.priceInfo}>
            <Text style={styles.totalPrice}>₦{totalPrice.toLocaleString()}</Text>
            <Text style={styles.totalWeight}>{totalWeight.toFixed(1)}kg Total • View Cart</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.checkoutBtn} onPress={onCheckout}>
          <Text style={styles.checkoutText}>Checkout</Text>
          <ArrowRight color="#fff" size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ... styles remain the same as your provided code
const styles = StyleSheet.create({
  wrapper: { position: 'absolute', bottom: Platform.OS === 'ios' ? 40 : 30, left: 20, right: 20, alignItems: 'flex-end' },
  chatBubble: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#075E54', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, marginBottom: 10, elevation: 5 },
  chatBubbleText: { color: '#fff', fontSize: 12, fontWeight: '700', marginLeft: 6 },
  container: { backgroundColor: '#1e293b', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 24, width: '100%', elevation: 10 },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 8, flex: 1 }, // Added flex: 1 to make it a larger tap target
  badge: { width: 44, height: 44, backgroundColor: '#334155', borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  countBadge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#10b981', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#1e293b' },
  countText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  priceInfo: { justifyContent: 'center' },
  totalPrice: { color: '#fff', fontSize: 18, fontWeight: '800' },
  totalWeight: { color: '#94a3b8', fontSize: 11, fontWeight: '600' },
  checkoutBtn: { backgroundColor: '#10b981', flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 16 },
  checkoutText: { color: '#fff', fontWeight: '800', fontSize: 15 }
});