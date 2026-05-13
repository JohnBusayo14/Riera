import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { X, Star, Package } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const COLORS = {
  forestGreen: '#228B22',
  forestGreenDark: '#1a6b1a',
  gold: '#F59E0B',
};

export default function RatingModal({
  visible,
  onClose,
  onSubmit,
  sellerName,
  loading = false,
}) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = () => {
    if (rating === 0) {
      return;
    }
    onSubmit({ rating, review });
  };

  const handleReset = () => {
    setRating(0);
    setReview('');
    setHoveredStar(0);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                handleReset();
                onClose();
              }}
              activeOpacity={0.7}
            >
              <X size={20} color="#64748B" strokeWidth={2.5} />
            </TouchableOpacity>

            {/* Icon */}
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={[COLORS.forestGreen + '20', COLORS.forestGreen + '10']}
                style={styles.iconGradient}
              >
                <Package size={48} color={COLORS.forestGreen} strokeWidth={2} />
              </LinearGradient>
            </View>

            {/* Title */}
            <Text style={styles.title}>Rate Your Order</Text>
            <Text style={styles.subtitle}>
              How was your experience with{'\n'}
              <Text style={styles.sellerName}>{sellerName || 'this seller'}</Text>?
            </Text>

            {/* Star Rating */}
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  onPressIn={() => setHoveredStar(star)}
                  onPressOut={() => setHoveredStar(0)}
                  activeOpacity={0.7}
                  style={styles.starButton}
                >
                  <Star
                    size={44}
                    color={COLORS.gold}
                    fill={
                      star <= (hoveredStar || rating) ? COLORS.gold : 'transparent'
                    }
                    strokeWidth={2}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Rating Label */}
            {rating > 0 && (
              <Text style={styles.ratingLabel}>
                {rating === 1 && '😞 Poor'}
                {rating === 2 && '😐 Fair'}
                {rating === 3 && '🙂 Good'}
                {rating === 4 && '😊 Very Good'}
                {rating === 5 && '🤩 Excellent'}
              </Text>
            )}

            {/* Review Text Input */}
            <View style={styles.reviewContainer}>
              <Text style={styles.reviewLabel}>
                Share your experience (optional)
              </Text>
              <TextInput
                style={styles.reviewInput}
                placeholder="Tell us more about your order..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                maxLength={500}
                value={review}
                onChangeText={setReview}
                textAlignVertical="top"
              />
              <Text style={styles.characterCount}>{review.length}/500</Text>
            </View>

            {/* Buttons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => {
                  handleReset();
                  onClose();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonTextSecondary}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.buttonPrimary,
                  rating === 0 && styles.buttonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={rating === 0 || loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    rating === 0
                      ? ['#94A3B8', '#64748B']
                      : [COLORS.forestGreen, COLORS.forestGreenDark]
                  }
                  style={styles.buttonGradient}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.buttonTextPrimary}>Submit Rating</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 28,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  iconContainer: {
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  iconGradient: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.forestGreen + '30',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  sellerName: {
    color: COLORS.forestGreen,
    fontWeight: '900',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  starButton: {
    padding: 4,
  },
  ratingLabel: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    color: '#0F172A',
    marginBottom: 24,
  },
  reviewContainer: {
    marginBottom: 24,
  },
  reviewLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  reviewInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    minHeight: 120,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  characterCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'right',
    marginTop: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonPrimary: {
    shadowColor: COLORS.forestGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonSecondary: {
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    height: 52,
  },
  buttonGradient: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextPrimary: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },
  buttonTextSecondary: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '900',
  },
});