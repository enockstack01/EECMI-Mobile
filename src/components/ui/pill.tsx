import { StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';

type PillProps = {
  label: string;
  color: string;
  filled?: boolean;
};

/** Small category / status chip. `color` is the accent; text stays readable on a tint. */
export function Pill({ label, color, filled = false }: PillProps) {
  return (
    <View
      style={[
        styles.pill,
        filled
          ? { backgroundColor: color }
          : { backgroundColor: withAlpha(color, 0.14), borderColor: withAlpha(color, 0.35), borderWidth: 1 },
      ]}>
      <Text style={[styles.label, { color: filled ? '#FFFFFF' : color }]}>{label}</Text>
    </View>
  );
}

function withAlpha(hex: string, alpha: number) {
  const n = hex.replace('#', '');
  const full = n.length === 3 ? n.split('').map((c) => c + c).join('') : n;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    borderRadius: Radius.pill,
    paddingVertical: Spacing.half + 1,
    paddingHorizontal: Spacing.two,
  },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.4, textTransform: 'uppercase' },
});
