import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  ActivityIndicator, RefreshControl, SafeAreaView 
} from 'react-native';
import { Package, MapPin, HandCoins, Scale, ChevronRight, AlertCircle } from 'lucide-react-native';
import apiClient from '../services/apiClient';

// --- CHILD COMPONENT: Fetches item details for a specific offer ---
const DetailedOfferCard = ({ offer, navigation }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullDetails = async () => {
      try {
        // Step 2: GET /api/driver/order-details/{orderId}
        const response = await apiClient.get(`/driver/order-details/${offer.orderId || offer.id}`);
        setDetails(response.data);
      } catch (error) {
        console.error("Error fetching order specifics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFullDetails();
  }, [offer.id]);

  if (loading) return (
    <View style={[styles.card, styles.center]}>
      <ActivityIndicator size="small" color="#8B5CF6" />
    </View>
  );

  return (
    <View style={[styles.card, styles.offerBorder]}>
      <View style={styles.cardHeader}>
        <View style={styles.offerBadge}>
          <HandCoins size={14} color="#8B5CF6" />
          <Text style={styles.offerBadgeText}>DIRECT OFFER</Text>
        </View>
        <Text style={styles.jobID}>#{offer.id.slice(0, 8).toUpperCase()}</Text>
      </View>

      {/* Item Details from GET /order-details/{id} */}
      {details?.items?.map((item, idx) => (
        <View key={idx} style={styles.itemRow}>
          <Text style={styles.commodityText}>
            {item.quantity}x {item.productName}
          </Text>
          <View style={styles.specRow}>
            <Scale size={12} color="#64748B" />
            <Text style={styles.specText}>
              {item.weight} {item.gaugeLabel ? `• ${item.gaugeLabel}` : ''}
            </Text>
          </View>
        </View>
      ))}

      <View style={styles.routeContainer}>
        <MapPin size={16} color="#EF4444" />
        <Text style={styles.addressText} numberOfLines={2}>
          {details?.delivery?.address || offer.deliveryAddress}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <View>
          <Text style={styles.payoutLabel}>Total Payout</Text>
          <Text style={styles.priceAmount}>R {details?.logistics?.totalAmount || offer.price}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.acceptButton}
          onPress={() => navigation.navigate('OrderDetails', { orderId: details?.orderId })}
        >
          <Text style={styles.acceptButtonText}>Review & Accept</Text>
          <ChevronRight size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- MAIN SCREEN: GET /api/driver/my-offers ---
const DriverOffersScreen = ({ navigation }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOffers = useCallback(async () => {
    try {
      // Step 1: GET /api/driver/my-offers
      const response = await apiClient.get('/driver/my-offers');
      setOffers(response.data || []);
    } catch (error) {
      console.error("Fetch Offers Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchOffers(); }, [fetchOffers]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#22C55E" />;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>My Direct Offers</Text>
      <FlatList
        data={offers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DetailedOfferCard offer={item} navigation={navigation} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchOffers} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Package size={48} color="#CBD5E1" />
            <Text style={styles.emptyText}>No pending offers found.</Text>
          </View>
        }
        contentContainerStyle={{ padding: 20 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  screenTitle: { fontSize: 22, fontWeight: '900', padding: 20, color: '#1E293B' },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 16, marginBottom: 16, elevation: 2 },
  offerBorder: { borderLeftWidth: 4, borderLeftColor: '#8B5CF6' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  offerBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F3FF', padding: 6, borderRadius: 6, gap: 4 },
  offerBadgeText: { color: '#8B5CF6', fontSize: 10, fontWeight: '900' },
  jobID: { color: '#94A3B8', fontSize: 11, fontWeight: '700' },
  itemRow: { marginBottom: 8 },
  commodityText: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  specRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  specText: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  routeContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 12 },
  addressText: { flex: 1, fontSize: 13, color: '#475569', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  payoutLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '800', textTransform: 'uppercase' },
  priceAmount: { fontSize: 20, fontWeight: '900', color: '#1E293B' },
  acceptButton: { backgroundColor: '#8B5CF6', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 6 },
  acceptButtonText: { color: 'white', fontWeight: '800', fontSize: 14 },
  center: { height: 150, justifyContent: 'center' },
  empty: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#64748B', marginTop: 10, fontWeight: '600' }
});

export default DriverOffersScreen;