import React, { ReactNode, useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector, GestureStateChangeEvent, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { useRouter, usePathname } from 'expo-router';
import * as Haptics from 'expo-haptics';

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
const SWIPE_THRESHOLD = 80; // Minimum horizontal distance to trigger navigation
const VELOCITY_THRESHOLD = 800; // Minimum velocity to trigger navigation

// Debug logging helper
const logDebug = (message: string, data?: Record<string, unknown>) => {
  console.log(`[SwipeableTabWrapper] ${message}`, data ? JSON.stringify(data, null, 2) : '');
};

interface SwipeableTabWrapperProps {
  children: ReactNode;
}

export function SwipeableTabWrapper({ children }: SwipeableTabWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isNavigating = useRef(false);

  logDebug('Component rendered', { pathname });

  const navigateToTab = useCallback((direction: 'left' | 'right') => {
    logDebug('navigateToTab called', { direction, isNavigating: isNavigating.current });
    
    // Prevent multiple navigations
    if (isNavigating.current) {
      logDebug('Navigation blocked - already navigating');
      return;
    }
    
    // Find current tab index using the pathname map
    const currentIndex = PATHNAME_TO_TAB_INDEX[pathname];
    logDebug('Current tab index lookup', { pathname, currentIndex });
    
    // If pathname is not recognized, don't navigate to prevent unexpected behavior
    if (currentIndex === undefined) {
      logDebug('Unknown pathname - navigation disabled', { pathname, knownPaths: Object.keys(PATHNAME_TO_TAB_INDEX) });
      return;
    }

    // Calculate target index based on swipe direction
    const targetIndex = direction === 'left' 
      ? currentIndex + 1 
      : currentIndex - 1;

    logDebug('Target index calculated', { currentIndex, targetIndex, direction });

    // Check bounds
    if (targetIndex < 0 || targetIndex >= TAB_ORDER.length) {
      logDebug('Target index out of bounds', { targetIndex, tabOrderLength: TAB_ORDER.length });
      return;
    }

    // Prevent rapid navigation
    isNavigating.current = true;
    setTimeout(() => {
      isNavigating.current = false;
    }, 300);

    const targetRoute = TAB_ORDER[targetIndex];
    logDebug('Navigating to tab', { targetRoute, targetIndex });

    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Navigate to target tab
    router.replace(targetRoute);
  }, [pathname, router]);

  const handleGestureEnd = useCallback((event: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
    const { translationX, translationY, velocityX, velocityY } = event;
    
    logDebug('Gesture ended', {
      translationX: Math.round(translationX),
      translationY: Math.round(translationY),
      velocityX: Math.round(velocityX),
      velocityY: Math.round(velocityY),
    });
    
    // Ensure this is primarily a horizontal swipe (not vertical scrolling)
    const isHorizontalSwipe = Math.abs(translationX) > Math.abs(translationY) * 1.5;
    
    logDebug('Horizontal swipe check', {
      isHorizontalSwipe,
      absTranslationX: Math.abs(translationX),
      absTranslationY: Math.abs(translationY),
      threshold: Math.abs(translationY) * 1.5,
    });
    
    if (!isHorizontalSwipe) {
      logDebug('Rejected - not a horizontal swipe');
      return;
    }
    
    // Check if swipe meets threshold (either by distance or velocity)
    const meetsDistanceThreshold = Math.abs(translationX) > SWIPE_THRESHOLD;
    const meetsVelocityThreshold = Math.abs(velocityX) > VELOCITY_THRESHOLD;
    const isValidSwipe = meetsDistanceThreshold || meetsVelocityThreshold;
    
    logDebug('Swipe validation', {
      meetsDistanceThreshold,
      meetsVelocityThreshold,
      isValidSwipe,
      SWIPE_THRESHOLD,
      VELOCITY_THRESHOLD,
    });
    
    if (!isValidSwipe) {
      logDebug('Rejected - swipe does not meet threshold');
      return;
    }

    // Determine swipe direction
    const direction = translationX < 0 ? 'left' : 'right';
    logDebug('Swipe direction determined', { direction, translationX });
    
    navigateToTab(direction);
  }, [navigateToTab]);

  const handleGestureStart = useCallback(() => {
    logDebug('Gesture started');
  }, []);

  const handleGestureUpdate = useCallback((event: { translationX: number; translationY: number }) => {
    // Only log occasionally to avoid spam
    if (Math.abs(event.translationX) > 10 || Math.abs(event.translationY) > 10) {
      logDebug('Gesture update', {
        translationX: Math.round(event.translationX),
        translationY: Math.round(event.translationY),
      });
    }
  }, []);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(handleGestureStart)();
    })
    .onUpdate((event) => {
      runOnJS(handleGestureUpdate)(event);
    })
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
