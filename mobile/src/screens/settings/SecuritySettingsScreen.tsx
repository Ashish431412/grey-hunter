import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';

const THEME = {
  background: '#0a0e14',
  primary: '#00ff41',
  accent: '#00d4ff',
  surface: '#131820',
  text: '#e0e0e0',
  error: '#ff003c',
};

export const SecuritySettingsScreen = () => {
  const [biometrics, setBiometrics] = useState(true);
  const [antiScreenshot, setAntiScreenshot] = useState(true);
  const [mfa, setMfa] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>// AUTHENTICATION</Text>
      
      <View style={styles.group}>
        <View style={styles.row}>
          <Text style={styles.rowText}>BIOMETRIC_LOGIN</Text>
          <Switch
            trackColor={{ false: '#767577', true: 'rgba(0, 255, 65, 0.5)' }}
            thumbColor={biometrics ? THEME.primary : '#f4f3f4'}
            onValueChange={setBiometrics}
            value={biometrics}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>2FA_REQUIREMENT</Text>
          <Switch
            trackColor={{ false: '#767577', true: 'rgba(0, 255, 65, 0.5)' }}
            thumbColor={mfa ? THEME.primary : '#f4f3f4'}
            onValueChange={setMfa}
            value={mfa}
          />
        </View>
        <TouchableOpacity style={styles.actionRow}>
          <Text style={styles.actionText}>CHANGE_MASTER_PASSWORD</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionRow}>
          <Text style={styles.actionText}>AUTO_LOCK_TIMEOUT: [5 MIN]</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>// PRIVACY</Text>
      
      <View style={styles.group}>
        <View style={styles.row}>
          <Text style={styles.rowText}>ANTI_SCREENSHOT</Text>
          <Switch
            trackColor={{ false: '#767577', true: 'rgba(0, 212, 255, 0.5)' }}
            thumbColor={antiScreenshot ? THEME.accent : '#f4f3f4'}
            onValueChange={setAntiScreenshot}
            value={antiScreenshot}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>// DATA_DESTRUCTION</Text>
      
      <View style={styles.group}>
        <TouchableOpacity style={styles.dangerRow}>
          <Text style={styles.dangerText}>PURGE_LOCAL_DATA</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
    padding: 15,
  },
  sectionTitle: {
    color: THEME.primary,
    fontFamily: 'monospace',
    marginBottom: 10,
    marginTop: 10,
  },
  group: {
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 25,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  rowText: {
    color: THEME.text,
    fontFamily: 'monospace',
  },
  actionRow: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  actionText: {
    color: THEME.accent,
    fontFamily: 'monospace',
  },
  dangerRow: {
    padding: 15,
    backgroundColor: 'rgba(255, 0, 60, 0.1)',
  },
  dangerText: {
    color: THEME.error,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
