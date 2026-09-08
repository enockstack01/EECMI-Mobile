import { StyleSheet, Text, View } from 'react-native';

import { Brand, Radius, Scripture, Spacing } from '@/constants/theme';

export function ScriptureBanner() {
  return (
    <View style={styles.banner}>
      <View style={styles.text}>
        <Text style={styles.quote}>{`"${Scripture.text}"`}</Text>
        <Text style={styles.ref}>{`— ${Scripture.reference}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: Brand.gold,
    borderRadius: Radius.md,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  text: { gap: Spacing.one, alignItems: 'center' },
  quote: {
    color: Brand.forestDark,
    fontStyle: 'italic',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    fontWeight: '600',
  },
  ref: { color: Brand.forestDark, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
});
