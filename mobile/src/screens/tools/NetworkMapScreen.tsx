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
  background: '#070f1e',
  primary: '#00ff66',
  accent: '#00d4ff',
  surface: '#0d1b2e',
  card: '#11223a',
  text: '#ffffff',
  textMuted: '#8ba8cc',
  border: '#163252',
  error: '#ff2247',
};

type HostType = 'router' | 'server' | 'workstation' | 'printer' | 'iot' | 'unknown';

interface PortDetail {
  port: number;
  proto: 'TCP' | 'UDP';
  service: string;
  banner: string;
}

interface HostNode {
  id: string;
  ip: string;
  mac: string;
  hostname: string;
  type: HostType;
  osGuess: string;
  status: 'online' | 'offline';
  latency: string;
  ports: PortDetail[];
}

const NETWORK_HOSTS: HostNode[] = [
  {
    id: 'h1',
    ip: '192.168.1.1',
    mac: '00:1A:2B:3C:4D:01',
    hostname: 'gw-core.local',
    type: 'router',
    osGuess: 'Cisco IOS-XE / Linux 5.4 Embedded',
    status: 'online',
    latency: '1.2ms',
    ports: [
      { port: 22, proto: 'TCP', service: 'ssh', banner: 'Cisco SSH 2.0 (dropbear)' },
      { port: 53, proto: 'UDP', service: 'dns', banner: 'dnsmasq-2.85 cache' },
      { port: 80, proto: 'TCP', service: 'http', banner: 'Cisco Gateway Web Admin' },
      { port: 443, proto: 'TCP', service: 'https', banner: 'TLSv1.3 OpenSSL 1.1.1w' },
    ],
  },
  {
    id: 'h2',
    ip: '192.168.1.10',
    mac: '00:50:56:A1:B2:C3',
    hostname: 'srv-db01.local',
    type: 'server',
    osGuess: 'Ubuntu Linux 22.04 LTS (Jammy)',
    status: 'online',
    latency: '0.8ms',
    ports: [
      { port: 22, proto: 'TCP', service: 'ssh', banner: 'OpenSSH 8.9p1 Ubuntu-3ubuntu0.6' },
      { port: 3306, proto: 'TCP', service: 'mysql', banner: 'MySQL Community Server 8.0.35' },
      { port: 5432, proto: 'TCP', service: 'postgresql', banner: 'PostgreSQL 14.9 on x86_64' },
      { port: 9100, proto: 'TCP', service: 'metrics', banner: 'Prometheus Node Exporter 1.6.1' },
    ],
  },
  {
    id: 'h3',
    ip: '192.168.1.15',
    mac: '00:50:56:A1:B2:D4',
    hostname: 'srv-web-edge.local',
    type: 'server',
    osGuess: 'Debian GNU/Linux 11 (Bullseye)',
    status: 'online',
    latency: '1.0ms',
    ports: [
      { port: 22, proto: 'TCP', service: 'ssh', banner: 'OpenSSH 8.4p1 Debian-5+deb11u2' },
      { port: 80, proto: 'TCP', service: 'http', banner: 'nginx/1.18.0 (Debian)' },
      { port: 443, proto: 'TCP', service: 'https', banner: 'nginx/1.18.0 OpenSSL 1.1.1n' },
      { port: 8080, proto: 'TCP', service: 'http-proxy', banner: 'Node.js Express Gateway v20.11' },
    ],
  },
  {
    id: 'h4',
    ip: '192.168.1.101',
    mac: 'A4:83:E7:2C:9F:11',
    hostname: 'ws-secops-alpha.local',
    type: 'workstation',
    osGuess: 'Microsoft Windows 11 Enterprise 23H2',
    status: 'online',
    latency: '3.4ms',
    ports: [
      { port: 135, proto: 'TCP', service: 'msrpc', banner: 'Microsoft Windows RPC' },
      { port: 445, proto: 'TCP', service: 'microsoft-ds', banner: 'Windows 11 Workstation SMBv3' },
      { port: 3389, proto: 'TCP', service: 'ms-wbt-server', banner: 'Microsoft Terminal Services RDP' },
    ],
  },
  {
    id: 'h5',
    ip: '192.168.1.102',
    mac: '3C:22:FB:44:88:99',
    hostname: 'ws-dev-macbook.local',
    type: 'workstation',
    osGuess: 'Apple macOS Sonoma 14.4 (Darwin 23.4.0)',
    status: 'online',
    latency: '2.9ms',
    ports: [
      { port: 22, proto: 'TCP', service: 'ssh', banner: 'OpenSSH 9.6p1 Apple_338.100.1' },
      { port: 3000, proto: 'TCP', service: 'http', banner: 'Node.js Vite Dev Server' },
      { port: 5000, proto: 'TCP', service: 'http-alt', banner: 'Python/3.11 Werkzeug/3.0.1 Flask' },
    ],
  },
  {
    id: 'h6',
    ip: '192.168.1.105',
    mac: '70:85:C2:55:66:77',
    hostname: 'ws-finance-03.local',
    type: 'workstation',
    osGuess: 'Microsoft Windows 10 Pro 22H2',
    status: 'offline',
    latency: 'TIMEOUT',
    ports: [
      { port: 135, proto: 'TCP', service: 'msrpc', banner: 'Cached: Microsoft Windows RPC' },
      { port: 445, proto: 'TCP', service: 'microsoft-ds', banner: 'Cached: Windows 10 SMBv2/v3' },
    ],
  },
  {
    id: 'h7',
    ip: '192.168.1.200',
    mac: '00:1E:0B:89:12:34',
    hostname: 'hp-laserjet-m553.local',
    type: 'printer',
    osGuess: 'HP FutureSmart Firmware / Embedded Linux',
    status: 'online',
    latency: '6.1ms',
    ports: [
      { port: 80, proto: 'TCP', service: 'http', banner: 'HP Web Jetadmin Embedded v4.5' },
      { port: 443, proto: 'TCP', service: 'https', banner: 'HP SSL Server Suite' },
      { port: 515, proto: 'TCP', service: 'printer-lpd', banner: 'Line Printer Daemon protocol' },
      { port: 631, proto: 'TCP', service: 'ipp', banner: 'Internet Printing Protocol 2.0' },
      { port: 9100, proto: 'TCP', service: 'jetdirect', banner: 'HP Direct Print RAW Port' },
    ],
  },
  {
    id: 'h8',
    ip: '192.168.1.220',
    mac: '44:19:B6:77:88:AA',
    hostname: 'cam-lobby-dome.local',
    type: 'iot',
    osGuess: 'Embedded Linux 3.18.20 (Hikvision SDK)',
    status: 'online',
    latency: '4.8ms',
    ports: [
      { port: 80, proto: 'TCP', service: 'http', banner: 'lighttpd/1.4.53 Hikvision Camera' },
      { port: 554, proto: 'TCP', service: 'rtsp', banner: 'Live555 Media Server H.264/H.265' },
      { port: 8000, proto: 'TCP', service: 'hik-dvr', banner: 'Hikvision Private DVR Protocol' },
      { port: 37777, proto: 'TCP', service: 'dvr-ctrl', banner: 'Surveillance PTZ Control Port' },
    ],
  },
];

