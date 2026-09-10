import { useSSO } from '@clerk/clerk-expo';
import type { OAuthStrategy } from '@clerk/types';
import * as AuthSession from 'expo-auth-session';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { clerkError } from '@/lib/clerk';

// Finishes any auth session that was pending when the app was backgrounded.
WebBrowser.maybeCompleteAuthSession();

type Props = {
  /** Surfaces a provider error to the parent screen's notice area. */
  onError: (message: string) => void;
  /** Disable while the parent form is mid-submit. */
  disabled?: boolean;
};

/** "Continue with Google / Apple" — Clerk hosted OAuth via an in-app browser. */
export function SocialAuth({ onError, disabled }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const { startSSOFlow } = useSSO();
  const [busy, setBusy] = useState<OAuthStrategy | null>(null);

  // Pre-warming the browser makes the OAuth sheet open noticeably faster on Android.
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  const start = useCallback(
    async (strategy: OAuthStrategy) => {
      if (busy) return;
      onError('');
      setBusy(strategy);
      try {
        const { createdSessionId, setActive } = await startSSOFlow({
          strategy,
          redirectUrl: AuthSession.makeRedirectUri({ path: 'sso-callback' }),
        });
        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId });
          router.replace('/');
        } else {
          onError('Sign in was cancelled before it finished.');
        }
      } catch (err) {
        onError(clerkError(err));
      } finally {
        setBusy(null);
      }
    },
    [busy, startSSOFlow, router, onError],
  );

  return (
    <View style={styles.wrap}>
      <View style={styles.dividerRow}>
        <View style={[styles.line, { backgroundColor: theme.border }]} />
        <Typography kind="small" color={theme.textSecondary}>
          or
        </Typography>
        <View style={[styles.line, { backgroundColor: theme.border }]} />
      </View>

      <Button
        label="Continue with Google"
        icon="logo-google"
        variant="outline"
        loading={busy === 'oauth_google'}
        disabled={disabled || busy !== null}
        onPress={() => start('oauth_google')}
      />

      {Platform.OS === 'ios' ? (
        <Button
          label="Continue with Apple"
          icon="logo-apple"
          variant="outline"
          loading={busy === 'oauth_apple'}
          disabled={disabled || busy !== null}
          onPress={() => start('oauth_apple')}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.three },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  line: { flex: 1, height: StyleSheet.hairlineWidth },
});
