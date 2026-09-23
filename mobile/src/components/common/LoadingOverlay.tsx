import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal as RNModal } from 'react-native';

export interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'Processing...',
}) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <RNModal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.cursor}>_</Text>
          <Text style={styles.message}>
            {message}
            {dots}
          </Text>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 20, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#131820',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00ff41',
  },
  cursor: {
    color: '#00ff41',
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  message: {
    color: '#00ff41',
    fontSize: 16,
    fontFamily: 'monospace',
  },
});
