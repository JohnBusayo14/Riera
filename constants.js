import React from 'react';
import { 
  User, Truck, MapPin, Package, Plus, ChevronLeft, 
  Menu, Globe, Wallet, Settings, Search, Filter, 
  Calendar, Bell, Shield, Moon, Sun, Headphones, 
  Info, ChevronRight, Phone, MessageSquare, Sprout,
  UtensilsCrossed 
} from 'lucide-react-native';

/**
 * AgroMove Brand Palette
 * Consistent with South African Currency focus [cite: 2026-01-28]
 */
const BRAND = {
  ForestGreen: '#0B4619',
  AfricaKitchen: '#F97316',
  White: '#FFFFFF',
  Black: '#121212',
};

/**
 * Default Typography configuration using PascalCase
 */
const Typography = {
  Fonts: {
    Regular: { fontFamily: 'System', fontWeight: '400' },
    Medium: { fontFamily: 'System', fontWeight: '500' },
    Bold: { fontFamily: 'System', fontWeight: '700' },
    Heavy: { fontFamily: 'System', fontWeight: '900' },
  }
};

/**
 * LIGHT_COLORS with PascalCase keys to match UI expectations
 * Fixes: TypeError: Cannot read property 'Background' of undefined
 */
export const LIGHT_COLORS = {
  ...Typography,
  Primary: BRAND.ForestGreen,
  Secondary: '#1f2421',
  Background: '#F8FAFC', // Capitalized to fix the error
  Surface: BRAND.White,
  TextPrimary: BRAND.Black,
  TextSecondary: '#64748B',
  Border: '#E2E8F0',
  Accent: BRAND.AfricaKitchen,
  White: BRAND.White,
  Slate400: '#94A3B8',
};

/**
 * DARK_COLORS with PascalCase keys
 */
export const DARK_COLORS = {
  ...Typography,
  Primary: '#106324', 
  Secondary: '#F8FAFC',
  Background: '#0B0D0C', // Deep Carbon
  Surface: '#1A1D1B',    // Elevated Carbon
  TextPrimary: '#F8FAFC',
  TextSecondary: '#94A3B8',
  Border: '#2D3330',
  Accent: BRAND.AfricaKitchen,
  White: BRAND.White,
  Slate400: '#475569',
};

// For backward compatibility during migration
export const COLORS = LIGHT_COLORS;

/**
 * IconWrapper logic
 * Logic ensures icons can be colored dynamically by the Theme [cite: 2026-01-09]
 */
const IconWrapper = (IconComponent, size = 22, colorOverride = null) => {
  const Component = (props) => (
    <IconComponent 
      size={props.size || size} 
      color={props.color || colorOverride} 
      strokeWidth={2.5}
    />
  );
  Component.displayName = `IconWrapper(${IconComponent.displayName || IconComponent.name || 'Icon'})`;
  return Component;
};

export const Icons = {
  // Brand Anchors
  Farmer: IconWrapper(Sprout, 22, BRAND.ForestGreen),
  Wallet: IconWrapper(Wallet, 22, BRAND.ForestGreen),
  Kitchen: IconWrapper(UtensilsCrossed, 22, BRAND.AfricaKitchen),
  Plus: IconWrapper(Plus, 24, BRAND.White),
  
  // UI Interaction Icons
  User: IconWrapper(User),
  Driver: IconWrapper(Truck),
  Map: IconWrapper(MapPin),
  Package: IconWrapper(Package),
  Back: IconWrapper(ChevronLeft, 24),
  Menu: IconWrapper(Menu),
  Settings: IconWrapper(Settings),
  Search: IconWrapper(Search, 20),
  Bell: IconWrapper(Bell, 20),
  ChevronRight: IconWrapper(ChevronRight, 18),
  Globe: IconWrapper(Globe, 18),
  Shield: IconWrapper(Shield, 18),
  Moon: IconWrapper(Moon, 18),
  Sun: IconWrapper(Sun, 18),
  Help: IconWrapper(Headphones, 18),
  Info: IconWrapper(Info, 18),
  Phone: IconWrapper(Phone, 18),
  Message: IconWrapper(MessageSquare, 18),
};