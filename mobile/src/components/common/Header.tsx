import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, onBack, rightAction }) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right}>{rightAction}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 14, 20, 0.9)',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e2530',
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: '#e0e0e0',
    fontSize: 24,
    lineHeight: 24,
  },
  title: {
    flex: 3,
    color: '#e0e0e0',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
});
