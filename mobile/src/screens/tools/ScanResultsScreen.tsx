import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const THEME = {
  background: '#0a0e14',
  primary: '#00ff41',
  accent: '#00d4ff',
  surface: '#131820',
  text: '#e0e0e0',
};

export const ScanResultsScreen = () => {
  const [viewMode, setViewMode] = useState('PARSED');

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>SCAN_REPORT</Text>
        <Text style={styles.summaryItem}>TOOL: Nmap v7.93</Text>
        <Text style={styles.summaryItem}>TARGET: 192.168.1.100</Text>
        <Text style={styles.summaryItem}>DURATION: 1.42s</Text>
        <Text style={styles.summaryItem}>STATUS: COMPLETED</Text>
      </View>

      <View style={styles.tabContainer}>
        {['RAW', 'PARSED', 'VISUAL'].map(tab => (
          <TouchableOpacity 
            key={tab}
            style={[styles.tab, viewMode === tab && styles.activeTab]}
            onPress={() => setViewMode(tab)}
          >
            <Text style={[styles.tabText, viewMode === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {viewMode === 'RAW' && (
          <Text style={styles.rawText}>
            Nmap scan report for 192.168.1.100{'\n'}
            Host is up (0.0020s latency).{'\n'}
            Not shown: 998 closed ports{'\n'}
            PORT   STATE SERVICE{'\n'}
            22/tcp open  ssh{'\n'}
            80/tcp open  http{'\n'}
            Nmap done: 1 IP address (1 host up) scanned in 1.42 seconds
          </Text>
        )}
        
        {viewMode === 'PARSED' && (
          <View>
            <View style={styles.hostCard}>
              <Text style={styles.hostTitle}>192.168.1.100 (UP)</Text>
              
              <View style={styles.portRow}>
                <Text style={styles.portNumber}>22/tcp</Text>
                <Text style={styles.portState}>OPEN</Text>
                <Text style={styles.portService}>ssh</Text>
              </View>
              
              <View style={styles.portRow}>
                <Text style={styles.portNumber}>80/tcp</Text>
                <Text style={styles.portState}>OPEN</Text>
                <Text style={styles.portService}>http</Text>
              </View>
            </View>
          </View>
        )}

        {viewMode === 'VISUAL' && (
          <View style={styles.visualContainer}>
            <Text style={styles.visualPlaceholder}>[ NETWORK_GRAPH_RENDER ]</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.exportBar}>
        <TouchableOpacity style={styles.exportBtn}>
          <Text style={styles.exportBtnText}>EXPORT_JSON</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exportBtn}>
          <Text style={styles.exportBtnText}>SHARE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  summaryCard: {
    backgroundColor: THEME.surface,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  summaryTitle: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryItem: {
    color: '#888',
    fontFamily: 'monospace',
    fontSize: 12,
    marginBottom: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: THEME.accent,
  },
  tabText: {
    color: '#888',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  activeTabText: {
    color: THEME.accent,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  rawText: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
  hostCard: {
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: '#333',
    padding: 15,
  },
  hostTitle: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 10,
  },
  portRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  portNumber: {
    width: 60,
    color: THEME.accent,
    fontFamily: 'monospace',
  },
  portState: {
    width: 60,
    color: '#0f0',
    fontFamily: 'monospace',
  },
  portService: {
    flex: 1,
    color: THEME.text,
    fontFamily: 'monospace',
  },
  visualContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  visualPlaceholder: {
    color: '#555',
    fontFamily: 'monospace',
  },
  exportBar: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  exportBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: THEME.text,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  exportBtnText: {
    color: THEME.text,
    fontFamily: 'monospace',
  },
});
