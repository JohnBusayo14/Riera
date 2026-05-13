
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { UserRole } from '../types';
import { COLORS, Icons } from '../constants';
import Button from '../components/Button';
import Input from '../components/Input';

export default function AuthScreen({ onLogin }) {
  const [role, setRole] = useState(UserRole.FARMER);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    onLogin({
      id: Math.random().toString(36).substr(2, 9),
      name: name || "Ade",
      email: email || "ade@example.com",
      role: role,
      phone: "+2340000000"
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Icons.Package />
        </View>
        <Text style={styles.title}>RieRa</Text>
        <Text style={styles.subtitle}>Logistics for the Nigerian Supply Chain</Text>
      </View>

      <View style={styles.roleToggle}>
        <View style={styles.roleRow}>
          <Button 
            title="Farmer" 
            variant={role === UserRole.FARMER ? 'primary' : 'outline'}
            onPress={() => setRole(UserRole.FARMER)}
            style={styles.flex1}
          />
          <Button 
            title="Driver" 
            variant={role === UserRole.DRIVER ? 'primary' : 'outline'}
            onPress={() => setRole(UserRole.DRIVER)}
            style={styles.flex1}
          />
        </View>
      </View>

      <View style={styles.form}>
        <Input label="FULL NAME" placeholder="e.g. Adebayo Ogun" value={name} onChangeText={setName} />
        <Input label="EMAIL ADDRESS" placeholder="name@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Button title="Get Started" onPress={handleSubmit} style={styles.submitBtn} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 40, flexGrow: 1, justifyContent: 'center', backgroundColor: 'white' },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logo: { width: 80, height: 80, backgroundColor: COLORS.primary, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 32, fontWeight: '900', color: COLORS.primary },
  subtitle: { textAlign: 'center', color: COLORS.slate400, marginTop: 8 },
  roleToggle: { marginBottom: 30 },
  roleRow: { flexDirection: 'row', gap: 10 },
  flex1: { flex: 1, paddingVertical: 12 },
  form: { gap: 4 },
  submitBtn: { marginTop: 20 }
});
