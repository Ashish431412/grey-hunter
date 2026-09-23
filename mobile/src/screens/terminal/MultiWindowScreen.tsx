import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const THEME = {
  background: '#070203',  // Obsidian shadow with crimson undertone
  primary: '#ffffff',     // Crisp White
  promptRed: '#ff2247',   // Fiery Red prompt
  border: '#3a0c14',      // Dark crimson divider
};

export const MultiWindowScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.topPane}>
        <View style={styles.paneHeader}>
          <Text style={styles.paneTitle}>[ SESSION 1 // KALI ]</Text>
          <TouchableOpacity><Text style={styles.closeBtn}>X</Text></TouchableOpacity>
        </View>
        <View style={styles.cmdRow}>
          <Text style={styles.promptRed}>root@kali:~# </Text>
          <Text style={styles.cmdWhite}>netdiscover -r 192.168.1.0/24</Text>
        </View>
        <Text style={styles.terminalText}>Currently scanning: 192.168.1.0/24 | Screen View: Unique Hosts</Text>
        <Text style={styles.terminalText}>4 Captured ARP req/rep packets from 4 hosts.</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.bottomPane}>
        <View style={styles.paneHeader}>
          <Text style={styles.paneTitle}>[ SESSION 2 // KALI ]</Text>
          <TouchableOpacity><Text style={styles.closeBtn}>X</Text></TouchableOpacity>
        </View>
        <View style={styles.cmdRow}>
          <Text style={styles.promptRed}>root@kali:~# </Text>
          <Text style={styles.cmdWhite}>sqlmap -u http://target.lab/id=1 --dbs</Text>
        </View>
        <Text style={styles.terminalText}>[*] testing connection to the target URL</Text>
        <Text style={styles.terminalText}>[*] GET parameter 'id' is vulnerable (MySQL &gt;= 5.0)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  topPane: {
    flex: 1,
    padding: 12,
  },
  bottomPane: {
    flex: 1,
    padding: 12,
  },
  divider: {
    height: 3,
    backgroundColor: THEME.border,
  },
  paneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paneTitle: {
    color: '#ff2247',
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
  },
  closeBtn: {
    color: '#ffffff',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  cmdRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  promptRed: {
    color: THEME.promptRed,
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cmdWhite: {
    color: '#ffffff',
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
  },
  terminalText: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 11.5,
    lineHeight: 17,
  },
});
