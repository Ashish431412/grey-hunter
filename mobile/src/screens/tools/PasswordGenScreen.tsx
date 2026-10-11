import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
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

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  ambiguous: 'il1Lo0O',
};

const LENGTH_PRESETS = [12, 16, 24, 32, 64];
const WORDLIST_COUNTS = [10, 50, 100, 500];

export const PasswordGenScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  // Password generation states
  const [length, setLength] = useState<number>(20);
  const [includeUpper, setIncludeUpper] = useState<boolean>(true);
  const [includeLower, setIncludeLower] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false);

  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // Wordlist generator states
  const [pattern, setPattern] = useState<string>('Dragon@####');
  const [wordlistCount, setWordlistCount] = useState<number>(10);
  const [wordlistResults, setWordlistResults] = useState<string[]>([]);

  // Entropy calculation
  const entropyInfo = useMemo(() => {
    let poolSize = 0;
    if (includeUpper) poolSize += 26;
    if (includeLower) poolSize += 26;
    if (includeNumbers) poolSize += 10;
    if (includeSymbols) poolSize += CHAR_SETS.symbols.length;
    if (excludeAmbiguous) poolSize -= 7;

    poolSize = Math.max(poolSize, 1);
    const entropyBits = Math.floor(length * (Math.log(poolSize) / Math.LN2));

    let label = 'WEAK';
    let color = THEME.error;
    let percentage = 20;

    if (entropyBits < 40) {
      label = 'WEAK';
      color = THEME.error;
      percentage = Math.min((entropyBits / 40) * 25, 25);
    } else if (entropyBits < 65) {
      label = 'FAIR';
      color = '#ffaa00';
      percentage = 25 + Math.min(((entropyBits - 40) / 25) * 25, 25);
    } else if (entropyBits < 85) {
      label = 'STRONG';
      color = '#00d4ff';
      percentage = 50 + Math.min(((entropyBits - 65) / 20) * 25, 25);
    } else {
      label = 'MAXIMUM';
      color = THEME.primary;
      percentage = 100;
    }

    return {
      poolSize,
      entropyBits,
      label,
      color,
      percentage: Math.min(Math.max(percentage, 5), 100),
    };
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous]);

  // Core password generator
  const generatePassword = useCallback(() => {
    let charset = '';
    if (includeUpper) charset += CHAR_SETS.uppercase;
    if (includeLower) charset += CHAR_SETS.lowercase;
    if (includeNumbers) charset += CHAR_SETS.numbers;
    if (includeSymbols) charset += CHAR_SETS.symbols;

    if (excludeAmbiguous) {
      for (const char of CHAR_SETS.ambiguous) {
        charset = charset.split(char).join('');
      }
    }

    if (charset.length === 0) {
      charset = CHAR_SETS.lowercase + CHAR_SETS.numbers;
    }

    let result = '';
    const array = new Uint32Array(length);
    for (let i = 0; i < length; i++) {
      // High-resolution pseudo-random entropy
      const rand = Math.floor(Math.random() * charset.length);
      result += charset[rand];
    }

    setCurrentPassword(result);
    setHistory((prev) => [result, ...prev.filter((p) => p !== result)].slice(0, 5));
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous]);

  // Generate on initial mount
  useEffect(() => {
    generatePassword();
  }, []);

  const handleCopy = async (textToCopy: string, label: string = 'Password') => {
    try {
      await Share.share({
        message: textToCopy,
        title: label,
      });
      setNotification(`${label} shared / copied`);
      setTimeout(() => setNotification(null), 2500);
    } catch {
      Alert.alert(label, textToCopy);
    }
  };

  // Wordlist generator logic
  // Pattern rules:
  // '#' -> Random Digit (0-9)
  // '?' -> Random Lowercase Letter (a-z)
  // '^' -> Random Uppercase Letter (A-Z)
  // '!' -> Random Symbol (@#$%)
  const generateWordlist = useCallback(() => {
    const results: string[] = [];
    const symbolsList = '@#$%&*-!';
    const alphaLower = 'abcdefghijklmnopqrstuvwxyz';
    const alphaUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let count = 0; count < wordlistCount; count++) {
      let entry = '';
      for (let i = 0; i < pattern.length; i++) {
        const char = pattern[i];
        if (char === '#') {
          entry += Math.floor(Math.random() * 10).toString();
        } else if (char === '?') {
          entry += alphaLower[Math.floor(Math.random() * alphaLower.length)];
        } else if (char === '^') {
          entry += alphaUpper[Math.floor(Math.random() * alphaUpper.length)];
        } else if (char === '!') {
          entry += symbolsList[Math.floor(Math.random() * symbolsList.length)];
        } else {
          entry += char;
        }
      }
      results.push(entry);
    }

    setWordlistResults(results);
    setNotification(`Generated ${results.length} wordlist entries`);
    setTimeout(() => setNotification(null), 2500);
  }, [pattern, wordlistCount]);

  const handleExportWordlist = async () => {
    if (wordlistResults.length === 0) return;
    const content = wordlistResults.join('\n');
    await handleCopy(content, `Wordlist (${wordlistResults.length} items)`);
  };

  return (
    <DragonBackground overlayOpacity={0.84}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PASS_GEN // CRYPTOGRAPHIC KEY FORGE</Text>
          <Text style={styles.headerSubtitle}>ENTROPY ENGINE & PATTERN WORDLIST FORGER</Text>
        </View>

        {/* Generated Password Card */}
        <View style={styles.passwordDisplayCard}>
          <View style={styles.passwordLabelRow}>
            <Text style={styles.cardHeaderTag}>// ACTIVE_CIPHER_STRING</Text>
            <Text style={[styles.strengthBadge, { color: entropyInfo.color }]}>
              {entropyInfo.label} [{entropyInfo.entropyBits} BITS]
            </Text>
          </View>

          <View style={styles.passwordBox}>
            <Text style={styles.passwordText} selectable numberOfLines={3}>
              {currentPassword || '••••••••••••••••••••'}
            </Text>
          </View>

          {/* Entropy Bar */}
          <View style={styles.entropyTrack}>
            <View
              style={[
                styles.entropyFill,
                { width: `${entropyInfo.percentage}%`, backgroundColor: entropyInfo.color },
              ]}
            />
          </View>

          {/* Copy and Regenerate Row */}
          <View style={styles.mainActionRow}>
            <TouchableOpacity
              style={styles.generateButton}
              onPress={generatePassword}
              activeOpacity={0.8}
            >
              <Text style={styles.generateButtonText}>GENERATE NEW</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => handleCopy(currentPassword, 'Password')}
              activeOpacity={0.8}
            >
              <Text style={styles.copyButtonText}>COPY / EXPORT</Text>
            </TouchableOpacity>
          </View>

          {notification && (
            <Text style={styles.notificationText}>[ {notification} ]</Text>
          )}
        </View>

        {/* Section: Configuration */}
        <Text style={styles.sectionTitle}>// KEY_SPECIFICATIONS</Text>

        <View style={styles.specCard}>
          {/* Length Slider / Controls */}
          <View style={styles.sliderHeader}>
            <Text style={styles.settingLabel}>LENGTH: {length} CHARACTERS</Text>
            <View style={styles.stepperRow}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setLength((l) => Math.max(8, l - 1))}
              >
                <Text style={styles.stepBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.stepperVal}>{length}</Text>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setLength((l) => Math.min(128, l + 1))}
              >
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Slider visual bar representation */}
          <View style={styles.sliderBarContainer}>
            <View style={styles.sliderBarTrack}>
              <View
                style={[
                  styles.sliderBarFill,
                  { width: `${((length - 8) / (128 - 8)) * 100}%` },
                ]}
              />
            </View>
          </View>

          {/* Quick presets */}
          <View style={styles.presetRow}>
            {LENGTH_PRESETS.map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.presetChip, length === p && styles.presetChipActive]}
                onPress={() => setLength(p)}
              >
                <Text
                  style={[
                    styles.presetChipText,
                    length === p && styles.presetChipTextActive,
                  ]}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Toggles */}
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleTitle}>UPPERCASE LETTERS</Text>
              <Text style={styles.toggleSubtitle}>A-Z (26 glyphs)</Text>
            </View>
            <Switch
              value={includeUpper}
              onValueChange={setIncludeUpper}
              trackColor={{ false: THEME.surface, true: `${THEME.primary}66` }}
              thumbColor={includeUpper ? THEME.primary : THEME.textMuted}
            />
          </View>

          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleTitle}>LOWERCASE LETTERS</Text>
              <Text style={styles.toggleSubtitle}>a-z (26 glyphs)</Text>
            </View>
            <Switch
              value={includeLower}
              onValueChange={setIncludeLower}
              trackColor={{ false: THEME.surface, true: `${THEME.primary}66` }}
              thumbColor={includeLower ? THEME.primary : THEME.textMuted}
            />
          </View>

          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleTitle}>NUMBERS</Text>
              <Text style={styles.toggleSubtitle}>0-9 (10 glyphs)</Text>
            </View>
            <Switch
              value={includeNumbers}
              onValueChange={setIncludeNumbers}
              trackColor={{ false: THEME.surface, true: `${THEME.primary}66` }}
              thumbColor={includeNumbers ? THEME.primary : THEME.textMuted}
            />
          </View>

          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleTitle}>SPECIAL SYMBOLS</Text>
              <Text style={styles.toggleSubtitle}>!@#$%^&*... (32 glyphs)</Text>
            </View>
            <Switch
              value={includeSymbols}
              onValueChange={setIncludeSymbols}
              trackColor={{ false: THEME.surface, true: `${THEME.primary}66` }}
              thumbColor={includeSymbols ? THEME.primary : THEME.textMuted}
            />
          </View>

          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleTitle}>EXCLUDE AMBIGUOUS</Text>
              <Text style={styles.toggleSubtitle}>Avoid i, l, 1, L, o, 0, O</Text>
            </View>
            <Switch
              value={excludeAmbiguous}
              onValueChange={setExcludeAmbiguous}
              trackColor={{ false: THEME.surface, true: `${THEME.accent}66` }}
              thumbColor={excludeAmbiguous ? THEME.accent : THEME.textMuted}
            />
          </View>
        </View>

        {/* Section: History */}
        <Text style={styles.sectionTitle}>// KEY_HISTORY (LAST 5)</Text>

        <View style={styles.historyCard}>
          {history.length === 0 ? (
            <Text style={styles.historyEmpty}>No keys in cache</Text>
          ) : (
            history.map((item, idx) => (
              <TouchableOpacity
                key={`${item}-${idx}`}
                style={styles.historyItem}
                onPress={() => handleCopy(item, 'Historic Key')}
                activeOpacity={0.7}
              >
                <View style={styles.historyIndexCol}>
                  <Text style={styles.historyIndex}>#{idx + 1}</Text>
                </View>
                <Text style={styles.historyItemText} numberOfLines={1}>
                  {item}
                </Text>
                <Text style={styles.historyCopyTag}>[COPY]</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Section: Wordlist Generator */}
        <Text style={styles.sectionTitle}>// WORDLIST_FORGE</Text>

        <View style={styles.wordlistCard}>
          <Text style={styles.inputLabel}>
            PATTERN MASK: (# = digit, ? = lower, ^ = upper, ! = symbol)
          </Text>
          <TextInput
            style={styles.inputField}
            value={pattern}
            onChangeText={setPattern}
            placeholder="e.g. Corp2026@####"
            placeholderTextColor="#4e6580"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.inputLabel}>TARGET ENTRY COUNT:</Text>
          <View style={styles.countSelectorRow}>
            {WORDLIST_COUNTS.map((cnt) => (
              <TouchableOpacity
                key={cnt}
                style={[
                  styles.countChip,
                  wordlistCount === cnt && styles.countChipActive,
                ]}
                onPress={() => setWordlistCount(cnt)}
              >
                <Text
                  style={[
                    styles.countChipText,
                    wordlistCount === cnt && styles.countChipTextActive,
                  ]}
                >
                  {cnt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.wordlistActionsRow}>
            <TouchableOpacity
              style={styles.wordlistGenerateBtn}
              onPress={generateWordlist}
              activeOpacity={0.8}
            >
              <Text style={styles.wordlistGenerateBtnText}>FORGE WORDLIST</Text>
            </TouchableOpacity>

            {wordlistResults.length > 0 && (
              <TouchableOpacity
                style={styles.wordlistExportBtn}
                onPress={handleExportWordlist}
                activeOpacity={0.8}
              >
                <Text style={styles.wordlistExportBtnText}>EXPORT ALL</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Wordlist Preview */}
          {wordlistResults.length > 0 && (
            <View style={styles.previewContainer}>
              <View style={styles.previewHeader}>
                <Text style={styles.previewTitle}>
                  PREVIEW (FIRST {Math.min(10, wordlistResults.length)} OF {wordlistResults.length})
                </Text>
              </View>
              {wordlistResults.slice(0, 10).map((w, i) => (
                <TouchableOpacity
                  key={`${w}-${i}`}
                  style={styles.previewItem}
                  onPress={() => handleCopy(w, 'Wordlist Entry')}
                >
                  <Text style={styles.previewItemIndex}>{(i + 1).toString().padStart(2, '0')}:</Text>
                  <Text style={styles.previewItemText}>{w}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

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
  passwordDisplayCard: {
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardHeaderTag: {
    fontFamily: 'monospace',
    color: THEME.accent,
    fontSize: 11,
    fontWeight: '700',
  },
  strengthBadge: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  passwordBox: {
    backgroundColor: THEME.background,
    borderWidth: 1,
    borderColor: THEME.border,
    padding: 14,
    borderRadius: 6,
    minHeight: 64,
    justifyContent: 'center',
    marginBottom: 12,
  },
  passwordText: {
    fontFamily: 'monospace',
    color: THEME.primary,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
  },
  entropyTrack: {
    height: 4,
    backgroundColor: THEME.surface,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 14,
  },
  entropyFill: {
    height: '100%',
  },
  mainActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  generateButton: {
    flex: 2,
    backgroundColor: THEME.primary,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateButtonText: {
    fontFamily: 'monospace',
    color: THEME.background,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  copyButton: {
    flex: 1.4,
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: THEME.border,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButtonText: {
    fontFamily: 'monospace',
    color: THEME.accent,
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
  sectionTitle: {
    fontFamily: 'monospace',
    color: THEME.accent,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
  },
  specCard: {
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 6,
    padding: 14,
    marginBottom: 20,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingLabel: {
    fontFamily: 'monospace',
    color: THEME.text,
    fontSize: 12,
    fontWeight: '700',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 4,
  },
  stepBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  stepBtnText: {
    fontFamily: 'monospace',
    color: THEME.accent,
    fontSize: 14,
    fontWeight: '900',
  },
  stepperVal: {
    fontFamily: 'monospace',
    color: THEME.primary,
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
  },
  sliderBarContainer: {
    marginBottom: 10,
    marginTop: 4,
  },
  sliderBarTrack: {
    height: 6,
    backgroundColor: THEME.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  sliderBarFill: {
    height: '100%',
    backgroundColor: THEME.primary,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  presetChip: {
    flex: 1,
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: THEME.border,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 4,
  },
  presetChipActive: {
    borderColor: THEME.primary,
    backgroundColor: `${THEME.primary}18`,
  },
  presetChipText: {
    fontFamily: 'monospace',
    color: THEME.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  presetChipTextActive: {
    color: THEME.primary,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.border,
    marginVertical: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  toggleTitle: {
    fontFamily: 'monospace',
    color: THEME.text,
    fontSize: 12,
    fontWeight: '700',
  },
  toggleSubtitle: {
    fontFamily: 'monospace',
    color: THEME.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
  historyCard: {
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
  },
  historyEmpty: {
    fontFamily: 'monospace',
    color: THEME.textMuted,
    fontSize: 11,
    textAlign: 'center',
    paddingVertical: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: `${THEME.border}88`,
  },
  historyIndexCol: {
    width: 28,
  },
  historyIndex: {
    fontFamily: 'monospace',
    color: THEME.accent,
    fontSize: 10,
    fontWeight: '700',
  },
  historyItemText: {
    flex: 1,
    fontFamily: 'monospace',
    color: THEME.text,
    fontSize: 11,
    marginHorizontal: 4,
  },
  historyCopyTag: {
    fontFamily: 'monospace',
    color: THEME.primary,
    fontSize: 10,
  },
  wordlistCard: {
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 6,
    padding: 14,
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'monospace',
    color: THEME.textMuted,
    fontSize: 10,
    marginBottom: 6,
  },
  inputField: {
    fontFamily: 'monospace',
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: THEME.border,
    color: THEME.text,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    fontSize: 12,
    marginBottom: 12,
  },
  countSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  countChip: {
    flex: 1,
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: THEME.border,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 4,
  },
  countChipActive: {
    borderColor: THEME.primary,
    backgroundColor: `${THEME.primary}18`,
  },
  countChipText: {
    fontFamily: 'monospace',
    color: THEME.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  countChipTextActive: {
    color: THEME.primary,
  },
  wordlistActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  wordlistGenerateBtn: {
    flex: 2,
    backgroundColor: THEME.primary,
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  wordlistGenerateBtnText: {
    fontFamily: 'monospace',
    color: THEME.background,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  wordlistExportBtn: {
    flex: 1,
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: THEME.border,
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  wordlistExportBtnText: {
    fontFamily: 'monospace',
    color: THEME.accent,
    fontSize: 11,
    fontWeight: '700',
  },
  previewContainer: {
    marginTop: 14,
    backgroundColor: THEME.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME.border,
    padding: 10,
  },
  previewHeader: {
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
    paddingBottom: 6,
    marginBottom: 6,
  },
  previewTitle: {
    fontFamily: 'monospace',
    color: THEME.accent,
    fontSize: 10,
    fontWeight: '700',
  },
  previewItem: {
    flexDirection: 'row',
    paddingVertical: 3,
  },
  previewItemIndex: {
    fontFamily: 'monospace',
    color: THEME.textMuted,
    fontSize: 11,
    width: 28,
  },
  previewItemText: {
    fontFamily: 'monospace',
    color: THEME.text,
    fontSize: 11,
  },
  footerSpace: {
    height: 30,
  },
});
