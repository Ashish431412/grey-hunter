import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProjectStackParamList } from './types';
import { useTheme } from '../theme';
import { ProjectBoardScreen } from '../../screens/projects/ProjectBoardScreen';
import { TaskDetailScreen } from '../../screens/projects/TaskDetailScreen';
import { StatusReportScreen } from '../../screens/projects/StatusReportScreen';
import { TeamScreen } from '../../screens/projects/TeamScreen';
import { AuditLogScreen } from '../../screens/projects/AuditLogScreen';

const Stack = createNativeStackNavigator<ProjectStackParamList>();

export const ProjectStack = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.primary,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="ProjectBoard" component={ProjectBoardScreen} options={{ title: 'Operations Board' }} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen as any} options={{ title: 'Task Details' }} />
      <Stack.Screen name="StatusReport" component={StatusReportScreen as any} options={{ title: 'Mission Briefing' }} />
      <Stack.Screen name="Team" component={TeamScreen as any} options={{ title: 'Squad Roster' }} />
      <Stack.Screen name="AuditLog" component={AuditLogScreen as any} options={{ title: 'Security Audit Log' }} />
    </Stack.Navigator>
  );
};
