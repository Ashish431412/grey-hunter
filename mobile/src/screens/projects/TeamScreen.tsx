import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';

const THEME = {
  background: '#0a0e14',
  primary: '#00ff41',
  accent: '#00d4ff',
  surface: '#131820',
  text: '#e0e0e0',
  card: '#1a212d',
};

const TEAM = [
  { id: '1', name: 'GUEST_01', role: 'OWNER', status: 'ONLINE' },
  { id: '2', name: 'AGENT_X', role: 'EDITOR', status: 'OFFLINE' },
  { id: '3', name: 'OBSERVER', role: 'VIEWER', status: 'ONLINE' },
];

export const TeamScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.inviteSection}>
        <Text style={styles.sectionTitle}>// INVITE_MEMBER</Text>
        <View style={styles.inviteRow}>
          <TextInput 
            style={styles.inviteInput}
            placeholder="[ AGENT_ID or EMAIL ]"
            placeholderTextColor="#555"
          />
          <TouchableOpacity style={styles.inviteBtn}>
            <Text style={styles.inviteBtnText}>SEND</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>// ACTIVE_ROSTER</Text>
      <FlatList
        data={TEAM}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.memberCard}>
            <View style={styles.memberInfo}>
              <View style={[styles.statusDot, { backgroundColor: item.status === 'ONLINE' ? THEME.primary : '#555' }]} />
              <Text style={styles.memberName}>{item.name}</Text>
            </View>
            <View style={styles.roleBox}>
              <Text style={styles.roleText}>{item.role}</Text>
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
    padding: 15,
  },
  inviteSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: THEME.accent,
    fontFamily: 'monospace',
    marginBottom: 15,
  },
  inviteRow: {
    flexDirection: 'row',
  },
  inviteInput: {
    flex: 1,
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: '#333',
    color: THEME.text,
    padding: 10,
    fontFamily: 'monospace',
    marginRight: 10,
  },
  inviteBtn: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteBtnText: {
    color: THEME.background,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  memberCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.card,
    padding: 15,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 10,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  memberName: {
    color: THEME.text,
    fontFamily: 'monospace',
  },
  roleBox: {
    borderWidth: 1,
    borderColor: THEME.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  roleText: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 10,
  },
});
