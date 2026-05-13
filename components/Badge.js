
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Badge({ label, type = 'default' }) {
  const getColors = () => {
    switch(label) {
      case 'Pending': return { bg: '#fef3c7', text: '#b45309' };
      case 'Accepted': return { bg: '#dcfce7', text: '#166534' };
      case 'In Transit': return { bg: '#dbeafe', text: '#1e40af' };
      case 'Delivered': return { bg: '#f1f5f9', text: '#475569' };
      default: return { bg: '#f1f5f9', text: '#64748b' };
    }
  };

  const colors = getColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  text: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase' }
});
