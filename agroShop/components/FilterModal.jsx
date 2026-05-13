import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, Modal, TouchableOpacity, 
  TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator
} from 'react-native';
import * as Location from 'expo-location';
import { X, MapPin, Banknote, RotateCcw, Layers, RefreshCw, ChevronRight } from 'lucide-react-native';

import { useTheme } from '../../context/ThemeContext';

export default function FilterModal({ 
  visible, 
  onClose, 
  criteria, 
  setCriteria, 
  categories = [] 
}) {
  const { isDark: IsDark } = useTheme();
  const [isLocating, setIsLocating] = useState(false);

  const UI_THEME = {
    Background: IsDark ? '#0F172A' : '#FFFFFF',
    Surface: IsDark ? '#1E293B' : '#F8FAFC',
    TextPrimary: IsDark ? '#F8FAFC' : '#1E293B',
    TextSecondary: IsDark ? '#94A3B8' : '#64748B',
    Border: IsDark ? '#334155' : '#E2E8F0',
    Primary: '#008148',
    PrimarySoft: IsDark ? '#064E3B' : '#DCFCE7',
    Muted: IsDark ? '#475569' : '#94A3B8',
  };

  // Auto-location when modal opens (only if location is empty)
  useEffect(() => {
    if (visible && !criteria.Location) {
      getAutoLocation();
    }
  }, [visible]);

  const getAutoLocation = async () => {
    setIsLocating(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setIsLocating(false);
        return;
      }

      let position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      let geocode = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });

      if (geocode.length > 0) {
        const place = geocode[0];
        const locationString = place.city || place.region || place.country || '';
        updateField('Location', locationString);
      }
    } catch (err) {
      console.log('Location detection failed:', err);
    } finally {
      setIsLocating(false);
    }
  };

  const updateField = (field, value) => {
    setCriteria(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setCriteria({
      Location: '',
      Category: '',
      MinPrice: '',
      MaxPrice: ''
    });
  };

  const handleApply = () => {
    onClose(); // Changes are live (client-side filtering), just close the modal
  };

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity style={styles.closer} onPress={onClose} activeOpacity={1} />

        <View style={[styles.container, { backgroundColor: UI_THEME.Background }]}>
          <View style={styles.dragHandle} />

          {/* HEADER */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: UI_THEME.TextPrimary }]}>Filter Results</Text>
              <Text style={[styles.subtitle, { color: UI_THEME.TextSecondary }]}>
                Refine your marketplace view
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: UI_THEME.Surface }]}>
              <X size={22} color={UI_THEME.TextPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {/* CATEGORY SECTION */}
            <View style={styles.section}>
              <View style={styles.labelRow}>
                <Layers size={18} color={UI_THEME.Primary} />
                <Text style={[styles.sectionLabel, { color: UI_THEME.TextPrimary }]}>Product Category</Text>
              </View>
              <View style={styles.catGrid}>
                {['', ...categories].map((cat) => {
                  const isActive = criteria.Category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => updateField('Category', cat)}
                      style={[
                        styles.catPill,
                        { 
                          backgroundColor: isActive ? UI_THEME.Primary : UI_THEME.Surface,
                          borderColor: isActive ? UI_THEME.Primary : UI_THEME.Border
                        }
                      ]}
                    >
                      <Text style={[
                        styles.catPillText,
                        { color: isActive ? 'white' : UI_THEME.TextSecondary }
                      ]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* LOCATION SECTION */}
            <View style={styles.section}>
              <View style={styles.labelRow}>
                <MapPin size={18} color={UI_THEME.Primary} />
                <Text style={[styles.sectionLabel, { color: UI_THEME.TextPrimary }]}>Seller Location</Text>
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.fullInput, { color: UI_THEME.TextPrimary, backgroundColor: UI_THEME.Surface, borderColor: UI_THEME.Border }]}
                  placeholder={isLocating ? "Fetching location..." : "State, town or area..."}
                  placeholderTextColor={UI_THEME.Muted}
                  value={criteria.Location}
                  onChangeText={(val) => updateField('Location', val)}
                  editable={!isLocating}
                />
                <View style={styles.inputActions}>
                  {isLocating ? (
                    <ActivityIndicator size="small" color={UI_THEME.Primary} />
                  ) : (
                    <>
                      {criteria.Location?.length > 0 && (
                        <TouchableOpacity 
                          style={styles.actionIcon}
                          onPress={() => updateField('Location', '')}
                        >
                          <X size={14} color={UI_THEME.TextSecondary} />
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity 
                        style={[styles.actionIcon, { backgroundColor: UI_THEME.PrimarySoft }]}
                        onPress={getAutoLocation}
                      >
                        <RefreshCw size={14} color={UI_THEME.Primary} />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
              <Text style={[styles.helperText, { color: UI_THEME.TextSecondary }]}>
                Tap the green icon to use your current location
              </Text>
            </View>

            {/* PRICE RANGE SECTION */}
            <View style={styles.section}>
              <View style={styles.labelRow}>
                <Banknote size={18} color={UI_THEME.Primary} />
                <Text style={[styles.sectionLabel, { color: UI_THEME.TextPrimary }]}>Price Range (R)</Text>
              </View>
              <View style={styles.inputRow}>
                <View style={[styles.priceInputWrapper, { backgroundColor: UI_THEME.Surface, borderColor: UI_THEME.Border }]}>
                  <Text style={[styles.currencyPrefix, { color: UI_THEME.Muted }]}>R</Text>
                  <TextInput
                    style={[styles.priceInput, { color: UI_THEME.TextPrimary }]}
                    placeholder="Min"
                    keyboardType="numeric"
                    value={criteria.MinPrice}
                    onChangeText={(val) => updateField('MinPrice', val)}
                  />
                </View>
                <View style={styles.dash} />
                <View style={[styles.priceInputWrapper, { backgroundColor: UI_THEME.Surface, borderColor: UI_THEME.Border }]}>
                  <Text style={[styles.currencyPrefix, { color: UI_THEME.Muted }]}>R</Text>
                  <TextInput
                    style={[styles.priceInput, { color: UI_THEME.TextPrimary }]}
                    placeholder="Max"
                    keyboardType="numeric"
                    value={criteria.MaxPrice}
                    onChangeText={(val) => updateField('MaxPrice', val)}
                  />
                </View>
              </View>
            </View>

            {/* FOOTER ACTIONS */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                <RotateCcw size={18} color={UI_THEME.TextSecondary} />
                <Text style={[styles.resetText, { color: UI_THEME.TextSecondary }]}>Reset All</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.applyBtn, { backgroundColor: UI_THEME.Primary }]} onPress={handleApply}>
                <Text style={styles.applyText}>Apply Filters</Text>
                <ChevronRight size={20} color="white" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  closer: { flex: 1 },
  container: { 
    borderTopLeftRadius: 35, 
    borderTopRightRadius: 35, 
    paddingHorizontal: 24,
    paddingTop: 12,
    maxHeight: '90%'
  },
  dragHandle: { width: 40, height: 4, backgroundColor: '#CBD5E1', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 24, fontWeight: '900' },
  subtitle: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  closeBtn: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },

  scrollContent: { paddingBottom: 40 },

  section: { marginBottom: 28 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 },
  sectionLabel: { fontSize: 15, fontWeight: '800' },

  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catPill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5 },
  catPillText: { fontWeight: '700', fontSize: 13 },

  inputWrapper: { position: 'relative', justifyContent: 'center' },
  fullInput: { height: 55, borderRadius: 15, paddingHorizontal: 15, paddingRight: 90, fontWeight: '700', borderWidth: 1.5 },
  inputActions: { position: 'absolute', right: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionIcon: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  helperText: { fontSize: 12, marginTop: 8, marginLeft: 4, fontWeight: '600' },

  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  priceInputWrapper: { flex: 1, height: 55, borderRadius: 15, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, borderWidth: 1.5 },
  currencyPrefix: { fontSize: 16, fontWeight: '800', marginRight: 6 },
  priceInput: { flex: 1, fontSize: 15, fontWeight: '700' },
  dash: { width: 16, height: 2, backgroundColor: '#CBD5E1' },

  footer: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 10 },
  resetBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resetText: { fontSize: 15, fontWeight: '800' },
  applyBtn: { flex: 1, height: 60, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  applyText: { fontSize: 16, fontWeight: '900', color: 'white' },
});