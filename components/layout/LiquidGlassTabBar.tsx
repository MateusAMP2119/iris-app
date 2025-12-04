import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect } from 'react';
import { Pressable, StyleSheet, View, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabBarVisibility } from '../../src/contexts';
import { colors, sizes, animations } from '../../lib/constants';

// Only import GlassEffectContainer on iOS
let GlassEffectContainer: React.ComponentType<{ children: React.ReactNode; spacing?: number }> | null = null;
if (Platform.OS === 'ios') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    GlassEffectContainer = require('@expo/ui/swift-ui').GlassEffectContainer;
  } catch {
    // If import fails, GlassEffectContainer will be null
  }
}

interface TabButton {
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  label: string;
}

const TAB_BUTTONS: TabButton[] = [
  {
    route: '/',
    icon: 'today-outline',
    activeIcon: 'today',
    label: 'Today',
  },
  {
    route: '/forlater',
    icon: 'bookmark-outline',
    activeIcon: 'bookmark',
    label: 'For Later',
  },
  {
    route: '/search',
    icon: 'search-outline',
    activeIcon: 'search',
    label: 'Search',
  },
];

// Map pathnames to tab routes for matching
const PATHNAME_TO_ROUTE: Record<string, string> = {
  '/': '/',
  '/index': '/',
  '/(tabs)': '/',
  '/(tabs)/index': '/',
  '/forlater': '/forlater',
  '/(tabs)/forlater': '/forlater',
  '/search': '/search',
  '/(tabs)/search': '/search',
};

interface LiquidGlassButtonProps {
  tab: TabButton;
  isActive: boolean;
  onPress: () => void;
  index: number;
}

function LiquidGlassButton({ tab, isActive, onPress, index }: LiquidGlassButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, {
      damping: 15,
      stiffness: 300,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
  };

  const iconColor = isActive ? colors.accent.primary : colors.secondary.gray400;
  const iconName = isActive ? tab.activeIcon : tab.icon;

  // Use @expo/ui glass effect on iOS, fallback to blur on other platforms
  if (Platform.OS === 'ios') {
    return (
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.buttonPressable}
          accessibilityLabel={tab.label}
          accessibilityRole="button"
        >
          <View
            style={[
              styles.glassButton,
              isActive && styles.glassButtonActive,
            ]}
          >
            <Ionicons
              name={iconName}
              size={sizes.tabBarIconSize}
              color={iconColor}
            />
          </View>
        </Pressable>
      </Animated.View>
    );
  }

  // Fallback for non-iOS platforms
  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.buttonPressable}
        accessibilityLabel={tab.label}
        accessibilityRole="button"
      >
        <View style={[styles.fallbackButton, isActive && styles.fallbackButtonActive]}>
          <Ionicons
            name={iconName}
            size={sizes.tabBarIconSize}
            color={iconColor}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
}

export function LiquidGlassTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { isVisible } = useTabBarVisibility();

  // Animation values for visibility
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isVisible) {
      translateY.value = withTiming(0, {
        duration: animations.medium,
        easing: Easing.out(Easing.cubic),
      });
      opacity.value = withTiming(1, {
        duration: animations.fast,
      });
    } else {
      translateY.value = withTiming(100, {
        duration: animations.medium,
        easing: Easing.in(Easing.cubic),
      });
      opacity.value = withTiming(0, {
        duration: animations.fast,
      });
    }
  }, [isVisible, translateY, opacity]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const currentRoute = PATHNAME_TO_ROUTE[pathname] || '/';

  const handleTabPress = useCallback((route: string) => {
    // Only trigger haptic feedback and navigate if not already on this route
    if (route !== currentRoute) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.navigate(route as never);
    }
  }, [router, currentRoute]);

  const bottomPadding = Math.max(insets.bottom, 16);

  const renderButtons = () => (
    <View style={styles.buttonsWrapper}>
      {TAB_BUTTONS.map((tab, index) => (
        <View
          key={tab.route}
          style={styles.buttonWrapper}
        >
          <LiquidGlassButton
            tab={tab}
            isActive={currentRoute === tab.route}
            onPress={() => handleTabPress(tab.route)}
            index={index}
          />
        </View>
      ))}
    </View>
  );

  return (
    <Animated.View
      style={[
        styles.container,
        containerAnimatedStyle,
        { paddingBottom: bottomPadding },
      ]}
      pointerEvents={isVisible ? 'auto' : 'none'}
    >
      {Platform.OS === 'ios' && GlassEffectContainer ? (
        <GlassEffectContainer spacing={8}>
          {renderButtons()}
        </GlassEffectContainer>
      ) : (
        renderButtons()
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  buttonsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  buttonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    // iOS will apply the glass effect via the GlassEffectContainer
  },
  glassButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  fallbackButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  fallbackButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
});

export default LiquidGlassTabBar;
