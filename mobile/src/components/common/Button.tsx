import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}) => {
  const getStyle = () => {
    switch (variant) {
      case 'secondary': return styles.secondary;
      case 'danger': return styles.danger;
      case 'outline': return styles.outline;
      case 'primary':
      default: return styles.primary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline': return styles.outlineText;
      default: return styles.defaultText;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getStyle(), disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#00FF41' : '#000'} />
      ) : (
        <Text style={[styles.text, getTextStyle(), disabled && styles.disabledText]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    borderWidth: 1,
  },
  primary: {
    backgroundColor: '#00FF41',
    borderColor: '#00FF41',
  },
  secondary: {
    backgroundColor: '#45A29E',
    borderColor: '#45A29E',
  },
  danger: {
    backgroundColor: '#FF0033',
    borderColor: '#FF0033',
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: '#00FF41',
  },
  disabled: {
    backgroundColor: '#333333',
    borderColor: '#333333',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  defaultText: {
    color: '#000000',
  },
  outlineText: {
    color: '#00FF41',
  },
  disabledText: {
    color: '#666666',
  },
});
