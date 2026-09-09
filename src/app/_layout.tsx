import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
  type Theme,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppHeader } from '@/components/ui/app-header';
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
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: true,
            contentStyle: { backgroundColor: Colors[scheme].background },
            header: ({ options, navigation, back }) => (
              <AppHeader
                variant="stack"
                title={options.title}
                onBack={back ? navigation.goBack : undefined}
              />
            ),
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="program/[id]" options={{ title: 'Program' }} />
          <Stack.Screen name="about" options={{ title: 'About EECMI' }} />
          <Stack.Screen name="resources" options={{ title: 'Resources' }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
