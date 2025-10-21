import { Platform, TextStyle } from 'react-native';

/**
 * Typography system following editorial design principles
 * Using system fonts with fallbacks for cross-platform compatibility
 */

// Font families
const SERIF_FONT = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});

const SANS_SERIF_FONT = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const AppTextStyles = {
  // Masthead - Bold, high-contrast, serif or heavy sans-serif (72-120pt equivalent)
  masthead: {
    fontFamily: SERIF_FONT,
    fontSize: 96,
    fontWeight: '900' as TextStyle['fontWeight'],
    lineHeight: 96,
    letterSpacing: -2,
  },

  // Headlines
  headlinePrimary: {
    fontFamily: SERIF_FONT,
    fontSize: 48,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 52.8,
    letterSpacing: -0.5,
  },

  headlineSecondary: {
    fontFamily: SERIF_FONT,
    fontSize: 30,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 36,
    letterSpacing: -0.25,
  },

  headlineTertiary: {
    fontFamily: SERIF_FONT,
    fontSize: 18,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 23.4,
  },

  // Display styles for modern content portal
  displayLarge: {
    fontFamily: SANS_SERIF_FONT,
    fontSize: 72,
    fontWeight: '900' as TextStyle['fontWeight'],
    lineHeight: 72,
    letterSpacing: -1.5,
  },

  displayMedium: {
    fontFamily: SANS_SERIF_FONT,
    fontSize: 56,
    fontWeight: '900' as TextStyle['fontWeight'],
    lineHeight: 61.6,
    letterSpacing: -1,
  },

  // Body text - Serif for readability
  bodyLarge: {
    fontFamily: SERIF_FONT,
    fontSize: 18,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 28.8,
    letterSpacing: 0.25,
  },

  bodyMedium: {
    fontFamily: SERIF_FONT,
    fontSize: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 24,
    letterSpacing: 0.15,
  },

  bodySmall: {
    fontFamily: SERIF_FONT,
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 19.6,
    letterSpacing: 0.1,
  },

  // Labels - Sans-serif, uppercase
  labelLarge: {
    fontFamily: SANS_SERIF_FONT,
    fontSize: 14,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 16.8,
    letterSpacing: 1.5,
  },

  labelMedium: {
    fontFamily: SANS_SERIF_FONT,
    fontSize: 12,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 14.4,
    letterSpacing: 1.25,
  },

  labelSmall: {
    fontFamily: SANS_SERIF_FONT,
    fontSize: 10,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 12,
    letterSpacing: 1,
  },

  // Captions - Small sans-serif
  caption: {
    fontFamily: SANS_SERIF_FONT,
    fontSize: 12,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 16.8,
    letterSpacing: 0.4,
  },

  captionSmall: {
    fontFamily: SANS_SERIF_FONT,
    fontSize: 10,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 14,
    letterSpacing: 0.3,
  },

  // Button text
  button: {
    fontFamily: SANS_SERIF_FONT,
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 19.2,
    letterSpacing: 0.5,
  },

  // Article title variations
  articleTitleHero: {
    fontFamily: SERIF_FONT,
    fontSize: 36,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 43.2,
    letterSpacing: -0.5,
  },

  articleTitleLarge: {
    fontFamily: SERIF_FONT,
    fontSize: 24,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 30,
    letterSpacing: -0.25,
  },

  articleTitleMedium: {
    fontFamily: SERIF_FONT,
    fontSize: 20,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 26,
  },

  articleTitleSmall: {
    fontFamily: SERIF_FONT,
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 22.4,
  },
} as const;
