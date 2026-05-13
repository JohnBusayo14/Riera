import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  SafeAreaView, StatusBar 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Lock, ShieldCheck, EyeOff } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext'; 

export default function PrivacyPolicyScreen() {
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
    accent: '#106324', // RieRa Green
    statusBarStyle: isDark ? 'light-content' : 'dark-content'
  };

  const PolicySection = ({ title, content }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
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
          <Text style={[styles.headerTitle, { color: theme.text }]}>Privacy Policy</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Top Icon and Intro */}
        <View style={styles.hero}>
          <View style={[styles.iconCircle, { backgroundColor: theme.card, shadowColor: isDark ? '#000' : '#64748B' }]}>
            <Lock size={32} color={theme.accent} />
          </View>
          <Text style={[styles.heroTitle, { color: theme.text }]}>Your Privacy Matters</Text>
          <Text style={[styles.lastUpdated, { color: theme.subtext }]}>Last updated: February 2026</Text>
        </View>

        <View style={[styles.introBox, { backgroundColor: theme.accent + '15', borderColor: theme.accent + '30' }]}>
          <Text style={[styles.introText, { color: isDark ? '#E2E8F0' : '#334155' }]}>
            At RieRa, we protect the data that powers African agriculture. This policy explains how we 
            handle your information across our marketplace, wallet, and logistics network.
          </Text>
        </View>

        {/* Content Sections */}
        <PolicySection 
          title="1. Marketplace Data Collection" 
          content="We collect details necessary for secure trade, including your name, business registration (for sellers), farm location, and product catalogs. We also collect transactional data to ensure safe payment processing in ZAR."
        />

        <PolicySection 
          title="2. Usage of Information" 
          content="Your data allows us to verify marketplace participants, connect buyers with sellers, optimize transport routes for fresh produce, and provide escrow protection through the RieRa Wallet."
        />

        <PolicySection 
          title="3. Transparency & Sharing" 
          content="Buyer contact and delivery details are shared with Sellers and logistics partners only once a trade is confirmed. We never sell your personal agricultural data or trading history to external marketing firms."
        />

        <PolicySection 
          title="4. Financial & Location Security" 
          content="Wallet transactions are secured with bank-grade encryption. Real-time location tracking for produce shipments is only accessible to the parties involved in the specific transaction and is deleted after delivery completion."
        />

        <PolicySection 
          title="5. Data Sovereignty" 
          content="You retain full control over your marketplace profile. You can update your business details, download your trading history, or request account deletion at any time via the Account Settings."
        />

        {/* Bottom Footer */}
        <View style={styles.footer}>
          <EyeOff size={20} color={theme.accent} />
          <Text style={[styles.footerText, { color: theme.subtext }]}>We process your data transparently and securely.</Text>
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerWrapper: { borderBottomWidth: 1 },
  header: {
    height: 60,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  headerTitle: { fontSize: 18, fontWeight: '900' },
  scrollContent: { padding: 20 },
  hero: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  iconCircle: {
    width: 80, height: 80, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center', marginBottom: 15,
    elevation: 8, shadowOpacity: 0.15, shadowRadius: 12
  },
  heroTitle: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
  lastUpdated: { fontSize: 13, fontWeight: '600', marginTop: 5 },
  introBox: { 
    padding: 24, borderRadius: 24, 
    borderWidth: 1, marginBottom: 35 
  },
  introText: { fontSize: 15, lineHeight: 24, textAlign: 'center', fontWeight: '500' },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12, marginLeft: 5 },
  contentCard: { padding: 20, borderRadius: 20, borderWidth: 1 },
  contentText: { fontSize: 15, lineHeight: 24, fontWeight: '500' },
  footer: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
    marginTop: 20, paddingHorizontal: 20 
  },
  footerText: { marginLeft: 10, fontSize: 13, fontWeight: '600', textAlign: 'center' }
});