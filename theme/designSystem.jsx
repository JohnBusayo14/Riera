// theme/designSystem.js
// 🎨 AgroMove Professional Design System
// Dark Mode Default with Light Mode Support

export const DESIGN_SYSTEM = {
  // ═══════════════════════════════════════════════════════════════════════
  // COLORS - Professional Palette with Dark Mode Priority
  // ═══════════════════════════════════════════════════════════════════════
  
  colors: {
    // Primary Brand Colors
    primary: {
      main: '#10B981',      // Emerald Green
      dark: '#059669',      // Darker Green
      light: '#34D399',     // Lighter Green
      pale: '#D1FAE5',      // Pale Green
      glow: 'rgba(16, 185, 129, 0.15)', // Glow effect
    },
    
    // Dark Theme (Default)
    dark: {
      background: '#0F172A',    // Deep Navy
      surface: '#1E293B',       // Slate
      card: '#334155',          // Medium Slate
      border: '#475569',        // Light Slate
      textPrimary: '#F8FAFC',   // Off White
      textSecondary: '#CBD5E1', // Light Gray
      textMuted: '#94A3B8',     // Medium Gray
      overlay: 'rgba(15, 23, 42, 0.95)',
    },
    
    // Light Theme
    light: {
      background: '#FFFFFF',    // Pure White
      surface: '#F8FAFC',       // Off White
      card: '#FFFFFF',          // White
      border: '#E2E8F0',        // Light Gray
      textPrimary: '#0F172A',   // Deep Navy
      textSecondary: '#475569', // Dark Gray
      textMuted: '#64748B',     // Medium Gray
      overlay: 'rgba(255, 255, 255, 0.95)',
    },
    
    // Semantic Colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Status Colors
    status: {
      pending: '#F59E0B',
      accepted: '#3B82F6',
      dispatched: '#8B5CF6',
      arrived: '#10B981',
      completed: '#059669',
      cancelled: '#EF4444',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // TYPOGRAPHY - Bold, Visible, Professional
  // ═══════════════════════════════════════════════════════════════════════
  
  typography: {
    // Display (Extra Large)
    displayLarge: {
      fontSize: 36,
      fontWeight: '900',
      letterSpacing: -1,
      lineHeight: 40,
    },
    displayMedium: {
      fontSize: 30,
      fontWeight: '900',
      letterSpacing: -0.5,
      lineHeight: 36,
    },
    
    // Headings
    h1: {
      fontSize: 28,
      fontWeight: '900',
      letterSpacing: -0.5,
      lineHeight: 34,
    },
    h2: {
      fontSize: 24,
      fontWeight: '800',
      letterSpacing: -0.3,
      lineHeight: 30,
    },
    h3: {
      fontSize: 20,
      fontWeight: '800',
      lineHeight: 26,
    },
    h4: {
      fontSize: 18,
      fontWeight: '700',
      lineHeight: 24,
    },
    
    // Body Text
    bodyLarge: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
    },
    bodyMedium: {
      fontSize: 15,
      fontWeight: '500',
      lineHeight: 22,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
    },
    
    // Labels & Captions
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
    labelSmall: {
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 0.3,
    },
    caption: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 16,
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // SPACING - Consistent 4px Grid System
  // ═══════════════════════════════════════════════════════════════════════
  
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },

  // ═══════════════════════════════════════════════════════════════════════
  // BORDER RADIUS - Smooth, Modern Curves
  // ═══════════════════════════════════════════════════════════════════════
  
  radius: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    full: 9999,
  },

  // ═══════════════════════════════════════════════════════════════════════
  // SHADOWS - Depth & Elevation
  // ═══════════════════════════════════════════════════════════════════════
  
  shadows: {
    // Light Mode Shadows
    light: {
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
    },
    
    // Dark Mode Shadows (more subtle)
    dark: {
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
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // ICON SIZES - Consistent Sizing
  // ═══════════════════════════════════════════════════════════════════════
  
  iconSizes: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 40,
  },

  // ═══════════════════════════════════════════════════════════════════════
  // ANIMATIONS - Smooth Transitions
  // ═══════════════════════════════════════════════════════════════════════
  
  animations: {
    fast: 200,
    normal: 300,
    slow: 500,
    spring: {
      damping: 15,
      stiffness: 100,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// THEME HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════

export const getTheme = (isDark = true) => {
  const mode = isDark ? 'dark' : 'light';
  
  return {
    colors: {
      ...DESIGN_SYSTEM.colors,
      background: DESIGN_SYSTEM.colors[mode].background,
      surface: DESIGN_SYSTEM.colors[mode].surface,
      card: DESIGN_SYSTEM.colors[mode].card,
      border: DESIGN_SYSTEM.colors[mode].border,
      textPrimary: DESIGN_SYSTEM.colors[mode].textPrimary,
      textSecondary: DESIGN_SYSTEM.colors[mode].textSecondary,
      textMuted: DESIGN_SYSTEM.colors[mode].textMuted,
      overlay: DESIGN_SYSTEM.colors[mode].overlay,
      primary: DESIGN_SYSTEM.colors.primary.main,
      primaryDark: DESIGN_SYSTEM.colors.primary.dark,
      primaryLight: DESIGN_SYSTEM.colors.primary.light,
      success: DESIGN_SYSTEM.colors.success,
      warning: DESIGN_SYSTEM.colors.warning,
      error: DESIGN_SYSTEM.colors.error,
      info: DESIGN_SYSTEM.colors.info,
    },
    typography: DESIGN_SYSTEM.typography,
    spacing: DESIGN_SYSTEM.spacing,
    radius: DESIGN_SYSTEM.radius,
    shadows: DESIGN_SYSTEM.shadows[mode],
    iconSizes: DESIGN_SYSTEM.iconSizes,
    animations: DESIGN_SYSTEM.animations,
    isDark,
  };
};

// Status badge helper
export const getStatusBadge = (status, isDark = true) => {
  const statusLower = status?.toLowerCase() || 'pending';
  const color = DESIGN_SYSTEM.colors.status[statusLower] || DESIGN_SYSTEM.colors.status.pending;
  
  return {
    backgroundColor: `${color}20`, // 20% opacity
    textColor: color,
    borderColor: `${color}40`, // 40% opacity
  };
};

// Price formatter
export const formatPrice = (amount) => {
  return `R${Number(amount || 0).toFixed(2)}`;
};

// Date formatter
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-ZA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default DESIGN_SYSTEM;