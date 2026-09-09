import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { TextField } from '@/components/ui/text-field';
import { Typography } from '@/components/ui/typography';
import { Org } from '@/constants/content';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ApiError, subscribeNewsletter, submitContact } from '@/lib/api';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type Status = { tone: 'success' | 'error'; message: string } | null;

const CONTACT_METHODS: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  url: string;
}[] = [
  { icon: 'call', label: 'Phone', value: Org.phone, url: `tel:${Org.phoneDial}` },
  { icon: 'logo-whatsapp', label: 'WhatsApp', value: Org.phone, url: Org.whatsapp },
  { icon: 'mail', label: 'Email', value: Org.email, url: `mailto:${Org.email}` },
  { icon: 'globe', label: 'Website', value: 'eecmi-platform.onrender.com', url: Org.website },
];

export default function ContactScreen() {
  const theme = useTheme();

  return (
    <Screen>
      <SectionHeader
        eyebrow="Contact"
        title="Reach the EECMI Team"
        subtitle={`Based in ${Org.location}. We respond as quickly as we can.`}
      />

      <Card>
        {CONTACT_METHODS.map((method, index) => (
          <Pressable
            key={method.label}
            accessibilityRole="link"
            onPress={() => Linking.openURL(method.url).catch(() => {})}
            style={[
              styles.methodRow,
              index < CONTACT_METHODS.length - 1 && {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: theme.border,
              },
            ]}>
            <View style={[styles.methodIcon, { backgroundColor: theme.backgroundElement }]}>
              <Ionicons name={method.icon} size={18} color={theme.primary} />
            </View>
            <View style={styles.methodText}>
              <Typography kind="small" color={theme.textSecondary}>
                {method.label}
              </Typography>
              <Typography kind="body">{method.value}</Typography>
            </View>
            <Ionicons name="open-outline" size={16} color={theme.textSecondary} />
          </Pressable>
        ))}
      </Card>

      <ContactForm />

      <NewsletterCard />

      <Card onPress={() => router.push('/about')}>
        <View style={styles.aboutLink}>
          <Ionicons name="information-circle" size={22} color={theme.primary} />
          <View style={styles.aboutLinkText}>
            <Typography kind="h3">About EECMI</Typography>
            <Typography kind="small">Vision, mission, values, and leadership</Typography>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
        </View>
      </Card>
    </Screen>
  );
}

function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  async function onSubmit() {
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = 'Your name is required.';
    if (!EMAIL_RE.test(email)) nextErrors.email = 'Enter a valid email address.';
    if (message.trim().length < 5) nextErrors.message = 'Please include a short message.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    setStatus(null);
    try {
      const res = await submitContact({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        subject: subject.trim() || undefined,
        message: message.trim(),
      });
      setStatus({ tone: 'success', message: res.message ?? 'Message received. We will respond shortly.' });
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setStatus({
        tone: 'error',
        message: err instanceof ApiError ? err.message : 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Card style={styles.form}>
        <Typography kind="h3">Send a message</Typography>
        {status ? <Notice tone={status.tone} message={status.message} /> : null}
        <TextField label="Name" required value={name} onChangeText={setName} error={errors.name} />
        <TextField
          label="Email"
          required
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextField label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TextField label="Subject" value={subject} onChangeText={setSubject} />
        <TextField
          label="Message"
          required
          value={message}
          onChangeText={setMessage}
          error={errors.message}
          multiline
        />
        <Button label="Send message" loading={loading} onPress={onSubmit} />
      </Card>
    </KeyboardAvoidingView>
  );
}

function NewsletterCard() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (!EMAIL_RE.test(email)) {
      setStatus({ tone: 'error', message: 'Enter a valid email address.' });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const res = await subscribeNewsletter(email.trim());
      setStatus({ tone: 'success', message: res.message ?? 'You are subscribed. Thank you!' });
      setEmail('');
    } catch (err) {
      setStatus({
        tone: 'error',
        message: err instanceof ApiError ? err.message : 'Subscription failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card style={styles.form}>
      <Typography kind="h3">Newsletter</Typography>
      <Typography kind="muted">Get ministry updates and stories from the field.</Typography>
      {status ? <Notice tone={status.tone} message={status.message} /> : null}
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Button label="Subscribe" variant="outline" loading={loading} onPress={onSubmit} />
    </Card>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing.three, paddingVertical: Spacing.four },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  methodIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodText: { flex: 1, gap: 2 },
  aboutLink: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  aboutLinkText: { flex: 1, gap: 2 },
});
