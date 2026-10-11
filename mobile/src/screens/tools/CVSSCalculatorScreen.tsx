import React, { useState, useMemo } from 'react';
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

// CVSS 3.1 Metric types and weights
type AttackVector = 'N' | 'A' | 'L' | 'P';
type AttackComplexity = 'L' | 'H';
type PrivilegesRequired = 'N' | 'L' | 'H';
type UserInteraction = 'N' | 'R';
type Scope = 'U' | 'C';
type CIALevel = 'N' | 'L' | 'H';

interface CVSSMetrics {
  av: AttackVector;
  ac: AttackComplexity;
  pr: PrivilegesRequired;
  ui: UserInteraction;
  s: Scope;
  c: CIALevel;
  i: CIALevel;
  a: CIALevel;
}

const AV_WEIGHTS: Record<AttackVector, number> = {
  N: 0.85,
  A: 0.62,
  L: 0.55,
  P: 0.20,
};

const AC_WEIGHTS: Record<AttackComplexity, number> = {
  L: 0.77,
  H: 0.44,
};

const PR_WEIGHTS: Record<Scope, Record<PrivilegesRequired, number>> = {
  U: {
    N: 0.85,
    L: 0.62,
    H: 0.27,
  },
  C: {
    N: 0.85,
    L: 0.68,
    H: 0.50,
  },
};

const UI_WEIGHTS: Record<UserInteraction, number> = {
  N: 0.85,
  R: 0.62,
};

const CIA_WEIGHTS: Record<CIALevel, number> = {
  N: 0.0,
  L: 0.22,
  H: 0.56,
};

// CVSS 3.1 Round Up function according to FIRST.org specification
const roundUp = (input: number): number => {
  const scaled = Math.round(input * 100000);
  if (scaled % 10000 === 0) {
    return scaled / 100000;
  }
  return (Math.floor(scaled / 10000) + 1) / 10;
};

