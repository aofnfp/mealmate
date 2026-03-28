import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Drawer } from "expo-router/drawer";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { View, StatusBar, StyleSheet, Platform } from "react-native";
import { FocusFlowProvider } from "@/store/focusflow-context";
import { ThemeProvider, useTheme } from "@/store/theme-context";
import { initAudio } from "@/lib/audio";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomDrawerContent from "@/components/CustomDrawerContent";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function RootLayoutNav({ colors }: { colors: any }) {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: colors.drawerBg,
          width: 280,
        },
        drawerType: 'slide',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <Drawer.Screen name="(tabs)" />
      <Drawer.Screen name="challenge" />
      <Drawer.Screen name="timeline" />
      <Drawer.Screen name="tags" />
      <Drawer.Screen name="friends" />
      <Drawer.Screen name="store" />
      <Drawer.Screen name="news" />
      <Drawer.Screen name="onboarding" />
    </Drawer>
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