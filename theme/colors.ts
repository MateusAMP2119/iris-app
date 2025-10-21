/**
 * App color palette based on editorial design system
 */
export const AppColors = {
  // Primary colors - Black text on cream/white background (editorial style)
  primaryText: '#000000',
  background: '#FFFBF5', // Cream/off-white
  surface: '#FFFFFF',

  // Accent colors - Minimal use for highlights
  accentRed: '#DC2626',
  accentBlue: '#2563EB',
  accentGold: '#D97706',

  // Neutral shades
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#E5E5E5',
  gray300: '#D4D4D4',
  gray400: '#A3A3A3',
  gray500: '#737373',
  gray600: '#525252',
  gray700: '#404040',
  gray800: '#262626',
  gray900: '#171717',

  // Functional colors
  divider: '#000000',
  dividerLight: '#E5E5E5',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Category colors
  categoryTech: '#2563EB',
  categoryWorld: '#DC2626',
  categoryBusiness: '#059669',
  categoryScience: '#7C3AED',
  categorySports: '#D97706',
  categoryPolitics: '#4F46E5',
  categoryEntertainment: '#DB2777',
  categoryHealth: '#10B981',
} as const;

export function getCategoryColor(categoryName: string): string {
  switch (categoryName.toLowerCase()) {
    case 'technology':
      return AppColors.categoryTech;
    case 'world':
      return AppColors.categoryWorld;
    case 'business':
      return AppColors.categoryBusiness;
    case 'science':
      return AppColors.categoryScience;
    case 'sports':
      return AppColors.categorySports;
    case 'politics':
      return AppColors.categoryPolitics;
    case 'entertainment':
      return AppColors.categoryEntertainment;
    case 'health':
      return AppColors.categoryHealth;
    default:
      return AppColors.gray600;
  }
}
