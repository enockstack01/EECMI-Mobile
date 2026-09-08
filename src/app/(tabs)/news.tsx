import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { ChipGroup } from '@/components/ui/chip-group';
import { Pill } from '@/components/ui/pill';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { Typography } from '@/components/ui/typography';
import { CategoryColors, NewsArticles } from '@/constants/content';
import { Brand, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const CATEGORIES = ['All', ...Array.from(new Set(NewsArticles.map((a) => a.category)))];

export default function NewsScreen() {
  const theme = useTheme();
  const [category, setCategory] = useState('All');

  const articles = useMemo(
    () => (category === 'All' ? NewsArticles : NewsArticles.filter((a) => a.category === category)),
    [category],
  );

  const featured = articles.find((a) => a.featured);
  const rest = articles.filter((a) => a !== featured);

  return (
    <Screen topInset>
      <SectionHeader
        eyebrow="Newsroom"
        title="Stories of Transformation"
        subtitle="Updates from the field across our ministry programs."
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}>
        <ChipGroup
          options={CATEGORIES}
          selected={[category]}
          single
          onChange={(next) => setCategory(next[0] ?? 'All')}
        />
      </ScrollView>

      {featured ? (
        <Card accent={CategoryColors[featured.category] ?? Brand.forest}>
          <View style={styles.metaRow}>
            <Pill
              label={featured.category}
              color={CategoryColors[featured.category] ?? Brand.forest}
              filled
            />
            <Typography kind="small">Featured</Typography>
          </View>
          <Typography kind="h2">{featured.title}</Typography>
          <Typography kind="muted">{featured.excerpt}</Typography>
          <Typography kind="small" color={theme.textSecondary}>
            {featured.date} · {featured.readTime}
          </Typography>
        </Card>
      ) : null}

      {rest.map((article) => (
        <Card key={article.id}>
          <View style={styles.metaRow}>
            <Pill
              label={article.category}
              color={CategoryColors[article.category] ?? Brand.forest}
            />
            <Typography kind="small" color={theme.textSecondary}>
              {article.date}
            </Typography>
          </View>
          <Typography kind="h3">{article.title}</Typography>
          <Typography kind="muted">{article.excerpt}</Typography>
          <Typography kind="small" color={theme.textSecondary}>
            {article.readTime}
          </Typography>
        </Card>
      ))}

      {articles.length === 0 ? (
        <Typography kind="muted" center>
          No stories in this category yet.
        </Typography>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterRow: { paddingBottom: Spacing.one },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
});
