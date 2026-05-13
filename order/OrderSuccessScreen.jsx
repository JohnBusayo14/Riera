// import React, { useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
// import LottieView from 'lottie-react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { ArrowRight, Clock } from 'lucide-react-native';
// import { COLORS } from '../constants';

// export default function OrderSuccessScreen() {
//   const Navigation = useNavigation();
//   const Route = useRoute();
//   const AnimationRef = useRef(null);

//   const { OrderId, TotalAmount } = Route.params || {};

//   const HandleDismiss = () => {
//     // Resetting to DrawerRoot rebuilds the drawer/tab state correctly
//     Navigation.reset({
//       index: 0,
//       routes: [{ name: 'DrawerRoot' }],
//     });
//   };

//   useEffect(() => {
//     AnimationRef.current?.play();

//     const Timer = setTimeout(() => {
//       HandleDismiss();
//     }, 5000);

//     return () => clearTimeout(Timer);
//   }, []);

//   return (
//     <SafeAreaView style={styles.Container}>
//       <View style={styles.Content}>
//         <View style={styles.AnimationWrapper}>
//           <LottieView
//             ref={AnimationRef}
//             source={require('../assets/lottie/successanime.json')} 
//             autoPlay loop={false}
//             style={styles.Lottie}
//           />
//         </View>

//         <View style={styles.TextWrapper}>
//           <Text style={styles.Title}>Success!</Text>
//           <Text style={styles.Subtitle}>
//             Order <Text style={styles.Highlight}>#{OrderId || 'N/A'}</Text> received.
//           </Text>
//         </View>

//         <View style={styles.DetailsCard}>
//           <View style={styles.DetailRow}>
//             <Text style={styles.DetailLabel}>Paid via Wallet</Text>
//             <Text style={styles.DetailVal}>₦{TotalAmount?.toLocaleString() || '0'}</Text>
//           </View>
//         </View>

//         <View style={styles.RedirectInfo}>
//           <Clock size={14} color="#94a3b8" />
//           <Text style={styles.RedirectText}>Redirecting in 5s...</Text>
//         </View>
//       </View>

//       <View style={styles.Footer}>
//         <TouchableOpacity style={styles.ContinueBtn} onPress={HandleDismiss}>
//           <Text style={styles.ContinueBtnText}>Go Home Now</Text>
//           <ArrowRight size={20} color="white" />
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   Container: { flex: 1, backgroundColor: 'white' },
//   Content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
//   AnimationWrapper: { width: 220, height: 220, marginBottom: 10 },
//   Lottie: { width: '100%', height: '100%' },
//   TextWrapper: { alignItems: 'center', marginBottom: 25 },
//   Title: { fontSize: 32, fontWeight: '900', color: '#0f172a' },
//   Subtitle: { fontSize: 16, color: '#64748b', textAlign: 'center' },
//   Highlight: { color: COLORS.primary, fontWeight: '800' },
//   DetailsCard: { width: '100%', backgroundColor: '#f8fafc', borderRadius: 20, padding: 20 },
//   DetailRow: { flexDirection: 'row', justifyContent: 'space-between' },
//   DetailLabel: { color: '#64748b', fontWeight: '600' },
//   DetailVal: { fontSize: 18, fontWeight: '800' },
//   RedirectInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 25 },
//   RedirectText: { fontSize: 13, color: '#94a3b8' },
//   Footer: { padding: 25 },
//   ContinueBtn: { backgroundColor: COLORS.primary, height: 60, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
//   ContinueBtnText: { color: 'white', fontSize: 18, fontWeight: '900' }
// });








import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowRight, Clock } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

