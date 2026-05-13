
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { COLORS, Icons } from '../../constants';

export default function SettingItem({ 
  icon, 
  label, 
  subLabel, 
  value, 
  onValueChange, 
  type = 'navigate', 
  onPress 
}) {
  
  // Safe icon rendering logic
  const renderIcon = () => {
    if (!icon) return null;

    // If icon is a functional component (a function)
    if (typeof icon === 'function') {
      const IconComponent = icon;
      return <IconComponent />;
    }

    // If icon is already a React element (an object)
    if (typeof icon === 'object' && React.isValidElement(icon)) {
      // Check if the element's type is valid to avoid "undefined" component error
      if (icon.type === undefined) return null;
      return icon;
    }

    return null;
  };

  const ChevronIcon = Icons.ChevronRight || (() => null);

  return (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={type === 'navigate' || type === 'value' ? onPress : null}
      disabled={type === 'switch'}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          {renderIcon()}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.settingLabel}>{label}</Text>
          {subLabel && <Text style={styles.settingSubLabel}>{subLabel}</Text>}
        </View>
      </View>
      
      {type === 'switch' && (
        <Switch 
          value={value} 
          onValueChange={onValueChange} 
          trackColor={{ true: COLORS.primary, false: '#e2e8f0' }}
          thumbColor={value ? '#fff' : '#f4f3f4'}
        />
      )}
      
      {type === 'navigate' && <ChevronIcon />}
      
      {type === 'value' && (
        <View style={styles.valueContainer}>
          <Text style={styles.valueText}>{value}</Text>
          <ChevronIcon />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  settingItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 18, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f8fafc' 
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingIcon: { 
    width: 40, 
    height: 40, 
    backgroundColor: '#f1f5f9', 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  textContainer: { flex: 1 },
  settingLabel: { fontSize: 15, fontWeight: '700', color: COLORS.slate900 },
  settingSubLabel: { fontSize: 12, color: COLORS.slate400, marginTop: 2 },
  valueContainer: { flexDirection: 'row', alignItems: 'center' },
  valueText: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginRight: 8 },
});
