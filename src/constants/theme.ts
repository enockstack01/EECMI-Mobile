/**
 * EECMI brand theme. The `Colors` map keeps the keys the themed primitives
 * (`ThemedText`, `ThemedView`, `useTheme`) rely on, extended with the brand
 * palette used across the app screens.
 */

import '@/global.css';

import { Platform } from 'react-native';

/** Fixed brand palette, from the EECMI website design system. */
export const Brand = {
  forest: '#2D6A4F',
  forestDark: '#1B4332',
  forestMid: '#40916C',
  gold: '#D4A017',
  goldLight: '#E9C46A',
  navy: '#1A3A5C',
  navyDark: '#0D2137',
  earth: '#8B5E3C',
  earthLight: '#C49A6C',
  cream: '#FBF7F0',
} as const;

export const Colors = {
  light: {
    text: '#14201A',
    textSecondary: '#5B6B63',
    background: '#FFFFFF',
    backgroundElement: '#F4F1EA',
    backgroundSelected: '#E7E1D4',
    card: '#FFFFFF',
    border: '#E3DED2',
    tint: Brand.forest,
    primary: Brand.forest,
    primaryDark: Brand.forestDark,
    onPrimary: '#FFFFFF',
    accent: Brand.gold,
    heroText: '#FFFFFF',
    success: '#2D6A4F',
    danger: '#B4413C',
  },
  dark: {
    text: '#F3F1EC',
    textSecondary: '#A9B2AC',
    background: '#0E1512',
    backgroundElement: '#1A211D',
    backgroundSelected: '#252D28',
    card: '#161D19',
    border: '#2C352F',
    tint: Brand.goldLight,
    primary: Brand.forestMid,
    primaryDark: Brand.forestDark,
    onPrimary: '#FFFFFF',
    accent: Brand.goldLight,
    heroText: '#FFFFFF',
    success: '#74C69D',
    danger: '#E06C66',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

export const MaxContentWidth = 800;

export const Scripture = {
  text: 'Arise, shine, for your light has come, and the glory of the LORD rises upon you.',
  reference: 'Isaiah 60:1',
} as const;
