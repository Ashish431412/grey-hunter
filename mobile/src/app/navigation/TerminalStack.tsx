import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TerminalStackParamList } from './types';
import { useTheme } from '../theme';
import { TerminalScreen } from '../../screens/terminal/TerminalScreen';
import { MultiWindowScreen } from '../../screens/terminal/MultiWindowScreen';

const Stack = createNativeStackNavigator<TerminalStackParamList>();

export const TerminalStack = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.primary,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Terminal" component={TerminalScreen} options={{ title: 'Root Shell', headerShown: false }} />
      <Stack.Screen name="MultiWindow" component={MultiWindowScreen} options={{ title: 'Multi-Terminal Console' }} />
    </Stack.Navigator>
  );
};
