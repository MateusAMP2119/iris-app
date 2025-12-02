import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Text, TouchableOpacity, View } from 'react-native';
import { colors, sizes } from '../constants/theme';
import { useTabBarVisibility } from '../contexts';

// Configuration constants
const TAB_BAR_HIDE_OFFSET = 120; // Distance to translate when hiding
const PILL_WIDTH_RATIO = 0.7; // Pill width as a ratio of tab width

interface TabMeasurement {
  x: number;
  width: number;
}

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
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
    <Animated.View>
      <LiquidGlassView effect="regular">
        <View>
          {/* Animated Pill Indicator */}
          {isLayoutReady && (
            <Animated.View>
              {isLiquidGlassSupported && (
                <LiquidGlassView
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
              >
                {options.tabBarIcon?.({ focused: isFocused, color, size: sizes.tabBarIconSize })}
                <Text>
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
