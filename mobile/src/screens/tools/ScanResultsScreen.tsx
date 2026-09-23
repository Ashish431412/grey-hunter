import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { DragonBackground } from '../../components/common/DragonBackground';

const THEME = {
  background: '#070f1e', // Dragon Abyss
  primary: '#00ff66',    // Dragon Emerald Green
  accent: '#00d4ff',     // Dragon Cyan Blue
  surface: '#0d1b2e',    // Dragon Scale Slate
  surfaceLight: '#142742',
  border: '#163252',     // Dragon Border
  text: '#ffffff',       // Pure Crisp White
  textMuted: '#8ba8cc',  // Ice Blue Silver
  critical: '#ff1744',   // Neon Red
  high: '#ff5252',       // High Coral
  medium: '#ffab00',     // Warning Amber
  low: '#00e5ff',        // Cyan Low
  info: '#78909c',       // Muted Info
  success: '#00e676',    // Emerald Green
};

interface VulnItem {
  id: string;
  cve: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  cvss: number;
  port: string;
  service: string;
  description: string;
  remediation: string;
}

const SAMPLE_VULNS: VulnItem[] = [
  {
    id: 'v1',
    cve: 'CVE-2023-38408',
    title: 'OpenSSH PKCS#11 Forwarding Remote Code Execution Risk',
    severity: 'HIGH',
    cvss: 7.8,
    port: '22/tcp',
    service: 'OpenSSH 8.2p1',
    description: 'Condition in ssh-agent allows attacker with forwarded agent access to load arbitrary PKCS#11 shared libraries.',
    remediation: 'Upgrade OpenSSH to version 9.3p2 or later, or set "AllowAgentForwarding no" in /etc/ssh/sshd_config.',
  },
  {
    id: 'v2',
    cve: 'CWE-693',
    title: 'Missing HTTP Strict-Transport-Security (HSTS) Header',
    severity: 'MEDIUM',
    cvss: 5.3,
    port: '80/tcp',
    service: 'nginx 1.18.0',
    description: 'The web server does not enforce HTTPS communication, leaving connections susceptible to SSL stripping attacks.',
    remediation: 'Add "add_header Strict-Transport-Security \'max-age=31536000; includeSubDomains\' always;" to reverse proxy configuration.',
  },
  {
    id: 'v3',
    cve: 'CWE-200',
    title: 'Server Banner & Version Information Disclosure',
    severity: 'LOW',
    cvss: 3.1,
    port: '80/tcp',
    service: 'nginx 1.18.0',
    description: 'The HTTP response headers reveal exact server daemon and operating system version numbers.',
    remediation: 'Configure "server_tokens off;" in nginx.conf or "ServerTokens Prod" in Apache.',
  },
  {
    id: 'v4',
    cve: 'INFO-01',
    title: 'Standard SSH & HTTPS Service Exposure',
    severity: 'INFO',
    cvss: 0.0,
    port: '443/tcp',
    service: 'nginx / TLS 1.3',
    description: 'Encrypted communication channel active with modern TLS 1.3 cipher suite negotiation.',
    remediation: 'Regularly audit public certificate expiration dates and ensure legacy TLS 1.0/1.1 remain disabled.',
  },
];

