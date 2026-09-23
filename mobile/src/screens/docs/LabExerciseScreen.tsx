import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const THEME = {
  background: '#0a0e14',
  primary: '#00ff41',
  accent: '#00d4ff',
  surface: '#131820',
  text: '#e0e0e0',
  warning: '#ffb000',
};

export const LabExerciseScreen = () => {
  const [step, setStep] = useState(1);
  const [showHint, setShowHint] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>SQL Injection Basics</Text>
          <Text style={styles.badge}>BEGINNER</Text>
        </View>
        <Text style={styles.progress}>{step}/3</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>OBJECTIVE</Text>
        <Text style={styles.bodyText}>
          Bypass the login screen of the target dummy application using a basic SQL injection payload.
        </Text>

        <View style={styles.taskCard}>
          <Text style={styles.taskTitle}>STEP {step}: Payload Injection</Text>
          <Text style={styles.bodyText}>
            Enter the standard authentication bypass payload in the username field.
          </Text>
          
          <TouchableOpacity 
            style={styles.hintBtn}
            onPress={() => setShowHint(!showHint)}
          >
            <Text style={styles.hintBtnText}>TOGGLE_HINT</Text>
          </TouchableOpacity>
          
          {showHint && (
            <View style={styles.hintBox}>
              <Text style={styles.hintText}>Try using: ' OR 1=1 --</Text>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>EMBEDDED_TERMINAL</Text>
        <View style={styles.terminal}>
          <Text style={styles.terminalText}>$ curl -X POST http://target/login \ </Text>
          <Text style={styles.terminalText}>  -d "user=' OR 1=1 --&pass="</Text>
          <Text style={styles.terminalOutput}>{'>'} HTTP 200 OK</Text>
          <Text style={styles.terminalOutput}>{'>'} Welcome, Admin</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>VALIDATE_SOLUTION</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: THEME.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 18,
    fontWeight: 'bold',
  },
  badge: {
    color: THEME.background,
    backgroundColor: THEME.warning,
    paddingHorizontal: 5,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    fontFamily: 'monospace',
    fontSize: 10,
    marginTop: 5,
    fontWeight: 'bold',
  },
  progress: {
    color: THEME.text,
    fontFamily: 'monospace',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    color: THEME.accent,
    fontFamily: 'monospace',
    marginBottom: 10,
    marginTop: 10,
  },
  bodyText: {
    color: THEME.text,
    fontFamily: 'monospace',
    lineHeight: 22,
    marginBottom: 15,
  },
  taskCard: {
    backgroundColor: THEME.surface,
    padding: 15,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 20,
  },
  taskTitle: {
    color: '#fff',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  hintBtn: {
    borderWidth: 1,
    borderColor: THEME.warning,
    padding: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  hintBtnText: {
    color: THEME.warning,
    fontFamily: 'monospace',
    fontSize: 10,
  },
  hintBox: {
    backgroundColor: 'rgba(255, 176, 0, 0.1)',
    padding: 10,
    borderLeftWidth: 2,
    borderLeftColor: THEME.warning,
  },
  hintText: {
    color: THEME.warning,
    fontFamily: 'monospace',
  },
  terminal: {
    backgroundColor: '#000',
    padding: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  terminalText: {
    color: THEME.text,
    fontFamily: 'monospace',
    fontSize: 12,
  },
  terminalOutput: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 12,
    marginTop: 5,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  actionBtn: {
    backgroundColor: THEME.primary,
    padding: 15,
    alignItems: 'center',
  },
  actionBtnText: {
    color: THEME.background,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
});
