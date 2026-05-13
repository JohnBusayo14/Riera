import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Moon,
  Sun,
  Globe,
  Wallet,
  Truck,
  Bell,
  Wifi,
  ChevronRight,
  RotateCcw,
  Leaf,
} from 'lucide-react-native';

// ─── ThemeContext API used: isDark (bool), toggleTheme (fn) ──────────────────
import { useTheme } from '../context/ThemeContext';

// ─── Theme builder ────────────────────────────────────────────────────────────
const buildTheme = (isDark) => ({
  bg:           isDark ? '#0F172A' : '#F1F5F9',
  surface:      isDark ? '#1E293B' : '#FFFFFF',
  card:         isDark ? '#1E293B' : '#FFFFFF',
  cardAlt:      isDark ? '#243347' : '#F8FAFC',
  border:       isDark ? '#334155' : '#E2E8F0',
  textPrimary:  isDark ? '#F8FAFC' : '#0F172A',
  textSecondary:isDark ? '#94A3B8' : '#64748B',
  textMuted:    isDark ? '#64748B' : '#94A3B8',
  iconBg:       isDark ? '#334155' : '#F1F5F9',
  iconColor:    isDark ? '#38BDF8' : '#0F172A',
  primary:      '#10B981',
  primaryLight: '#D1FAE5',
  headerBg:     isDark ? '#0D1B2A' : '#0D2137',
  switchTrackOff: isDark ? '#334155' : '#CBD5E1',
});

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionLabel = ({ label, theme }) => (
  <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>{label}</Text>
);

// ─── Individual Setting Row ───────────────────────────────────────────────────
const SettingRow = ({
  icon: Icon,
  iconColor,
  label,
  sublabel,
  type = 'switch',
  value,
  onValueChange,
  isFirst = false,
  isLast = false,
  theme,
  accentColor,
}) => {
  const resolvedIconColor = iconColor || theme.iconColor;
  const resolvedAccent = accentColor || theme.primary;

  return (
    <View
      style={[
        styles.row,
        { borderBottomColor: theme.border },
        isFirst  && styles.rowFirst,
        isLast   && styles.rowLast,
        !isLast  && { borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      {/* Icon box */}
      <View style={[styles.iconBox, { backgroundColor: resolvedAccent + '18' }]}>
        {Icon && <Icon size={19} color={resolvedAccent} strokeWidth={2.2} />}
      </View>

      {/* Label */}
      <View style={styles.labelBlock}>
        <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>{label}</Text>
        {sublabel ? (
          <Text style={[styles.rowSublabel, { color: theme.textSecondary }]}>{sublabel}</Text>
        ) : null}
      </View>

      {/* Control */}
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: theme.switchTrackOff, true: resolvedAccent }}
          thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
          ios_backgroundColor={theme.switchTrackOff}
        />
      ) : (
        <ChevronRight size={18} color={theme.textMuted} strokeWidth={2} />
      )}
    </View>
  );
};

