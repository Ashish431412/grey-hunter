import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { DragonBackground } from '../../components/common/DragonBackground';

const THEME = {
  background: '#070f1e', // Mythic Dragon Abyss
  primary: '#00ff66',    // Dragon Emerald Green
  accent: '#00d4ff',     // Dragon Cyan Blue
  surface: '#0d1b2e',    // Dragon Scale Slate
  card: '#11223a',       // Dragon Blue Card
  text: '#ffffff',       // Pure Crisp White
  textMuted: '#8ba8cc',  // Ice Blue Silver
  border: '#163252',
  error: '#ff2247',
};

export const DashboardScreen = ({ navigation }: any) => {
  const [vpnEnabled, setVpnEnabled] = useState(false);

  const QUICK_TOOLS = [
    { name: 'NMAP', icon: 'N', color: THEME.primary, id: '1' },
    { name: 'NETDISCOVER', icon: 'ND', color: THEME.accent, id: '2' },
    { name: 'SQLMAP', icon: 'SQ', color: THEME.primary, id: '12' },
    { name: 'HYDRA', icon: 'HY', color: '#ff2247', id: '13' },
    { name: 'MSF', icon: 'M', color: THEME.accent, id: '11' },
    { name: 'TERM', icon: '>', color: '#ffffff', id: 'term' },
  ];

  return (
    <DragonBackground overlayOpacity={0.84}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>OP</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.greeting}>SYS_OP: GUEST_01</Text>
          <Text style={styles.status}>STATUS: ONLINE</Text>
        </View>
      </View>

      <View style={styles.vpnCard}>
        <View>
          <Text style={styles.cardTitle}>SECURE_TUNNEL</Text>
          <Text style={[styles.vpnStatus, { color: vpnEnabled ? THEME.primary : THEME.text }]}>
            {vpnEnabled ? 'CONNECTED (10.8.0.4)' : 'DISCONNECTED'}
          </Text>
        </View>
        <Switch
          trackColor={{ false: '#767577', true: 'rgba(0, 255, 65, 0.5)' }}
          thumbColor={vpnEnabled ? THEME.primary : '#f4f3f4'}
          onValueChange={() => setVpnEnabled(!vpnEnabled)}
          value={vpnEnabled}
        />
      </View>

      <Text style={styles.sectionTitle}>// QUICK_LAUNCH</Text>
      <View style={styles.grid}>
        {QUICK_TOOLS.map((tool) => (
          <TouchableOpacity 
            key={tool.name} 
            style={styles.toolCard}
            onPress={() => {
              if (tool.id === 'term') {
                navigation.navigate('Terminal');
              } else {
                navigation.navigate('Tools', { screen: 'ToolDetail', params: { toolId: tool.id } });
              }
            }}
          >
            <Text style={[styles.toolIcon, { color: tool.color }]}>{tool.icon}</Text>
            <Text style={styles.toolName}>{tool.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>// SYS_STATS</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>42</Text>
          <Text style={styles.statLabel}>SCANS</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>PROJS</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>85%</Text>
          <Text style={styles.statLabel}>SCORE</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>// RECENT_ACTIVITY</Text>
      <View style={styles.activityList}>
        <Text style={styles.activityItem}>[10:04] NMAP SYN_SCAN on 192.168.1.0/24</Text>
        <Text style={styles.activityItem}>[09:12] Updated PROJ_ALPHA credentials</Text>
        <Text style={styles.activityItem}>[08:45] Read doc: "OWASP Top 10"</Text>
      </View>
    </ScrollView>
  </DragonBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: THEME.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    color: THEME.text,
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 12,
  },
  vpnCard: {
    backgroundColor: THEME.card,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 25,
  },
  cardTitle: {
    color: THEME.text,
    fontFamily: 'monospace',
    marginBottom: 5,
  },
  vpnStatus: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  sectionTitle: {
    color: THEME.accent,
    fontFamily: 'monospace',
    marginBottom: 15,
    fontSize: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  toolCard: {
    width: '48%',
    backgroundColor: THEME.card,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  toolIcon: {
    fontSize: 32,
    fontFamily: 'monospace',
    marginBottom: 10,
  },
  toolName: {
    color: THEME.text,
    fontFamily: 'monospace',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statBox: {
    flex: 1,
    backgroundColor: THEME.card,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  statValue: {
    color: THEME.primary,
    fontSize: 24,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  statLabel: {
    color: THEME.text,
    fontSize: 10,
    fontFamily: 'monospace',
  },
  activityList: {
    backgroundColor: THEME.card,
    padding: 15,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 30,
  },
  activityItem: {
    color: '#888',
    fontFamily: 'monospace',
    fontSize: 12,
    marginBottom: 10,
  },
});
