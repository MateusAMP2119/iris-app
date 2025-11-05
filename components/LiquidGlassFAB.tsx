import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { AppColors, LiquidGlassConfig } from '../theme';

// Gracefully handle LiquidGlass import for compatibility
let LiquidGlassContainerView: any = View;
let LiquidGlassView: any = View;
let isLiquidGlassSupported = false;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const liquidGlass = require('@callstack/liquid-glass');
  LiquidGlassContainerView = liquidGlass.LiquidGlassContainerView || View;
  LiquidGlassView = liquidGlass.LiquidGlassView || View;
  isLiquidGlassSupported = liquidGlass.isLiquidGlassSupported || false;
} catch {
  // LiquidGlass not available on this platform/version
  console.warn('LiquidGlass not available, using fallback');
}

interface LiquidGlassFABProps {
  isExpanded: boolean;
  onToggle: () => void;
  onSearchTap: () => void;
  onFilterTap: () => void;
}

export function LiquidGlassFAB({
  isExpanded,
  onToggle,
  onSearchTap,
  onFilterTap,
}: LiquidGlassFABProps) {
  const [spacingValue, setSpacingValue] = React.useState(0);
  const spacing = React.useRef(new Animated.Value(0)).current;
  const searchOpacity = React.useRef(new Animated.Value(0)).current;
  const searchScale = React.useRef(new Animated.Value(0)).current;
  const filterOpacity = React.useRef(new Animated.Value(0)).current;
  const filterScale = React.useRef(new Animated.Value(0)).current;
  const shadowOpacity = React.useRef(new Animated.Value(0.1)).current;
  const shadowRadius = React.useRef(new Animated.Value(20)).current;
  const shadowOffsetY = React.useRef(new Animated.Value(6)).current;

  // Set up listener only once
  React.useEffect(() => {
    const listenerId = spacing.addListener(({ value }) => {
      setSpacingValue(value);
    });

    return () => {
      spacing.removeListener(listenerId);
    };
  }, [spacing]);

  // Handle animations separately
  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(spacing, {
        toValue: isExpanded ? 12 : 0,
        tension: 40,
        friction: 7,
        useNativeDriver: false,
      }),
      Animated.spring(searchOpacity, {
        toValue: isExpanded ? 1 : 0,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(searchScale, {
        toValue: isExpanded ? 1 : 0,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(filterOpacity, {
        toValue: isExpanded ? 1 : 0,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(filterScale, {
        toValue: isExpanded ? 1 : 0,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(shadowOpacity, {
        toValue: isExpanded ? 0.15 : 0.1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(shadowRadius, {
        toValue: isExpanded ? 30 : 20,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(shadowOffsetY, {
        toValue: isExpanded ? 10 : 6,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [
    isExpanded,
    spacing,
    searchOpacity,
    searchScale,
    filterOpacity,
    filterScale,
    shadowOpacity,
    shadowRadius,
    shadowOffsetY,
  ]);

  const animatedShadowStyle = {
    shadowOpacity,
    shadowRadius,
    shadowOffset: {
      width: 0,
      height: shadowOffsetY,
    },
  };

  return (
    <Animated.View style={[styles.container, animatedShadowStyle]}>
      <LiquidGlassContainerView spacing={spacingValue}>
        {/* Search button circle */}
        <Animated.View
          style={{
            opacity: searchOpacity,
            transform: [{ scale: searchScale }],
          }}
          pointerEvents={isExpanded ? 'auto' : 'none'}
        >
          <LiquidGlassView
            effect={LiquidGlassConfig.effect}
            interactive
            style={[
              styles.circle,
              !isLiquidGlassSupported && styles.circleFallback,
            ]}
          >
            <Pressable style={styles.button} onPress={onSearchTap}>
              <Ionicons name="search" size={24} color={AppColors.primaryText} />
            </Pressable>
          </LiquidGlassView>
        </Animated.View>

        {/* Filter button circle */}
        <Animated.View
          style={{
            opacity: filterOpacity,
            transform: [{ scale: filterScale }],
          }}
          pointerEvents={isExpanded ? 'auto' : 'none'}
        >
          <LiquidGlassView
            effect={LiquidGlassConfig.effect}
            interactive
            style={[
              styles.circle,
              !isLiquidGlassSupported && styles.circleFallback,
            ]}
          >
            <Pressable style={styles.button} onPress={onFilterTap}>
              <Ionicons name="filter" size={24} color={AppColors.primaryText} />
            </Pressable>
          </LiquidGlassView>
        </Animated.View>

        {/* Main toggle button circle */}
        <LiquidGlassView
          effect={LiquidGlassConfig.effect}
          interactive
          style={[
            styles.circle,
            !isLiquidGlassSupported && styles.circleFallback,
          ]}
        >
          <Pressable style={styles.button} onPress={onToggle}>
            <Ionicons
              name={isExpanded ? 'close' : 'ellipsis-horizontal'}
              size={24}
              color={AppColors.primaryText}
            />
          </Pressable>
        </LiquidGlassView>
      </LiquidGlassContainerView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    elevation: 8,
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  circleFallback: {
    backgroundColor: LiquidGlassConfig.fallbackBackgroundColor,
  },
  button: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
