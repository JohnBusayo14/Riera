
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';

export default function SettingSection({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 30 },
  sectionTitle: { 
    fontSize: 11, 
    fontWeight: '900', 
    color: COLORS.slate400, 
    letterSpacing: 1.5, 
    marginBottom: 12, 
    marginLeft: 10 
  },
  sectionCard: { 
    backgroundColor: 'white', 
    borderRadius: 24, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: '#f1f5f9' 
  },
});
