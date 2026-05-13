import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
import { Truck, ChevronRight, Info, Package, MapPin, ChevronLeft } from 'lucide-react-native';
import apiClient from '../services/apiClient';
import { COLORS } from '../constants';
import { useTheme } from '../context/ThemeContext';

export default function BobGoSearchScreen({ route, navigation }) {
    const { orderId } = route.params;
    const { isDark: IsDark } = useTheme();
    const [loading, setLoading] = useState(true);
    const [rates, setRates] = useState([]);

    const UI = {
        Bg: IsDark ? '#0F172A' : '#F8FAFC',
        Card: IsDark ? '#1E293B' : '#FFFFFF',
        Text: IsDark ? '#F8FAFC' : '#0F172A',
        Muted: IsDark ? '#94A3B8' : '#64748B',
        Primary: COLORS.primary || '#008148',
        Border: IsDark ? '#334155' : '#E2E8F0',
        InfoBg: IsDark ? 'rgba(59, 130, 246, 0.1)' : '#EFF6FF'
    };

    useEffect(() => {
        fetchRates();
    }, []);

    const fetchRates = async () => {
        try {
            setLoading(true);
            // Updated endpoint to match the backend route provided in previous steps
            const res = await apiClient.post(`/orders/seller/fetch-shipping-rates/${orderId}`);
            setRates(res.data.rates || []);
        } catch (err) {
            console.error("Fetch Error:", err);
            Alert.alert("Error", "Could not retrieve shipping rates. Please verify the addresses.");
        } finally {
            setLoading(false);
        }
    };

    const selectCourier = (item) => {
        Alert.alert(
            "Confirm Courier",
            `Would you like to book ${item.carrier_name} for R${item.rate}?`,
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Book Now", 
                    onPress: () => navigation.navigate('OrderDetails', { orderId, selectedRider: item }) 
                }
            ]
        );
    };

    const renderRateItem = ({ item }) => (
        <TouchableOpacity 
            style={[styles.RateCard, { backgroundColor: UI.Card, borderColor: UI.Border }]} 
            onPress={() => selectCourier(item)}
        >
            <View style={[styles.IconContainer, { backgroundColor: UI.Bg }]}>
                <Truck size={24} color={UI.Primary} />
            </View>
            
            <View style={styles.CourierInfo}>
                <Text style={[styles.CarrierName, { color: UI.Text }]}>{item.carrier_name}</Text>
                <Text style={[styles.ServiceName, { color: UI.Muted }]}>{item.service_name}</Text>
                <View style={styles.EstimateRow}>
                    <Info size={12} color="#3B82F6" />
                    <Text style={styles.DeliveryTime}>{item.delivery_estimate}</Text>
                </View>
            </View>

            <View style={styles.PriceSection}>
                <Text style={[styles.Price, { color: UI.Primary }]}>R {item.rate}</Text>
                <ChevronRight size={20} color={UI.Muted} />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.Container, { backgroundColor: UI.Bg }]}>
            <StatusBar barStyle={IsDark ? 'light-content' : 'dark-content'} />
            
            <View style={[styles.Header, { borderBottomColor: UI.Border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.BackBtn}>
                    <ChevronLeft color={UI.Text} size={28} />
                </TouchableOpacity>
                <View>
                    <Text style={[styles.Title, { color: UI.Text }]}>Available Riders</Text>
                    <Text style={[styles.Sub, { color: UI.Muted }]}>Professional shipping for Order #{orderId.toString().substring(0,6)}</Text>
                </View>
            </View>

            {loading ? (
                <View style={styles.Center}>
                    <ActivityIndicator size="large" color={UI.Primary} />
                    <Text style={[styles.LoadingText, { color: UI.Muted }]}>Fetching live rates...</Text>
                </View>
            ) : (
                <FlatList
                    contentContainerStyle={styles.ListBody}
                    data={rates}
                    renderItem={renderRateItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListHeaderComponent={
                        <View style={[styles.InfoNote, { backgroundColor: UI.InfoBg }]}>
                            <Info size={16} color="#3B82F6" />
                            <Text style={styles.NoteText}>Select a courier to proceed with booking collection. Prices are inclusive of VAT.</Text>
                        </View>
                    }
                    ListEmptyComponent={
                        <View style={styles.EmptyContainer}>
                            <Package size={48} color={UI.Muted} />
                            <Text style={[styles.Empty, { color: UI.Muted }]}>No couriers found for this route. Check if Sandbox carriers are enabled.</Text>
                            <TouchableOpacity style={styles.RetryBtn} onPress={fetchRates}>
                                <Text style={{ color: UI.Primary, fontWeight: '800' }}>Retry Search</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    Container: { flex: 1 },
    Header: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
    BackBtn: { marginRight: 15 },
    Title: { fontSize: 20, fontWeight: '900' },
    Sub: { fontSize: 12, fontWeight: '600', marginTop: 2 },
    ListBody: { padding: 20 },
    Center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    LoadingText: { marginTop: 12, fontWeight: '700' },
    RateCard: { 
        padding: 16, borderRadius: 20, borderWidth: 1,
        flexDirection: 'row', alignItems: 'center', marginBottom: 15,
        elevation: 1
    },
    IconContainer: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    CourierInfo: { flex: 1 },
    CarrierName: { fontSize: 16, fontWeight: '800' },
    ServiceName: { fontSize: 13, fontWeight: '600' },
    EstimateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
    DeliveryTime: { fontSize: 12, color: '#3B82F6', fontWeight: '700' },
    PriceSection: { flexDirection: 'row', alignItems: 'center' },
    Price: { fontSize: 18, fontWeight: '900', marginRight: 8 },
    InfoNote: { flexDirection: 'row', gap: 10, padding: 15, borderRadius: 15, marginBottom: 20, alignItems: 'center' },
    NoteText: { fontSize: 12, fontWeight: '600', color: '#3B82F6', flex: 1 },
    EmptyContainer: { alignItems: 'center', marginTop: 60 },
    Empty: { textAlign: 'center', marginTop: 15, fontSize: 14, fontWeight: '600', paddingHorizontal: 40 },
    RetryBtn: { marginTop: 20, padding: 10 }
});