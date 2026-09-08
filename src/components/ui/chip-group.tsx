import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ChipGroupProps = {
  label?: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  /** Allow only one selection at a time. */
  single?: boolean;
};

export function ChipGroup({ label, options, selected, onChange, single = false }: ChipGroupProps) {
  const theme = useTheme();

  function toggle(option: string) {
    if (single) {
      onChange(selected.includes(option) ? [] : [option]);
      return;
    }
    onChange(
      selected.includes(option)
        ? selected.filter((o) => o !== option)
        : [...selected, option],
    );
  }

  return (
    <View style={styles.wrap}>
      {label ? <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text> : null}
      <View style={styles.chips}>
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => toggle(option)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? theme.primary : theme.backgroundElement,
                  borderColor: active ? theme.primary : theme.border,
                },
              ]}>
              <Text
                style={[styles.chipText, { color: active ? theme.onPrimary : theme.text }]}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.two },
  label: { fontFamily: Fonts.sans, fontSize: 13, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: {
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingVertical: Spacing.one + 2,
    paddingHorizontal: Spacing.three,
  },
  chipText: { fontFamily: Fonts.sans, fontSize: 13, fontWeight: '600' },
});
