import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  LayoutAnimation, Platform, UIManager, StatusBar, SafeAreaView,
  Linking, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronDown, HelpCircle, ArrowLeft, MessageCircle } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQ_DATA = [
  { 
    id: 1, 
    question: "How does the Secure Wallet work?", 
    answer: "RieRa uses an escrow system. When you buy produce, your payment is held securely in our vault. Funds are only released to the seller once you confirm the goods have arrived in the promised condition." 
  },
  { 
    id: 2, 
    question: "How do I verify the quality of produce?", 
    answer: "Each listing includes the grade and origin. We recommend reviewing the seller's 'Verified' badge and previous buyer ratings. For large bulk orders, you can request a sample through the integrated chat." 
  },
  { 
    id: 3, 
    question: "What happens if produce arrives spoiled?", 
    answer: "For perishable goods, you must file a dispute within 24 hours of delivery. Take clear photos of the damage. Our mediation team will review the evidence and issue a refund if the seller is at fault." 
  },
  { 
    id: 4, 
    question: "Can I schedule recurring seasonal orders?", 
    answer: "Yes! Many of our commercial buyers use the 'Contract' feature to lock in prices for the upcoming harvest season, ensuring price stability for their kitchens or retail stores." 
  },
  { 
    id: 5, 
    question: "How are transport costs calculated?", 
    answer: "Shipping is calculated based on weight, volume, and the distance between the farm and your delivery point. We pull real-time rates from our integrated logistics partners to give you the lowest possible cost." 
  }
];

export default function FAQScreen() {
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const [expandedId, setExpandedId] = useState(null);

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

  const openWhatsApp = async () => {
    const url = "https://wa.me/message/5Y7ISQFRXKLBJ1";
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Support", "WhatsApp not found. Please contact support@riera.com");
    }
  };

  const toggleAccordion = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

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
          <Text style={[styles.headerTitle, { color: theme.text }]}>Help Center</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={[styles.iconCircle, { backgroundColor: theme.card, shadowColor: isDark ? '#000' : '#64748B' }]}>
            <HelpCircle size={36} color={theme.accent} />
          </View>
          <Text style={[styles.heroTitle, { color: theme.text }]}>How can we help?</Text>
          <Text style={[styles.heroSub, { color: theme.subtext }]}>Explore our marketplace guide and support topics</Text>
        </View>

        <View style={styles.faqList}>
          {FAQ_DATA.map((item) => {
            const isOpen = expandedId === item.id;
            return (
              <View key={item.id} style={[
                styles.card, 
                { backgroundColor: theme.card, borderColor: theme.border },
                isOpen && styles.activeCard
              ]}>
                <TouchableOpacity 
                  style={styles.cardHeader} 
                  onPress={() => toggleAccordion(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.questionText, 
                    { color: isOpen ? theme.text : theme.subtext }
                  ]}>
                    {item.question}
                  </Text>
                  <View style={[styles.chevronCircle, { backgroundColor: isOpen ? theme.accent : theme.iconBg }]}>
                    <ChevronDown 
                        size={18} 
                        color={isOpen ? '#fff' : theme.subtext} 
                        style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
                    />
                  </View>
                </TouchableOpacity>
                
                {isOpen && (
                  <View style={styles.answerContainer}>
                    <Text style={[styles.answerText, { color: theme.subtext }]}>{item.answer}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* WhatsApp Contact Section */}
        <TouchableOpacity 
          style={[styles.supportCard, { backgroundColor: isDark ? '#1E293B' : '#0F172A' }]}
          onPress={openWhatsApp}
          activeOpacity={0.9}
        >
          <View style={[styles.supportIconBg, { backgroundColor: theme.accent }]}>
            <MessageCircle size={22} color="#fff" />
          </View>
          <View style={styles.supportInfo}>
            <Text style={styles.supportTitle}>Direct Marketplace Support</Text>
            <Text style={styles.supportSub}>Connect with our trade agents on WhatsApp</Text>
          </View>
          <View style={[styles.contactBtn, { backgroundColor: theme.accent }]}>
            <Text style={styles.contactBtnText}>Chat</Text>
          </View>
        </TouchableOpacity>
        
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
  heroSection: { alignItems: 'center', marginBottom: 35, marginTop: 10 },
  iconCircle: {
    width: 80, height: 80, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 15, elevation: 8, shadowOpacity: 0.15, shadowRadius: 12
  },
  heroTitle: { fontSize: 24, fontWeight: '900' },
  heroSub: { fontSize: 14, marginTop: 6, textAlign: 'center', fontWeight: '500' },
  
  faqList: { marginBottom: 20 },
  card: { borderRadius: 24, marginBottom: 12, borderWidth: 1, overflow: 'hidden' },
  activeCard: { elevation: 4, shadowOpacity: 0.1, shadowRadius: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  questionText: { fontSize: 15, fontWeight: '800', flex: 1, paddingRight: 10 },
  chevronCircle: { width: 32, height: 32, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  
  answerContainer: { paddingHorizontal: 20, paddingBottom: 22 },
  answerText: { fontSize: 15, lineHeight: 24, fontWeight: '500' },
  
  supportCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 28, marginTop: 10 },
  supportIconBg: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  supportInfo: { flex: 1, marginLeft: 15 },
  supportTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
  supportSub: { color: '#94a3b8', fontSize: 12, marginTop: 2, fontWeight: '500' },
  contactBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12 },
  contactBtnText: { color: '#fff', fontWeight: '900', fontSize: 13, textTransform: 'uppercase' }
});