export const CVSSCalculatorScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [metrics, setMetrics] = useState<CVSSMetrics>({
    av: 'N',
    ac: 'L',
    pr: 'N',
    ui: 'N',
    s: 'U',
    c: 'H',
    i: 'H',
    a: 'H',
  });

  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const calculateCVSS = useMemo(() => {
    const iss = 1 - (1 - CIA_WEIGHTS[metrics.c]) * (1 - CIA_WEIGHTS[metrics.i]) * (1 - CIA_WEIGHTS[metrics.a]);
    
    let impactSubScore = 0;
    if (metrics.s === 'U') {
      impactSubScore = 6.42 * iss;
    } else {
      impactSubScore = 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15);
    }

    const prWeight = PR_WEIGHTS[metrics.s][metrics.pr];
    const exploitability = 8.22 * AV_WEIGHTS[metrics.av] * AC_WEIGHTS[metrics.ac] * prWeight * UI_WEIGHTS[metrics.ui];

    let baseScore = 0;
    if (impactSubScore <= 0) {
      baseScore = 0;
    } else if (metrics.s === 'U') {
      baseScore = roundUp(Math.min(impactSubScore + exploitability, 10));
    } else {
      baseScore = roundUp(Math.min(1.08 * (impactSubScore + exploitability), 10));
    }

    // Format score to 1 decimal place
    const scoreFormatted = baseScore.toFixed(1);
    const scoreNum = parseFloat(scoreFormatted);

    // Severity determination
    let severity = 'NONE';
    let severityColor = '#8ba8cc';
    if (scoreNum === 0.0) {
      severity = 'NONE';
      severityColor = '#7a889b';
    } else if (scoreNum <= 3.9) {
      severity = 'LOW';
      severityColor = THEME.primary; // Green
    } else if (scoreNum <= 6.9) {
      severity = 'MEDIUM';
      severityColor = '#ffcc00'; // Yellow
    } else if (scoreNum <= 8.9) {
      severity = 'HIGH';
      severityColor = '#ff8800'; // Orange
    } else {
      severity = 'CRITICAL';
      severityColor = THEME.error; // Red
    }

    const vectorString = `CVSS:3.1/AV:${metrics.av}/AC:${metrics.ac}/PR:${metrics.pr}/UI:${metrics.ui}/S:${metrics.s}/C:${metrics.c}/I:${metrics.i}/A:${metrics.a}`;

    return {
      score: scoreFormatted,
      severity,
      severityColor,
      iss: iss.toFixed(3),
      impact: impactSubScore.toFixed(3),
      exploitability: exploitability.toFixed(3),
      vectorString,
    };
  }, [metrics]);

  const handleCopyOrShare = async () => {
    const payload = `CVSS v3.1 Base Score: ${calculateCVSS.score} (${calculateCVSS.severity})\nVector: ${calculateCVSS.vectorString}`;
    try {
      await Share.share({
        message: payload,
        title: 'CVSS 3.1 Score Result',
      });
      setCopiedNotification('Vector string shared / copied');
      setTimeout(() => setCopiedNotification(null), 2500);
    } catch {
      Alert.alert('Share', payload);
    }
  };

  const handleReset = () => {
    setMetrics({
      av: 'N',
      ac: 'L',
      pr: 'N',
      ui: 'N',
      s: 'U',
      c: 'N',
      i: 'N',
      a: 'N',
    });
  };

  const renderMetricRow = (
    title: string,
    key: keyof CVSSMetrics,
    options: { label: string; value: string; desc: string }[]
  ) => {
    const currentValue = metrics[key];

    return (
      <View style={styles.metricRowContainer}>
        <View style={styles.metricHeader}>
          <Text style={styles.metricTitle}>{title}</Text>
          <Text style={styles.metricActiveVal}>
            [{options.find((o) => o.value === currentValue)?.label.toUpperCase()}]
          </Text>
        </View>

        <View style={styles.optionsGrid}>
          {options.map((opt) => {
            const isSelected = currentValue === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonActive,
                ]}
                onPress={() => setMetrics((prev) => ({ ...prev, [key]: opt.value }))}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
                <Text
                  style={[
                    styles.optionSub,
                    isSelected && styles.optionSubActive,
                  ]}
                >
                  {opt.desc}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <DragonBackground overlayOpacity={0.84}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>CVSS_CALC // VULNERABILITY SCORING ENGINE</Text>
          <Text style={styles.headerSubtitle}>COMMON VULNERABILITY SCORING SYSTEM v3.1</Text>
        </View>

        {/* Score Display Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreRow}>
            <View>
              <Text style={styles.scoreSubheader}>// BASE_SCORE</Text>
              <Text style={[styles.scoreValue, { color: calculateCVSS.severityColor }]}>
                {calculateCVSS.score}
              </Text>
            </View>

            <View style={styles.badgeContainer}>
              <View
                style={[
                  styles.severityBadge,
                  { borderColor: calculateCVSS.severityColor, backgroundColor: `${calculateCVSS.severityColor}1a` },
                ]}
              >
                <Text style={[styles.severityBadgeText, { color: calculateCVSS.severityColor }]}>
                  {calculateCVSS.severity}
                </Text>
              </View>
              <Text style={styles.scopeIndicator}>
                SCOPE: {metrics.s === 'U' ? 'UNCHANGED' : 'CHANGED'}
              </Text>
            </View>
          </View>

          {/* Subscores */}
          <View style={styles.subscoresRow}>
            <View style={styles.subscoreItem}>
              <Text style={styles.subscoreLabel}>EXPLOITABILITY</Text>
              <Text style={styles.subscoreValue}>{calculateCVSS.exploitability}</Text>
            </View>
            <View style={styles.subscoreItem}>
              <Text style={styles.subscoreLabel}>IMPACT (ISS)</Text>
              <Text style={styles.subscoreValue}>{calculateCVSS.impact}</Text>
            </View>
            <View style={styles.subscoreItem}>
              <Text style={styles.subscoreLabel}>RAW ISS</Text>
              <Text style={styles.subscoreValue}>{calculateCVSS.iss}</Text>
            </View>
          </View>

          {/* Vector String */}
          <View style={styles.vectorContainer}>
            <Text style={styles.vectorLabel}>// VECTOR_STRING</Text>
            <Text style={styles.vectorString} selectable>
              {calculateCVSS.vectorString}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.actionButtonPrimary}
              onPress={handleCopyOrShare}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>EXPORT / SHARE SCORE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButtonSecondary}
              onPress={handleReset}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonSecondaryText}>RESET</Text>
            </TouchableOpacity>
          </View>

          {copiedNotification && (
            <Text style={styles.notificationText}>[ {copiedNotification} ]</Text>
          )}
        </View>

        {/* Section 1: Exploitability Metrics */}
        <Text style={styles.sectionHeader}>// EXPLOITABILITY_METRICS</Text>

        {renderMetricRow('1. ATTACK VECTOR (AV)', 'av', [
          { label: 'Network', value: 'N', desc: 'Remote (0.85)' },
          { label: 'Adjacent', value: 'A', desc: 'Local Net (0.62)' },
          { label: 'Local', value: 'L', desc: 'Shell / OS (0.55)' },
          { label: 'Physical', value: 'P', desc: 'Hardware (0.20)' },
        ])}

        {renderMetricRow('2. ATTACK COMPLEXITY (AC)', 'ac', [
          { label: 'Low', value: 'L', desc: 'Standard conditions (0.77)' },
          { label: 'High', value: 'H', desc: 'Specialized bypass (0.44)' },
        ])}

        {renderMetricRow('3. PRIVILEGES REQUIRED (PR)', 'pr', [
          { label: 'None', value: 'N', desc: 'Unauthorized' },
          { label: 'Low', value: 'L', desc: 'Basic user' },
          { label: 'High', value: 'H', desc: 'Administrative' },
        ])}

        {renderMetricRow('4. USER INTERACTION (UI)', 'ui', [
          { label: 'None', value: 'N', desc: 'Autonomous (0.85)' },
          { label: 'Required', value: 'R', desc: 'User click/action (0.62)' },
        ])}

        {/* Section 2: Scope Metric */}
        <Text style={styles.sectionHeader}>// SCOPE_METRIC</Text>

        {renderMetricRow('5. SCOPE (S)', 's', [
          { label: 'Unchanged', value: 'U', desc: 'Contained to component' },
          { label: 'Changed', value: 'C', desc: 'Impacts authorization boundary' },
        ])}

        {/* Section 3: Impact Metrics */}
        <Text style={styles.sectionHeader}>// IMPACT_METRICS</Text>

        {renderMetricRow('6. CONFIDENTIALITY (C)', 'c', [
          { label: 'None', value: 'N', desc: 'No info leak' },
          { label: 'Low', value: 'L', desc: 'Partial disclosure' },
          { label: 'High', value: 'H', desc: 'Full disclosure' },
        ])}

        {renderMetricRow('7. INTEGRITY (I)', 'i', [
          { label: 'None', value: 'N', desc: 'No modification' },
          { label: 'Low', value: 'L', desc: 'Partial tampering' },
          { label: 'High', value: 'H', desc: 'Total compromise' },
        ])}

        {renderMetricRow('8. AVAILABILITY (A)', 'a', [
          { label: 'None', value: 'N', desc: 'No denial' },
          { label: 'Low', value: 'L', desc: 'Performance reduced' },
          { label: 'High', value: 'H', desc: 'Complete shutdown' },
        ])}

        <View style={styles.footerSpace} />
      </ScrollView>
    </DragonBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: 'monospace',
    color: THEME.primary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  headerSubtitle: {
    fontFamily: 'monospace',
    color: THEME.textMuted,
    fontSize: 11,
    marginTop: 4,
  },
  scoreCard: {
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreSubheader: {
    fontFamily: 'monospace',
    color: THEME.accent,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  scoreValue: {
    fontFamily: 'monospace',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -1,
  },
  badgeContainer: {
    alignItems: 'flex-end',
  },
  severityBadge: {
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 6,
  },
  severityBadgeText: {
    fontFamily: 'monospace',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 1.2,
  },
  scopeIndicator: {
    fontFamily: 'monospace',
    color: THEME.textMuted,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  subscoresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: THEME.surface,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: THEME.border,
    marginBottom: 12,
  },
  subscoreItem: {
    alignItems: 'center',
  },
  subscoreLabel: {
    fontFamily: 'monospace',
    color: THEME.textMuted,
    fontSize: 9,
    marginBottom: 2,
  },
  subscoreValue: {
    fontFamily: 'monospace',
    color: THEME.text,
    fontSize: 14,
    fontWeight: '700',
  },
  vectorContainer: {
    backgroundColor: THEME.background,
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME.border,
    marginBottom: 12,
  },
  vectorLabel: {
    fontFamily: 'monospace',
    color: THEME.accent,
    fontSize: 10,
    marginBottom: 4,
  },
  vectorString: {
    fontFamily: 'monospace',
    color: THEME.text,
    fontSize: 11,
    lineHeight: 16,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButtonPrimary: {
    flex: 2,
    backgroundColor: THEME.primary,
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontFamily: 'monospace',
    color: THEME.background,
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  actionButtonSecondary: {
    flex: 1,
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: THEME.border,
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonSecondaryText: {
    fontFamily: 'monospace',
    color: THEME.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  notificationText: {
    fontFamily: 'monospace',
    color: THEME.primary,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 8,
  },
  sectionHeader: {
    fontFamily: 'monospace',
    color: THEME.accent,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  metricRowContainer: {
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    fontFamily: 'monospace',
    color: THEME.text,
    fontSize: 12,
    fontWeight: '700',
  },
  metricActiveVal: {
    fontFamily: 'monospace',
    color: THEME.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  optionButton: {
    flexGrow: 1,
    flexBasis: '47%',
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: THEME.border,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  optionButtonActive: {
    backgroundColor: `${THEME.primary}18`,
    borderColor: THEME.primary,
  },
  optionText: {
    fontFamily: 'monospace',
    color: THEME.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  optionTextActive: {
    color: THEME.primary,
  },
  optionSub: {
    fontFamily: 'monospace',
    color: '#657d9b',
    fontSize: 9,
    marginTop: 2,
  },
  optionSubActive: {
    color: THEME.textMuted,
  },
  footerSpace: {
    height: 30,
  },
});
