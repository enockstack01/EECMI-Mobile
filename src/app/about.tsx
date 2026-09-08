import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Pill } from '@/components/ui/pill';
import { ScriptureBanner } from '@/components/ui/scripture-banner';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { Typography } from '@/components/ui/typography';
import { AboutFacts, Leadership, Org, Values, Vision } from '@/constants/content';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function AboutScreen() {
  const theme = useTheme();

  return (
    <Screen>
      <Stack.Screen options={{ title: 'About EECMI' }} />

      <View style={styles.block}>
        <SectionHeader eyebrow="About Us" title="A Voice for the Voiceless" />
        <Typography kind="body">
          {Org.name} is a nonprofit Christian ministry serving prisoners, youth, women, and
          children across Uganda and East Africa. We combine the Gospel with practical,
          sustainable support so that lives are restored, families rebuilt, and communities
          transformed.
        </Typography>
      </View>

      <ScriptureBanner />

      <View style={styles.block}>
        <SectionHeader eyebrow="Direction" title="Vision & Mission" />
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
        <SectionHeader eyebrow="At a Glance" title="Who We Are" />
        <Card>
          {AboutFacts.map((fact, index) => (
            <View
              key={fact.label}
              style={[
                styles.factRow,
                index < AboutFacts.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: theme.border,
                },
              ]}>
              <Typography kind="small" color={theme.textSecondary}>
                {fact.label}
              </Typography>
              <Typography kind="small" style={styles.factValue}>
                {fact.value}
              </Typography>
            </View>
          ))}
        </Card>
      </View>

      <View style={styles.block}>
        <SectionHeader eyebrow="What Guides Us" title="Core Values" />
        <View style={styles.values}>
          {Values.map((value) => (
            <Pill key={value.name} label={value.name} color={value.color} />
          ))}
        </View>
        {Values.map((value) => (
          <View key={value.name} style={styles.valueRow}>
            <Ionicons name="ellipse" size={8} color={value.color} style={styles.dot} />
            <Typography kind="muted" style={styles.valueText}>
              <Typography kind="small" style={styles.valueName}>
                {value.name}.{' '}
              </Typography>
              {value.desc}
            </Typography>
          </View>
        ))}
      </View>

      <View style={styles.block}>
        <SectionHeader eyebrow="Our Team" title="Servant Leaders Called by God" />
        <Card accent={theme.primary}>
          <View style={styles.leaderHead}>
            <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
              <Typography kind="h3" color="#FFFFFF">
                {Leadership.founder.initials}
              </Typography>
            </View>
            <View style={styles.leaderText}>
              <Typography kind="h3">{Leadership.founder.name}</Typography>
              <Typography kind="small" color={theme.textSecondary}>
                {Leadership.founder.title}
              </Typography>
            </View>
          </View>
          <Typography kind="muted">{Leadership.founder.bio}</Typography>
          {Leadership.founder.responsibilities.map((item) => (
            <View key={item} style={styles.valueRow}>
              <Ionicons name="checkmark-circle" size={16} color={theme.primary} />
              <Typography kind="small" style={styles.valueText}>
                {item}
              </Typography>
            </View>
          ))}
        </Card>
        <View style={styles.advisoryGrid}>
          {Leadership.advisory.map((member) => (
            <Card key={member.role} style={styles.advisoryCard}>
              <Typography kind="small" color={theme.textSecondary}>
                Advisory Board
              </Typography>
              <Typography kind="body">{member.role}</Typography>
            </Card>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { gap: Spacing.two },
  factRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.two + 2,
  },
  factValue: { flex: 1, textAlign: 'right', fontWeight: '600' },
  values: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, marginBottom: Spacing.one },
  valueRow: { flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-start' },
  dot: { marginTop: 6 },
  valueText: { flex: 1 },
  valueName: { fontWeight: '700' },
  leaderHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderText: { flex: 1, gap: 2 },
  advisoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  advisoryCard: { flexGrow: 1, flexBasis: '46%' },
});
