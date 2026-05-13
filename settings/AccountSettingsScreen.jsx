import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, ActivityIndicator, LayoutAnimation, Platform, UIManager,
  StatusBar, SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { 
  User, Mail, Phone, ShieldCheck, Trash2, Camera, 
  ChevronRight, Save, ArrowLeft, Lock, Eye, EyeOff, Moon, Sun, AlertCircle 
} from 'lucide-react-native';

import SafeImage from '../components/SafeImage';
import { useTheme } from '../context/ThemeContext';
import apiClient from '../services/apiClient';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { isDark } = useTheme();

  // --- THEME CONFIG ---
  const theme = {
    bg: isDark ? '#0F172A' : '#F8FAFC',
    card: isDark ? '#1E293B' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#0F172A',
    subtext: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? '#334155' : '#E2E8F0',
    iconBg: isDark ? '#334155' : '#F1F5F9',
    accent: '#106324',
    error: '#ef4444', // Added for professional error state
    statusBarStyle: isDark ? 'light-content' : 'dark-content'
  };

  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  
  const [user, setUser] = useState({ name: '', email: '', phone: '', role: '', profilePicture: null });
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [passwordErrors, setPasswordErrors] = useState([]); // Array to store multiple validation errors
  const [secureText, setSecureText] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await apiClient.get('/auth/profile');
      setUser(response.data);
      setFormData({ name: response.data.name, email: response.data.email, phone: response.data.phone });
    } catch (error) {
      Alert.alert("Error", "Could not load profile");
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---
  const handleUpdate = async () => {
    setSaving(true);
    try {
      await apiClient.put('/auth/profile', formData);
      setUser({ ...user, ...formData });
      setIsEditing(false);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      Alert.alert("Update Failed", error.response?.data?.message || "Check your network connection");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    // Reset errors at start of attempt
    setPasswordErrors([]);
    
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      return Alert.alert("Error", "Please fill in all password fields");
    }
    if (passwords.new !== passwords.confirm) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setPasswordErrors(["Confirmation password does not match"]);
      return;
    }

    setUpdatingPassword(true);
    try {
      await apiClient.post('/auth/change-password', {
        oldPassword: passwords.current,
        newPassword: passwords.new,
        confirmNewPassword: passwords.confirm
      });

      Alert.alert("Success", "Password updated successfully");
      setPasswords({ current: '', new: '', confirm: '' });
      setShowPasswordSection(false);
    } catch (error) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      if (error.response && error.response.status === 400) {
        const serverData = error.response.data;
        // Capture the "errors" array from your .NET backend
        if (serverData.errors && Array.isArray(serverData.errors)) {
          setPasswordErrors(serverData.errors);
        } else {
          setPasswordErrors([serverData.message || "Password validation failed"]);
        }
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action is permanent and cannot be undone. All your data will be removed.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete My Account", 
          style: "destructive", 
          onPress: async () => {
            try {
              await apiClient.delete('/auth/profile');
              Alert.alert("Account Deleted", "We're sorry to see you go.");
            } catch (err) {
              Alert.alert("Error", "Could not delete account.");
            }
          } 
        }
      ]
    );
  };

  if (loading) return (
    <View style={[styles.centered, { backgroundColor: theme.bg }]}>
      <ActivityIndicator size="large" color={theme.accent} />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.statusBarStyle} />
      
      <SafeAreaView style={[styles.headerWrapper, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={styles.compactHeader}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.iconBg }]} 
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={22} color={theme.text} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Account & Profile</Text>
          <View style={styles.themeIcon}>
             {isDark ? <Moon size={20} color={theme.accent} /> : <Sun size={20} color="#f59e0b" />}
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* AVATAR HEADER SECTION */}
        <View style={[styles.headerCard, { backgroundColor: theme.card }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { borderColor: theme.bg, backgroundColor: theme.accent }]}>
               <Text style={styles.avatarText}>{user.name?.charAt(0).toUpperCase()}</Text>
               <SafeImage 
                  uri={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}&background=106324&color=fff`} 
                  style={StyleSheet.absoluteFill} 
               />
            </View>
            <TouchableOpacity style={[styles.cameraBtn, { borderColor: theme.card, backgroundColor: theme.accent }]}>
              <Camera size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.userName, { color: theme.text }]}>{user.name || "User Name"}</Text>
          <View style={[styles.roleBadge, { backgroundColor: theme.iconBg }]}>
            <ShieldCheck size={14} color={theme.accent} />
            <Text style={[styles.roleText, { color: theme.subtext }]}>{user.role || "Member"}</Text>
          </View>
        </View>

        {/* PERSONAL INFO SECTION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.accent }]}>Personal Information</Text>
            <TouchableOpacity onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
              setIsEditing(!isEditing);
            }}>
              <Text style={[styles.editBtnText, { color: theme.accent }]}>{isEditing ? "Cancel" : "Edit"}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.fancyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <InfoRow theme={theme} icon={User} label="Full Name" value={formData.name} editing={isEditing} onChange={(val) => setFormData({...formData, name: val})} />
            <InfoRow theme={theme} icon={Mail} label="Email Address" value={formData.email} editing={isEditing} onChange={(val) => setFormData({...formData, email: val})} />
            <InfoRow theme={theme} icon={Phone} label="Phone Number" value={formData.phone} editing={isEditing} onChange={(val) => setFormData({...formData, phone: val})} last />
          </View>
        </View>

        {isEditing && (
          <TouchableOpacity 
            style={[styles.saveBtn, { backgroundColor: theme.accent, opacity: saving ? 0.8 : 1 }]} 
            onPress={handleUpdate} 
            disabled={saving}
          >
            {saving ? <ActivityIndicator color="#fff" /> : <><Save size={20} color="#fff" /><Text style={styles.saveBtnText}>Save Changes</Text></>}
          </TouchableOpacity>
        )}

        {/* SECURITY SECTION */}
        <View style={styles.section}>
          <TouchableOpacity 
            activeOpacity={0.8}
            style={[styles.passwordHeader, { backgroundColor: theme.card, borderColor: theme.border }]} 
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setShowPasswordSection(!showPasswordSection);
              setPasswordErrors([]); // Clear errors when toggling
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.smallIconCircle, { backgroundColor: theme.iconBg }]}>
                   <Lock size={16} color={theme.accent} />
                </View>
                <Text style={[styles.sectionTitle, { color: theme.text, marginLeft: 10 }]}>Security & Password</Text>
            </View>
            <ChevronRight size={20} color={theme.subtext} style={{ transform: [{ rotate: showPasswordSection ? '90deg' : '0deg' }] }} />
          </TouchableOpacity>

          {showPasswordSection && (
            <View style={[styles.fancyCard, { backgroundColor: theme.card, borderColor: theme.border, marginTop: 10 }]}>
               <PasswordInput 
                  theme={theme} 
                  label="Current Password" 
                  value={passwords.current} 
                  onChange={(v) => setPasswords({...passwords, current: v})} 
                  secure={secureText} 
                  toggleSecure={() => setSecureText(!secureText)} 
                />
               
               <PasswordInput 
                  theme={theme} 
                  label="New Password" 
                  value={passwords.new} 
                  onChange={(v) => setPasswords({...passwords, new: v})} 
                  secure={secureText} 
                  errors={passwordErrors} // Pass the backend errors here
                />
               
               <PasswordInput 
                  theme={theme} 
                  label="Confirm New Password" 
                  value={passwords.confirm} 
                  onChange={(v) => setPasswords({...passwords, confirm: v})} 
                  secure={secureText} 
                  last 
                />
               
               <TouchableOpacity 
                 style={[styles.updatePasswordBtn, { backgroundColor: theme.accent, opacity: updatingPassword ? 0.7 : 1 }]} 
                 onPress={handlePasswordUpdate}
                 disabled={updatingPassword}
               >
                 {updatingPassword ? (
                    <ActivityIndicator color="#fff" size="small" />
                 ) : (
                    <Text style={styles.updatePasswordText}>Update Password</Text>
                 )}
               </TouchableOpacity>
            </View>
          )}
        </View>

        {/* DANGER ZONE */}
        <View style={[styles.section, { marginTop: 30 }]}>
          <Text style={[styles.sectionTitle, { color: '#ef4444', marginBottom: 12 }]}>Danger Zone</Text>
          <TouchableOpacity 
            style={[styles.deleteCard, { backgroundColor: isDark ? '#450a0a' : '#fff', borderColor: isDark ? '#7f1d1d' : '#fee2e2' }]} 
            onPress={handleDeleteAccount}
          >
            <View style={[styles.deleteIconBox, { backgroundColor: isDark ? '#7f1d1d' : '#fef2f2' }]}><Trash2 size={20} color="#ef4444" /></View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={[styles.deleteTitle, { color: isDark ? '#FFFFFF' : '#991b1b' }]}>Delete Account</Text>
              <Text style={[styles.deleteSub, { color: isDark ? '#fecaca' : '#ef4444' }]}>Permanently remove all data</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// --- FANCY SUB-COMPONENTS ---
const InfoRow = ({ theme, icon: Icon, label, value, editing, onChange, last }) => (
  <View style={[styles.infoRow, { borderBottomColor: theme.border }, last && { borderBottomWidth: 0 }]}>
    <View style={[styles.iconBox, { backgroundColor: theme.iconBg }]}>
        <Icon size={18} color={theme.accent} />
    </View>
    <View style={{ flex: 1, marginLeft: 15 }}>
      <Text style={[styles.infoLabel, { color: theme.subtext }]}>{label}</Text>
      {editing ? (
        <TextInput 
           style={[styles.infoInput, { color: theme.accent }]} 
           value={value} 
           onChangeText={onChange} 
           placeholderTextColor={theme.subtext} 
        />
      ) : (
        <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
      )}
    </View>
  </View>
);

const PasswordInput = ({ theme, label, value, onChange, secure, toggleSecure, last, errors }) => {
    const hasError = errors && errors.length > 0;

    return (
        <View style={[styles.passInputRow, { borderBottomColor: theme.border }, last && { borderBottomWidth: 0 }]}>
            <Text style={[styles.passLabel, { color: hasError ? theme.error : theme.subtext }]}>{label}</Text>
            <View style={[styles.passInputWrapper, hasError && styles.errorBorder]}>
                <TextInput 
                    style={[styles.passInput, { color: theme.text }]} 
                    value={value} 
                    onChangeText={onChange} 
                    secureTextEntry={secure} 
                    placeholder="••••••••"
                    placeholderTextColor={theme.subtext}
                />
                {toggleSecure && (
                    <TouchableOpacity onPress={toggleSecure}>
                        {secure ? <EyeOff size={18} color={theme.subtext} /> : <Eye size={18} color={theme.accent} />}
                    </TouchableOpacity>
                )}
            </View>

            {/* ERROR MESSAGES LIST */}
            {hasError && (
                <View style={styles.errorContainer}>
                    {errors.map((err, index) => (
                        <View key={index} style={styles.errorRow}>
                            <AlertCircle size={12} color={theme.error} />
                            <Text style={[styles.errorText, { color: theme.error }]}>{err}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerWrapper: { borderBottomWidth: 1 },
  compactHeader: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  headerTitle: { fontSize: 18, fontWeight: '900' },
  themeIcon: { width: 40, alignItems: 'center' },
  headerCard: { alignItems: 'center', paddingVertical: 35, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  avatarContainer: { marginBottom: 15 },
  avatar: { width: 110, height: 110, borderRadius: 55, justifyContent: 'center', alignItems: 'center', borderWidth: 4, overflow: 'hidden' },
  avatarText: { fontSize: 44, fontWeight: 'bold', color: '#fff' },
  cameraBtn: { position: 'absolute', bottom: 0, right: 5, padding: 10, borderRadius: 20, borderWidth: 3, zIndex: 10 },
  userName: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
  roleBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginTop: 10 },
  roleText: { marginLeft: 6, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  section: { paddingHorizontal: 20, marginTop: 25 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.2 },
  editBtnText: { fontWeight: '800', fontSize: 14 },
  fancyCard: { borderRadius: 24, borderWidth: 1, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 18, borderBottomWidth: 1 },
  iconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  infoLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue: { fontSize: 16, fontWeight: '700', marginTop: 3 },
  infoInput: { fontSize: 16, fontWeight: '800', padding: 0, marginTop: 3 },
  saveBtn: { margin: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 18, borderRadius: 24, elevation: 4 },
  saveBtnText: { color: '#fff', fontWeight: '900', fontSize: 16, marginLeft: 10 },
  passwordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderRadius: 24, borderWidth: 1 },
  smallIconCircle: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  passInputRow: { padding: 18, borderBottomWidth: 1 },
  passLabel: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', marginBottom: 8 },
  passInputWrapper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  passInput: { flex: 1, fontSize: 16, fontWeight: '700', padding: 0 },
  updatePasswordBtn: { borderRadius: 16, padding: 16, alignItems: 'center', margin: 15 },
  updatePasswordText: { color: '#fff', fontWeight: '900', fontSize: 14 },
  deleteCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 24, borderWidth: 1 },
  deleteIconBox: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  deleteTitle: { fontSize: 17, fontWeight: '800' },
  deleteSub: { fontSize: 13, marginTop: 2 },

  // PROFESSIONAL ERROR STYLES
  errorContainer: { marginTop: 12, gap: 6 },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  errorText: { fontSize: 12, fontWeight: '600', flex: 1 },
  errorBorder: { borderBottomWidth: 1.5, borderBottomColor: '#ef4444', paddingBottom: 4 }
});
