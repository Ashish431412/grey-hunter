import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface BadgeProps {
  label: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color = '#00ff41',
  size = 'md',
  variant = 'filled',
}) => {
  const isOutline = variant === 'outline';
  const sizeStyles = {
    sm: { paddingHorizontal: 6, paddingVertical: 2, fontSize: 10 },
    md: { paddingHorizontal: 8, paddingVertical: 4, fontSize: 12 },
    lg: { paddingHorizontal: 12, paddingVertical: 6, fontSize: 14 },
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: isOutline ? 'transparent' : color,
          borderColor: color,
          borderWidth: isOutline ? 1 : 0,
          paddingHorizontal: sizeStyles[size].paddingHorizontal,
          paddingVertical: sizeStyles[size].paddingVertical,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: isOutline ? color : '#131820',
            fontSize: sizeStyles[size].fontSize,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 9999,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: 'bold',
  },
});