export const NetworkMapScreen = ({ navigation }: any) => {
  const [selectedHostId, setSelectedHostId] = useState<string | null>('h1');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'TREE' | 'LIST'>('TREE');

  const totalHosts = NETWORK_HOSTS.length;
  const onlineHosts = NETWORK_HOSTS.filter((h) => h.status === 'online').length;
  const totalOpenPorts = NETWORK_HOSTS.reduce((acc, h) => acc + h.ports.length, 0);
  const totalServices = new Set(
    NETWORK_HOSTS.flatMap((h) => h.ports.map((p) => p.service))
  ).size;

  const filteredHosts =
    filterType === 'ALL'
      ? NETWORK_HOSTS
      : NETWORK_HOSTS.filter((h) => {
          if (filterType === 'ROUTER') return h.type === 'router';
          if (filterType === 'SERVER') return h.type === 'server';
          if (filterType === 'WORKSTATION') return h.type === 'workstation';
          if (filterType === 'PERIPHERAL') return h.type === 'printer' || h.type === 'iot';
          return true;
        });

  const getNodeColor = (type: HostType) => {
    switch (type) {
      case 'router':
        return THEME.accent; // Cyan
      case 'server':
        return THEME.primary; // Green
      case 'workstation':
        return THEME.text; // White
      case 'printer':
      case 'iot':
      case 'unknown':
      default:
        return THEME.textMuted; // Muted
    }
  };

  const getNodeBadgeLabel = (type: HostType) => {
    switch (type) {
      case 'router':
        return 'ROUTER';
      case 'server':
        return 'SERVER';
      case 'workstation':
        return 'WORKSTATION';
      case 'printer':
        return 'PRINTER';
      case 'iot':
        return 'IOT_CAM';
      default:
        return 'UNKNOWN';
    }
  };

  const handleShareTopology = async () => {
    try {
      const reportLines = [
        '========================================',
        'GREY HUNTER // NETWORK TOPOLOGY EXPORT',
        'SUBNET: 192.168.1.0/24 | GATEWAY: 192.168.1.1',
        `HOSTS: ${onlineHosts}/${totalHosts} ONLINE | PORTS: ${totalOpenPorts} | SERVICES: ${totalServices}`,
        '========================================\n',
      ];

      NETWORK_HOSTS.forEach((host) => {
        reportLines.push(
          `[${host.status.toUpperCase()}] ${host.ip.padEnd(15)} | ${host.type.toUpperCase().padEnd(11)} | ${host.hostname}`
        );
        reportLines.push(`  MAC: ${host.mac} | OS: ${host.osGuess}`);
        reportLines.push(`  PORTS (${host.ports.length}):`);
        host.ports.forEach((p) => {
          reportLines.push(`    - ${p.port}/${p.proto} [${p.service}]: ${p.banner}`);
        });
        reportLines.push('');
      });

      await Share.share({
        title: 'Grey Hunter - Network Topology Map',
        message: reportLines.join('\n'),
      });
    } catch {
      Alert.alert('Export Failed', 'Unable to generate network topology export.');
    }
  };

  const selectedHost = NETWORK_HOSTS.find((h) => h.id === selectedHostId);

  return (
    <DragonBackground overlayOpacity={0.84}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* TOP BAR / NAVIGATION */}
        <View style={styles.topNavRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => (navigation?.goBack ? navigation.goBack() : null)}
          >
            <Text style={styles.backButtonText}>{'< BACK'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShareTopology}
          >
            <Text style={styles.shareButtonText}>[ EXPORT TOPOLOGY ]</Text>
          </TouchableOpacity>
        </View>

        {/* SCREEN TITLE */}
        <View style={styles.headerBlock}>
          <Text style={styles.titleSub}>NETWORK_MAP // TOPOLOGY VISUALIZER</Text>
          <Text style={styles.titleMain}>LOCAL SUBNET 192.168.1.0/24</Text>
          <Text style={styles.timestamp}>
            ACTIVE SCANNER: GREY-HUNTER-ARP-V4 | INTERFACE: eth0 (UP)
          </Text>
        </View>

        {/* SUMMARY STATS BAR */}
        <View style={styles.statsBar}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>TOTAL HOSTS</Text>
            <Text style={styles.statValue}>
              {totalHosts} <Text style={styles.statSub}>({onlineHosts} UP)</Text>
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>OPEN PORTS</Text>
            <Text style={[styles.statValue, { color: THEME.accent }]}>
              {totalOpenPorts}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>SERVICES</Text>
            <Text style={[styles.statValue, { color: THEME.primary }]}>
              {totalServices}
            </Text>
          </View>
        </View>

        {/* CONTROLS BAR: VIEW MODE & FILTER */}
        <View style={styles.controlsSection}>
          <View style={styles.viewToggleRow}>
            <TouchableOpacity
              style={[
                styles.viewToggleBtn,
                viewMode === 'TREE' && styles.viewToggleBtnActive,
              ]}
              onPress={() => setViewMode('TREE')}
            >
              <Text
                style={[
                  styles.viewToggleText,
                  viewMode === 'TREE' && styles.viewToggleTextActive,
                ]}
              >
                // TOPOLOGY_TREE
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.viewToggleBtn,
                viewMode === 'LIST' && styles.viewToggleBtnActive,
              ]}
              onPress={() => setViewMode('LIST')}
            >
              <Text
                style={[
                  styles.viewToggleText,
                  viewMode === 'LIST' && styles.viewToggleTextActive,
                ]}
              >
                // HOST_INVENTORY
              </Text>
            </TouchableOpacity>
          </View>

          {/* FILTER CHIPS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterChipScroll}
            contentContainerStyle={styles.filterChipRow}
          >
            {['ALL', 'ROUTER', 'SERVER', 'WORKSTATION', 'PERIPHERAL'].map((f) => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterChip,
                  filterType === f && styles.filterChipActive,
                ]}
                onPress={() => setFilterType(f)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    filterType === f && styles.filterChipTextActive,
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* VIEW MODE: TREE TOPOLOGY */}
        {viewMode === 'TREE' && (
          <View style={styles.treeSection}>
            <Text style={styles.sectionHeader}>// VISUAL_TOPOLOGY_TREE</Text>
            <Text style={styles.sectionNote}>
              Tap any node in the topology network to inspect ports and banners.
            </Text>

            {/* GATEWAY ROOT NODE */}
            <View style={styles.rootHubContainer}>
              <View style={styles.rootHeaderPill}>
                <Text style={styles.rootHeaderPillText}>CENTRAL GATEWAY / SWITCH HUB</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.nodeCard,
                  styles.gatewayNodeCard,
                  selectedHostId === 'h1' && styles.nodeCardSelected,
                ]}
                onPress={() => setSelectedHostId('h1')}
              >
                <View style={styles.nodeHeaderRow}>
                  <View style={styles.nodeTypeBadge}>
                    <View
                      style={[
                        styles.nodeColorDot,
                        { backgroundColor: getNodeColor('router') },
                      ]}
                    />
                    <Text
                      style={[
                        styles.nodeTypeText,
                        { color: getNodeColor('router') },
                      ]}
                    >
                      ROUTER / GW
                    </Text>
                  </View>
                  <Text style={styles.nodeStatusOnline}>[ ONLINE 1.2ms ]</Text>
                </View>
                <Text style={styles.nodeIpText}>192.168.1.1</Text>
                <Text style={styles.nodeHostText}>gw-core.local (Cisco IOS-XE)</Text>
                <View style={styles.nodeFooterRow}>
                  <Text style={styles.nodeMetaText}>MAC: 00:1A:2B:3C:4D:01</Text>
                  <Text style={styles.nodePortBadge}>4 PORTS</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.treeStemVertical} />
              <View style={styles.treeCrossBar} />
            </View>

            {/* BRANCHES GRID */}
            <View style={styles.nodesGrid}>
              {filteredHosts
                .filter((h) => h.id !== 'h1')
                .map((host) => {
                  const nodeColor = getNodeColor(host.type);
                  const isSelected = selectedHostId === host.id;
                  const isOnline = host.status === 'online';

                  return (
                    <TouchableOpacity
                      key={host.id}
                      activeOpacity={0.8}
                      style={[
                        styles.nodeCard,
                        styles.gridNodeCard,
                        isSelected && styles.nodeCardSelected,
                        !isOnline && styles.nodeCardOffline,
                      ]}
                      onPress={() => setSelectedHostId(host.id)}
                    >
                      <View style={styles.treeDropLine} />
                      <View style={styles.nodeHeaderRow}>
                        <View style={styles.nodeTypeBadge}>
                          <View
                            style={[
                              styles.nodeColorDot,
                              { backgroundColor: nodeColor },
                            ]}
                          />
                          <Text style={[styles.nodeTypeText, { color: nodeColor }]}>
                            {getNodeBadgeLabel(host.type)}
                          </Text>
                        </View>
                        <Text
                          style={
                            isOnline
                              ? styles.nodeStatusOnline
                              : styles.nodeStatusOffline
                          }
                        >
                          {isOnline ? 'ONLINE' : 'OFFLINE'}
                        </Text>
                      </View>

                      <Text style={styles.nodeIpText}>{host.ip}</Text>
                      <Text
                        style={styles.nodeHostText}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {host.hostname}
                      </Text>
                      <Text
                        style={styles.nodeOsText}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {host.osGuess}
                      </Text>

                      <View style={styles.nodeFooterRow}>
                        <Text style={styles.nodeMetaText}>
                          {host.mac.slice(0, 11)}..
                        </Text>
                        <Text
                          style={[
                            styles.nodePortBadge,
                            { borderColor: nodeColor, color: nodeColor },
                          ]}
                        >
                          {host.ports.length} PORTS
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </View>
          </View>
        )}

        {/* VIEW MODE: LIST INVENTORY */}
        {viewMode === 'LIST' && (
          <View style={styles.listSection}>
            <Text style={styles.sectionHeader}>// HOST_INVENTORY_LIST</Text>
            {filteredHosts.map((host) => {
              const nodeColor = getNodeColor(host.type);
              const isSelected = selectedHostId === host.id;
              const isOnline = host.status === 'online';

              return (
                <TouchableOpacity
                  key={host.id}
                  activeOpacity={0.8}
                  style={[
                    styles.nodeCard,
                    styles.listNodeCard,
                    isSelected && styles.nodeCardSelected,
                    !isOnline && styles.nodeCardOffline,
                  ]}
                  onPress={() => setSelectedHostId(host.id)}
                >
                  <View style={styles.listCardTopRow}>
                    <View style={styles.ipContainer}>
                      <View
                        style={[
                          styles.nodeColorDot,
                          { backgroundColor: nodeColor },
                        ]}
                      />
                      <Text style={styles.listIpText}>{host.ip}</Text>
                      <Text style={[styles.nodeTypeText, { color: nodeColor, marginLeft: 8 }]}>
                        [{getNodeBadgeLabel(host.type)}]
                      </Text>
                    </View>
                    <Text
                      style={
                        isOnline
                          ? styles.nodeStatusOnline
                          : styles.nodeStatusOffline
                      }
                    >
                      {isOnline ? `[UP ${host.latency}]` : '[DOWN]'}
                    </Text>
                  </View>

                  <Text style={styles.listHostName}>
                    {host.hostname} • <Text style={styles.listOs}>{host.osGuess}</Text>
                  </Text>
                  <View style={styles.listCardBottomRow}>
                    <Text style={styles.listMacText}>MAC: {host.mac}</Text>
                    <Text style={[styles.nodePortBadge, { borderColor: nodeColor, color: nodeColor }]}>
                      {host.ports.length} OPEN PORTS
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* DETAILED INSPECTION MODAL / PANEL */}
        {selectedHost && (
          <View style={styles.inspectionSection}>
            <Text style={styles.sectionHeader}>
              // INSPECTION_TARGET: {selectedHost.ip}
            </Text>

            <View style={styles.inspectionCard}>
              <View style={styles.inspTitleRow}>
                <View>
                  <Text style={styles.inspIp}>{selectedHost.ip}</Text>
                  <Text style={styles.inspHost}>{selectedHost.hostname}</Text>
                </View>
                <View style={styles.inspBadgeCol}>
                  <Text
                    style={[
                      styles.inspTypeBadge,
                      {
                        color: getNodeColor(selectedHost.type),
                        borderColor: getNodeColor(selectedHost.type),
                      },
                    ]}
                  >
                    {getNodeBadgeLabel(selectedHost.type)}
                  </Text>
                  <Text
                    style={
                      selectedHost.status === 'online'
                        ? styles.nodeStatusOnline
                        : styles.nodeStatusOffline
                    }
                  >
                    {selectedHost.status.toUpperCase()} ({selectedHost.latency})
                  </Text>
                </View>
              </View>

              <View style={styles.inspMetaGrid}>
                <View style={styles.inspMetaCol}>
                  <Text style={styles.inspMetaLabel}>HARDWARE MAC</Text>
                  <Text style={styles.inspMetaValue}>{selectedHost.mac}</Text>
                </View>
                <View style={styles.inspMetaCol}>
                  <Text style={styles.inspMetaLabel}>OS FINGERPRINT</Text>
                  <Text style={styles.inspMetaValue}>{selectedHost.osGuess}</Text>
                </View>
              </View>

              {/* PORTS & BANNERS LIST */}
              <View style={styles.portsHeaderRow}>
                <Text style={styles.portsSectionTitle}>
                  DETECTED SERVICES & OPEN PORTS ({selectedHost.ports.length})
                </Text>
              </View>

              {selectedHost.ports.map((portItem, idx) => (
                <View key={idx} style={styles.portItemCard}>
                  <View style={styles.portItemTopRow}>
                    <View style={styles.portPill}>
                      <Text style={styles.portNumberText}>
                        {portItem.port}/{portItem.proto}
                      </Text>
                    </View>
                    <Text style={styles.portServiceName}>
                      {portItem.service.toUpperCase()}
                    </Text>
                    <Text style={styles.portStatusBadge}>LISTENING</Text>
                  </View>
                  <Text style={styles.portBannerText}>
                    BANNER: <Text style={styles.portBannerContent}>{portItem.banner}</Text>
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* FOOTER ACTION */}
        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            [✓] GREY HUNTER PASSIVE SNIFFER ACTIVE // PROMISCUOUS MODE ENABLED
          </Text>
        </View>
      </ScrollView>
    </DragonBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    backgroundColor: THEME.surface,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  backButtonText: {
    fontFamily: 'monospace',
    color: THEME.textMuted,
    fontSize: 12,
  },
  shareButton: {
    backgroundColor: 'rgba(0, 212, 255, 0.12)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME.accent,
  },
  shareButtonText: {
    fontFamily: 'monospace',
    color: THEME.accent,
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerBlock: {
    marginBottom: 16,
  },
  titleSub: {
    fontFamily: 'monospace',
    color: THEME.accent,
    fontSize: 13,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  titleMain: {
    fontFamily: 'monospace',
    color: THEME.text,
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  timestamp: {
    fontFamily: 'monospace',
    color: THEME.textMuted,
    fontSize: 10,
    marginTop: 4,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: THEME.surface,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: THEME.border,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: THEME.border,
  },
  statLabel: {
    fontFamily: 'monospace',
    color: THEME.textMuted,
    fontSize: 9,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  statValue: {
    fontFamily: 'monospace',
    color: THEME.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statSub: {
    fontFamily: 'monospace',
    color: THEME.primary,
    fontSize: 11,
    fontWeight: 'normal',
  },
  controlsSection: {
    marginBottom: 16,
  },
  viewToggleRow: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 8,
  },
  viewToggleBtn: {
    flex: 1,
    backgroundColor: THEME.surface,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  viewToggleBtnActive: {
    backgroundColor: 'rgba(0, 255, 102, 0.1)',
    borderColor: THEME.primary,
  },
  viewToggleText: {
    fontFamily: 'monospace',
    color: THEME.textMuted,
    fontSize: 11,
  },
  viewToggleTextActive: {
    color: THEME.primary,
    fontWeight: 'bold',
  },
  filterChipScroll: {
    flexDirection: 'row',
  },
  filterChipRow: {
    gap: 8,
    paddingVertical: 2,
  },
  filterChip: {
    backgroundColor: THEME.surface,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  filterChipActive: {
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
    borderColor: THEME.accent,
  },
  filterChipText: {
    fontFamily: 'monospace',
    color: THEME.textMuted,
    fontSize: 11,
  },
  filterChipTextActive: {
    color: THEME.accent,
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontFamily: 'monospace',
    color: THEME.accent,
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  sectionNote: {
    fontFamily: 'monospace',
    color: THEME.textMuted,
    fontSize: 10,
    marginBottom: 12,
  },
  treeSection: {
    marginBottom: 18,
  },
  rootHubContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  rootHeaderPill: {
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: THEME.accent,
    marginBottom: 6,
  },
  rootHeaderPillText: {
    fontFamily: 'monospace',
    color: THEME.accent,
    fontSize: 9,
    fontWeight: 'bold',
  },
  nodeCard: {
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 6,
    padding: 12,
  },
  gatewayNodeCard: {
    width: '100%',
    borderColor: THEME.accent,
    backgroundColor: '#0c223c',
  },
  nodeCardSelected: {
    borderColor: THEME.primary,
    backgroundColor: '#122e44',
  },
  nodeCardOffline: {
    opacity: 0.65,
    borderColor: '#442222',
  },
  treeStemVertical: {
    width: 2,
    height: 16,
    backgroundColor: THEME.accent,
    marginTop: 4,
  },
  treeCrossBar: {
    width: '80%',
    height: 2,
    backgroundColor: THEME.border,
  },
  nodesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 8,
  },
  gridNodeCard: {
    width: '48%',
    marginBottom: 2,
  },
  treeDropLine: {
    position: 'absolute',
    top: -8,
    left: '50%',
    width: 2,
    height: 8,
    backgroundColor: THEME.border,
  },
  nodeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  nodeTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  nodeColorDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  nodeTypeText: {
    fontFamily: 'monospace',
    fontSize: 9,
    fontWeight: 'bold',
  },
  nodeStatusOnline: {
    fontFamily: 'monospace',
    color: THEME.primary,
    fontSize: 9,
    fontWeight: 'bold',
  },
  nodeStatusOffline: {
    fontFamily: 'monospace',
    color: THEME.error,
    fontSize: 9,
    fontWeight: 'bold',
  },
  nodeIpText: {
    fontFamily: 'monospace',
    color: THEME.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  nodeHostText: {
    fontFamily: 'monospace',
    color: THEME.accent,
    fontSize: 10,
    marginBottom: 2,
  },
  nodeOsText: {
    fontFamily: 'monospace',
    color: THEME.textMuted,
    fontSize: 9,
    marginBottom: 8,
  },
  nodeFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 6,
    marginTop: 2,
  },
  nodeMetaText: {
    fontFamily: 'monospace',
    color: THEME.textMuted,
    fontSize: 8,
  },
  nodePortBadge: {
    fontFamily: 'monospace',
    fontSize: 8,
    color: THEME.accent,
    borderWidth: 1,
    borderColor: THEME.accent,
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  listSection: {
    marginBottom: 18,
    gap: 10,
  },
  listNodeCard: {
    width: '100%',
    padding: 12,
  },
  listCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  ipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listIpText: {
    fontFamily: 'monospace',
    color: THEME.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  listHostName: {
    fontFamily: 'monospace',
    color: THEME.accent,
    fontSize: 11,
    marginBottom: 6,
  },
  listOs: {
    fontFamily: 'monospace',
    color: THEME.textMuted,
    fontSize: 10,
  },
  listCardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 6,
  },
  listMacText: {
    fontFamily: 'monospace',
    color: THEME.textMuted,
    fontSize: 10,
  },
  inspectionSection: {
    marginBottom: 18,
  },
  inspectionCard: {
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 6,
    padding: 14,
  },
  inspTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
    paddingBottom: 10,
    marginBottom: 10,
  },
  inspIp: {
    fontFamily: 'monospace',
    color: THEME.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  inspHost: {
    fontFamily: 'monospace',
    color: THEME.text,
    fontSize: 11,
    marginTop: 2,
  },
  inspBadgeCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  inspTypeBadge: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  inspMetaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 10,
  },
  inspMetaCol: {
    flex: 1,
    backgroundColor: THEME.surface,
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  inspMetaLabel: {
    fontFamily: 'monospace',
    color: THEME.textMuted,
    fontSize: 9,
    marginBottom: 2,
  },
  inspMetaValue: {
    fontFamily: 'monospace',
    color: THEME.text,
    fontSize: 10,
  },
  portsHeaderRow: {
    marginBottom: 8,
  },
  portsSectionTitle: {
    fontFamily: 'monospace',
    color: THEME.accent,
    fontSize: 11,
    fontWeight: 'bold',
  },
  portItemCard: {
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
  },
  portItemTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  portPill: {
    backgroundColor: 'rgba(0, 255, 102, 0.1)',
    borderColor: THEME.primary,
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  portNumberText: {
    fontFamily: 'monospace',
    color: THEME.primary,
    fontSize: 11,
    fontWeight: 'bold',
  },
  portServiceName: {
    fontFamily: 'monospace',
    color: THEME.text,
    fontSize: 11,
    fontWeight: 'bold',
    flex: 1,
  },
  portStatusBadge: {
    fontFamily: 'monospace',
    color: THEME.accent,
    fontSize: 9,
  },
  portBannerText: {
    fontFamily: 'monospace',
    color: THEME.textMuted,
    fontSize: 10,
  },
  portBannerContent: {
    fontFamily: 'monospace',
    color: THEME.text,
  },
  footerNote: {
    alignItems: 'center',
    marginTop: 4,
  },
  footerText: {
    fontFamily: 'monospace',
    color: THEME.textMuted,
    fontSize: 9,
  },
});
