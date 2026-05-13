import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, 
  Image, Alert, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
// 1. Import your custom apiClient instead of raw axios
import apiClient from '../services/apiClient'; 

const DisputeScreen = ({ route, navigation }) => {
  const orderId = route.params?.orderId || route.params?.order?.id;
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets]);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!reason || !description) {
      Alert.alert("Required Fields", "Please tell us why you are raising a dispute.");
      return;
    }

    setLoading(true);

    try {
      // 2. Prepare FormData
      const formData = new FormData();
      formData.append('Reason', reason);
      formData.append('Description', description);

      // 3. Attach files
      images.forEach((img, index) => {
        const fileName = img.uri.split('/').pop();
        const fileType = fileName.split('.').pop();

        formData.append('EvidenceFiles', {
          uri: Platform.OS === 'android' ? img.uri : img.uri.replace('file://', ''),
          name: fileName || `evidence_${index}.jpg`,
          type: `image/${fileType === 'jpg' ? 'jpeg' : fileType}`,
        });
      });

      // 4. Use apiClient
      // Note: Header 'Authorization' is usually handled automatically by your apiClient interceptor
      const response = await apiClient.post(
        `/customer/orders/${orderId}/dispute`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert(
          "Success", 
          "Your dispute has been submitted for review.",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      // 5. Improved error logging
      const errorMsg = error.response?.data?.message || "Check your internet connection and try again.";
      console.error("Dispute Submission Failed:", error.response?.data || error.message);
      Alert.alert("Submission Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your JSX and Styles remain the same ...
  return (
    <SafeAreaView style={styles.container}>
      {/* (Keep existing JSX here) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Dispute</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.label}>What is the issue?</Text>
            <TextInput 
              style={styles.input} 
              value={reason} 
              onChangeText={setReason} 
              placeholder="e.g. Items were damaged"
              placeholderTextColor="#999"
            />
            <Text style={styles.label}>Provide details</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              value={description} 
              onChangeText={setDescription} 
              multiline
              numberOfLines={5}
              placeholder="Describe the situation..."
              placeholderTextColor="#999"
            />
          </View>

          <Text style={styles.sectionTitle}>Evidence & Photos</Text>
          <View style={styles.imageContainer}>
            <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
              <Ionicons name="camera-outline" size={32} color="#2ecc71" />
              <Text style={styles.uploadText}>Add Photos</Text>
            </TouchableOpacity>

            {images.map((img, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: img.uri }} style={styles.previewImage} />
                <TouchableOpacity style={styles.deleteBadge} onPress={() => removeImage(index)}>
                  <Ionicons name="close-circle" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity 
            style={[styles.submitBtn, loading && styles.disabledBtn]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitBtnText}>{loading ? "Processing..." : "Submit Dispute"}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
  backButton: { padding: 5 },
  scrollContent: { padding: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20
  },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 8 },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  textArea: { height: 120, textAlignVertical: 'top' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 15 },
  imageContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  uploadBox: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2ecc71',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0FFF4'
  },
  uploadText: { fontSize: 12, color: '#2ecc71', marginTop: 5, fontWeight: '600' },
  imageWrapper: { position: 'relative' },
  previewImage: { width: 100, height: 100, borderRadius: 12 },
  deleteBadge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#fff', borderRadius: 10 },
  submitBtn: {
    backgroundColor: '#2ecc71',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 30,
    shadowColor: '#2ecc71',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5
  },
  disabledBtn: { backgroundColor: '#A0AEC0' },
  submitBtnText: { color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: '700' },
  infoText: { textAlign: 'center', color: '#718096', fontSize: 12, marginTop: 20, lineHeight: 18 }
});

export default DisputeScreen;