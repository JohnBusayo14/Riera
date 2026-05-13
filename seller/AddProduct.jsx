import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, 
  TouchableOpacity, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform, SafeAreaView, StatusBar
} from 'react-native';
import { 
  ChevronLeft, Trash2, Plus, X, Truck, 
  Tag, Info, Image as ImageIcon, Sparkles, Weight as WeightIcon
} from 'lucide-react-native';

import { useTheme } from '../context/ThemeContext';
import apiClient from '../services/apiClient'; 

const CATEGORIES = [
  "Grains & Beans", "Kitchen", "Fruits", "Livestock", "Tubers", "Vegetables", "Spices"
];

const AddProduct = ({ navigation }) => {
  const { colors: Colors, isDark: IsDark } = useTheme();
  
  const [Loading, setLoading] = useState(false);
  const [FormData, setFormData] = useState({
    Label: '',
    Description: '',
    Category: 'Grains & Beans',
    ImageUrls: [''], 
    RatePerKm: '5.50',
    TotalWeight: '', // Added: Global product weight
    Gauges: [{ Label: '', Price: '', Weight: '' }] 
  });

  const UI = {
    Bg: IsDark ? '#0F172A' : '#F8FAFC',
    Card: IsDark ? '#1E293B' : '#FFFFFF',
    Text: IsDark ? '#F8FAFC' : '#0F172A',
    Muted: IsDark ? '#94A3B8' : '#64748B',
    Primary: '#008148',
    Border: IsDark ? '#334155' : '#E2E8F0',
    InputBg: IsDark ? '#0F172A' : '#F1F5F9',
    Danger: '#EF4444'
  };

  const AddGauge = () => {
    setFormData({
      ...FormData,
      Gauges: [...FormData.Gauges, { Label: '', Price: '', Weight: '' }]
    });
  };

  const UpdateGauge = (Index, Field, Value) => {
    const UpdatedGauges = [...FormData.Gauges];
    UpdatedGauges[Index][Field] = Value;
    setFormData({ ...FormData, Gauges: UpdatedGauges });
  };

const HandleSubmit = async () => {
  const ValidImages = FormData.ImageUrls.filter(url => url.trim() !== '');
  
  if (!FormData.Label || ValidImages.length === 0) {
    Alert.alert("Missing Info", "Please provide a product name and at least one image URL.");
    return;
  }

  setLoading(true);

  try {
    // Define the platform fee (5%)
    const PLATFORM_FEE = 0.05;

    const Payload = {
      Label: FormData.Label,
      Description: FormData.Description,
      Category: FormData.Category,
      ImageUrls: ValidImages,
      IsLocal: true,
      IsInternational: false,
      LocalRatePerKg: parseFloat(FormData.RatePerKm) || 0, 
      Gauges: FormData.Gauges.map(g => {
        const basePrice = parseFloat(g.Price) || 0;
        // Apply 5% surge: New Price = Original Price * 1.05
        const surgedPrice = basePrice * (1 + PLATFORM_FEE);

        return {
          Label: g.Label,
          Price: surgedPrice, // The price saved to the DB now includes the fee
          Weight: parseFloat(g.Weight) || 0,
          ImageUrl: ValidImages[0] 
        };
      })
    };

    await apiClient.post('/Products/seller/add', Payload);
    
    Alert.alert("Success!", "Product listed successfully with 5% platform fee applied.", [
      { text: "OK", onPress: () => navigation.goBack() }
    ]);
  } catch (error) {
    const ErrorMsg = error.response?.data?.Message || "Could not save product.";
    Alert.alert("Error", ErrorMsg);
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={[styles.Main, { backgroundColor: UI.Bg }]}>
      <StatusBar barStyle={IsDark ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        
        <View style={[styles.Header, { backgroundColor: UI.Card, borderBottomColor: UI.Border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.CircularBtn, { backgroundColor: UI.Bg }]}>
            <ChevronLeft color={UI.Text} size={24} />
          </TouchableOpacity>
          <Text style={[styles.HeaderTitle, { color: UI.Text }]}>Create Listing</Text>
          <Sparkles size={20} color={UI.Primary} />
        </View>

        <ScrollView contentContainerStyle={styles.ScrollContent} showsVerticalScrollIndicator={false}>
          
          <Text style={[styles.SectionHeader, { color: UI.Muted }]}>Product Details</Text>
          <View style={[styles.FormCard, { backgroundColor: UI.Card, borderColor: UI.Border }]}>
            <View style={styles.InputBox}>
              <Text style={[styles.InputLabel, { color: UI.Text }]}>Product Name</Text>
              <TextInput 
                style={[styles.TextField, { backgroundColor: UI.InputBg, color: UI.Text }]} 
                placeholder="e.g. Grade A White Maize"
                placeholderTextColor={UI.Muted}
                value={FormData.Label}
                onChangeText={(T) => setFormData({...FormData, Label: T})}
              />
            </View>

            {/* Added: Total Weight Input */}
            <View style={styles.InputBox}>
              <Text style={[styles.InputLabel, { color: UI.Text }]}>Total Available Weight (Kg)</Text>
              <View style={[styles.WeightInputRow, { backgroundColor: UI.InputBg }]}>
                <WeightIcon size={18} color={UI.Primary} />
                <TextInput 
                  style={[styles.WeightInput, { color: UI.Text }]} 
                  placeholder="0.00"
                  placeholderTextColor={UI.Muted}
                  keyboardType="numeric"
                  value={FormData.TotalWeight}
                  onChangeText={(T) => setFormData({...FormData, TotalWeight: T})}
                />
                <Text style={{ fontWeight: '800', color: UI.Muted }}>KG</Text>
              </View>
            </View>

            <View style={styles.InputBox}>
              <Text style={[styles.InputLabel, { color: UI.Text }]}>Description</Text>
              <TextInput 
                style={[styles.TextField, { height: 80, textAlignVertical: 'top', backgroundColor: UI.InputBg, color: UI.Text }]} 
                placeholder="Details about quality..."
                placeholderTextColor={UI.Muted}
                multiline
                value={FormData.Description}
                onChangeText={(T) => setFormData({...FormData, Description: T})}
              />
            </View>
          </View>

          <Text style={[styles.SectionHeader, { color: UI.Muted }]}>Classification</Text>
          <View style={styles.ChipContainer}>
            {CATEGORIES.map((Cat) => (
              <TouchableOpacity 
                key={Cat} 
                style={[
                  styles.Chip, 
                  { backgroundColor: UI.Card, borderColor: UI.Border },
                  FormData.Category === Cat && { backgroundColor: UI.Primary, borderColor: UI.Primary }
                ]}
                onPress={() => setFormData({...FormData, Category: Cat})}
              >
                <Text style={[styles.ChipText, { color: UI.Muted }, FormData.Category === Cat && { color: '#FFF' }]}>{Cat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.SectionHeader, { color: UI.Muted }]}>Media (Cloud Links)</Text>
          <View style={[styles.FormCard, { backgroundColor: UI.Card, borderColor: UI.Border }]}>
            {FormData.ImageUrls.map((Url, Index) => (
              <View key={Index} style={[styles.UrlRow, { backgroundColor: UI.InputBg }]}>
                <ImageIcon size={18} color={UI.Muted} />
                <TextInput 
                  style={[styles.UrlInput, { color: UI.Text }]} 
                  placeholder="Paste Image URL"
                  placeholderTextColor={UI.Muted}
                  value={Url}
                  onChangeText={(T) => {
                    const Updated = [...FormData.ImageUrls];
                    Updated[Index] = T;
                    setFormData({ ...FormData, ImageUrls: Updated });
                  }}
                />
                <TouchableOpacity onPress={() => {
                  const Updated = FormData.ImageUrls.filter((_, I) => I !== Index);
                  setFormData({ ...FormData, ImageUrls: Updated.length ? Updated : [''] });
                }}>
                  <Trash2 size={18} color={UI.Danger} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity onPress={() => setFormData({ ...FormData, ImageUrls: [...FormData.ImageUrls, ''] })} style={styles.GhostBtn}>
              <Plus size={16} color={UI.Primary} />
              <Text style={[styles.GhostBtnText, { color: UI.Primary }]}>Add Image Link</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.SplitHeader}>
            <Text style={[styles.SectionHeader, { color: UI.Muted, marginBottom: 0 }]}>Variations (Size, Price & Weight)</Text>
            <TouchableOpacity onPress={AddGauge}>
              <Text style={{ color: UI.Primary, fontWeight: '800' }}>+ New Size</Text>
            </TouchableOpacity>
          </View>

          {FormData.Gauges.map((Gauge, Index) => (
            <View key={Index} style={[styles.PriceCard, { backgroundColor: UI.Card, borderColor: UI.Border }]}>
              <View style={styles.GaugeGrid}>
                <TextInput 
                  style={[styles.TextField, { flex: 2, backgroundColor: UI.InputBg, color: UI.Text }]} 
                  placeholder="Label (10kg Bag)" 
                  placeholderTextColor={UI.Muted}
                  value={Gauge.Label}
                  onChangeText={(T) => UpdateGauge(Index, 'Label', T)}
                />
                <TextInput 
                  style={[styles.TextField, { flex: 1, backgroundColor: UI.InputBg, color: UI.Text }]} 
                  placeholder="Price" 
                  placeholderTextColor={UI.Muted}
                  keyboardType="numeric"
                  value={Gauge.Price}
                  onChangeText={(T) => UpdateGauge(Index, 'Price', T)}
                />
                <TextInput 
                  style={[styles.TextField, { flex: 1, backgroundColor: UI.InputBg, color: UI.Text }]} 
                  placeholder="Kg" 
                  placeholderTextColor={UI.Muted}
                  keyboardType="numeric"
                  value={Gauge.Weight}
                  onChangeText={(T) => UpdateGauge(Index, 'Weight', T)}
                />
                <TouchableOpacity onPress={() => {
                    if (FormData.Gauges.length > 1) {
                      const Updated = FormData.Gauges.filter((_, I) => I !== Index);
                      setFormData({ ...FormData, Gauges: Updated });
                    }
                  }}>
                  <X size={20} color={UI.Muted} />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <Text style={[styles.SectionHeader, { color: UI.Muted }]}>Delivery Rates</Text>
          <View style={[styles.LogisticsCard, { backgroundColor: UI.Card, borderColor: UI.Border }]}>
            <View style={styles.FlexRow}>
              <View style={[styles.LogIconBox, { backgroundColor: UI.Bg }]}>
                <Truck size={24} color={UI.Primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.LogTitle, { color: UI.Text }]}>Self-Managed Logistics</Text>
                <Text style={[styles.LogSub, { color: UI.Muted }]}>Set your delivery fee per KM.</Text>
              </View>
            </View>
            <View style={[styles.RateDisplay, { backgroundColor: UI.InputBg, borderColor: UI.Border }]}>
              <Text style={[styles.RandSign, { color: UI.Primary }]}>R</Text>
              <TextInput 
                style={[styles.RateValue, { color: UI.Text }]} 
                keyboardType="numeric"
                value={FormData.RatePerKm}
                onChangeText={(T) => setFormData({...FormData, RatePerKm: T})}
              />
              <Text style={[styles.KmLabel, { color: UI.Muted }]}>per KM</Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.PrimaryBtn, { backgroundColor: UI.Primary }, Loading && { opacity: 0.6 }]} onPress={HandleSubmit} disabled={Loading}>
            {Loading ? <ActivityIndicator color="white" /> : <Text style={styles.PrimaryBtnText}>Publish Listing</Text>}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Main: { flex: 1 },
  Header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1 },
  HeaderTitle: { fontSize: 20, fontWeight: '900' },
  CircularBtn: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  ScrollContent: { paddingBottom: 40 },
  SectionHeader: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5, marginLeft: 20, marginTop: 25, marginBottom: 10 },
  FormCard: { marginHorizontal: 20, borderRadius: 24, padding: 20, borderWidth: 1 },
  InputBox: { marginBottom: 15 },
  InputLabel: { fontSize: 13, fontWeight: '800', marginBottom: 8, textTransform: 'uppercase', opacity: 0.7 },
  TextField: { borderRadius: 16, padding: 15, fontSize: 15, fontWeight: '600' },
  WeightInputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, paddingHorizontal: 15, height: 55 },
  WeightInput: { flex: 1, marginHorizontal: 10, fontSize: 16, fontWeight: '800' },
  ChipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20 },
  Chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  ChipText: { fontSize: 13, fontWeight: '800' },
  UrlRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, marginBottom: 10, paddingHorizontal: 15, height: 55 },
  UrlInput: { flex: 1, marginHorizontal: 10, fontWeight: '600' },
  GhostBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, alignSelf: 'center' },
  GhostBtnText: { fontWeight: '900', fontSize: 14 },
  SplitHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 20, marginTop: 25, marginBottom: 10 },
  PriceCard: { marginHorizontal: 20, borderRadius: 20, padding: 10, marginBottom: 10, borderWidth: 1 },
  GaugeGrid: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  LogisticsCard: { marginHorizontal: 20, borderRadius: 24, padding: 20, borderWidth: 1 },
  FlexRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  LogIconBox: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  LogTitle: { fontSize: 16, fontWeight: '900' },
  LogSub: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  RateDisplay: { flexDirection: 'row', alignItems: 'center', marginTop: 20, padding: 12, borderRadius: 18, borderWidth: 1, width: '60%' },
  RandSign: { fontSize: 20, fontWeight: '900', marginRight: 10 },
  RateValue: { flex: 1, fontSize: 22, fontWeight: '900' },
  KmLabel: { fontSize: 12, fontWeight: '800' },
  PrimaryBtn: { marginHorizontal: 20, marginTop: 40, height: 65, borderRadius: 22, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  PrimaryBtnText: { color: 'white', fontSize: 18, fontWeight: '900' }
});

export default AddProduct;