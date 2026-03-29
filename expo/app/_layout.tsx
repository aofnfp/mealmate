import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { requestTrackingPermission } from '@/lib/tracking';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    (async () => {
      await SplashScreen.hideAsync();
      if (Platform.OS !== 'web') {
        StatusBar.setBarStyle('dark-content');
        await requestTrackingPermission();
      }
    })();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="recipe/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="history" options={{ presentation: 'card' }} />
        <Stack.Screen name="privacy" options={{ presentation: 'card' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
