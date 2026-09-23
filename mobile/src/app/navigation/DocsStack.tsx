import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DocsStackParamList } from './types';
import { useTheme } from '../theme';
import { DocsHomeScreen } from '../../screens/docs/DocsHomeScreen';
import { DocViewerScreen } from '../../screens/docs/DocViewerScreen';
import { LabExerciseScreen } from '../../screens/docs/LabExerciseScreen';

const Stack = createNativeStackNavigator<DocsStackParamList>();

export const DocsStack = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.primary,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="DocsHome" component={DocsHomeScreen} options={{ title: 'Knowledge Base' }} />
      <Stack.Screen name="DocViewer" component={DocViewerScreen} options={{ title: 'Handbook' }} />
      <Stack.Screen name="LabExercise" component={LabExerciseScreen} options={{ title: 'Virtual Cyber Lab' }} />
    </Stack.Navigator>
  );
};
