import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MapPin, CreditCard, Truck } from 'lucide-react-native';

export default function AgroCheckoutScreen({ route, navigation }) {
  const { cart } = route.params;
  const subtotal = cart.reduce((sum, item) => sum + item.selectedGauge.price, 0);
  const totalWeight = cart.reduce((sum, item) => sum + item.selectedGauge.weight, 0);
  
  // Logic: ₦500 per kg base shipping
  const shippingFee = totalWeight * 500;
  const total = subtotal + shippingFee;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.header}>Checkout</Text>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#10b981" />
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          <TouchableOpacity style={styles.addressCard}>
            <Text style={styles.addressText}>123 Admiralty Way, Lekki Phase 1, Lagos</Text>
            <Text style={styles.changeLink}>Change</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Truck size={20} color="#10b981" />
            <Text style={styles.sectionTitle}>Order Summary</Text>
          </View>
          {cart.map((item, idx) => (
            <View key={idx} style={styles.summaryRow}>
              <Text style={styles.itemInfo}>{item.name} ({item.selectedGauge.label})</Text>
              <Text style={styles.itemPrice}>₦{item.selectedGauge.price.toLocaleString()}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.summaryRow}><Text style={styles.label}>Subtotal</Text><Text style={styles.val}>₦{subtotal.toLocaleString()}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.label}>Logistics ({totalWeight}kg)</Text><Text style={styles.val}>₦{shippingFee.toLocaleString()}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalVal}>₦{total.toLocaleString()}</Text></View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.payBtn} onPress={() => alert("Proceeding to Paystack...")}>
          <CreditCard color="#fff" size={20} />
          <Text style={styles.payBtnText}>Pay Now ₦{total.toLocaleString()}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 24 },
  header: { fontSize: 24, fontWeight: '800', color: '#1e293b', marginBottom: 25 },
  section: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1e293b' },
  addressCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addressText: { flex: 1, color: '#64748b', fontWeight: '600' },
  changeLink: { color: '#10b981', fontWeight: '800', marginLeft: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  itemInfo: { color: '#1e293b', fontWeight: '600' },
  itemPrice: { fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 15 },
  label: { color: '#94a3b8', fontWeight: '600' },
  val: { fontWeight: '700', color: '#1e293b' },
  totalLabel: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  totalVal: { fontSize: 18, fontWeight: '800', color: '#10b981' },
  footer: { padding: 24, backgroundColor: '#fff' },
  payBtn: { backgroundColor: '#1e293b', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, padding: 20, borderRadius: 20 },
  payBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 }
});