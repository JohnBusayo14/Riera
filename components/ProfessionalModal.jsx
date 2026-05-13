import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { X, AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const COLORS = {
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  forestGreen: '#228B22',
};

export default function ProfessionalModal({
  visible,
  onClose,
  type = 'info', // 'success', 'error', 'warning', 'info'
  title,
  message,
  buttons = [],
  showCloseButton = true,
  loading = false,
}) {
  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return { Icon: CheckCircle2, color: COLORS.success, bg: '#ECFDF5' };
      case 'error':
        return { Icon: AlertCircle, color: COLORS.error, bg: '#FEF2F2' };
      case 'warning':
        return { Icon: AlertTriangle, color: COLORS.warning, bg: '#FFFBEB' };
      default:
        return { Icon: Info, color: COLORS.info, bg: '#EFF6FF' };
    }
  };

  const { Icon, color, bg } = getIconAndColor();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          {showCloseButton && !loading && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <X size={20} color="#64748B" strokeWidth={2.5} />
            </TouchableOpacity>
          )}

          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: bg }]}>
            <Icon size={48} color={color} strokeWidth={2} />
          </View>

          {/* Title */}
          {title && <Text style={styles.title}>{title}</Text>}

          {/* Message */}
          {message && <Text style={styles.message}>{message}</Text>}

          {/* Loading Indicator */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.forestGreen} />
            </View>
          )}

          {/* Buttons */}
          {!loading && buttons.length > 0 && (
            <View style={styles.buttonsContainer}>
              {buttons.map((button, index) => {
                const isDestructive = button.style === 'destructive';
                const isCancel = button.style === 'cancel';
                const isPrimary = !isDestructive && !isCancel;

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      isCancel && styles.buttonCancel,
                      buttons.length === 1 && { flex: 1 },
                    ]}
                    onPress={() => {
                      button.onPress?.();
                      if (button.autoClose !== false) {
                        onClose();
                      }
                    }}
                    activeOpacity={0.8}
                    disabled={button.disabled}
                  >
                    {isPrimary || isDestructive ? (
                      <LinearGradient
                        colors={
                          isDestructive
                            ? [COLORS.error, '#DC2626']
                            : [COLORS.forestGreen, '#1a6b1a']
                        }
                        style={styles.buttonGradient}
                      >
                        {button.loading ? (
                          <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                          <Text style={styles.buttonTextPrimary}>{button.text}</Text>
                        )}
                      </LinearGradient>
                    ) : (
                      <View style={styles.buttonSecondary}>
                        <Text style={styles.buttonTextSecondary}>{button.text}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 28,
    padding: 28,
    width: width - 64,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  message: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSecondary: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
  },
  buttonCancel: {
    // Additional cancel button styles if needed
  },
  buttonTextPrimary: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },
  buttonTextSecondary: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '900',
  },
});