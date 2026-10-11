import { NavigatorScreenParams } from '@react-navigation/native';
import { Project, Task, Tool } from '@utils/types';

// Auth Stack
export type AuthStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  BiometricSetupScreen: undefined;
  EthicsAgreementScreen: undefined;
};

// Main App Stacks (Nested in Tabs)
export type ToolsStackParamList = {
  ToolCatalog: undefined;
  ToolDetail: { toolId: string };
  ToolRunner: { tool: Tool };
  ScanResults: { resultId: string };
  NetworkMap: undefined;
  ExploitDB: undefined;
  CVSSCalculator: undefined;
  PasswordGen: undefined;
  ScanHistory: undefined;
  CheatSheet: undefined;
};

export type TerminalStackParamList = {
  Terminal: { sessionId?: string };
  MultiWindow: undefined;
};

export type DocsStackParamList = {
  DocsHome: undefined;
  DocViewer: { docId: string };
  LabExercise: { labId: string };
  CheatSheet: undefined;
};

export type ProjectStackParamList = {
  ProjectBoard: undefined;
  TaskDetail: { task: Task };
  StatusReport: { projectId: string };
  Team: { projectId: string };
  AuditLog: { projectId: string };
};

export type SettingsStackParamList = {
  SettingsHome: undefined;
  VpnSettings: undefined;
  SecuritySettings: undefined;
  StorageSettings: undefined;
  SyncSettings: undefined;
  Profile: undefined;
};

// Root Tabs
export type MainTabsParamList = {
  Dashboard: undefined;
  Tools: NavigatorScreenParams<ToolsStackParamList>;
  Terminal: NavigatorScreenParams<TerminalStackParamList>;
  Docs: NavigatorScreenParams<DocsStackParamList>;
  Projects: NavigatorScreenParams<ProjectStackParamList>;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

// Root Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  MainApp: NavigatorScreenParams<MainTabsParamList>;
};
