import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { 
  Package, MapPin, Navigation, Clock, Scale, 
  ChevronRight, AlertCircle 
} from 'lucide-react-native';
import apiClient from '../services/apiClient'; // Using your existing apiClient

const OrderDetailsCard = ({ orderId, onAccept, onViewDetails }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        // Using the requested endpoint: GET /api/driver/order-details/{orderId}
        const response = await apiClient.get(`/driver/order-details/${orderId}`);
        setOrder(response.data);
        setError(false);
      } catch (err) {
        console.error("Failed to fetch order details:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchDetails();
  }, [orderId]);

  if (loading) {
    return (
      <View style={[styles.card, styles.centerContent]}>
        <ActivityIndicator size="small" color="#22C55E" />
        <Text style={styles.loadingText}>Fetching order details...</Text>
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={[styles.card, styles.centerContent]}>
        <AlertCircle size={24} color="#EF4444" />
        <Text style={styles.errorText}>Could not load details.</Text>
      </View>
    );
  }

  // Formatting variables based on fetched data
  const mainItem = order.items?.[0];
  const totalItemsCount = order.items?.length || 0;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.statusRow}>
          <View style={styles.typeBadge}>
            <Package size={14} color="#059669" />
            <Text style={styles.typeText}>{order.type || 'Standard Load'}</Text>
          </View>
          {order.isUrgent && (
            <View style={styles.urgentBadge}>
              <AlertCircle size={12} color="#EF4444" />
              <Text style={styles.urgentText}>URGENT</Text>
            </View>
          )}
        </View>
        <Text style={styles.jobID}>#{order.id}</Text>
      </View>

      {/* Commodity Title */}
      <Text style={styles.commodityTitle}>
        {mainItem ? `${mainItem.quantity}x ${mainItem.productName}` : 'Agro Load'}
      </Text>
      
      {/* Route */}
      <View style={styles.routeContainer}>
        <View style={styles.routeLineContainer}>
          <View style={[styles.dot, { backgroundColor: '#22C55E' }]} />
          <View style={styles.line} />
          <MapPin size={16} color="#EF4444" />
        </View>
        <View style={styles.addressContainer}>
          <View>
            <Text style={styles.addressLabel}>Pickup</Text>
            <Text style={styles.addressValue}>{order.pickupAddress || 'Warehouse'}</Text>
          </View>
          <View style={{ height: 15 }} />
          <View>
            <Text style={styles.addressLabel}>Drop-off</Text>
            <Text style={styles.addressValue}>{order.deliveryAddress}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Navigation size={14} color="#64748B" />
          <Text style={styles.statText}>{order.distanceKm || '--'} km</Text>
        </View>
        <View style={styles.statItem}>
          <Scale size={14} color="#64748B" />
          <Text style={styles.statText}>{mainItem?.weight || 'N/A'}</Text>
        </View>
      </View>

      {/* Footer / Actions */}
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.priceLabel}>Payout</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.currency}>R</Text>
            <Text style={styles.priceAmount}>{order.totalAmount}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.acceptButton}
          onPress={() => onAccept(order.id)}
        >
          <Text style={styles.acceptButtonText}>Accept</Text>
          <ChevronRight color="white" size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  centerContent: { height: 180, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#64748B', fontSize: 12, fontWeight: '600' },
  errorText: { marginTop: 10, color: '#EF4444', fontWeight: '700' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  statusRow: { flexDirection: 'row', gap: 8 },
  typeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, gap: 4 },
  typeText: { color: '#166534', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  urgentBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, gap: 4 },
  urgentText: { color: '#EF4444', fontSize: 10, fontWeight: '900' },
  jobID: { color: '#94A3B8', fontSize: 12, fontWeight: '700' },
  commodityTitle: { fontSize: 18, fontWeight: '900', color: '#1E293B', marginBottom: 15 },
  routeContainer: { flexDirection: 'row', marginBottom: 20 },
  routeLineContainer: { alignItems: 'center', width: 20, marginRight: 15 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  line: { width: 2, height: 40, backgroundColor: '#E2E8F0', marginVertical: 4 },
  addressContainer: { flex: 1 },
  addressLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '800', textTransform: 'uppercase', marginBottom: 2 },
  addressValue: { fontSize: 14, color: '#334155', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 15 },
  statsRow: { flexDirection: 'row', gap: 20, marginBottom: 20 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { fontSize: 13, color: '#64748B', fontWeight: '700' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceLabel: { fontSize: 10, color: '#64748B', fontWeight: '800', textTransform: 'uppercase' },
  priceContainer: { flexDirection: 'row', alignItems: 'baseline' },
  currency: { fontSize: 14, fontWeight: '900', color: '#059669', marginRight: 2 },
  priceAmount: { fontSize: 22, fontWeight: '900', color: '#1E293B' },
  acceptButton: { backgroundColor: '#22C55E', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 8 },
  acceptButtonText: { color: 'white', fontSize: 15, fontWeight: '900' }
});

export default OrderDetailsCard;