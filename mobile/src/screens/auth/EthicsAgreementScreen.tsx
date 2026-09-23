import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';

const THEME = {
  background: '#0a0e14',
  primary: '#00ff41',
  accent: '#00d4ff',
  surface: '#131820',
  text: '#e0e0e0',
  disabled: '#333333',
};

export const EthicsAgreementScreen = ({ navigation }: any) => {
  const [agreed, setAgreed] = useState(false);
  const dispatch = useDispatch();

  const handleAccept = () => {
    dispatch(
      setCredentials({
        user: {
          id: 'usr_root_01',
          email: 'operator@greyhunter.sec',
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
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RULES_OF_ENGAGEMENT</Text>
      
      <ScrollView style={styles.scrollView}>
        <Text style={styles.policyText}>
          1. AUTHORIZED TESTING ONLY
          You agree to only scan, exploit, or interact with systems for which you have explicit, documented permission.
          
          {'\n\n'}
          2. NO UNAUTHORIZED ACCESS
          Any tools provided by Grey Hunter are for educational and authorized professional use only.
          
          {'\n\n'}
          3. RESPONSIBLE DISCLOSURE
          Vulnerabilities discovered must be reported securely to the system owner.
          
          {'\n\n'}
          4. LEGAL COMPLIANCE
          You are bound by all applicable local, state, and international laws regarding computer crimes.
          
          {'\n\n'}
          Failure to comply will result in immediate termination of your node access and potential legal consequences.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.checkboxContainer}
          onPress={() => setAgreed(!agreed)}
        >
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>I acknowledge and agree</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.acceptButton, !agreed && styles.acceptButtonDisabled]}
          disabled={!agreed}
          onPress={handleAccept}
        >
          <Text style={[styles.acceptButtonText, !agreed && styles.acceptButtonTextDisabled]}>
            ACCEPT_AND_INITIALIZE
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: '#ff003c',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    backgroundColor: THEME.surface,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 20,
  },
  policyText: {
    color: THEME.text,
    fontFamily: 'monospace',
    lineHeight: 24,
  },
  footer: {
    paddingBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: THEME.primary,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: 'rgba(0, 255, 65, 0.2)',
  },
  checkmark: {
    color: THEME.primary,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    color: THEME.text,
    fontFamily: 'monospace',
  },
  acceptButton: {
    backgroundColor: THEME.primary,
    padding: 15,
    alignItems: 'center',
  },
  acceptButtonDisabled: {
    backgroundColor: THEME.disabled,
  },
  acceptButtonText: {
    color: THEME.background,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  acceptButtonTextDisabled: {
    color: '#666',
  },
});
