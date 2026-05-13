// import React, { useState, useCallback } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   ScrollView, 
//   TouchableOpacity, 
//   ActivityIndicator, 
//   RefreshControl,
//   SafeAreaView,
//   Platform,
//   StatusBar
// } from 'react-native';
// import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import { Eye, EyeOff, Plus, ArrowLeft, ArrowDownLeft, ArrowUpRight, Banknote, Clock } from 'lucide-react-native';

// // Professional context and theme integration
// import { useTheme } from '../context/ThemeContext';
// import Card from '../components/Card';
// import { walletApi } from '../api/walletApi';

// export default function WalletScreen() {
//   const Navigation = useNavigation();
//   const { colors: Colors, isDark: IsDark } = useTheme();
  
//   // --- STATE ---
//   const [Balance, setBalance] = useState(0);
//   const [Transactions, setTransactions] = useState([]); 
//   const [Loading, setLoading] = useState(true);
//   const [Refreshing, setRefreshing] = useState(false);
//   const [ShowBalance, setShowBalance] = useState(true);

//   // --- DYNAMIC UI THEME ---
//   const UI = {
//     Bg: IsDark ? '#0F172A' : Colors.Background,
//     Surface: Colors.Surface,   
//     Text: Colors.TextPrimary,
//     Muted: Colors.TextSecondary,
//     Primary: Colors.Primary,
//     Border: Colors.Border,
    
//     SuccessBg: IsDark ? 'rgba(74, 222, 128, 0.08)' : '#f0fdf4',
//     SuccessText: IsDark ? '#4ade80' : '#16a34a',
//     DangerBg: IsDark ? 'rgba(248, 113, 113, 0.08)' : '#fef2f2',
//     DangerText: IsDark ? '#f87171' : '#ef4444',
//     InfoBg: IsDark ? 'rgba(59, 130, 246, 0.08)' : '#eff6ff', // For Withdrawals
//     InfoText: IsDark ? '#60a5fa' : '#2563eb',
//     WarningBg: IsDark ? 'rgba(251, 191, 36, 0.08)' : '#fff7ed',
//     WarningText: IsDark ? '#fbbf24' : '#f59e0b',
//   };

//   /**
//    * UPDATED: Now calls the main GetWallet endpoint that returns 
//    * the combined history of General Transactions + Withdrawals.
//    */
//   const FetchWalletData = async () => {
//     try {
//       // Use the combined endpoint from your Controller [cite: 2026-03-05]
//       const response = await walletApi.getWallet();
      
//       // Handle PascalCase from C# DTOs
//       const currentBalance = response.Balance ?? response.balance ?? 0;
//       const history = response.Transactions ?? response.transactions ?? [];
        
//       setBalance(Number(currentBalance));
//       setTransactions(history);
//     } catch (Err) {
//       console.error("RieRa Wallet Sync Error:", Err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       FetchWalletData();
//     }, [])
//   );

//   // Helper to determine icon based on the "Type" string from backend
//   const getTxStyle = (type) => {
//     switch (type?.toUpperCase()) {
//       case 'CREDIT':
//         return { icon: <ArrowDownLeft size={20} color={UI.SuccessText} strokeWidth={3} />, bg: UI.SuccessBg, text: UI.SuccessText, prefix: '+' };
//       case 'WITHDRAWAL':
//         return { icon: <Banknote size={20} color={UI.InfoText} strokeWidth={2.5} />, bg: UI.InfoBg, text: UI.InfoText, prefix: '-' };
//       default: // DEBIT or others
//         return { icon: <ArrowUpRight size={20} color={UI.DangerText} strokeWidth={3} />, bg: UI.DangerBg, text: UI.Text, prefix: '-' };
//     }
//   };

//   if (Loading && !Refreshing) {
//     return (
//       <View style={[styles.Container, styles.Centered, { backgroundColor: UI.Bg }]}>
//         <ActivityIndicator size="large" color={UI.Primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.Container, { backgroundColor: UI.Bg }]}>
//       <StatusBar barStyle={IsDark ? 'light-content' : 'dark-content'} />
      
