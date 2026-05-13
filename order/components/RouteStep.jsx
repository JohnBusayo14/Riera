import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ActivityIndicator, 
  TouchableOpacity, SafeAreaView, Platform, Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, MapPin, Globe, AlertCircle } from 'lucide-react-native';
import { COLORS } from '../../constants';
import AutocompleteInput from './AutocompleteInput';
import Button from '../../components/Button';
import apiClient from '../../services/apiClient';

export default function RouteStep({ form, setForm, onNext, onBack, isInternational = false }) {
  const navigation = useNavigation();
  const [activeField, setActiveField] = useState(null); 
  const [hubs, setHubs] = useState([]); 
  const [loadingHubs, setLoadingHubs] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isInternational) {
      loadHubs();
    }
  }, [isInternational]);

  const loadHubs = async () => {
    setLoadingHubs(true);
    try {
      const response = await apiClient.get('/Hub');
      if (response.data && Array.isArray(response.data)) {
        setHubs(response.data);
      }
    } catch (error) {
      console.error("Hub Fetch Error:", error);
      // Fallback for demo/offline purposes
      setHubs([{ id: '1', name: 'RieRa Kano Central Hub', address: 'Kano State' }]);
    } finally {
      setLoadingHubs(false);
    }
  };

  /**
   * Validation Logic
   * Ensures the backend receives meaningful data for distance/price calculations.
   */
  const validateAndProceed = () => {
    let newErrors = {};
    const pickup = form.hub?.trim();
    const destination = isInternational ? form.destination?.trim() : form.dropoff?.trim();

    if (!pickup || pickup.length < 3) {
      newErrors.hub = "Please select a valid pickup location.";
    }

    if (!destination || destination.length < 3) {
      newErrors.destination = "Please enter a specific delivery address.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext(); // Proceed to Contacts step
  };

  // Auto-clear error when user types
  const handleInputChange = (field, value) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
    setForm({ ...form, [field]: value });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={COLORS.slate900} strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
           <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '33.3%' }]} />
           </View>
           <Text style={styles.stepCount}>Step 1 of 3</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.container}>
        <View style={styles.iconHeader}>
           {isInternational ? <Globe color={COLORS.primary} size={32} /> : <MapPin color={COLORS.primary} size={32} />}
        </View>
        
        <Text style={styles.title}>{isInternational ? "Export Route" : "Local Request"}</Text>
        <Text style={styles.subtitle}>
            {isInternational 
                ? "Select a pickup hub and an international destination." 
                : "Enter your pickup location and destination within Nigeria."}
        </Text>
        
        <View style={styles.form}>
          {/* PICKUP */}
          {(activeField === null || activeField === 'hub') && (
            <View>
              <AutocompleteInput 
                label={isInternational ? "PICKUP HUB" : "PICKUP LOCATION"}
                placeholder={isInternational ? "Select AgroMove Hub" : "Enter pickup address"} 
                value={form.hub} 
                data={isInternational ? hubs : null} 
                onChangeText={t => handleInputChange('hub', t)} 
                onFocusChange={(f) => setActiveField(f ? 'hub' : null)}
              />
              {errors.hub && <Text style={styles.errorText}>{errors.hub}</Text>}
            </View>
          )}
          
          {/* DESTINATION */}
          {(activeField === null || activeField === 'dropoff') && (
            <View>
              <AutocompleteInput 
                label={isInternational ? "DESTINATION (GLOBAL)" : "DESTINATION ADDRESS"}
                placeholder={isInternational ? "Search city or country" : "Enter delivery address"} 
                value={isInternational ? form.destination : form.dropoff}
                data={null}
                isCountry={isInternational} 
                onChangeText={t => handleInputChange(isInternational ? 'destination' : 'dropoff', t)}
                onFocusChange={(f) => setActiveField(f ? 'dropoff' : null)}
              />
              {(errors.destination) && (
                <Text style={styles.errorText}>{errors.destination}</Text>
              )}
            </View>
          )}
        </View>

        {activeField === null && (
          <View style={styles.footer}>
            {!form.hub || !(isInternational ? form.destination : form.dropoff) ? (
               <View style={styles.requirementBox}>
                  <AlertCircle size={14} color="#94a3b8" />
                  <Text style={styles.requirementText}>Both locations are required to calculate rates.</Text>
               </View>
            ) : null}

            <Button 
              title="Continue to Contacts" 
              onPress={validateAndProceed} 
              // Button remains disabled if fields are empty
              disabled={!form.hub?.trim() || (isInternational ? !form.destination?.trim() : !form.dropoff?.trim())}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 20 : 10, paddingBottom: 10
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#f8fafc',
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9'
  },
  progressContainer: { flex: 1, alignItems: 'center', paddingHorizontal: 20 },
  progressBar: { width: '100%', height: 4, backgroundColor: '#f1f5f9', borderRadius: 2, marginBottom: 4 },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  stepCount: { fontSize: 10, fontWeight: '800', color: '#94a3b8', letterSpacing: 0.5 },
  container: { padding: 25 },
  iconHeader: { marginBottom: 15 },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.slate900, marginBottom: 8 },
  subtitle: { fontSize: 15, fontWeight: '500', color: '#64748b', marginBottom: 35, lineHeight: 22 },
  form: { gap: 20, minHeight: 250 },
  footer: { marginTop: 40 },
  errorText: { color: '#ef4444', fontSize: 12, fontWeight: '600', marginTop: 5, marginLeft: 5 },
  requirementBox: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 15, justifyContent: 'center' },
  requirementText: { fontSize: 12, color: '#94a3b8', fontWeight: '500' }
});