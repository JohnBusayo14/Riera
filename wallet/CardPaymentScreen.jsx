import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Alert, 
  TouchableOpacity, SafeAreaView, Dimensions, StatusBar, Platform 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MotiView } from 'moti'; 
import { ArrowLeft, ShieldCheck, Lock, CreditCard } from 'lucide-react-native';

// Professional context and theme integration
import { useTheme } from '../context/ThemeContext';
import { walletApi } from '../api/walletApi';
import Button from '../components/Button';
import Input from '../components/Input';

const { width } = Dimensions.get('window');

/**
 * CardPaymentScreen
 * Handles ZAR card payments with Deep Navy Slate theme for 2026.
 */
export default function CardPaymentScreen() {
  const Navigation = useNavigation();
  const Route = useRoute();
  const { colors: Colors, isDark: IsDark } = useTheme();

  // --- STATE DEFINITIONS ---
  const RawAmount = Route.params?.amount || 0;
  const DisplayAmount = typeof RawAmount === 'string' 
    ? parseFloat(RawAmount.replace(/,/g, '')) 
    : Number(RawAmount);

  const [Loading, setLoading] = useState(false);
  const [CardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });

  // --- REFINED UI THEME MAPPING ---
  const UI_THEME = {
    Background: IsDark ? '#0F172A' : Colors.Background,
    Surface: IsDark ? '#1E293B' : Colors.Surface,
    TextPrimary: Colors.TextPrimary,
    TextSecondary: Colors.TextSecondary,
    Primary: Colors.Primary,
    Border: IsDark ? '#334155' : Colors.Border,
    // Keep card visual dark for premium feel
    CardVisualBg: IsDark ? '#1E293B' : '#1e293b', 
  };

  const HandlePay = async () => {
    setLoading(true);
    const Payload = { Amount: DisplayAmount, Method: 'CARD' };

    try {
      const Response = await walletApi.initializePaystackPayment(Payload);
      const AuthUrl = Response?.AuthorizationUrl || Response?.authorizationUrl;
      const Ref = Response?.Reference || Response?.reference;

      if (AuthUrl) {
        Navigation.navigate('PaymentWebView', { 
          url: AuthUrl,
          reference: Ref 
        });
      } else {
        throw new Error("RieRa: Secure URL missing.");
      }
    } catch (Err) {
      const ErrorMsg = Err.response?.data?.Message || "Payment failed.";
      Alert.alert("Payment Error", ErrorMsg);
    } finally {
      setLoading(false);
    }
  };

  const GetMaskedNumber = (Num) => {
    const DefaultNum = "•••• •••• •••• ••••";
    if (!Num) return DefaultNum;
    return Num.padEnd(16, '•').replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <View style={[styles.Container, { backgroundColor: UI_THEME.Background }]}>
      <StatusBar barStyle={IsDark ? 'light-content' : 'dark-content'} />
      
      <SafeAreaView style={[styles.HeaderWrapper, { backgroundColor: UI_THEME.Surface, borderBottomColor: UI_THEME.Border }]}>
        <View style={styles.CompactHeader}>
          <TouchableOpacity 
            onPress={() => Navigation.goBack()} 
            style={[styles.BackBtn, { backgroundColor: IsDark ? '#334155' : '#f1f5f9' }]}
          >
            <ArrowLeft size={22} color={UI_THEME.TextPrimary} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={[styles.HeaderTitle, { color: UI_THEME.TextPrimary }]}>Card Details</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.Content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        
        {/* VIRTUAL CARD VISUALIZER */}
        <MotiView 
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={[styles.CardVisual, { backgroundColor: UI_THEME.CardVisualBg, borderColor: UI_THEME.Border, borderWidth: IsDark ? 1 : 0 }]}
        >
          <View style={styles.CardHeader}>
            <CreditCard color="white" size={32} />
            <ShieldCheck color="rgba(255,255,255,0.4)" size={20} />
          </View>
          <Text style={styles.CardVisualNumber}>{GetMaskedNumber(CardData.number)}</Text>
          <View style={styles.CardFooter}>
            <View>
              <Text style={styles.CardLabel}>CARD HOLDER</Text>
              <Text style={styles.CardValue}>{CardData.name.toUpperCase() || "YOUR NAME"}</Text>
            </View>
            <View>
              <Text style={styles.CardLabel}>EXPIRES</Text>
              <Text style={styles.CardValue}>{CardData.expiry || "MM/YY"}</Text>
            </View>
          </View>
        </MotiView>

        {/* FORM SECTION */}
        <MotiView 
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200 }}
          style={[styles.FormContainer, { backgroundColor: UI_THEME.Surface, borderColor: UI_THEME.Border }]}
        >
          <View style={[styles.AmountSummary, { borderBottomColor: UI_THEME.Border }]}>
            <Text style={[styles.SummaryLabel, { color: UI_THEME.TextSecondary }]}>Total to Pay</Text>
            <Text style={[styles.SummaryAmount, { color: '#22c55e' }]}>
               R {DisplayAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
            </Text>
          </View>

          <Input 
            label="CARDHOLDER NAME"
            placeholder="THABO KHUMALO"
            autoCapitalize="characters"
            value={CardData.name}
            onChangeText={(v) => setCardData({...CardData, name: v})}
          />

          <Input 
            label="CARD NUMBER"
            placeholder="0000 0000 0000 0000"
            keyboardType="numeric"
            maxLength={16}
            value={CardData.number}
            onChangeText={(v) => setCardData({...CardData, number: v.replace(/[^0-9]/g, '')})}
          />

          <View style={styles.Row}>
            <View style={{ flex: 1 }}>
              <Input 
                label="EXPIRY DATE" 
                placeholder="MM/YY" 
                maxLength={5} 
                value={CardData.expiry} 
                onChangeText={(v) => setCardData({...CardData, expiry: v})} 
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input 
                label="CVV" 
                placeholder="123" 
                secureTextEntry 
                maxLength={3} 
                value={CardData.cvv} 
                onChangeText={(v) => setCardData({...CardData, cvv: v})} 
              />
            </View>
          </View>

          <Button 
            title={Loading ? "Processing..." : `Securely Pay R${DisplayAmount.toLocaleString()}`} 
            onPress={HandlePay} 
            loading={Loading}
            style={[styles.PayBtn, { backgroundColor: UI_THEME.Primary }]}
          />
        </MotiView>

        <View style={styles.Footer}>
          <Lock size={14} color={UI_THEME.TextSecondary} />
          <Text style={[styles.FooterText, { color: UI_THEME.TextSecondary }]}>Secure ZAR Bank-Level Encryption</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: { flex: 1 },
  HeaderWrapper: { borderBottomWidth: 1.5 },
  CompactHeader: { height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  HeaderTitle: { fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
  BackBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  Content: { padding: 25 },
  CardVisual: {
    width: '100%',
    height: 190,
    borderRadius: 28,
    padding: 24,
    justifyContent: 'space-between',
    marginBottom: 30,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15 },
      android: { elevation: 12 }
    })
  },
  CardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  CardVisualNumber: { color: 'white', fontSize: 24, fontWeight: '700', letterSpacing: 3, marginVertical: 15 },
  CardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  CardLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  CardValue: { color: 'white', fontSize: 14, fontWeight: '800' },
  FormContainer: { borderRadius: 32, padding: 25, gap: 16, borderWidth: 1.5 },
  AmountSummary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 15, borderBottomWidth: 1.5 },
  SummaryLabel: { fontSize: 14, fontWeight: '800' },
  SummaryAmount: { fontSize: 22, fontWeight: '900' },
  Row: { flexDirection: 'row', gap: 16 },
  PayBtn: { marginTop: 10, height: 62, borderRadius: 20 },
  Footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 30, marginBottom: 20 },
  FooterText: { fontSize: 12, fontWeight: '700' }
});