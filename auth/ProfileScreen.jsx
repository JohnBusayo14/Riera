import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS, Icons } from '../constants';
import Input from '../components/Input';
import Button from '../components/Button';
import ScreenHeader from '../components/ScreenHeader';
// 1. Import your apiClient
import apiClient from '../api/apiClient'; 

export default function ProfileScreen({ user, onLogout, onBack }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    farmName: user?.farmName || '',
    vehicleReg: user?.vehicleReg || ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // 2. Use apiClient instead of fetch
      // URL is relative to the baseURL defined in apiClient
      await apiClient.put('/user/profile', formData);

      setIsEditing(false);
      Alert.alert("Success", "Your profile has been updated.");
    } catch (error) {
      // 3. Error handling is cleaner as apiClient logs the details
      const errorMsg = error.response?.data?.message || "Unable to update profile.";
      Alert.alert("Update Failed", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="My Profile" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{formData.name?.[0] || 'U'}</Text>
          </View>
          <Text style={styles.roleBadge}>{user?.role || 'MEMBER'}</Text>
          <Text style={styles.userName}>{formData.name || 'RieRa User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PERSONAL DETAILS</Text>
            {!isEditing && (
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Text style={styles.editBtn}>Edit Profile</Text>
              </TouchableOpacity>
            )}
          </View>

          <Input 
            label="FULL NAME" 
            value={formData.name} 
            onChangeText={t => setFormData({...formData, name: t})} 
            placeholder="Your full name"
            editable={isEditing}
          />
          <Input 
            label="PHONE NUMBER" 
            value={formData.phone} 
            onChangeText={t => setFormData({...formData, phone: t})} 
            placeholder="+234..."
            keyboardType="phone-pad"
            editable={isEditing}
          />
          <Input 
            label="PRIMARY LOCATION" 
            value={formData.location} 
            onChangeText={t => setFormData({...formData, location: t})} 
            placeholder="City, State"
            editable={isEditing}
          />
          
          <Input 
            label="ABOUT / BIO" 
            value={formData.bio} 
            onChangeText={t => setFormData({...formData, bio: t})} 
            placeholder="Tell us a bit about your business"
            editable={isEditing}
            multiline
          />

          {user?.role === 'FARMER' ? (
            <Input 
              label="FARM / BUSINESS NAME" 
              value={formData.farmName} 
              onChangeText={t => setFormData({...formData, farmName: t})} 
              placeholder="e.g. Green Valley Farms"
              editable={isEditing}
            />
          ) : (
            <Input 
              label="VEHICLE REGISTRATION" 
              value={formData.vehicleReg} 
              onChangeText={t => setFormData({...formData, vehicleReg: t})} 
              placeholder="e.g. ABC-123-XY"
              editable={isEditing}
            />
          )}

          {isEditing && (
            <View style={styles.actionRow}>
              <Button 
                title="Save Changes" 
                onPress={handleSave} 
                loading={loading}
                style={styles.saveBtn} 
              />
              <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Discard Changes</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {!isEditing && (
          <View style={styles.bottomActions}>
            <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
              <Text style={styles.logoutText}>Sign Out of Account</Text>
            </TouchableOpacity>
            <Text style={styles.version}>RieRa v1.0.4 • Made for Nigeria</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 25, paddingBottom: 100 },
  header: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  avatarText: { fontSize: 36, color: 'white', fontWeight: '900' },
  roleBadge: { backgroundColor: COLORS.slate900, color: 'white', fontSize: 10, fontWeight: '900', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, letterSpacing: 1, marginBottom: 12 },
  userName: { fontSize: 22, fontWeight: '900', color: COLORS.slate900 },
  userEmail: { fontSize: 14, color: COLORS.slate400, marginTop: 4, fontWeight: '500' },
  formSection: { gap: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, marginTop: 10 },
  sectionTitle: { fontSize: 11, fontWeight: '900', color: COLORS.slate400, letterSpacing: 1.5 },
  editBtn: { color: COLORS.primary, fontWeight: '800', fontSize: 14 },
  actionRow: { marginTop: 15, gap: 10 },
  saveBtn: { flex: 1 },
  cancelBtn: { padding: 15, alignItems: 'center' },
  cancelText: { color: COLORS.slate400, fontWeight: '700' },
  bottomActions: { marginTop: 40, alignItems: 'center' },
  logoutBtn: { backgroundColor: '#fee2e2', paddingVertical: 18, paddingHorizontal: 40, borderRadius: 20, alignItems: 'center', width: '100%' },
  logoutText: { color: '#ef4444', fontWeight: '800', fontSize: 16 },
  version: { marginTop: 20, fontSize: 10, fontWeight: '800', color: COLORS.slate400, textTransform: 'uppercase', letterSpacing: 1 }
});