//       <SafeAreaView style={[styles.HeaderWrapper, { backgroundColor: UI.Bg, borderBottomColor: UI.Border }]}>
//         <View style={styles.CompactHeader}>
//           <TouchableOpacity style={styles.BackButton} onPress={() => Navigation.goBack()}>
//             <ArrowLeft size={24} color={UI.Text} strokeWidth={3} />
//           </TouchableOpacity>
//           <Text style={[styles.HeaderTitle, { color: UI.Text }]}>My Wallet</Text>
//           <View style={{ width: 40 }} /> 
//         </View>
//       </SafeAreaView>

//       <ScrollView 
//         contentContainerStyle={styles.Scroll}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl 
//             refreshing={Refreshing} 
//             onRefresh={() => {setRefreshing(true); FetchWalletData();}} 
//             tintColor={UI.Primary} 
//           />
//         }
//       >
//         {/* BALANCE CARD */}
//         <Card style={[styles.BalanceCard, { backgroundColor: IsDark ? UI.Surface : '#0f172a' }]}>
//           <View style={styles.BalanceHeader}>
//             <Text style={styles.BalanceLabel}>TOTAL BALANCE (ZAR)</Text>
//             <TouchableOpacity onPress={() => setShowBalance(!ShowBalance)} hitSlop={15}>
//                {ShowBalance ? <EyeOff color="rgba(255,255,255,0.7)" size={18} /> : <Eye color="rgba(255,255,255,0.7)" size={18} />}
//             </TouchableOpacity>
//           </View>

//           <Text style={styles.BalanceAmount} numberOfLines={1}>
//             {ShowBalance ? `R ${Number(Balance).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}` : '••••••••'}
//           </Text>
          
//           <View style={styles.BalanceFooter}>
//             <TouchableOpacity style={styles.ActionBtn} onPress={() => Navigation.navigate('AddFunds')}>
//               <View style={[styles.AddIconCircle, { backgroundColor: IsDark ? UI.Primary : 'white' }]}>
//                 <Plus color={IsDark ? 'white' : '#0f172a'} size={14} strokeWidth={4} />
//               </View>
//               <Text style={styles.ActionBtnText}>Fund Wallet</Text>
//             </TouchableOpacity>

//             <View style={styles.VerticalDivider} />

//             <TouchableOpacity style={styles.ActionBtn} onPress={() => Navigation.navigate('WithdrawFunds')}>
//               <View style={styles.WithdrawIconCircle}>
//                 <Banknote color="white" size={14} strokeWidth={2.5} />
//               </View>
//               <Text style={styles.ActionBtnText}>Withdraw</Text>
//             </TouchableOpacity>
//           </View>
//         </Card>

//         {/* ACTIVITY LIST */}
//         <View style={styles.SectionHeader}>
//           <Text style={[styles.SectionTitle, { color: UI.Text }]}>Transaction History</Text>
//         </View>

//         {Transactions.length === 0 ? (
//           <View style={styles.Empty}>
//             <Text style={[styles.EmptyText, { color: UI.Muted }]}>No transactions found</Text>
//           </View>
//         ) : (
//           Transactions.map((Tx, Index) => {
//             const txStyle = getTxStyle(Tx.Type || Tx.type);
//             const Status = (Tx.Status || Tx.status)?.toUpperCase() || 'PENDING';
//             const timestamp = Tx.Timestamp || Tx.timestamp;
            
//             return (
//               <View key={Tx.Id || Index} style={[styles.TxItem, { borderBottomColor: UI.Border }]}>
//                 <View style={[styles.TxIcon, { backgroundColor: txStyle.bg }]}>
//                   {txStyle.icon}
//                 </View>
                
//                 <View style={styles.TxDetails}>
//                   <Text style={[styles.TxTitle, { color: UI.Text }]} numberOfLines={1}>
//                     {Tx.Description || Tx.description}
//                   </Text>
//                   <Text style={[styles.TxDate, { color: UI.Muted }]}>
//                     {timestamp ? new Date(timestamp).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Recently'}
//                   </Text>
//                 </View>

//                 <View style={styles.TxAmountContainer}>
//                   <Text style={[styles.TxAmount, { color: txStyle.text }]}>
//                     {txStyle.prefix}R {Number(Tx.Amount || Tx.amount).toFixed(2)}
//                   </Text>
//                   <View style={[styles.StatusBadge, { backgroundColor: Status === 'SUCCESS' || Status === 'COMPLETED' ? UI.SuccessBg : UI.WarningBg }]}>
//                     <Text style={[styles.TxStatus, { color: Status === 'SUCCESS' || Status === 'COMPLETED' ? UI.SuccessText : UI.WarningText }]}>
//                       {Status}
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//             );
//           })
//         )}
//       </ScrollView>
//     </View>
//   );
// }



