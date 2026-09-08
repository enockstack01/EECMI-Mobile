import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Switch,
  View,
} from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChipGroup } from '@/components/ui/chip-group';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { Segmented } from '@/components/ui/segmented';
import { TextField } from '@/components/ui/text-field';
import { Typography } from '@/components/ui/typography';
import { PartnerTypes, VolunteerAreas } from '@/constants/content';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  ApiError,
  registerVolunteer,
  submitPartner,
  submitPrayer,
} from '@/lib/api';

type Mode = 'volunteer' | 'partner' | 'pray';
type Status = { tone: 'success' | 'error'; message: string } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function InvolvedScreen() {
  const [mode, setMode] = useState<Mode>('volunteer');

  return (
    <Screen topInset>
      <SectionHeader
        eyebrow="Get Involved"
        title="Partner With the Mission"
        subtitle="Give your time, join hands as an organization, or send us a prayer request."
      />

      <Segmented<Mode>
        value={mode}
        onChange={setMode}
        options={[
          { value: 'volunteer', label: 'Volunteer' },
          { value: 'partner', label: 'Partner' },
          { value: 'pray', label: 'Pray' },
        ]}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {mode === 'volunteer' ? <VolunteerForm /> : null}
        {mode === 'partner' ? <PartnerForm /> : null}
        {mode === 'pray' ? <PrayerForm /> : null}
      </KeyboardAvoidingView>
    </Screen>
  );
}

function VolunteerForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [areas, setAreas] = useState<string[]>([]);
  const [availability, setAvailability] = useState('');
  const [motivation, setMotivation] = useState('');
  const [status, setStatus] = useState<Status>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  async function onSubmit() {
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = 'Your name is required.';
    if (!EMAIL_RE.test(email)) nextErrors.email = 'Enter a valid email address.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    setStatus(null);
    try {
      const res = await registerVolunteer({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        location: location.trim() || undefined,
        areas,
        availability: availability.trim() || undefined,
        motivation: motivation.trim() || undefined,
      });
      setStatus({ tone: 'success', message: res.message ?? 'Thank you for volunteering!' });
      setName('');
      setEmail('');
      setPhone('');
      setLocation('');
      setAreas([]);
      setAvailability('');
      setMotivation('');
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
    <Card style={styles.form}>
      <Typography kind="h3">Volunteer application</Typography>
      {status ? <Notice tone={status.tone} message={status.message} /> : null}
      <TextField label="Full name" required value={name} onChangeText={setName} error={errors.name} />
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
      <TextField label="Location" value={location} onChangeText={setLocation} />
      <ChipGroup
        label="Areas of interest"
        options={VolunteerAreas}
        selected={areas}
        onChange={setAreas}
      />
      <TextField
        label="Availability"
        value={availability}
        onChangeText={setAvailability}
        placeholder="e.g. Weekends, evenings"
      />
      <TextField
        label="Why do you want to volunteer?"
        value={motivation}
        onChangeText={setMotivation}
        multiline
      />
      <Button label="Submit application" loading={loading} onPress={onSubmit} />
    </Card>
  );
}

function PartnerForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [partnerType, setPartnerType] = useState<string[]>([]);
  const [partnershipAreas, setPartnershipAreas] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  async function onSubmit() {
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = 'Your name is required.';
    if (!EMAIL_RE.test(email)) nextErrors.email = 'Enter a valid email address.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    setStatus(null);
    try {
      const res = await submitPartner({
        name: name.trim(),
        email: email.trim(),
        organization: organization.trim() || undefined,
        partnerType: partnerType[0],
        partnershipAreas: partnershipAreas.trim() || undefined,
        message: message.trim() || undefined,
      });
      setStatus({
        tone: 'success',
        message: res.message ?? 'Thank you for your interest in partnering with EECMI.',
      });
      setName('');
      setEmail('');
      setOrganization('');
      setPartnerType([]);
      setPartnershipAreas('');
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
    <Card style={styles.form}>
      <Typography kind="h3">Partnership enquiry</Typography>
      {status ? <Notice tone={status.tone} message={status.message} /> : null}
      <TextField label="Contact name" required value={name} onChangeText={setName} error={errors.name} />
      <TextField
        label="Email"
        required
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextField label="Organization" value={organization} onChangeText={setOrganization} />
      <ChipGroup
        label="Partner type"
        options={PartnerTypes}
        selected={partnerType}
        onChange={setPartnerType}
        single
      />
      <TextField
        label="Areas of partnership"
        value={partnershipAreas}
        onChangeText={setPartnershipAreas}
        placeholder="e.g. Prison ministry, funding, training"
      />
      <TextField label="Message" value={message} onChangeText={setMessage} multiline />
      <Button label="Send enquiry" loading={loading} onPress={onSubmit} />
    </Card>
  );
}

function PrayerForm() {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [request, setRequest] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function onSubmit() {
    if (request.trim().length < 5) {
      setError('Please share a little more about your request.');
      return;
    }
    setError(undefined);
    setLoading(true);
    setStatus(null);
    try {
      const res = await submitPrayer({
        name: isAnonymous ? undefined : name.trim() || undefined,
        email: email.trim() || undefined,
        request: request.trim(),
        isAnonymous,
        isPublic,
      });
      setStatus({
        tone: 'success',
        message: res.message ?? 'Your prayer request has been received. Our team is praying with you.',
      });
      setName('');
      setEmail('');
      setRequest('');
      setIsAnonymous(false);
      setIsPublic(false);
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
    <Card style={styles.form}>
      <Typography kind="h3">Prayer request</Typography>
      {status ? <Notice tone={status.tone} message={status.message} /> : null}
      <TextField
        label="Name"
        value={name}
        onChangeText={setName}
        editable={!isAnonymous}
        placeholder={isAnonymous ? 'Submitting anonymously' : undefined}
      />
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextField
        label="Your request"
        required
        value={request}
        onChangeText={setRequest}
        error={error}
        multiline
      />
      <View style={styles.toggleRow}>
        <Typography kind="small" style={styles.toggleLabel}>
          Submit anonymously
        </Typography>
        <Switch
          value={isAnonymous}
          onValueChange={setIsAnonymous}
          trackColor={{ true: theme.primary }}
        />
      </View>
      <View style={styles.toggleRow}>
        <Typography kind="small" style={styles.toggleLabel}>
          Share on the public prayer wall
        </Typography>
        <Switch value={isPublic} onValueChange={setIsPublic} trackColor={{ true: theme.primary }} />
      </View>
      <Button label="Send prayer request" icon="heart" loading={loading} onPress={onSubmit} />
    </Card>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing.three, paddingVertical: Spacing.four },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  toggleLabel: { flex: 1 },
});
