import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { AlertCircle, X } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function DisputeModal({
  visible = false,
  onClose,
  onSubmit,
  loading = false,
}) {
  const { colors: Colors, isDark } = useTheme();

  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');

  const UI_THEME = {
    Background: Colors.Background,
    Surface: Colors.Surface,
    TextPrimary: Colors.TextPrimary,
    TextSecondary: Colors.TextSecondary,
    Border: Colors.Border,
    Primary: Colors.Primary,
    Error: '#ef4444',
  };

  const commonReasons = [
    'Wrong items delivered',
    'Items damaged or defective',
    'Incomplete delivery',
    'Poor product quality',
    'Not as described',
    'Other issue',
  ];

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert('Please select or enter a reason for the dispute.');
      return;
    }

    onSubmit({
      reason,
      description,
    });
  };

  const handleClose = () => {
    // Reset form
    setReason('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.Overlay}>
        <View style={[styles.Container, { backgroundColor: UI_THEME.Surface }]}>
          {/* Header */}
          <View style={styles.Header}>
            <View style={styles.HeaderContent}>
              <View style={[styles.IconContainer, { backgroundColor: '#fee2e2' }]}>
                <AlertCircle size={24} color={UI_THEME.Error} strokeWidth={2.5} />
              </View>
              <Text style={[styles.Title, { color: UI_THEME.TextPrimary }]}>
                Raise a Dispute
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={24} color={UI_THEME.TextSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Warning Banner */}
            <View style={[styles.WarningBanner, { backgroundColor: isDark ? '#3f1616' : '#fef2f2' }]}>
              <Text style={[styles.WarningText, { color: isDark ? '#fca5a5' : '#dc2626' }]}>
                ⚠️ The driver will still be paid. Seller funds will be held until this is resolved.
              </Text>
            </View>

            {/* Reason Selection */}
            <View style={styles.Section}>
              <Text style={[styles.Label, { color: UI_THEME.TextPrimary }]}>
                What went wrong? *
              </Text>
              <View style={styles.ReasonsGrid}>
                {commonReasons.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.ReasonChip,
                      {
                        backgroundColor: reason === item
                          ? UI_THEME.Error
                          : isDark
                          ? '#1f2937'
                          : '#f9fafb',
                        borderColor: reason === item ? UI_THEME.Error : UI_THEME.Border,
                      },
                    ]}
                    onPress={() => setReason(item)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.ReasonChipText,
                        {
                          color: reason === item ? '#fff' : UI_THEME.TextPrimary,
                        },
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Custom Reason Input */}
              {reason === 'Other issue' && (
                <TextInput
                  style={[
                    styles.Input,
                    {
                      backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                      color: UI_THEME.TextPrimary,
                      borderColor: UI_THEME.Border,
                    },
                  ]}
                  placeholder="Please specify the issue"
                  placeholderTextColor={UI_THEME.TextSecondary}
                  value={reason === 'Other issue' ? description : ''}
                  onChangeText={(text) => {
                    if (reason === 'Other issue') {
                      setReason(text);
                    }
                  }}
                />
              )}
            </View>

            {/* Description */}
            <View style={styles.Section}>
              <Text style={[styles.Label, { color: UI_THEME.TextPrimary }]}>
                Detailed Description (Optional)
              </Text>
              <TextInput
                style={[
                  styles.TextArea,
                  {
                    backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                    color: UI_THEME.TextPrimary,
                    borderColor: UI_THEME.Border,
                  },
                ]}
                placeholder="Provide more details about the issue..."
                placeholderTextColor={UI_THEME.TextSecondary}
                multiline
                numberOfLines={5}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            {/* Submit Button */}
            <View style={styles.ButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.SubmitButton,
                  { backgroundColor: UI_THEME.Error },
                  (loading || !reason.trim()) && styles.DisabledButton,
                ]}
                onPress={handleSubmit}
                disabled={loading || !reason.trim()}
                activeOpacity={0.7}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.SubmitButtonText}>Submit Dispute</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.CancelButton, { borderColor: UI_THEME.Border }]}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <Text style={[styles.CancelButtonText, { color: UI_THEME.TextSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  Overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  Container: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  Header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  HeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  IconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Title: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  WarningBanner: {
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
  },
  WarningText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'center',
  },
  Section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  Label: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  ReasonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  ReasonChip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  ReasonChipText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  Input: {
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    fontWeight: '600',
    borderWidth: 1,
    marginTop: 12,
  },
  TextArea: {
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    fontWeight: '600',
    textAlignVertical: 'top',
    minHeight: 100,
    borderWidth: 1,
  },
  ButtonsContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  SubmitButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  DisabledButton: {
    opacity: 0.5,
  },
  SubmitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  CancelButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  CancelButtonText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
});