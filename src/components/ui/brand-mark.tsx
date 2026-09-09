import { Image } from 'expo-image';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Radius } from '@/constants/theme';

const source = require('../../../assets/images/mark.png');

type BrandMarkProps = {
  /** Rendered width & height of the emblem in px. */
  size?: number;
  /** Draw the emblem on a rounded cream tile (used in headers on any background). */
  tile?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** The EECMI emblem (three figures under an arc), the app's visual signature. */
export function BrandMark({ size = 28, tile = false, style }: BrandMarkProps) {
  const box = tile ? Math.round(size * 1.34) : size;

  return (
    <View
      style={[
        { width: box, height: box, alignItems: 'center', justifyContent: 'center' },
        tile && [styles.tile, { borderRadius: Math.min(Radius.md, box / 3) }],
        style,
      ]}>
      <Image
        source={source}
        style={{ width: size, height: size }}
        contentFit="contain"
        accessibilityLabel="EECMI"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { backgroundColor: '#FBF7F0' },
});
