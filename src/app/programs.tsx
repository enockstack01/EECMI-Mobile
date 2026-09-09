import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { Typography } from '@/components/ui/typography';
import { Spacing } from '@/constants/theme';
import { useSiteContent } from '@/hooks/use-site-content';
import { useTheme } from '@/hooks/use-theme';

export default function ProgramsScreen() {
  const theme = useTheme();
  const { programs: Programs } = useSiteContent();

  return (
    <Screen>
      <SectionHeader
        eyebrow="Our Programs"
        title="Six Core Ministry Programs"
        subtitle="Each program combines spiritual formation with practical, sustainable support."
      />

      {Programs.map((program) => (
        <Card
          key={program.id}
          accent={program.color}
          onPress={() => router.push({ pathname: '/program/[id]', params: { id: program.id } })}>
          <View style={styles.head}>
            <View style={[styles.iconWrap, { backgroundColor: program.color }]}>
              <Ionicons
                name={program.icon as keyof typeof Ionicons.glyphMap}
                size={20}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.headText}>
              <Typography kind="h3">{program.title}</Typography>
              <Typography kind="small">{program.tagline}</Typography>
            </View>
          </View>
          <Typography kind="muted">{program.description}</Typography>
          <View style={styles.footer}>
            <Typography kind="small" color={program.color} style={styles.impact}>
              {program.impact}
            </Typography>
            <View style={styles.more}>
              <Typography kind="small" color={theme.primary}>
                Details
              </Typography>
              <Ionicons name="chevron-forward" size={14} color={theme.primary} />
            </View>
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headText: { flex: 1, gap: 2 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  impact: { flex: 1, fontStyle: 'italic' },
  more: { flexDirection: 'row', alignItems: 'center', gap: 2 },
});
