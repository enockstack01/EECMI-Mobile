import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
  type Theme,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Brand, Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

function navTheme(scheme: 'light' | 'dark'): Theme {
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const c = Colors[scheme];
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: c.primary,
      background: c.background,
      card: c.background,
      text: c.text,
      border: c.border,
      notification: Brand.gold,
    },
  };
}

export default function RootLayout() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    const timer = setTimeout(() => SplashScreen.hideAsync().catch(() => {}), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={navTheme(scheme)}>
        <Stack
          screenOptions={{
            headerShown: false,
            headerTintColor: Colors[scheme].primary,
            headerStyle: { backgroundColor: Colors[scheme].background },
            contentStyle: { backgroundColor: Colors[scheme].background },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="program/[id]" options={{ headerShown: true, title: 'Program' }} />
          <Stack.Screen name="about" options={{ headerShown: true, title: 'About EECMI' }} />
          <Stack.Screen name="resources" options={{ headerShown: true, title: 'Resources' }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
