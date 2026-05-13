import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Platform
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowRight, Clock } from 'lucide-react-native';

// Professional context and constants
import { useTheme } from '../context/ThemeContext';

/**
 * OrderSuccessScreen
 * Final confirmation after backend transaction [cite: 2026-01-09].
 * Redirects to Dashboard automatically after 5 seconds.
 */
export default function OrderSuccessScreen() {
  const { colors: Colors, isDark: IsDark } = useTheme();
  const Navigation = useNavigation();
  const Route = useRoute();
  const AnimationRef = useRef(null);

  // --- UI THEME MAPPING ---
  const UI_THEME = {
    Background: Colors.Background,
    Surface: Colors.Surface,
    TextPrimary: Colors.TextPrimary,
    TextSecondary: Colors.TextSecondary,
    Primary: Colors.Primary,
    Border: Colors.Border,
    Muted: Colors.Slate400,
  };

  // Params from the previous MarketplaceQuoteStep
  const { OrderId, TotalAmount } = Route.params || {};

  const HandleDismiss = () => {
    // Reset stack to prevent "Back" button returning to payment process
    Navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }], 
    });
  };

  useEffect(() => {
    AnimationRef.current?.play();

    const Timer = setTimeout(() => {
      HandleDismiss();
    }, 5000);

    return () => clearTimeout(Timer);
  }, []);

  return (
    <SafeAreaView style={[styles.SafeArea, { backgroundColor: UI_THEME.Background }]}>
      <View style={styles.Content}>
        
        {/* LOTTIE SUCCESS ANIMATION */}
        <View style={styles.AnimationWrapper}>
          <LottieView
            ref={AnimationRef}
            source={require('../../assets/lottie/success.json')} 
            autoPlay={true}
            loop={false}
            style={styles.Lottie}
          />
        </View>

        <View style={styles.TextWrapper}>
          <Text style={[styles.Title, { color: UI_THEME.TextPrimary }]}>Success!</Text>
          <Text style={[styles.Subtitle, { color: UI_THEME.TextSecondary }]}>
            Order <Text style={[styles.Highlight, { color: UI_THEME.Primary }]}>#{OrderId || 'N/A'}</Text> has been successfully placed.
          </Text>
        </View>

        {/* TRANSACTION DETAILS [cite: 2026-01-28] */}
        <View style={[styles.DetailsCard, { backgroundColor: UI_THEME.Surface, borderColor: UI_THEME.Border }]}>
          <View style={styles.DetailRow}>
            <Text style={[styles.DetailLabel, { color: UI_THEME.TextSecondary }]}>Paid via Secure Wallet</Text>
            <Text style={[styles.DetailVal, { color: UI_THEME.TextPrimary }]}>
              R {TotalAmount?.toLocaleString() || '0.00'}
            </Text>
          </View>
        </View>

        {/* AUTO-REDIRECT INDICATOR */}
        <View style={styles.RedirectInfo}>
          <Clock size={14} color={UI_THEME.Muted} />
          <Text style={[styles.RedirectText, { color: UI_THEME.Muted }]}>
            Returning to dashboard in 5s...
          </Text>
        </View>
      </View>

      <View style={styles.Footer}>
        <TouchableOpacity 
          style={[styles.ContinueBtn, { backgroundColor: UI_THEME.Primary }]} 
          onPress={HandleDismiss}
          activeOpacity={0.8}
        >
          <Text style={styles.ContinueBtnText}>Go to Dashboard Now</Text>
          <ArrowRight size={20} color="white" strokeWidth={3} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  SafeArea: {
    flex: 1,
  },
  Content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  AnimationWrapper: {
    width: 240,
    height: 240,
    marginBottom: 10,
  },
  Lottie: {
    width: '100%',
    height: '100%',
  },
  TextWrapper: {
    alignItems: 'center',
    marginBottom: 30,
  },
  Title: {
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 10,
    letterSpacing: -1,
  },
  Subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  Highlight: {
    fontWeight: '900',
  },
  DetailsCard: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  DetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  DetailLabel: {
    fontWeight: '700',
    fontSize: 14,
  },
  DetailVal: {
    fontSize: 20,
    fontWeight: '900',
  },
  RedirectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 30,
  },
  RedirectText: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  Footer: {
    padding: 25,
    paddingBottom: Platform.OS === 'ios' ? 40 : 25,
  },
  ContinueBtn: {
    height: 68,
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  ContinueBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
  }
});