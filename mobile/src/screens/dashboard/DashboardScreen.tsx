import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Animated } from 'react-native';
import { DragonBackground } from '../../components/common/DragonBackground';

const THEME = {
  background: '#070f1e',
  primary: '#00ff66',
  accent: '#00d4ff',
  surface: '#0d1b2e',
  card: '#11223a',
  text: '#ffffff',
  textMuted: '#8ba8cc',
  border: '#163252',
  error: '#ff2247',
  warning: '#ffaa00',
};

const THREAT_FEED = [
  { id: 1, severity: 'CRITICAL', title: 'CVE-2024-3094 — XZ Utils Backdoor', target: 'liblzma 5.6.0-5.6.1', time: '2h ago' },
  { id: 2, severity: 'HIGH', title: 'CVE-2024-21762 — FortiOS Out-of-Bound Write', target: 'FortiGate SSL VPN', time: '5h ago' },
  { id: 3, severity: 'CRITICAL', title: 'CVE-2023-44228 — Log4Shell RCE Variant', target: 'Apache Log4j 2.x', time: '1d ago' },
  { id: 4, severity: 'MEDIUM', title: 'CVE-2024-0056 — .NET Info Disclosure', target: 'Microsoft .NET 8.0', time: '2d ago' },
  { id: 5, severity: 'HIGH', title: 'CVE-2024-23897 — Jenkins CLI Path Traversal', target: 'Jenkins <= 2.441', time: '3d ago' },
];

const QUICK_ACTIONS = [
  { name: 'NETWORK MAP', icon: '🗺️', screen: 'NetworkMap', color: '#00d4ff' },
  { name: 'EXPLOIT DB', icon: '💀', screen: 'ExploitDB', color: '#ff2247' },
  { name: 'CVSS CALC', icon: '🧮', screen: 'CVSSCalculator', color: '#ffaa00' },
  { name: 'PASS GEN', icon: '🔑', screen: 'PasswordGen', color: '#00ff66' },
  { name: 'CHEAT SHEETS', icon: '📋', screen: 'CheatSheet', color: '#00d4ff' },
  { name: 'SCAN HISTORY', icon: '📊', screen: 'ScanHistory', color: '#8ba8cc' },
];

const severityColor = (s: string) => {
  switch (s) {
    case 'CRITICAL': return '#ff2247';
    case 'HIGH': return '#ff6644';
    case 'MEDIUM': return '#ffaa00';
    case 'LOW': return '#00ff66';
    default: return '#8ba8cc';
  }
};

