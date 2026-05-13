import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  SafeAreaView, StatusBar 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Scale, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext'; 

export default function TermsScreen() {
  const navigation = useNavigation();
  const { isDark } = useTheme();

  const theme = {
    bg: isDark ? '#0F172A' : '#F8FAFC',
    card: isDark ? '#1E293B' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#0F172A',
    subtext: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? '#334155' : '#E2E8F0',
    iconBg: isDark ? '#334155' : '#F1F5F9',
    accent: '#106324', 
    statusBarStyle: isDark ? 'light-content' : 'dark-content'
  };

  const TermSection = ({ title, content }) => (
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
      
      <SafeAreaView style={[styles.headerWrapper, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.backBtn, { backgroundColor: theme.iconBg }]} 
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={22} color={theme.text} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Terms & Conditions</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <View style={[styles.iconCircle, { backgroundColor: theme.card, shadowColor: isDark ? '#000' : '#64748B' }]}>
            <Scale size={32} color={theme.accent} />
          </View>
          <Text style={[styles.heroTitle, { color: theme.text }]}>Marketplace Terms</Text>
          <Text style={[styles.lastUpdated, { color: theme.subtext }]}>Effective: February 2026</Text>
        </View>

        <View style={[styles.introBox, { backgroundColor: theme.accent + '15', borderColor: theme.accent + '30' }]}>
          <Text style={[styles.introText, { color: isDark ? '#E2E8F0' : '#334155' }]}>
            Welcome to the RieRa Marketplace. By trading, selling, or purchasing agricultural goods 
            and services on our platform, you agree to comply with our community standards and 
            transactional protocols.
          </Text>
        </View>

        <TermSection 
          title="1. Marketplace Facilitation" 
          content="RieRa provides a digital marketplace for agricultural produce, livestock, and farm inputs. While we verify sellers, RieRa acts as a facilitator; the legal contract for sale is directly between the Buyer and the Seller."
        />

        <TermSection 
          title="2. Seller Obligations" 
          content="Sellers must provide accurate descriptions, high-quality images, and honest pricing (ZAR). You are responsible for ensuring all produce meets health and safety standards. Misrepresentation of grade or origin may result in account suspension."
        />

        <TermSection 
          title="3. Secure Trading & Escrow" 
          content="To protect our community, payments are held in the RieRa Secure Wallet until the buyer confirms receipt of goods in the agreed condition. We utilize advanced encryption to ensure ZAR transactions remain private and secure."
        />

        <TermSection 
          title="4. Logistics & Delivery" 
          content="Delivery terms are determined at the point of sale. Sellers using RieRa-integrated logistics must adhere to specific packaging guidelines to prevent spoilage. Liability for goods in transit is governed by our integrated carrier agreements."
        />

        <TermSection 
          title="5. Dispute Resolution" 
          content="In the event of quality discrepancies or non-delivery, RieRa provides a mediation service. Claims must be filed within 24 hours of delivery for perishable goods and 72 hours for non-perishable inputs."
        />

        <View style={styles.footer}>
          <ShieldCheck size={20} color={theme.accent} />
          <Text style={[styles.footerText, { color: theme.subtext }]}>Building a transparent and prosperous African agricultural future.</Text>
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
  hero: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  iconCircle: {
    width: 80, height: 80, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center', marginBottom: 15,
    elevation: 8, shadowOpacity: 0.15, shadowRadius: 12
  },
  heroTitle: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
  lastUpdated: { fontSize: 13, fontWeight: '600', marginTop: 5 },
  introBox: { padding: 24, borderRadius: 24, borderWidth: 1, marginBottom: 35 },
  introText: { fontSize: 15, lineHeight: 24, textAlign: 'center', fontWeight: '500' },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12, marginLeft: 5 },
  contentCard: { padding: 20, borderRadius: 20, borderWidth: 1 },
  contentText: { fontSize: 15, lineHeight: 24, fontWeight: '500' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, paddingHorizontal: 20 },
  footerText: { marginLeft: 10, fontSize: 13, fontWeight: '600', textAlign: 'center' }
});