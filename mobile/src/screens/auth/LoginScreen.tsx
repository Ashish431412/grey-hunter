import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { DragonBackground } from '../../components/common/DragonBackground';

const THEME = {
  background: '#070f1e', // Mythic Dragon Abyss
  primary: '#00ff66',    // Dragon Emerald Green
  accent: '#00d4ff',     // Dragon Cyan Blue
  surface: '#0d1b2e',    // Dragon Scale Slate
  text: '#ffffff',       // Pure Crisp White
  textMuted: '#8ba8cc',  // Ice Blue Silver
  border: '#163252',     // Dragon Blue Border
  error: '#ff2247',
};

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleLogin = () => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      dispatch(
        setCredentials({
          user: {
            id: 'usr_root_01',
            email: email || 'operator@greyhunter.sec',
            displayName: 'SYS_OPERATOR',
            role: 'ADMIN' as any,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as any,
          tokens: {
            accessToken: 'jwt_access_granted_operator',
            refreshToken: 'jwt_refresh_granted_operator',
          },
        })
      );
    }, 600);
  };

  return (
    <DragonBackground overlayOpacity={0.72}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.header}>
          <Text style={styles.title}>GREY HUNTER</Text>
          <Text style={styles.subtitle}>DRAGON EDITION // ACCESS TERMINAL</Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="[ Email ]"
            placeholderTextColor="#555"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="[ Password ]"
            placeholderTextColor="#555"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={THEME.background} />
          ) : (
            <Text style={styles.loginButtonText}>INITIATE_SESSION()</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.biometricButton} onPress={handleLogin}>
          <Text style={styles.biometricText}>[ USE BIOMETRICS / QUICK ACCESS ]</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('EthicsAgreementScreen')}>
            <Text style={styles.linkText}>RULES_OF_ENGAGEMENT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  </DragonBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: THEME.primary,
    letterSpacing: 4,
    textShadowColor: THEME.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 12,
    color: THEME.accent,
    letterSpacing: 2,
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: THEME.primary,
    color: THEME.text,
    padding: 15,
    marginBottom: 15,
    fontFamily: 'monospace',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: THEME.primary,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonText: {
    color: THEME.background,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    fontSize: 16,
  },
  biometricButton: {
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.accent,
    marginBottom: 40,
  },
  biometricText: {
    color: THEME.accent,
    fontFamily: 'monospace',
  },
  footer: {
    alignItems: 'center',
  },
  linkText: {
    color: THEME.text,
    fontFamily: 'monospace',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: THEME.error,
    fontFamily: 'monospace',
    marginBottom: 15,
    textAlign: 'center',
  },
});
