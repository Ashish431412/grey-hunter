import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabsParamList } from './types';
import { useTheme } from '../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import the nested stacks & screens
import { DashboardScreen } from '../../screens/dashboard/DashboardScreen';
import { ToolsStack } from './ToolsStack';
import { TerminalStack } from './TerminalStack';
import { DocsStack } from './DocsStack';
import { ProjectStack } from './ProjectStack';
import { SettingsStack } from './SettingsStack';

const Tab = createBottomTabNavigator<MainTabsParamList>();

export const MainTabs = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          switch (route.name) {
            case 'Dashboard': iconName = 'view-dashboard'; break;
            case 'Tools': iconName = 'shield-half-full'; break;
            case 'Terminal': iconName = 'console'; break;
            case 'Docs': iconName = 'book-open-variant'; break;
            case 'Projects': iconName = 'folder-network'; break;
            case 'Settings': iconName = 'cog'; break;
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Tools" component={ToolsStack} />
      <Tab.Screen name="Terminal" component={TerminalStack} />
      <Tab.Screen name="Docs" component={DocsStack} />
      <Tab.Screen name="Projects" component={ProjectStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
};
