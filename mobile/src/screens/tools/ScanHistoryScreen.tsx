import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
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

type ScanStatus = 'COMPLETED' | 'ABORTED' | 'IN_PROGRESS';

type FilterType = 'ALL' | 'TODAY' | 'THIS_WEEK' | 'NMAP' | 'NUCLEI' | 'SQLMAP';

interface ScanEntry {
  id: string;
  timestamp: string;
  isoDate: string;
  tool: 'NMAP' | 'NUCLEI' | 'SQLMAP';
  target: string;
  resultSummary: string;
  duration: string;
  durationSeconds: number;
  status: ScanStatus;
  command: string;
  hosts: string[];
  ports: string[];
  cveCount: number;
  vulns: string[];
}

const INITIAL_SCAN_HISTORY: ScanEntry[] = [
  {
    id: 'scan-01',
    timestamp: '2026-10-11 06:15:20',
    isoDate: '2026-10-11',
    tool: 'NMAP',
    target: '192.168.1.1/24',
    resultSummary: '12 hosts alive, 48 open ports detected across subnet',
    duration: '2m 14s',
    durationSeconds: 134,
    status: 'COMPLETED',
    command: 'nmap -sS -sV -T4 -p 1-1000 192.168.1.1/24 -oN subnet_audit.txt',
    hosts: ['192.168.1.1', '192.168.1.10', '192.168.1.15', '192.168.1.25', '192.168.1.104'],
    ports: ['22/tcp', '80/tcp', '443/tcp', '445/tcp', '8080/tcp'],
    cveCount: 4,
    vulns: ['CVE-2023-38408', 'CVE-2021-41773', 'CVE-2022-22965', 'CVE-2020-0796'],
  },
  {
    id: 'scan-02',
    timestamp: '2026-10-11 04:30:10',
    isoDate: '2026-10-11',
    tool: 'NUCLEI',
    target: 'api.targetcorp.internal',
    resultSummary: '3 Critical CVEs, 5 High risk configuration leaks discovered',
    duration: '4m 02s',
    durationSeconds: 242,
    status: 'COMPLETED',
    command: 'nuclei -u https://api.targetcorp.internal -t cves/ -severity critical,high -json',
    hosts: ['api.targetcorp.internal'],
    ports: ['443/tcp', '8443/tcp'],
    cveCount: 8,
    vulns: ['CVE-2023-46805', 'CVE-2024-21887', 'CVE-2023-34362', 'CVE-2023-27997', 'CVE-2022-42475'],
  },
  {
    id: 'scan-03',
    timestamp: '2026-10-10 21:05:40',
    isoDate: '2026-10-10',
    tool: 'SQLMAP',
    target: 'shop.targetcorp.internal/catalog.php',
    resultSummary: 'Blind Time-Based SQLi confirmed on parameter `cat_id`',
    duration: '6m 45s',
    durationSeconds: 405,
    status: 'COMPLETED',
    command: 'sqlmap -u "https://shop.targetcorp.internal/catalog.php?cat_id=10" --dbs --batch',
    hosts: ['shop.targetcorp.internal'],
    ports: ['80/tcp', '443/tcp'],
    cveCount: 2,
    vulns: ['CWE-89: Blind SQL Injection', 'CVE-2022-21449'],
  },
  {
    id: 'scan-04',
    timestamp: '2026-10-10 14:12:00',
    isoDate: '2026-10-10',
    tool: 'NMAP',
    target: '10.200.0.0/16',
    resultSummary: 'Terminated by operator: network latency threshold exceeded',
    duration: '18m 30s',
    durationSeconds: 1110,
    status: 'ABORTED',
    command: 'nmap -p- -T5 -Pn 10.200.0.0/16 --max-retries 1',
    hosts: ['10.200.0.1', '10.200.1.5', '10.200.2.20'],
    ports: ['22/tcp', '53/tcp', '88/tcp', '389/tcp'],
    cveCount: 0,
    vulns: [],
  },
  {
    id: 'scan-05',
    timestamp: '2026-10-09 11:20:15',
    isoDate: '2026-10-09',
    tool: 'NUCLEI',
    target: 'auth.targetcorp.internal',
    resultSummary: '0 Critical, 2 Medium legacy TLS cipher weaknesses flagged',
    duration: '1m 55s',
    durationSeconds: 115,
    status: 'COMPLETED',
    command: 'nuclei -u https://auth.targetcorp.internal -t ssl/ -t technologies/',
    hosts: ['auth.targetcorp.internal'],
    ports: ['443/tcp'],
    cveCount: 2,
    vulns: ['CVE-2016-2183 (SWEET32)', 'CWE-327: Deprecated TLS 1.0/1.1'],
  },
  {
    id: 'scan-06',
    timestamp: '2026-10-08 17:45:00',
    isoDate: '2026-10-08',
    tool: 'SQLMAP',
    target: 'portal.targetcorp.internal/login.aspx',
    resultSummary: 'Clean audit: input properly parameterized and anti-CSRF enforced',
    duration: '3m 10s',
    durationSeconds: 190,
    status: 'COMPLETED',
    command: 'sqlmap -u "https://portal.targetcorp.internal/login.aspx" --data="user=a&pass=b" --risk=2',
    hosts: ['portal.targetcorp.internal'],
    ports: ['443/tcp'],
    cveCount: 0,
    vulns: [],
  },
  {
    id: 'scan-07',
    timestamp: '2026-10-07 09:10:00',
    isoDate: '2026-10-07',
    tool: 'NMAP',
    target: '192.168.1.1/24',
    resultSummary: '10 hosts alive, 35 open ports detected (Baseline Audit)',
    duration: '1m 45s',
    durationSeconds: 105,
    status: 'COMPLETED',
    command: 'nmap -sS -p 22,80,443,445,3389,8080 192.168.1.1/24',
    hosts: ['192.168.1.1', '192.168.1.10', '192.168.1.15'],
    ports: ['22/tcp', '80/tcp', '443/tcp', '445/tcp'],
    cveCount: 1,
    vulns: ['CVE-2020-0796 (SMBGhost)'],
  },
  {
    id: 'scan-08',
    timestamp: '2026-10-06 22:00:30',
    isoDate: '2026-10-06',
    tool: 'NUCLEI',
    target: 'dev-cluster.targetcorp.internal',
    resultSummary: 'Active pipeline running: 78/220 templates evaluated...',
    duration: '0m 45s',
    durationSeconds: 45,
    status: 'IN_PROGRESS',
    command: 'nuclei -u https://dev-cluster.targetcorp.internal -tags dev,k8s,cloud',
    hosts: ['dev-cluster.targetcorp.internal'],
    ports: ['6443/tcp', '8001/tcp'],
    cveCount: 1,
    vulns: ['CVE-2022-3172 (Kube-apiserver Proxy Bypass)'],
  },
];

