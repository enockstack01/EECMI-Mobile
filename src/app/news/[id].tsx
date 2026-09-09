import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Pill } from '@/components/ui/pill';
import { Screen } from '@/components/ui/screen';
import { Typography } from '@/components/ui/typography';
import { CategoryColors, NewsArticles } from '@/constants/content';
import { Brand, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { getNewsPost, type NewsPost } from '@/lib/api';

type Article = {
  title: string;
  category: string;
  body: string;
  date: string;
  readTime?: string;
};

const fmtDate = (d?: string) => {
  if (!d) return '';
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? d : dt.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
};

const fromApi = (p: NewsPost): Article => ({
  title: p.title,
  category: p.category || 'Update',
  body: p.content || p.excerpt || '',
  date: fmtDate(p.publishedAt || p.createdAt),
  readTime: p.readTime,
});

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const [item, setItem] = useState<Article | null | undefined>(undefined);

  useEffect(() => {
    const staticMatch = NewsArticles.find((a) => String(a.id) === id);
    const fallback: Article | null = staticMatch
      ? { title: staticMatch.title, category: staticMatch.category, body: staticMatch.excerpt, date: staticMatch.date, readTime: staticMatch.readTime }
      : null;
    getNewsPost(id)
      .then((res) => setItem(res.data ? fromApi(res.data) : fallback))
      .catch(() => setItem(fallback));
  }, [id]);

  if (item === undefined) {
    return <Screen><View style={styles.center}><ActivityIndicator color={theme.primary} /></View></Screen>;
  }
  if (item === null) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Update' }} />
        <Typography kind="h2">Article not found</Typography>
        <Button label="Back to News" variant="outline" onPress={() => router.replace('/news')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: item.category }} />
      <View style={styles.head}>
        <Pill label={item.category} color={CategoryColors[item.category] ?? Brand.forest} />
        <Typography kind="h1">{item.title}</Typography>
        <Typography kind="small" color={theme.textSecondary}>
          {[item.date, item.readTime].filter(Boolean).join(' · ')}
        </Typography>
      </View>
      {item.body.split(/\n{2,}/).filter(Boolean).map((para, i) => (
        <Typography key={i} kind="body">{para}</Typography>
      ))}
      <Button label="All news" variant="outline" icon="newspaper-outline" onPress={() => router.push('/news')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', paddingVertical: Spacing.six },
  head: { gap: Spacing.two },
});
