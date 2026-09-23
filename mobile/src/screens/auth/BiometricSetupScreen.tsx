import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const THEME = {
  background: '#0a0e14',
  primary: '#00ff41',
  accent: '#00d4ff',
  surface: '#131820',
  text: '#e0e0e0',
};

export const BiometricSetupScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>HARDWARE_AUTH</Text>
        
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>[@]</Text>
        </View>

        <Text style={styles.instructions}>
          Secure your session with hardware-level biometric authentication. 
          This node supports Fingerprint and Face Recognition.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.enableButton}
          onPress={() => navigation.navigate('EthicsAgreement')}
        >
          <Text style={styles.enableButtonText}>ENABLE_BIOMETRICS</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={() => navigation.navigate('EthicsAgreement')}
        >
          <Text style={styles.skipButtonText}>SKIP_FOR_NOW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
    padding: 30,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: THEME.primary,
    fontFamily: 'monospace',
    marginBottom: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: THEME.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: THEME.surface,
  },
  icon: {
    fontSize: 48,
    color: THEME.accent,
  },
  instructions: {
    color: THEME.text,
    textAlign: 'center',
    fontFamily: 'monospace',
    lineHeight: 24,
  },
  footer: {
    paddingBottom: 20,
  },
  enableButton: {
    backgroundColor: THEME.accent,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  enableButtonText: {
    color: THEME.background,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  skipButton: {
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.text,
  },
  skipButtonText: {
    color: THEME.text,
    fontFamily: 'monospace',
  },
});
