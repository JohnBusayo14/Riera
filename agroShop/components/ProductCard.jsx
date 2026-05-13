import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Plus, Scale, Layers } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

export default function ProductCard({ product, onPress }) {
  if (!product) return null;

  // 1. Logic to handle both single price products and multi-gauge products
  const gauges = product.gauges || [];
  const hasGauges = gauges.length > 0;
  
  // 2. BACKEND COMPATIBILITY: Check for both lowercase and Uppercase keys
  const priceValue = product.price ?? product.Price ?? 0;
  const weightValue = product.weight ?? product.Weight ?? 0;
  const productName = product.label ?? product.Label ?? product.name ?? "Unnamed Produce";
  const productCategory = product.category ?? product.Category ?? 'Produce';
  const productImage = product.imageUrl ?? product.ImageUrl ?? 'https://via.placeholder.com/150';

  // 3. Calculation logic
  const displayPrice = hasGauges 
    ? Math.min(...gauges.map(g => Number(g.price) || 0)) 
    : Number(priceValue);
    
  const displayWeight = hasGauges 
    ? (gauges[0].weight || 0) 
    : Number(weightValue);

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(product)} activeOpacity={0.9}>
      <Image source={{ uri: productImage }} style={styles.image} />
      
      <View style={styles.weightBadge}>
        <Scale color="#10b981" size={10} />
        <Text style={styles.weightText}>
          {displayWeight}kg{hasGauges ? '+' : ''}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.category}>{productCategory.toUpperCase()}</Text>
        <Text style={styles.name} numberOfLines={1}>{productName}</Text>
        
        <View style={styles.footer}>
          <View>
            <Text style={styles.priceLabel}>{hasGauges ? 'Starting from' : 'Price'}</Text>
            {/* toLocaleString() requires a valid number, hence the fallback to 0 */}
            <Text style={styles.price}>₦{(displayPrice || 0).toLocaleString()}</Text>
          </View>
          <View style={[styles.addBtn, hasGauges && { backgroundColor: '#3b82f6' }]}>
            {hasGauges ? <Layers color="#fff" size={18} /> : <Plus color="#fff" size={20} strokeWidth={3} />}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    position: 'relative',
    overflow: 'hidden'
  },
  weightBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#ecfdf5'
  },
  weightText: { fontSize: 10, fontWeight: '700', color: '#065f46', marginLeft: 4 },
  image: { width: '100%', height: 140, backgroundColor: '#f8fafc' },
  info: { padding: 12 },
  category: { fontSize: 10, fontWeight: '800', color: '#94a3b8', letterSpacing: 1 },
  name: { fontSize: 15, fontWeight: '700', color: '#1e293b', marginTop: 4 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 12 },
  priceLabel: { fontSize: 10, color: '#64748b', fontWeight: '500' },
  price: { fontSize: 16, fontWeight: '800', color: '#10b981' },
  addBtn: { backgroundColor: '#10b981', width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }
});