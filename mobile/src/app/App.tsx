import React, { useEffect, useState } from 'react';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from '../store';
import { useAuth } from '../hooks/useAuth';
import { AuthStack } from './navigation/AuthStack';
import { MainTabs } from './navigation/MainTabs';
import { useTheme } from './theme';

// Inner component to access Redux state via useAuth hook
const NavigationRoot = () => {
  const { isAuthenticated, loading } = useAuth();
  const { colors } = useTheme();
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    // Simulate splash screen delay
    const timer = setTimeout(() => setIsSplashVisible(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading || isSplashVisible) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const appTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text.primary,
      border: colors.border,
    },
  };

  return (
    <NavigationContainer theme={appTheme}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationRoot />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
