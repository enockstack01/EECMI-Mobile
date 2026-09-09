import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Typography } from '@/components/ui/typography';
import { Spacing } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { useNotifications } from '@/hooks/use-notifications';
import { useTheme } from '@/hooks/use-theme';
import type { AppNotification } from '@/lib/api';

const TYPE_LABEL: Record<AppNotification['type'], string> = {
  update: 'Update', devotion: 'Devotion', system: 'Notice',
};

function timeAgo(date: string) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function NotificationsScreen() {
  const theme = useTheme();
  const api = useApi();
  const { refresh } = useNotifications();
  const [items, setItems] = useState<AppNotification[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await api.getNotifications();
      setItems(res.data ?? []);
    } catch {
      setItems([]);
    }
  }, [api]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    await refresh();
    setRefreshing(false);
  }, [load, refresh]);

  const markAll = useCallback(async () => {
    try {
      await api.markNotificationsRead();
      setItems((prev) => prev?.map((n) => ({ ...n, read: true })) ?? null);
      refresh();
    } catch {
      /* ignore */
    }
  }, [api, refresh]);

  const openItem = useCallback(async (n: AppNotification) => {
    if (!n.read) {
      api.markNotificationsRead([n.id]).then(() => refresh()).catch(() => {});
      setItems((prev) => prev?.map((x) => (x.id === n.id ? { ...x, read: true } : x)) ?? null);
    }
    if (n.linkPath) {
      // linkPath is a web path (e.g. /devotions/<id>); map to the app route.
      const m = n.linkPath.match(/^\/(devotions|news)\/(.+)$/);
      if (m) {
        router.push(m[1] === 'devotions'
          ? { pathname: '/devotion/[id]', params: { id: m[2] } }
          : { pathname: '/news/[id]', params: { id: m[2] } });
      }
    }
  }, [api, refresh]);

  const hasUnread = (items ?? []).some((n) => !n.read);

  return (
    <Screen
      scroll
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}>
      <Stack.Screen options={{ title: 'Notifications' }} />

      {hasUnread ? (
        <Button label="Mark all read" variant="outline" icon="checkmark-done-outline" onPress={markAll} />
      ) : null}

      {items === null ? (
        <View style={styles.center}><ActivityIndicator color={theme.primary} /></View>
      ) : null}

      {items && items.length === 0 ? (
        <Card style={styles.center}>
          <Ionicons name="notifications-outline" size={26} color={theme.textSecondary} />
          <Typography kind="muted" center>You have no notifications yet.</Typography>
        </Card>
      ) : null}

      {(items ?? []).map((n) => (
        <Card
          key={n.id}
          accent={n.read ? theme.border : theme.primary}
          onPress={n.linkPath ? () => openItem(n) : undefined}>
          <View style={styles.row}>
            <Typography kind="eyebrow" color={theme.primary}>{TYPE_LABEL[n.type]}</Typography>
            <Typography kind="small" color={theme.textSecondary}>{timeAgo(n.createdAt)}</Typography>
          </View>
          <Typography kind="h3">{n.title}</Typography>
          {n.body ? <Typography kind="muted">{n.body}</Typography> : null}
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.five },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
