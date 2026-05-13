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
import { X, Star, Package, Truck, ChevronRight, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const COLORS = {
  forestGreen: '#228B22',
  forestGreenDark: '#1a6b1a',
  gold: '#F59E0B',
};

export default function MutualRatingModal({
  visible,
  onClose,
  onSubmit,
  sellerName,
  driverName = 'the driver',
  loading = false,
}) {
  const [currentStep, setCurrentStep] = useState(1); // 1 = Rate Seller, 2 = Rate Driver
  
  // Seller rating
  const [sellerRating, setSellerRating] = useState(0);
  const [sellerReview, setSellerReview] = useState('');
  const [hoveredSellerStar, setHoveredSellerStar] = useState(0);
  
  // Driver rating
  const [driverRating, setDriverRating] = useState(0);
  const [driverReview, setDriverReview] = useState('');
  const [hoveredDriverStar, setHoveredDriverStar] = useState(0);

  const handleNext = () => {
    if (sellerRating === 0) return;
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = () => {
    if (sellerRating === 0 || driverRating === 0) return;
    onSubmit({
      sellerRating,
      sellerReview,
      driverRating,
      driverReview,
    });
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSellerRating(0);
    setSellerReview('');
    setDriverRating(0);
    setDriverReview('');
    setHoveredSellerStar(0);
    setHoveredDriverStar(0);
  };

  const renderStars = (rating, setRating, hovered, setHovered) => (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => setRating(star)}
          onPressIn={() => setHovered(star)}
          onPressOut={() => setHovered(0)}
          activeOpacity={0.7}
          style={styles.starButton}
        >
          <Star
            size={44}
            color={COLORS.gold}
            fill={star <= (hovered || rating) ? COLORS.gold : 'transparent'}
            strokeWidth={2}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const getRatingLabel = (rating) => {
    if (rating === 1) return '😞 Poor';
    if (rating === 2) return '😐 Fair';
    if (rating === 3) return '🙂 Good';
    if (rating === 4) return '😊 Very Good';
    if (rating === 5) return '🤩 Excellent';
    return '';
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

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressStep, currentStep >= 1 && styles.progressStepActive]}>
                <Text style={[styles.progressStepText, currentStep >= 1 && styles.progressStepTextActive]}>
                  Rate Seller
                </Text>
              </View>
              <ChevronRight size={16} color={currentStep >= 2 ? COLORS.forestGreen : '#CBD5E1'} strokeWidth={3} />
              <View style={[styles.progressStep, currentStep >= 2 && styles.progressStepActive]}>
                <Text style={[styles.progressStepText, currentStep >= 2 && styles.progressStepTextActive]}>
                  Rate Driver
                </Text>
              </View>
            </View>

            {/* Step 1: Rate Seller */}
            {currentStep === 1 && (
              <>
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
                <Text style={styles.title}>Rate the Seller</Text>
                <Text style={styles.subtitle}>
                  How was your experience with{'\n'}
                  <Text style={styles.highlightName}>{sellerName}</Text>?
                </Text>

                {/* Stars */}
                {renderStars(sellerRating, setSellerRating, hoveredSellerStar, setHoveredSellerStar)}

                {/* Rating Label */}
                {sellerRating > 0 && (
                  <Text style={styles.ratingLabel}>{getRatingLabel(sellerRating)}</Text>
                )}

                {/* Review Input */}
                <View style={styles.reviewContainer}>
                  <Text style={styles.reviewLabel}>Share your experience (optional)</Text>
                  <TextInput
                    style={styles.reviewInput}
                    placeholder="Tell us about the product quality, delivery..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={4}
                    maxLength={500}
                    value={sellerReview}
                    onChangeText={setSellerReview}
                    textAlignVertical="top"
                  />
                  <Text style={styles.characterCount}>{sellerReview.length}/500</Text>
                </View>

                {/* Next Button */}
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.buttonPrimary,
                    sellerRating === 0 && styles.buttonDisabled,
                  ]}
                  onPress={handleNext}
                  disabled={sellerRating === 0}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      sellerRating === 0
                        ? ['#94A3B8', '#64748B']
                        : [COLORS.forestGreen, COLORS.forestGreenDark]
                    }
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonTextPrimary}>Next</Text>
                    <ChevronRight size={20} color="#FFF" strokeWidth={2.5} />
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

            {/* Step 2: Rate Driver */}
            {currentStep === 2 && (
              <>
                {/* Icon */}
                <View style={styles.iconContainer}>
                  <LinearGradient
                    colors={['#F59E0B20', '#F59E0B10']}
                    style={styles.iconGradient}
                  >
                    <Truck size={48} color="#F59E0B" strokeWidth={2} />
                  </LinearGradient>
                </View>

                {/* Title */}
                <Text style={styles.title}>Rate the Driver</Text>
                <Text style={styles.subtitle}>
                  How was your delivery experience with{'\n'}
                  <Text style={styles.highlightName}>{driverName}</Text>?
                </Text>

                {/* Stars */}
                {renderStars(driverRating, setDriverRating, hoveredDriverStar, setHoveredDriverStar)}

                {/* Rating Label */}
                {driverRating > 0 && (
                  <Text style={styles.ratingLabel}>{getRatingLabel(driverRating)}</Text>
                )}

                {/* Review Input */}
                <View style={styles.reviewContainer}>
                  <Text style={styles.reviewLabel}>Share your experience (optional)</Text>
                  <TextInput
                    style={styles.reviewInput}
                    placeholder="E.g., Fast delivery, handled items carefully..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={4}
                    maxLength={500}
                    value={driverReview}
                    onChangeText={setDriverReview}
                    textAlignVertical="top"
                  />
                  <Text style={styles.characterCount}>{driverReview.length}/500</Text>
                </View>

                {/* Info Box */}
                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>
                    ℹ️ Driver will be paid immediately. Seller payment releases once they rate you.
                  </Text>
                </View>

                {/* Buttons */}
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonSecondary]}
                    onPress={handleBack}
                    activeOpacity={0.8}
                  >
                    <ArrowLeft size={20} color="#0F172A" strokeWidth={2.5} />
                    <Text style={styles.buttonTextSecondary}>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.buttonPrimary,
                      driverRating === 0 && styles.buttonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={driverRating === 0 || loading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={
                        driverRating === 0
                          ? ['#94A3B8', '#64748B']
                          : [COLORS.forestGreen, COLORS.forestGreenDark]
                      }
                      style={styles.buttonGradient}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="#FFF" />
                      ) : (
                        <Text style={styles.buttonTextPrimary}>Complete Order</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  progressStep: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  progressStepActive: {
    backgroundColor: COLORS.forestGreen + '20',
  },
  progressStepText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  progressStepTextActive: {
    color: COLORS.forestGreen,
  },
  iconContainer: {
    alignSelf: 'center',
    marginBottom: 20,
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
  subtitleSmall: {
    fontSize: 13,
    color: '#94A3B8',
  },
  highlightName: {
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
  infoBox: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  infoText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E40AF',
    lineHeight: 20,
    textAlign: 'center',
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
    flexDirection: 'row',
    gap: 8,
  },
  buttonGradient: {
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
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