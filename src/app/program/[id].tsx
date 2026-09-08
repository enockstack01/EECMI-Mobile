import { Ionicons } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Typography } from '@/components/ui/typography';
import { Programs } from '@/constants/content';
import { Spacing } from '@/constants/theme';

export default function ProgramDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const program = Programs.find((p) => p.id === id);

  if (!program) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Program' }} />
        <Typography kind="h2">Program not found</Typography>
        <Button label="Back to Programs" variant="outline" onPress={() => router.replace('/programs')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: program.title, headerTintColor: program.color }} />

      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: program.color }]}>
          <Ionicons
            name={program.icon as keyof typeof Ionicons.glyphMap}
            size={26}
            color="#FFFFFF"
          />
        </View>
        <Typography kind="h1">{program.title}</Typography>
        <Typography kind="lead" color={program.color}>
          {program.tagline}
        </Typography>
      </View>

      <Typography kind="body">{program.description}</Typography>

      <Card accent={program.color}>
        <Typography kind="eyebrow" color={program.color}>
          Impact
        </Typography>
        <Typography kind="h3">{program.impact}</Typography>
      </Card>

      <View style={styles.activities}>
        <Typography kind="h2">What we do</Typography>
        {program.activities.map((activity) => (
          <View key={activity} style={styles.activityRow}>
            <Ionicons name="checkmark-circle" size={18} color={program.color} />
            <Typography kind="muted" style={styles.activityText}>
              {activity}
            </Typography>
          </View>
        ))}
      </View>

      <Card style={styles.cta}>
        <Typography kind="h3" center>
          Want to support this program?
        </Typography>
        <Button label="Get Involved" icon="heart" onPress={() => router.push('/involved')} />
        <Button
          label="Contact the Team"
          variant="outline"
          icon="mail"
          onPress={() => router.push('/contact')}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: Spacing.two },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  activities: { gap: Spacing.two },
  activityRow: { flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-start' },
  activityText: { flex: 1 },
  cta: { gap: Spacing.two, paddingVertical: Spacing.four },
});
