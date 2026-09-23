import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ToolsStackParamList } from './types';
import { useTheme } from '../theme';
import { ToolCatalogScreen } from '../../screens/tools/ToolCatalogScreen';
import { ToolDetailScreen } from '../../screens/tools/ToolDetailScreen';
import { ToolRunnerScreen } from '../../screens/tools/ToolRunnerScreen';
import { ScanResultsScreen } from '../../screens/tools/ScanResultsScreen';

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
    </Stack.Navigator>
  );
};