export const ScanResultsScreen = ({ route, navigation }: any) => {
  const [activeTab, setActiveTab] = useState<'POSTURE' | 'VULNS' | 'HOSTS' | 'RAW'>('POSTURE');
  const [expandedVuln, setExpandedVuln] = useState<string | null>('v1');

  const handleShareReport = async () => {
    try {
      await Share.share({
        title: 'Grey Hunter - Security Audit Report',
        message:
          'GREY HUNTER CYBERSECURITY AUDIT REPORT\n' +
          'Target: 192.168.1.100\n' +
          'Security Posture Score: 78/100 (B - MODERATE RISK)\n' +
          'Discovered Vulnerabilities: 1 High, 1 Medium, 1 Low, 1 Info\n' +
          'Audited by Grey Hunter Mobile Security Suite.',
      });
    } catch (e: any) {
      Alert.alert('Export Error', e.message);
    }
  };

  const getSeverityBadgeColor = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return THEME.critical;
      case 'HIGH':
        return THEME.high;
      case 'MEDIUM':
        return THEME.medium;
      case 'LOW':
        return THEME.low;
      default:
        return THEME.info;
    }
  };

  return (
    <DragonBackground overlayOpacity={0.82}>
      <View style={styles.container}>
        {/* Top Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.badgeText}>[ TELEMETRY & ANALYSIS REPORT ]</Text>
              <Text style={styles.targetTitle}>TARGET: 192.168.1.100</Text>
            </View>
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>AUDIT COMPLETED</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>TOOL: Nmap v7.94-NSE</Text>
            <Text style={styles.metaItem}>DURATION: 2.14s</Text>
            <Text style={styles.metaItem}>PORTS: 1,000 SCANNED</Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabBar}>
          {[
            { id: 'POSTURE', label: 'POSTURE' },
            { id: 'VULNS', label: 'VULNS (3)' },
            { id: 'HOSTS', label: 'HOSTS & PORTS' },
            { id: 'RAW', label: 'RAW LOGS' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id as any)}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          {activeTab === 'POSTURE' && (
            <View>
              {/* Security Score Card */}
              <View style={styles.scoreCard}>
                <View style={styles.scoreCircle}>
                  <Text style={styles.scoreNumber}>78</Text>
                  <Text style={styles.scoreMax}>/ 100</Text>
                </View>
                <View style={styles.scoreInfo}>
                  <Text style={styles.scoreGrade}>GRADE: B (MODERATE RISK)</Text>
                  <Text style={styles.scoreDescription}>
                    Target has 3 open service listeners. 1 high-priority remediation advisory detected.
                  </Text>
                </View>
              </View>

              {/* Severity Breakdown Matrix */}
              <Text style={styles.sectionTitle}>THREAT SEVERITY MATRIX</Text>
              <View style={styles.matrixContainer}>
                <View style={[styles.matrixCard, { borderColor: THEME.critical }]}>
                  <Text style={[styles.matrixCount, { color: THEME.critical }]}>0</Text>
                  <Text style={styles.matrixLabel}>CRITICAL</Text>
                </View>
                <View style={[styles.matrixCard, { borderColor: THEME.high }]}>
                  <Text style={[styles.matrixCount, { color: THEME.high }]}>1</Text>
                  <Text style={styles.matrixLabel}>HIGH</Text>
                </View>
                <View style={[styles.matrixCard, { borderColor: THEME.medium }]}>
                  <Text style={[styles.matrixCount, { color: THEME.medium }]}>1</Text>
                  <Text style={styles.matrixLabel}>MEDIUM</Text>
                </View>
                <View style={[styles.matrixCard, { borderColor: THEME.low }]}>
                  <Text style={[styles.matrixCount, { color: THEME.low }]}>1</Text>
                  <Text style={styles.matrixLabel}>LOW</Text>
                </View>
              </View>

              {/* Attack Surface Summary */}
              <Text style={styles.sectionTitle}>ATTACK SURFACE & HARDENING</Text>
              <View style={styles.surfaceCard}>
                <View style={styles.surfaceRow}>
                  <Text style={styles.surfaceKey}>Host Reachability:</Text>
                  <Text style={[styles.surfaceVal, { color: THEME.success }]}>ONLINE (0.0024s RTT)</Text>
                </View>
                <View style={styles.surfaceRow}>
                  <Text style={styles.surfaceKey}>Firewall Policy:</Text>
                  <Text style={styles.surfaceVal}>997 Filtered/Closed Ports</Text>
                </View>
                <View style={styles.surfaceRow}>
                  <Text style={styles.surfaceKey}>OS Fingerprint:</Text>
                  <Text style={styles.surfaceVal}>Linux 5.15 / Ubuntu 22.04 LTS</Text>
                </View>
                <View style={styles.surfaceRow}>
                  <Text style={styles.surfaceKey}>Encryption Transit:</Text>
                  <Text style={[styles.surfaceVal, { color: THEME.accent }]}>TLS 1.3 Available</Text>
                </View>
              </View>

              {/* Priority Action Card */}
              <View style={styles.actionAdvisoryCard}>
                <Text style={styles.actionAdvisoryTitle}>⚡ TOP REMEDIATION ACTION</Text>
                <Text style={styles.actionAdvisoryBody}>
                  Patch OpenSSH daemon on target to mitigate CVE-2023-38408. Ensure port 80 enforces automatic 301 redirection to HTTPS.
                </Text>
              </View>
            </View>
          )}

          {activeTab === 'VULNS' && (
            <View>
              <Text style={styles.sectionTitle}>IDENTIFIED SECURITY FINDINGS</Text>
              {SAMPLE_VULNS.map((vuln) => {
                const isExpanded = expandedVuln === vuln.id;
                const badgeColor = getSeverityBadgeColor(vuln.severity);
                return (
                  <View key={vuln.id} style={styles.vulnCard}>
                    <TouchableOpacity
                      style={styles.vulnHeader}
                      onPress={() => setExpandedVuln(isExpanded ? null : vuln.id)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.vulnHeaderLeft}>
                        <View style={[styles.vulnBadge, { backgroundColor: badgeColor }]}>
                          <Text style={styles.vulnBadgeText}>{vuln.severity}</Text>
                        </View>
                        <Text style={styles.vulnCve}>{vuln.cve}</Text>
                        <Text style={styles.vulnCvss}>CVSS {vuln.cvss.toFixed(1)}</Text>
                      </View>
                      <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
                    </TouchableOpacity>

                    <Text style={styles.vulnTitle}>{vuln.title}</Text>
                    <Text style={styles.vulnService}>
                      AFFECTS: <Text style={{ color: THEME.accent }}>{vuln.service}</Text> ({vuln.port})
                    </Text>

                    {isExpanded && (
                      <View style={styles.vulnDetails}>
                        <Text style={styles.vulnDescTitle}>THREAT ANALYSIS:</Text>
                        <Text style={styles.vulnDesc}>{vuln.description}</Text>

                        <Text style={styles.vulnRemTitle}>RECOMMENDED MITIGATION:</Text>
                        <View style={styles.remBox}>
                          <Text style={styles.remText}>{vuln.remediation}</Text>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {activeTab === 'HOSTS' && (
            <View>
              <Text style={styles.sectionTitle}>OPEN PORTS & ACTIVE SERVICES</Text>
              <View style={styles.hostCard}>
                <View style={styles.hostHeader}>
                  <Text style={styles.hostIp}>192.168.1.100</Text>
                  <Text style={styles.hostState}>[ 3 PORTS OPEN ]</Text>
                </View>

                {/* Port Row 1 */}
                <View style={styles.portItem}>
                  <View style={styles.portMeta}>
                    <Text style={styles.portNumber}>22/TCP</Text>
                    <View style={styles.openTag}>
                      <Text style={styles.openTagText}>OPEN</Text>
                    </View>
                  </View>
                  <Text style={styles.portServiceText}>ssh // OpenSSH 8.2p1 Ubuntu-4ubuntu0.5</Text>
                  <Text style={styles.portExtra}>HostKey: ssh-ed25519 AAAAC3NzaC1lZDI1NTE5...</Text>
                </View>

                {/* Port Row 2 */}
                <View style={styles.portItem}>
                  <View style={styles.portMeta}>
                    <Text style={styles.portNumber}>80/TCP</Text>
                    <View style={styles.openTag}>
                      <Text style={styles.openTagText}>OPEN</Text>
                    </View>
                  </View>
                  <Text style={styles.portServiceText}>http // nginx 1.18.0 (Ubuntu)</Text>
                  <Text style={styles.portExtra}>Title: Welcome to Nginx! // Missing HSTS</Text>
                </View>

                {/* Port Row 3 */}
                <View style={styles.portItem}>
                  <View style={styles.portMeta}>
                    <Text style={styles.portNumber}>443/TCP</Text>
                    <View style={styles.openTag}>
                      <Text style={styles.openTagText}>OPEN</Text>
                    </View>
                  </View>
                  <Text style={styles.portServiceText}>ssl/https // nginx 1.18.0</Text>
                  <Text style={styles.portExtra}>TLS: TLSv1.3 ECDHE-RSA-AES256-GCM-SHA384</Text>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'RAW' && (
            <View style={styles.rawContainer}>
              <Text style={styles.rawText}>
                {`# Grey Hunter High-Performance Execution Engine
Starting Nmap 7.94 ( https://nmap.org ) at 2026-09-23 20:30 UTC
NSE: Loaded 156 scripts for scanning.
NSE: Script Pre-scanning.
Initiating ARP Ping Scan at 20:30
Completed ARP Ping Scan at 20:30, 0.04s elapsed (1 total hosts)
Initiating Parallel DNS resolution of 1 host. at 20:30
Completed Parallel DNS resolution of 1 host. at 20:30, 0.01s elapsed
Initiating SYN Stealth Scan at 20:30
Scanning 192.168.1.100 [1000 ports]
Discovered open port 22/tcp on 192.168.1.100
Discovered open port 80/tcp on 192.168.1.100
Discovered open port 443/tcp on 192.168.1.100
Completed SYN Stealth Scan at 20:30, 0.82s elapsed (1000 total ports)
Initiating Service scan at 20:30
Scanning 3 services on 192.168.1.100
Completed Service scan at 20:30, 1.25s elapsed (3 services on 1 host)
NSE: Script scanning 192.168.1.100.
Initiating NSE at 20:30
Completed NSE at 20:30, 0.02s elapsed

Nmap scan report for 192.168.1.100
Host is up (0.0024s latency).
Not shown: 997 closed tcp ports (reset)
PORT    STATE SERVICE  VERSION
22/tcp  open  ssh      OpenSSH 8.2p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0)
80/tcp  open  http     nginx 1.18.0 (Ubuntu)
443/tcp open  ssl/http nginx 1.18.0 (Ubuntu)
MAC Address: 08:00:27:BC:31:0A (Cadence Design Systems / VirtualBox)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Nmap done: 1 IP address (1 host up) scanned in 2.14 seconds`}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom Action Footer */}
        <View style={styles.exportFooter}>
          <TouchableOpacity style={styles.actionBtnOutline} onPress={handleShareReport}>
            <Text style={styles.actionBtnOutlineText}>[ EXPORT REPORT / SHARE ]</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtnPrimary}
            onPress={() => Alert.alert('Re-Audit', 'Initiating automated re-verification scan...')}
          >
            <Text style={styles.actionBtnPrimaryText}>RE-AUDIT HOST()</Text>
          </TouchableOpacity>
        </View>
      </View>
    </DragonBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerCard: {
    backgroundColor: 'rgba(13, 27, 46, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: THEME.accent,
    letterSpacing: 1.5,
  },
  targetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    color: THEME.primary,
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 102, 0.1)',
    borderWidth: 1,
    borderColor: THEME.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.primary,
    marginRight: 6,
  },
  statusText: {
    fontSize: 9,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: THEME.primary,
    letterSpacing: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    color: THEME.textMuted,
    fontFamily: 'monospace',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(7, 15, 30, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: THEME.primary,
  },
  tabText: {
    color: THEME.textMuted,
    fontFamily: 'monospace',
    fontSize: 11,
    letterSpacing: 1,
  },
  activeTabText: {
    color: THEME.primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginTop: 8,
    marginBottom: 10,
  },
  scoreCard: {
    backgroundColor: 'rgba(13, 27, 46, 0.85)',
    borderWidth: 1,
    borderColor: THEME.border,
    padding: 16,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: THEME.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    backgroundColor: 'rgba(255, 171, 0, 0.08)',
  },
  scoreNumber: {
    color: THEME.medium,
    fontFamily: 'monospace',
    fontSize: 22,
    fontWeight: 'bold',
  },
  scoreMax: {
    color: THEME.textMuted,
    fontFamily: 'monospace',
    fontSize: 10,
    marginTop: -2,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreGrade: {
    color: THEME.medium,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  scoreDescription: {
    color: THEME.textMuted,
    fontFamily: 'monospace',
    fontSize: 11,
    lineHeight: 16,
  },
  matrixContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  matrixCard: {
    flex: 1,
    backgroundColor: 'rgba(13, 27, 46, 0.85)',
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 4,
  },
  matrixCount: {
    fontFamily: 'monospace',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  matrixLabel: {
    color: THEME.textMuted,
    fontFamily: 'monospace',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  surfaceCard: {
    backgroundColor: 'rgba(13, 27, 46, 0.85)',
    borderWidth: 1,
    borderColor: THEME.border,
    padding: 14,
    borderRadius: 6,
    marginBottom: 16,
  },
  surfaceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(22, 50, 82, 0.5)',
  },
  surfaceKey: {
    color: THEME.textMuted,
    fontFamily: 'monospace',
    fontSize: 11,
  },
  surfaceVal: {
    color: THEME.text,
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '600',
  },
  actionAdvisoryCard: {
    backgroundColor: 'rgba(0, 212, 255, 0.08)',
    borderWidth: 1,
    borderColor: THEME.accent,
    padding: 14,
    borderRadius: 6,
    marginBottom: 16,
  },
  actionAdvisoryTitle: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 6,
  },
  actionAdvisoryBody: {
    color: THEME.text,
    fontFamily: 'monospace',
    fontSize: 11,
    lineHeight: 16,
  },
  vulnCard: {
    backgroundColor: 'rgba(13, 27, 46, 0.85)',
    borderWidth: 1,
    borderColor: THEME.border,
    padding: 14,
    borderRadius: 6,
    marginBottom: 12,
  },
  vulnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  vulnHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vulnBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  vulnBadgeText: {
    color: '#000',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 9,
  },
  vulnCve: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
  },
  vulnCvss: {
    color: THEME.textMuted,
    fontFamily: 'monospace',
    fontSize: 10,
  },
  expandIcon: {
    color: THEME.textMuted,
    fontSize: 10,
  },
  vulnTitle: {
    color: THEME.text,
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  vulnService: {
    color: THEME.textMuted,
    fontFamily: 'monospace',
    fontSize: 10,
    marginBottom: 6,
  },
  vulnDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
  },
  vulnDescTitle: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  vulnDesc: {
    color: THEME.textMuted,
    fontFamily: 'monospace',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 10,
  },
  vulnRemTitle: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  remBox: {
    backgroundColor: 'rgba(0, 255, 102, 0.06)',
    borderLeftWidth: 3,
    borderLeftColor: THEME.primary,
    padding: 8,
  },
  remText: {
    color: THEME.text,
    fontFamily: 'monospace',
    fontSize: 11,
    lineHeight: 15,
  },
  hostCard: {
    backgroundColor: 'rgba(13, 27, 46, 0.85)',
    borderWidth: 1,
    borderColor: THEME.border,
    padding: 14,
    borderRadius: 6,
  },
  hostHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
    marginBottom: 12,
  },
  hostIp: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
  },
  hostState: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontSize: 11,
  },
  portItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(22, 50, 82, 0.4)',
  },
  portMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  portNumber: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
  },
  openTag: {
    backgroundColor: 'rgba(0, 255, 102, 0.15)',
    borderWidth: 1,
    borderColor: THEME.primary,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 2,
  },
  openTagText: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 9,
    fontWeight: 'bold',
  },
  portServiceText: {
    color: THEME.text,
    fontFamily: 'monospace',
    fontSize: 12,
  },
  portExtra: {
    color: THEME.textMuted,
    fontFamily: 'monospace',
    fontSize: 10,
    marginTop: 2,
  },
  rawContainer: {
    backgroundColor: '#040913',
    borderWidth: 1,
    borderColor: THEME.border,
    padding: 12,
    borderRadius: 4,
  },
  rawText: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 11,
    lineHeight: 16,
  },
  exportFooter: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'rgba(7, 15, 30, 0.95)',
    borderTopWidth: 1,
    borderTopColor: THEME.border,
    gap: 8,
  },
  actionBtnOutline: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: THEME.accent,
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: 'rgba(0, 212, 255, 0.05)',
  },
  actionBtnOutlineText: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
  },
  actionBtnPrimary: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    borderRadius: 4,
  },
  actionBtnPrimaryText: {
    color: THEME.background,
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
