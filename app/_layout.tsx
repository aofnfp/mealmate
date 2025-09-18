import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { View, StatusBar, StyleSheet, Platform } from "react-native";
import { FocusFlowProvider } from "@/store/focusflow-context";
import { ThemeProvider, useTheme } from "@/store/theme-context";
import { initAudio } from "@/lib/audio";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function RootLayoutNav({ colors }: { colors: any }) {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="challenge" />
      <Stack.Screen name="timeline" />
      <Stack.Screen name="tags" />
      <Stack.Screen name="friends" />
      <Stack.Screen name="store" />
      <Stack.Screen name="news" />
      <Stack.Screen name="onboarding" />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    const setupApp = async () => {
      try {
        await SplashScreen.hideAsync();
        if (Platform.OS !== 'web') {
          await initAudio();
        }
      } catch (error) {
        console.warn('Setup error:', error);
      }
    };
    setupApp();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <FocusFlowProvider>
            <ThemedApp />
          </FocusFlowProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

function ThemedApp() {
  const { colors } = useTheme();
  const isDark = colors.background === '#0B0F14' || colors.background === '#0F2336' || colors.background === '#121821';

  useEffect(() => {
    if (Platform.OS !== 'web') {
      StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
    }
  }, [isDark]);
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <RootLayoutNav colors={colors} />
    </View>
  );
}