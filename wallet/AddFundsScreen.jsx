// import React, { useState } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   TouchableOpacity, 
//   ScrollView, 
//   Alert, 
//   SafeAreaView,
//   StatusBar,
//   Platform
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { ArrowLeft, ChevronRight, CreditCard, Zap, Landmark } from 'lucide-react-native';

// // Professional context and theme integration
// import { useTheme } from '../context/ThemeContext';
// import Input from '../components/Input';

// /**
//  * AddFundsScreen
//  * South African Currency Focus (ZAR)
//  */
// export default function AddFundsScreen() {
//   const Navigation = useNavigation();
//   const { colors: Colors, isDark: IsDark } = useTheme();

//   // --- STATE DEFINITIONS ---
//   const [Amount, setAmount] = useState('');
//   const QuickAmounts = [250, 500, 1000, 2000];

//   // --- UPDATED PROFESSIONAL UI THEME MAPPING ---
//   const UI_THEME = {
//     // Professional Dark Mode uses Slate/Charcoal instead of pure black
//     Background: IsDark ? '#0F172A' : Colors.Background, 
//     Surface: IsDark ? '#1E293B' : Colors.Surface,
//     TextPrimary: Colors.TextPrimary,
//     TextSecondary: Colors.TextSecondary,
//     Primary: Colors.Primary,
//     Border: IsDark ? '#334155' : Colors.Border,
//     InputBox: IsDark ? '#1E293B' : Colors.Surface,
//     QuickBtn: IsDark ? '#334155' : '#F1F5F9',
//   };

//   const HandleSelectMethod = (MethodType) => {
//     const NumericAmount = parseFloat(Amount.replace(/,/g, ''));
//     if (!Amount || isNaN(NumericAmount) || NumericAmount <= 0) {
//       Alert.alert('Invalid Amount', 'Please enter a valid amount in ZAR');
//       return;
//     }

//     switch (MethodType) {
//       case 'CARD': Navigation.navigate('CardPayment', { amount: NumericAmount }); break;
//       case 'OZOW': Navigation.navigate('OzowPayment', { amount: NumericAmount }); break;
//       case 'TRANSFER': Navigation.navigate('BankPayment', { amount: NumericAmount }); break;
//     }
//   };

//   return (
//     <View style={[styles.Container, { backgroundColor: UI_THEME.Background }]}>
//       <StatusBar barStyle={IsDark ? 'light-content' : 'dark-content'} />
      
//       <SafeAreaView style={[styles.HeaderWrapper, { backgroundColor: UI_THEME.Surface, borderBottomColor: UI_THEME.Border }]}>
//         <View style={styles.CompactHeader}>
//           <TouchableOpacity 
//             style={styles.BackButton} 
//             onPress={() => Navigation.goBack()}
//           >
//             <ArrowLeft size={24} color={UI_THEME.TextPrimary} strokeWidth={3} />
//           </TouchableOpacity>
//           <Text style={[styles.HeaderTitle, { color: UI_THEME.TextPrimary }]}>Add Funds</Text>
//           <View style={{ width: 40 }} />
//         </View>
//       </SafeAreaView>

//       <ScrollView contentContainerStyle={styles.Content} showsVerticalScrollIndicator={false}>
//         <Text style={[styles.Title, { color: UI_THEME.TextPrimary }]}>How much do you want to add?</Text>
//         <Text style={[styles.Subtitle, { color: UI_THEME.TextSecondary }]}>
//           Funding your wallet makes logistics booking faster in South Africa.
//         </Text>

//         <View style={[styles.InputBox, { backgroundColor: UI_THEME.InputBox, borderColor: UI_THEME.Border }]}>
//           <Text style={[styles.Currency, { color: UI_THEME.TextPrimary }]}>R</Text>
//           <Input 
//             placeholder="0.00" 
//             keyboardType="numeric" 
//             value={Amount} 
//             onChangeText={setAmount} 
//             style={[styles.Input, { color: UI_THEME.TextPrimary }]}
//             placeholderTextColor={UI_THEME.TextSecondary}
//           />
//         </View>

