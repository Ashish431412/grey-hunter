import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ToolsStackParamList } from './types';
import { useTheme } from '../theme';
import { ToolCatalogScreen } from '../../screens/tools/ToolCatalogScreen';
import { ToolDetailScreen } from '../../screens/tools/ToolDetailScreen';
import { ToolRunnerScreen } from '../../screens/tools/ToolRunnerScreen';
import { ScanResultsScreen } from '../../screens/tools/ScanResultsScreen';
import { NetworkMapScreen } from '../../screens/tools/NetworkMapScreen';
import { ExploitDBScreen } from '../../screens/tools/ExploitDBScreen';
import { CVSSCalculatorScreen } from '../../screens/tools/CVSSCalculatorScreen';
import { PasswordGenScreen } from '../../screens/tools/PasswordGenScreen';
import { ScanHistoryScreen } from '../../screens/tools/ScanHistoryScreen';
import { CheatSheetScreen } from '../../screens/docs/CheatSheetScreen';

const Stack = createNativeStackNavigator<ToolsStackParamList>();

export const ToolsStack = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.primary,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="ToolCatalog" component={ToolCatalogScreen} options={{ title: 'Arsenal' }} />
      <Stack.Screen name="ToolDetail" component={ToolDetailScreen} options={{ title: 'Tool Specifications' }} />
      <Stack.Screen name="ToolRunner" component={ToolRunnerScreen} options={{ title: 'Execution Control' }} />
      <Stack.Screen name="ScanResults" component={ScanResultsScreen} options={{ title: 'Analysis & Telemetry' }} />
      <Stack.Screen name="NetworkMap" component={NetworkMapScreen} options={{ title: 'Network Topology' }} />
      <Stack.Screen name="ExploitDB" component={ExploitDBScreen} options={{ title: 'Exploit Database' }} />
      <Stack.Screen name="CVSSCalculator" component={CVSSCalculatorScreen} options={{ title: 'CVSS 3.1 Scoring' }} />
      <Stack.Screen name="PasswordGen" component={PasswordGenScreen} options={{ title: 'Key & Wordlist Forge' }} />
      <Stack.Screen name="ScanHistory" component={ScanHistoryScreen} options={{ title: 'Operation Log' }} />
      <Stack.Screen name="CheatSheet" component={CheatSheetScreen} options={{ title: 'Command Cheat Sheet' }} />
    </Stack.Navigator>
  );
};
