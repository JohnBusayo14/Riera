// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { Appearance, useColorScheme } from 'react-native';
// import { LIGHT_COLORS, DARK_COLORS } from '../constants';

// const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   const systemColorScheme = useColorScheme();
//   const [themeMode, setThemeMode] = useState('system'); // 'light' | 'dark' | 'system'
  
//   // Safe initialization for navigator APIs
//   const [isOffline, setIsOffline] = useState(
//     typeof navigator !== 'undefined' ? !navigator.onLine : false
//   );
//   const [batteryLevel, setBatteryLevel] = useState(1);
//   const [isLowBattery, setIsLowBattery] = useState(false);

//   // Determine actual theme
//   const isDark = themeMode === 'system' 
//     ? systemColorScheme === 'dark' 
//     : themeMode === 'dark';

//   const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

//   useEffect(() => {
//     const hasWindow = typeof window !== 'undefined';
    
//     // Network Monitoring
//     const handleOnline = () => setIsOffline(false);
//     const handleOffline = () => setIsOffline(true);

//     if (hasWindow && window.addEventListener) {
//       window.addEventListener('online', handleOnline);
//       window.addEventListener('offline', handleOffline);
//     }

//     // Battery Monitoring
//     if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
//       navigator.getBattery().then(battery => {
//         const updateBattery = () => {
//           setBatteryLevel(battery.level);
//           setIsLowBattery(battery.level <= 0.2 && !battery.charging);
//         };
//         updateBattery();
        
//         if (battery.addEventListener) {
//           battery.addEventListener('levelchange', updateBattery);
//           battery.addEventListener('chargingchange', updateBattery);
//         }
//       }).catch(err => {
//         console.debug('Battery API not supported or blocked');
//       });
//     }

//     return () => {
//       if (hasWindow && window.removeEventListener) {
//         window.removeEventListener('online', handleOnline);
//         window.removeEventListener('offline', handleOffline);
//       }
//     };
//   }, []);

//   const value = {
//     themeMode,
//     setThemeMode,
//     isDark,
//     colors,
//     isOffline,
//     batteryLevel,
//     isLowBattery
//   };

//   return (
//     <ThemeContext.Provider value={value}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if (!context) throw new Error('useTheme must be used within a ThemeProvider');
//   return context;
// };









// context/ThemeContext.js
// ✅ UPDATED: Dark Mode as Default + Performance Optimizations

import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // ✅ DEFAULT TO LIGHT MODE
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem('theme');
      // If user has saved preference, use it; otherwise stay dark
      if (saved !== null) {
        setIsDark(saved === 'dark');
      }
    } catch (error) {
      console.log('Theme load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.log('Theme save error:', error);
    }
  };

  // ✅ MEMOIZED COLORS - Only re-create when isDark changes
  const colors = useMemo(() => ({
    // Primary Brand Colors
    Primary: '#10B981',
    PrimaryDark: '#059669',
    PrimaryLight: '#34D399',
    PrimaryPale: '#D1FAE5',
    PrimaryGlow: 'rgba(16, 185, 129, 0.15)',
    
    // Theme-specific colors (auto-switch based on isDark)
    Background: isDark ? '#0F172A' : '#FFFFFF',
    Surface: isDark ? '#1E293B' : '#F8FAFC',
    Card: isDark ? '#334155' : '#FFFFFF',
    Border: isDark ? '#475569' : '#E2E8F0',
    TextPrimary: isDark ? '#F8FAFC' : '#0F172A',
    TextSecondary: isDark ? '#CBD5E1' : '#475569',
    TextMuted: isDark ? '#94A3B8' : '#64748B',
    Overlay: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    
    // Semantic Colors
    Success: '#10B981',
    Warning: '#F59E0B',
    Error: '#EF4444',
    Info: '#3B82F6',
    
    // Status Colors
    StatusPending: '#F59E0B',
    StatusAccepted: '#3B82F6',
    StatusDispatched: '#8B5CF6',
    StatusArrived: '#10B981',
    StatusCompleted: '#059669',
    StatusCancelled: '#EF4444',
  }), [isDark]);

  // ✅ MEMOIZED TYPOGRAPHY - Professional, bold typography
  const typography = useMemo(() => ({
    // Display (Extra Large)
    displayLarge: {
      fontSize: 36,
      fontWeight: '900',
      letterSpacing: -1,
    },
    displayMedium: {
      fontSize: 30,
      fontWeight: '900',
      letterSpacing: -0.5,
    },
    
    // Headings
    h1: {
      fontSize: 28,
      fontWeight: '900',
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 24,
      fontWeight: '800',
      letterSpacing: -0.3,
    },
    h3: {
      fontSize: 20,
      fontWeight: '800',
    },
    h4: {
      fontSize: 18,
      fontWeight: '700',
    },
    
    // Body Text
    bodyLarge: {
      fontSize: 16,
      fontWeight: '600',
    },
    bodyMedium: {
      fontSize: 15,
      fontWeight: '500',
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '500',
    },
    
    // Labels
    labelLarge: {
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    labelMedium: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    caption: {
      fontSize: 12,
      fontWeight: '500',
    },
  }), []);

  // ✅ MEMOIZED SHADOWS - Different for dark/light mode
  const shadows = useMemo(() => {
    if (isDark) {
      return {
        sm: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 3,
        },
        md: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 6,
        },
        lg: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.5,
          shadowRadius: 16,
          elevation: 10,
        },
      };
    } else {
      return {
        sm: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        },
        md: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 4,
        },
        lg: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          elevation: 8,
        },
      };
    }
  }, [isDark]);

  // ✅ MEMOIZED SPACING - Consistent 4px grid
  const spacing = useMemo(() => ({
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  }), []);

  // ✅ MEMOIZED RADIUS - Smooth, modern curves
  const radius = useMemo(() => ({
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    full: 9999,
  }), []);

  // ✅ MEMOIZED ICON SIZES
  const iconSizes = useMemo(() => ({
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 40,
  }), []);

  // ✅ MEMOIZED VALUE - Prevents unnecessary re-renders
  const value = useMemo(() => ({
    isDark,
    toggleTheme,
    colors,
    typography,
    shadows,
    spacing,
    radius,
    iconSizes,
    isLoading,
  }), [isDark, colors, typography, shadows, spacing, radius, iconSizes, isLoading]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// ✅ HELPER FUNCTIONS

// Get status badge colors
export const getStatusColors = (status, isDark = true) => {
  const statusLower = status?.toLowerCase() || 'pending';
  const colorMap = {
    pending: { bg: '#F59E0B20', text: '#F59E0B', border: '#F59E0B40' },
    accepted: { bg: '#3B82F620', text: '#3B82F6', border: '#3B82F640' },
    dispatched: { bg: '#8B5CF620', text: '#8B5CF6', border: '#8B5CF640' },
    arrived: { bg: '#10B98120', text: '#10B981', border: '#10B98140' },
    completed: { bg: '#05966920', text: '#059669', border: '#05966940' },
    cancelled: { bg: '#EF444420', text: '#EF4444', border: '#EF444440' },
  };
  
  return colorMap[statusLower] || colorMap.pending;
};

// Format price
export const formatPrice = (amount) => {
  return `R${Number(amount || 0).toFixed(2)}`;
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-ZA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default ThemeContext;