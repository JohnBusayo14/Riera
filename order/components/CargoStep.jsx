import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert, 
  SafeAreaView, 
  navigation,
  Platform 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, Package, ShieldCheck } from 'lucide-react-native'; // Standard icons
import { COLORS } from '../../constants';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'Vegetables', label: 'Vegetables', icon: '🥦' },
  { id: 'Grains', label: 'Grains', icon: '🌾' },
  { id: 'Livestock', label: 'Livestock', icon: '🐄' },
  { id: 'Tubers', label: 'Tubers', icon: '🥔' },
  { id: 'Commercial', label: 'Commercial', icon: '📦' },
  { id: 'Documents', label: 'Documents', icon: '📂' },
  { id: 'Others', label: 'Others', icon: '➕' },
];

const CONTAINER_SIZES = [
  { id: '20ft', label: '20ft Cont.' },
  { id: '40ft', label: '40ft Cont.' },
  { id: 'LCL', label: 'LCL Share' },
];

const LOCAL_SIZES = [
  { id: 'S', label: 'Small Box' },
  { id: 'M', label: 'Medium' },
  { id: 'L', label: 'Large' },
];

const INCOTERMS = [
  { id: 'FOB', label: 'FOB', desc: 'Free On Board' },
  { id: 'CIF', label: 'CIF', desc: 'Cost, Ins, Freight' },
  { id: 'EXW', label: 'EXW', desc: 'Ex Works' },
  { id: 'DDP', label: 'DDP', desc: 'Delivered Duty Paid' },
];

