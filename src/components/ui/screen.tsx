import { ReactElement, ReactNode } from 'react';
import {
  Platform,
  type RefreshControlProps,
  ScrollView,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ScreenProps = {
  children: ReactNode;
  /** Render without a ScrollView (screen manages its own scrolling). */
  scroll?: boolean;
  /** Extra padding at the top, e.g. for screens without a nav header. */
  topInset?: boolean;
  contentContainerStyle?: ViewStyle;
  /** Forwarded to the underlying ScrollView (ignored when `scroll` is false). */
  refreshControl?: ReactElement<RefreshControlProps>;
};

export function Screen({
  children,
  scroll = true,
  topInset = false,
  contentContainerStyle,
  refreshControl,
}: ScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const padding: ViewStyle = {
    paddingTop: topInset ? insets.top + Spacing.three : Spacing.three,
    // React Navigation already lays the scene out above the tab bar; this is
    // just the home-indicator inset plus breathing room at the end of a scroll.
    paddingBottom: insets.bottom + Spacing.four,
    paddingHorizontal: Spacing.three,
  };

  if (!scroll) {
    return (
      <View style={[styles.flex, { backgroundColor: theme.background }]}>
        <View style={[styles.inner, padding, contentContainerStyle]}>{children}</View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.flex, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={Platform.OS === 'web'}>
      <View style={[styles.inner, padding, contentContainerStyle]}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, alignItems: 'center' },
  inner: { width: '100%', maxWidth: MaxContentWidth, gap: Spacing.four },
});