// const styles = StyleSheet.create({
//   Container: { flex: 1 },
//   Centered: { justifyContent: 'center', alignItems: 'center' },
//   HeaderWrapper: { 
//     borderBottomWidth: 1, 
//     paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
//   },
//   CompactHeader: { 
//     height: 60,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 15,
//   },
//   BackButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
//   HeaderTitle: { fontSize: 18, fontWeight: '800' },
//   Scroll: { padding: 20 },
  
//   BalanceCard: { 
//     padding: 24, 
//     borderRadius: 28, 
//     marginBottom: 35,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 8 },
//         shadowOpacity: 0.3,
//         shadowRadius: 12,
//       },
//       android: { elevation: 8 }
//     })
//   },
//   BalanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   BalanceLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
//   BalanceAmount: { color: 'white', fontSize: 34, fontWeight: '900', marginVertical: 12 },
//   EyeContainer: { padding: 5 },

//   BalanceFooter: { 
//     marginTop: 20, 
//     borderTopWidth: 1, 
//     borderTopColor: 'rgba(255,255,255,0.1)', 
//     paddingTop: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   ActionBtn: { flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center' },
//   ActionBtnText: { color: 'white', fontWeight: '800', fontSize: 14, marginLeft: 10 },
//   VerticalDivider: { width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.1)' },
  
//   AddIconCircle: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
//   WithdrawIconCircle: { 
//     width: 24, 
//     height: 24, 
//     borderRadius: 12, 
//     backgroundColor: 'rgba(255,255,255,0.1)', 
//     justifyContent: 'center', 
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.2)'
//   },

//   SectionHeader: { marginBottom: 15 },
//   SectionTitle: { fontSize: 20, fontWeight: '800' },
  
//   Empty: { padding: 40, alignItems: 'center' },
//   EmptyText: { fontWeight: '600', fontSize: 14 },
  
//   TxItem: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     paddingVertical: 15, 
//     borderBottomWidth: 1, 
//   },
//   TxIcon: { 
//     width: 48, 
//     height: 48, 
//     borderRadius: 14, 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     marginRight: 15 
//   },
//   TxDetails: { flex: 1 },
//   TxTitle: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
//   TxDate: { fontSize: 12, fontWeight: '500' },
  
//   TxAmountContainer: { alignItems: 'flex-end' },
//   TxAmount: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
//   StatusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
//   TxStatus: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase' }
// });

















// // screens/wallet/WalletScreen.jsx
// // 💰 Professional Wallet Screen - Dark Mode Default

// import React, { useState, useCallback, useMemo } from 'react';
// import { 
//   View, Text, StyleSheet, ScrollView, TouchableOpacity, 
//   ActivityIndicator, RefreshControl, SafeAreaView, StatusBar,
//   Alert
// } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import { 
//   Eye, EyeOff, Plus, ArrowLeft, ArrowDownLeft, ArrowUpRight, 
//   Send, CreditCard, TrendingUp, Clock, CheckCircle, XCircle
// } from 'lucide-react-native';
// import { LinearGradient } from 'expo-linear-gradient';

// import { useTheme } from '../context/ThemeContext';
// import { getTheme } from '../theme/designSystem';
// import apiClient from '../services/apiClient';

// export default function WalletScreen({ navigation }) {
//   const { isDark } = useTheme();
//   const theme = useMemo(() => getTheme(isDark), [isDark]);

//   // ═══ STATE ═══
//   const [balance, setBalance] = useState(0);
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [showBalance, setShowBalance] = useState(true);
//   const [hasPin, setHasPin] = useState(false);

//   // ═══ FETCH DATA ═══
// const fetchWalletData = useCallback(async () => {
//   try {
//     const [balanceRes, txRes, statusRes] = await Promise.all([
//       apiClient.get('/wallet/balance'),
//       apiClient.get('/wallet/transactions'),
//       apiClient.get('/wallet/status')
//     ]);

//     // Check for both lowercase 'balance' and uppercase 'Balance'
//     const newBalance = balanceRes.data?.balance ?? balanceRes.data?.Balance ?? 0;
//     setBalance(Number(newBalance));
    
