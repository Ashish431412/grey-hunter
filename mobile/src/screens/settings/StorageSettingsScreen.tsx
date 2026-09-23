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

export const StorageSettingsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>// STORAGE_QUOTA</Text>
      
      <View style={styles.barContainer}>
        <View style={styles.barFill} />
      </View>
      <View style={styles.barLabels}>
        <Text style={styles.label}>USED: 1.2 GB</Text>
        <Text style={styles.label}>FREE: 3.8 GB</Text>
      </View>

      <Text style={styles.sectionTitle}>// ALLOCATIONS</Text>
      <View style={styles.list}>
        <View style={styles.listItem}>
          <Text style={styles.itemText}>SCAN_RESULTS</Text>
          <Text style={styles.itemSize}>850 MB</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.itemText}>OFFLINE_DOCS</Text>
          <Text style={styles.itemSize}>200 MB</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.itemText}>PROJECT_CACHE</Text>
          <Text style={styles.itemSize}>150 MB</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>// OPERATIONS</Text>
      <View style={styles.opsGrid}>
        <TouchableOpacity style={styles.opBtn}>
          <Text style={styles.opBtnText}>EXPORT_BACKUP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.opBtn}>
          <Text style={styles.opBtnText}>IMPORT_BACKUP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.opBtn, styles.dangerBtn]}>
          <Text style={styles.dangerBtnText}>CLEAR_CACHE</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
    padding: 15,
  },
  sectionTitle: {
    color: THEME.primary,
    fontFamily: 'monospace',
    marginBottom: 15,
    marginTop: 10,
  },
  barContainer: {
    height: 20,
    backgroundColor: '#333',
    width: '100%',
    marginBottom: 10,
  },
  barFill: {
    height: '100%',
    width: '24%', // (1.2/5.0)
    backgroundColor: THEME.accent,
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  label: {
    color: '#888',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  list: {
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 30,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  itemText: {
    color: THEME.text,
    fontFamily: 'monospace',
  },
  itemSize: {
    color: THEME.accent,
    fontFamily: 'monospace',
  },
  opsGrid: {
    gap: 15,
  },
  opBtn: {
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: THEME.primary,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  opBtnText: {
    color: THEME.primary,
    fontFamily: 'monospace',
  },
  dangerBtn: {
    borderColor: THEME.error,
  },
  dangerBtnText: {
    color: THEME.error,
    fontFamily: 'monospace',
  },
});