// ─── Theme builder — mirrors DriverDashboard exactly ─────────────────────────────
const buildTheme = (isDark) => ({
  bg:           isDark ? '#0B1120' : '#F0F4F8',
  surface:      isDark ? '#141E30' : '#FFFFFF',
  card:         isDark ? '#1C2A3F' : '#FFFFFF',
  cardElevated: isDark ? '#243347' : '#F7FAFC',
  border:       isDark ? '#2A3C55' : '#E2EBF4',
  primary:      '#10B981',
  primaryDark:  '#059669',
  primaryGlow:  isDark ? 'rgba(16,185,129,0.18)' : 'rgba(16,185,129,0.10)',
  textPrimary:  isDark ? '#F0F6FF' : '#0D1B2A',
  textSecondary:isDark ? '#8BA4C2' : '#4A6080',
  textMuted:    isDark ? '#4E6A8A' : '#8DA0B8',
  divider:      isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
  white:        '#FFFFFF',
});

export default function OrderSuccessScreen() {
  const Navigation = useNavigation();
  const Route = useRoute();
  const AnimationRef = useRef(null);
  const { isDark } = useTheme();
  const theme = useMemo(() => buildTheme(isDark), [isDark]);

  const { OrderId, TotalAmount } = Route.params || {};

  const HandleDismiss = () => {
    Navigation.reset({
      index: 0,
      routes: [{ name: 'DrawerRoot' }],
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
    <SafeAreaView style={[styles.Container, { backgroundColor: theme.bg }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />

      <View style={styles.Content}>
        <View style={styles.AnimationWrapper}>
          <LottieView
            ref={AnimationRef}
            source={require('../assets/lottie/successanime.json')} 
            autoPlay loop={false}
            style={styles.Lottie}
          />
        </View>

        <View style={styles.TextWrapper}>
          <Text style={[styles.Title, { color: theme.textPrimary }]}>Success!</Text>
          <Text style={[styles.Subtitle, { color: theme.textSecondary }]}>
            Order <Text style={[styles.Highlight, { color: theme.primary }]}>#{OrderId || 'N/A'}</Text> received.
          </Text>
        </View>

        <View style={[styles.DetailsCard, { backgroundColor: theme.cardElevated, borderColor: theme.border }]}>
          <View style={styles.DetailRow}>
            <Text style={[styles.DetailLabel, { color: theme.textSecondary }]}>Paid via Wallet</Text>
            <Text style={[styles.DetailVal, { color: theme.textPrimary }]}>
              ₦{TotalAmount?.toLocaleString() || '0'}
            </Text>
          </View>
        </View>

        <View style={styles.RedirectInfo}>
          <Clock size={14} color={theme.textMuted} />
          <Text style={[styles.RedirectText, { color: theme.textMuted }]}>Redirecting in 5s...</Text>
        </View>
      </View>

      <View style={[styles.Footer, { backgroundColor: theme.bg }]}>
        <TouchableOpacity
          style={[styles.ContinueBtn, { backgroundColor: theme.primary }]}
          onPress={HandleDismiss}
        >
          <Text style={styles.ContinueBtnText}>Go Home Now</Text>
          <ArrowRight size={20} color={theme.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container:        { flex: 1 },
  Content:          { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  AnimationWrapper: { width: 220, height: 220, marginBottom: 10 },
  Lottie:           { width: '100%', height: '100%' },
  TextWrapper:      { alignItems: 'center', marginBottom: 25 },
  Title:            { fontSize: 32, fontWeight: '900' },
  Subtitle:         { fontSize: 16, textAlign: 'center' },
  Highlight:        { fontWeight: '800' },
  DetailsCard: {
    width: '100%', borderRadius: 20,
    padding: 20, borderWidth: 1,
  },
  DetailRow:      { flexDirection: 'row', justifyContent: 'space-between' },
  DetailLabel:    { fontWeight: '600' },
  DetailVal:      { fontSize: 18, fontWeight: '800' },
  RedirectInfo:   { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 25 },
  RedirectText:   { fontSize: 13 },
  Footer:         { padding: 25 },
  ContinueBtn: {
    height: 60, borderRadius: 20,
    flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center', gap: 12,
  },
  ContinueBtnText: { color: 'white', fontSize: 18, fontWeight: '900' },
});