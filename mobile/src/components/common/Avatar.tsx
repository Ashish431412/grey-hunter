import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export interface AvatarProps {
  src?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
  isOnline?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  initials = '?',
  size = 'md',
  isOnline = false,
}) => {
  const sizeMap = {
    sm: 32,
    md: 48,
    lg: 64,
  };

  const d = sizeMap[size];

  return (
    <View style={[styles.container, { width: d, height: d }]}>
      {src ? (
        <Image source={{ uri: src }} style={[styles.image, { borderRadius: d / 2 }]} />
      ) : (
        <View style={[styles.fallback, { borderRadius: d / 2 }]}>
          <Text style={[styles.initials, { fontSize: d * 0.4 }]}>{initials}</Text>
        </View>
      )}
      <View
        style={[
          styles.statusDot,
          {
            backgroundColor: isOnline ? '#00ff41' : '#666',
            width: d * 0.25,
            height: d * 0.25,
            borderRadius: d * 0.125,
            bottom: d * 0.05,
            right: d * 0.05,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1e2530',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  initials: {
    color: '#e0e0e0',
    fontWeight: 'bold',
  },
  statusDot: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#0a0e14',
  },
});
