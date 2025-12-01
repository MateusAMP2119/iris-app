/**
 * Theme configuration based on design.json
 * News Aggregator App Design System
 */

export const colors = {
  // Primary colors
  primary: {
    background: '#F5F5F7', // Off-white screen background
    text: '#000000',
  },
  // Secondary grays
  secondary: {
    gray100: '#F5F5F7',
    gray200: '#E5E5E5',
    gray300: '#D1D1D6', // Inactive bookmark color
    gray400: '#8E8E93', // Inactive tab color
    gray600: '#666666',
  },
  // Accent color
  accent: {
    primary: '#FF2D55',
  },
  // Semantic colors
  semantic: {
    cardBackground: '#FFFFFF', // White cards for depth
    screenBackground: '#F5F5F7', // Off-white background
    navBackground: '#FFFFFF', // White navigation bar
    divider: 'rgba(0,0,0,0.1)',
    shadow: 'rgba(0,0,0,0.1)',
  },
};

// 8px base unit spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

export const typography = {
  // Display - Main headings, section titles
  display: {
    fontSize: 34,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  displayLarge: {
    fontSize: 40,
    fontWeight: '800' as const,
    lineHeight: 48,
  },
  // Title - Article headlines, card titles
  title: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 26,
  },
  titleLarge: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 30,
  },
  // Body - Descriptions, article previews
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  // Caption - Dates, metadata, secondary information
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
    color: colors.secondary.gray400,
  },
  captionLarge: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: colors.secondary.gray400,
  },
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  cardPressed: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
};

// Component sizing
export const sizes = {
  // Touch targets (44px minimum per accessibility guidelines)
  touchTarget: 44,
  // Icons
  iconSmall: 20,
  iconMedium: 24,
  iconLarge: 28,
  // Avatars
  avatarSmall: 40,
  avatarMedium: 56,
  avatarLarge: 64,
  // Thumbnail
  thumbnailSmall: 60,
  thumbnailMedium: 80,
  thumbnailLarge: 100,
  // Navigation bar
  bottomNavHeight: 90,
  tabBarIconSize: 24,
};

// Layout constants
export const layout = {
  screenPaddingHorizontal: 16,
  cardPadding: 16,
  sectionSpacing: 32,
  cardGap: 16,
  gridGap: 12,
};

// Animation durations
export const animations = {
  fast: 150,
  medium: 300,
  slow: 400,
  cardPressScale: 0.98,
};

export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  sizes,
  layout,
  animations,
};

export default theme;
