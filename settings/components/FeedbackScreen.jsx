import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, ActivityIndicator, Platform, KeyboardAvoidingView
} from 'react-native';
import { 
  ArrowLeft, Send, MessageSquare, Bug, Lightbulb, 
  Heart, Star, Camera, CheckCircle2 
} from 'lucide-react-native';
import { COLORS } from '../../constants';
import apiClient from '../../services/apiClient';

export default function FeedbackScreen({ onBack }) {
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('Suggestion');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const categories = [
    { name: 'Suggestion', icon: <Lightbulb size={18} color={category === 'Suggestion' ? '#fff' : COLORS.slate400} /> },
    { name: 'Bug Report', icon: <Bug size={18} color={category === 'Bug Report' ? '#fff' : COLORS.slate400} /> },
    { name: 'Praise', icon: <Heart size={18} color={category === 'Praise' ? '#fff' : COLORS.slate400} /> },
  ];

  const handleSubmit = async () => {
    if (!message.trim() || rating === 0) {
      Alert.alert("Hold on", "Please provide a rating and a short message.");
      return;
    }

    setSubmitting(true);
    try {
      // Replace with your actual feedback endpoint
      await apiClient.post('/feedback', {
        rating,
        category,
        comment: message,
        platform: Platform.OS,
      });
      setIsSuccess(true);
    } catch (error) {
      Alert.alert("Error", "Could not send feedback. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <View style={styles.successContainer}>
        <CheckCircle2 size={80} color={COLORS.primary} />
        <Text style={styles.successTitle}>Thank You!</Text>
        <Text style={styles.successSub}>Your feedback helps us make RieRa better for everyone.</Text>
        <TouchableOpacity style={styles.doneBtn} onPress={onBack}>
          <Text style={styles.doneBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.slate900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Feedback</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>We value your input</Text>
          <Text style={styles.heroSub}>How would you rate your experience with the app so far?</Text>
        </View>

        {/* Star Rating */}
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((s) => (
            <TouchableOpacity key={s} onPress={() => setRating(s)} style={styles.star}>
              <Star 
                size={35} 
                fill={rating >= s ? "#f59e0b" : "transparent"} 
                color={rating >= s ? "#f59e0b" : COLORS.slate300} 
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Category Picker */}
        <Text style={styles.label}>What is this feedback about?</Text>
        <View style={styles.categoryRow}>
          {categories.map((item) => (
            <TouchableOpacity 
              key={item.name} 
              style={[styles.catCard, category === item.name && styles.catCardActive]}
              onPress={() => setCategory(item.name)}
            >
              {item.icon}
              <Text style={[styles.catText, category === item.name && styles.catTextActive]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Feedback Input */}
        <Text style={styles.label}>Tell us more</Text>
        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder="Describe your suggestion or issue here..."
            placeholderTextColor={COLORS.slate400}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.attachmentBtn}>
            <Camera size={18} color={COLORS.slate400} />
            <Text style={styles.attachmentText}>Attach Screenshot</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.submitBtn, (!message || rating === 0) && styles.submitBtnDisabled]} 
          onPress={handleSubmit}
          disabled={submitting || !message || rating === 0}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.submitBtnText}>Submit Feedback</Text>
              <Send size={18} color="#fff" style={{ marginLeft: 10 }} />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15, backgroundColor: '#fff',
  },
  backBtn: { padding: 8, backgroundColor: '#f1f5f9', borderRadius: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.slate900 },
  scrollContent: { padding: 20 },
  hero: { marginBottom: 20 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: COLORS.slate900 },
  heroSub: { fontSize: 14, color: COLORS.slate500, marginTop: 5 },
  ratingRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 30, marginTop: 10 },
  star: { padding: 5 },
  label: { fontSize: 14, fontWeight: '700', color: COLORS.slate700, marginBottom: 12 },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  catCard: {
    flex: 1, backgroundColor: '#fff', padding: 12, borderRadius: 12,
    alignItems: 'center', marginHorizontal: 4, borderWidth: 1, borderColor: '#f1f5f9',
  },
  catCardActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catText: { fontSize: 11, fontWeight: '600', color: COLORS.slate500, marginTop: 6 },
  catTextActive: { color: '#fff' },
  inputCard: { 
    backgroundColor: '#fff', borderRadius: 16, padding: 15, 
    borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 25 
  },
  input: { fontSize: 15, color: COLORS.slate900, minHeight: 120 },
  attachmentBtn: { 
    flexDirection: 'row', alignItems: 'center', marginTop: 15, 
    paddingTop: 15, borderTopWidth: 1, borderTopColor: '#f1f5f9' 
  },
  attachmentText: { marginLeft: 8, fontSize: 13, color: COLORS.slate500, fontWeight: '600' },
  submitBtn: {
    backgroundColor: COLORS.primary, padding: 18, borderRadius: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    elevation: 4, shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 10
  },
  submitBtnDisabled: { backgroundColor: COLORS.slate300, elevation: 0 },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, backgroundColor: '#fff' },
  successTitle: { fontSize: 28, fontWeight: '800', color: COLORS.slate900, marginTop: 20 },
  successSub: { fontSize: 16, color: COLORS.slate500, textAlign: 'center', marginTop: 10, lineHeight: 24 },
  doneBtn: { marginTop: 30, backgroundColor: COLORS.slate900, paddingHorizontal: 30, paddingVertical: 15, borderRadius: 12 },
  doneBtnText: { color: '#fff', fontWeight: 'bold' }
});