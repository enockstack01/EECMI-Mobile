import { ClerkLoaded, ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
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
import { NotificationsProvider } from '@/hooks/use-notifications';
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

function RootNavigator() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => SplashScreen.hideAsync().catch(() => {}), 150);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  if (!isLoaded) return null;

  return (
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
        <Stack.Protected guard={!!isSignedIn}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="programs" options={{ title: 'Our Programs' }} />
          <Stack.Screen name="contact" options={{ title: 'Contact' }} />
          <Stack.Screen name="program/[id]" options={{ title: 'Program' }} />
          <Stack.Screen name="devotion/[id]" options={{ title: 'Devotion' }} />
          <Stack.Screen name="news/[id]" options={{ title: 'Update' }} />
          <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
          <Stack.Screen name="about" options={{ title: 'About EECMI' }} />
          <Stack.Screen name="resources" options={{ title: 'Resources' }} />
        </Stack.Protected>
        <Stack.Protected guard={!isSignedIn}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider tokenCache={tokenCache}>
        <ClerkLoaded>
          <NotificationsProvider>
            <RootNavigator />
          </NotificationsProvider>
        </ClerkLoaded>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
