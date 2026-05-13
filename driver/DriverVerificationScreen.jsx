import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, SafeAreaView, Image, StatusBar,
  KeyboardAvoidingView, ActivityIndicator, Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft, User, Truck, FileCheck, Camera,
  Bike, Car, Package, Upload, X, AlertCircle, ChevronRight, CheckCircle2,
} from 'lucide-react-native';
import { MotiView } from 'moti';
import apiClient from '../services/apiClient';
import { useTheme } from '../context/ThemeContext';

// ─── Theme builder ───────────────────────────────────────────────────────────────
const buildTheme = (isDark) => ({
  bg:           isDark ? '#0B1120' : '#F0F4F8',
  surface:      isDark ? '#141E30' : '#FFFFFF',
  card:         isDark ? '#1C2A3F' : '#FFFFFF',
  border:       isDark ? '#2A3C55' : '#E2EBF4',
  inputBg:      isDark ? '#243347' : '#F7FAFC',
  inputBorder:  isDark ? '#334A66' : '#D4E0EF',
  textPrimary:  isDark ? '#F0F6FF' : '#0D1B2A',
  textSecondary:isDark ? '#8BA4C2' : '#4A6080',
  textMuted:    isDark ? '#4E6A8A' : '#8DA0B8',
  headerTop:    isDark ? '#0D1B2A' : '#0D2137',
  primary:      '#10B981',
  primaryDark:  '#059669',
  white:        '#FFFFFF',
  shadow:       isDark ? '#000' : '#193B5F',
  error:        '#EF4444',
  placeholderColor: isDark ? '#4E6A8A' : '#8DA0B8',
});

// ─── Step configs ────────────────────────────────────────────────────────────────
const STEPS = [
  { icon: User,      label: 'Personal',   subtitle: 'Basic info & photo' },
  { icon: Truck,     label: 'Vehicle',    subtitle: 'Select your ride' },
  { icon: FileCheck, label: 'Documents',  subtitle: 'Upload required docs' },
];

const VEHICLE_OPTIONS = [
  { id: 'Motorbike', label: 'Motorbike',    desc: 'Quick city deliveries',      icon: Bike     },
  { id: 'Sedan',     label: 'Sedan / Car',  desc: 'Small parcels & packages',   icon: Car      },
  { id: 'Bakkie',    label: 'Bakkie / Pickup', desc: 'Up to 1-Ton capacity',    icon: Truck    },
  { id: 'Van',       label: 'Panel Van',    desc: 'Secure medium hauling',       icon: Package  },
  { id: 'Truck_4T',  label: '4-Ton Truck', desc: 'Heavy agricultural loads',    icon: Truck    },
  { id: 'Truck_8T',  label: '8-Ton Truck', desc: 'Bulk industrial transport',   icon: Truck    },
];

// ─── Input Field ─────────────────────────────────────────────────────────────────
const InputField = ({ label, error, theme, ...props }) => (
  <View style={styles.inputWrapper}>
    <Text style={[styles.inputLabel, { color: theme.textMuted }]}>{label}</Text>
    <TextInput
      style={[
        styles.input,
        { backgroundColor: theme.inputBg, borderColor: error ? theme.error : theme.inputBorder, color: theme.textPrimary },
      ]}
      placeholderTextColor={theme.placeholderColor}
      {...props}
    />
    {error && (
      <View style={styles.errorRow}>
        <AlertCircle size={13} color={theme.error} />
        <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
      </View>
    )}
  </View>
);

