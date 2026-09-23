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
} from 'react-native';

const THEME = {
  background: '#0a0e14',
  primary: '#00ff41',
  accent: '#00d4ff',
  surface: '#131820',
  text: '#e0e0e0',
  error: '#ff003c',
  warning: '#ffb000',
};

export const RegisterScreen = ({ navigation }: any) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const getPasswordStrength = () => {
    if (!password) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  };

  const strength = getPasswordStrength();

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>NEW_AGENT</Text>
          <Text style={styles.subtitle}>REGISTRATION PROTOCOL</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="[ Display Name ]"
            placeholderTextColor="#555"
            value={displayName}
            onChangeText={setDisplayName}
          />
          <TextInput
            style={styles.input}
            placeholder="[ Email Address ]"
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
          
          <View style={styles.strengthMeter}>
            <View style={[styles.strengthBar, strength >= 1 && { backgroundColor: THEME.error }]} />
            <View style={[styles.strengthBar, strength >= 2 && { backgroundColor: THEME.warning }]} />
            <View style={[styles.strengthBar, strength >= 3 && { backgroundColor: THEME.primary }]} />
          </View>

          <TextInput
            style={styles.input}
            placeholder="[ Confirm Password ]"
            placeholderTextColor="#555"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={styles.registerButton}
          onPress={() => navigation.navigate('BiometricSetup')}
        >
          <Text style={styles.registerButtonText}>EXECUTE_REGISTRATION</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{'<< ABORT'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 30,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: THEME.primary,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  subtitle: {
    color: THEME.text,
    fontFamily: 'monospace',
    marginTop: 8,
  },
  form: {
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
  },
  strengthMeter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    height: 4,
  },
  strengthBar: {
    flex: 1,
    backgroundColor: '#333',
    marginHorizontal: 2,
  },
  registerButton: {
    backgroundColor: THEME.primary,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: THEME.background,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  backButton: {
    alignItems: 'center',
    padding: 10,
  },
  backButtonText: {
    color: THEME.accent,
    fontFamily: 'monospace',
  },
});
