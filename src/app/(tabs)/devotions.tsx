import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChipGroup } from '@/components/ui/chip-group';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { Typography } from '@/components/ui/typography';
import { Brand, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ApiError, getDevotions, type Devotion } from '@/lib/api';

const TYPE_ICON: Record<Devotion['type'], keyof typeof Ionicons.glyphMap> = {
  text: 'book-outline',
  pdf: 'document-text-outline',
  audio: 'headset-outline',
  video: 'videocam-outline',
  link: 'link-outline',
};

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; devotions: Devotion[] };

export default function DevotionsScreen() {
  const theme = useTheme();
  const [state, setState] = useState<State>({ status: 'loading' });
  const [refreshing, setRefreshing] = useState(false);
  const [series, setSeries] = useState('All');

  const load = useCallback(async () => {
    try {
      const res = await getDevotions();
      setState({ status: 'ready', devotions: res.data ?? [] });
    } catch (err) {
      setState({
        status: 'error',
        message: err instanceof ApiError ? err.message : 'Could not load devotions. Pull down to try again.',
      });
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const seriesList = useMemo(() => {
    if (state.status !== 'ready') return ['All'];
    return ['All', ...Array.from(new Set(state.devotions.map((d) => d.series).filter(Boolean) as string[]))];
  }, [state]);

  const filtered = state.status === 'ready'
    ? (series === 'All' ? state.devotions : state.devotions.filter((d) => d.series === series))
    : [];

  return (
    <Screen
      scroll
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}>
      <SectionHeader
        eyebrow="Grow With Us"
        title="Devotion Materials"
        subtitle="Daily readings, studies, and audio to walk with Christ."
      />

      {state.status === 'loading' ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.primary} />
          <Typography kind="muted">Loading devotions…</Typography>
        </View>
      ) : null}

      {state.status === 'error' ? (
        <View style={styles.stateBlock}>
          <Notice tone="error" message={state.message} />
          <Button label="Try again" variant="outline" onPress={load} />
        </View>
      ) : null}

      {state.status === 'ready' && seriesList.length > 1 ? (
        <ChipGroup options={seriesList} selected={[series]} single onChange={(n) => setSeries(n[0] ?? 'All')} />
      ) : null}

      {state.status === 'ready' && filtered.length === 0 ? (
        <Card style={styles.center}>
          <Ionicons name="book-outline" size={28} color={theme.textSecondary} />
          <Typography kind="muted" center>No devotion materials have been published yet. Check back soon.</Typography>
        </Card>
      ) : null}

      {filtered.map((d) => (
        <Card
          key={d.id}
          accent={Brand.forest}
          onPress={() => router.push({ pathname: '/devotion/[id]', params: { id: d.id } })}>
          <View style={styles.rowTop}>
            <View style={[styles.iconWrap, { backgroundColor: theme.backgroundElement }]}>
              <Ionicons name={TYPE_ICON[d.type] ?? 'book-outline'} size={16} color={theme.primary} />
            </View>
            <Typography kind="eyebrow" color={theme.primary} style={styles.series}>{d.series || 'Devotion'}</Typography>
          </View>
          <Typography kind="h3">{d.title}</Typography>
          {d.scriptureRef ? <Typography kind="small" color={theme.accent}>{d.scriptureRef}</Typography> : null}
          {d.description ? <Typography kind="muted">{d.description}</Typography> : null}
          <View style={styles.link}>
            <Ionicons name="arrow-forward" size={14} color={theme.primary} />
            <Typography kind="small" color={theme.primary}>Open</Typography>
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.five },
  stateBlock: { gap: Spacing.three },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  iconWrap: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  series: { flex: 1 },
  link: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, marginTop: Spacing.one },
});