// ─── Upload Slot ─────────────────────────────────────────────────────────────────
const UploadSlot = ({ label, uri, onPress, onRemove, error, theme }) => (
  <View style={styles.uploadWrapper}>
    <TouchableOpacity
      style={[
        styles.uploadCard,
        {
          backgroundColor: theme.inputBg,
          borderColor: error ? theme.error : (uri ? theme.primary + '60' : theme.border),
        },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {uri ? (
        <View style={styles.previewInner}>
          <Image source={{ uri }} style={styles.previewImage} />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.65)']} style={styles.previewOverlay}>
            <Text style={styles.previewLabel}>{label}</Text>
          </LinearGradient>
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={(e) => { e.stopPropagation(); onRemove(); }}
            activeOpacity={0.7}
          >
            <X size={14} color="#fff" />
          </TouchableOpacity>
          <View style={styles.changeBadge}>
            <Camera size={14} color="#fff" />
          </View>
        </View>
      ) : (
        <View style={styles.uploadEmptyInner}>
          <View style={[styles.uploadIconRing, { backgroundColor: theme.primary + '18' }]}>
            <Upload size={20} color={theme.primary} />
          </View>
          <Text style={[styles.uploadLabel, { color: theme.textPrimary }]}>{label}</Text>
          <Text style={[styles.uploadHint, { color: theme.textMuted }]}>Tap to upload</Text>
        </View>
      )}
    </TouchableOpacity>
    {error && (
      <View style={styles.errorRow}>
        <AlertCircle size={13} color={theme.error} />
        <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
      </View>
    )}
  </View>
);

// ─── Main Screen ─────────────────────────────────────────────────────────────────
export default function DriverVerificationScreen({ navigation }) {
  const { isDark } = useTheme();
  const theme = useMemo(() => buildTheme(isDark), [isDark]);

  const [currentStep,   setCurrentStep]   = useState(1);
  const [isSubmitting,  setIsSubmitting]  = useState(false);
  const [errors,        setErrors]        = useState({});

  const [formData, setFormData] = useState({
    age: '', gender: '', vehicleType: '', address: '',
    profileImage: null,
    documents: { id: null, license: null, residence: null, bankProof: null },
  });

  React.useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need access to your photo library to upload documents.');
      }
    })();
  }, []);

  const pickImage = async (docType) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, quality: 0.8,
        aspect: docType === 'profile' ? [1, 1] : [4, 3],
      });
      if (!result.canceled && result.assets?.length > 0) {
        const uri = result.assets[0].uri;
        if (docType === 'profile') {
          setFormData(p => ({ ...p, profileImage: uri }));
          setErrors(p => { const e = { ...p }; delete e.profileImage; return e; });
        } else {
          setFormData(p => ({ ...p, documents: { ...p.documents, [docType]: uri } }));
          setErrors(p => { const e = { ...p }; delete e[docType]; return e; });
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const removeImage = (docType) => {
    if (docType === 'profile') {
      setFormData(p => ({ ...p, profileImage: null }));
    } else {
      setFormData(p => ({ ...p, documents: { ...p.documents, [docType]: null } }));
    }
  };

  const validateStep = (step) => {
    const e = {};
    if (step === 1) {
      if (!formData.profileImage)                          e.profileImage = 'Profile photo is required';
      if (!formData.age || formData.age.trim() === '')     e.age = 'Age is required';
      else if (parseInt(formData.age) < 18)                e.age = 'Must be at least 18 years old';
      else if (parseInt(formData.age) > 100)               e.age = 'Enter a valid age';
      if (!formData.gender)                                e.gender = 'Please select your gender';
      if (!formData.address || formData.address.length < 10) e.address = 'Enter a complete address';
    }
    if (step === 2) {
      if (!formData.vehicleType) e.vehicleType = 'Please select a vehicle type';
    }
    if (step === 3) {
      if (!formData.documents.id)        e.id = 'Identity document is required';
      if (!formData.documents.license)   e.license = "Driver's license is required";
      if (!formData.documents.residence) e.residence = 'Proof of residence is required';
      if (!formData.documents.bankProof) e.bankProof = 'Bank confirmation letter is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) { setCurrentStep(c => c + 1); setErrors({}); }
      else handleComplete();
    } else {
      Alert.alert('Required Fields', 'Please complete all required fields before continuing.');
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append('Age', formData.age);
      submitData.append('Gender', formData.gender);
      submitData.append('VehicleType', formData.vehicleType);
      submitData.append('Address', formData.address);
      if (formData.profileImage)        submitData.append('ProfileFile',  { uri: formData.profileImage,        type: 'image/jpeg', name: 'profile.jpg' });
      if (formData.documents.id)        submitData.append('IdFile',       { uri: formData.documents.id,        type: 'image/jpeg', name: 'id.jpg' });
      if (formData.documents.license)   submitData.append('LicenseFile',  { uri: formData.documents.license,   type: 'image/jpeg', name: 'license.jpg' });
      if (formData.documents.residence) submitData.append('AddressFile',  { uri: formData.documents.residence, type: 'image/jpeg', name: 'residence.jpg' });
      if (formData.documents.bankProof) submitData.append('BankFile',     { uri: formData.documents.bankProof, type: 'image/jpeg', name: 'bank.jpg' });

      const response = await apiClient.post('/driver/verify', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        Alert.alert('Submitted! 🎉', response.data.message || 'Your documents are under review.', [
          { text: 'Done', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to submit. Please try again.';
      Alert.alert('Submission Failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) { setCurrentStep(c => c - 1); setErrors({}); }
    else {
      Alert.alert('Cancel Verification', 'Are you sure? Your progress will be lost.', [
        { text: 'Keep Going', style: 'cancel' },
        { text: 'Cancel', style: 'destructive', onPress: () => navigation.goBack() },
      ]);
    }
  };

  const StepIcon = STEPS[currentStep - 1].icon;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" />

      {/* ─── Header ─── */}
      <View style={[styles.header, { backgroundColor: theme.headerTop, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={handleBack} style={[styles.navBtn, { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.15)' }]} activeOpacity={0.7}>
          <ArrowLeft size={21} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Driver Verification</Text>
          <Text style={styles.headerStep}>Step {currentStep} of 3</Text>
        </View>

        <View style={{ width: 42 }} />
      </View>

      {/* ─── Step indicator ─── */}
      <View style={[styles.stepBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        {STEPS.map((s, i) => {
          const n = i + 1;
          const done   = n < currentStep;
          const active = n === currentStep;
          return (
            <React.Fragment key={i}>
              <View style={styles.stepItem}>
                <View style={[
                  styles.stepCircle,
                  {
                    backgroundColor: done ? theme.primary : active ? theme.primary + '20' : theme.border,
                    borderColor: done || active ? theme.primary : theme.border,
                    borderWidth: 2,
                  },
                ]}>
                  {done
                    ? <CheckCircle2 size={14} color="#fff" />
                    : <Text style={[styles.stepNum, { color: active ? theme.primary : theme.textMuted }]}>{n}</Text>
                  }
                </View>
                <Text style={[styles.stepLabel, { color: active ? theme.primary : theme.textMuted }]}>
                  {s.label}
                </Text>
              </View>
              {i < STEPS.length - 1 && (
                <View style={[styles.stepLine, { backgroundColor: n < currentStep ? theme.primary : theme.border }]} />
              )}
            </React.Fragment>
          );
        })}
      </View>

      {/* ─── Progress bar ─── */}
      <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
        <MotiView
          animate={{ width: `${(currentStep / 3) * 100}%` }}
          transition={{ type: 'timing', duration: 400 }}
          style={[styles.progressFill, { backgroundColor: theme.primary }]}
        />
      </View>

      {/* ─── Form ─── */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Step header */}
          <MotiView
            key={currentStep}
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 18 }}
            style={styles.stepHeader}
          >
            <View style={[styles.stepHeaderIcon, { backgroundColor: theme.primary + '18' }]}>
              <StepIcon size={26} color={theme.primary} />
            </View>
            <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>
              {STEPS[currentStep - 1].label}
            </Text>
            <Text style={[styles.stepSubtitle, { color: theme.textSecondary }]}>
              {STEPS[currentStep - 1].subtitle}
            </Text>
          </MotiView>

          {/* ── STEP 1: Personal Info ── */}
          {currentStep === 1 && (
            <MotiView key="step1" from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing', duration: 280 }}>
              {/* Profile photo */}
              <View style={styles.photoSection}>
                <TouchableOpacity
                  onPress={() => pickImage('profile')}
                  activeOpacity={0.85}
                  style={styles.photoTouchable}
                >
                  {formData.profileImage ? (
                    <>
                      <Image source={{ uri: formData.profileImage }} style={styles.profilePhoto} />
                      <TouchableOpacity
                        style={styles.removePhotoBtn}
                        onPress={(e) => { e.stopPropagation(); removeImage('profile'); }}
                        activeOpacity={0.7}
                      >
                        <X size={14} color="#fff" />
                      </TouchableOpacity>
                      <View style={styles.changePhotoBtn}>
                        <Camera size={16} color="#fff" />
                      </View>
                    </>
                  ) : (
                    <View style={[styles.photoPlaceholder, {
                      backgroundColor: theme.inputBg,
                      borderColor: errors.profileImage ? theme.error : theme.border,
                    }]}>
                      <Camera size={30} color={theme.primary} />
                      <Text style={[styles.photoPlaceholderText, { color: theme.textMuted }]}>Add Photo</Text>
                    </View>
                  )}
                </TouchableOpacity>
                {errors.profileImage && (
                  <View style={[styles.errorRow, { marginTop: 8 }]}>
                    <AlertCircle size={13} color={theme.error} />
                    <Text style={[styles.errorText, { color: theme.error }]}>{errors.profileImage}</Text>
                  </View>
                )}
              </View>

              <InputField label="Age" placeholder="Your age" value={formData.age}
                onChangeText={t => { setFormData(p => ({ ...p, age: t })); setErrors(p => ({ ...p, age: undefined })); }}
                keyboardType="numeric" maxLength={3} error={errors.age} theme={theme}
              />

              <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { color: theme.textMuted }]}>Gender</Text>
                <View style={styles.chipRow}>
                  {['Male', 'Female'].map(g => (
                    <TouchableOpacity
                      key={g}
                      style={[styles.chip, {
                        backgroundColor: formData.gender === g ? theme.primary : theme.inputBg,
                        borderColor: formData.gender === g ? theme.primary : theme.inputBorder,
                      }]}
                      onPress={() => { setFormData(p => ({ ...p, gender: g })); setErrors(p => ({ ...p, gender: undefined })); }}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.chipText, { color: formData.gender === g ? '#fff' : theme.textSecondary }]}>
                        {g}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.gender && (
                  <View style={styles.errorRow}>
                    <AlertCircle size={13} color={theme.error} />
                    <Text style={[styles.errorText, { color: theme.error }]}>{errors.gender}</Text>
                  </View>
                )}
              </View>

              <InputField label="Home Address" placeholder="Street, Suburb, City, Postal Code"
                value={formData.address}
                onChangeText={t => { setFormData(p => ({ ...p, address: t })); setErrors(p => ({ ...p, address: undefined })); }}
                multiline numberOfLines={3} error={errors.address} theme={theme}
              />
            </MotiView>
          )}

          {/* ── STEP 2: Vehicle ── */}
          {currentStep === 2 && (
            <MotiView key="step2" from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing', duration: 280 }}>
              {VEHICLE_OPTIONS.map((v, i) => {
                const active = formData.vehicleType === v.id;
                return (
                  <MotiView
                    key={v.id}
                    from={{ opacity: 0, translateY: 10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: i * 50, damping: 18 }}
                  >
                    <TouchableOpacity
                      style={[styles.vehicleCard, {
                        backgroundColor: active ? theme.primary + '12' : theme.card,
                        borderColor: active ? theme.primary : theme.border,
                      }]}
                      onPress={() => { setFormData(p => ({ ...p, vehicleType: v.id })); setErrors(p => ({ ...p, vehicleType: undefined })); }}
                      activeOpacity={0.85}
                    >
                      <View style={[styles.vehicleIconBox, {
                        backgroundColor: active ? theme.primary : theme.border + '80',
                      }]}>
                        <v.icon size={22} color={active ? '#fff' : theme.textMuted} />
                      </View>
                      <View style={styles.vehicleInfo}>
                        <Text style={[styles.vehicleLabel, { color: active ? theme.primary : theme.textPrimary }]}>
                          {v.label}
                        </Text>
                        <Text style={[styles.vehicleDesc, { color: theme.textMuted }]}>{v.desc}</Text>
                      </View>
                      {active && <CheckCircle2 size={22} color={theme.primary} />}
                    </TouchableOpacity>
                  </MotiView>
                );
              })}
              {errors.vehicleType && (
                <View style={styles.errorRow}>
                  <AlertCircle size={13} color={theme.error} />
                  <Text style={[styles.errorText, { color: theme.error }]}>{errors.vehicleType}</Text>
                </View>
              )}
            </MotiView>
          )}

          {/* ── STEP 3: Documents ── */}
          {currentStep === 3 && (
            <MotiView key="step3" from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing', duration: 280 }}>
              <UploadSlot label="Identity Document (ID / Passport)" uri={formData.documents.id}
                onPress={() => pickImage('id')} onRemove={() => removeImage('id')} error={errors.id} theme={theme} />
              <UploadSlot label="Valid Driver's License" uri={formData.documents.license}
                onPress={() => pickImage('license')} onRemove={() => removeImage('license')} error={errors.license} theme={theme} />
              <UploadSlot label="Proof of Residence (Utility Bill)" uri={formData.documents.residence}
                onPress={() => pickImage('residence')} onRemove={() => removeImage('residence')} error={errors.residence} theme={theme} />
              <UploadSlot label="Bank Confirmation Letter" uri={formData.documents.bankProof}
                onPress={() => pickImage('bankProof')} onRemove={() => removeImage('bankProof')} error={errors.bankProof} theme={theme} />
            </MotiView>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ─── Footer ─── */}
      <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.primaryBtn, isSubmitting && { opacity: 0.7 }]}
          onPress={handleNext}
          disabled={isSubmitting}
          activeOpacity={0.88}
        >
          <LinearGradient
            colors={[theme.primary, theme.primaryDark]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.primaryBtnGradient}
          >
            {isSubmitting
              ? <ActivityIndicator color="#fff" size="small" />
              : <>
                  <Text style={styles.primaryBtnText}>
                    {currentStep === 3 ? 'Submit for Review' : 'Continue'}
                  </Text>
                  <ChevronRight color="#fff" size={21} />
                </>
            }
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1,
  },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '900', color: '#fff', letterSpacing: -0.4 },
  headerStep:  { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.55)', marginTop: 2 },
  navBtn: {
    width: 42, height: 42, borderRadius: 13,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1,
  },

  // Step bar
  stepBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 14, borderBottomWidth: 1,
  },
  stepItem:   { alignItems: 'center', gap: 4 },
  stepCircle: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  stepNum:    { fontSize: 13, fontWeight: '800' },
  stepLabel:  { fontSize: 11, fontWeight: '700' },
  stepLine:   { flex: 1, height: 2, marginBottom: 18, borderRadius: 1 },

  // Progress
  progressTrack: { height: 4 },
  progressFill:  { height: '100%', borderRadius: 2 },

  scrollContent: { padding: 20, paddingBottom: 130 },

  // Step header
  stepHeader:     { alignItems: 'center', marginBottom: 28 },
  stepHeaderIcon: { width: 64, height: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  stepTitle:      { fontSize: 24, fontWeight: '900', letterSpacing: -0.5, marginBottom: 6 },
  stepSubtitle:   { fontSize: 14, fontWeight: '500', textAlign: 'center' },

  // Photo
  photoSection:  { alignItems: 'center', marginBottom: 24 },
  photoTouchable:{ position: 'relative' },
  profilePhoto:  { width: 130, height: 130, borderRadius: 65 },
  photoPlaceholder: {
    width: 130, height: 130, borderRadius: 65,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderStyle: 'dashed', gap: 6,
  },
  photoPlaceholderText: { fontSize: 13, fontWeight: '700' },
  removePhotoBtn: {
    position: 'absolute', top: 6, left: 6,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center',
  },
  changePhotoBtn: {
    position: 'absolute', bottom: 6, right: 6,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: '#fff',
  },

  // Input
  inputWrapper: { marginBottom: 20 },
  inputLabel:   { fontSize: 11, fontWeight: '800', letterSpacing: 0.6, marginBottom: 8, textTransform: 'uppercase' },
  input: {
    padding: 16, borderRadius: 16, fontSize: 16, borderWidth: 1.5, fontWeight: '600',
  },

  // Chips (gender)
  chipRow: { flexDirection: 'row', gap: 12 },
  chip: {
    flex: 1, paddingVertical: 14, alignItems: 'center',
    borderRadius: 14, borderWidth: 1.5,
  },
  chipText: { fontWeight: '700', fontSize: 15 },

  // Vehicle card
  vehicleCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 16, borderRadius: 18, marginBottom: 12, borderWidth: 1.5,
  },
  vehicleIconBox: { width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  vehicleInfo:    { flex: 1 },
  vehicleLabel:   { fontSize: 16, fontWeight: '800', marginBottom: 3 },
  vehicleDesc:    { fontSize: 13, fontWeight: '500' },

  // Upload slot
  uploadWrapper: { marginBottom: 16 },
  uploadCard:    { height: 120, borderRadius: 18, borderWidth: 2, borderStyle: 'dashed', overflow: 'hidden' },
  uploadEmptyInner: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 6, padding: 16 },
  uploadIconRing: { width: 44, height: 44, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  uploadLabel:    { fontSize: 14, fontWeight: '800', textAlign: 'center' },
  uploadHint:     { fontSize: 12, fontWeight: '600' },
  previewInner:   { flex: 1, position: 'relative' },
  previewImage:   { width: '100%', height: '100%', resizeMode: 'cover' },
  previewOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10 },
  previewLabel:   { color: '#fff', fontSize: 12, fontWeight: '700' },
  removeBtn: {
    position: 'absolute', top: 8, left: 8,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center',
  },
  changeBadge: {
    position: 'absolute', bottom: 8, right: 8,
    backgroundColor: '#10B981', padding: 8, borderRadius: 10,
  },

  // Error
  errorRow:  { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  errorText: { fontSize: 12, fontWeight: '700' },

  // Footer
  footer: {
    padding: 16, paddingBottom: Platform.OS === 'ios' ? 32 : 20,
    borderTopWidth: 1,
    position: 'absolute', bottom: 0, left: 0, right: 0,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1, shadowRadius: 10, elevation: 10,
  },
  primaryBtn: {
    borderRadius: 16, overflow: 'hidden',
    shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 10, elevation: 6,
  },
  primaryBtnGradient: {
    paddingVertical: 18, flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  primaryBtnText: { color: '#fff', fontSize: 17, fontWeight: '900', letterSpacing: -0.3 },
});