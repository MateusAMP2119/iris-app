import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, sizes } from '../constants/theme';

export function LiquidGlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const paddingBottom = Math.max(insets.bottom, spacing.md);

  return (
    <View style={styles.container}>
      <LiquidGlassView
        style={[
          styles.glassContainer,
          { paddingBottom },
          // Fallback for devices that don't support liquid glass (iOS < 26).
          // On supported devices, LiquidGlassView renders with the native glass effect.
          !isLiquidGlassSupported && styles.fallbackBackground,
        ]}
        effect="regular"
      >
        <View style={styles.tabContainer}>
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
    </View>
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
    paddingTop: spacing.sm,
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
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    minHeight: 50,
  },
  label: {
    fontSize: 11,
    fontWeight: '400',
    marginTop: 4,
  },
  labelFocused: {
    fontWeight: '600',
  },
});