// ─── Card wrapper ─────────────────────────────────────────────────────────────
const Card = ({ children, theme }) => (
  <View style={[
    styles.card,
    {
      backgroundColor: theme.card,
      borderColor: theme.border,
      shadowColor: theme.headerBg,
    },
  ]}>
    {children}
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ExperienceSettingsScreen() {
  const navigation = useNavigation();

  // ✅ Wire directly to ThemeContext's real API
  const { isDark, toggleTheme } = useTheme();
  const theme = useMemo(() => buildTheme(isDark), [isDark]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.headerBg}
        translucent={false}
      />

      {/* ═══ HEADER ══════════════════════════════════════════════════════════ */}
      <View style={[styles.header, { backgroundColor: theme.headerBg }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBtn}
          activeOpacity={0.75}
        >
          <ArrowLeft size={21} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Leaf size={15} color="#10B981" strokeWidth={2.5} />
          <Text style={styles.headerTitle}>App Experience</Text>
        </View>

        {/* Spacer to balance back button */}
        <View style={{ width: 42 }} />
      </View>

      {/* ═══ SCROLL BODY ════════════════════════════════════════════════════ */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ── LIVE THEME PREVIEW CARD ─────────────────────────────────────── */}
        <View
          style={[
            styles.previewCard,
            {
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderColor: isDark ? '#334155' : '#E2E8F0',
              shadowColor: theme.headerBg,
            },
          ]}
        >
          {/* Left: current mode pill */}
          <View style={styles.previewLeft}>
            <View
              style={[
                styles.modePill,
                { backgroundColor: isDark ? '#0F172A' : '#F1F5F9' },
              ]}
            >
              {isDark
                ? <Moon size={14} color="#38BDF8" strokeWidth={2.5} />
                : <Sun  size={14} color="#F59E0B" strokeWidth={2.5} />
              }
              <Text
                style={[
                  styles.modePillText,
                  { color: isDark ? '#38BDF8' : '#F59E0B' },
                ]}
              >
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
            <Text style={[styles.previewLabel, { color: theme.textSecondary }]}>
              {isDark
                ? 'Easy on the eyes at night'
                : 'Bright & clear for daylight'}
            </Text>
          </View>

          {/* Right: big toggle */}
          <TouchableOpacity
            style={[
              styles.bigToggle,
              { backgroundColor: isDark ? '#0F172A' : '#F1F5F9' },
            ]}
            onPress={toggleTheme}
            activeOpacity={0.8}
          >
            {isDark
              ? <Sun  size={22} color="#F59E0B" strokeWidth={2} />
              : <Moon size={22} color="#38BDF8" strokeWidth={2} />
            }
            <Text
              style={[
                styles.bigToggleText,
                { color: isDark ? '#F59E0B' : '#38BDF8' },
              ]}
            >
              {isDark ? 'Switch to Light' : 'Switch to Dark'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── APPEARANCE SECTION ──────────────────────────────────────────── */}
        <SectionLabel label="Interface Style" theme={theme} />
        <Card theme={theme}>
          <SettingRow
            icon={isDark ? Moon : Sun}
            label="Dark Mode"
            sublabel={isDark ? 'Currently active' : 'Currently inactive'}
            type="switch"
            value={isDark}
            onValueChange={toggleTheme}
            accentColor={isDark ? '#38BDF8' : '#F59E0B'}
            isFirst
            theme={theme}
          />
          <SettingRow
            icon={Globe}
            label="Sync with Device"
            sublabel="Follow system appearance"
            type="switch"
            value={false}
            onValueChange={() => {}}
            accentColor="#8B5CF6"
            isLast
            theme={theme}
          />
        </Card>

        {/* ── TRADE & LOGISTICS ────────────────────────────────────────────── */}
        <SectionLabel label="Trade & Logistics" theme={theme} />
        <Card theme={theme}>
          <SettingRow
            icon={Wallet}
            label="Display Prices in ZAR (R)"
            sublabel="South African Rand"
            type="switch"
            value={true}
            onValueChange={() => {}}
            accentColor="#10B981"
            isFirst
            theme={theme}
          />
          <SettingRow
            icon={Truck}
            label="Live Farm Tracking"
            sublabel="Real-time delivery updates"
            type="switch"
            value={true}
            onValueChange={() => {}}
            accentColor="#3B82F6"
            theme={theme}
          />
          <SettingRow
            icon={Bell}
            label="Market Volatility Alerts"
            sublabel="Price movement notifications"
            type="switch"
            value={true}
            onValueChange={() => {}}
            accentColor="#F59E0B"
            isLast
            theme={theme}
          />
        </Card>

        {/* ── NETWORK ─────────────────────────────────────────────────────── */}
        <SectionLabel label="Network" theme={theme} />
        <Card theme={theme}>
          <SettingRow
            icon={Wifi}
            label="Rural Optimization Mode"
            sublabel="Reduces data usage on slow connections"
            type="switch"
            value={false}
            onValueChange={() => {}}
            accentColor="#06B6D4"
            isFirst
            isLast
            theme={theme}
          />
        </Card>

        {/* ── RESET ───────────────────────────────────────────────────────── */}
        <TouchableOpacity
          style={[styles.resetBtn, { backgroundColor: '#EF444412', borderColor: '#EF444430' }]}
          onPress={toggleTheme}
          activeOpacity={0.75}
        >
          <RotateCcw size={15} color="#EF4444" strokeWidth={2.5} />
          <Text style={styles.resetText}>Restore Factory Experience</Text>
        </TouchableOpacity>

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.4,
  },

  // Scroll
  scroll: {
    padding: 20,
    paddingTop: 22,
  },

  // Live preview card
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 28,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },
  previewLeft: { flex: 1, gap: 8 },
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  modePillText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.2 },
  previewLabel: { fontSize: 12, fontWeight: '600', lineHeight: 17 },
  bigToggle: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 16,
    minWidth: 100,
  },
  bigToggleText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.2, textAlign: 'center' },

  // Section label
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: 10,
    marginLeft: 4,
    marginTop: 4,
  },

  // Card
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  rowFirst: { paddingTop: 16 },
  rowLast:  { paddingBottom: 16 },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelBlock: { flex: 1 },
  rowLabel:    { fontSize: 15, fontWeight: '700', letterSpacing: -0.1, marginBottom: 2 },
  rowSublabel: { fontSize: 12, fontWeight: '500', lineHeight: 16 },

  // Reset
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  resetText: {
    color: '#EF4444',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.3,
  },
});