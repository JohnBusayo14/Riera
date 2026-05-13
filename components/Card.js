
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants';

export default function Card({ children, style, onPress }) {
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container 
      onPress={onPress} 
      style={[styles.card, style]}
      activeOpacity={0.9}
    >
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  }
});
