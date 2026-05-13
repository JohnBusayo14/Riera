import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Platform 
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { LogOut, ShieldCheck } from 'lucide-react-native';

// Professional context and theme integration
import { useAuth } from '../auth/AuthContext'; 
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

/**
 * CustomDrawerContent
 * Optimized for Dynamic Light/Dark Mode
 */
const CustomDrawerContent = (props) => {
  const { colors: Colors, isDark: IsDark } = useTheme();
  const Auth = useAuth();
  
  if (!Auth) {
    console.error("CustomDrawerContent: Auth context not found.");
    return null;
  }

  const { currentUser: User, logout: LogoutAction } = Auth;

  // --- DYNAMIC UI MAPPING ---
  const UI = {
    Bg: Colors.Background,
    // Header uses a slightly different shade to create depth
    HeaderBg: IsDark ? '#1E293B' : '#F8FAFC', 
    Text: Colors.TextPrimary,
    Muted: Colors.TextSecondary,
    Primary: Colors.Primary,
    Border: Colors.Border,
    // Logout styling adjusts brightness for dark mode
    LogoutBg: IsDark ? '#450a0a' : '#FEE2E2', 
    LogoutText: '#EF4444'
  };

 // Example of what your App.js or AuthProvider should do
// Example of what your handleLogout should look like in the parent
const HandleLogout = async () => {
  try {
    // 1. Tell the backend to set IsOnline and IsAvailable to false
    // This must happen while the token is still in memory/storage
    await apiClient.post('/driver/logout-cleanup'); 
  } catch (error) {
    // Log the error but don't block the user from logging out locally
    console.error("Could not notify backend of logout:", error.message);
  } finally {
    // 2. Clear local storage
    await AsyncStorage.removeItem('userToken');
    
    // 3. Update global states to trigger UI navigation reset
    setUser(null); 
    setToken(null);
    
    // Optional: if you have a separate role state
    // await AsyncStorage.removeItem('userRole');
  }
};

  return (
    <View style={[styles.Main, { backgroundColor: UI.Bg }]}>
      
      {/* PROFESSIONAL PROFILE SECTION */}
      <View style={[styles.Header, { backgroundColor: UI.HeaderBg, borderBottomColor: UI.Border }]}>
        <View style={[styles.AvatarContainer, { backgroundColor: UI.Primary }]}>
          <Text style={styles.AvatarText}>
            {User?.name?.charAt(0)?.toUpperCase() || 'A'}
          </Text>
          {User?.role === 'SELLER' && (
            <View style={[styles.VerifiedBadge, { borderColor: UI.HeaderBg }]}>
              <ShieldCheck size={12} color="#FFF" />
            </View>
          )}
        </View>

        <View style={styles.InfoArea}>
          <Text style={[styles.NameText, { color: UI.Text }]} numberOfLines={1}>
            {User?.name || 'RieRa User'}
          </Text>
          <View style={[styles.RoleBadge, { backgroundColor: UI.Primary + '20' }]}>
            <Text style={[styles.RoleText, { color: UI.Primary }]}>
              {User?.role || 'SENDER'}
            </Text>
          </View>
        </View>
      </View>

      {/* SCROLLABLE NAVIGATION LIST */}
      <DrawerContentScrollView 
        {...props} 
        contentContainerStyle={styles.ScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DrawerItemList 
          {...props} 
          activeTintColor={UI.Primary}
          inactiveTintColor={UI.Muted}
          activeBackgroundColor={UI.Primary + '15'}
          labelStyle={[styles.LabelStyle, { color: UI.Text }]}
        />
      </DrawerContentScrollView>

      {/* SECURE SIGN OUT */}
      <View style={[styles.Footer, { borderTopColor: UI.Border }]}>
        <TouchableOpacity 
          style={[styles.LogoutBtn, { backgroundColor: UI.LogoutBg }]} 
          onPress={HandleLogout}
          activeOpacity={0.8}
        >
          <LogOut size={18} color={UI.LogoutText} strokeWidth={2.5} />
          <Text style={[styles.LogoutBtnText, { color: UI.LogoutText }]}>Secure Sign Out</Text>
        </TouchableOpacity>
        <Text style={[styles.VersionText, { color: UI.Muted }]}>
            RieRa v2.0.4 • 2026
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Main: { flex: 1 },
  Header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 25,
    borderBottomWidth: 1,
  },
  AvatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative',
    ...Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
        },
        android: { elevation: 4 }
    })
  },
  VerifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    padding: 3,
    borderWidth: 2,
  },
  AvatarText: { color: 'white', fontSize: 26, fontWeight: '900' },
  InfoArea: { gap: 4 },
  NameText: { fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  RoleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  RoleText: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  
  ScrollContent: { paddingTop: 10 },
  LabelStyle: { fontWeight: '800', fontSize: 15, marginLeft: -10 },
  
  Footer: {
    padding: 20,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
  },
  LogoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 10
  },
  LogoutBtnText: { fontWeight: '900', fontSize: 15, letterSpacing: 0.3 },
  VersionText: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 15,
    opacity: 0.5,
    textTransform: 'uppercase'
  }
});

export default CustomDrawerContent;