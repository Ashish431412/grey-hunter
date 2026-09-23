import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';

const THEME = {
  background: '#0a0e14',
  primary: '#00ff41',
  accent: '#00d4ff',
  surface: '#131820',
  text: '#e0e0e0',
};

export const SyncSettingsScreen = () => {
  const [autoSync, setAutoSync] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(true);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statusPanel}>
        <Text style={styles.statusTitle}>SYNC_STATUS</Text>
        <Text style={styles.statusText}>LAST_SYNC: 5 MINS AGO</Text>
        <Text style={styles.statusText}>PENDING_CHANGES: 0</Text>
      </View>

      <TouchableOpacity style={styles.forceBtn}>
        <Text style={styles.forceBtnText}>INITIATE_FORCE_SYNC</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>// PREFERENCES</Text>
      
      <View style={styles.group}>
        <View style={styles.row}>
          <Text style={styles.rowText}>AUTO_SYNC_BACKGROUND</Text>
          <Switch
            trackColor={{ false: '#767577', true: 'rgba(0, 255, 65, 0.5)' }}
            thumbColor={autoSync ? THEME.primary : '#f4f3f4'}
            onValueChange={setAutoSync}
            value={autoSync}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>SYNC_ON_WIFI_ONLY</Text>
          <Switch
            trackColor={{ false: '#767577', true: 'rgba(0, 212, 255, 0.5)' }}
            thumbColor={wifiOnly ? THEME.accent : '#f4f3f4'}
            onValueChange={setWifiOnly}
            value={wifiOnly}
          />
        </View>
        <TouchableOpacity style={styles.actionRow}>
          <Text style={styles.actionText}>SYNC_INTERVAL: [ 15 MIN ]</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionRow}>
          <Text style={styles.actionText}>CONFLICT_RES: [ ASK_USER ]</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>// SYNC_HISTORY</Text>
      <View style={styles.historyBox}>
        <Text style={styles.historyLog}>[OK] 10:45 - Synced Project Op_Blacklight</Text>
        <Text style={styles.historyLog}>[OK] 10:30 - Downloaded 2 docs</Text>
        <Text style={styles.historyLog}>[OK] 10:15 - Uploaded scan results (Nmap)</Text>
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
  statusPanel: {
    backgroundColor: THEME.surface,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.accent,
    marginBottom: 20,
  },
  statusTitle: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  statusText: {
    color: THEME.text,
    fontFamily: 'monospace',
    marginBottom: 5,
  },
  forceBtn: {
    backgroundColor: THEME.primary,
    padding: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  forceBtnText: {
    color: THEME.background,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: THEME.primary,
    fontFamily: 'monospace',
    marginBottom: 10,
  },
  group: {
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 30,
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
    color: THEME.text,
    fontFamily: 'monospace',
  },
  historyBox: {
    backgroundColor: '#000',
    padding: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  historyLog: {
    color: '#888',
    fontFamily: 'monospace',
    fontSize: 12,
    marginBottom: 5,
  },
});
