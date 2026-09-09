import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Hero } from '@/components/ui/hero';
import { Pill } from '@/components/ui/pill';
import { ScriptureBanner } from '@/components/ui/scripture-banner';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { Typography } from '@/components/ui/typography';
import { Org, Programs, Values, Vision } from '@/constants/content';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <Screen>
      <Hero
        eyebrow="Christ Centered Ministry in Uganda"
        title="Transforming Lives Through Christ Centered Outreach"
        subtitle={Org.intro}
        actions={[
          { label: 'Get Involved', onPress: () => router.push('/involved'), variant: 'gold' },
          { label: 'Our Programs', onPress: () => router.push('/programs'), variant: 'outline' },
        ]}
      />

      <ScriptureBanner />

      <View style={styles.block}>
        <SectionHeader eyebrow="Who We Are" title="Vision & Mission" />
        <Card accent={theme.primary}>
          <Typography kind="eyebrow" color={theme.primary}>
            Our Vision
          </Typography>
          <Typography kind="body">{Vision.vision}</Typography>
        </Card>
        <Card accent={theme.accent}>
          <Typography kind="eyebrow" color={theme.accent}>
            Our Mission
          </Typography>
          <Typography kind="body">{Vision.mission}</Typography>
        </Card>
        <Card>
          <Typography kind="eyebrow">Our Tagline</Typography>
          <Typography kind="body">{Org.tagline}</Typography>
        </Card>
      </View>

      <View style={styles.block}>
        <SectionHeader
          eyebrow="What We Do"
          title="Six Core Programs"
          subtitle="Holistic ministry across prisons, families, and communities in Uganda."
        />
        {Programs.slice(0, 3).map((program) => (
          <Card
            key={program.id}
            accent={program.color}
            onPress={() => router.push({ pathname: '/program/[id]', params: { id: program.id } })}>
            <View style={styles.programHead}>
              <View style={[styles.iconWrap, { backgroundColor: program.color }]}>
                <Ionicons
                  name={program.icon as keyof typeof Ionicons.glyphMap}
                  size={18}
                  color="#FFFFFF"
                />
              </View>
              <View style={styles.programText}>
                <Typography kind="h3">{program.title}</Typography>
                <Typography kind="small">{program.tagline}</Typography>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
            </View>
          </Card>
        ))}
        <Button
          label="View all six programs"
          variant="outline"
          icon="arrow-forward"
          onPress={() => router.push('/programs')}
        />
      </View>

      <View style={styles.block}>
        <SectionHeader eyebrow="What Guides Us" title="Core Values" />
        <View style={styles.valueGrid}>
          {Values.map((value) => (
            <Pill key={value.name} label={value.name} color={value.color} />
          ))}
        </View>
      </View>

      <View style={styles.block}>
        <SectionHeader eyebrow="Explore" title="Learn More" />
        <Card onPress={() => router.push('/about')}>
          <View style={styles.linkCard}>
            <Ionicons name="information-circle" size={22} color={theme.primary} />
            <View style={styles.linkCardText}>
              <Typography kind="h3">About EECMI</Typography>
              <Typography kind="small">Vision, mission, values, and our leadership</Typography>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
          </View>
        </Card>
        <Card onPress={() => router.push('/resources')}>
          <View style={styles.linkCard}>
            <Ionicons name="library" size={22} color={theme.primary} />
            <View style={styles.linkCardText}>
              <Typography kind="h3">Resources</Typography>
              <Typography kind="small">Reports, guides, and downloads</Typography>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
          </View>
        </Card>
      </View>

      <Card style={styles.cta}>
        <Typography kind="h2" center>
          Join the mission
        </Typography>
        <Typography kind="muted" center>
          Volunteer your time, partner with us, or share a prayer request. Every hand makes a
          difference.
        </Typography>
        <Button label="Get Involved" icon="heart" onPress={() => router.push('/involved')} />
        <Pressable onPress={() => router.push('/contact')} style={styles.link}>
          <Typography kind="small" color={theme.primary}>
            Contact the team
          </Typography>
          <Ionicons name="arrow-forward" size={14} color={theme.primary} />
        </Pressable>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { gap: Spacing.two },
  programHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  programText: { flex: 1, gap: 2 },
  valueGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  linkCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  linkCardText: { flex: 1, gap: 2 },
  cta: { alignItems: 'stretch', gap: Spacing.three, paddingVertical: Spacing.four },
  link: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, alignSelf: 'center' },
});
