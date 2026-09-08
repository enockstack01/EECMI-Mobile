import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Brand, Radius, Spacing } from '@/constants/theme';

type HeroAction = { label: string; onPress: () => void; variant?: 'gold' | 'outline' };

type HeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: HeroAction[];
  children?: ReactNode;
};

export function Hero({ eyebrow, title, subtitle, actions, children }: HeroProps) {
  return (
    <View style={styles.hero}>
      <View style={styles.accentBar} />
      <View style={styles.body}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {actions?.length ? (
          <View style={styles.actions}>
            {actions.map((action) => (
              <Button
                key={action.label}
                label={action.label}
                onPress={action.onPress}
                variant={action.variant ?? 'gold'}
                style={styles.action}
              />
            ))}
          </View>
        ) : null}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: Brand.forestDark,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  accentBar: { height: 4, backgroundColor: Brand.gold },
  body: { padding: Spacing.four, gap: Spacing.three },
  eyebrow: {
    color: Brand.goldLight,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: { color: '#FFFFFF', fontSize: 26, fontWeight: '700', lineHeight: 32 },
  subtitle: { color: 'rgba(255,255,255,0.82)', fontSize: 15, lineHeight: 23 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, marginTop: Spacing.one },
  action: { flexGrow: 1 },
});