const FILTER_OPTIONS: FilterType[] = [
  'ALL',
  'TODAY',
  'THIS_WEEK',
  'NMAP',
  'NUCLEI',
  'SQLMAP',
];

export const ScanHistoryScreen = ({ navigation }: any) => {
  const [scans, setScans] = useState<ScanEntry[]>(INITIAL_SCAN_HISTORY);
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [expandedScanIds, setExpandedScanIds] = useState<Record<string, boolean>>({
    'scan-01': true,
  });
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  // Statistics calculation
  const stats = useMemo(() => {
    const totalScans = scans.length;
    if (totalScans === 0) {
      return {
        totalScans: 0,
        avgDuration: '0s',
        uniqueTargets: 0,
        vulnsFound: 0,
      };
    }
    const totalSeconds = scans.reduce((acc, curr) => acc + curr.durationSeconds, 0);
    const avgSec = Math.round(totalSeconds / totalScans);
    const avgMinutes = Math.floor(avgSec / 60);
    const remSeconds = avgSec % 60;
    const avgDuration =
      avgMinutes > 0 ? `${avgMinutes}m ${remSeconds}s` : `${remSeconds}s`;

    const uniqueTargets = new Set(scans.map(s => s.target)).size;
    const vulnsFound = scans.reduce((acc, curr) => acc + curr.cveCount, 0);

    return {
      totalScans,
      avgDuration,
      uniqueTargets,
      vulnsFound,
    };
  }, [scans]);

  // Filter scans
  const filteredScans = useMemo(() => {
    return scans.filter(scan => {
      if (activeFilter === 'ALL') return true;
      if (activeFilter === 'TODAY') return scan.isoDate === '2026-10-11';
      if (activeFilter === 'THIS_WEEK') return true; // all sample scans are within 7 days
      if (activeFilter === 'NMAP') return scan.tool === 'NMAP';
      if (activeFilter === 'NUCLEI') return scan.tool === 'NUCLEI';
      if (activeFilter === 'SQLMAP') return scan.tool === 'SQLMAP';
      return true;
    });
  }, [scans, activeFilter]);

  const toggleExpand = (id: string) => {
    setExpandedScanIds(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectCompare = (id: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 2) {
        // replace second item
        return [prev[0], id];
      }
      return [...prev, id];
    });
  };

  const handleClearHistory = () => {
    Alert.alert(
      'CLEAR SCAN HISTORY',
      'Are you sure you want to permanently erase all logged operations and comparisons?',
      [
        { text: 'CANCEL', style: 'cancel' },
        {
          text: 'PURGE ALL',
          style: 'destructive',
          onPress: () => {
            setScans([]);
            setSelectedForCompare([]);
            setIsCompareMode(false);
          },
        },
      ]
    );
  };

  const getStatusColor = (status: ScanStatus) => {
    switch (status) {
      case 'COMPLETED':
        return THEME.primary;
      case 'ABORTED':
        return THEME.error;
      case 'IN_PROGRESS':
        return THEME.accent;
      default:
        return THEME.textMuted;
    }
  };

  // Compare diff calculations
  const compareData = useMemo(() => {
    if (selectedForCompare.length !== 2) return null;
    const scanA = scans.find(s => s.id === selectedForCompare[0]);
    const scanB = scans.find(s => s.id === selectedForCompare[1]);
    if (!scanA || !scanB) return null;

    // Diff hosts
    const allHosts = Array.from(new Set([...scanA.hosts, ...scanB.hosts]));
    const hostsDiff = allHosts.map(h => ({
      host: h,
      inA: scanA.hosts.includes(h),
      inB: scanB.hosts.includes(h),
    }));

    // Diff ports
    const allPorts = Array.from(new Set([...scanA.ports, ...scanB.ports]));
    const portsDiff = allPorts.map(p => ({
      port: p,
      inA: scanA.ports.includes(p),
      inB: scanB.ports.includes(p),
    }));

    // Diff vulns
    const allVulns = Array.from(new Set([...scanA.vulns, ...scanB.vulns]));
    const vulnsDiff = allVulns.map(v => ({
      vuln: v,
      inA: scanA.vulns.includes(v),
      inB: scanB.vulns.includes(v),
    }));

    return {
      scanA,
      scanB,
      hostsDiff,
      portsDiff,
      vulnsDiff,
    };
  }, [scans, selectedForCompare]);

  return (
    <DragonBackground overlayOpacity={0.84}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>SCAN_HISTORY // OPERATION LOG</Text>
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={handleClearHistory}
              activeOpacity={0.7}
            >
              <Text style={styles.clearBtnText}>CLEAR LOG</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>
            Audit trails, telemetry benchmarks & delta diff analysis
          </Text>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* STATS SUMMARY */}
          <Text style={styles.sectionTitle}>// TELEMETRY_METRICS</Text>
          <View style={styles.statsCard}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.totalScans}</Text>
              <Text style={styles.statLabel}>TOTAL SCANS</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: THEME.accent }]}>
                {stats.avgDuration}
              </Text>
              <Text style={styles.statLabel}>AVG DURATION</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.uniqueTargets}</Text>
              <Text style={styles.statLabel}>TARGETS</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text
                style={[
                  styles.statValue,
                  { color: stats.vulnsFound > 0 ? THEME.error : THEME.primary },
                ]}
              >
                {stats.vulnsFound}
              </Text>
              <Text style={styles.statLabel}>VULNS</Text>
            </View>
          </View>

          {/* ACTION TOOLBAR: FILTER CHIPS & COMPARE TOGGLE */}
          <View style={styles.toolbarHeader}>
            <Text style={styles.sectionTitle}>// FILTER_AND_COMPARE</Text>
            <TouchableOpacity
              style={[
                styles.compareToggleBtn,
                isCompareMode && styles.compareToggleBtnActive,
              ]}
              onPress={() => {
                const nextMode = !isCompareMode;
                setIsCompareMode(nextMode);
                if (!nextMode) {
                  setSelectedForCompare([]);
                }
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.compareToggleText,
                  isCompareMode && styles.compareToggleTextActive,
                ]}
              >
                {isCompareMode ? '✕ CANCEL COMPARE' : '⇄ COMPARE MODE'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Filter Chips Bar */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            {FILTER_OPTIONS.map(filter => {
              const isSelected = activeFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterChip,
                    isSelected && styles.filterChipActive,
                  ]}
                  onPress={() => setActiveFilter(filter)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isSelected && styles.filterChipTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* COMPARE MODE NOTICE BANNER */}
          {isCompareMode && (
            <View style={styles.compareBanner}>
              <View style={styles.compareBannerContent}>
                <Text style={styles.compareBannerTitle}>
                  SELECT EXACTLY 2 SCANS TO DIFF ({selectedForCompare.length}/2 SELECTED)
                </Text>
                <Text style={styles.compareBannerSub}>
                  Compare target hosts, closed/open ports, and new vulnerabilities
                </Text>
              </View>
              {selectedForCompare.length === 2 && (
                <TouchableOpacity
                  style={styles.launchCompareBtn}
                  onPress={() => setShowCompareModal(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.launchCompareBtnText}>VIEW DIFF</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* TIMELINE LIST */}
          <View style={styles.timelineHeaderRow}>
            <Text style={styles.sectionTitle}>
              // TIMELINE_LOG ({filteredScans.length} RECORDS)
            </Text>
            <Text style={styles.timelineGuide}>TAP ROW TO EXPAND</Text>
          </View>

          {filteredScans.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>NO SCANS FOUND</Text>
              <Text style={styles.emptySub}>
                No past scans match filter '{activeFilter}'. Clear filter or run a new scan.
              </Text>
            </View>
          ) : (
            filteredScans.map((scan, index) => {
              const isExpanded = !!expandedScanIds[scan.id];
              const isSelectedCompare = selectedForCompare.includes(scan.id);
              const statusColor = getStatusColor(scan.status);

              return (
                <View key={scan.id} style={styles.timelineItem}>
                  {/* Timeline Node Line */}
                  <View style={styles.timelineAxis}>
                    <View
                      style={[
                        styles.timelineDot,
                        { borderColor: statusColor, backgroundColor: THEME.surface },
                      ]}
                    >
                      <View
                        style={[styles.timelineDotInner, { backgroundColor: statusColor }]}
                      />
                    </View>
                    {index < filteredScans.length - 1 && (
                      <View style={styles.timelineLine} />
                    )}
                  </View>

                  {/* Scan Card */}
                  <View style={styles.timelineCardWrapper}>
                    <TouchableOpacity
                      style={[
                        styles.scanCard,
                        isSelectedCompare && styles.scanCardCompareSelected,
                      ]}
                      onPress={() => {
                        if (isCompareMode) {
                          handleSelectCompare(scan.id);
                        } else {
                          toggleExpand(scan.id);
                        }
                      }}
                      activeOpacity={0.85}
                    >
                      {/* Top Card Row */}
                      <View style={styles.scanCardHeader}>
                        <View style={styles.badgeRow}>
                          <View style={styles.toolBadge}>
                            <Text style={styles.toolBadgeText}>{scan.tool}</Text>
                          </View>
                          <View
                            style={[
                              styles.statusBadge,
                              { borderColor: statusColor },
                            ]}
                          >
                            <Text
                              style={[
                                styles.statusBadgeText,
                                { color: statusColor },
                              ]}
                            >
                              {scan.status}
                            </Text>
                          </View>
                        </View>

                        {/* Compare Selector or Expand Icon */}
                        {isCompareMode ? (
                          <TouchableOpacity
                            style={[
                              styles.checkbox,
                              isSelectedCompare && styles.checkboxActive,
                            ]}
                            onPress={() => handleSelectCompare(scan.id)}
                          >
                            <Text style={styles.checkboxText}>
                              {isSelectedCompare ? '✓' : ''}
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <Text style={styles.expandChevron}>
                            {isExpanded ? '▲ LESS' : '▼ MORE'}
                          </Text>
                        )}
                      </View>

                      {/* Target & Summary */}
                      <Text style={styles.targetTitle} numberOfLines={1}>
                        TARGET: {scan.target}
                      </Text>
                      <Text style={styles.resultSummary}>{scan.resultSummary}</Text>

                      {/* Meta Footer */}
                      <View style={styles.metaRow}>
                        <Text style={styles.metaText}>TIME: {scan.timestamp}</Text>
                        <Text style={styles.metaDivider}>|</Text>
                        <Text style={styles.metaText}>DURATION: {scan.duration}</Text>
                      </View>

                      {/* EXPANDED CONTENT DETAILS */}
                      {isExpanded && !isCompareMode && (
                        <View style={styles.expandedSection}>
                          <View style={styles.expandedDivider} />

                          {/* Full Command */}
                          <Text style={styles.detailLabel}>COMMAND EXECUTED:</Text>
                          <View style={styles.codeSnippet}>
                            <Text style={styles.codeSnippetText} selectable>
                              $ {scan.command}
                            </Text>
                          </View>

                          {/* Hosts Discovered */}
                          <View style={styles.detailBlock}>
                            <Text style={styles.detailLabel}>
                              HOSTS DISCOVERED ({scan.hosts.length}):
                            </Text>
                            <View style={styles.inlineBadgesWrap}>
                              {scan.hosts.map((host, hIdx) => (
                                <View key={hIdx} style={styles.inlineBadge}>
                                  <Text style={styles.inlineBadgeText}>{host}</Text>
                                </View>
                              ))}
                            </View>
                          </View>

                          {/* Ports Detected */}
                          <View style={styles.detailBlock}>
                            <Text style={styles.detailLabel}>
                              PORTS DETECTED ({scan.ports.length}):
                            </Text>
                            <View style={styles.inlineBadgesWrap}>
                              {scan.ports.map((port, pIdx) => (
                                <View key={pIdx} style={styles.portBadge}>
                                  <Text style={styles.portBadgeText}>{port}</Text>
                                </View>
                              ))}
                            </View>
                          </View>

                          {/* CVE Count & List */}
                          <View style={styles.detailBlock}>
                            <View style={styles.cveHeaderRow}>
                              <Text style={styles.detailLabel}>
                                VULNERABILITIES DETECTED ({scan.cveCount}):
                              </Text>
                              <Text
                                style={[
                                  styles.cveCountBadge,
                                  {
                                    color:
                                      scan.cveCount > 0
                                        ? THEME.error
                                        : THEME.primary,
                                  },
                                ]}
                              >
                                {scan.cveCount > 0
                                  ? `[${scan.cveCount} VULNS]`
                                  : '[0 DETECTED]'}
                              </Text>
                            </View>
                            {scan.vulns.length > 0 ? (
                              scan.vulns.map((vuln, vIdx) => (
                                <View key={vIdx} style={styles.vulnItemRow}>
                                  <Text style={styles.vulnBullet}>⚠</Text>
                                  <Text style={styles.vulnItemText}>{vuln}</Text>
                                </View>
                              ))
                            ) : (
                              <Text style={styles.cleanAuditText}>
                                ✔ No security flaws reported during this execution.
                              </Text>
                            )}
                          </View>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* COMPARISON DIFF MODAL */}
        <Modal
          visible={showCompareModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowCompareModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>SCAN_DIFF // COMPARISON</Text>
                  <Text style={styles.modalSub}>
                    SIDE-BY-SIDE TELEMETRY AUDIT
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setShowCompareModal(false)}
                >
                  <Text style={styles.modalCloseText}>✕ CLOSE</Text>
                </TouchableOpacity>
              </View>

              {compareData && (
                <ScrollView
                  style={styles.modalScroll}
                  contentContainerStyle={styles.modalScrollContent}
                >
                  {/* Scans Header Matrix */}
                  <View style={styles.diffTable}>
                    <View style={styles.diffRowHeader}>
                      <Text style={[styles.diffColHeader, { flex: 1.2 }]}>METRIC</Text>
                      <Text style={[styles.diffColHeader, { flex: 2, color: THEME.primary }]}>
                        SCAN A ({compareData.scanA.id})
                      </Text>
                      <Text style={[styles.diffColHeader, { flex: 2, color: THEME.accent }]}>
                        SCAN B ({compareData.scanB.id})
                      </Text>
                    </View>

                    <View style={styles.diffRow}>
                      <Text style={[styles.diffColLabel, { flex: 1.2 }]}>TOOL</Text>
                      <Text style={[styles.diffColValue, { flex: 2 }]}>
                        {compareData.scanA.tool}
                      </Text>
                      <Text style={[styles.diffColValue, { flex: 2 }]}>
                        {compareData.scanB.tool}
                      </Text>
                    </View>

                    <View style={styles.diffRow}>
                      <Text style={[styles.diffColLabel, { flex: 1.2 }]}>TARGET</Text>
                      <Text style={[styles.diffColValue, { flex: 2 }]} numberOfLines={1}>
                        {compareData.scanA.target}
                      </Text>
                      <Text style={[styles.diffColValue, { flex: 2 }]} numberOfLines={1}>
                        {compareData.scanB.target}
                      </Text>
                    </View>

                    <View style={styles.diffRow}>
                      <Text style={[styles.diffColLabel, { flex: 1.2 }]}>DATE</Text>
                      <Text style={[styles.diffColValue, { flex: 2 }]}>
                        {compareData.scanA.timestamp}
                      </Text>
                      <Text style={[styles.diffColValue, { flex: 2 }]}>
                        {compareData.scanB.timestamp}
                      </Text>
                    </View>

                    <View style={styles.diffRow}>
                      <Text style={[styles.diffColLabel, { flex: 1.2 }]}>DURATION</Text>
                      <Text style={[styles.diffColValue, { flex: 2 }]}>
                        {compareData.scanA.duration}
                      </Text>
                      <Text style={[styles.diffColValue, { flex: 2 }]}>
                        {compareData.scanB.duration}
                      </Text>
                    </View>

                    <View style={styles.diffRow}>
                      <Text style={[styles.diffColLabel, { flex: 1.2 }]}>STATUS</Text>
                      <Text
                        style={[
                          styles.diffColValue,
                          { flex: 2, color: getStatusColor(compareData.scanA.status) },
                        ]}
                      >
                        {compareData.scanA.status}
                      </Text>
                      <Text
                        style={[
                          styles.diffColValue,
                          { flex: 2, color: getStatusColor(compareData.scanB.status) },
                        ]}
                      >
                        {compareData.scanB.status}
                      </Text>
                    </View>
                  </View>

                  {/* HOST DELTA SECTION */}
                  <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                    // HOSTS_DELTA_DIFF
                  </Text>
                  <View style={styles.diffCard}>
                    {compareData.hostsDiff.map((item, idx) => {
                      const isBoth = item.inA && item.inB;
                      const onlyA = item.inA && !item.inB;
                      const onlyB = !item.inA && item.inB;

                      return (
                        <View key={idx} style={styles.diffItemLine}>
                          <Text style={styles.diffItemName}>{item.host}</Text>
                          <View style={styles.diffTagGroup}>
                            {onlyA && (
                              <View style={[styles.diffTag, { borderColor: THEME.error }]}>
                                <Text style={[styles.diffTagText, { color: THEME.error }]}>
                                  ONLY IN SCAN A
                                </Text>
                              </View>
                            )}
                            {onlyB && (
                              <View style={[styles.diffTag, { borderColor: THEME.primary }]}>
                                <Text style={[styles.diffTagText, { color: THEME.primary }]}>
                                  NEW IN SCAN B (+)
                                </Text>
                              </View>
                            )}
                            {isBoth && (
                              <View style={[styles.diffTag, { borderColor: THEME.textMuted }]}>
                                <Text style={[styles.diffTagText, { color: THEME.textMuted }]}>
                                  PERSISTENT (=)
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </View>

                  {/* PORTS DELTA SECTION */}
                  <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                    // PORTS_DELTA_DIFF
                  </Text>
                  <View style={styles.diffCard}>
                    {compareData.portsDiff.map((item, idx) => {
                      const isBoth = item.inA && item.inB;
                      const closedInB = item.inA && !item.inB;
                      const openedInB = !item.inA && item.inB;

                      return (
                        <View key={idx} style={styles.diffItemLine}>
                          <Text style={styles.diffItemName}>{item.port}</Text>
                          <View style={styles.diffTagGroup}>
                            {closedInB && (
                              <View style={[styles.diffTag, { borderColor: THEME.error }]}>
                                <Text style={[styles.diffTagText, { color: THEME.error }]}>
                                  CLOSED IN SCAN B (-)
                                </Text>
                              </View>
                            )}
                            {openedInB && (
                              <View style={[styles.diffTag, { borderColor: THEME.primary }]}>
                                <Text style={[styles.diffTagText, { color: THEME.primary }]}>
                                  NEW OPEN PORT (+)
                                </Text>
                              </View>
                            )}
                            {isBoth && (
                              <View style={[styles.diffTag, { borderColor: THEME.textMuted }]}>
                                <Text style={[styles.diffTagText, { color: THEME.textMuted }]}>
                                  UNCHANGED (=)
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </View>

                  {/* VULNERABILITIES DELTA SECTION */}
                  <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                    // VULNERABILITIES_DELTA_DIFF
                  </Text>
                  <View style={styles.diffCard}>
                    {compareData.vulnsDiff.length === 0 ? (
                      <Text style={styles.cleanAuditText}>
                        No vulnerabilities recorded in either scan.
                      </Text>
                    ) : (
                      compareData.vulnsDiff.map((item, idx) => {
                        const isBoth = item.inA && item.inB;
                        const fixedInB = item.inA && !item.inB;
                        const newInB = !item.inA && item.inB;

                        return (
                          <View key={idx} style={styles.diffItemLine}>
                            <Text style={[styles.diffItemName, { flex: 1.5 }]}>
                              {item.vuln}
                            </Text>
                            <View style={styles.diffTagGroup}>
                              {fixedInB && (
                                <View style={[styles.diffTag, { borderColor: THEME.primary }]}>
                                  <Text style={[styles.diffTagText, { color: THEME.primary }]}>
                                    REMEDIATED IN B (✔)
                                  </Text>
                                </View>
                              )}
                              {newInB && (
                                <View style={[styles.diffTag, { borderColor: THEME.error }]}>
                                  <Text style={[styles.diffTagText, { color: THEME.error }]}>
                                    NEW VULNERABILITY (⚠)
                                  </Text>
                                </View>
                              )}
                              {isBoth && (
                                <View style={[styles.diffTag, { borderColor: '#ffab00' }]}>
                                  <Text style={[styles.diffTagText, { color: '#ffab00' }]}>
                                    STILL UNPATCHED
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        );
                      })
                    )}
                  </View>

                  <View style={{ height: 30 }} />
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </DragonBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
    backgroundColor: 'rgba(7, 15, 30, 0.75)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.primary,
    letterSpacing: 1.2,
  },
  clearBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME.error,
    backgroundColor: 'rgba(255, 34, 71, 0.1)',
  },
  clearBtnText: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
    color: THEME.error,
  },
  headerSubtitle: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: THEME.textMuted,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '700',
    color: THEME.accent,
    letterSpacing: 1.1,
    marginBottom: 8,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 6,
    marginBottom: 16,
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
    color: THEME.text,
    marginBottom: 3,
  },
  statLabel: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: THEME.textMuted,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: THEME.border,
  },
  toolbarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  compareToggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME.accent,
    backgroundColor: 'rgba(0, 212, 255, 0.08)',
  },
  compareToggleBtnActive: {
    borderColor: THEME.error,
    backgroundColor: 'rgba(255, 34, 71, 0.12)',
  },
  compareToggleText: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
    color: THEME.accent,
  },
  compareToggleTextActive: {
    color: THEME.error,
  },
  filtersScroll: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME.border,
    backgroundColor: THEME.surface,
    marginRight: 6,
  },
  filterChipActive: {
    borderColor: THEME.primary,
    backgroundColor: 'rgba(0, 255, 102, 0.12)',
  },
  filterChipText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: THEME.textMuted,
    fontWeight: '700',
  },
  filterChipTextActive: {
    color: THEME.primary,
  },
  compareBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0c223a',
    borderWidth: 1,
    borderColor: THEME.accent,
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  compareBannerContent: {
    flex: 1,
    marginRight: 8,
  },
  compareBannerTitle: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
    color: THEME.accent,
    marginBottom: 2,
  },
  compareBannerSub: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: THEME.textMuted,
  },
  launchCompareBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: THEME.accent,
  },
  launchCompareBtnText: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
    color: THEME.background,
  },
  timelineHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  timelineGuide: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: THEME.textMuted,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  timelineAxis: {
    width: 24,
    alignItems: 'center',
    paddingTop: 12,
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  timelineLine: {
    flex: 1,
    width: 1,
    backgroundColor: THEME.border,
    marginVertical: 4,
  },
  timelineCardWrapper: {
    flex: 1,
    paddingLeft: 8,
  },
  scanCard: {
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 12,
  },
  scanCardCompareSelected: {
    borderColor: THEME.accent,
    backgroundColor: '#132845',
  },
  scanCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toolBadge: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderWidth: 1,
    borderColor: THEME.accent,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  toolBadgeText: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
    color: THEME.accent,
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(7, 15, 30, 0.4)',
  },
  statusBadgeText: {
    fontFamily: 'monospace',
    fontSize: 9,
    fontWeight: 'bold',
  },
  expandChevron: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: THEME.accent,
    fontWeight: '700',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: THEME.accent,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.surface,
  },
  checkboxActive: {
    backgroundColor: THEME.accent,
  },
  checkboxText: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
    color: THEME.background,
  },
  targetTitle: {
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: 'bold',
    color: THEME.text,
    marginBottom: 4,
  },
  resultSummary: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: THEME.textMuted,
    lineHeight: 16,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: THEME.textMuted,
  },
  metaDivider: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: THEME.border,
    marginHorizontal: 8,
  },
  expandedSection: {
    marginTop: 8,
  },
  expandedDivider: {
    height: 1,
    backgroundColor: THEME.border,
    marginVertical: 10,
  },
  detailLabel: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
    color: THEME.accent,
    marginBottom: 4,
  },
  codeSnippet: {
    backgroundColor: '#050c17',
    borderWidth: 1,
    borderColor: '#1e3857',
    borderRadius: 4,
    padding: 8,
    marginBottom: 10,
  },
  codeSnippetText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: THEME.primary,
  },
  detailBlock: {
    marginBottom: 10,
  },
  inlineBadgesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  inlineBadge: {
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  inlineBadgeText: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: THEME.text,
  },
  portBadge: {
    backgroundColor: 'rgba(0, 255, 102, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 102, 0.3)',
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  portBadgeText: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: THEME.primary,
  },
  cveHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cveCountBadge: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
  },
  vulnItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  vulnBullet: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: THEME.error,
    marginRight: 6,
  },
  vulnItemText: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: THEME.text,
  },
  cleanAuditText: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: THEME.primary,
  },
  emptyContainer: {
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    marginVertical: 16,
  },
  emptyTitle: {
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: 'bold',
    color: THEME.error,
    marginBottom: 6,
  },
  emptySub: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: THEME.textMuted,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 40,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '86%',
    backgroundColor: THEME.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: THEME.accent,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
    marginBottom: 12,
  },
  modalTitle: {
    fontFamily: 'monospace',
    fontSize: 15,
    fontWeight: 'bold',
    color: THEME.accent,
  },
  modalSub: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: THEME.textMuted,
    marginTop: 2,
  },
  modalCloseBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME.error,
    backgroundColor: 'rgba(255, 34, 71, 0.1)',
  },
  modalCloseText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: THEME.error,
    fontWeight: 'bold',
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  diffTable: {
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  diffRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#0a1727',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  diffColHeader: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
    color: THEME.textMuted,
  },
  diffRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#16293f',
  },
  diffColLabel: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: THEME.textMuted,
    fontWeight: 'bold',
  },
  diffColValue: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: THEME.text,
  },
  diffCard: {
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 6,
    padding: 10,
  },
  diffItemLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#172a40',
  },
  diffItemName: {
    flex: 1,
    fontFamily: 'monospace',
    fontSize: 11,
    color: THEME.text,
  },
  diffTagGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  diffTag: {
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(7, 15, 30, 0.4)',
  },
  diffTagText: {
    fontFamily: 'monospace',
    fontSize: 9,
    fontWeight: 'bold',
  },
});
