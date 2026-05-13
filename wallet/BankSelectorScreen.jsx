// // screens/wallet/BankSelectorScreen.jsx
// // 🏦 Dedicated Bank Selection Screen - Easy to Use

// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   View, Text, StyleSheet, TouchableOpacity, FlatList,
//   TextInput, ActivityIndicator, SafeAreaView, StatusBar
// } from 'react-native';
// import {
//   ArrowLeft, Search, Building2, CheckCircle
// } from 'lucide-react-native';
// import { useTheme } from '../context/ThemeContext';
// import { getTheme } from '../theme/designSystem';
// import apiClient from '../services/apiClient';

// export default function BankSelectorScreen({ navigation }) {
//   const { isDark } = useTheme();
//   const theme = useMemo(() => getTheme(isDark), [isDark]);

//   // ═══ STATE ═══
//   const [banks, setBanks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedBank, setSelectedBank] = useState(null);

//   // ═══ FETCH BANKS ═══
//   useEffect(() => {
//     fetchBanks();
//   }, []);

//   const fetchBanks = async () => {
//     try {
//       const response = await apiClient.get('/wallet/banks');
//       const banksData = Array.isArray(response.data) ? response.data : [];
      
//       // Sort banks alphabetically
//       const sortedBanks = banksData.sort((a, b) => 
//         a.name.localeCompare(b.name)
//       );
      
//       setBanks(sortedBanks);
//     } catch (error) {
//       console.error('Failed to fetch banks:', error);
//       setBanks([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ═══ FILTERED BANKS ═══
//   const filteredBanks = useMemo(() => {
//     if (!searchQuery.trim()) return banks;
    
//     const query = searchQuery.toLowerCase();
//     return banks.filter(bank =>
//       bank.name.toLowerCase().includes(query) ||
//       bank.code.toLowerCase().includes(query) ||
//       (bank.slug && bank.slug.toLowerCase().includes(query))
//     );
//   }, [banks, searchQuery]);

//   // ═══ SELECT BANK ═══
//   const handleSelectBank = (bank) => {
//     setSelectedBank(bank);
//     // Navigate back with selected bank
//     setTimeout(() => {
//       navigation.navigate('LinkBankAccount', { selectedBank: bank });
//     }, 200); // Small delay for visual feedback
//   };

//   // ═══ RENDER BANK ITEM ═══
//   const renderBankItem = ({ item, index }) => {
//     const isSelected = selectedBank?.code === item.code;

//     return (
//       <TouchableOpacity
//         style={[
//           styles.bankItem,
//           {
//             backgroundColor: theme.colors.card,
//             borderColor: isSelected ? theme.colors.primary : theme.colors.border,
//             borderWidth: isSelected ? 2 : 1,
//           },
//           theme.shadows.sm
//         ]}
//         onPress={() => handleSelectBank(item)}
//         activeOpacity={0.7}
//       >
//         <View style={[styles.bankIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
//           <Building2 size={24} color={theme.colors.primary} strokeWidth={2.5} />
//         </View>

//         <View style={{ flex: 1 }}>
//           <Text style={[theme.typography.bodyLarge, { color: theme.colors.textPrimary }]}>
//             {item.name}
//           </Text>
//           <Text style={[styles.bankCode, { color: theme.colors.textMuted }]}>
//             Code: {item.code}
//           </Text>
//         </View>

//         {isSelected && (
//           <CheckCircle size={24} color={theme.colors.primary} strokeWidth={2.5} />
//         )}
//       </TouchableOpacity>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
//         <ActivityIndicator size="large" color={theme.colors.primary} />
//         <Text style={[theme.typography.bodyMedium, { color: theme.colors.textMuted, marginTop: 16 }]}>
//           Loading banks...
//         </Text>
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
//           Select Your Bank
//         </Text>
//         <View style={{ width: 44 }} />
//       </SafeAreaView>

//       {/* ═══ SEARCH BAR ═══ */}
//       <View style={[styles.searchContainer, { backgroundColor: theme.colors.card }]}>
//         <View style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}>
//           <Search size={20} color={theme.colors.textMuted} strokeWidth={2.5} />
//           <TextInput
//             style={[styles.searchInput, { color: theme.colors.textPrimary }]}
//             placeholder="Search banks..."
//             placeholderTextColor={theme.colors.textMuted}
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             autoFocus={false}
//           />
//           {searchQuery.length > 0 && (
//             <TouchableOpacity onPress={() => setSearchQuery('')}>
//               <Text style={styles.clearButton}>×</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>

//       {/* ═══ RESULTS COUNT ═══ */}
//       <View style={styles.resultsHeader}>
//         <Text style={[theme.typography.bodyMedium, { color: theme.colors.textMuted }]}>
//           {filteredBanks.length} {filteredBanks.length === 1 ? 'bank' : 'banks'} found
//         </Text>
//       </View>

//       {/* ═══ BANK LIST ═══ */}
//       <FlatList
//         data={filteredBanks}
//         renderItem={renderBankItem}
//         keyExtractor={item => item.code}
//         contentContainerStyle={styles.list}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={
//           <View style={styles.emptyState}>
//             <Building2 size={48} color={theme.colors.border} strokeWidth={1.5} />
//             <Text style={[theme.typography.h4, { color: theme.colors.textMuted, marginTop: 16 }]}>
//               No banks found
//             </Text>
//             <Text style={[theme.typography.bodyMedium, { color: theme.colors.textMuted, marginTop: 8 }]}>
//               Try a different search term
//             </Text>
//           </View>
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   centered: { justifyContent: 'center', alignItems: 'center' },
  
