import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/ui/brand-mark';
import { Fonts, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type HeaderAction = {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  accessibilityLabel: string;
  /** Show a small dot on the icon (e.g. unread notifications). */
  badge?: boolean;
};

type AppHeaderProps = {
  /**
   * 'home' shows the full brand lockup, 'section' shows the mark + screen title,
   * 'stack' shows a back button + screen title.
   */
  variant?: 'home' | 'section' | 'stack';
  title?: string;
  onBack?: () => void;
  action?: HeaderAction | null;
};

const BAR_HEIGHT = 52;

export function AppHeader({ variant = 'section', title, onBack, action }: AppHeaderProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isStack = variant === 'stack';
  const isHome = variant === 'home';

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingTop: insets.top,
          backgroundColor: theme.background,
          borderBottomColor: theme.border,
          shadowColor: theme.text,
        },
      ]}>
      <View style={styles.inner}>
        <View style={styles.row}>
          <View style={styles.leading}>
            {isStack ? (
              <Pressable
                onPress={onBack}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Go back"
                style={({ pressed }) => [
                  styles.iconButton,
                  { borderColor: theme.border, backgroundColor: theme.backgroundElement },
                  pressed && styles.pressed,
                ]}>
                <Ionicons name="chevron-back" size={20} color={theme.text} />
              </Pressable>
            ) : (
              <BrandMark size={24} tile />
            )}

            <View style={styles.titleGroup}>
              {isHome ? (
                <>
                  <Text style={[styles.wordmark, { color: theme.text }]}>EECMI</Text>
                  <Text
                    style={[styles.kicker, { color: theme.textSecondary }]}
                    numberOfLines={1}>
                    Ecclessia Eden Commission
                  </Text>
                </>
              ) : (
                <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
                  {title}
                </Text>
              )}
            </View>
          </View>

          {action ? (
            <Pressable
              onPress={action.onPress}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={action.accessibilityLabel}
              style={({ pressed }) => [
                styles.iconButton,
                { borderColor: theme.border, backgroundColor: theme.backgroundElement },
                pressed && styles.pressed,
              ]}>
              <Ionicons name={action.icon} size={18} color={theme.primary} />
              {action.badge ? (
                <View style={[styles.badge, { backgroundColor: theme.accent, borderColor: theme.background }]} />
              ) : null}
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    // a whisper of elevation so content appears to scroll under the bar
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    zIndex: 10,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  row: {
    height: BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  leading: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + 2,
  },
  titleGroup: { flex: 1 },
  wordmark: {
    fontFamily: Fonts.serif,
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  kicker: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 20,
    fontWeight: '700',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1.5,
  },
  pressed: { opacity: 0.6 },
});
