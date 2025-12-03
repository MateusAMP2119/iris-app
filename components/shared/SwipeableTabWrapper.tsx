import React, { ReactNode, useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector, GestureStateChangeEvent, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { useRouter, usePathname } from 'expo-router';
import * as Haptics from 'expo-haptics';

// Define tab order for navigation
// Note: The first tab (index) uses '/' as its actual path, not '/index'
const TAB_ROUTES = ['/', '/forlater', '/search'] as const;

// Map of pathname patterns to tab indices for robust matching
const PATHNAME_TO_TAB_INDEX: Record<string, number> = {
  '/': 0,
  '/index': 0,
  '/(tabs)': 0,
  '/(tabs)/index': 0,
  '/forlater': 1,
  '/(tabs)/forlater': 1,
  '/search': 2,
  '/(tabs)/search': 2,
};

// Swipe configuration
const SWIPE_THRESHOLD = 80; // Minimum horizontal distance to trigger navigation
const VELOCITY_THRESHOLD = 800; // Minimum velocity to trigger navigation

interface SwipeableTabWrapperProps {
  children: ReactNode;
}

export function SwipeableTabWrapper({ children }: SwipeableTabWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isNavigating = useRef(false);

  const navigateToTab = useCallback((direction: 'left' | 'right') => {
    // Prevent multiple navigations
    if (isNavigating.current) {
      return;
    }
    
    // Find current tab index using the pathname map
    const currentIndex = PATHNAME_TO_TAB_INDEX[pathname];
    
    // If pathname is not recognized, don't navigate
    if (currentIndex === undefined) {
      return;
    }

    // Calculate target index based on swipe direction
    const targetIndex = direction === 'left' 
      ? currentIndex + 1 
      : currentIndex - 1;

    // Check bounds
    if (targetIndex < 0 || targetIndex >= TAB_ROUTES.length) {
      return;
    }

    // Prevent rapid navigation
    isNavigating.current = true;
    setTimeout(() => {
      isNavigating.current = false;
    }, 500);

    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Navigate to target tab
    router.navigate(TAB_ROUTES[targetIndex] as never);
  }, [pathname, router]);

  const handleGestureEnd = useCallback((event: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
    const { translationX, translationY, velocityX } = event;
    
    // Ensure this is primarily a horizontal swipe (not vertical scrolling)
    const isHorizontalSwipe = Math.abs(translationX) > Math.abs(translationY) * 1.5;
    if (!isHorizontalSwipe) {
      return;
    }
    
    // Check if swipe meets threshold (either by distance or velocity)
    const isValidSwipe = 
      Math.abs(translationX) > SWIPE_THRESHOLD || 
      Math.abs(velocityX) > VELOCITY_THRESHOLD;
    
    if (!isValidSwipe) {
      return;
    }

    // Determine swipe direction and navigate
    const direction = translationX < 0 ? 'left' : 'right';
    navigateToTab(direction);
  }, [navigateToTab]);

  const panGesture = Gesture.Pan()
    .onEnd((event) => {
      runOnJS(handleGestureEnd)(event);
    })
    .minDistance(10)
    .minPointers(1)
    .maxPointers(1)
    .activeOffsetX([-25, 25])
    .failOffsetY([-15, 15]);

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        {children}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
