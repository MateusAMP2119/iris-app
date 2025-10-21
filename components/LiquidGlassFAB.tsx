import React from 'react';
import { StyleSheet, Pressable, View, Animated } from 'react-native';
import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '../theme';

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
  const collapsedHeight = 56;
  const expandedHeight = 183;

  const animatedHeight = React.useRef(
    new Animated.Value(collapsedHeight)
  ).current;

  React.useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isExpanded ? expandedHeight : collapsedHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: animatedHeight,
          shadowOpacity: isExpanded ? 0.15 : 0.1,
          shadowRadius: isExpanded ? 30 : 20,
          shadowOffset: {
            width: 0,
            height: isExpanded ? 10 : 6,
          },
        },
      ]}
    >
      <LiquidGlassView
        interactive
        effect="clear"
        style={[
          styles.glassContainer,
          !isLiquidGlassSupported && { backgroundColor: 'rgba(255, 255, 255, 0.8)' }
        ]}
      >
        <View style={styles.content}>
          {/* Search button */}
          {isExpanded && (
            <Pressable
              style={[styles.button, styles.topButton]}
              onPress={onSearchTap}
            >
              <Ionicons
                name="search"
                size={24}
                color={AppColors.primaryText}
                style={{ opacity: 0.85 }}
              />
            </Pressable>
          )}

          {/* Separator */}
          {isExpanded && <View style={styles.separator} />}

          {/* Filter button */}
          {isExpanded && (
            <Pressable style={styles.button} onPress={onFilterTap}>
              <Ionicons
                name="filter"
                size={24}
                color={AppColors.primaryText}
                style={{ opacity: 0.85 }}
              />
            </Pressable>
          )}

          {/* Separator */}
          {isExpanded && <View style={styles.separator} />}

          {/* Main toggle button */}
          <Pressable
            style={[styles.button, styles.mainButton]}
            onPress={onToggle}
          >
            <Ionicons
              name={isExpanded ? 'close' : 'ellipsis-horizontal'}
              size={24}
              color={AppColors.primaryText}
              style={{ opacity: 0.85 }}
            />
          </Pressable>
        </View>
      </LiquidGlassView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 8,
  },
  glassContainer: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  button: {
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topButton: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  mainButton: {
    flex: 1,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  separator: {
    height: 1,
    marginHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});