//     setTransactions(Array.isArray(txRes.data) ? txRes.data : []);
//     setHasPin(statusRes.data?.hasPin || statusRes.data?.HasPin || false);
//   } catch (error) {
//     console.error('Wallet fetch error:', error);
//     // Do not set balance to undefined on error; keep it as a number
//     setBalance(0);
//     Alert.alert('Error', 'Failed to load wallet data');
//   } finally {
//     setLoading(false);
//     setRefreshing(false);
//   }
// }, []);

//   useFocusEffect(
//     useCallback(() => {
//       fetchWalletData();
//     }, [fetchWalletData])
//   );

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchWalletData();
//   }, [fetchWalletData]);

//   // ═══ STATS ═══
//   const stats = useMemo(() => {
//     const thisMonth = transactions.filter(tx => {
//       const txDate = new Date(tx.timestamp);
//       const now = new Date();
//       return txDate.getMonth() === now.getMonth() && 
//              txDate.getFullYear() === now.getFullYear();
//     });

//     const income = thisMonth
//       .filter(tx => tx.type === 'CREDIT')
//       .reduce((sum, tx) => sum + tx.amount, 0);

//     const expenses = thisMonth
//       .filter(tx => tx.type === 'DEBIT')
//       .reduce((sum, tx) => sum + tx.amount, 0);

//     return { income, expenses, count: thisMonth.length };
//   }, [transactions]);

//   if (loading && !refreshing) {
//     return (
//       <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
//         <ActivityIndicator size="large" color={theme.colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
//       <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

//       {/* ═══ HEADER ═══ */}
//       <SafeAreaView style={[styles.header, { backgroundColor: theme.colors.card }]}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
//           <ArrowLeft size={24} color={theme.colors.textPrimary} strokeWidth={2.5} />
//         </TouchableOpacity>
//         <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>
//           Wallet
//         </Text>
//         <TouchableOpacity 
//           onPress={() => navigation.navigate('TransactionHistory')}
//           style={styles.headerButton}
//         >
//           <Clock size={24} color={theme.colors.textPrimary} strokeWidth={2.5} />
//         </TouchableOpacity>
//       </SafeAreaView>

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
//         }
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* ═══ BALANCE CARD ═══ */}
//         <LinearGradient
//           colors={isDark ? ['#10B981', '#059669'] : ['#0F172A', '#1E293B']}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={[styles.balanceCard, theme.shadows.lg]}
//         >
//           <View style={styles.balanceHeader}>
//             <View>
//               <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>
//               <View style={styles.balanceRow}>
//                 <Text style={styles.currency}>ZAR</Text>
//                 // Replace the existing balance render logic with this:
// <Text style={styles.balanceAmount}>
//   {showBalance 
//     ? (Number(balance) || 0).toFixed(2) 
//     : '••••••'}
// </Text>
//               </View>
//             </View>
//             <TouchableOpacity onPress={() => setShowBalance(!showBalance)} style={styles.eyeButton}>
//               {showBalance ? (
//                 <EyeOff size={22} color="rgba(255,255,255,0.8)" strokeWidth={2.5} />
//               ) : (
//                 <Eye size={22} color="rgba(255,255,255,0.8)" strokeWidth={2.5} />
//               )}
//             </TouchableOpacity>
//           </View>

//           {/* Actions */}
//           <View style={styles.actions}>
//             <TouchableOpacity 
//               style={styles.actionButton}
//               onPress={() => navigation.navigate('AddFunds')}
//             >
//               <View style={[styles.actionIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
//                 <Plus size={20} color="#FFF" strokeWidth={3} />
//               </View>
//               <Text style={styles.actionText}>Add Funds</Text>
//             </TouchableOpacity>

//             <TouchableOpacity 
//               style={styles.actionButton}
//               onPress={() => {
//                 if (!hasPin) {
//                   Alert.alert(
//                     'Security Required',
//                     'Please set up a transaction PIN first.',
//                     [{ text: 'Setup PIN', onPress: () => navigation.navigate('SetPin') }]
//                   );
//                 } else {
//                   navigation.navigate('WithdrawFunds');
//                 }
//               }}
//             >
//               <View style={[styles.actionIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
//                 <Send size={20} color="#FFF" strokeWidth={3} />
//               </View>
//               <Text style={styles.actionText}>Withdraw</Text>
//             </TouchableOpacity>

