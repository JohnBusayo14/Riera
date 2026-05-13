import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, 
  TouchableOpacity, Alert, ActivityIndicator, Modal,
  KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, Switch
} from 'react-native';
import { 
  Trash2, Plus, X, Truck, Tag, Info, Image as ImageIcon, 
  Sparkles, Weight as WeightIcon, Eye, EyeOff
} from 'lucide-react-native';

import apiClient from '../services/apiClient';

const CATEGORIES = [
  "Grains & Beans", "Kitchen", "Fruits", "Livestock", "Tubers", "Vegetables", "Spices"
];

const EditProductModal = ({ visible, onClose, productId, onUpdateSuccess, UI, IsDark }) => {
  const [Loading, setLoading] = useState(true);
  const [Saving, setSaving] = useState(false);
  const [FormData, setFormData] = useState({
    Label: '',
    Description: '',
    Category: 'Grains & Beans',
    IsAvailable: true,
    ImageUrls: [''],
    TotalWeight: '',
    RatePerKm: '5.50',
    Gauges: []
  });

  useEffect(() => {
    if (visible && productId) {
      FetchProductDetails();
    }
  }, [visible, productId]);

  const FetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/Products/seller/${productId}`);
      const data = response.data;
      
      setFormData({
        Label: data.label || '',
        Description: data.description || '',
        Category: data.category || 'Grains & Beans',
        IsAvailable: data.isAvailable ?? true,
        ImageUrls: data.imageUrls?.length ? data.imageUrls : [''],
        TotalWeight: data.weight?.toString() || '0',
        RatePerKm: data.localRatePerKg?.toString() || '5.50',
        Gauges: data.gauges?.map(g => ({
            Label: g.label || '',
            Price: g.price?.toString() || '',
            Weight: g.weight?.toString() || ''
        })) || []
      });
    } catch (err) {
      Alert.alert("Error", "Could not load product details.");
      onClose();
    } finally {
      setLoading(false);
    }
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

  const HandleSave = async () => {
    const ValidImages = FormData.ImageUrls.filter(url => url.trim() !== '');
    if (!FormData.Label || !FormData.TotalWeight || ValidImages.length === 0) {
        Alert.alert("Required Fields", "Name, weight, and at least one image are mandatory.");
        return;
    }

    setSaving(true);
    try {
      const Payload = {
        Label: FormData.Label,
        Description: FormData.Description,
        Category: FormData.Category,
        IsAvailable: FormData.IsAvailable,
        ImageUrls: ValidImages,
        Weight: parseFloat(FormData.TotalWeight) || 0,
        WeightUnit: "kg",
        IsLocal: true,
        IsInternational: false,
        LocalRatePerKg: parseFloat(FormData.RatePerKm) || 0,
        Gauges: FormData.Gauges.map(g => ({
            Label: g.Label,
            Price: parseFloat(g.Price) || 0,
            Weight: parseFloat(g.Weight) || 0,
            ImageUrl: ValidImages[0]
        }))
      };

      await apiClient.put(`/Products/seller/update/${productId}`, Payload);
      onUpdateSuccess();
      onClose();
    } catch (err) {
      Alert.alert("Update Failed", "Check your internet connection or server status.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.Overlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
        <SafeAreaView style={[styles.ModalContainer, { backgroundColor: UI.Bg }]}>
          <StatusBar barStyle={IsDark ? 'light-content' : 'dark-content'} />
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            
            <View style={[styles.Header, { backgroundColor: UI.Card, borderBottomColor: UI.Border }]}>
              <TouchableOpacity onPress={onClose} style={[styles.CircularBtn, { backgroundColor: UI.Bg }]}>
                <X color={UI.Text} size={24} />
              </TouchableOpacity>
              <Text style={[styles.HeaderTitle, { color: UI.Text }]}>Edit Listing</Text>
              <TouchableOpacity onPress={HandleSave} disabled={Saving}>
                {Saving ? <ActivityIndicator size="small" color={UI.Primary} /> : <Sparkles size={22} color={UI.Primary} />}
              </TouchableOpacity>
            </View>

            {Loading ? (
               <View style={styles.Center}><ActivityIndicator size="large" color={UI.Primary} /></View>
            ) : (
              <ScrollView contentContainerStyle={styles.ScrollContent} showsVerticalScrollIndicator={false}>
                
                {/* Visibility */}
                <Text style={[styles.SectionHeader, { color: UI.Muted }]}>Visibility</Text>
                <View style={[styles.FormCard, { backgroundColor: UI.Card, borderColor: UI.Border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                    <View style={styles.Row}>
                      {FormData.IsAvailable ? <Eye size={20} color={UI.Primary} /> : <EyeOff size={20} color={UI.Muted} />}
                      <Text style={[styles.InputLabel, { color: UI.Text, marginBottom: 0, marginLeft: 10 }]}>Listing Visible</Text>
                    </View>
                    <Switch 
                      value={FormData.IsAvailable} 
                      onValueChange={(v) => setFormData({...FormData, IsAvailable: v})}
                      trackColor={{ true: UI.Primary }}
                    />
                </View>

                {/* Product Details Section */}
                <Text style={[styles.SectionHeader, { color: UI.Muted }]}>Product Details</Text>
                <View style={[styles.FormCard, { backgroundColor: UI.Card, borderColor: UI.Border }]}>
                  <View style={styles.InputBox}>
                    <Text style={[styles.InputLabel, { color: UI.Text }]}>Product Name</Text>
                    <TextInput 
                      style={[styles.TextField, { backgroundColor: UI.InputBg, color: UI.Text }]} 
                      placeholderTextColor={UI.Muted}
                      value={FormData.Label}
                      onChangeText={(T) => setFormData({...FormData, Label: T})}
                    />
                  </View>

                  <View style={styles.InputBox}>
                    <Text style={[styles.InputLabel, { color: UI.Text }]}>Total Weight (Kg)</Text>
                    <View style={[styles.WeightInputRow, { backgroundColor: UI.InputBg }]}>
                      <WeightIcon size={18} color={UI.Primary} />
                      <TextInput 
                        style={[styles.WeightInput, { color: UI.Text }]} 
                        keyboardType="numeric"
                        placeholderTextColor={UI.Muted}
                        value={FormData.TotalWeight}
                        onChangeText={(T) => setFormData({...FormData, TotalWeight: T})}
                      />
                      <Text style={{ fontWeight: '900', color: UI.Primary }}>KG</Text>
                    </View>
                  </View>

                  <View style={styles.InputBox}>
                    <Text style={[styles.InputLabel, { color: UI.Text }]}>Description</Text>
                    <TextInput 
                      style={[styles.TextField, { height: 100, textAlignVertical: 'top', backgroundColor: UI.InputBg, color: UI.Text, paddingTop: 15 }]} 
                      multiline
                      placeholderTextColor={UI.Muted}
                      value={FormData.Description}
                      onChangeText={(T) => setFormData({...FormData, Description: T})}
                    />
                  </View>
                </View>

                {/* Classification Chips */}
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

                {/* Images Section */}
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

                {/* Variations Section */}
                <View style={styles.SplitHeader}>
                  <Text style={[styles.SectionHeader, { color: UI.Muted, marginBottom: 0 }]}>Variations (Size, Price & Kg)</Text>
                  <TouchableOpacity onPress={AddGauge}>
                    <Text style={{ color: UI.Primary, fontWeight: '800' }}>+ New Size</Text>
                  </TouchableOpacity>
                </View>

                {FormData.Gauges.map((Gauge, Index) => (
                  <View key={Index} style={[styles.PriceCard, { backgroundColor: UI.Card, borderColor: UI.Border }]}>
                    <View style={styles.GaugeGrid}>
                      <TextInput 
                        style={[styles.TextField, { flex: 2, backgroundColor: UI.InputBg, color: UI.Text }]} 
                        placeholder="Label" 
                        placeholderTextColor={UI.Muted}
                        value={Gauge.Label}
                        onChangeText={(T) => UpdateGauge(Index, 'Label', T)}
                      />
                      <TextInput 
                        style={[styles.TextField, { flex: 1.2, backgroundColor: UI.InputBg, color: UI.Text }]} 
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
                            setFormData({ ...FormData, Gauges: FormData.Gauges.filter((_, I) => I !== Index) });
                          }
                        }}>
                        <X size={20} color={UI.Danger} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                {/* Logistics Section */}
                <Text style={[styles.SectionHeader, { color: UI.Muted }]}>Logistics</Text>
                <View style={[styles.LogisticsCard, { backgroundColor: UI.Card, borderColor: UI.Border }]}>
                    <View style={styles.FlexRow}>
                        <View style={[styles.LogIconBox, { backgroundColor: UI.Bg }]}>
                            <Truck size={24} color={UI.Primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.LogTitle, { color: UI.Text }]}>Delivery Rate</Text>
                            <Text style={[styles.LogSub, { color: UI.Muted }]}>Fee per KM for this product.</Text>
                        </View>
                    </View>
                    <View style={[styles.RateDisplay, { backgroundColor: UI.InputBg, borderColor: UI.Border, height: 60 }]}>
                        <Text style={[styles.RandSign, { color: UI.Primary }]}>R</Text>
                        <TextInput 
                            style={[styles.RateValue, { color: UI.Text }]} 
                            keyboardType="numeric"
                            placeholderTextColor={UI.Muted}
                            value={FormData.RatePerKm}
                            onChangeText={(T) => setFormData({...FormData, RatePerKm: T})}
                        />
                        <Text style={[styles.KmLabel, { color: UI.Muted }]}>per KM</Text>
                    </View>
                </View>

                <TouchableOpacity 
                  style={[styles.PrimaryBtn, { backgroundColor: UI.Primary }, Saving && { opacity: 0.6 }]} 
                  onPress={HandleSave}
                  disabled={Saving}
                >
                  {Saving ? <ActivityIndicator color="white" /> : <Text style={styles.PrimaryBtnText}>Save Changes</Text>}
                </TouchableOpacity>

                <View style={{ height: 40 }} />
              </ScrollView>
            )}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  Overlay: { flex: 1, justifyContent: 'flex-end' },
  ModalContainer: { height: '95%', borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden' },
  Center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  Header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1 },
  HeaderTitle: { fontSize: 20, fontWeight: '900' },
  CircularBtn: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  ScrollContent: { paddingBottom: 40 },
  SectionHeader: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5, marginLeft: 20, marginTop: 25, marginBottom: 10 },
  FormCard: { marginHorizontal: 20, borderRadius: 24, padding: 20, borderWidth: 1 },
  InputBox: { marginBottom: 15 },
  InputLabel: { fontSize: 13, fontWeight: '800', marginBottom: 8, textTransform: 'uppercase', opacity: 0.7 },
  TextField: { borderRadius: 16, padding: 15, fontSize: 15, fontWeight: '700' },
  WeightInputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, paddingHorizontal: 15, height: 55 },
  WeightInput: { flex: 1, marginHorizontal: 10, fontSize: 18, fontWeight: '900' },
  ChipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20 },
  Chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  ChipText: { fontSize: 13, fontWeight: '800' },
  UrlRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, marginBottom: 10, paddingHorizontal: 15, height: 55 },
  UrlInput: { flex: 1, marginHorizontal: 10, fontWeight: '700' },
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
  RateDisplay: { flexDirection: 'row', alignItems: 'center', marginTop: 20, padding: 12, borderRadius: 18, borderWidth: 1, width: '70%' },
  RandSign: { fontSize: 20, fontWeight: '900', marginRight: 10 },
  RateValue: { flex: 1, fontSize: 22, fontWeight: '900' },
  KmLabel: { fontSize: 12, fontWeight: '800' },
  PrimaryBtn: { marginHorizontal: 20, marginTop: 40, height: 65, borderRadius: 22, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  PrimaryBtnText: { color: 'white', fontSize: 18, fontWeight: '900' },
  Row: { flexDirection: 'row', alignItems: 'center' },
  Danger: '#EF4444'
});

export default EditProductModal;