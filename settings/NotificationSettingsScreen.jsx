import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS, Icons } from '../constants';
import SettingSection from './components/SettingSection';
import SettingItem from './components/SettingItem';

export default function NotificationSettingsScreen({ onBack }) {
  const navigation = useNavigation();
  const [prefs, setPrefs] = useState({
    push: true,
    sms: false,
    email: true,
    orders: true,
    payments: true,
    system: true,
    marketing: false
  });

  const toggle = (key) => setPrefs(prev => ({ ...prev, [key]: !prev[key] }));

  // Handle back navigation
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {/* COMPACT HEADER: Matching the updated app design */}
      <SafeAreaView style={styles.headerWrapper}>
        <View style={styles.compactHeader}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={22} color="#0f172a" strokeWidth={2.5} />
          </TouchableOpacity>
          <Icons.Text style={styles.headerTitle}>Notifications</Icons.Text>
          <View style={{ width: 40 }} /> 
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <SettingSection title="CHANNELS">
          <SettingItem 
            icon={<Icons.Bell color="#0f172a" />} 
            label="Push Notifications" 
            type="switch" 
            value={prefs.push} 
            onValueChange={() => toggle('push')} 
          />
          <SettingItem 
            icon={<Icons.Message color="#0f172a" />} 
            label="SMS Notifications" 
            type="switch" 
            value={prefs.sms} 
            onValueChange={() => toggle('sms')} 
          />
          <SettingItem 
            icon={<Icons.Info color="#0f172a" />} 
            label="Email Notifications" 
            type="switch" 
            value={prefs.email} 
            onValueChange={() => toggle('email')} 
          />
        </SettingSection>

        <SettingSection title="ALERTS">
          <SettingItem 
            icon={<Icons.Package color="#0f172a" />} 
            label="Order Updates" 
            subLabel="Status changes and arrivals" 
            type="switch" 
            value={prefs.orders} 
            onValueChange={() => toggle('orders')} 
          />
          <SettingItem 
            icon={<Icons.Wallet color="#0f172a" />} 
            label="Payment Alerts" 
            subLabel="Wallet funding and withdrawals" 
            type="switch" 
            value={prefs.payments} 
            onValueChange={() => toggle('payments')} 
          />
          <SettingItem 
            icon={<Icons.Shield color="#0f172a" />} 
            label="System Announcements" 
            type="switch" 
            value={prefs.system} 
            onValueChange={() => toggle('system')} 
          />
        </SettingSection>

        <SettingSection title="PROMOTIONS">
          <SettingItem 
            icon={<Icons.Globe color="#0f172a" />} 
            label="Marketing Messages" 
            subLabel="News and offers" 
            type="switch" 
            value={prefs.marketing} 
            onValueChange={() => toggle('marketing')} 
          />
        </SettingSection>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background || '#f8fafc' },
  headerWrapper: { backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  compactHeader: { 
    height: 50, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 15 
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#0f172a' },
  scroll: { padding: 20 },
});