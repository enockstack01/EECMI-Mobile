import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { SocialAuth } from '@/components/social-auth';
import { BrandMark } from '@/components/ui/brand-mark';
import { Button } from '@/components/ui/button';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { Typography } from '@/components/ui/typography';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { clerkError } from '@/lib/clerk';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    if (!isLoaded) return;
    if (!EMAIL_RE.test(email)) return setError('Enter a valid email address.');
    if (!password) return setError('Enter your password.');
    setError(null);
    setLoading(true);
    try {
      const attempt = await signIn.create({ identifier: email.trim(), password });
      if (attempt.status === 'complete') {
        await setActive({ session: attempt.createdSessionId });
        router.replace('/');
      } else {
        setError('Additional verification is required. Please continue on the website.');
      }
    } catch (err: unknown) {
      setError(clerkError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen topInset>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.head}>
          <BrandMark size={44} tile />
          <Typography kind="h1">Welcome back</Typography>
          <Typography kind="muted">Sign in to your EECMI account.</Typography>
        </View>

        {error ? <Notice tone="error" message={error} /> : null}

        <View style={styles.form}>
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="current-password"
          />
          <View style={styles.forgotRow}>
            <Link href="/(auth)/forgot-password">
              <Typography kind="small" color={theme.primary}>Forgot password?</Typography>
            </Link>
          </View>
          <Button label="Sign in" loading={loading} onPress={onSubmit} />
        </View>

        <SocialAuth onError={setError} disabled={loading} />

        <View style={styles.foot}>
          <Typography kind="small" color={theme.textSecondary}>
            New to EECMI?{' '}
          </Typography>
          <Link href="/(auth)/sign-up">
            <Typography kind="small" color={theme.primary}>Create an account</Typography>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { gap: Spacing.two, alignItems: 'flex-start', marginBottom: Spacing.two },
  form: { gap: Spacing.three },
  forgotRow: { alignItems: 'flex-end', marginTop: -Spacing.two },
  foot: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.three, flexWrap: 'wrap' },
});