export default function CargoStep({ form, setForm, onNext, onBack, isInternational = false, cartData = null }) {
  const navigation = useNavigation();
  const isFromShop = !!cartData;
  const sizes = isInternational ? CONTAINER_SIZES : LOCAL_SIZES;

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your photos to upload cargo images.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setForm({ 
        ...form, 
        cargoImage: asset.uri, 
        cargoImageBase64: asset.base64 
      });
    }
  };

  const toggleDetail = (item) => {
    const currentDetails = Array.isArray(form.details) ? form.details : [];
    setForm({
      ...form, 
      details: currentDetails.includes(item) 
        ? currentDetails.filter(d => d !== item) 
        : [...currentDetails, item]
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER SECTION - STEP 3 OF 3 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color={COLORS.slate900} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
           <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '100%' }]} />
           </View>
           <Text style={styles.stepCount}>Step 3 of 3</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.iconHeader}>
           <Package color={COLORS.primary} size={32} />
        </View>

        <Text style={styles.title}>
          {isFromShop ? "Market Items" : "Cargo Details"}
        </Text>
        <Text style={styles.subtitle}>
          Tell us about the items you are shipping.
        </Text>

        {/* MARKETPLACE SUMMARY */}
        {isFromShop ? (
          <View style={styles.cartSummaryBox}>
            {cartData.items.map((item, idx) => (
              <View key={idx} style={styles.cartItemRow}>
                <Text style={styles.cartItemEmoji}>🛒</Text>
                <View style={{flex: 1}}>
                  <Text style={styles.cartItemName}>{item.name}</Text>
                  <Text style={styles.cartItemDetail}>Qty: {item.quantity} | Total: ${item.price * item.quantity}</Text>
                </View>
              </View>
            ))}
            <View style={styles.cartTotalRow}>
              <Text style={styles.cartTotalLabel}>Goods Value:</Text>
              <Text style={styles.cartTotalValue}>${cartData.goodsPrice}</Text>
            </View>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity 
                key={cat.id} 
                onPress={() => setForm({...form, produce: cat.id})}
                style={[styles.catCard, form.produce === cat.id && styles.activeCatCard]}
              >
                <Text style={styles.catIcon}>{cat.icon}</Text>
                <Text style={[styles.catLabel, form.produce === cat.id && styles.activeCatLabel]}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <Text style={styles.sectionTitle}>Cargo Photo (Optional) 📸</Text>
        <TouchableOpacity 
          style={[styles.photoUploadBox, form.cargoImage && styles.photoUploadBoxActive]} 
          onPress={pickImage}
        >
          {form.cargoImage ? (
            <View style={styles.previewContainer}>
                <Image source={{ uri: form.cargoImage }} style={styles.imagePreview} />
                <TouchableOpacity 
                    style={styles.removePhoto} 
                    onPress={() => setForm({...form, cargoImage: null, cargoImageBase64: null})}
                >
                    <Text style={{color: 'white', fontWeight: 'bold'}}>✕</Text>
                </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.uploadText}>📷 Tap to add photo</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>{isInternational ? "Shipping Container" : "Package Size"}</Text>
        <View style={styles.boxGrid}>
          {sizes.map(box => (
            <TouchableOpacity 
              key={box.id} 
              onPress={() => setForm({...form, boxSize: box.id})}
              style={[styles.boxItem, form.boxSize === box.id && styles.activeBoxItem]}
            >
              <Text style={[styles.boxLabel, form.boxSize === box.id && styles.activeBoxLabel]}>{box.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {isInternational && (
          <>
            <Text style={styles.sectionTitle}>Incoterms</Text>
            <View style={styles.incotermGrid}>
              {INCOTERMS.map(term => (
                <TouchableOpacity 
                  key={term.id} 
                  onPress={() => setForm({...form, incoterm: term.id})}
                  style={[styles.termCard, form.incoterm === term.id && styles.activeTermCard]}
                >
                  <Text style={[styles.termLabel, form.incoterm === term.id && styles.activeTermText]}>{term.id}</Text>
                  <Text style={[styles.termDesc, form.incoterm === term.id && styles.activeTermText]}>{term.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>HS Code</Text>
            <Input 
              label="COMMODITY CODE" 
              placeholder="e.g. 0714.90" 
              value={form.hsCode} 
              onChangeText={t => setForm({...form, hsCode: t})} 
            />
          </>
        )}

        <Text style={styles.sectionTitle}>Weight & Quantity</Text>
        <View style={styles.row}>
            <Input style={{flex: 1}} label="WEIGHT (KG)" keyboardType="numeric" value={form.weight} onChangeText={t => setForm({...form, weight: t})} />
            {isInternational ? (
              <Input style={{flex: 1}} label="VOLUME (CBM)" keyboardType="numeric" value={form.volume} onChangeText={t => setForm({...form, volume: t})} />
            ) : (
              !isFromShop && <Input style={{flex: 1}} label="QUANTITY" placeholder="e.g. 5 Bags" value={form.qty} onChangeText={t => setForm({...form, qty: t})} />
            )}
        </View>

        <Text style={styles.sectionTitle}>Special Handling</Text>
        <View style={styles.chipCloud}>
          {['Fragile', 'Cold Chain', 'Insurance'].map(detail => (
            <TouchableOpacity 
              key={detail} 
              onPress={() => toggleDetail(detail)}
              style={[styles.chip, (form.details || []).includes(detail) && styles.activeChip]}
            >
              <Text style={[styles.chipText, (form.details || []).includes(detail) && styles.activeChipText]}>{detail}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button 
          title={isInternational ? "Review Export Quote" : "Calculate Shipping"} 
          onPress={onNext} 
          style={[styles.nextBtn, isInternational && { backgroundColor: COLORS.international }]} 
          disabled={!form.weight || (isInternational && !form.hsCode)} 
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    paddingBottom: 10
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  progressContainer: { flex: 1, alignItems: 'center', paddingHorizontal: 20 },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 2,
    marginBottom: 4
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2
  },
  stepCount: { fontSize: 10, fontWeight: '800', color: '#94a3b8', letterSpacing: 0.5 },
  
  scrollContent: { padding: 25, paddingBottom: 60 },
  iconHeader: { marginBottom: 15 },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.slate900, marginBottom: 8 },
  subtitle: { fontSize: 15, fontWeight: '500', color: '#64748b', marginBottom: 20 },
  
  sectionTitle: { fontSize: 14, fontWeight: '800', color: COLORS.slate900, textTransform: 'uppercase', letterSpacing: 1, marginTop: 25, marginBottom: 15 },
  
  cartSummaryBox: { backgroundColor: '#f8fafc', borderRadius: 20, padding: 15, borderWidth: 1, borderColor: '#e2e8f0', borderStyle: 'dashed' },
  cartItemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: 'white', padding: 10, borderRadius: 12 },
  cartItemEmoji: { fontSize: 20, marginRight: 10 },
  cartItemName: { fontSize: 14, fontWeight: '700', color: COLORS.slate800 },
  cartItemDetail: { fontSize: 11, color: COLORS.slate500 },
  cartTotalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingHorizontal: 5 },
  cartTotalLabel: { fontWeight: '700', color: COLORS.slate600 },
  cartTotalValue: { fontWeight: '900', color: COLORS.primary, fontSize: 16 },

  catScroll: { marginBottom: 10 },
  catCard: { backgroundColor: 'white', padding: 15, borderRadius: 18, marginRight: 10, alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9', width: 100 },
  activeCatCard: { borderColor: COLORS.primary, backgroundColor: '#f0fdf4' },
  catIcon: { fontSize: 24, marginBottom: 5 },
  catLabel: { fontSize: 12, fontWeight: '700', color: COLORS.slate700 },
  activeCatLabel: { color: COLORS.primary },
  
  photoUploadBox: { width: '100%', height: 160, backgroundColor: '#f8fafc', borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  previewContainer: { width: '100%', height: '100%' },
  imagePreview: { width: '100%', height: '100%', resizeMode: 'cover' },
  removePhoto: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.5)', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  uploadText: { color: COLORS.slate400, fontWeight: '700', fontSize: 13 },
  
  boxGrid: { flexDirection: 'row', gap: 10 },
  boxItem: { flex: 1, padding: 15, backgroundColor: 'white', borderRadius: 15, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  activeBoxItem: { backgroundColor: COLORS.slate900, borderColor: COLORS.slate900 },
  boxLabel: { fontSize: 12, fontWeight: '800', color: COLORS.slate500 },
  activeBoxLabel: { color: 'white' },
  
  incotermGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  termCard: { width: '48%', padding: 12, backgroundColor: 'white', borderRadius: 15, borderWidth: 1, borderColor: '#e2e8f0' },
  activeTermCard: { backgroundColor: COLORS.international, borderColor: COLORS.international },
  termLabel: { fontSize: 14, fontWeight: '900', color: COLORS.slate900 },
  termDesc: { fontSize: 9, color: COLORS.slate500 },
  activeTermText: { color: 'white' },
  
  chipCloud: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  chip: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, backgroundColor: '#f1f5f9' },
  activeChip: { backgroundColor: COLORS.primary },
  chipText: { fontSize: 12, fontWeight: '700', color: COLORS.slate600 },
  activeChipText: { color: 'white' },
  
  row: { flexDirection: 'row', gap: 10 },
  nextBtn: { marginTop: 40, marginBottom: 20 }
});