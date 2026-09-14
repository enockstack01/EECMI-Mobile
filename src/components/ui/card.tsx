import { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CardProps = {
  children: ReactNode;
  onPress?: () => void;
  /** Left accent stripe colour. */
  accent?: string;
  /** Edge-to-edge content (e.g. a cover image) rendered above the padded body. */
  media?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, onPress, accent, media, style }: CardProps) {
  const theme = useTheme();

  const body = (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
        accent ? { borderLeftColor: accent, borderLeftWidth: 4 } : null,
        style,
      ]}>
      {media ? <View style={styles.media}>{media}</View> : null}
      <View style={styles.body}>{children}</View>
    </View>
  );

  if (!onPress) return body;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}>
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  media: { aspectRatio: 16 / 10 },
  body: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.995 }] },
});
