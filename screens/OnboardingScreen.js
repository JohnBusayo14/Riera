import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// 1. Correct hook import (ensure path matches your project)
import { useAuth } from '../auth/AuthContext'; 
import { COLORS } from '../constants';
import Input from '../components/Input';
import Button from '../components/Button';

const OnboardingScreen = () => {
  // We remove useNavigation because manual navigation is handled by state change
  const auth = useAuth(); 

  // Guard against the context being undefined
  if (!auth) {
    console.error("AuthContext not found. Ensure AuthProvider wraps the root in App.jsx");
    return null;
  }

  const { currentUser, setCurrentUser } = auth;
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async () => {
    if (!location.trim()) {
      Alert.alert("Location Required", "Please enter your base location.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create the updated user object with 'onboarded' set to true
      const updatedUser = { 
        ...currentUser, 
        location: location.trim(),
        onboarded: true 
      };

      // 2. Persist locally so the user stays logged in after app restart
      await AsyncStorage.setItem('agro_user', JSON.stringify(updatedUser));

      // 3. Update global state. 
      // IMPORTANT: Because AppNavigator is watching 'currentUser', 
      // this single line triggers the automatic switch to the Dashboard.
      setCurrentUser(updatedUser);

      // 4. REMOVED: navigation.replace('Dashboard') 
      // Calling navigation.replace here causes the [TypeError] because 
      // the screen is already unmounting from the state change above.

    } catch (error) {
      console.error("Onboarding Error:", error);
      Alert.alert("Error", "Failed to save profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Where are you based? 📍</Text>
          <Text style={styles.subtitle}>
            Help us match you with deliveries near your local area.
          </Text>
        </View>

        <View style={styles.form}>
          <Input 
            label="LOCATION"
            placeholder="e.g. Kano, Kano State" 
            value={location} 
            onChangeText={setLocation} 
          />

          <Button 
            title={isSubmitting ? "Finalizing..." : "Get Started"} 
            onPress={handleComplete}
            disabled={isSubmitting || !location.trim()}
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, justifyContent: 'center', padding: 30 },
  header: { marginBottom: 40 },
  title: { fontSize: 32, fontWeight: '900', color: COLORS.slate900, marginBottom: 12 },
  subtitle: { fontSize: 16, color: COLORS.slate400, lineHeight: 24 },
  form: { gap: 10 },
  button: { marginTop: 20, height: 56, borderRadius: 16 },
});

export default OnboardingScreen;