//             <TouchableOpacity 
//               style={styles.actionButton}
//               onPress={() => navigation.navigate('ManageBankAccounts')}
//             >
//               <View style={[styles.actionIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
//                 <CreditCard size={20} color="#FFF" strokeWidth={3} />
//               </View>
//               <Text style={styles.actionText}>Banks</Text>
//             </TouchableOpacity>
//           </View>
//         </LinearGradient>

//         {/* ═══ STATS ROW ═══ */}
//         <View style={styles.statsRow}>
//           <View style={[styles.statCard, { backgroundColor: theme.colors.card }, theme.shadows.sm]}>
//             <View style={[styles.statIcon, { backgroundColor: '#10B98120' }]}>
//               <ArrowDownLeft size={20} color="#10B981" strokeWidth={2.5} />
//             </View>
//             <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Income</Text>
//             <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
//               R{(Number(stats?.income) || 0).toFixed(2)}
//             </Text>
//           </View>

//           <View style={[styles.statCard, { backgroundColor: theme.colors.card }, theme.shadows.sm]}>
//             <View style={[styles.statIcon, { backgroundColor: '#EF444420' }]}>
//               <ArrowUpRight size={20} color="#EF4444" strokeWidth={2.5} />
//             </View>
//             <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Expenses</Text>
//             <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
//               R{(Number(stats?.expenses) || 0).toFixed(2)}
//             </Text>
//           </View>

//           <View style={[styles.statCard, { backgroundColor: theme.colors.card }, theme.shadows.sm]}>
//             <View style={[styles.statIcon, { backgroundColor: '#3B82F620' }]}>
//               <TrendingUp size={20} color="#3B82F6" strokeWidth={2.5} />
//             </View>
//             <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>This Month</Text>
//             <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
//               {stats.count}
//             </Text>
//           </View>
//         </View>

//         {/* ═══ RECENT TRANSACTIONS ═══ */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>
//               Recent Activity
//             </Text>
//             <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}>
//               <Text style={[styles.seeAll, { color: theme.colors.primary }]}>See All</Text>
//             </TouchableOpacity>
//           </View>

//           {transactions.length === 0 ? (
//             <View style={styles.emptyState}>
//               <Text style={[theme.typography.bodyLarge, { color: theme.colors.textMuted }]}>
//                 No transactions yet
//               </Text>
//             </View>
//           ) : (
//             transactions.slice(0, 5).map((tx, index) => {
//               const isCredit = tx.type === 'CREDIT';
//               const isSuccess = tx.status === 'SUCCESS';

//               return (
//                 <TouchableOpacity
//                   key={tx.id || index}
//                   style={[
//                     styles.txCard,
//                     { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
//                     theme.shadows.sm
//                   ]}
//                   onPress={() => {
//                     // Navigate to transaction detail if needed
//                   }}
//                 >
//                   <View style={[
//                     styles.txIcon,
//                     { backgroundColor: isCredit ? '#10B98120' : '#EF444420' }
//                   ]}>
//                     {isCredit ? (
//                       <ArrowDownLeft size={20} color="#10B981" strokeWidth={2.5} />
//                     ) : (
//                       <ArrowUpRight size={20} color="#EF4444" strokeWidth={2.5} />
//                     )}
//                   </View>

//                   <View style={styles.txContent}>
//                     <Text style={[theme.typography.bodyLarge, { color: theme.colors.textPrimary }]}>
//                       {tx.description || (isCredit ? 'Received' : 'Sent')}
//                     </Text>
//                     <Text style={[styles.txDate, { color: theme.colors.textMuted }]}>
//                       {new Date(tx.timestamp).toLocaleDateString('en-ZA', {
//                         month: 'short',
//                         day: 'numeric',
//                         hour: '2-digit',
//                         minute: '2-digit'
//                       })}
//                     </Text>
//                   </View>

//                   <View style={styles.txRight}>
//                     <Text style={[
//                       styles.txAmount,
//                       { color: isCredit ? '#10B981' : theme.colors.textPrimary }
//                     ]}>
//                       {isCredit ? '+' : '-'}R{(Number(tx.amount) || 0).toFixed(2)}
//                     </Text>
//                     <View style={styles.statusBadge}>
//                       {isSuccess ? (
//                         <CheckCircle size={12} color="#10B981" strokeWidth={2.5} />
//                       ) : (
//                         <XCircle size={12} color="#F59E0B" strokeWidth={2.5} />
//                       )}
//                       <Text style={[
//                         styles.statusText,
//                         { color: isSuccess ? '#10B981' : '#F59E0B' }
//                       ]}>
//                         {tx.status}
//                       </Text>
//                     </View>
//                   </View>
//                 </TouchableOpacity>
//               );
//             })
//           )}
//         </View>

