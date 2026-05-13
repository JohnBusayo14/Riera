
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, Icons } from '../constants';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import Badge from '../components/Badge';

export default function TrackingScreen({ order, onBack }) {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Tracking Order" onBack={onBack} />

      <View style={styles.mapStub}>
        <Text style={styles.mapText}>Live GPS View</Text>
        <View style={styles.marker}><Text>🚚</Text></View>
      </View>

      <Card style={styles.detailsCard}>
        <Badge label={order.status} />
        <Text style={styles.title}>{order.produceType}</Text>
        <Text style={styles.details}>{order.quantity} • ₦{order.estimatedCost.toLocaleString()}</Text>
        
        <View style={styles.line} />
        
        <View style={styles.route}>
          <View style={styles.dot} />
          <View>
            <Text style={styles.routeLabel}>PICKUP</Text>
            <Text style={styles.location}>{order.pickupLocation}</Text>
          </View>
        </View>
        
        <View style={styles.route}>
          <View style={[styles.dot, {backgroundColor: COLORS.secondary}]} />
          <View>
            <Text style={styles.routeLabel}>DESTINATION</Text>
            <Text style={styles.location}>{order.dropoffLocation}</Text>
          </View>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  mapStub: { height: 280, backgroundColor: '#cbd5e1', justifyContent: 'center', alignItems: 'center' },
  mapText: { fontWeight: 'bold', color: '#94a3b8', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  marker: { width: 44, height: 44, backgroundColor: 'white', borderRadius: 22, justifyContent: 'center', alignItems: 'center', shadowOpacity: 0.2, elevation: 4 },
  detailsCard: { marginTop: -40, marginHorizontal: 20, gap: 10 },
  title: { fontSize: 24, fontWeight: '900', color: COLORS.slate900 },
  details: { color: COLORS.slate400, fontWeight: '700' },
  line: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 10 },
  route: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 15 },
  routeLabel: { fontSize: 8, fontWeight: '900', color: COLORS.slate400, letterSpacing: 0.5 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary, marginTop: 12 },
  location: { fontWeight: '700', color: COLORS.slate700, fontSize: 14 }
});
