import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { DragonBackground } from '../../components/common/DragonBackground';

const THEME = {
  background: '#070f1e', // Mythic Dragon Abyss
  primary: '#00ff66',    // Dragon Emerald Green
  accent: '#00d4ff',     // Dragon Cyan Blue
  surface: '#0d1b2e',    // Dragon Scale Slate
  surfaceLight: '#142742',
  border: '#163252',     // Dragon Border
  text: '#ffffff',       // Pure Crisp White
  textMuted: '#8ba8cc',  // Ice Blue Silver
  error: '#ff2247',      // Neon Red
  warning: '#ffb000',    // Amber Warning
};

const ROLES = [
  { id: 'RED_TEAM', label: 'RED TEAM OPERATOR' },
  { id: 'PEN_TESTER', label: 'PENETRATION TESTER' },
  { id: 'AUDITOR', label: 'SECURITY AUDITOR' },
];

export const RegisterScreen = ({ navigation }: any) => {
  const [codename, setCodename] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('PEN_TESTER');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToEthics, setAgreedToEthics] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return Math.min(score, 4);
  };

  const strength = getPasswordStrength();

  const getStrengthLabel = () => {
    switch (strength) {
      case 1:
        return { label: 'LOW ENTROPY', color: THEME.error };
      case 2:
        return { label: 'MODERATE', color: THEME.warning };
      case 3:
        return { label: 'STRONG CIPHER', color: THEME.accent };
      case 4:
        return { label: 'MAX ENCRYPTION', color: THEME.primary };
      default:
        return { label: 'KEY REQUIRED', color: '#555' };
    }
  };

  const handleRegister = () => {
    setError('');

    if (!codename.trim()) {
      setError('ERROR: OPERATOR CODENAME IS MANDATORY');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('ERROR: VALID SECURE EMAIL REQUIRED');
      return;
    }
    if (password.length < 6) {
      setError('ERROR: PASSWORD MUST CONTAIN AT LEAST 6 CHARACTERS');
      return;
    }
    if (password !== confirmPassword) {
      setError('ERROR: PASSWORDS DO NOT MATCH');
      return;
    }
    if (!agreedToEthics) {
      setError('ERROR: YOU MUST AGREE TO THE ETHICAL HACKING CHARTER');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Dispatch newly created account credentials to Redux store
      dispatch(
        setCredentials({
          user: {
            id: `usr_${Date.now()}`,
            email: email.trim().toLowerCase(),
            displayName: codename.trim().toUpperCase(),
            role: role as any,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as any,
          tokens: {
            accessToken: `jwt_sec_${Date.now()}_access`,
            refreshToken: `jwt_sec_${Date.now()}_refresh`,
          },
        })
      );
    }, 700);
  };

  return (
    <DragonBackground overlayOpacity={0.78}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.badgeText}>[ GREY HUNTER // SEC_ID: NEW ]</Text>
            <Text style={styles.title}>OPERATOR ENLISTMENT</Text>
            <Text style={styles.subtitle}>DRAGON CIPHER DEFENSE NETWORK</Text>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠ {error}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <Text style={styles.label}>OPERATIVE CODENAME</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. CYBER_GHOST, ROOT_DRAKE"
              placeholderTextColor="#556b85"
              value={codename}
              onChangeText={setCodename}
              autoCapitalize="characters"
            />

            <Text style={styles.label}>SECURE COMMS EMAIL</Text>
            <TextInput
              style={styles.input}
              placeholder="operator@greyhunter.sec"
              placeholderTextColor="#556b85"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>OPERATIONAL ROLE & CLEARANCE</Text>
            <View style={styles.roleContainer}>
              {ROLES.map((r) => {
                const isSelected = role === r.id;
                return (
                  <TouchableOpacity
                    key={r.id}
                    style={[styles.roleChip, isSelected && styles.roleChipActive]}
                    onPress={() => setRole(r.id)}
                  >
                    <Text style={[styles.roleChipText, isSelected && styles.roleChipTextActive]}>
                      {r.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>SECURITY KEY (PASSWORD)</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••••••"
              placeholderTextColor="#556b85"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* Password Entropy Meter */}
            <View style={styles.entropyContainer}>
              <View style={styles.entropyBars}>
                <View
                  style={[
                    styles.entropyBar,
                    strength >= 1 && { backgroundColor: THEME.error },
                  ]}
                />
                <View
                  style={[
                    styles.entropyBar,
                    strength >= 2 && { backgroundColor: THEME.warning },
                  ]}
                />
                <View
                  style={[
                    styles.entropyBar,
                    strength >= 3 && { backgroundColor: THEME.accent },
                  ]}
                />
                <View
                  style={[
                    styles.entropyBar,
                    strength >= 4 && { backgroundColor: THEME.primary },
                  ]}
                />
              </View>
              <Text style={[styles.entropyStatus, { color: getStrengthLabel().color }]}>
                {getStrengthLabel().label}
              </Text>
            </View>

            <Text style={styles.label}>CONFIRM SECURITY KEY</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••••••"
              placeholderTextColor="#556b85"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            {/* Ethics Charter Agreement Checkbox */}
            <TouchableOpacity
              style={styles.ethicsCheckboxContainer}
              onPress={() => setAgreedToEthics(!agreedToEthics)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, agreedToEthics && styles.checkboxActive]}>
                {agreedToEthics && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.ethicsText}>
                I certify under strict oath that all auditing and penetration testing tools will be used
                strictly on <Text style={{ color: THEME.primary, fontWeight: 'bold' }}>AUTHORIZED TARGETS</Text> within explicitly defined legal rules of engagement.
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={THEME.background} />
            ) : (
              <Text style={styles.registerButtonText}>CREATE_ACCOUNT_AND_ENLIST()</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginBackLink}
            onPress={() => navigation.navigate('LoginScreen')}
          >
            <Text style={styles.loginBackText}>
              ALREADY REGISTERED? <Text style={{ color: THEME.accent, fontWeight: 'bold' }}>[ ACCESS TERMINAL ]</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </DragonBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 45,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: THEME.accent,
    letterSpacing: 2,
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: THEME.primary,
    fontFamily: 'monospace',
    letterSpacing: 2,
    textShadowColor: THEME.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 11,
    color: THEME.textMuted,
    fontFamily: 'monospace',
    letterSpacing: 2,
    marginTop: 6,
  },
  errorBox: {
    backgroundColor: 'rgba(255, 34, 71, 0.15)',
    borderWidth: 1,
    borderColor: THEME.error,
    padding: 10,
    marginBottom: 16,
    borderRadius: 4,
  },
  errorText: {
    color: THEME.error,
    fontFamily: 'monospace',
    fontSize: 12,
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  label: {
    color: THEME.textMuted,
    fontFamily: 'monospace',
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 6,
  },
  input: {
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: THEME.border,
    color: THEME.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    fontFamily: 'monospace',
    fontSize: 14,
    borderRadius: 4,
  },
  roleContainer: {
    flexDirection: 'column',
    gap: 8,
    marginBottom: 14,
  },
  roleChip: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: THEME.border,
    backgroundColor: THEME.surface,
    borderRadius: 4,
    alignItems: 'center',
  },
  roleChipActive: {
    borderColor: THEME.accent,
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
  },
  roleChipText: {
    color: THEME.textMuted,
    fontFamily: 'monospace',
    fontSize: 12,
    letterSpacing: 1,
  },
  roleChipTextActive: {
    color: THEME.accent,
    fontWeight: 'bold',
  },
  entropyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    marginTop: -4,
  },
  entropyBars: {
    flexDirection: 'row',
    flex: 1,
    height: 5,
    marginRight: 12,
    backgroundColor: THEME.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  entropyBar: {
    flex: 1,
    marginHorizontal: 1,
    backgroundColor: '#1b2d47',
  },
  entropyStatus: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  ethicsCheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(13, 27, 46, 0.8)',
    borderWidth: 1,
    borderColor: THEME.border,
    padding: 12,
    borderRadius: 4,
    marginTop: 4,
    marginBottom: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: THEME.accent,
    borderRadius: 4,
    marginRight: 10,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.surface,
  },
  checkboxActive: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  checkmark: {
    color: THEME.background,
    fontWeight: 'bold',
    fontSize: 14,
  },
  ethicsText: {
    flex: 1,
    color: THEME.textMuted,
    fontFamily: 'monospace',
    fontSize: 11,
    lineHeight: 16,
  },
  registerButton: {
    backgroundColor: THEME.primary,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 4,
    marginBottom: 16,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },
  registerButtonText: {
    color: THEME.background,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    fontSize: 14,
    letterSpacing: 1.5,
  },
  loginBackLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  loginBackText: {
    color: THEME.textMuted,
    fontFamily: 'monospace',
    fontSize: 12,
    letterSpacing: 1,
  },
});