//         {/* Security Notice */}
//         {!hasPin && (
//           <TouchableOpacity
//             style={[styles.securityNotice, { backgroundColor: '#F59E0B20', borderColor: '#F59E0B40' }]}
//             onPress={() => navigation.navigate('SetPin')}
//           >
//             <Text style={[theme.typography.bodyMedium, { color: '#F59E0B' }]}>
//               ⚠️ Setup transaction PIN for secure withdrawals
//             </Text>
//           </TouchableOpacity>
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   centered: { justifyContent: 'center', alignItems: 'center' },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0,0,0,0.05)',
//   },
//   headerButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   scrollContent: {
//     padding: 16,
//     paddingBottom: 100,
//   },

//   // Balance Card
//   balanceCard: {
//     borderRadius: 24,
//     padding: 24,
//     marginBottom: 20,
//   },
//   balanceHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 24,
//   },
//   balanceLabel: {
//     fontSize: 11,
//     fontWeight: '800',
//     color: 'rgba(255,255,255,0.7)',
//     letterSpacing: 1.2,
//     marginBottom: 8,
//   },
//   balanceRow: {
//     flexDirection: 'row',
//     alignItems: 'baseline',
//     gap: 8,
//   },
//   currency: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: 'rgba(255,255,255,0.8)',
//   },
//   balanceAmount: {
//     fontSize: 40,
//     fontWeight: '900',
//     color: '#FFF',
//   },
//   eyeButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   // Actions
//   actions: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   actionButton: {
//     flex: 1,
//     alignItems: 'center',
//     gap: 8,
//   },
//   actionIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   actionText: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: '#FFF',
//   },

//   // Stats
//   statsRow: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 20,
//   },
//   statCard: {
//     flex: 1,
//     padding: 16,
//     borderRadius: 16,
//   },
//   statIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   statLabel: {
//     fontSize: 12,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   statValue: {
//     fontSize: 20,
//     fontWeight: '900',
//   },

//   // Section
//   section: {
//     marginBottom: 20,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   seeAll: {
//     fontSize: 14,
//     fontWeight: '700',
//   },

//   // Transaction Card
//   txCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderRadius: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//   },
//   txIcon: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   txContent: {
//     flex: 1,
//   },
//   txDate: {
//     fontSize: 12,
//     fontWeight: '600',
//     marginTop: 2,
//   },
//   txRight: {
//     alignItems: 'flex-end',
//   },
//   txAmount: {
//     fontSize: 16,
//     fontWeight: '900',
//     marginBottom: 4,
//   },
//   statusBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   statusText: {
//     fontSize: 10,
//     fontWeight: '700',
//     textTransform: 'uppercase',
//   },

//   // Empty
//   emptyState: {
//     padding: 40,
//     alignItems: 'center',
//   },

//   // Security Notice
//   securityNotice: {
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//     marginTop: 20,
//   },
// });






// screens/wallet/WalletScreen.jsx
// 💰 Production-Ready Wallet Dashboard (Optimized for ZAR & C# Backend)

