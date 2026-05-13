import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, View, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import WalletScreen from './WalletScreen';
import { walletApi } from '../api/walletApi';

export default function WalletContainer({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  /**
   * Fetches data from backend.
   * Note: All currency logic and formatting is handled on the backend [cite: 2026-01-09].
   */
  const fetchWalletData = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) setLoading(true);
      
      // Using the main [HttpGet] endpoint which returns WalletResponse 
      // containing both Balance and Transactions.
      const data = await walletApi.getWallet();
      
      // Important: C# DTOs use PascalCase (Balance)
      setBalance(data.Balance ?? data.balance ?? 0);
      setTransactions(data.Transactions ?? data.transactions ?? []);
      
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
      Alert.alert("Error", "Could not update wallet balance.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Re-fetch data whenever the screen comes into focus (e.g., after payment)
  useFocusEffect(
    useCallback(() => {
      fetchWalletData();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchWalletData(true);
  };

  if (loading && !refreshing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <WalletScreen 
      balance={balance} 
      transactions={transactions} 
      refreshing={refreshing}
      onRefresh={handleRefresh}
      onAddFunds={() => navigation.navigate('AddFunds')}
      // Pass navigation to allow viewing transaction details if needed
      navigation={navigation} 
    />
  );
}