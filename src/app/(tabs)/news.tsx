import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { ChipGroup } from '@/components/ui/chip-group';
import { Pill } from '@/components/ui/pill';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { Typography } from '@/components/ui/typography';
import { CategoryColors, NewsArticles } from '@/constants/content';
import { Brand, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { getNews, type NewsPost } from '@/lib/api';

type Item = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readTime?: string;
  featured?: boolean;
};

const fmtDate = (d?: string) => {
  if (!d) return '';
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? d : dt.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
};

const fallbackItems: Item[] = NewsArticles.map((a) => ({
  id: String(a.id),
  title: a.title,
  category: a.category,
  excerpt: a.excerpt,
  date: a.date,
  readTime: a.readTime,
  featured: a.featured,
}));

const fromApi = (p: NewsPost): Item => ({
  id: p.id,
  title: p.title,
  category: p.category || 'Update',
  excerpt: p.excerpt || '',
  date: fmtDate(p.publishedAt || p.createdAt),
  readTime: p.readTime,
  featured: p.featured,
});

export default function NewsScreen() {
  const theme = useTheme();
  const [items, setItems] = useState<Item[]>(fallbackItems);
  const [category, setCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await getNews();
      if (res.data && res.data.length) setItems(res.data.map(fromApi));
    } catch {
      /* keep fallback */
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

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(items.map((a) => a.category).filter(Boolean)))],
    [items],
  );
  const list = category === 'All' ? items : items.filter((a) => a.category === category);
  const featured = list.find((a) => a.featured);
  const rest = list.filter((a) => a !== featured);

  return (
    <Screen
      scroll
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}>
      <SectionHeader
        eyebrow="Newsroom"
        title="News & Updates"
        subtitle="Stories and updates from across our ministry programs."
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        <ChipGroup options={categories} selected={[category]} single onChange={(n) => setCategory(n[0] ?? 'All')} />
      </ScrollView>

      {featured ? (
        <Card
          accent={CategoryColors[featured.category] ?? Brand.forest}
          onPress={() => router.push({ pathname: '/news/[id]', params: { id: featured.id } })}>
          <View style={styles.metaRow}>
            <Pill label={featured.category} color={CategoryColors[featured.category] ?? Brand.forest} filled />
            <Typography kind="small">Featured</Typography>
          </View>
          <Typography kind="h2">{featured.title}</Typography>
          {featured.excerpt ? <Typography kind="muted">{featured.excerpt}</Typography> : null}
          <Typography kind="small" color={theme.textSecondary}>
            {[featured.date, featured.readTime].filter(Boolean).join(' · ')}
          </Typography>
        </Card>
      ) : null}

      {rest.map((article) => (
        <Card
          key={article.id}
          onPress={() => router.push({ pathname: '/news/[id]', params: { id: article.id } })}>
          <View style={styles.metaRow}>
            <Pill label={article.category} color={CategoryColors[article.category] ?? Brand.forest} />
            <Typography kind="small" color={theme.textSecondary}>{article.date}</Typography>
          </View>
          <Typography kind="h3">{article.title}</Typography>
          {article.excerpt ? <Typography kind="muted">{article.excerpt}</Typography> : null}
        </Card>
      ))}

      {list.length === 0 ? (
        <Typography kind="muted" center>No stories in this category yet.</Typography>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterRow: { paddingBottom: Spacing.one },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two },
});
