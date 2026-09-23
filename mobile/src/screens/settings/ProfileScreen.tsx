import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const THEME = {
  background: '#0a0e14',
  primary: '#00ff41',
  accent: '#00d4ff',
  surface: '#131820',
  text: '#e0e0e0',
  error: '#ff003c',
};

export const ProfileScreen = ({ navigation }: any) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>OP</Text>
        </View>
        <Text style={styles.name}>SYS_OP: GUEST_01</Text>
        <Text style={styles.roleBadge}>ROOT_ADMIN</Text>
      </View>

      <View style={styles.detailsBox}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>EMAIL</Text>
          <Text style={styles.detailValue}>guest.01@greyhunter.net</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>JOIN_DATE</Text>
          <Text style={styles.detailValue}>2023.01.15</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>// LIFETIME_STATS</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>1,042</Text>
          <Text style={styles.statLabel}>SCANS</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>15</Text>
          <Text style={styles.statLabel}>PROJECTS</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>BADGES</Text>
        </View>
      </View>

      <View style={styles.actionsBox}>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionText}>EDIT_DISPLAY_NAME</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.actionText}>TERMINATE_SESSION</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dangerBtn}>
          <Text style={styles.dangerText}>DESTROY_ACCOUNT</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    backgroundColor: THEME.surface,
    borderWidth: 2,
    borderColor: THEME.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: THEME.primary,
    fontSize: 32,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  name: {
    color: THEME.text,
    fontSize: 20,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  roleBadge: {
    backgroundColor: THEME.error,
    color: THEME.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
  },
  detailsBox: {
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: '#333',
    padding: 15,
    marginBottom: 30,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  detailLabel: {
    color: THEME.accent,
    fontFamily: 'monospace',
  },
  detailValue: {
    color: THEME.text,
    fontFamily: 'monospace',
  },
  sectionTitle: {
    color: THEME.primary,
    fontFamily: 'monospace',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statBox: {
    flex: 1,
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: '#333',
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statNumber: {
    color: THEME.primary,
    fontSize: 20,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#888',
    fontSize: 10,
    fontFamily: 'monospace',
    marginTop: 5,
  },
  actionsBox: {
    gap: 15,
  },
  actionBtn: {
    borderWidth: 1,
    borderColor: THEME.text,
    padding: 15,
    alignItems: 'center',
  },
  actionText: {
    color: THEME.text,
    fontFamily: 'monospace',
  },
  dangerBtn: {
    backgroundColor: 'rgba(255, 0, 60, 0.1)',
    borderWidth: 1,
    borderColor: THEME.error,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  dangerText: {
    color: THEME.error,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
});
