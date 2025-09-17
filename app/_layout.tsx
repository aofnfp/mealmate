import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Drawer } from "expo-router/drawer";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { View, StatusBar, StyleSheet } from "react-native";
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
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerType: "slide",
        overlayColor: "transparent",
        drawerStyle: { 
          width: 280,
          backgroundColor: colors.surface,
        },
        swipeEnabled: true,
        drawerPosition: "left",
      }}
    >
      <Drawer.Screen 
        name="(tabs)" 
        options={{ 
          title: 'Forest',
          drawerLabel: 'Forest',
        }} 
      />
      <Drawer.Screen 
        name="challenge" 
        options={{ 
          title: 'Focus Challenge',
          drawerLabel: 'Focus Challenge',
        }} 
      />
      <Drawer.Screen 
        name="timeline" 
        options={{ 
          title: 'Timeline',
          drawerLabel: 'Timeline',
        }} 
      />
      <Drawer.Screen 
        name="tags" 
        options={{ 
          title: 'Tags',
          drawerLabel: 'Tags',
        }} 
      />
      <Drawer.Screen 
        name="friends" 
        options={{ 
          title: 'Friends',
          drawerLabel: 'Friends',
        }} 
      />

      <Drawer.Screen 
        name="store" 
        options={{ 
          title: 'Store',
          drawerLabel: 'Store',
        }} 
      />

      <Drawer.Screen 
        name="news" 
        options={{ 
          title: 'News',
          drawerLabel: 'News',
        }} 
      />

      <Drawer.Screen 
        name="onboarding" 
        options={{ 
          drawerItemStyle: { display: 'none' },
        }} 
      />


    </Drawer>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
    initAudio();
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
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
  }, [isDark]);
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <RootLayoutNav colors={colors} />
    </View>
  );
}