
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function GaugeSelector({ gauges, selectedGauge, onSelect }) {
  if (!gauges || gauges.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>SELECT SIZE / WEIGHT VARIATION</Text>
      {gauges.map((gauge) => {
        const isSelected = selectedGauge?.id === gauge.id;
        
        return (
          <TouchableOpacity
            key={gauge.id}
            onPress={() => onSelect(gauge)}
            style={[styles.item, isSelected && styles.itemSelected]}
            activeOpacity={0.8}
          >
            <View style={styles.row}>
              {/* Custom Radio Button */}
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <View style={styles.radioInner} />}
              </View>

              {/* Optional: Small Variation Thumbnail */}
              {gauge.imageUrl && (
                <Image 
                  source={{ uri: gauge.imageUrl }} 
                  style={styles.gaugeThumbnail} 
                />
              )}

              <View style={styles.textContainer}>
                <Text style={[styles.gaugeLabel, isSelected && styles.textSelected]}>
                  {gauge.label}
                </Text>
                <Text style={styles.weight}>{gauge.weight}kg approx.</Text>
              </View>
            </View>

            <View style={styles.priceContainer}>
              <Text style={[styles.price, isSelected && styles.textSelected]}>
                ₦{gauge.price.toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  label: { 
    fontSize: 11, 
    fontWeight: '800', 
    color: '#94a3b8', 
    letterSpacing: 1, 
    marginBottom: 12,
    textTransform: 'uppercase'
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#f1f5f9',
    marginBottom: 10,
    backgroundColor: '#fff',
    // Slight shadow for unselected items
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemSelected: { 
    borderColor: '#10b981', 
    backgroundColor: '#f0fdf4',
    elevation: 0, // Remove shadow when selected for a flatter look
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1 
  },
  radio: { 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    borderWidth: 2, 
    borderColor: '#cbd5e1', 
    marginRight: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'white'
  },
  radioSelected: { 
    borderColor: '#10b981' 
  },
  radioInner: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    backgroundColor: '#10b981' 
  },
  gaugeThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f8fafc'
  },
  textContainer: { 
    flex: 1 
  },
  gaugeLabel: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: '#1e293b' 
  },
  weight: { 
    fontSize: 12, 
    color: '#94a3b8', 
    marginTop: 2,
    fontWeight: '500'
  },
  priceContainer: {
    marginLeft: 10,
  },
  price: { 
    fontSize: 15, 
    fontWeight: '800', 
    color: '#1e293b' 
  },
  textSelected: { 
    color: '#065f46' 
  }
});