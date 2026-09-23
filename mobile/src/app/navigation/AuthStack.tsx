import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import { useTheme } from '../theme';
import { LoginScreen } from '../../screens/auth/LoginScreen';
import { BiometricSetupScreen } from '../../screens/auth/BiometricSetupScreen';
import { EthicsAgreementScreen } from '../../screens/auth/EthicsAgreementScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.primary,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BiometricSetupScreen" component={BiometricSetupScreen} options={{ title: 'Security Setup' }} />
      <Stack.Screen name="EthicsAgreementScreen" component={EthicsAgreementScreen} options={{ title: 'Rules of Engagement' }} />
    </Stack.Navigator>
  );
};
