
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants';

export default function ProfileScreen({ user, onLogout }) {
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name[0]}</Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.role}>{user.role}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}><Text style={styles.menuText}>Payment History</Text></TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}><Text style={styles.menuText}>Vehicle Documents</Text></TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}><Text style={styles.menuText}>Help & Support</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, styles.logout]} onPress={onLogout}>
          <Text style={[styles.menuText, {color: '#ef4444'}]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25 },
  profileHeader: { alignItems: 'center', marginBottom: 40 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarText: { fontSize: 32, color: 'white', fontWeight: 'bold' },
  name: { fontSize: 22, fontWeight: '800' },
  role: { fontSize: 12, fontWeight: 'bold', color: COLORS.slate400, marginTop: 4, textTransform: 'uppercase' },
  menu: { backgroundColor: 'white', borderRadius: 24, padding: 10 },
  menuItem: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  menuText: { fontWeight: '600', color: COLORS.slate700 },
  logout: { borderBottomWidth: 0 }
});