//         <View style={styles.QuickGrid}>
//           {QuickAmounts.map(Amt => (
//             <TouchableOpacity 
//               key={Amt} 
//               style={[styles.QuickBtn, { backgroundColor: UI_THEME.QuickBtn }]} 
//               onPress={() => setAmount(Amt.toString())}
//             >
//               <Text style={[styles.QuickText, { color: UI_THEME.TextPrimary }]}>R{Amt.toLocaleString()}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <Text style={[styles.MethodLabel, { color: UI_THEME.TextSecondary }]}>SELECT PAYMENT METHOD</Text>

//         {[
//           { id: 'CARD', title: 'Pay with Card', desc: 'Instant via Credit/Debit', icon: <CreditCard size={22} color={UI_THEME.Primary} /> },
//           { id: 'OZOW', title: 'Ozow Instant EFT', desc: 'Secure SA Bank Payment', icon: <Zap size={22} color="#F97316" /> },
//           { id: 'TRANSFER', title: 'Bank Transfer', desc: 'Dedicated EFT account', icon: <Landmark size={22} color={UI_THEME.Primary} /> }
//         ].map((Method) => (
//           <TouchableOpacity
//             key={Method.id}
//             style={[
//               styles.MethodCard, 
//               { backgroundColor: UI_THEME.Surface, borderColor: UI_THEME.Border },
//               !Amount && { opacity: 0.5 }
//             ]}
//             onPress={() => HandleSelectMethod(Method.id)}
//             disabled={!Amount}
//           >
//             <View style={[styles.MethodIcon, { backgroundColor: UI_THEME.QuickBtn }]}>
//               {Method.icon}
//             </View>
//             <View style={{ flex: 1 }}>
//               <Text style={[styles.MethodTitle, { color: UI_THEME.TextPrimary }]}>{Method.title}</Text>
//               <Text style={[styles.MethodDesc, { color: UI_THEME.TextSecondary }]}>{Method.desc}</Text>
//             </View>
//             <ChevronRight color={UI_THEME.TextSecondary} size={20} />
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   Container: { flex: 1 },
//   HeaderWrapper: { borderBottomWidth: 1.5, paddingTop: Platform.OS === 'android' ? 10 : 0 },
//   CompactHeader: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
//   BackButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
//   HeaderTitle: { fontSize: 19, fontWeight: '900', letterSpacing: -0.5 },
//   Content: { padding: 25 },
//   Title: { fontSize: 24, fontWeight: '900', marginBottom: 8, letterSpacing: -0.5 },
//   Subtitle: { fontSize: 14, fontWeight: '600', marginBottom: 30, lineHeight: 20 },
//   InputBox: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     borderRadius: 20, 
//     paddingHorizontal: 20, 
//     paddingVertical: 10, 
//     marginBottom: 30, 
//     borderWidth: 1, // Added border for dark mode depth
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8
//   },
//   Currency: { fontSize: 36, fontWeight: '900', marginRight: 10 },
//   Input: { flex: 1, fontSize: 36, fontWeight: '900', backgroundColor: 'transparent' },
//   QuickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 40 },
//   QuickBtn: { paddingHorizontal: 18, paddingVertical: 14, borderRadius: 14, minWidth: 95, alignItems: 'center' },
//   QuickText: { fontWeight: '800', fontSize: 14 },
//   MethodLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginBottom: 20, textAlign: 'center' },
//   MethodCard: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     padding: 20, 
//     borderRadius: 24, 
//     borderWidth: 1.5, 
//     marginBottom: 16, 
//     elevation: 2 
//   },
//   MethodIcon: { width: 52, height: 52, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 18 },
//   MethodTitle: { fontSize: 17, fontWeight: '800' },
//   MethodDesc: { fontSize: 13, fontWeight: '600', marginTop: 3 }
// });









