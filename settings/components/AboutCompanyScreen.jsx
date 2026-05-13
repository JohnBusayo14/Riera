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
import { ArrowLeft, Globe, Target, Users, Award, Sprout } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext'; 

export default function AboutCompanyScreen() {
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

  const stats = [
    { label: 'Market Trades', value: '25k+', icon: <Globe size={20} color={theme.accent} /> },
    { label: 'Verified Sellers', value: '1.2k+', icon: <Users size={20} color={theme.accent} /> },
    { label: 'Uptime', value: '99.9%', icon: <Award size={20} color={theme.accent} /> },
  ];

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
          <Text style={[styles.headerTitle, { color: theme.text }]}>About Us</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Branding Section */}
        <View style={styles.hero}>
          <View style={[styles.logoSquare, { backgroundColor: theme.accent }]}>
            <Sprout size={40} color="#FFF" />
          </View>
          <Text style={[styles.companyName, { color: theme.text }]}>RieRa</Text>
          <Text style={[styles.tagline, { color: theme.subtext }]}>The Pulse of African Agriculture</Text>
        </View>

        {/* Mission Card */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: theme.accent + '20' }]}>
                <Target size={20} color={theme.accent} />
            </View>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Our Mission</Text>
          </View>
          <Text style={[styles.cardText, { color: theme.subtext }]}>
            To digitize the African agricultural value chain by providing a secure marketplace 
            where farmers can trade directly with buyers. We are building the infrastructure 
            to eliminate waste, stabilize food prices, and empower the next generation of agro-entrepreneurs.
          </Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {stats.map((stat, index) => (
            <View key={index} style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.statIconContainer}>{stat.icon}</View>
              <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: theme.subtext }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Story Section */}
        <View style={styles.storySection}>
          <Text style={[styles.sectionHeading, { color: theme.text }]}>The RieRa Story</Text>
          <View style={[styles.storyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.storyText, { color: theme.subtext }]}>
              RieRa was born from a simple vision: an Africa where no crop goes to waste and no farmer 
              is left behind. {"\n\n"}
              From the bustling markets of Lagos to the fertile fields of the Free State, we realized 
              that technology could bridge the gap between supply and demand. What started as a 
              logistics tool has evolved into a complete ecosystem of trade, trust, and transparency.
              {"\n\n"}
              Today, we are proud to support thousands of farmers, providing the tools they need 
              to scale their businesses and feed the continent.
            </Text>
          </View>
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
  hero: { alignItems: 'center', marginVertical: 30 },
  logoSquare: {
    width: 85, height: 85, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center', marginBottom: 15,
    elevation: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 15
  },
  companyName: { fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  tagline: { fontSize: 14, fontWeight: '600', marginTop: 4 },
  
  card: { padding: 24, borderRadius: 28, borderWidth: 1, marginBottom: 25 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  iconCircle: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontSize: 18, fontWeight: '800', marginLeft: 12 },
  cardText: { fontSize: 15, lineHeight: 24, fontWeight: '500' },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statBox: { 
    flex: 1, paddingVertical: 18, borderRadius: 24, 
    alignItems: 'center', marginHorizontal: 4, borderWidth: 1
  },
  statIconContainer: { marginBottom: 8 },
  statValue: { fontSize: 16, fontWeight: '900' },
  statLabel: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  
  storySection: { marginTop: 5 },
  sectionHeading: { fontSize: 20, fontWeight: '900', marginBottom: 15, paddingLeft: 5 },
  storyCard: { padding: 24, borderRadius: 28, borderWidth: 1 },
  storyText: { fontSize: 15, lineHeight: 26, fontWeight: '500' }
});