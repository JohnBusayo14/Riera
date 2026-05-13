import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Dimensions, 
  Pressable,
  Platform
} from 'react-native';
import { COLORS } from '../../constants';

const { width } = Dimensions.get('window');

export default function OrderSelectionModal({ visible, onClose, onSelect }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.glassContainer}>
          {/* Decorative Background Element */}
          <View style={styles.glow} />
          
          <View style={styles.indicator} />
          
          <View style={styles.header}>
            <Text style={styles.title}>Start Shipping</Text>
            <Text style={styles.subtitle}>Choose your logistics pathway</Text>
          </View>

          <View style={styles.optionsContainer}>
            {/* Local Card - Navigates to 'NewRequest' */}
            <TouchableOpacity 
              activeOpacity={0.8}
              style={[styles.fancyCard, { shadowColor: COLORS.primary }]} 
              onPress={() => onSelect('local')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#f0fdf4' }]}>
                <Text style={styles.emoji}>📦</Text>
              </View>
              <View style={styles.cardTextContent}>
                <Text style={styles.cardLabel}>Local Delivery</Text>
                <Text style={styles.cardSub}>Intra-state & Regional</Text>
              </View>
              <View style={styles.arrowCircle}>
                 <Text style={styles.arrowText}>→</Text>
              </View>
            </TouchableOpacity>

            {/* International Card - Navigates to 'international' */}
            <TouchableOpacity 
              activeOpacity={0.8}
              style={[styles.fancyCard, { shadowColor: '#6366f1' }]} 
              onPress={() => onSelect('international')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#f5f3ff' }]}>
                <Text style={styles.emoji}>✈️</Text>
              </View>
              <View style={styles.cardTextContent}>
                <Text style={styles.cardLabel}>Global Export</Text>
                <Text style={styles.cardSub}>Cross-border & Customs</Text>
              </View>
              <View style={styles.arrowCircle}>
                 <Text style={styles.arrowText}>→</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    justifyContent: 'flex-end', 
  },
  glassContainer: {
    width: width,
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    paddingBottom: Platform.OS === 'ios' ? 50 : 30,
    position: 'relative',
    overflow: 'hidden'
  },
  glow: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: (COLORS.primary || '#004d40') + '10',
    zIndex: -1
  },
  indicator: {
    width: 40,
    height: 5,
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.5
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 5,
    fontWeight: '500'
  },
  optionsContainer: {
    gap: 16
  },
  fancyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      }
    })
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 26
  },
  cardTextContent: {
    flex: 1,
    marginLeft: 15
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b'
  },
  cardSub: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
    fontWeight: '600'
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center'
  },
  arrowText: {
    color: '#64748b',
    fontWeight: 'bold'
  },
  cancelButton: {
    marginTop: 25,
    alignItems: 'center',
    padding: 10
  },
  cancelText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1
  }
});