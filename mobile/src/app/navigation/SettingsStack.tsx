import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsStackParamList } from './types';
import { useTheme } from '../theme';
import { SettingsScreen } from '../../screens/settings/SettingsScreen';
import { VpnSettingsScreen } from '../../screens/settings/VpnSettingsScreen';
import { SecuritySettingsScreen } from '../../screens/settings/SecuritySettingsScreen';
import { StorageSettingsScreen } from '../../screens/settings/StorageSettingsScreen';
import { SyncSettingsScreen } from '../../screens/settings/SyncSettingsScreen';
import { ProfileScreen } from '../../screens/settings/ProfileScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export const SettingsStack = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.primary,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="SettingsHome" component={SettingsScreen} options={{ title: 'System Settings' }} />
      <Stack.Screen name="VpnSettings" component={VpnSettingsScreen} options={{ title: 'VPN Tunnel Config' }} />
      <Stack.Screen name="SecuritySettings" component={SecuritySettingsScreen} options={{ title: 'Security & Bio-Auth' }} />
      <Stack.Screen name="StorageSettings" component={StorageSettingsScreen} options={{ title: 'Encrypted Storage' }} />
      <Stack.Screen name="SyncSettings" component={SyncSettingsScreen} options={{ title: 'Cloud Sync Protocol' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Operator Profile' }} />
    </Stack.Navigator>
  );
};