import React, { useState, useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Alert, 
  Platform
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  Eye, EyeOff, Plus, ArrowLeft, ArrowDownLeft, ArrowUpRight,
  Send, CreditCard, TrendingUp, Clock, ShieldAlert
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../theme/designSystem';
import { walletApi } from '../api/walletApi'; 

export default function WalletScreen({ navigation }) {
  const { isDark } = useTheme();
  const theme = useMemo(() => getTheme(isDark), [isDark]);

  // ═══ STATE ═══
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [hasPin, setHasPin] = useState(false);

  // ═══ HELPERS ═══
  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString('en-ZA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // ═══ FETCH DATA ═══
  const fetchWalletData = useCallback(async () => {
    try {
      const data = await walletApi.getWallet();
      setBalance(data.Balance ?? data.balance ?? 0);
      setTransactions(Array.isArray(data.Transactions || data.transactions) 
        ? (data.Transactions || data.transactions) 
        : []);
      
      setHasPin(true); // Placeholder
    } catch (error) {
      console.error('Wallet fetch error:', error);
      Alert.alert('Connection Error', 'Could not refresh wallet data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchWalletData();
    }, [fetchWalletData])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWalletData();
  }, [fetchWalletData]);

  // ═══ STATS CALCULATION ═══
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonthTxs = transactions.filter(tx => {
      const txDate = new Date(tx.Timestamp || tx.timestamp);
      return txDate.getMonth() === now.getMonth() &&
             txDate.getFullYear() === now.getFullYear();
    });

    const income = thisMonthTxs
      .filter(tx => (tx.Type || tx.type)?.toUpperCase() === 'CREDIT')
      .reduce((sum, tx) => sum + (Number(tx.Amount || tx.amount) || 0), 0);

    const expenses = thisMonthTxs
      .filter(tx => (tx.Type || tx.type)?.toUpperCase() === 'DEBIT')
      .reduce((sum, tx) => sum + (Number(tx.Amount || tx.amount) || 0), 0);

    return { income, expenses, count: thisMonthTxs.length };
  }, [transactions]);

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* ═══ HEADER ═══ */}
      <SafeAreaView style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <ArrowLeft size={24} color={theme.colors.textPrimary} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={[theme.typography.h3, { color: theme.colors.textPrimary, fontWeight: '800' }]}>
          My Wallet
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('TransactionHistory')}
          style={styles.headerButton}
        >
          <Clock size={24} color={theme.colors.textPrimary} strokeWidth={2.5} />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* ═══ BALANCE CARD ═══ */}
        <LinearGradient
          colors={isDark ? ['#10B981', '#059669'] : ['#106324', '#0A4118']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.balanceCard, theme.shadows.lg]}
        >
          <View style={styles.balanceHeader}>
            <View>
              <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>
              <View style={styles.balanceRow}>
                <Text style={styles.currency}>R</Text>
                <Text style={styles.balanceAmount}>
                  {showBalance ? formatCurrency(balance) : '••••••'}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              onPress={() => setShowBalance(!showBalance)} 
              style={styles.eyeButton}
            >
              {showBalance ? (
                <EyeOff size={22} color="rgba(255,255,255,0.8)" strokeWidth={2} />
              ) : (
                <Eye size={22} color="rgba(255,255,255,0.8)" strokeWidth={2} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AddFunds')}>
              <View style={styles.actionIcon}>
                <Plus size={20} color="#FFF" strokeWidth={3} />
              </View>
              <Text style={styles.actionText}>Add Funds</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => {
                if (!hasPin) {
                  Alert.alert(
                    'Security Required',
                    'Please set up a transaction PIN first.',
                    [{ text: 'Setup PIN', onPress: () => navigation.navigate('SetPin') }]
                  );
                } else {
                  navigation.navigate('WithdrawFunds');
                }
              }}
            >
              <View style={styles.actionIcon}>
                <Send size={20} color="#FFF" strokeWidth={3} />
              </View>
              <Text style={styles.actionText}>Withdraw</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('BankSelector')}>
              <View style={styles.actionIcon}>
                <CreditCard size={20} color="#FFF" strokeWidth={3} />
              </View>
              <Text style={styles.actionText}>Banks</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* ═══ STATS ROW ═══ */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.card }, theme.shadows.sm]}>
            <View style={[styles.statIcon, { backgroundColor: '#10B98120' }]}>
              <ArrowDownLeft size={18} color="#10B981" strokeWidth={2.5} />
            </View>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>This Month In</Text>
            <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>R{Math.round(stats.income)}</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.colors.card }, theme.shadows.sm]}>
            <View style={[styles.statIcon, { backgroundColor: '#EF444420' }]}>
              <ArrowUpRight size={18} color="#EF4444" strokeWidth={2.5} />
            </View>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>This Month Out</Text>
            <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>R{Math.round(stats.expenses)}</Text>
          </View>
        </View>

        {/* ═══ WALLET ACTIVITY (ALL TRANSACTIONS) ═══ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[theme.typography.h3, { color: theme.colors.textPrimary, fontWeight: '800' }]}>
              Wallet Activity
            </Text>
            {/* "See All" removed from here */}
          </View>

          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[theme.typography.bodyLarge, { color: theme.colors.textMuted }]}>
                No transactions found
              </Text>
            </View>
          ) : (
            // REMOVED .slice(0, 5) to show all
            transactions.map((tx, index) => {
              const type = (tx.Type || tx.type || 'DEBIT').toUpperCase();
              const status = (tx.Status || tx.status || 'PENDING').toUpperCase();
              const amount = tx.Amount ?? tx.amount ?? 0;
              const description = tx.Description || tx.description;
              const timestamp = tx.Timestamp || tx.timestamp;

              const isCredit = type === 'CREDIT';
              const isSuccess = status === 'SUCCESS';
              const isFailed = status === 'FAILED';

              return (
                <TouchableOpacity
                  key={tx.Id || tx.id || index}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('TransactionDetail', { transaction: tx })}
                  style={[
                    styles.txCard,
                    { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
                    theme.shadows.sm
                  ]}
                >
                  <View style={[
                    styles.txIconBase, 
                    { backgroundColor: isCredit ? '#10B98115' : '#EF444415' }
                  ]}>
                    {isCredit ? (
                      <ArrowDownLeft size={20} color="#10B981" strokeWidth={2.5} />
                    ) : (
                      <ArrowUpRight size={20} color="#EF4444" strokeWidth={2.5} />
                    )}
                  </View>

                  <View style={styles.txContent}>
                    <Text 
                      numberOfLines={1} 
                      style={[theme.typography.bodyLarge, { color: theme.colors.textPrimary, fontWeight: '700' }]}
                    >
                      {description || (isCredit ? 'Wallet Top-up' : 'Withdrawal')}
                    </Text>
                    <Text style={[styles.txDate, { color: theme.colors.textMuted }]}>
                      {new Date(timestamp).toLocaleDateString('en-ZA', { 
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </Text>
                  </View>

                  <View style={styles.txRight}>
                    <Text style={[
                      styles.txAmount, 
                      { color: isCredit ? '#10B981' : theme.colors.textPrimary }
                    ]}>
                      {isCredit ? '+' : '-'} R{formatCurrency(amount)}
                    </Text>
                    <View style={styles.statusBadge}>
                      <View style={[
                        styles.statusDot, 
                        { backgroundColor: isSuccess ? '#10B981' : isFailed ? '#EF4444' : '#F59E0B' }
                      ]} />
                      <Text style={[
                        styles.statusText, 
                        { color: isSuccess ? '#10B981' : isFailed ? '#EF4444' : '#F59E0B' }
                      ]}>
                        {status}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {!hasPin && (
          <TouchableOpacity
            style={[styles.securityNotice, { backgroundColor: isDark ? '#F59E0B10' : '#FFFBEB', borderColor: '#F59E0B40' }]}
            onPress={() => navigation.navigate('SetPin')}
          >
            <ShieldAlert size={20} color="#F59E0B" style={{ marginRight: 12 }} />
            <Text style={[theme.typography.bodyMedium, { color: '#D97706', flex: 1, fontWeight: '700' }]}>
              Setup transaction PIN for secure withdrawals
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: { padding: 16, paddingBottom: 40 },
  balanceCard: { borderRadius: 28, padding: 24, marginBottom: 24 },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  balanceLabel: { fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, marginBottom: 4 },
  balanceRow: { flexDirection: 'row', alignItems: 'baseline' },
  currency: { fontSize: 20, fontWeight: '700', color: 'rgba(255,255,255,0.8)', marginRight: 6 },
  balanceAmount: { fontSize: 36, fontWeight: '900', color: '#FFF' },
  eyeButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButton: { alignItems: 'center', flex: 1 },
  actionIcon: { width: 52, height: 52, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionText: { fontSize: 12, fontWeight: '800', color: '#FFF' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, padding: 16, borderRadius: 20 },
  statIcon: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statLabel: { fontSize: 11, fontWeight: '700', marginBottom: 2 },
  statValue: { fontSize: 18, fontWeight: '900' },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  seeAll: { fontSize: 14, fontWeight: '800' },
  txCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, marginBottom: 12, borderWidth: 1 },
  txIconBase: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  txContent: { flex: 1 },
  txDate: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  txRight: { alignItems: 'flex-end' },
  txAmount: { fontSize: 16, fontWeight: '900', marginBottom: 4 },
  statusBadge: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  emptyState: { padding: 40, alignItems: 'center' },
  securityNotice: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginTop: 10 },
});