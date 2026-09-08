import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Linking, RefreshControl, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Notice } from '@/components/ui/notice';
import { Pill } from '@/components/ui/pill';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { Typography } from '@/components/ui/typography';
import { Brand, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ApiError, getResources, type Resource } from '@/lib/api';

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; resources: Resource[] };

export default function ResourcesScreen() {
  const theme = useTheme();
  const [state, setState] = useState<State>({ status: 'loading' });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await getResources();
      setState({ status: 'ready', resources: res.data ?? [] });
    } catch (err) {
      setState({
        status: 'error',
        message:
          err instanceof ApiError
            ? err.message
            : 'Could not load resources. Pull down to try again.',
      });
    }
  }, []);

  useEffect(() => {
    // Fetch once on mount; state updates happen after the awaited request, not
    // synchronously, so this does not cause cascading renders.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  return (
    <Screen
      scroll
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
      }>
      <Stack.Screen options={{ title: 'Resources' }} />

      <SectionHeader
        eyebrow="Library"
        title="Resources & Downloads"
        subtitle="Reports, guides, and materials published by EECMI."
      />

      {state.status === 'loading' ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.primary} />
          <Typography kind="muted">Loading resources…</Typography>
        </View>
      ) : null}

      {state.status === 'error' ? (
        <View style={styles.stateBlock}>
          <Notice tone="error" message={state.message} />
          <Button label="Try again" variant="outline" onPress={load} />
        </View>
      ) : null}

      {state.status === 'ready' && state.resources.length === 0 ? (
        <Card style={styles.center}>
          <Ionicons name="folder-open-outline" size={28} color={theme.textSecondary} />
          <Typography kind="muted" center>
            No resources have been published yet. Check back soon.
          </Typography>
        </Card>
      ) : null}

      {state.status === 'ready'
        ? state.resources.map((resource) => {
            const url = resource.externalUrl || resource.fileUrl;
            return (
              <Card
                key={resource.id}
                accent={Brand.forest}
                onPress={url ? () => Linking.openURL(url).catch(() => {}) : undefined}>
                <View style={styles.rowTop}>
                  <Pill label={resource.type || 'Resource'} color={Brand.forest} />
                  {resource.year ? (
                    <Typography kind="small" color={theme.textSecondary}>
                      {resource.year}
                    </Typography>
                  ) : null}
                </View>
                <Typography kind="h3">{resource.title}</Typography>
                {resource.description ? (
                  <Typography kind="muted">{resource.description}</Typography>
                ) : null}
                {url ? (
                  <View style={styles.link}>
                    <Ionicons
                      name={resource.externalUrl ? 'open-outline' : 'download-outline'}
                      size={15}
                      color={theme.primary}
                    />
                    <Typography kind="small" color={theme.primary}>
                      {resource.externalUrl ? 'Open link' : 'Download'}
                    </Typography>
                  </View>
                ) : null}
              </Card>
            );
          })
        : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.five },
  stateBlock: { gap: Spacing.three },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  link: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, marginTop: Spacing.one },
});
