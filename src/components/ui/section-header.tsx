import { View, StyleSheet } from 'react-native';

import { Typography } from '@/components/ui/typography';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
};

export function SectionHeader({ eyebrow, title, subtitle, center }: SectionHeaderProps) {
  const theme = useTheme();
  return (
    <View style={[styles.wrap, center && styles.center]}>
      {eyebrow ? <Typography kind="eyebrow">{eyebrow}</Typography> : null}
      <Typography kind="h2">{title}</Typography>
      <View style={[styles.rule, { backgroundColor: theme.accent }]} />
      {subtitle ? (
        <Typography kind="muted" center={center} style={styles.subtitle}>
          {subtitle}
        </Typography>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.two },
  center: { alignItems: 'center' },
  rule: { width: 48, height: 3, borderRadius: 2, marginTop: Spacing.half },
  subtitle: { marginTop: Spacing.half },
});
