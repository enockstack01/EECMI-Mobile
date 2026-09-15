import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import { Directory, File, Paths } from 'expo-file-system';
import { Image } from 'expo-image';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { Typography } from '@/components/ui/typography';
import { Radius, Spacing } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { useTheme } from '@/hooks/use-theme';
import { ApiError, getDevotion, recordDevotionDownload, type Devotion } from '@/lib/api';

const safeName = (id: string, url: string) => {
  const ext = url.split('?')[0].split('.').pop()?.slice(0, 4) || 'dat';
  return `devotion-${id}.${ext}`;
};

export default function DevotionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isSignedIn } = useAuth();
  const api = useApi();
  const theme = useTheme();

  const [devotion, setDevotion] = useState<Devotion | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const player = useAudioPlayer(localUri ?? devotion?.fileUrl ?? devotion?.externalUrl ?? null);

  const load = useCallback(async () => {
    try {
      const res = await getDevotion(id);
      setDevotion(res.data ?? null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load this devotion.');
      setDevotion(null);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  // Check for an already-downloaded copy.
  useEffect(() => {
    if (!devotion) return;
    const url = devotion.fileUrl || devotion.externalUrl;
    if (!url) return;
    try {
      const file = new File(Paths.document, safeName(devotion.id, url));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (file.exists) setLocalUri(file.uri);
    } catch {
      /* ignore */
    }
  }, [devotion]);

  useEffect(() => {
    if (!isSignedIn || !devotion) return;
    api.getSavedDevotions()
      .then((d) => setSaved((d.data ?? []).some((x) => x.id === devotion.id)))
      .catch(() => {});
  }, [isSignedIn, devotion, api]);

  const download = useCallback(async () => {
    if (!devotion) return;
    const url = devotion.fileUrl || devotion.externalUrl;
    if (!url) return;
    setBusy(true);
    try {
      const target = new File(Paths.document, safeName(devotion.id, url));
      if (target.exists) target.delete();
      const file = await File.downloadFileAsync(url, new Directory(Paths.document));
      setLocalUri(file.uri);
      recordDevotionDownload(devotion.id);
    } catch {
      setError('Download failed. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }, [devotion]);

  const open = useCallback(async () => {
    if (!devotion) return;
    const url = devotion.fileUrl || devotion.externalUrl;
    if (!url) return;
    if (localUri && (await Sharing.isAvailableAsync())) {
      await Sharing.shareAsync(localUri);
    } else {
      await WebBrowser.openBrowserAsync(url);
      recordDevotionDownload(devotion.id);
    }
  }, [devotion, localUri]);

  const toggleSave = useCallback(async () => {
    if (!devotion) return;
    try {
      const res = saved ? await api.unsaveDevotion(devotion.id) : await api.saveDevotion(devotion.id);
      setSaved(res.data?.saved ?? !saved);
    } catch {
      /* ignore */
    }
  }, [api, devotion, saved]);

  if (devotion === undefined) {
    return (
      <Screen>
        <View style={styles.center}><ActivityIndicator color={theme.primary} /></View>
      </Screen>
    );
  }
  if (devotion === null) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Devotion' }} />
        <Notice tone="error" message={error ?? 'Devotion not found.'} />
        <Button label="Back to Devotions" variant="outline" onPress={() => router.replace('/devotions')} />
      </Screen>
    );
  }

  const url = devotion.fileUrl || devotion.externalUrl;
  const isAudio = devotion.type === 'audio';
  const isImage = devotion.type === 'image';

  return (
    <Screen>
      <Stack.Screen options={{ title: devotion.series || 'Devotion' }} />

      <View style={styles.head}>
        <Typography kind="eyebrow" color={theme.primary}>{devotion.series || 'Devotion'}</Typography>
        <Typography kind="h1">{devotion.title}</Typography>
        {devotion.scriptureRef ? <Typography kind="lead" color={theme.accent}>{devotion.scriptureRef}</Typography> : null}
        {devotion.author ? <Typography kind="small" color={theme.textSecondary}>By {devotion.author}</Typography> : null}
      </View>

      {devotion.coverImageUrl && !isImage ? (
        <Image source={{ uri: devotion.coverImageUrl }} style={styles.coverImage} contentFit="cover" />
      ) : null}

      {isSignedIn ? (
        <Pressable
          onPress={toggleSave}
          style={({ pressed }) => [
            styles.saveBtn,
            { borderColor: theme.primary, backgroundColor: saved ? theme.primary : 'transparent' },
            pressed && { opacity: 0.7 },
          ]}>
          <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={15} color={saved ? theme.onPrimary : theme.primary} />
          <Typography kind="small" color={saved ? theme.onPrimary : theme.primary}>{saved ? 'Saved' : 'Save'}</Typography>
        </Pressable>
      ) : null}

      {devotion.body
        ? devotion.body.split(/\n{2,}/).map((para, i) => (
            <Typography key={i} kind="body">{para}</Typography>
          ))
        : devotion.description
          ? <Typography kind="body">{devotion.description}</Typography>
          : null}

      {isImage && (localUri || url) ? (
        <View style={[styles.imageFrame, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <Image source={{ uri: (localUri || url) as string }} style={styles.inlineImage} contentFit="contain" />
        </View>
      ) : null}

      {isAudio && (localUri || url) ? (
        <Card>
          <View style={styles.audioRow}>
            <Button
              label={player.playing ? 'Pause' : 'Play'}
              icon={player.playing ? 'pause' : 'play'}
              variant="outline"
              onPress={() => (player.playing ? player.pause() : player.play())}
            />
            <Typography kind="small" color={theme.textSecondary}>
              {localUri ? 'Saved offline' : 'Streaming'}
            </Typography>
          </View>
        </Card>
      ) : null}

      {url && !isAudio ? (
        <Card style={styles.fileCard}>
          <Typography kind="h3">
            {devotion.type === 'link' ? 'External resource' : isImage ? 'Full image' : 'Attached file'}
          </Typography>
          {localUri ? (
            <Typography kind="small" color={theme.success}>Saved on this device — available offline.</Typography>
          ) : null}
          <View style={styles.fileActions}>
            <Button label={localUri ? 'Open' : 'View'} icon="open-outline" onPress={open} />
            {devotion.type !== 'link' && !localUri ? (
              <Button label="Save for offline" icon="download-outline" variant="outline" loading={busy} onPress={download} />
            ) : null}
          </View>
        </Card>
      ) : null}

      <Card style={styles.cta}>
        <Typography kind="h3" center>Walk this out</Typography>
        <Button label="Explore more devotions" variant="outline" icon="book-outline" onPress={() => router.push('/devotions')} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', paddingVertical: Spacing.six },
  head: { gap: Spacing.two },
  coverImage: { width: '100%', height: 200, borderRadius: Radius.lg },
  imageFrame: {
    borderWidth: 1, borderRadius: Radius.lg, padding: Spacing.two, alignItems: 'center',
  },
  inlineImage: { width: '100%', height: 480, borderRadius: Radius.sm },
  saveBtn: {
    alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: Spacing.one,
    borderWidth: 1, borderRadius: 999, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one + 2,
  },
  audioRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two },
  fileCard: { gap: Spacing.two },
  fileActions: { gap: Spacing.two },
  cta: { gap: Spacing.two, paddingVertical: Spacing.four },
});
