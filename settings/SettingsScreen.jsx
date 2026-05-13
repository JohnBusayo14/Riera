import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  SafeAreaView, Alert, Platform, ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, User, Bell, Sun, HelpCircle, Info, LogOut, ChevronRight } from 'lucide-react-native';
import apiClient from '../services/apiClient'; 
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../context/ThemeContext'; // Import Theme Hook

export default function SettingsScreen({ onBack }) {
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const { logout: GlobalLogout, currentUser: CurrentUser } = useAuth();
  const [IsLoading, setIsLoading] = useState(false);

  // --- PREMIUM NAVY THEME ---
  const theme = {
    bg: isDark ? '#0F172A' : '#F8FAFC',
    card: isDark ? '#1E293B' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#0F172A', // Crisp white text in dark mode
    subtext: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? '#334155' : '#E2E8F0',
    iconBg: isDark ? '#334155' : '#F1F5F9',
    accent: '#106324', 
  };

  const HandleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else if (onBack) {
      onBack();
    } else {
      navigation.navigate('Dashboard');
    }
  };

const HandleLogoutPress = () => {
  Alert.alert(
    "Log Out",
    "Are you sure you want to log out of RieRa? You will be marked as Offline.",
    [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Log Out", 
        style: "destructive", 
        onPress: async () => {
          try {
            setIsLoading(true);
            
            // ✅ 1. Use the specific cleanup endpoint to update the Users table
            // This sets IsOnline = false and IsAvailable = false in the DB
            await apiClient.post('/driver/logout-cleanup');
            
          } catch (error) {
            // Log the error but don't block the UI logout
            console.error("Backend status cleanup failed:", error);
          } finally {
            setIsLoading(false);
            
            // ✅ 2. Clear local tokens and reset navigation
            // This should be the function from App.js that clears AsyncStorage
            GlobalLogout(); 
          }
        } 
      }
    ]
  );
};

  // Fancy Internal Row Component
  const RenderSettingItem = ({ icon: Icon, label, subLabel, onPress, isLast }) => (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={onPress}
      style={[styles.itemRow, !isLast && { borderBottomColor: theme.border, borderBottomWidth: 1 }]}
    >
      <View style={[styles.iconCircle, { backgroundColor: theme.iconBg }]}>
        <Icon color={theme.accent} size={20} />
      </View>
      <View style={styles.itemTextContainer}>
        <Text style={[styles.itemLabel, { color: theme.text }]}>{label}</Text>
        {subLabel && <Text style={[styles.itemSubLabel, { color: theme.subtext }]}>{subLabel}</Text>}
      </View>
      <ChevronRight size={18} color={theme.subtext} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.Container, { backgroundColor: theme.bg }]}>
      <SafeAreaView style={[styles.HeaderWrapper, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={styles.CompactHeader}>
          <TouchableOpacity style={[styles.BackButton, { backgroundColor: theme.iconBg }]} onPress={HandleBack}>
            <ArrowLeft size={22} color={theme.text} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={[styles.HeaderTitle, { color: theme.text }]}>Settings</Text>
          <View style={{ width: 40 }} /> 
        </View>
      </SafeAreaView>
      
      <ScrollView contentContainerStyle={styles.Scroll} showsVerticalScrollIndicator={false}>
        
        <Text style={[styles.SectionTitle, { color: theme.accent }]}>Account</Text>
        <View style={[styles.GlassCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <RenderSettingItem 
            icon={User} 
            label="Account & Profile" 
            subLabel={CurrentUser?.name || "Member"} 
            onPress={() => navigation.navigate('AccountSettings')} 
            isLast
          />
        </View>

        <Text style={[styles.SectionTitle, { color: theme.accent, marginTop: 25 }]}>Preferences</Text>
        <View style={[styles.GlassCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {/* <RenderSettingItem 
            icon={Bell} 
            label="Notification Settings" 
            onPress={() => navigation.navigate('NotificationSettings')} 
          /> */}
          <RenderSettingItem 
            icon={Sun} 
            label="App Experience" 
            onPress={() => navigation.navigate('ExperienceSettings')} 
            isLast
          />
        </View>

        <Text style={[styles.SectionTitle, { color: theme.accent, marginTop: 25 }]}>Support</Text>
        <View style={[styles.GlassCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <RenderSettingItem 
            icon={HelpCircle} 
            label="Support & Help" 
            onPress={() => navigation.navigate('SupportSettings')} 
          />
          <RenderSettingItem 
            icon={Info} 
            label="Legal & App Info" 
            onPress={() => navigation.navigate('LegalSettings')} 
            isLast
          />
        </View>

        <TouchableOpacity 
          style={[
            styles.LogoutBtn, 
            { backgroundColor: isDark ? '#450a0a' : '#fee2e2', borderColor: isDark ? '#7f1d1d' : '#fecaca' },
            IsLoading && { opacity: 0.5 }
          ]} 
          onPress={HandleLogoutPress} 
          disabled={IsLoading}
        >
          {IsLoading ? (
            <ActivityIndicator color="#ef4444" size="small" />
          ) : (
            <>
              <LogOut color="#ef4444" size={20} strokeWidth={2.5} />
              <Text style={styles.LogoutText}>Log Out</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.Footer}>
          <Text style={[styles.FooterText, { color: theme.subtext }]}>RieRa v1.2.0 (Build 44)</Text>
          <Text style={[styles.FooterSubText, { color: theme.subtext }]}>Secure ZAR Agriculture Marketplace</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: { flex: 1 },
  HeaderWrapper: { borderBottomWidth: 1, paddingTop: Platform.OS === 'android' ? 10 : 0 },
  CompactHeader: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  BackButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  HeaderTitle: { fontSize: 18, fontWeight: '900' },
  Scroll: { padding: 20, paddingBottom: 60 },
  SectionTitle: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.5, marginLeft: 5, marginBottom: 10 },
  GlassCard: { borderRadius: 24, borderWidth: 1, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  itemRow: { flexDirection: 'row', alignItems: 'center', padding: 18 },
  iconCircle: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  itemTextContainer: { flex: 1, marginLeft: 15 },
  itemLabel: { fontSize: 16, fontWeight: '700' },
  itemSubLabel: { fontSize: 13, marginTop: 2 },
  LogoutBtn: { padding: 18, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, borderWidth: 1, gap: 10 },
  LogoutText: { color: '#ef4444', fontWeight: '800', fontSize: 16 },
  Footer: { marginTop: 40, alignItems: 'center', opacity: 0.6 },
  FooterText: { fontSize: 12, fontWeight: '700' },
  FooterSubText: { fontSize: 10, fontWeight: '600', marginTop: 4 }
});