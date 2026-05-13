import React from 'react';
import { 
  View, Text, StyleSheet, Modal, TouchableOpacity, 
  Platform, TouchableWithoutFeedback 
} from 'react-native';

// Professional context and constants
import { useTheme } from '../../context/ThemeContext';
import { Icons } from '../../constants';

export default function CheckoutTypeModal({ visible, onClose, onSelect }) {
  const { colors: Colors, isDark: IsDark } = useTheme();

  // --- UI THEME MAPPING ---
  const UI_THEME = {
    Background: IsDark ? '#0F172A' : '#FFFFFF',
    Surface: IsDark ? '#1E293B' : '#F8FAFC',
    TextPrimary: IsDark ? '#F8FAFC' : '#0F172A',
    TextSecondary: IsDark ? '#94A3B8' : '#64748B',
    Border: IsDark ? '#334155' : '#E2E8F0',
    Primary: '#008148',
    Overlay: 'rgba(15, 23, 42, 0.85)',
  };

  /**
   * Helper: Handlers selection and automatically closes the modal
   */
  const handleSelection = (type) => {
    onSelect(type); // Pass the value up to the parent
    onClose();      // Immediately hide the modal
  };

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent>
      {/* OUT-PRESS DISMISSAL */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.Overlay, { backgroundColor: UI_THEME.Overlay }]}>
          
          <TouchableWithoutFeedback>
            <View style={[styles.Container, { backgroundColor: UI_THEME.Background }]}>
              <View style={[styles.Handle, { backgroundColor: UI_THEME.Border }]} />
              
              <Text style={[styles.Title, { color: UI_THEME.TextPrimary }]}>Delivery Method</Text>
              <Text style={[styles.Subtitle, { color: UI_THEME.TextSecondary }]}>
                Choose how you would like to receive your South African produce.
              </Text>

              {/* LOCAL OPTION */}
              <TouchableOpacity 
                activeOpacity={0.8}
                style={[styles.Option, { backgroundColor: UI_THEME.Surface, borderColor: UI_THEME.Border }]} 
                onPress={() => handleSelection('local')} // Calls helper
              >
                <View style={[styles.IconBg, { backgroundColor: IsDark ? '#064e3b' : '#f0fdf4' }]}>
                  <Icons.Map size={24} color={IsDark ? '#4ade80' : '#166534'} />
                </View>
                <View style={styles.OptionContent}>
                  <Text style={[styles.OptionTitle, { color: UI_THEME.TextPrimary }]}>Local SA Delivery</Text>
                  <Text style={[styles.OptionDesc, { color: UI_THEME.TextSecondary }]}>Within South African borders</Text>
                </View>
              </TouchableOpacity>

              {/* INTERNATIONAL OPTION */}
              <TouchableOpacity 
                activeOpacity={0.8}
                style={[styles.Option, { backgroundColor: UI_THEME.Surface, borderColor: UI_THEME.Border }]} 
                onPress={() => handleSelection('international')} // Calls helper
              >
                <View style={[styles.IconBg, { backgroundColor: IsDark ? '#1e3a8a' : '#eff6ff' }]}>
                  <Icons.Kitchen size={24} color={IsDark ? '#60a5fa' : '#1d4ed8'} />
                </View>
                <View style={styles.OptionContent}>
                  <Text style={[styles.OptionTitle, { color: UI_THEME.TextPrimary }]}>Global Export</Text>
                  <Text style={[styles.OptionDesc, { color: UI_THEME.TextSecondary }]}>Cross-border shipping from SA</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.CloseBtn} onPress={onClose}>
                <Text style={styles.CloseText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  Overlay: { flex: 1, justifyContent: 'flex-end' },
  Container: { 
    borderTopLeftRadius: 35, 
    borderTopRightRadius: 35, 
    padding: 25,
    paddingBottom: Platform.OS === 'ios' ? 45 : 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20
  },
  Handle: { width: 40, height: 5, alignSelf: 'center', marginBottom: 25, borderRadius: 10 },
  Title: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
  Subtitle: { fontSize: 14, fontWeight: '500', lineHeight: 20, marginTop: 6, marginBottom: 28 },
  Option: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 24, marginBottom: 16, borderWidth: 1.5 },
  IconBg: { width: 54, height: 54, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  OptionContent: { flex: 1 },
  OptionTitle: { fontSize: 17, fontWeight: '800' },
  OptionDesc: { fontSize: 13, fontWeight: '600', marginTop: 2, opacity: 0.8 },
  CloseBtn: { marginTop: 10, padding: 15, alignItems: 'center' },
  CloseText: { color: '#ef4444', fontWeight: '900', fontSize: 16, letterSpacing: 0.5 }
});