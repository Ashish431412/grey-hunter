import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';

const THEME = {
  background: '#0a0e14',
  primary: '#00ff41',
  accent: '#00d4ff',
  surface: '#131820',
  text: '#e0e0e0',
};

const LOGS = [
  { id: '1', time: '10:42:01', user: 'GUEST_01', action: 'TOOL_EXEC', details: 'Nmap scan started' },
  { id: '2', time: '10:35:12', user: 'AGENT_X', action: 'TASK_UPD', details: 'Status -> IN_PROGRESS' },
  { id: '3', time: '09:12:44', user: 'SYSTEM', action: 'SYNC_RUN', details: 'Remote sync success' },
];

export const AuditLogScreen = () => {
  const [search, setSearch] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput 
          style={styles.searchInput}
          placeholder="[ GREP_LOGS ]"
          placeholderTextColor="#555"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.exportBtn}>
          <Text style={styles.exportText}>EXPORT</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={LOGS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.logEntry}>
            <View style={styles.logHeader}>
              <Text style={styles.logTime}>[{item.time}]</Text>
              <Text style={styles.logUser}>{item.user}</Text>
            </View>
            <View style={styles.logBody}>
              <Text style={styles.logAction}>{item.action}</Text>
              <Text style={styles.logDetails}>{item.details}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  searchBar: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: THEME.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#333',
    color: THEME.primary,
    fontFamily: 'monospace',
    padding: 10,
    marginRight: 10,
  },
  exportBtn: {
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: THEME.accent,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  exportText: {
    color: THEME.accent,
    fontFamily: 'monospace',
  },
  logEntry: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  logHeader: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  logTime: {
    color: '#888',
    fontFamily: 'monospace',
    fontSize: 12,
    marginRight: 10,
  },
  logUser: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontSize: 12,
  },
  logBody: {
    flexDirection: 'row',
  },
  logAction: {
    width: 90,
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logDetails: {
    flex: 1,
    color: THEME.text,
    fontFamily: 'monospace',
    fontSize: 12,
  },
});
