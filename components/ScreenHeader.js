
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icons, COLORS } from '../constants';

export default function ScreenHeader({ title, onBack }) {
  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icons.Back />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={{ width: 40 }} /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#f8fafc'
  },
  title: { fontSize: 18, fontWeight: '800', color: COLORS.slate900 }
});
