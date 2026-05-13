import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../../constants';
import Button from '../../components/Button';
import Input from '../../components/Input';

const { width } = Dimensions.get('window');

const TRANSPORT_MODES = [
  { id: 'SEA', label: 'Sea Freight', icon: '🚢' },
  { id: 'AIR', label: 'Air Cargo', icon: '✈️' },
];

const INCOTERMS = [
  { id: 'FOB', label: 'FOB', desc: 'Free On Board' },
  { id: 'CIF', label: 'CIF', desc: 'Cost, Insurance, Freight' },
  { id: 'EXW', label: 'EXW', desc: 'Ex Works' },
  { id: 'DDP', label: 'DDP', desc: 'Delivered Duty Paid' },
];

const CONTAINER_SIZES = [
  { id: '20ft', label: '20ft Container' },
  { id: '40ft', label: '40ft Container' },
  { id: 'LCL', label: 'LCL (Shared)' },
];

export default function InternationalCargoStep({ form, setForm, onNext }) {
  
  useEffect(() => {
    if (typeof document !== 'undefined') {
      let input = document.getElementById('intl-cargo-file');
      if (!input) {
        input = document.createElement('input');
        input.type = 'file';
        input.id = 'intl-cargo-file';
        input.style.display = 'none';
        input.accept = 'image/*';
        document.body.appendChild(input);
      }
      
      const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            setForm(prev => ({ ...prev, cargoImageBase64: ev.target.result }));
          };
          reader.readAsDataURL(file);
        }
      };
      
      input.addEventListener('change', handleChange);
      return () => input.removeEventListener('change', handleChange);
    }
  }, [setForm]);

  const triggerImagePicker = () => {
    if (typeof document !== 'undefined') {
      document.getElementById('intl-cargo-file')?.click();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.headerTitle}>Logistics Details 🌍</Text>
        
        {/* 1. Transport Mode */}
        <Text style={styles.sectionTitle}>Transport Mode</Text>
        <View style={styles.modeRow}>
          {TRANSPORT_MODES.map(mode => (
            <TouchableOpacity 
              key={mode.id}
              style={[styles.modeCard, form.transportMode === mode.id && styles.activeMode]}
              onPress={() => setForm({...form, transportMode: mode.id})}
            >
              <Text style={styles.modeIcon}>{mode.icon}</Text>
              <Text style={[styles.modeLabel, form.transportMode === mode.id && styles.activeText]}>{mode.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 2. Incoterms Selection */}
        <Text style={styles.sectionTitle}>Shipping Terms (Incoterms)</Text>
        <View style={styles.grid}>
          {INCOTERMS.map(term => (
            <TouchableOpacity 
              key={term.id}
              style={[styles.termCard, form.incoterm === term.id && styles.activeIntl]}
              onPress={() => setForm({...form, incoterm: term.id})}
            >
              <Text style={[styles.termId, form.incoterm === term.id && styles.activeText]}>{term.id}</Text>
              <Text style={[styles.termDesc, form.incoterm === term.id && styles.activeText]}>{term.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 3. HS Code & Volume */}
        <Text style={styles.sectionTitle}>Technical Specs</Text>
        <Input 
          label="HS CODE (Harmonized System)" 
          placeholder="e.g. 0714.90" 
          value={form.hsCode} 
          onChangeText={t => setForm({...form, hsCode: t})} 
        />
        <View style={styles.row}>
          <Input 
            style={{flex: 1}} 
            label="WEIGHT (KG)" 
            keyboardType="numeric" 
            value={form.weight} 
            onChangeText={t => setForm({...form, weight: t})} 
          />
          <Input 
            style={{flex: 1}} 
            label="VOLUME (CBM)" 
            keyboardType="numeric" 
            value={form.volume} 
            onChangeText={t => setForm({...form, volume: t})} 
          />
        </View>

        {/* 4. Container Selection */}
        <Text style={styles.sectionTitle}>Packaging / Container</Text>
        <View style={styles.containerList}>
          {CONTAINER_SIZES.map(size => (
            <TouchableOpacity 
              key={size.id}
              style={[styles.sizeItem, form.containerSize === size.id && styles.activeSize]}
              onPress={() => setForm({...form, containerSize: size.id})}
            >
              <View style={[styles.radio, form.containerSize === size.id && styles.radioActive]} />
              <Text style={[styles.sizeLabel, form.containerSize === size.id && styles.activeSizeText]}>{size.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 5. Cargo Image (Optional) */}
        <Text style={styles.sectionTitle}>Cargo Photo (Optional)</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={triggerImagePicker}>
          {form.cargoImageBase64 ? (
            <Image source={{ uri: form.cargoImageBase64 }} style={styles.preview} />
          ) : (
            <Text style={styles.uploadText}>📸 Tap to upload image for customs</Text>
          )}
        </TouchableOpacity>

        <Button 
          title="Get Export Quote ✨" 
          onPress={onNext} 
          style={styles.nextBtn}
          disabled={!form.hsCode || !form.transportMode || !form.incoterm || !form.weight}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    width: width, 
    flex: 1, 
    backgroundColor: '#ffffff' 
  },
  scrollContent: {
    padding: 25, 
    paddingBottom: 60 
  },
  headerTitle: { fontSize: 24, fontWeight: '900', color: COLORS.slate900, marginBottom: 5 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: COLORS.slate400, marginTop: 25, marginBottom: 12, textTransform: 'uppercase' },
  modeRow: { flexDirection: 'row', gap: 12 },
  modeCard: { flex: 1, backgroundColor: 'white', padding: 20, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9', elevation: 2 },
  activeMode: { backgroundColor: COLORS.international, borderColor: COLORS.international },
  modeIcon: { fontSize: 30, marginBottom: 8 },
  modeLabel: { fontWeight: '800', color: COLORS.slate700 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  termCard: { width: '48%', padding: 15, backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9' },
  activeIntl: { backgroundColor: COLORS.international, borderColor: COLORS.international },
  termId: { fontSize: 16, fontWeight: '900', color: COLORS.slate900 },
  termDesc: { fontSize: 10, color: COLORS.slate500 },
  activeText: { color: 'white' },
  row: { flexDirection: 'row', gap: 12 },
  containerList: { backgroundColor: '#f8fafc', borderRadius: 20, padding: 10 },
  sizeItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 12, marginBottom: 5 },
  activeSize: { backgroundColor: 'white', elevation: 2 },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#cbd5e1', marginRight: 12 },
  radioActive: { borderColor: COLORS.international, backgroundColor: COLORS.international },
  sizeLabel: { fontWeight: '700', color: COLORS.slate600 },
  activeSizeText: { color: COLORS.slate900 },
  uploadBox: { width: '100%', height: 150, backgroundColor: '#f1f5f9', borderRadius: 20, borderStyle: 'dashed', borderWidth: 2, borderColor: '#cbd5e1', justifyContent: 'center', alignItems: 'center', marginTop: 10, overflow: 'hidden' },
  preview: { width: '100%', height: '100%', resizeMode: 'cover' },
  uploadText: { color: COLORS.slate500, fontWeight: '600', fontSize: 13 },
  nextBtn: { marginTop: 40, backgroundColor: COLORS.international }
});