import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  SafeAreaView, Platform, Keyboard, TouchableWithoutFeedback, 
  KeyboardAvoidingView, ScrollView, Dimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MotiView, AnimatePresence } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, UserCheck, Mail, ShieldCheck, AlertCircle, 
  Sparkles, User, Phone, CheckCircle2
} from 'lucide-react-native'; 

import { useTheme } from '../../context/ThemeContext';
import Input from '../../components/Input';
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

export default function ReceiverStep({ form, setForm, onNext, onBack, isInternational = false }) {
  const { isDark: IsDark } = useTheme();
  const Navigation = useNavigation();

  const UI_THEME = {
    Background: IsDark ? COLORS.black : COLORS.lightGray, 
    Surface: IsDark ? COLORS.darkGray : COLORS.white,
    TextPrimary: IsDark ? COLORS.white : COLORS.black,
    TextSecondary: IsDark ? '#94A3B8' : COLORS.mediumGray,
    Border: IsDark ? '#334155' : '#E2E8F0',
    Primary: COLORS.forestGreen,
    PrimarySoft: IsDark ? COLORS.darkForest : '#ECFDF5',
    Error: COLORS.error,
  };

  const [Errors, SetErrors] = useState({});

  const HandleBack = () => onBack ? onBack() : Navigation.goBack();

  const ValidateForm = () => {
    let NewErrors = {};
    if (!form.receiverName || form.receiverName.trim().split(' ').length < 2) {
      NewErrors.receiverName = "Please enter full name (First & Last).";
    }
    if (!form.receiverPhone || form.receiverPhone.replace(/\D/g, '').length < 10) {
      NewErrors.receiverPhone = "Please enter a valid 10-digit phone number.";
    }
    SetErrors(NewErrors);
    return Object.keys(NewErrors).length === 0;
  };

  const IsFormFilled = () => {
    const Basic = form.receiverName && form.receiverPhone;
    return isInternational ? (Basic && form.receiverEmail && form.receiverAddress) : Basic;
  };

  return (
    <SafeAreaView style={[styles.SafeArea, { backgroundColor: UI_THEME.Background }]}>
      
      {/* DECORATIVE BACKGROUND */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <MotiView 
          from={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.06, scale: 1 }}
          transition={{ type: 'timing', duration: 800 }}
          style={[styles.blob, { 
            top: -100, 
            right: -50, 
            backgroundColor: COLORS.forestGreen 
          }]} 
        />
        <MotiView 
          from={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.04, scale: 1 }}
          transition={{ type: 'timing', duration: 1000, delay: 200 }}
          style={[styles.blob, { 
            bottom: -150, 
            left: -100, 
            backgroundColor: COLORS.forestGreen 
          }]} 
        />
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          
          {/* ENHANCED HEADER */}
          <MotiView {...FadeInUp(0)} style={styles.Header}>
            <TouchableOpacity 
              onPress={HandleBack} 
              style={[styles.BackBtn, { backgroundColor: UI_THEME.Surface, borderColor: UI_THEME.Border }]}
              activeOpacity={0.7}
            >
              <ArrowLeft size={22} color={UI_THEME.TextPrimary} strokeWidth={2.5} />
            </TouchableOpacity>

            <View style={styles.ProgressWrapper}>
              <Text style={[styles.StepTag, { color: COLORS.forestGreen, backgroundColor: UI_THEME.PrimarySoft }]}>
                STEP 2 OF 3
              </Text>
              <View style={[styles.ProgressBar, { backgroundColor: IsDark ? '#334155' : '#E2E8F0' }]}>
                <MotiView 
                  from={{ width: '33%' }} 
                  animate={{ width: '66.6%' }} 
                  transition={{ type: 'timing', duration: 600 }}
                  style={[styles.ProgressFill, { backgroundColor: COLORS.forestGreen }]} 
                />
              </View>
            </View>
            <View style={{ width: 44 }} />
          </MotiView>

          <ScrollView 
            contentContainerStyle={styles.ScrollContent} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* ENHANCED HERO SECTION */}
            <MotiView {...FadeInUp(100)} style={styles.HeroSection}>
              <View style={styles.IconContainer}>
                <LinearGradient
                  colors={[COLORS.forestGreen, COLORS.darkForest]}
                  style={styles.IconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {isInternational ? (
                    <Mail color={COLORS.white} size={32} strokeWidth={2.5} />
                  ) : (
                    <UserCheck color={COLORS.white} size={32} strokeWidth={2.5} />
                  )}
                </LinearGradient>
              </View>
              
              <View style={styles.HeroText}>
                <View style={styles.OverlineRow}>
                  <Text style={[styles.Overline, { color: COLORS.forestGreen }]}>
                    RECIPIENT DETAILS
                  </Text>
                  <Sparkles size={14} color={COLORS.forestGreen} strokeWidth={2.5} />
                </View>
                <Text style={[styles.Title, { color: UI_THEME.TextPrimary }]}>
                  {isInternational ? "International Receiver" : "Delivery Contact"}
                </Text>
              </View>
            </MotiView>

            <MotiView {...FadeInUp(200)}>
              <Text style={[styles.Subtitle, { color: UI_THEME.TextSecondary }]}>
                Provide the contact details for the person receiving this delivery. This information will be used for coordination and verification.
              </Text>
            </MotiView>

            {/* ENHANCED FORM CARD */}
            <MotiView 
              {...FadeInUp(300)} 
              style={[styles.FormCard, { backgroundColor: UI_THEME.Surface, borderColor: UI_THEME.Border }]}
            >
              {/* NAME INPUT */}
              <View style={styles.InputGroup}>
                <View style={styles.InputHeader}>
                  <View style={[styles.InputIconCircle, { backgroundColor: UI_THEME.PrimarySoft }]}>
                    <User size={16} color={COLORS.forestGreen} strokeWidth={2.5} />
                  </View>
                  <Text style={[styles.InputLabel, { color: UI_THEME.TextSecondary }]}>
                    FULL LEGAL NAME
                  </Text>
                </View>
                
                <Input 
                  placeholder="Enter first and last name" 
                  value={form.receiverName} 
                  inputStyle={[styles.EnhancedInput, { color: UI_THEME.TextPrimary }]}
                  onChangeText={t => {
                    setForm({...form, receiverName: t});
                    if(Errors.receiverName) SetErrors({...Errors, receiverName: null});
                  }} 
                />
                
                <AnimatePresence>
                  {Errors.receiverName && (
                    <MotiView 
                      from={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ type: 'timing', duration: 300 }}
                      style={[styles.ErrorBox, { backgroundColor: `${COLORS.error}10` }]}
                    >
                      <AlertCircle size={14} color={COLORS.error} strokeWidth={2.5} />
                      <Text style={[styles.ErrorText, { color: COLORS.error }]}>
                        {Errors.receiverName}
                      </Text>
                    </MotiView>
                  )}
                </AnimatePresence>

                {form.receiverName && form.receiverName.trim().split(' ').length >= 2 && !Errors.receiverName && (
                  <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', duration: 300 }}
                    style={[styles.SuccessBadge, { backgroundColor: UI_THEME.PrimarySoft }]}
                  >
                    <CheckCircle2 size={14} color={COLORS.forestGreen} strokeWidth={2.5} />
                    <Text style={[styles.SuccessText, { color: COLORS.forestGreen }]}>
                      Name verified
                    </Text>
                  </MotiView>
                )}
              </View>

              {/* PHONE INPUT */}
              <View style={styles.InputGroup}>
                <View style={styles.InputHeader}>
                  <View style={[styles.InputIconCircle, { backgroundColor: UI_THEME.PrimarySoft }]}>
                    <Phone size={16} color={COLORS.forestGreen} strokeWidth={2.5} />
                  </View>
                  <Text style={[styles.InputLabel, { color: UI_THEME.TextSecondary }]}>
                    CONTACT NUMBER
                  </Text>
                </View>
                
                <Input 
                  placeholder="Enter phone number" 
                  keyboardType="phone-pad"
                  value={form.receiverPhone} 
                  inputStyle={[styles.EnhancedInput, { color: UI_THEME.TextPrimary }]}
                  onChangeText={t => {
                    setForm({...form, receiverPhone: t});
                    if(Errors.receiverPhone) SetErrors({...Errors, receiverPhone: null});
                  }} 
                />
                
                <AnimatePresence>
                  {Errors.receiverPhone && (
                    <MotiView 
                      from={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ type: 'timing', duration: 300 }}
                      style={[styles.ErrorBox, { backgroundColor: `${COLORS.error}10` }]}
                    >
                      <AlertCircle size={14} color={COLORS.error} strokeWidth={2.5} />
                      <Text style={[styles.ErrorText, { color: COLORS.error }]}>
                        {Errors.receiverPhone}
                      </Text>
                    </MotiView>
                  )}
                </AnimatePresence>

                {form.receiverPhone && form.receiverPhone.replace(/\D/g, '').length >= 10 && !Errors.receiverPhone && (
                  <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', duration: 300 }}
                    style={[styles.SuccessBadge, { backgroundColor: UI_THEME.PrimarySoft }]}
                  >
                    <CheckCircle2 size={14} color={COLORS.forestGreen} strokeWidth={2.5} />
                    <Text style={[styles.SuccessText, { color: COLORS.forestGreen }]}>
                      Phone verified
                    </Text>
                  </MotiView>
                )}
              </View>

              {/* SECURITY NOTICE */}
              <View style={[styles.SecurityNotice, { backgroundColor: UI_THEME.PrimarySoft }]}>
                <View style={styles.SecurityIconContainer}>
                  <ShieldCheck size={22} color={COLORS.forestGreen} strokeWidth={2.5} />
                </View>
                <Text style={[styles.SecurityText, { color: COLORS.forestGreen }]}>
                  All information is encrypted and secure. Your recipient's details will only be used for delivery coordination.
                </Text>
              </View>
            </MotiView>

            {/* INFO CARD */}
            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 400 }}
            >
              <View style={[styles.InfoCard, { backgroundColor: UI_THEME.Surface }]}>
                <Sparkles size={18} color={COLORS.forestGreen} strokeWidth={2.5} />
                <Text style={[styles.InfoText, { color: UI_THEME.TextSecondary }]}>
                  <Text style={{ fontWeight: '800', color: UI_THEME.TextPrimary }}>Pro Tip:</Text> Ensure the name matches their ID for smooth verification at delivery.
                </Text>
              </View>
            </MotiView>
          </ScrollView>

          {/* ENHANCED FOOTER */}
          <MotiView 
            from={{ translateY: 100 }}
            animate={{ translateY: 0 }}
            transition={{ type: 'timing', duration: 400, delay: 500 }}
            style={[styles.Footer, { backgroundColor: UI_THEME.Surface, borderTopColor: UI_THEME.Border }]}
          >
            <View style={styles.FooterButtons}>
              <TouchableOpacity
                onPress={HandleBack}
                style={[styles.BackButton, { backgroundColor: UI_THEME.Background, borderColor: UI_THEME.Border }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.BackButtonText, { color: UI_THEME.TextPrimary }]}>
                  Back
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => ValidateForm() && onNext()}
                disabled={!IsFormFilled()}
                style={[
                  styles.ContinueButton,
                  !IsFormFilled() && styles.ContinueButtonDisabled
                ]}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={!IsFormFilled() 
                    ? [COLORS.mediumGray, '#475569'] 
                    : [COLORS.forestGreen, COLORS.darkForest]
                  }
                  style={styles.ContinueGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.ContinueText}>Continue to Review</Text>
                  <ArrowLeft 
                    size={20} 
                    color={COLORS.white} 
                    strokeWidth={2.5} 
                    style={{ transform: [{ rotate: '180deg' }] }}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </MotiView>

        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
  ProgressWrapper: { 
    flex: 1, 
    alignItems: 'center', 
    paddingHorizontal: 20,
  },
  StepTag: { 
    fontSize: 11, 
    fontWeight: '900', 
    paddingHorizontal: 14, 
    paddingVertical: 6, 
    borderRadius: 20, 
    marginBottom: 10,
    letterSpacing: 1,
  },
  ProgressBar: { 
    width: '85%', 
    height: 6, 
    borderRadius: 3, 
    overflow: 'hidden',
  },
  ProgressFill: { 
    height: '100%', 
    borderRadius: 3,
  },
  
  // Content
  ScrollContent: { 
    padding: 24, 
    paddingBottom: 160,
  },
  HeroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginBottom: 16,
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
  HeroText: {
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
    letterSpacing: 1.2,
  },
  Title: { 
    fontSize: 32, 
    fontWeight: '900', 
    letterSpacing: -0.5,
  },
  Subtitle: { 
    fontSize: 15, 
    fontWeight: '600', 
    lineHeight: 24, 
    marginBottom: 32,
  },

  // Form Card
  FormCard: { 
    padding: 24, 
    borderRadius: 24, 
    borderWidth: 2,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  InputGroup: { 
    marginBottom: 28,
  },
  InputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  InputIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  InputLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  EnhancedInput: { 
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    height: Platform.OS === 'ios' ? 28 : undefined,
  },
  ErrorBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
  },
  ErrorText: { 
    fontSize: 13, 
    fontWeight: '600',
    flex: 1,
  },
  SuccessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 12,
  },
  SuccessText: {
    fontSize: 12,
    fontWeight: '800',
  },
  
  // Security Notice
  SecurityNotice: { 
    flexDirection: 'row', 
    gap: 14, 
    padding: 18, 
    borderRadius: 16,
    marginTop: 4,
  },
  SecurityIconContainer: {
    marginTop: 2,
  },
  SecurityText: { 
    flex: 1, 
    fontSize: 13, 
    fontWeight: '700', 
    lineHeight: 20,
  },

  // Info Card
  InfoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  InfoText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 20,
  },

  // Footer
  Footer: { 
    paddingHorizontal: 24, 
    paddingTop: 20, 
    paddingBottom: Platform.OS === 'ios' ? 40 : 24, 
    borderTopWidth: 1,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  FooterButtons: { 
    flexDirection: 'row', 
    gap: 12,
  },
  BackButton: {
    flex: 0.4,
    height: 60,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  BackButtonText: {
    fontSize: 16,
    fontWeight: '800',
  },
  ContinueButton: {
    flex: 1,
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
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  ContinueText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});