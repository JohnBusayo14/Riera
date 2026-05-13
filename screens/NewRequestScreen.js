
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ProduceType, OrderStatus, PackagingType } from '../types';
import { COLORS } from '../constants';
import { getLogisticsRecommendation } from '../services/geminiService';
import Input from '../components/Input';
import Button from '../components/Button';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';

export default function NewRequestScreen({ user, onBack, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ 
    produce: ProduceType.TOMATOES, 
    qty: '', 
    weight: '',
    packaging: PackagingType.BAG,
    pickup: '', 
    dropoff: '',
    receiverName: '',
    receiverPhone: ''
  });
  const [rec, setRec] = useState(null);

  const getQuote = async () => {
    if (!form.qty || !form.pickup || !form.dropoff) return;
    setLoading(true);
    const result = await getLogisticsRecommendation({
      produceType: form.produce,
      quantity: form.qty,
      weight: form.weight,
      pickup: form.pickup,
      dropoff: form.dropoff
    });
    setRec(result);
    setLoading(false);
  };

  const handlePost = () => {
    onSubmit({
      id: `LOCAL-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      customerId: user.id,
      ...form,
      status: OrderStatus.PENDING,
      estimatedCost: rec?.estimatedPrice || 25000,
      timestamp: Date.now()
    });
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Book Local Shipment" onBack={onBack} />
      
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.form}>
          <Text style={styles.sectionHeader}>CARGO DETAILS</Text>
          <View style={styles.typeSelector}>
             <Text style={styles.typeText}>{form.produce}</Text>
          </View>
          <View style={styles.row}>
            <Input style={{flex: 1}} label="QUANTITY" value={form.qty} onChangeText={t => setForm({...form, qty: t})} />
            <Input style={{flex: 1}} label="WEIGHT (KG)" keyboardType="numeric" value={form.weight} onChangeText={t => setForm({...form, weight: t})} />
          </View>

          <Text style={styles.sectionHeader}>RECEIVER INFO</Text>
          <Input label="RECEIVER FULL NAME" placeholder="Name of person at destination" value={form.receiverName} onChangeText={t => setForm({...form, receiverName: t})} />
          <Input label="RECEIVER PHONE" keyboardType="phone-pad" value={form.receiverPhone} onChangeText={t => setForm({...form, receiverPhone: t})} />

          <Text style={styles.sectionHeader}>LOGISTICS</Text>
          <Input label="PICKUP ADDRESS" value={form.pickup} onChangeText={t => setForm({...form, pickup: t})} />
          <Input label="DELIVERY ADDRESS" value={form.dropoff} onChangeText={t => setForm({...form, dropoff: t})} />

          {!rec ? (
            <Button 
              title="Get Smart Quote ✨" 
              variant="secondary" 
              onPress={getQuote} 
              loading={loading}
              style={styles.quoteBtn} 
            />
          ) : (
            <Card style={styles.recCard}>
              <View style={styles.recHeader}>
                <Text style={styles.recPrice}>₦{rec.estimatedPrice.toLocaleString()}</Text>
                <Text style={styles.recTime}>{rec.estimatedTime}</Text>
              </View>
              <Text style={styles.recVehicle}>Recommended: {rec.recommendedVehicle}</Text>
              <Text style={styles.recAdvice}>{rec.specialAdvice}</Text>
              <Button title="Confirm & Post Order" onPress={handlePost} style={styles.submitBtn} />
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  scroll: { paddingBottom: 40 },
  form: { padding: 20, gap: 4 },
  sectionHeader: { fontSize: 12, fontWeight: '900', color: COLORS.primary, marginTop: 15, marginBottom: 10, letterSpacing: 1.5 },
  row: { flexDirection: 'row', gap: 10 },
  typeSelector: { backgroundColor: '#f1f5f9', padding: 18, borderRadius: 16, marginBottom: 16 },
  typeText: { fontSize: 16, fontWeight: '600', color: COLORS.slate700 },
  quoteBtn: { marginTop: 20 },
  recCard: { backgroundColor: '#f0fdf4', borderStyle: 'solid', borderColor: '#bcf2c9', marginTop: 10 },
  recHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recPrice: { fontSize: 24, fontWeight: '900', color: COLORS.primary },
  recTime: { fontSize: 12, fontWeight: '700', color: COLORS.slate400 },
  recVehicle: { fontWeight: '700', color: COLORS.slate900, marginTop: 4 },
  recAdvice: { fontSize: 12, color: COLORS.slate700, fontStyle: 'italic', marginTop: 8 },
  submitBtn: { marginTop: 20 },
});
