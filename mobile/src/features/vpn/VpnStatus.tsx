import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VpnManager, VpnState } from './VpnManager';

export const VpnStatus: React.FC = () => {
  const [status, setStatus] = useState<VpnState>(VpnManager.getState());

  useEffect(() => {
    const unsubscribe = VpnManager.subscribe((newState) => {
      setStatus(newState);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case VpnState.CONNECTED: return '#00FF41'; // Matrix Green
      case VpnState.CONNECTING: return '#FFB000'; // Amber
      case VpnState.DISCONNECTED: return '#FF0033'; // Red
      case VpnState.ERROR: return '#FF0033';
      default: return '#666';
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: getStatusColor() }]} />
      <Text style={styles.text}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  text: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  }
});