// screens/wallet/AddFundsScreen.jsx
// 💵 Add Funds with Paystack

import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  SafeAreaView, StatusBar, ActivityIndicator, Alert
} from 'react-native';
import {
  ArrowLeft, CreditCard, Wallet
} from 'lucide-react-native';

import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../theme/designSystem';
import apiClient from '../services/apiClient';

export default function AddFundsScreen({ navigation }) {
  const { isDark } = useTheme();
  const theme = useMemo(() => getTheme(isDark), [isDark]);

  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const quickAmounts = [500, 1000, 2000, 5000];

  const handleAddFunds = async () => {
    const numAmount = parseFloat(amount);

    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    if (numAmount < 50) {
      Alert.alert('Amount Too Low', 'Minimum amount is R50');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/wallet/initialize', {
        amount: numAmount
      });

      const { authorizationUrl, reference } = response.data;

      // Navigate to PaymentWebView
      navigation.navigate('PaymentWebView', {
        url: authorizationUrl,
        reference: reference
      });
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <SafeAreaView style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <ArrowLeft size={24} color={theme.colors.textPrimary} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>
          Add Funds
        </Text>
        <View style={{ width: 44 }} />
      </SafeAreaView>

      <View style={styles.content}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
          <Wallet size={48} color={theme.colors.primary} strokeWidth={2} />
        </View>

        <Text style={[theme.typography.h2, { color: theme.colors.textPrimary, textAlign: 'center', marginBottom: 8 }]}>
          Fund Your Wallet
        </Text>
        <Text style={[theme.typography.bodyMedium, { color: theme.colors.textMuted, textAlign: 'center', marginBottom: 32 }]}>
          Add money using your debit card via Paystack
        </Text>

        {/* Amount Input */}
        <View style={[styles.amountBox, { backgroundColor: theme.colors.card }, theme.shadows.md]}>
          <Text style={[styles.currency, { color: theme.colors.primary }]}>R</Text>
          <TextInput
            style={[styles.input, { color: theme.colors.textPrimary }]}
            placeholder="0.00"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* Quick Amounts */}
        <View style={styles.quickAmounts}>
          {quickAmounts.map(amt => (
            <TouchableOpacity
              key={amt}
              style={[
                styles.quickChip,
                {
                  backgroundColor: amount === amt.toString() ? theme.colors.primary : theme.colors.surface,
                  borderColor: theme.colors.border,
                }
              ]}
              onPress={() => setAmount(amt.toString())}
            >
              <Text style={[
                styles.quickText,
                { color: amount === amt.toString() ? '#FFF' : theme.colors.textPrimary }
              ]}>
                R{amt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info */}
        <View style={[styles.infoBox, { backgroundColor: theme.colors.surface }]}>
          <CreditCard size={20} color={theme.colors.primary} strokeWidth={2.5} />
          <View style={{ flex: 1 }}>
            <Text style={[theme.typography.bodyMedium, { color: theme.colors.textPrimary, fontWeight: '700' }]}>
              Secure Payment
            </Text>
            <Text style={[styles.infoText, { color: theme.colors.textMuted }]}>
              Powered by Paystack. Your card details are encrypted and secure.
            </Text>
          </View>
        </View>

        {/* Button */}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: amount ? theme.colors.primary : theme.colors.surface,
              opacity: amount ? 1 : 0.5,
            },
            theme.shadows.lg
          ]}
          onPress={handleAddFunds}
          disabled={!amount || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={[styles.buttonText, { color: '#FFF' }]}>
              Continue to Payment
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  currency: {
    fontSize: 32,
    fontWeight: '900',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 32,
    fontWeight: '900',
  },
  quickAmounts: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  quickChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  quickText: {
    fontSize: 14,
    fontWeight: '700',
  },
  infoBox: {
    flexDirection: 'row',
    width: '100%',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 32,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    marginTop: 2,
  },
  button: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '900',
  },
});