import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const THEME = {
  background: '#0a0e14',
  primary: '#00ff41',
  accent: '#00d4ff',
  surface: '#131820',
  text: '#e0e0e0',
  error: '#ff003c',
};

export const StatusReportScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>STATUS_REPORT_GEN</Text>
        <Text style={styles.date}>[ 2023.10.15 ]</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionHeader}>// EXECUTIVE_SUMMARY</Text>
        <Text style={styles.paragraph}>
          Initial reconnaissance phase completed. 4 active hosts identified. 
          Vulnerability scanning in progress on target subnets.
        </Text>

        <Text style={styles.sectionHeader}>// METRICS</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricBox}>
            <Text style={styles.metricValue}>12</Text>
            <Text style={styles.metricLabel}>TASKS_DONE</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricValue}>5</Text>
            <Text style={styles.metricLabel}>IN_PROGRESS</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={[styles.metricValue, {color: THEME.error}]}>2</Text>
            <Text style={styles.metricLabel}>BLOCKERS</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>// BLOCKERS</Text>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>{'>'}</Text>
          <Text style={styles.listText}>Aggressive WAF on staging env</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>{'>'}</Text>
          <Text style={styles.listText}>Missing VPN certs for DB subnet</Text>
        </View>

        <TouchableOpacity style={styles.exportBtn}>
          <Text style={styles.exportBtnText}>GENERATE_PDF</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  header: {
    padding: 20,
    backgroundColor: THEME.surface,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    color: '#888',
    fontFamily: 'monospace',
    marginTop: 5,
  },
  content: {
    padding: 20,
  },
  sectionHeader: {
    color: THEME.accent,
    fontFamily: 'monospace',
    marginBottom: 10,
    marginTop: 20,
  },
  paragraph: {
    color: THEME.text,
    fontFamily: 'monospace',
    lineHeight: 22,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  metricBox: {
    flex: 1,
    backgroundColor: THEME.surface,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  metricValue: {
    color: THEME.primary,
    fontSize: 24,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  metricLabel: {
    color: '#888',
    fontSize: 10,
    fontFamily: 'monospace',
    marginTop: 5,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  bullet: {
    color: THEME.error,
    fontFamily: 'monospace',
    marginRight: 10,
  },
  listText: {
    color: THEME.text,
    fontFamily: 'monospace',
  },
  exportBtn: {
    backgroundColor: THEME.primary,
    padding: 15,
    alignItems: 'center',
    marginTop: 40,
  },
  exportBtnText: {
    color: THEME.background,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
});
