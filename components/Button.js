
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants';

export default function Button({ title, onPress, variant = 'primary', loading = false, disabled = false, style, icon }) {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';

  const containerStyle = [
    styles.container,
    isPrimary && styles.primary,
    isSecondary && styles.secondary,
    isOutline && styles.outline,
    disabled && styles.disabled,
    style
  ];

  const textStyle = [
    styles.text,
    isOutline && styles.outlineText,
    disabled && styles.disabledText
  ];

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled || loading} 
      style={containerStyle}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? COLORS.primary : "white"} />
      ) : (
        <>
          {icon}
          <Text style={textStyle}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  primary: { backgroundColor: COLORS.primary },
  secondary: { backgroundColor: COLORS.secondary },
  outline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#e2e8f0' },
  disabled: { backgroundColor: '#cbd5e1', borderColor: '#cbd5e1' },
  text: { color: 'white', fontWeight: '800', fontSize: 16 },
  outlineText: { color: COLORS.slate700 },
  disabledText: { color: '#94a3b8' }
});
