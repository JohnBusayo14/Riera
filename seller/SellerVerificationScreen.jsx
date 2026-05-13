
import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  TextInput, Alert, SafeAreaView, Platform, Image, StatusBar,
  KeyboardAvoidingView, ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MotiView } from 'moti'; 
import { 
  ArrowLeft, IdCard, User, 
  CheckCircle, ShieldCheck, X, Camera,
  Info, Clock, CheckCircle2, AlertCircle
} from 'lucide-react-native';
import { COLORS } from '../constants';
import Button from '../components/Button';
import apiClient from '../services/apiClient';
import { useTheme } from '../context/ThemeContext';

const FOREST_GREEN = '#059669';

export default function SellerVerificationScreen({ navigation }) {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState('None'); // None, Pending, Approved, Rejected
  const [profileImage, setProfileImage] = useState(null);
  const [idFrontImage, setIdFrontImage] = useState(null);
  const [idBackImage, setIdBackImage] = useState(null);
  const [focusedInput, setFocusedInput] = useState(false);
  
  const [formData, setFormData] = useState({
    idNumber: '', 
    idType: 'Identity Document',
  });

  const UI = {
    Background: isDark ? '#0F172A' : '#F8FAFC',
    Surface: isDark ? '#1E293B' : '#FFFFFF',
    TextPrimary: isDark ? '#F8FAFC' : '#0F172A',
    TextSecondary: isDark ? '#94A3B8' : '#64748B',
    Border: isDark ? '#334155' : '#E2E8F0',
    Accent: FOREST_GREEN,
    InputBg: isDark ? '#161E2E' : '#FFFFFF',
  };

  // Fetch verification status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setStatusLoading(true);
        const response = await apiClient.get('/auth/seller-verification/status');
        setVerificationStatus(response.data.status || 'None');
      } catch (err) {
        console.error("Status fetch error:", err);
        setVerificationStatus('None');
      } finally {
        setStatusLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const pickImage = async (type) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Gallery access is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'profile' ? [1, 1] : [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      if (type === 'profile') setProfileImage(uri);
      else if (type === 'front') setIdFrontImage(uri);
      else if (type === 'back') setIdBackImage(uri);
    }
  };

  const handleSubmit = async () => {
    const needsBackImage = formData.idType !== 'Passport';
    if (!formData.idNumber || !profileImage || !idFrontImage || (needsBackImage && !idBackImage)) {
      Alert.alert("Incomplete", "Please provide your ID number and all required photos.");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();

      data.append('IdType', formData.idType);
      data.append('NinNumber', formData.idNumber);

      const appendFile = (key, uri) => {
        const filename = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        
        data.append(key, {
          uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
          name: filename || 'upload.jpg',
          type: type,
        });
      };

      appendFile('ProfileImage', profileImage); 
      appendFile('IdFrontImage', idFrontImage);
      
      if (needsBackImage && idBackImage) {
        appendFile('IdBackImage', idBackImage);
      }

      const response = await apiClient.post('/auth/seller-verification/submit', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert("Success", "Verification submitted successfully.");
      setVerificationStatus('Pending');
      navigation.goBack();
    } catch (error) {
      console.error("Verification Error:", error.response?.data);
      const serverErrors = error.response?.data?.errors;
      const errorMsg = serverErrors 
        ? Object.values(serverErrors).flat().join('\n')
        : "Submission failed. Please try again.";
      
      Alert.alert("Validation Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = verificationStatus === 'None' || verificationStatus === 'Rejected';

  const UploadBox = ({ label, icon: IconComponent, description, imageUri, onClear, onPress, index }) => (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: 400 + (index * 100) }}
    >
      <TouchableOpacity 
        activeOpacity={canSubmit ? 0.8 : 1}
        style={[
          styles.uploadBox, 
          { backgroundColor: UI.Surface, borderColor: imageUri ? UI.Accent : UI.Border },
          imageUri && { shadowColor: UI.Accent, elevation: 3 },
          !canSubmit && { opacity: 0.6 }
        ]} 
        onPress={canSubmit ? onPress : null}
        disabled={!canSubmit}
      >
        {imageUri ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
            <View style={styles.overlayGradient} />
            {canSubmit && (
              <TouchableOpacity style={styles.clearImgBtn} onPress={onClear}>
                <X color="white" size={16} />
              </TouchableOpacity>
            )}
            <View style={[styles.verifiedBadge, { backgroundColor: UI.Accent }]}>
              <CheckCircle size={14} color="white" />
              <Text style={styles.verifiedText}>Ready</Text>
            </View>
          </View>
        ) : (
          <View style={styles.uploadPlaceholder}>
            <View style={[styles.iconCircle, { backgroundColor: isDark ? '#064e3b40' : '#ecfdf5' }]}>
              <IconComponent color={UI.Accent} size={24} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.uploadLabel, { color: UI.TextPrimary }]}>{label}</Text>
              <Text style={[styles.uploadDesc, { color: UI.TextSecondary }]}>{description}</Text>
            </View>
            <View style={[styles.cameraCircle, { backgroundColor: UI.Background, borderColor: UI.Border }]}>
              <Camera color={UI.TextSecondary} size={16} />
            </View>
          </View>
        )}
      </TouchableOpacity>
    </MotiView>
  );

  if (statusLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: UI.Background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={UI.Accent} />
          <Text style={[styles.loadingText, { color: UI.TextPrimary }]}>Checking verification status...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: UI.Background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={[styles.headerNav, { borderBottomColor: UI.Border, backgroundColor: UI.Surface }]}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: UI.Background }]} onPress={() => navigation.goBack()}>
          <ArrowLeft color={UI.TextPrimary} size={22} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: UI.TextPrimary }]}>Verification</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          
          <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing' }} style={styles.introSection}>
            <View style={[styles.mainIconCircle, { backgroundColor: UI.Accent, shadowColor: UI.Accent }]}>
                <ShieldCheck size={40} color="white" />
            </View>
            <Text style={[styles.title, { color: UI.TextPrimary }]}>Trust & Safety</Text>
            <Text style={[styles.subtitle, { color: UI.TextSecondary }]}>
              As a South African seller, we need to verify your identity to enable your ZAR wallet features.
            </Text>
          </MotiView>

          {/* Status Banner */}
          {verificationStatus !== 'None' && verificationStatus !== 'Rejected' && (
            <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.statusBanner}>
              {verificationStatus === 'Pending' && (
                <>
                  <Clock size={28} color="#f59e0b" />
                  <Text style={[styles.statusTitle, { color: '#f59e0b' }]}>Verification Pending</Text>
                  <Text style={styles.statusDesc}>Your submission is under review. We'll notify you soon.</Text>
                </>
              )}
              {verificationStatus === 'Approved' && (
                <>
                  <CheckCircle2 size={28} color={UI.Accent} />
                  <Text style={[styles.statusTitle, { color: UI.Accent }]}>Verified Seller</Text>
                  <Text style={styles.statusDesc}>Your account is fully verified. Enjoy full features!</Text>
                </>
              )}
            </MotiView>
          )}

          {verificationStatus === 'Rejected' && (
            <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={[styles.statusBanner, { backgroundColor: isDark ? '#7f1d1d30' : '#fee2e2' }]}>
              <AlertCircle size={28} color="#ef4444" />
              <Text style={[styles.statusTitle, { color: '#ef4444' }]}>Verification Rejected</Text>
              <Text style={styles.statusDesc}>Your previous submission was rejected. Please resubmit with correct documents.</Text>
            </MotiView>
          )}

          {/* Form only if canSubmit */}
          {canSubmit ? (
            <>
              <MotiView from={{ opacity: 0, translateX: -20 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 200 }}>
                <View style={styles.section}>
                  <Text style={[styles.inputLabel, { color: UI.TextSecondary }]}>ID Number</Text>
                  <View style={[
                    styles.inputWrapper, 
                    { backgroundColor: UI.InputBg, borderColor: focusedInput ? UI.Accent : UI.Border }
                  ]}>
                    <IdCard size={20} color={focusedInput ? UI.Accent : UI.TextSecondary} style={{ marginRight: 12 }} />
                    <TextInput 
                      style={[styles.input, { color: UI.TextPrimary }]}
                      placeholder="Enter 13-digit ID number"
                      placeholderTextColor={UI.TextSecondary}
                      keyboardType="number-pad"
                      maxLength={13}
                      onFocus={() => setFocusedInput(true)}
                      onBlur={() => setFocusedInput(false)}
                      value={formData.idNumber}
                      onChangeText={(txt) => setFormData({...formData, idNumber: txt})}
                    />
                  </View>
                </View>
              </MotiView>

              <Text style={[styles.sectionTitle, { color: UI.TextPrimary }]}>Document Type</Text>
              <View style={styles.idTypeRow}>
                {['Identity Document', 'Passport', 'Driving License'].map((type) => (
                  <TouchableOpacity 
                    key={type}
                    onPress={() => setFormData({...formData, idType: type})}
                    style={[
                      styles.typeBtn, 
                      { backgroundColor: UI.Surface, borderColor: UI.Border },
                      formData.idType === type && { borderColor: UI.Accent, backgroundColor: isDark ? '#065f4630' : '#f0fdfa' }
                    ]}
                  >
                    <Text style={[
                      styles.typeText, 
                      { color: UI.TextSecondary },
                      formData.idType === type && { color: UI.Accent, fontWeight: '900' }
                    ]}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.sectionTitle, { color: UI.TextPrimary }]}>Required Photos</Text>
              
              <UploadBox index={0} label="Selfie" icon={User} description="Clear face photo" imageUri={profileImage} onPress={() => pickImage('profile')} onClear={() => setProfileImage(null)} />
              <UploadBox index={1} label={`${formData.idType} Front`} icon={IdCard} description="Document front side" imageUri={idFrontImage} onPress={() => pickImage('front')} onClear={() => setIdFrontImage(null)} />
              {formData.idType !== 'Passport' && (
                <UploadBox index={2} label={`${formData.idType} Back`} icon={IdCard} description="Document back side" imageUri={idBackImage} onPress={() => pickImage('back')} onClear={() => setIdBackImage(null)} />
              )}

              <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 800 }} style={[styles.infoBox, { backgroundColor: isDark ? '#0c4a6e30' : '#f0f9ff' }]}>
                <Info size={18} color={isDark ? '#38bdf8' : '#0369a1'} />
                <Text style={[styles.infoText, { color: isDark ? '#bae6fd' : '#0369a1' }]}>
                  Your data is encrypted and used only for verification purposes.
                </Text>
              </MotiView>

              <Button 
                title={verificationStatus === 'Rejected' ? "Resubmit Verification" : "Submit Verification"} 
                onPress={handleSubmit} 
                loading={loading} 
                style={[styles.submitBtn, { backgroundColor: UI.Accent, shadowColor: UI.Accent }]} 
              />
            </>
          ) : (
            <View style={styles.disabledFormMessage}>
              <Text style={[styles.disabledText, { color: UI.TextSecondary }]}>
                {verificationStatus === 'Pending' 
                  ? "Your verification is currently under review. You cannot submit a new request until it's processed." 
                  : "Your account is already verified."}
              </Text>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 20, fontSize: 16, fontWeight: '600' },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
    borderBottomWidth: 1,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  headerTitle: { fontSize: 17, fontWeight: '800', letterSpacing: -0.5 },
  scroll: { padding: 24 },
  introSection: { alignItems: 'center', marginBottom: 30 },
  mainIconCircle: { width: 80, height: 80, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 8 },
  title: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 22, paddingHorizontal: 10 },
  statusBanner: { alignItems: 'center', padding: 24, borderRadius: 24, marginBottom: 30, backgroundColor: '#fffbeb' },
  statusTitle: { fontSize: 20, fontWeight: '900', marginTop: 12 },
  statusDesc: { fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  disabledFormMessage: { alignItems: 'center', padding: 40 },
  disabledText: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  section: { marginBottom: 25 },
  inputLabel: { fontSize: 12, fontWeight: '800', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 16, paddingHorizontal: 16, height: 60 },
  input: { flex: 1, fontSize: 16, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '900', marginBottom: 16, letterSpacing: -0.3 },
  idTypeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 25 },
  typeBtn: { flex: 1, minWidth: '45%', paddingVertical: 14, borderRadius: 14, borderWidth: 1.5, alignItems: 'center' },
  typeText: { fontSize: 13, fontWeight: '700' },
  uploadBox: { borderRadius: 20, marginBottom: 16, borderWidth: 1.5, overflow: 'hidden' },
  uploadPlaceholder: { flexDirection: 'row', alignItems: 'center', padding: 18 },
  imagePreviewContainer: { width: '100%', height: 180, position: 'relative' },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  overlayGradient: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' },
  clearImgBtn: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.5)', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  verifiedBadge: { position: 'absolute', bottom: 12, left: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  verifiedText: { color: 'white', fontSize: 11, fontWeight: '900', marginLeft: 4 },
  iconCircle: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  cameraCircle: { width: 32, height: 32, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  uploadLabel: { fontSize: 15, fontWeight: '800' },
  uploadDesc: { fontSize: 12, marginTop: 2 },
  infoBox: { flexDirection: 'row', gap: 12, padding: 16, borderRadius: 16, marginTop: 10, marginBottom: 20, alignItems: 'center' },
  infoText: { flex: 1, fontSize: 13, fontWeight: '600', lineHeight: 18 },
  submitBtn: { height: 60, borderRadius: 18, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 }
});