//   // Header
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

//   // Search
//   searchContainer: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0,0,0,0.05)',
//   },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     borderRadius: 12,
//     gap: 12,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   clearButton: {
//     fontSize: 28,
//     fontWeight: '300',
//     color: '#999',
//   },

//   // Results
//   resultsHeader: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },

//   // List
//   list: {
//     padding: 16,
//     paddingBottom: 100,
//   },
//   bankItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderRadius: 16,
//     marginBottom: 12,
//   },
//   bankIconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   bankCode: {
//     fontSize: 12,
//     fontWeight: '600',
//     marginTop: 2,
//   },

//   // Empty
//   emptyState: {
//     padding: 40,
//     alignItems: 'center',
//   },
// });










// screens/wallet/BankSelectorScreen.jsx
// 🏦 Dedicated Bank Selection Screen - Easy to Use

import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  TextInput, ActivityIndicator, SafeAreaView, StatusBar
} from 'react-native';
import {
  ArrowLeft, Search, Building2, CheckCircle
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../theme/designSystem';
import apiClient from '../services/apiClient';

export default function BankSelectorScreen({ navigation }) {
  const { isDark } = useTheme();
  const theme = useMemo(() => getTheme(isDark), [isDark]);

  // ═══ STATE ═══
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBank, setSelectedBank] = useState(null);

  // ═══ FETCH BANKS ═══
  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      const response = await apiClient.get('/wallet/banks');
      const banksData = Array.isArray(response.data) ? response.data : [];
      
      // Sort banks alphabetically
      const sortedBanks = banksData.sort((a, b) => 
        a.name.localeCompare(b.name)
      );
      
      setBanks(sortedBanks);
    } catch (error) {
      console.error('Failed to fetch banks:', error);
      setBanks([]);
    } finally {
      setLoading(false);
    }
  };

  // ═══ FILTERED BANKS ═══
  const filteredBanks = useMemo(() => {
    if (!searchQuery.trim()) return banks;
    
    const query = searchQuery.toLowerCase();
    return banks.filter(bank =>
      bank.name.toLowerCase().includes(query) ||
      bank.code.toLowerCase().includes(query) ||
      (bank.slug && bank.slug.toLowerCase().includes(query))
    );
  }, [banks, searchQuery]);

  // ═══ SELECT BANK ═══
  const handleSelectBank = (bank) => {
    setSelectedBank(bank);
    // Navigate back with selected bank
    setTimeout(() => {
      navigation.navigate('LinkBankAccount', { selectedBank: bank });
    }, 200); // Small delay for visual feedback
  };

  // ═══ RENDER BANK ITEM ═══
  const renderBankItem = ({ item, index }) => {
    const isSelected = selectedBank?.code === item.code;

    return (
      <TouchableOpacity
        style={[
          styles.bankItem,
          {
            backgroundColor: theme.colors.card,
            borderColor: isSelected ? theme.colors.primary : theme.colors.border,
            borderWidth: isSelected ? 2 : 1,
          },
          theme.shadows.sm
        ]}
        onPress={() => handleSelectBank(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.bankIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
          <Building2 size={24} color={theme.colors.primary} strokeWidth={2.5} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[theme.typography.bodyLarge, { color: theme.colors.textPrimary }]}>
            {item.name}
          </Text>
          <Text style={[styles.bankCode, { color: theme.colors.textMuted }]}>
            Code: {item.code}
          </Text>
        </View>

        {isSelected && (
          <CheckCircle size={24} color={theme.colors.primary} strokeWidth={2.5} />
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[theme.typography.bodyMedium, { color: theme.colors.textMuted, marginTop: 16 }]}>
          Loading banks...
        </Text>
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
        <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>
          Select Your Bank
        </Text>
        <View style={{ width: 44 }} />
      </SafeAreaView>

      {/* ═══ SEARCH BAR ═══ */}
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.card }]}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}>
          <Search size={20} color={theme.colors.textMuted} strokeWidth={2.5} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.textPrimary }]}
            placeholder="Search banks..."
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearButton}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ═══ RESULTS COUNT ═══ */}
      <View style={styles.resultsHeader}>
        <Text style={[theme.typography.bodyMedium, { color: theme.colors.textMuted }]}>
          {filteredBanks.length} {filteredBanks.length === 1 ? 'bank' : 'banks'} found
        </Text>
      </View>

      {/* ═══ BANK LIST ═══ */}
      <FlatList
        data={filteredBanks}
        renderItem={renderBankItem}
        keyExtractor={item => item.code}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Building2 size={48} color={theme.colors.border} strokeWidth={1.5} />
            <Text style={[theme.typography.h4, { color: theme.colors.textMuted, marginTop: 16 }]}>
              No banks found
            </Text>
            <Text style={[theme.typography.bodyMedium, { color: theme.colors.textMuted, marginTop: 8 }]}>
              Try a different search term
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  
  // Header
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

  // Search
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    fontSize: 28,
    fontWeight: '300',
    color: '#999',
  },

  // Results
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  // List
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  bankIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bankCode: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },

  // Empty
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
});