import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { Star, X, CheckCircle2 } from 'lucide-react-native';
import { COLORS } from '../constants';
import apiClient from '../services/apiClient';

export default function ReviewModal({ visible, onClose, orderId, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setLoading(true);
    try {
      await apiClient.post(`/orders/${orderId}/rate`, {
        rating,
        comment
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setRating(0);
        setComment('');
        onSuccess?.();
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Review Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <AnimatePresence>
          {visible && (
            <MotiView
              from={{ opacity: 0, scale: 0.8, translateY: 40 }}
              animate={{ opacity: 1, scale: 1, translateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, translateY: 40 }}
              transition={{ type: 'spring', damping: 15 }}
              style={styles.modalCard}
            >
              {!submitted ? (
                <>
                  <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                    <X size={20} color={COLORS.slate400} />
                  </TouchableOpacity>

                  <Text style={styles.title}>Rate your experience</Text>
                  <Text style={styles.subtitle}>How was the produce and the seller's service?</Text>

                  {/* Star Rating Row */}
                  <View style={styles.starRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity 
                        key={star} 
                        onPress={() => setRating(star)}
                        activeOpacity={0.7}
                      >
                        <MotiView
                          animate={{ scale: rating >= star ? 1.2 : 1 }}
                          transition={{ type: 'spring' }}
                        >
                          <Star 
                            size={40} 
                            color={rating >= star ? "#fbbf24" : "#e2e8f0"} 
                            fill={rating >= star ? "#fbbf24" : "transparent"} 
                          />
                        </MotiView>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TextInput
                    style={styles.input}
                    placeholder="Write a small note (optional)..."
                    placeholderTextColor={COLORS.slate400}
                    multiline
                    value={comment}
                    onChangeText={setComment}
                  />

                  <TouchableOpacity 
                    style={[styles.submitBtn, { opacity: rating === 0 ? 0.6 : 1 }]} 
                    onPress={handleSubmit}
                    disabled={rating === 0 || loading}
                  >
                    {loading ? <ActivityIndicator color="white" /> : <Text style={styles.submitText}>Submit Review</Text>}
                  </TouchableOpacity>
                </>
              ) : (
                <MotiView 
                  from={{ opacity: 0, scale: 0.5 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  style={styles.successState}
                >
                  <CheckCircle2 size={60} color={COLORS.primary} />
                  <Text style={styles.successTitle}>Thank You!</Text>
                  <Text style={styles.successSubtitle}>Your feedback helps our community grow.</Text>
                </MotiView>
              )}
            </MotiView>
          )}
        </AnimatePresence>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: 'white', width: '100%', borderRadius: 30, padding: 25, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  closeBtn: { position: 'absolute', right: 20, top: 20 },
  title: { fontSize: 20, fontWeight: '900', color: COLORS.slate900, marginTop: 10 },
  subtitle: { fontSize: 14, color: COLORS.slate500, textAlign: 'center', marginTop: 8, marginBottom: 25 },
  starRow: { flexDirection: 'row', gap: 10, marginBottom: 25 },
  input: { backgroundColor: '#f8fafc', width: '100%', borderRadius: 15, padding: 15, height: 100, textAlignVertical: 'top', color: COLORS.slate900, borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 20 },
  submitBtn: { backgroundColor: COLORS.primary, width: '100%', padding: 18, borderRadius: 15, alignItems: 'center' },
  submitText: { color: 'white', fontWeight: '800', fontSize: 16 },
  successState: { alignItems: 'center', paddingVertical: 20 },
  successTitle: { fontSize: 22, fontWeight: '900', color: COLORS.slate900, marginTop: 15 },
  successSubtitle: { fontSize: 14, color: COLORS.slate500, textAlign: 'center', marginTop: 5 }
});