import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, sizes, spacing } from '../../lib/constants';
import { useTabBarVisibility } from '../../src/contexts';

// Configuration constants
const TAB_BAR_HIDE_OFFSET = 120; // Distance to translate when hiding
const PILL_WIDTH_RATIO = 0.7; // Pill width as a ratio of tab width
const PILL_TOP_OFFSET = 4; // Distance from top of tab container

interface TabMeasurement {
  x: number;
  width: number;
}

export function LiquidGlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { isVisible } = useTabBarVisibility();
  
  // Animation for hiding/showing tab bar
  const translateY = useRef(new Animated.Value(0)).current;
  
  // Animation for the pill indicator
  const pillPosition = useRef(new Animated.Value(0)).current;
  const pillWidth = useRef(new Animated.Value(0)).current;
  
  // Store tab measurements
  const [tabMeasurements, setTabMeasurements] = useState<TabMeasurement[]>([]);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: isVisible ? 0 : TAB_BAR_HIDE_OFFSET,
      useNativeDriver: true,
      tension: 60,
      friction: 12,
    }).start();
  }, [isVisible, translateY]);

  useEffect(() => {
    if (isLayoutReady && tabMeasurements[state.index]) {
      const tab = tabMeasurements[state.index];
      const targetPillWidth = tab.width * PILL_WIDTH_RATIO;
      const targetPosition = tab.x + (tab.width - targetPillWidth) / 2;
      
      Animated.parallel([
        Animated.spring(pillPosition, {
          toValue: targetPosition,
          useNativeDriver: false,
          tension: 80,
          friction: 12,
        }),
        Animated.spring(pillWidth, {
          toValue: targetPillWidth,
          useNativeDriver: false,
          tension: 80,
          friction: 12,
        }),
      ]).start();
    }
  }, [state.index, isLayoutReady, tabMeasurements, pillPosition, pillWidth]);

  const handleTabLayout = (index: number) => (event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setTabMeasurements(prev => {
      const newMeasurements = [...prev];
      newMeasurements[index] = { x, width };
      
      // Check if all tabs have been measured
      if (newMeasurements.filter(Boolean).length === state.routes.length) {
        setIsLayoutReady(true);
        
        // Initialize pill position to first tab if not set
        if (!prev.length && newMeasurements[state.index]) {
          const tab = newMeasurements[state.index];
          const targetPillWidth = tab.width * PILL_WIDTH_RATIO;
          const targetPosition = tab.x + (tab.width - targetPillWidth) / 2;
          pillPosition.setValue(targetPosition);
          pillWidth.setValue(targetPillWidth);
        }
      }
      
      return newMeasurements;
    });
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <LiquidGlassView
        style={[
          styles.glassContainer,
          // Fallback for devices that don't support liquid glass (iOS < 26).
          // On supported devices, LiquidGlassView renders with the native glass effect.
          !isLiquidGlassSupported && styles.fallbackBackground,
        ]}
        effect="regular"
      >
        <View style={styles.tabContainer}>
          {/* Animated Pill Indicator */}
          {isLayoutReady && (
            <Animated.View
              style={[
                styles.pillIndicator,
                {
                  width: pillWidth,
                  left: pillPosition,
                },
                !isLiquidGlassSupported && styles.pillFallback,
              ]}
            >
              {isLiquidGlassSupported && (
                <LiquidGlassView
                  style={styles.pillGlass}
                  effect="clear"
                />
              )}
            </Animated.View>
          )}
          
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            const color = isFocused
              ? colors.accent.primary
              : colors.secondary.gray400;

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarButtonTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                onLayout={handleTabLayout(index)}
                style={styles.tabItem}
              >
                {options.tabBarIcon?.({ focused: isFocused, color, size: sizes.tabBarIconSize })}
                <Text
                  style={[
                    styles.label,
                    { color },
                    isFocused && styles.labelFocused,
                  ]}
                >
                  {typeof label === 'string' ? label : route.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </LiquidGlassView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  glassContainer: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 24,
    paddingVertical: spacing.sm,
  },
  // Fallback background for devices that don't support liquid glass.
  // Uses the card background color with 85% opacity to mimic the glass effect.
  fallbackBackground: {
    backgroundColor: `${colors.semantic.cardBackground}D9`, // D9 is hex for ~85% opacity
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'relative',
  },
  pillIndicator: {
    position: 'absolute',
    top: -PILL_TOP_OFFSET,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  pillGlass: {
    flex: 1,
    borderRadius: 16,
  },
  pillFallback: {
    backgroundColor: 'rgba(255, 45, 85, 0.15)',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    minHeight: 44,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  labelFocused: {
    fontWeight: '600',
  },
});
