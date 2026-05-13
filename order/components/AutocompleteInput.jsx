// AutocompleteInput.jsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard, ScrollView, Platform } from 'react-native';
import { MapPin, X, Loader2, Navigation } from 'lucide-react-native'; 
import { MotiView, AnimatePresence } from 'moti';
import { COLORS } from '../../constants';

export default function AutocompleteInput({ 
  label, 
  value = "", 
  onChangeText, 
  placeholder, 
  isCountry = false,
  onFocusChange,
  flatList = false // NEW PROP: Set to true for a separate table look
}) {
  const [query, setQuery] = useState(value || ""); 
  const [suggestions, setSuggestions] = useState([]);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchTimer = useRef(null);

  useEffect(() => {
    if (value !== query && !showList) setQuery(value || "");
  }, [value]);

  const fetchResults = async (text) => {
    if (!text || text?.length < 3) {
      setSuggestions([]);
      setShowList(false);
      return;
    }
    setLoading(true);
    try {
      const baseUrl = 'https://nominatim.openstreetmap.org/search';
      const params = new URLSearchParams({
        format: 'json', q: text, addressdetails: '1', limit: '6',
        'accept-language': 'en', countrycodes: 'za' 
      });
      if (isCountry) params.delete('countrycodes');

      const response = await fetch(`${baseUrl}?${params.toString()}`, {
        headers: { 'User-Agent': 'RieRa-Logistics' }
      });
      const results = await response.json();
      
      if (Array.isArray(results)) {
        const formatted = results.map(item => ({
          display: item.display_name,
          name: item.name || item.display_name.split(',')[0],
          sub: item.display_name.split(',').slice(1, 4).map(s => s.trim()).join(', '),
        }));
        setSuggestions(formatted);
        setShowList(formatted.length > 0);
      }
    } catch (err) { console.error("Search Error:", err); } 
    finally { setLoading(false); }
  };

  const handleSelect = (item) => {
    setQuery(item.display);
    onChangeText?.(item.display);
    setShowList(false);
    onFocusChange?.(false);
    Keyboard.dismiss();
  };

  return (
    <View style={[styles.container, !flatList && { zIndex: showList ? 999999 : 10 }]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[styles.inputWrapper, showList && styles.inputWrapperActive]}>
        <View style={styles.iconContainer}>
          {loading ? <Loader2 size={20} color={COLORS.primary} /> : <Navigation size={20} color={showList ? COLORS.primary : "#94A3B8"} />}
        </View>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            if (searchTimer.current) clearTimeout(searchTimer.current);
            searchTimer.current = setTimeout(() => fetchResults(text), 400);
          }}
          onFocus={() => { onFocusChange?.(true); if (query.length >= 3) setShowList(true); }}
          onBlur={() => setTimeout(() => { setShowList(false); onFocusChange?.(false); }, 500)}
          placeholderTextColor="#94A3B8"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); onChangeText?.(''); setShowList(false); }}>
            <X size={20} color="#CBD5E1" strokeWidth={2.5} />
          </TouchableOpacity>
        )}
      </View>
      
      <AnimatePresence>
        {showList && suggestions.length > 0 && (
          <MotiView 
            from={{ opacity: 0, translateY: flatList ? 10 : 15 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: 10 }}
            style={[styles.listContainer, flatList && styles.flatListStyle]}
          >
            <ScrollView keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false} bounces={false}>
              {suggestions.map((item, index) => (
                <TouchableOpacity key={index} style={[styles.listItem, index === suggestions.length - 1 && { borderBottomWidth: 0 }]} onPress={() => handleSelect(item)}>
                  <View style={styles.listIconContainer}><MapPin size={18} color={COLORS.primary} /></View>
                  <View style={styles.listTextContainer}>
                    <Text style={styles.listTextMain}>{item.name}</Text>
                    <Text style={styles.listTextSub} numberOfLines={1}>{item.sub}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', position: 'relative', marginBottom: 10 },
  label: { fontSize: 12, fontWeight: '800', color: '#475569', marginBottom: 10 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1.5, borderColor: '#E2E8F0', paddingHorizontal: 16, height: 60 },
  inputWrapperActive: { borderColor: COLORS.primary, elevation: 3 },
  input: { flex: 1, fontSize: 16, fontWeight: '600', color: '#1E293B' },
  iconContainer: { marginRight: 12 },
  listContainer: { 
    position: 'absolute', top: 75, left: 0, right: 0, 
    backgroundColor: '#FFFFFF', borderRadius: 16, elevation: 10, 
    shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.15, shadowRadius: 20,
    maxHeight: 320, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden',
  },
  flatListStyle: {
    position: 'relative', // Becomes a normal table
    top: 15, // Gap from input
    elevation: 0, 
    shadowOpacity: 0,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  listIconContainer: { width: 38, height: 38, backgroundColor: '#F0F9FF', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  listTextContainer: { flex: 1 },
  listTextMain: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  listTextSub: { fontSize: 12, fontWeight: '500', color: '#64748B', marginTop: 2 }
});