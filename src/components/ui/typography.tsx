import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Kind = 'eyebrow' | 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'lead' | 'small' | 'muted';

export type TypographyProps = TextProps & {
  kind?: Kind;
  color?: string;
  center?: boolean;
};

export function Typography({ kind = 'body', color, center, style, ...rest }: TypographyProps) {
  const theme = useTheme();

  const kindColor =
    color ??
    (kind === 'eyebrow'
      ? theme.accent
      : kind === 'muted' || kind === 'small'
        ? theme.textSecondary
        : theme.text);

  return (
    <Text
      style={[styles[kind], { color: kindColor }, center && styles.center, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  display: { fontFamily: Fonts.serif, fontSize: 34, fontWeight: '700', lineHeight: 40 },
  h1: { fontFamily: Fonts.serif, fontSize: 28, fontWeight: '700', lineHeight: 34 },
  h2: { fontFamily: Fonts.serif, fontSize: 22, fontWeight: '700', lineHeight: 28 },
  h3: { fontFamily: Fonts.sans, fontSize: 17, fontWeight: '700', lineHeight: 23 },
  lead: { fontFamily: Fonts.sans, fontSize: 16, fontWeight: '500', lineHeight: 25 },
  body: { fontFamily: Fonts.sans, fontSize: 15, fontWeight: '400', lineHeight: 23 },
  small: { fontFamily: Fonts.sans, fontSize: 13, fontWeight: '500', lineHeight: 19 },
  muted: { fontFamily: Fonts.sans, fontSize: 14, fontWeight: '400', lineHeight: 21 },
  center: { textAlign: 'center' },
});
