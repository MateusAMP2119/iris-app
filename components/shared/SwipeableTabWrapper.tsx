import React, { ReactNode, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS } from 'react-native-reanimated';
import { useRouter, usePathname } from 'expo-router';

// Define tab order for navigation
const TAB_ORDER = ['/(tabs)', '/(tabs)/foryou', '/(tabs)/forlater', '/(tabs)/search'] as const;

// Map of pathname patterns to tab indices for robust matching
const PATHNAME_TO_TAB_INDEX: Record<string, number> = {
  '/': 0,
  '/(tabs)': 0,
  '/(tabs)/index': 0,
  '/(tabs)/foryou': 1,
  '/foryou': 1,
  '/(tabs)/forlater': 2,
  '/forlater': 2,
  '/(tabs)/search': 3,
  '/search': 3,
};

// Swipe configuration
const SWIPE_THRESHOLD = 50; // Minimum horizontal distance to trigger navigation
const VELOCITY_THRESHOLD = 500; // Minimum velocity to trigger navigation

interface SwipeableTabWrapperProps {
  children: ReactNode;
}

export function SwipeableTabWrapper({ children }: SwipeableTabWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navigateToTab = useCallback((direction: 'left' | 'right') => {
    // Find current tab index using the pathname map
    const currentIndex = PATHNAME_TO_TAB_INDEX[pathname];
    
    // If pathname is not recognized, don't navigate to prevent unexpected behavior
    if (currentIndex === undefined) {
      if (__DEV__) {
        console.warn(`SwipeableTabWrapper: Unknown pathname "${pathname}". Swipe navigation disabled for this route.`);
      }
      return;
    }

    // Calculate target index based on swipe direction
    const targetIndex = direction === 'left' 
      ? currentIndex + 1 
      : currentIndex - 1;

    // Check bounds
    if (targetIndex < 0 || targetIndex >= TAB_ORDER.length) {
      return;
    }

    // Navigate to target tab
    router.replace(TAB_ORDER[targetIndex]);
  }, [pathname, router]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20]) // Activate after moving 20px horizontally
    .failOffsetY([-20, 20]) // Fail if moving more than 20px vertically
    .onEnd((event) => {
      const { translationX, velocityX } = event;
      
      // Check if swipe meets threshold (either by distance or velocity)
      const isValidSwipe = 
        Math.abs(translationX) > SWIPE_THRESHOLD || 
        Math.abs(velocityX) > VELOCITY_THRESHOLD;
      
      if (!isValidSwipe) {
        return;
      }

      // Determine swipe direction
      const direction = translationX < 0 ? 'left' : 'right';
      runOnJS(navigateToTab)(direction);
    });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={styles.container}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
