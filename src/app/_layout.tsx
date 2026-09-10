import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import Constants from 'expo-constants';
import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
  type Theme,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppHeader } from '@/components/ui/app-header';
import { ErrorBoundary } from '@/components/error-boundary';
import { NotificationsProvider } from '@/hooks/use-notifications';
import { Brand, Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

/**
 * The Clerk key is inlined from the build env (`EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
 * in `eas.json`) with `app.json` `extra` as a fallback, so a standalone build
 * always has it even if env inlining misses.
 */
const clerkPublishableKey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ??
  (Constants.expoConfig?.extra?.clerkPublishableKey as string | undefined);

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
  const [splashHidden, setSplashHidden] = useState(false);

  const hideSplash = useCallback(() => {
    SplashScreen.hideAsync()
      .catch(() => {})
      .finally(() => setSplashHidden(true));
  }, []);

  useEffect(() => {
    // Hide shortly after Clerk resolves, but never let the splash hang forever
    // if it stalls (bad key, no network) — the app must always become usable.
    const delay = isLoaded ? 150 : 3000;
    const timer = setTimeout(hideSplash, delay);
    return () => clearTimeout(timer);
  }, [isLoaded, hideSplash]);

  if (!isLoaded) {
    if (!splashHidden) return null;
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors[scheme].background,
        }}>
        <ActivityIndicator color={Colors[scheme].primary} />
      </View>
    );
  }

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
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
          <NotificationsProvider>
            <RootNavigator />
          </NotificationsProvider>
        </ClerkProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