export const DashboardScreen = ({ navigation }: any) => {
  const [vpnEnabled, setVpnEnabled] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const [projCount, setProjCount] = useState(0);
  const [score, setScore] = useState(0);
  const [toolCount] = useState(61);

  // Animate stats counting up on mount
  useEffect(() => {
    const targets = { scans: 47, projs: 5, score: 88 };
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      setScanCount(Math.min(Math.round(targets.scans * (frame / 20)), targets.scans));
      setProjCount(Math.min(Math.round(targets.projs * (frame / 20)), targets.projs));
      setScore(Math.min(Math.round(targets.score * (frame / 20)), targets.score));
      if (frame >= 20) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const QUICK_TOOLS = [
    { name: 'NMAP', icon: 'N', color: THEME.primary, id: 'nmap' },
    { name: 'NUCLEI', icon: 'NU', color: THEME.accent, id: 'nuclei' },
    { name: 'SQLMAP', icon: 'SQ', color: THEME.primary, id: 'sqlmap' },
    { name: 'HYDRA', icon: 'HY', color: THEME.error, id: 'hydra' },
    { name: 'MSF', icon: 'M', color: THEME.accent, id: 'msfconsole' },
    { name: 'TERM', icon: '>', color: '#ffffff', id: 'term' },
  ];

  return (
    <DragonBackground overlayOpacity={0.84}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>OP</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>SYS_OP: GUEST_01</Text>
            <Text style={styles.status}>STATUS: ONLINE</Text>
          </View>
          <View style={styles.toolCountBadge}>
            <Text style={styles.toolCountValue}>{toolCount}</Text>
            <Text style={styles.toolCountLabel}>TOOLS</Text>
          </View>
        </View>

        {/* VPN Card */}
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

        {/* Quick Launch */}
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

        {/* System Stats */}
        <Text style={styles.sectionTitle}>// SYS_STATS</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{scanCount}</Text>
            <Text style={styles.statLabel}>SCANS</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{projCount}</Text>
            <Text style={styles.statLabel}>PROJS</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: score >= 80 ? THEME.primary : THEME.warning }]}>{score}%</Text>
            <Text style={styles.statLabel}>SCORE</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: THEME.accent }]}>{toolCount}</Text>
            <Text style={styles.statLabel}>ARSENAL</Text>
          </View>
        </View>

        {/* Quick Actions - New Feature Shortcuts */}
        <Text style={styles.sectionTitle}>// QUICK_ACTIONS</Text>
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.name}
              style={styles.actionCard}
              onPress={() => {
                navigation.navigate('Tools', { screen: action.screen });
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={[styles.actionName, { color: action.color }]}>{action.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Threat Intelligence Feed */}
        <Text style={styles.sectionTitle}>// THREAT_INTEL_FEED</Text>
        <View style={styles.threatFeed}>
          <View style={styles.threatHeader}>
            <Text style={styles.threatHeaderText}>LIVE VULNERABILITY ADVISORIES</Text>
            <View style={styles.liveDot} />
          </View>
          {THREAT_FEED.map((threat) => (
            <TouchableOpacity key={threat.id} style={styles.threatItem} activeOpacity={0.7}>
              <View style={styles.threatLeft}>
                <View style={[styles.severityBadge, { backgroundColor: severityColor(threat.severity) + '22', borderColor: severityColor(threat.severity) }]}>
                  <Text style={[styles.severityText, { color: severityColor(threat.severity) }]}>{threat.severity}</Text>
                </View>
                <View style={styles.threatInfo}>
                  <Text style={styles.threatTitle} numberOfLines={1}>{threat.title}</Text>
                  <Text style={styles.threatTarget}>{threat.target}</Text>
                </View>
              </View>
              <Text style={styles.threatTime}>{threat.time}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>// RECENT_ACTIVITY</Text>
        <View style={styles.activityList}>
          <Text style={styles.activityItem}>[12:04] NUCLEI template_scan on staging.example.com</Text>
          <Text style={styles.activityItem}>[11:30] NMAP SYN_SCAN on 10.10.14.0/24 — 12 hosts up</Text>
          <Text style={styles.activityItem}>[10:15] SQLMAP injection test on /api/v1/search</Text>
          <Text style={styles.activityItem}>[09:45] Generated CVSS 3.1 score: 8.8 HIGH</Text>
          <Text style={styles.activityItem}>[09:12] Updated PROJ_ALPHA target scope</Text>
          <Text style={styles.activityItem}>[08:45] Read doc: "BloodHound AD Attack Paths"</Text>
        </View>

        <View style={{ height: 30 }} />
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
  toolCountBadge: {
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: THEME.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  toolCountValue: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 18,
  },
  toolCountLabel: {
    color: THEME.textMuted,
    fontFamily: 'monospace',
    fontSize: 8,
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
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: '#333',
  },
  statValue: {
    color: THEME.primary,
    fontSize: 22,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  statLabel: {
    color: THEME.text,
    fontSize: 9,
    fontFamily: 'monospace',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  actionCard: {
    width: '31%',
    backgroundColor: THEME.card,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  actionIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  actionName: {
    fontFamily: 'monospace',
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  threatFeed: {
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 25,
    overflow: 'hidden',
  },
  threatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  threatHeaderText: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.error,
  },
  threatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  threatLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    marginRight: 10,
    minWidth: 65,
    alignItems: 'center',
  },
  severityText: {
    fontFamily: 'monospace',
    fontSize: 8,
    fontWeight: 'bold',
  },
  threatInfo: {
    flex: 1,
  },
  threatTitle: {
    color: THEME.text,
    fontFamily: 'monospace',
    fontSize: 11,
  },
  threatTarget: {
    color: THEME.textMuted,
    fontFamily: 'monospace',
    fontSize: 9,
    marginTop: 2,
  },
  threatTime: {
    color: THEME.textMuted,
    fontFamily: 'monospace',
    fontSize: 9,
    marginLeft: 8,
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
