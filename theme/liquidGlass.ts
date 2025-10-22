/**
 * Global Liquid Glass Configuration
 * Centralized settings for liquid glass effects across the app
 */

export const LiquidGlassConfig = {
  // The effect type for liquid glass components
  effect: 'regular' as const,
  
  // Background color for liquid glass (with transparency)
  backgroundColor: 'rgba(240, 235, 220, 0.95)',
  
  // Fallback background when liquid glass is not supported
  fallbackBackgroundColor: 'rgba(240, 235, 220, 0.95)',
};
