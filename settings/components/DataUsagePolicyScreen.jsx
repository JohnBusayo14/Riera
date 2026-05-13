import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Database, HardDrive, Share2, BarChart3 } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext'; 

export default function DataUsagePolicyScreen() {
  const navigation = useNavigation();
  const { isDark } = useTheme();

  // --- PREMIUM NAVY THEME CONFIG ---
  const theme = {
    bg: isDark ? '#0F172A' : '#F8FAFC',
    card: isDark ? '#1E293B' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#0F172A', 
    subtext: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? '#334155' : '#E2E8F0',
    iconBg: isDark ? '#334155' : '#F1F5F9',
    accent: '#106324', // AgroMove Green
    statusBarStyle: isDark ? 'light-content' : 'dark-content'
  };

  const DataSection = ({ title, content, icon: IconComponent }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={[styles.smallIconCircle, { backgroundColor: theme.accent + '20' }]}>
          <IconComponent size={18} color={theme.accent} />
        </View>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      </View>
      <View style={[styles.contentCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.contentText, { color: theme.subtext }]}>{content}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.statusBarStyle} />
      
      {/* Header */}
      <SafeAreaView style={[styles.headerWrapper, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.backBtn, { backgroundColor: theme.iconBg }]} 
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={22} color={theme.text} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Data Usage Policy</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Top Icon and Intro */}
        <View style={styles.hero}>
          <View style={[styles.iconCircle, { backgroundColor: theme.card, shadowColor: isDark ? '#000' : '#64748B' }]}>
            <Database size={32} color={theme.accent} />
          </View>
          <Text style={[styles.heroTitle, { color: theme.text }]}>Technical Data & Usage</Text>
          <Text style={[styles.lastUpdated, { color: theme.subtext }]}>Version 1.2 • Feb 2026</Text>
        </View>

        <View style={[styles.introBox, { backgroundColor: isDark ? '#1E293B' : '#0F172A' }]}>
          <Text style={styles.introText}>
            This policy outlines how technical information is utilized to optimize the 
             RieRa Marketplace and ensure the reliability of agricultural trade.
          </Text>
        </View>

        <DataSection 
          icon={BarChart3}
          title="Marketplace Optimization" 
          content="We analyze trading patterns, seasonal crop availability, and pricing trends to provide better market insights. This data is aggregated to help farmers and buyers make informed decisions on supply and demand."
        />

        <DataSection 
          icon={HardDrive}
          title="Offline Resilience" 
          content="RieRa utilizes advanced local caching (AsyncStorage) to store your product catalogs and recent trades. This ensures the marketplace remains accessible for farmers even in areas with unstable rural connectivity."
        />

        <DataSection 
          icon={Share2}
          title="Verification Services" 
          content="We collect device identifiers and hardware specs to prevent fraudulent bot activity and verify marketplace participants. This technical data helps us ensure that every 'Verified Seller' is a legitimate business entity."
        />

        {/* Notice Box */}
        <View style={[styles.noticeBox, { backgroundColor: theme.card, borderLeftColor: theme.accent }]}>
          <Text style={[styles.noticeTitle, { color: theme.text }]}>Supply Chain Transparency</Text>
          <Text style={[styles.noticeText, { color: theme.subtext }]}>
            Location data is utilized during active logistics legs to provide the "Farm-to-Fork" 
            transparency buyers expect. This data is archived once the trade is closed and receipt is confirmed.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerWrapper: { borderBottomWidth: 1 },
  header: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  headerTitle: { fontSize: 18, fontWeight: '900' },
  
  scrollContent: { padding: 20 },
  hero: { alignItems: 'center', marginBottom: 25, marginTop: 10 },
  iconCircle: {
    width: 80, height: 80, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center', marginBottom: 15,
    elevation: 8, shadowOpacity: 0.15, shadowRadius: 12
  },
  heroTitle: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  lastUpdated: { fontSize: 13, fontWeight: '600', marginTop: 5 },
  
  introBox: { padding: 24, borderRadius: 24, marginBottom: 35 },
  introText: { fontSize: 15, color: '#fff', lineHeight: 24, textAlign: 'center', fontWeight: '500', opacity: 0.95 },
  
  section: { marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingLeft: 5 },
  smallIconCircle: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.2 },
  contentCard: { padding: 20, borderRadius: 20, borderWidth: 1 },
  contentText: { fontSize: 15, lineHeight: 22, fontWeight: '500' },
  
  noticeBox: { padding: 22, borderRadius: 24, borderLeftWidth: 6, elevation: 4, shadowOpacity: 0.1, shadowRadius: 10 },
  noticeTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
  noticeText: { fontSize: 14, lineHeight: 22, fontWeight: '500' }
});