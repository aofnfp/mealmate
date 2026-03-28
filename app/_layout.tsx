import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { View, StatusBar, StyleSheet, Platform } from 'react-native';
import { ThemeProvider, useTheme } from '@/store/theme-context';
import { initAudio } from '@/lib/audio';
import { useTimerStore } from '@/store/timer-store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    (async () => {
      try {
        await SplashScreen.hideAsync();
        if (Platform.OS !== 'web') {
          await initAudio();
        }
        await useTimerStore.getState().loadFromStorage();
      } catch (e) {
        console.warn('Setup error:', e);
      }
    })();
  }, []);

  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

function ThemedApp() {
  const { colors } = useTheme();
  const isDark = colors.background.startsWith('#0') || colors.background.startsWith('#1');

  useEffect(() => {
    if (Platform.OS !== 'web') {
      StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
    }
  }, [isDark]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
