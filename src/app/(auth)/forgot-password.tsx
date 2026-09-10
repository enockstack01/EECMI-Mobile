import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

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

export default function ForgotPasswordScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const theme = useTheme();

  const [stage, setStage] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onRequest() {
    if (!isLoaded) return;
    if (!EMAIL_RE.test(email)) return setError('Enter a valid email address.');
    setError(null);
    setLoading(true);
    try {
      await signIn.create({ strategy: 'reset_password_email_code', identifier: email.trim() });
      setStage('reset');
    } catch (err) {
      setError(clerkError(err));
    } finally {
      setLoading(false);
    }
  }

  async function onReset() {
    if (!isLoaded) return;
    if (!code.trim()) return setError('Enter the 6 digit code from your email.');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    setError(null);
    setLoading(true);
    try {
      const attempt = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code.trim(),
        password,
      });
      if (attempt.status === 'complete') {
        await setActive({ session: attempt.createdSessionId });
        router.replace('/');
      } else {
        setError('Could not reset your password. Please request a new code and try again.');
      }
    } catch (err) {
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
          <Typography kind="h1">
            {stage === 'request' ? 'Reset your password' : 'Choose a new password'}
          </Typography>
          <Typography kind="muted">
            {stage === 'request'
              ? 'Enter your account email and we will send you a reset code.'
              : `Enter the 6 digit code we sent to ${email}, then set a new password.`}
          </Typography>
        </View>

        {error ? <Notice tone="error" message={error} /> : null}

        {stage === 'request' ? (
          <View style={styles.form}>
            <TextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
            <Button label="Send reset code" loading={loading} onPress={onRequest} />
          </View>
        ) : (
          <View style={styles.form}>
            <TextField
              label="Reset code"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              autoComplete="one-time-code"
            />
            <TextField
              label="New password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
            />
            <Button label="Set new password" loading={loading} onPress={onReset} />
            <Button
              label="Use a different email"
              variant="ghost"
              onPress={() => {
                setStage('request');
                setCode('');
                setPassword('');
                setError(null);
              }}
            />
          </View>
        )}

        <View style={styles.foot}>
          <Link href="/(auth)/sign-in">
            <Typography kind="small" color={theme.primary}>
              Back to sign in
            </Typography>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { gap: Spacing.two, alignItems: 'flex-start', marginBottom: Spacing.two },
  form: { gap: Spacing.three },
  foot: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.three },
});
