import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  Clipboard, // Ensure @react-native-clipboard/clipboard is installed for production
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Copy, Info } from 'lucide-react-native';

// Professional context and theme integration
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { walletApi } from '../api/walletApi';

/**
 * BankTransferScreen
 * Handles ZAR manual transfers for South African users [cite: 2026-01-28].
 * All verification logic resides on the backend [cite: 2026-01-09].
 */
export default function BankTransferScreen() {
  const Navigation = useNavigation();
  const Route = useRoute();
  const { colors: Colors, isDark: IsDark } = useTheme();
  
  // Gets amount from navigation params
  const { amount: PassedAmount } = Route.params || { amount: 0 };
  
  // --- STATE DEFINITIONS (PascalCase) [cite: 2026-01-23] ---
  const [Loading, setLoading] = useState(false);

  // South African Virtual Account Details
  const BankDetails = {
    Bank: "Standard Bank / Riera Virtual Account",
    AccountNumber: "10192837465",
    AccountName: "RieRa Logistics - Virtual ZAR"
  };

  // --- UI THEME MAPPING ---
  const UI_THEME = {
    Background: Colors.Background,
    Surface: Colors.Surface,
    TextPrimary: Colors.TextPrimary,
    TextSecondary: Colors.TextSecondary,
    Primary: Colors.Primary,
    Border: Colors.Border,
    Warning: '#fff7ed',
    WarningText: '#9a3412'
  };

  const HandleCopy = (TextToCopy, Label) => {
    Clipboard.setString(TextToCopy);
    Alert.alert('Copied!', `${Label} has been copied to your clipboard.`);
  };

  const HandleConfirmTransfer = async () => {
    if (!PassedAmount || PassedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please go back and enter a valid amount.');
      return;
    }

    setLoading(true);
    try {
      /** * Notify backend. 
       * Calculations performed in backend [cite: 2026-01-09] 
       */
      await walletApi.fundWallet(PassedAmount, 'BANK_TRANSFER');

      Alert.alert(
        'Transfer Notified',
        'Our South African finance team will verify the ZAR deposit within 5-10 minutes.',
        [{ 
          text: 'Return to Wallet', 
          onPress: () => {
            Navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: 'DrawerRoot',
                    state: {
                      routes: [
                        {
                          name: 'MainTabs',
                          state: {
                            routes: [{ name: 'Wallet' }],
                          },
                        },
                      ],
                    },
                  },
                ],
              })
            );
          }
        }]
      );
    } catch (Err) {
      console.error("RieRa Transfer error:", Err);
      Alert.alert('Notification Failed', 'Could not record your request. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.Container, { backgroundColor: UI_THEME.Background }]}>
      <StatusBar barStyle={IsDark ? 'light-content' : 'dark-content'} />
      
      <SafeAreaView style={[styles.HeaderWrapper, { backgroundColor: UI_THEME.Surface, borderBottomColor: UI_THEME.Border }]}>
        <View style={styles.CompactHeader}>
          <TouchableOpacity 
            style={styles.BackButton} 
            onPress={() => Navigation.goBack()}
          >
            <ArrowLeft size={24} color={UI_THEME.TextPrimary} strokeWidth={3} />
          </TouchableOpacity>
          <Text style={[styles.HeaderTitle, { color: UI_THEME.TextPrimary }]}>Bank Transfer</Text>
          <View style={{ width: 40 }} /> 
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.Content} showsVerticalScrollIndicator={false}>
        <View style={styles.InstructionBox}>
          <Text style={[styles.AmountTitle, { color: UI_THEME.TextPrimary }]}>
            R {Number(PassedAmount).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
          </Text>
          <Text style={[styles.Subtitle, { color: UI_THEME.TextSecondary }]}>
            Transfer the exact amount in Rands to the virtual account details listed below.
          </Text>
        </View>

        <Card style={[styles.AccountCard, { backgroundColor: UI_THEME.Surface, borderColor: UI_THEME.Border }]}>
          <View style={styles.DetailItem}>
            <Text style={[styles.Label, { color: UI_THEME.TextSecondary }]}>BANK NAME</Text>
            <Text style={[styles.Value, { color: UI_THEME.TextPrimary }]}>{BankDetails.Bank}</Text>
          </View>

          <View style={[styles.Line, { backgroundColor: UI_THEME.Border }]} />

          <View style={styles.DetailItem}>
            <Text style={[styles.Label, { color: UI_THEME.TextSecondary }]}>ACCOUNT NUMBER</Text>
            <View style={styles.Row}>
              <Text style={[styles.AcctNumber, { color: UI_THEME.Primary }]}>{BankDetails.AccountNumber}</Text>
              <TouchableOpacity 
                style={[styles.CopyBtn, { backgroundColor: IsDark ? '#1E293B' : '#F1F5F9' }]} 
                onPress={() => HandleCopy(BankDetails.AccountNumber, 'Account Number')}
              >
                <Copy size={14} color={UI_THEME.Primary} style={{ marginRight: 4 }} />
                <Text style={[styles.CopyText, { color: UI_THEME.Primary }]}>COPY</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.Line, { backgroundColor: UI_THEME.Border }]} />

          <View style={styles.DetailItem}>
            <Text style={[styles.Label, { color: UI_THEME.TextSecondary }]}>ACCOUNT NAME</Text>
            <View style={styles.Row}>
              <Text style={[styles.Value, { color: UI_THEME.TextPrimary }]}>{BankDetails.AccountName}</Text>
              <TouchableOpacity 
                style={[styles.CopyBtn, { backgroundColor: IsDark ? '#1E293B' : '#F1F5F9' }]} 
                onPress={() => HandleCopy(BankDetails.AccountName, 'Account Name')}
              >
                <Text style={[styles.CopyText, { color: UI_THEME.Primary }]}>COPY</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        <View style={[styles.InfoBox, { backgroundColor: IsDark ? '#2C1B0E' : '#fff7ed' }]}>
          <Info size={16} color={UI_THEME.WarningText} style={{ marginBottom: 5 }} />
          <Text style={[styles.InfoText, { color: IsDark ? '#FDBA74' : UI_THEME.WarningText }]}>
            Note: Ensure you use the correct account details. Our backend automated verification [cite: 2026-01-09] depends on precise account matching.
          </Text>
        </View>

        <Button
          title={Loading ? "Syncing..." : "I've Sent the Money"}
          onPress={HandleConfirmTransfer}
          loading={Loading}
          style={styles.Btn}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: { flex: 1 },
  HeaderWrapper: { borderBottomWidth: 1.5 },
  CompactHeader: { 
    height: 60, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20 
  },
  BackButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  HeaderTitle: { fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
  Content: { padding: 25 },
  InstructionBox: { marginBottom: 30, alignItems: 'center' },
  AmountTitle: { fontSize: 36, fontWeight: '900', marginBottom: 10, letterSpacing: -1 },
  Subtitle: { fontSize: 14, fontWeight: '600', textAlign: 'center', lineHeight: 22 },
  AccountCard: { 
    padding: 25, 
    borderRadius: 28,
    borderWidth: 1.5,
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12
  },
  DetailItem: { paddingVertical: 12 },
  Label: { fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginBottom: 6 },
  Value: { fontSize: 16, fontWeight: '800' },
  AcctNumber: { fontSize: 26, fontWeight: '900' },
  Row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  CopyBtn: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  CopyText: { fontWeight: '900', fontSize: 12 },
  Line: { height: 1.5, marginVertical: 10 },
  InfoBox: { marginBottom: 40, padding: 20, borderRadius: 20, alignItems: 'center' },
  InfoText: { fontSize: 13, fontWeight: '600', textAlign: 'center', lineHeight: 20 },
  Btn: { borderRadius: 20, height: 60 }
});