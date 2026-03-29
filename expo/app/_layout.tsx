import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import React, { useEffect, useCallback } from 'react';
import { StatusBar, Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { requestTrackingPermission } from '@/lib/tracking';
import { ErrorBoundary } from '@/components/ErrorBoundary';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'DM Sans': require('../assets/fonts/DMSans-Regular.ttf'),
    'DM Sans_500': require('../assets/fonts/DMSans-Medium.ttf'),
    'DM Sans_600': require('../assets/fonts/DMSans-SemiBold.ttf'),
    'DM Sans_700': require('../assets/fonts/DMSans-Bold.ttf'),
    'DM Serif Display': require('../assets/fonts/DMSerifDisplay-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      StatusBar.setBarStyle('dark-content');
      requestTrackingPermission();
    }
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
          <Stack.Screen name="recipe/[id]" options={{ presentation: 'card' }} />
          <Stack.Screen name="history" options={{ presentation: 'card' }} />
          <Stack.Screen name="privacy" options={{ presentation: 'card' }} />
        </Stack>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
