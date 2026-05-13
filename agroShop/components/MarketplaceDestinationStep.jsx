import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, Platform, KeyboardAvoidingView, ScrollView, Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MotiView, AnimatePresence } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, MapPin, AlertCircle, Compass, CheckCircle2, 
  Sparkles, Navigation as NavIcon, Target, TrendingUp
} from 'lucide-react-native';

import { useTheme } from '../../context/ThemeContext';
import AutocompleteInput from '../../order/components/AutocompleteInput';
import Button from '../../components/Button';

const { width } = Dimensions.get('window');

// Brand Colors
const COLORS = {
  forestGreen: '#106324',
  darkForest: '#0A4118',
  lightForest: '#1A7A34',
  white: '#FFFFFF',
  black: '#0F172A',
  darkGray: '#1E293B',
  lightGray: '#F8FAFC',
  mediumGray: '#64748B',
  error: '#EF4444',
};

const FadeInUp = (delay = 0) => ({
  from: { opacity: 0, translateY: 20 },
  animate: { opacity: 1, translateY: 0 },
  transition: { type: 'timing', duration: 400, delay },
});

export default function MarketplaceDestinationStep({ Form, setForm, onNext, onBack, onRefreshLocation }) {
  const { isDark: IsDark } = useTheme();
  const Navigation = useNavigation();

  const UI_THEME = useMemo(() => ({
    Background: IsDark ? COLORS.black : COLORS.lightGray,
    Surface: IsDark ? COLORS.darkGray : COLORS.white,
    TextPrimary: IsDark ? COLORS.white : COLORS.black,
    TextSecondary: IsDark ? '#94A3B8' : COLORS.mediumGray,
    Border: IsDark ? '#334155' : '#E2E8F0',
    Primary: COLORS.forestGreen,
    PrimarySoft: IsDark ? COLORS.darkForest : '#ECFDF5',
    Error: COLORS.error,
  }), [IsDark]);

  const [Errors, SetErrors] = useState({});
  const [IsSpinning, SetIsSpinning] = useState(false);

  const CurrentAddress = Form?.dropoff || '';
  const IsFetching = CurrentAddress === 'Fetching location...';

  const HandleGpsPress = () => {
    SetIsSpinning(true);
    onRefreshLocation(); 
    setTimeout(() => SetIsSpinning(false), 2000);
  };

  return (
    <SafeAreaView style={[styles.SafeArea, { backgroundColor: UI_THEME.Background }]}>
      
      {/* AMBIENT BACKGROUND */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <MotiView
          animate={{ 
            translateX: [0, 30, 0], 
            translateY: [0, 20, 0], 
            scale: [1, 1.1, 1] 
          }}
          transition={{ loop: true, duration: 8000, type: 'timing', repeatReverse: true }}
          style={[styles.blob, { 
            top: -50, 
            right: -50, 
            backgroundColor: `${COLORS.forestGreen}08` 
          }]}
        />
        <MotiView
          animate={{ 
            translateX: [0, -20, 0], 
            translateY: [0, 30, 0], 
            scale: [1, 1.15, 1] 
          }}
          transition={{ loop: true, duration: 10000, type: 'timing', repeatReverse: true }}
          style={[styles.blob, { 
            bottom: 100, 
            left: -100, 
            backgroundColor: `${COLORS.forestGreen}05` 
          }]}
        />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        
        {/* ENHANCED HEADER */}
        <MotiView {...FadeInUp(0)} style={styles.Header}>
          <TouchableOpacity 
            onPress={onBack || (() => Navigation.goBack())} 
            style={[styles.BackBtn, { backgroundColor: UI_THEME.Surface, borderColor: UI_THEME.Border }]}
            activeOpacity={0.7}
          >
            <ArrowLeft size={22} color={UI_THEME.TextPrimary} strokeWidth={2.5} />
          </TouchableOpacity>
        
          <View style={styles.StepIndicator}>
            <Text style={[styles.StepText, { color: UI_THEME.TextSecondary }]}>
              STEP 1 OF 3
            </Text>
            <View style={[styles.ProgressTrack, { backgroundColor: IsDark ? COLORS.darkGray : '#E2E8F0' }]}>
              <MotiView 
                from={{ width: '0%' }}
                animate={{ width: '33.3%' }}
                transition={{ type: 'timing', duration: 600 }}
                style={[styles.ProgressBar, { backgroundColor: COLORS.forestGreen }]} 
              />
            </View>
          </View>
          <View style={{ width: 44 }} />
        </MotiView>

        <ScrollView 
          contentContainerStyle={styles.ScrollContainer} 
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          {/* ENHANCED BRANDING */}
          <MotiView {...FadeInUp(100)} style={styles.BrandingSection}>
            <View style={styles.BrandingRow}>
              <View style={styles.IconContainer}>
                <LinearGradient
                  colors={[COLORS.forestGreen, COLORS.darkForest]}
                  style={styles.IconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <MapPin color={COLORS.white} size={32} strokeWidth={2.5} />
                </LinearGradient>
              </View>
              <View style={styles.BrandingText}>
                <View style={styles.OverlineRow}>
                  <Text style={[styles.Overline, { color: COLORS.forestGreen }]}>
                    DELIVERY LOCATION
                  </Text>
                  <Sparkles size={14} color={COLORS.forestGreen} strokeWidth={2.5} />
                </View>
                <Text style={[styles.Title, { color: UI_THEME.TextPrimary }]}>
                  Where to?
                </Text>
              </View>
            </View>
          </MotiView>

          <MotiView {...FadeInUp(200)}>
            <Text style={[styles.Subtitle, { color: UI_THEME.TextSecondary }]}>
              Enter your delivery address below. We'll calculate the best route and shipping cost automatically.
            </Text>
          </MotiView>

          {/* ENHANCED ADDRESS SECTION */}
          <MotiView {...FadeInUp(300)} style={styles.FormArea}>
            <View style={[styles.AddressCard, { backgroundColor: UI_THEME.Surface, borderColor: UI_THEME.Border }]}>
              <View style={styles.CardHeader}>
                <View style={styles.CardHeaderLeft}>
                  <View style={[styles.CardIconCircle, { backgroundColor: UI_THEME.PrimarySoft }]}>
                    <Target size={18} color={COLORS.forestGreen} strokeWidth={2.5} />
                  </View>
                  <Text style={[styles.CardTitle, { color: UI_THEME.TextPrimary }]}>
                    Delivery Address
                  </Text>
                </View>

                {/* GPS BUTTON */}
                <TouchableOpacity
                  style={[styles.GpsButton, { backgroundColor: UI_THEME.PrimarySoft }]}
                  onPress={HandleGpsPress}
                  disabled={IsFetching}
                  activeOpacity={0.7}
                >
                  <MotiView
                    animate={{ rotate: IsSpinning ? '360deg' : '0deg' }}
                    transition={{ loop: IsSpinning, duration: 1200, type: 'timing' }}
                  >
                    <Compass size={20} color={COLORS.forestGreen} strokeWidth={2.5} />
                  </MotiView>
                  <Text style={[styles.GpsText, { color: COLORS.forestGreen }]}>
                    Use GPS
                  </Text>
                </TouchableOpacity>
              </View>

              {/* AUTOCOMPLETE INPUT */}
              <View style={styles.InputWrapper}>
                <AutocompleteInput
                  label=""
                  placeholder="Start typing your address..."
                  value={CurrentAddress}
                  onChangeText={(v) => setForm({ ...Form, dropoff: v })}
                  flatList={true}
                />
              </View>

              {/* ERROR MESSAGE */}
              <AnimatePresence>
                {Errors.destination && (
                  <MotiView 
                    from={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: 'timing', duration: 300 }}
                    style={[styles.ErrorBox, { backgroundColor: `${COLORS.error}10` }]}
                  >
                    <AlertCircle size={16} color={COLORS.error} strokeWidth={2.5} />
                    <Text style={[styles.ErrorMsg, { color: COLORS.error }]}>
                      {Errors.destination}
                    </Text>
                  </MotiView>
                )}
              </AnimatePresence>

              {/* SUCCESS BADGE */}
              <AnimatePresence>
                {CurrentAddress.length > 15 && !IsFetching && (
                  <MotiView 
                    from={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'timing', duration: 300 }}
                    style={[styles.SuccessBadge, { backgroundColor: UI_THEME.PrimarySoft }]}
                  >
                    <CheckCircle2 size={16} color={COLORS.forestGreen} strokeWidth={2.5} />
                    <Text style={[styles.SuccessMsg, { color: COLORS.forestGreen }]}>
                      Address verified
                    </Text>
                  </MotiView>
                )}
              </AnimatePresence>
            </View>

            {/* INFO CARDS */}
            <View style={styles.InfoCardsRow}>
              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 400, delay: 400 }}
                style={{ flex: 1 }}
              >
                <View style={[styles.InfoCard, { backgroundColor: UI_THEME.Surface }]}>
                  <View style={[styles.InfoIconCircle, { backgroundColor: `${COLORS.forestGreen}15` }]}>
                    <TrendingUp size={20} color={COLORS.forestGreen} strokeWidth={2.5} />
                  </View>
                  <Text style={[styles.InfoCardTitle, { color: UI_THEME.TextPrimary }]}>
                    Smart Routing
                  </Text>
                  <Text style={[styles.InfoCardText, { color: UI_THEME.TextSecondary }]}>
                    AI-optimized delivery routes
                  </Text>
                </View>
              </MotiView>

              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 400, delay: 500 }}
                style={{ flex: 1 }}
              >
                <View style={[styles.InfoCard, { backgroundColor: UI_THEME.Surface }]}>
                  <View style={[styles.InfoIconCircle, { backgroundColor: `${COLORS.forestGreen}15` }]}>
                    <Target size={20} color={COLORS.forestGreen} strokeWidth={2.5} />
                  </View>
                  <Text style={[styles.InfoCardTitle, { color: UI_THEME.TextPrimary }]}>
                    Accurate Pricing
                  </Text>
                  <Text style={[styles.InfoCardText, { color: UI_THEME.TextSecondary }]}>
                    Real-time cost calculation
                  </Text>
                </View>
              </MotiView>
            </View>

            {/* TIP CARD */}
            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 600 }}
            >
              <View style={[styles.TipCard, { backgroundColor: UI_THEME.PrimarySoft }]}>
                <View style={styles.TipIconContainer}>
                  <Sparkles size={18} color={COLORS.forestGreen} strokeWidth={2.5} />
                </View>
                <Text style={[styles.TipText, { color: COLORS.forestGreen }]}>
                  <Text style={{ fontWeight: '800' }}>Tip:</Text> Use the GPS button for fastest address entry, or type manually for precise control.
                </Text>
              </View>
            </MotiView>
          </MotiView>
        </ScrollView>

        {/* ENHANCED FOOTER */}
        <MotiView 
          from={{ translateY: 100 }} 
          animate={{ translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 700 }}
          style={[styles.StickyFooter, { backgroundColor: UI_THEME.Surface, borderTopColor: UI_THEME.Border }]}
        >
          <TouchableOpacity
            onPress={onNext}
            disabled={!CurrentAddress.trim() || IsFetching}
            activeOpacity={0.9}
            style={[
              styles.ContinueButton,
              (!CurrentAddress.trim() || IsFetching) && styles.ContinueButtonDisabled
            ]}
          >
            <LinearGradient
              colors={(!CurrentAddress.trim() || IsFetching) 
                ? [COLORS.mediumGray, '#475569'] 
                : [COLORS.forestGreen, COLORS.darkForest]
              }
              style={styles.ContinueGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.ContinueText}>
                {IsFetching ? 'Fetching Location...' : 'Continue to Shipping'}
              </Text>
              {!IsFetching && (
                <ArrowLeft 
                  size={22} 
                  color={COLORS.white} 
                  strokeWidth={2.5} 
                  style={{ transform: [{ rotate: '180deg' }] }}
                />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </MotiView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  SafeArea: { 
    flex: 1,
  },
  blob: { 
    position: 'absolute', 
    width: 300, 
    height: 300, 
    borderRadius: 150,
  },
  
  // Header
  Header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 16,
  },
  BackBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 14, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  StepIndicator: { 
    alignItems: 'center', 
    flex: 1,
  },
  StepText: { 
    fontSize: 11, 
    fontWeight: '900',
    letterSpacing: 1.2, 
    marginBottom: 10,
  },
  ProgressTrack: { 
    width: 120, 
    height: 6, 
    borderRadius: 3, 
    overflow: 'hidden',
  },
  ProgressBar: { 
    height: '100%', 
    borderRadius: 3,
  },
  
  // Content
  ScrollContainer: { 
    padding: 24, 
    paddingBottom: 150,
  },
  BrandingSection: {
    marginBottom: 20,
  },
  BrandingRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 16,
  },
  IconContainer: {
    width: 68,
    height: 68,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: COLORS.forestGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  IconGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  BrandingText: {
    flex: 1,
  },
  OverlineRow: { 
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  Overline: { 
    fontSize: 12, 
    fontWeight: '900', 
    letterSpacing: 1.5,
  },
  Title: { 
    fontSize: 36, 
    fontWeight: '900', 
    letterSpacing: -1,
  },
  Subtitle: { 
    fontSize: 15, 
    lineHeight: 24, 
    fontWeight: '600',
    marginBottom: 32,
  },
  
  // Form Area
  FormArea: { 
    gap: 20,
  },
  AddressCard: {
    borderRadius: 24,
    borderWidth: 2,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  CardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  CardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  CardIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  CardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  GpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  GpsText: {
    fontSize: 13,
    fontWeight: '800',
  },
  InputWrapper: {
    marginBottom: 12,
  },
  ErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  ErrorMsg: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  SuccessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 12,
  },
  SuccessMsg: {
    fontSize: 13,
    fontWeight: '800',
  },

  // Info Cards
  InfoCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  InfoCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  InfoIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  InfoCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  InfoCardText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },

  // Tip Card
  TipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 16,
  },
  TipIconContainer: {
    marginTop: 2,
  },
  TipText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 20,
  },

  // Footer
  StickyFooter: { 
    paddingHorizontal: 24, 
    paddingTop: 20, 
    paddingBottom: Platform.OS === 'ios' ? 34 : 20, 
    borderTopWidth: 1,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  ContinueButton: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: COLORS.forestGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  ContinueButtonDisabled: {
    shadowOpacity: 0.1,
  },
  ContinueGradient: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  ContinueText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});