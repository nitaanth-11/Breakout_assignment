// ── App.js: Root entry point for Closira Frontend ───────────────────────────
// Wraps the app in SafeAreaProvider, NavigationContainer with dark theme, and StatusBar.

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import COLORS from './src/constants/colors';

const LIGHT_THEME = {
  dark: false,
  colors: {
    primary: COLORS.primary,
    background: COLORS.background,
    card: COLORS.surface,
    text: COLORS.textPrimary,
    border: COLORS.border,
    notification: COLORS.error,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={LIGHT_THEME}>
        <StatusBar style="dark" />
        <BottomTabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
