import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChipGroup } from '@/components/ui/chip-group';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { Segmented } from '@/components/ui/segmented';
import { TextField } from '@/components/ui/text-field';
import { Typography } from '@/components/ui/typography';
import { Radius, Spacing } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { useTheme } from '@/hooks/use-theme';
import type { ActivityItem, Devotion, MeProfile } from '@/lib/api';

const INTERESTS = [
  'Prison Ministry', 'Women Empowerment', 'Children Support', 'Youth Empowerment',
  'Family Strengthening', 'Community Outreach', 'Devotions', 'Volunteering', 'Prayer',
];

type Tab = 'profile' | 'activity' | 'saved';

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function AccountScreen() {
  const theme = useTheme();
  const api = useApi();
  const { signOut } = useAuth();
  const { user } = useUser();

  const [tab, setTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState<MeProfile | null>(null);
  const [form, setForm] = useState({ phone: '', location: '', interests: [] as string[], notifyInApp: true });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ tone: 'success' | 'error'; message: string } | null>(null);
  const [activity, setActivity] = useState<ActivityItem[] | null>(null);
  const [saved, setSaved] = useState<Devotion[] | null>(null);

  useEffect(() => {
    api.getMe()
      .then((d) => {
        if (!d.data) return;
        setProfile(d.data);
        setForm({
          phone: d.data.phone || '', location: d.data.location || '',
          interests: d.data.interests || [], notifyInApp: d.data.notifyInApp !== false,
        });
      })
      .catch(() => {});
  }, [api]);

  const loadActivity = useCallback(() => {
    api.getMyActivity().then((d) => setActivity(d.data ?? [])).catch(() => setActivity([]));
  }, [api]);
  const loadSaved = useCallback(() => {
    api.getSavedDevotions().then((d) => setSaved(d.data ?? [])).catch(() => setSaved([]));
  }, [api]);

  useEffect(() => {
    if (tab === 'activity' && activity === null) loadActivity();
    if (tab === 'saved' && saved === null) loadSaved();
  }, [tab, activity, saved, loadActivity, loadSaved]);

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await api.patchMe(form);
      setMsg({ tone: 'success', message: 'Saved.' });
    } catch (err) {
      setMsg({ tone: 'error', message: err instanceof Error ? err.message : 'Could not save.' });
    } finally {
      setSaving(false);
    }
  };

  const name = user?.firstName || user?.fullName || profile?.name || 'Friend';

  return (
    <Screen scroll>
      <View style={styles.profileRow}>
        {user?.imageUrl ? (
          <Image source={{ uri: user.imageUrl }} style={styles.avatar} contentFit="cover" />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: theme.primary }]}>
            <Typography kind="h2" color={theme.onPrimary}>{name.charAt(0)}</Typography>
          </View>
        )}
        <View style={styles.profileText}>
          <Typography kind="h2">{name}</Typography>
          <Typography kind="small" color={theme.textSecondary}>
            {profile?.email || user?.primaryEmailAddress?.emailAddress}
          </Typography>
        </View>
      </View>

      <Segmented<Tab>
        value={tab}
        onChange={setTab}
        options={[
          { value: 'profile', label: 'Profile' },
          { value: 'activity', label: 'Activity' },
          { value: 'saved', label: 'Saved' },
        ]}
      />

      {tab === 'profile' ? (
        <View style={styles.block}>
          {msg ? <Notice tone={msg.tone} message={msg.message} /> : null}
          <TextField label="Phone" value={form.phone} onChangeText={(v) => setForm((f) => ({ ...f, phone: v }))} keyboardType="phone-pad" />
          <TextField label="Location" value={form.location} onChangeText={(v) => setForm((f) => ({ ...f, location: v }))} />
          <ChipGroup
            label="Interests"
            options={INTERESTS}
            selected={form.interests}
            onChange={(next) => setForm((f) => ({ ...f, interests: next }))}
          />
          <Pressable
            onPress={() => setForm((f) => ({ ...f, notifyInApp: !f.notifyInApp }))}
            style={styles.toggleRow}>
            <Ionicons
              name={form.notifyInApp ? 'checkbox' : 'square-outline'}
              size={22}
              color={form.notifyInApp ? theme.primary : theme.textSecondary}
            />
            <Typography kind="small" style={styles.toggleLabel}>
              Show in-app notifications for new devotions and updates
            </Typography>
          </Pressable>
          <Button label="Save changes" loading={saving} onPress={save} />
        </View>
      ) : null}

      {tab === 'activity' ? (
        <View style={styles.block}>
          <SectionHeader eyebrow="Your history" title="Activity" />
          {activity === null ? <ActivityIndicator color={theme.primary} /> : null}
          {activity && activity.length === 0 ? (
            <Typography kind="muted">
              Nothing yet. When you volunteer, partner, send a prayer request or a message it shows up here.
            </Typography>
          ) : null}
          {(activity ?? []).map((a) => (
            <Card key={`${a.kind}-${a.id}`}>
              <View style={styles.actRow}>
                <View style={styles.actText}>
                  <Typography kind="eyebrow" color={theme.primary}>{a.kind}</Typography>
                  <Typography kind="small">{a.title}</Typography>
                </View>
                <View style={styles.actMeta}>
                  <Typography kind="small" color={theme.textSecondary}>{a.status}</Typography>
                  <Typography kind="small" color={theme.textSecondary}>{fmtDate(a.createdAt)}</Typography>
                </View>
              </View>
            </Card>
          ))}
        </View>
      ) : null}

      {tab === 'saved' ? (
        <View style={styles.block}>
          <SectionHeader eyebrow="Bookmarks" title="Saved devotions" />
          {saved === null ? <ActivityIndicator color={theme.primary} /> : null}
          {saved && saved.length === 0 ? (
            <Typography kind="muted">Open a devotion and tap Save to keep it here.</Typography>
          ) : null}
          {(saved ?? []).map((d) => (
            <Card key={d.id} onPress={() => router.push({ pathname: '/devotion/[id]', params: { id: d.id } })}>
              <Typography kind="eyebrow" color={theme.primary}>{d.series || 'Devotion'}</Typography>
              <Typography kind="h3">{d.title}</Typography>
            </Card>
          ))}
        </View>
      ) : null}

      <Card style={styles.footer}>
        <Button label="Notifications" variant="outline" icon="notifications-outline" onPress={() => router.push('/notifications')} />
        <Button label="Sign out" variant="ghost" icon="log-out-outline" onPress={() => signOut()} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  avatarFallback: { alignItems: 'center', justifyContent: 'center' },
  profileText: { flex: 1, gap: 2 },
  block: { gap: Spacing.three },
  toggleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  toggleLabel: { flex: 1 },
  actRow: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.two },
  actText: { flex: 1, gap: 2 },
  actMeta: { alignItems: 'flex-end', gap: 2 },
  footer: { gap: Spacing.two, borderRadius: Radius.md },
});
