import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { DragonBackground } from '../../components/common/DragonBackground';

const THEME = {
  primary: '#00ff66',
  accent: '#00d4ff',
  surface: '#0d1b2e',
  card: '#11223a',
  cardBorder: '#1e3557',
  text: '#ffffff',
  textDim: '#a0aec0',
};

const SECTIONS = [
  { id: '1', title: 'ACCOUNT_PROFILE', screen: 'Profile' },
  { id: '2', title: 'SECURITY_CONFIG', screen: 'SecuritySettings' },
  { id: '3', title: 'VPN_NETWORK', screen: 'VpnSettings' },
  { id: '4', title: 'STORAGE_MANAGER', screen: 'StorageSettings' },
  { id: '5', title: 'SYNC_PROTOCOL', screen: 'SyncSettings' },
  { id: '6', title: 'SYSTEM_INFO', screen: 'About' },
];

export const SettingsScreen = ({ navigation }: any) => {
  return (
    <DragonBackground overlayOpacity={0.88}>
      <View style={styles.container}>
        <Text style={styles.header}>// SYSTEM_CONFIGURATION</Text>
        
        <FlatList
          data={SECTIONS}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.itemCard}
              onPress={() => item.screen !== 'About' ? navigation.navigate(item.screen) : null}
              activeOpacity={0.7}
            >
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.arrow}>{'→'}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </DragonBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 16,
  },
  header: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    letterSpacing: 1,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.card,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    borderLeftWidth: 3,
    borderLeftColor: THEME.primary,
  },
  itemTitle: {
    color: THEME.text,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
  },
  arrow: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
