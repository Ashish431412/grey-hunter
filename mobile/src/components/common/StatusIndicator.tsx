import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export interface StatusIndicatorProps {
  status: 'connected' | 'connecting' | 'disconnected';
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const animValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (status === 'connecting') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      animValue.setValue(1);
      animValue.stopAnimation();
    }
  }, [status, animValue]);

  const color =
    status === 'connected' ? '#00ff41' : status === 'connecting' ? '#ffaa00' : '#ff3333';

  return (
    <Animated.View
      style={[
        styles.dot,
        { backgroundColor: color, opacity: animValue },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
});
