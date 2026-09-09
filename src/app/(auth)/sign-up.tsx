import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { clerkError } from '@/app/(auth)/sign-in';
import { BrandMark } from '@/components/ui/brand-mark';
import { Button } from '@/components/ui/button';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { Typography } from '@/components/ui/typography';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();
  const theme = useTheme();

  const [stage, setStage] = useState<'form' | 'verify'>('form');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    if (!isLoaded) return;
    if (!firstName.trim()) return setError('Enter your name.');
    if (!EMAIL_RE.test(email)) return setError('Enter a valid email address.');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    setError(null);
    setLoading(true);
    try {
      await signUp.create({ firstName: firstName.trim(), emailAddress: email.trim(), password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setStage('verify');
    } catch (err) {
      setError(clerkError(err));
    } finally {
      setLoading(false);
    }
  }

  async function onVerify() {
    if (!isLoaded) return;
    if (!code.trim()) return setError('Enter the 6 digit code from your email.');
    setError(null);
    setLoading(true);
    try {
      const attempt = await signUp.attemptEmailAddressVerification({ code: code.trim() });
      if (attempt.status === 'complete') {
        await setActive({ session: attempt.createdSessionId });
        router.replace('/');
      } else {
        setError('That code did not work. Please check and try again.');
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
          <Typography kind="h1">{stage === 'form' ? 'Create your account' : 'Verify your email'}</Typography>
          <Typography kind="muted">
            {stage === 'form'
              ? 'Join EECMI to save devotions and follow updates.'
              : `We sent a 6 digit code to ${email}.`}
          </Typography>
        </View>

        {error ? <Notice tone="error" message={error} /> : null}

        {stage === 'form' ? (
          <View style={styles.form}>
            <TextField label="First name" value={firstName} onChangeText={setFirstName} autoComplete="name" />
            <TextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
            <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="new-password" />
            <Button label="Create account" loading={loading} onPress={onSubmit} />
          </View>
        ) : (
          <View style={styles.form}>
            <TextField
              label="Verification code"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              autoComplete="one-time-code"
            />
            <Button label="Verify & continue" loading={loading} onPress={onVerify} />
            <Button label="Back" variant="ghost" onPress={() => { setStage('form'); setError(null); }} />
          </View>
        )}

        <View style={styles.foot}>
          <Typography kind="small" color={theme.textSecondary}>Already have an account? </Typography>
          <Link href="/(auth)/sign-in">
            <Typography kind="small" color={theme.primary}>Sign in</Typography>
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
