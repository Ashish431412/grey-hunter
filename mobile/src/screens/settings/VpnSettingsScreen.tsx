import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';

const THEME = {
  background: '#0a0e14',
  primary: '#00ff41',
  accent: '#00d4ff',
  surface: '#131820',
  text: '#e0e0e0',
};

export const VpnSettingsScreen = () => {
  const [vpnOn, setVpnOn] = useState(false);
  const [killSwitch, setKillSwitch] = useState(true);
  const [autoConnect, setAutoConnect] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statusBox}>
        <View style={[styles.statusIndicator, { backgroundColor: vpnOn ? THEME.primary : '#555' }]} />
        <Text style={styles.statusText}>{vpnOn ? 'TUNNEL_ACTIVE (10.8.0.4)' : 'TUNNEL_DOWN'}</Text>
      </View>

      <View style={styles.mainToggle}>
        <Text style={styles.toggleLabel}>VPN CONNECTION</Text>
        <Switch
          trackColor={{ false: '#767577', true: 'rgba(0, 255, 65, 0.5)' }}
          thumbColor={vpnOn ? THEME.primary : '#f4f3f4'}
          onValueChange={() => setVpnOn(!vpnOn)}
          value={vpnOn}
        />
      </View>

      <Text style={styles.sectionTitle}>// CONFIGURATION</Text>
      <View style={styles.settingsGroup}>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>KILL_SWITCH</Text>
          <Switch
            trackColor={{ false: '#767577', true: 'rgba(0, 212, 255, 0.5)' }}
            thumbColor={killSwitch ? THEME.accent : '#f4f3f4'}
            onValueChange={setKillSwitch}
            value={killSwitch}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>AUTO_CONNECT</Text>
          <Switch
            trackColor={{ false: '#767577', true: 'rgba(0, 212, 255, 0.5)' }}
            thumbColor={autoConnect ? THEME.accent : '#f4f3f4'}
            onValueChange={setAutoConnect}
            value={autoConnect}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>// SERVER_NODES</Text>
      <View style={styles.serverList}>
        <TouchableOpacity style={styles.serverRow}>
          <Text style={styles.serverName}>NODE_ALPHA [US-EAST]</Text>
          <Text style={styles.serverPing}>45ms</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.serverRowActive}>
          <Text style={styles.serverNameActive}>NODE_BETA [EU-WEST]</Text>
          <Text style={styles.serverPingActive}>120ms</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.importBtn}>
        <Text style={styles.importBtnText}>IMPORT_WIREGUARD_CONF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
    padding: 15,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surface,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 20,
    justifyContent: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusText: {
    color: THEME.text,
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mainToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.surface,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.primary,
    marginBottom: 30,
  },
  toggleLabel: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    color: THEME.accent,
    fontFamily: 'monospace',
    marginBottom: 10,
  },
  settingsGroup: {
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 30,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingText: {
    color: THEME.text,
    fontFamily: 'monospace',
  },
  serverList: {
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 30,
  },
  serverRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  serverRowActive: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: THEME.primary,
  },
  serverName: {
    color: THEME.text,
    fontFamily: 'monospace',
  },
  serverPing: {
    color: '#888',
    fontFamily: 'monospace',
  },
  serverNameActive: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  serverPingActive: {
    color: THEME.primary,
    fontFamily: 'monospace',
  },
  importBtn: {
    borderWidth: 1,
    borderColor: THEME.accent,
    padding: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  importBtnText: {
    color: THEME.accent,
    fontFamily: 'monospace',
  },
});
