import React from 'react';
import { 
  View, StyleSheet, ScrollView, Linking, Alert, 
  TouchableOpacity, Text, SafeAreaView, Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext'; 
import { Icons } from '../constants';
import { ArrowLeft, ChevronRight } from 'lucide-react-native'; 

export default function SupportSettingsScreen({ onNavigateToFeedback }) {
  const navigation = useNavigation();
  const { isDark } = useTheme();

  // --- YOUR CUSTOM NAVY THEME ---
  const theme = {
    bg: isDark ? '#0F172A' : '#F8FAFC',
    card: isDark ? '#1E293B' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#0F172A', // Forced pure white for dark mode visibility
    subtext: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? '#334155' : '#E2E8F0',
    accent: '#106324', // AgroMove Green
  };

  const openWhatsApp = () => Linking.openURL("https://wa.me/message/5Y7ISQFRXKLBJ1");
  const openDialer = () => Linking.openURL('tel:063-9272097');

  // Fancy Internal Row Component
  const RenderItem = ({ icon: Icon, label, subLabel, onPress, isLast }) => (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={onPress}
      style={[styles.itemRow, !isLast && { borderBottomColor: theme.border, borderBottomWidth: 1 }]}
    >
      <View style={styles.iconContainer}>
         <View style={[styles.iconCircle, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]}>
            <Icon color={theme.accent} size={20} />
         </View>
      </View>
      <View style={styles.itemTextContainer}>
        <Text style={[styles.itemLabel, { color: theme.text }]}>{label}</Text>
        {subLabel && <Text style={[styles.itemSubLabel, { color: theme.subtext }]}>{subLabel}</Text>}
      </View>
      <ChevronRight size={18} color={theme.subtext} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <SafeAreaView style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={[styles.backBtn, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]} 
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={22} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Support Center</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.sectionTitle, { color: theme.accent }]}>Contact Channels</Text>
        <View style={[styles.glassCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <RenderItem icon={Icons.Message} label="WhatsApp Chat" subLabel="Average response: 5 mins" onPress={openWhatsApp} />
          <RenderItem icon={Icons.Phone} label="Voice Support" subLabel="Available 8am - 6pm" onPress={openDialer} isLast />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.accent, marginTop: 25 }]}>Help & Resources</Text>
        <View style={[styles.glassCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <RenderItem icon={Icons.Help} label="Frequently Asked Questions" onPress={() => navigation.navigate('FAQs')} />
          <RenderItem icon={Icons.Info} label="Submit Feedback" onPress={onNavigateToFeedback} isLast />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.accent, marginTop: 25 }]}>Security</Text>
        <View style={[styles.glassCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <RenderItem icon={Icons.Shield} label="Dispute Resolution" subLabel="Track active tickets" onPress={() => {}} isLast />
        </View>
        
        <View style={styles.footer}>
            <Text style={{ color: theme.subtext, fontSize: 12 }}>RieRa Support v2.0.4</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { borderBottomWidth: 1, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  headerContent: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  scroll: { padding: 20, paddingBottom: 50 },
  sectionTitle: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.5, marginLeft: 5, marginBottom: 10 },
  glassCard: { borderRadius: 24, borderWidth: 1, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 15 },
  itemRow: { flexDirection: 'row', alignItems: 'center', padding: 18 },
  iconCircle: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  itemTextContainer: { flex: 1, marginLeft: 15 },
  itemLabel: { fontSize: 16, fontWeight: '700' },
  itemSubLabel: { fontSize: 13, marginTop: 2 },
  footer: { marginTop: 40, alignItems: 'center', opacity: 0.5 }
});