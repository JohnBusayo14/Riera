import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, AlertTriangle, Send, Camera, CheckCircle } from 'lucide-react-native';
import { COLORS } from '../../constants';
import apiClient from '../../services/apiClient';

export default function ReportProblemScreen({ onBack }) {
  const navigation = useNavigation();
  const [issueType, setIssueType] = useState('App Bug');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const issueTypes = ['App Bug', 'Payment Issue', 'Tracking Error', 'Other'];

  // ALWAYS prioritize navigation.goBack() first
  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else if (onBack) {
      onBack();
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert("Required", "Please describe the problem you are facing.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post('/support/report-problem', {
        type: issueType,
        description: description,
        platform: Platform.OS,
        timestamp: new Date().toISOString()
      });
      setIsSubmitted(true);
    } catch (error) {
      Alert.alert("Submission Failed", "We couldn't send your report. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <View style={styles.successContainer}>
        <CheckCircle size={80} color={COLORS.primary} strokeWidth={1.5} />
        <Text style={styles.successTitle}>Report Received</Text>
        <Text style={styles.successSub}>Thank you for helping us improve. Our technical team will investigate this immediately.</Text>
        <TouchableOpacity style={styles.backToSettingsBtn} onPress={handleBack}>
          <Text style={styles.backToSettingsText}>Back to Support</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* COMPACT HEADER */}
      <SafeAreaView style={styles.headerWrapper}>
        <View style={styles.compactHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ArrowLeft size={22} color="#0f172a" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report a Problem</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.infoBox}>
            <AlertTriangle size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>Found a bug? Tell us what happened and we'll fix it.</Text>
          </View>

          <Text style={styles.label}>What's wrong?</Text>
          <View style={styles.typeContainer}>
            {issueTypes.map((type) => (
              <TouchableOpacity 
                key={type} 
                style={[styles.typeBadge, issueType === type && styles.typeBadgeActive]}
                onPress={() => setIssueType(type)}
                activeOpacity={0.7}
              >
                <Text style={[styles.typeText, issueType === type && styles.typeTextActive]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Please be as specific as possible..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity style={styles.attachBtn} activeOpacity={0.6}>
            <View style={styles.cameraCircle}>
                <Camera size={18} color="#64748b" />
            </View>
            <Text style={styles.attachText}>Add Screenshot (Optional)</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.submitBtn, !description && styles.submitBtnDisabled]} 
            onPress={handleSubmit}
            disabled={isSubmitting || !description}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.submitBtnText}>Send Report</Text>
                <Send size={18} color="#fff" style={{ marginLeft: 10 }} />
              </>
            )}
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  
  // Standardized Header
  headerWrapper: { backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  compactHeader: { 
    height: 50, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 15 
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#0f172a' },

  scrollContent: { padding: 20 },
  infoBox: { 
    flexDirection: 'row', backgroundColor: '#f0fdf4', 
    padding: 16, borderRadius: 18, alignItems: 'center', marginBottom: 25,
    borderWidth: 1, borderColor: '#dcfce7'
  },
  infoText: { flex: 1, marginLeft: 12, color: '#166534', fontSize: 14, fontWeight: '500', lineHeight: 20 },
  
  label: { fontSize: 14, fontWeight: '800', color: '#475569', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  
  typeContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  typeBadge: { 
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, 
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', marginRight: 8, marginBottom: 10 
  },
  typeBadgeActive: { backgroundColor: '#0f172a', borderColor: '#0f172a' },
  typeText: { fontSize: 13, color: '#64748b', fontWeight: '700' },
  typeTextActive: { color: '#fff' },
  
  input: { 
    backgroundColor: '#fff', borderRadius: 20, padding: 18, fontSize: 15, 
    color: '#0f172a', minHeight: 120, borderWidth: 1, borderColor: '#e2e8f0',
    textAlignVertical: 'top'
  },
  
  attachBtn: { 
    flexDirection: 'row', alignItems: 'center', marginTop: 20, padding: 5 
  },
  cameraCircle: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: '#f1f5f9',
    justifyContent: 'center', alignItems: 'center', marginRight: 12
  },
  attachText: { color: '#64748b', fontWeight: '700', fontSize: 14 },
  
  submitBtn: {
    backgroundColor: COLORS.primary, padding: 18, borderRadius: 20,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30,
    elevation: 4, shadowColor: COLORS.primary, shadowOpacity: 0.2, shadowRadius: 10
  },
  submitBtnDisabled: { backgroundColor: '#cbd5e1', elevation: 0 },
  submitBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, backgroundColor: '#fff' },
  successTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a', marginTop: 20 },
  successSub: { fontSize: 15, color: '#64748b', textAlign: 'center', marginTop: 12, lineHeight: 24 },
  backToSettingsBtn: { 
    marginTop: 40, backgroundColor: '#0f172a', paddingHorizontal: 35, 
    paddingVertical: 18, borderRadius: 18 
  },
  backToSettingsText: { color: '#fff', fontWeight: '800', fontSize: 16 }
});