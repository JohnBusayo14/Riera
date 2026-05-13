import React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Shield, Info, Globe, Package, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext'; // Import Theme Hook

export default function LegalSettingsScreen({ 
  onBack, 
  onNavigateToTerms, 
  onNavigateToPrivacy, 
  onNavigateToData, 
  onNavigateToAbout 
}) {
  const navigation = useNavigation();
  const { isDark } = useTheme();

  // --- PREMIUM NAVY THEME CONFIG ---
  const theme = {
    bg: isDark ? '#0F172A' : '#F8FAFC',
    card: isDark ? '#1E293B' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#0F172A', // Forced white in dark mode
    subtext: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? '#334155' : '#E2E8F0',
    iconBg: isDark ? '#334155' : '#F1F5F9',
    accent: '#106324', // AgroMove Green
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else if (onBack) {
      onBack();
    } else {
      navigation.navigate('Dashboard');
    }
  };

  // Fancy Internal Row Component
  const RenderLegalItem = ({ icon: Icon, label, value, onPress, isLast }) => (
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
        {value && <Text style={[styles.itemValue, { color: theme.subtext }]}>{value}</Text>}
      </View>
      {!value && <ChevronRight size={18} color={theme.subtext} />}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <SafeAreaView style={[styles.headerWrapper, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={styles.compactHeader}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.iconBg }]} 
            onPress={handleBack}
          >
            <ArrowLeft size={22} color={theme.text} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Legal & Info</Text>
          <View style={{ width: 40 }} /> 
        </View>
      </SafeAreaView>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        <Text style={[styles.sectionTitle, { color: theme.accent }]}>Policies</Text>
        <View style={[styles.glassCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <RenderLegalItem 
            icon={Shield} 
            label="Terms & Conditions" 
            onPress={onNavigateToTerms || (() => navigation.navigate('Terms'))} 
          />
          <RenderLegalItem 
            icon={Shield} 
            label="Privacy Policy" 
            onPress={onNavigateToPrivacy || (() => navigation.navigate('Privacy'))} 
          />
          <RenderLegalItem 
            icon={Info} 
            label="Data Usage Policy" 
            onPress={onNavigateToData || (() => navigation.navigate('DataUsage'))} 
            isLast
          />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.accent, marginTop: 25 }]}>About</Text>
        <View style={[styles.glassCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <RenderLegalItem 
            icon={Globe} 
            label="About the Company" 
            onPress={onNavigateToAbout || (() => navigation.navigate('About'))} 
          />
          <RenderLegalItem 
            icon={Package} 
            label="App Version" 
            value="v1.2.0 (44)" 
            isLast
          />
        </View>
        
        {/* COPYRIGHT INFORMATION */}
        <View style={styles.copyright}>
          <Text style={[styles.copyText, { color: theme.subtext }]}>© 2026 RieRa Logistics Ltd.</Text>
          <Text style={[styles.copyText, { color: theme.subtext }]}>Lagos, Nigeria</Text>
          
          <View style={[
            styles.statusIndicator, 
            { 
              backgroundColor: isDark ? '#064e3b' : '#f0fdf4', 
              borderColor: isDark ? '#065f46' : '#dcfce7' 
            }
          ]}>
            <View style={styles.dot} />
            <Text style={[
              styles.statusText, 
              { color: isDark ? '#6ee7b7' : '#166534' }
            ]}>Systems Operational</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerWrapper: { borderBottomWidth: 1, paddingTop: Platform.OS === 'android' ? 10 : 0 },
  compactHeader: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  headerTitle: { fontSize: 18, fontWeight: '900' },

  scroll: { padding: 20, paddingBottom: 60 },
  sectionTitle: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.5, marginLeft: 5, marginBottom: 10 },
  glassCard: { borderRadius: 24, borderWidth: 1, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  
  itemRow: { flexDirection: 'row', alignItems: 'center', padding: 18 },
  iconCircle: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  itemTextContainer: { flex: 1, marginLeft: 15 },
  itemLabel: { fontSize: 16, fontWeight: '700' },
  itemValue: { fontSize: 14, fontWeight: '600', marginTop: 2 },

  copyright: { marginTop: 60, alignItems: 'center' },
  copyText: { fontSize: 12, fontWeight: '700', lineHeight: 18 },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    marginRight: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  }
});