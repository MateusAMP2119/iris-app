import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows, animations } from '../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

interface NewsCardProps {
  imageUrl: string | null;
  source: string | null;
  headline: string;
  date: string;
  isBookmarked: boolean;
  onPress: () => void;
  onBookmark: () => void;
  featured?: boolean;
  compact?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function NewsCard({
  imageUrl,
  source,
  headline,
  date,
  isBookmarked,
  onPress,
  onBookmark,
  featured = false,
  compact = false,
}: NewsCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(animations.cardPressScale, {
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

  const cardWidth = compact
    ? (screenWidth - spacing.md * 3) / 2
    : screenWidth - spacing.md * 2;

  const imageHeight = featured ? 200 : compact ? 100 : 180;

  return (
    <AnimatedPressable
      style={[
        styles.card,
        animatedStyle,
        { width: compact ? cardWidth : '100%' },
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={[styles.image, { height: imageHeight }]}
            contentFit="cover"
            transition={200}
            placeholder={colors.secondary.gray200}
          />
        ) : (
          <View
            style={[
              styles.imagePlaceholder,
              { height: imageHeight },
            ]}
          >
            <Ionicons
              name="newspaper-outline"
              size={32}
              color={colors.secondary.gray400}
            />
          </View>
        )}

        {/* Source Badge */}
        {source && (
          <View style={styles.sourceBadge}>
            <Text style={styles.sourceText} numberOfLines={1}>
              {source}
            </Text>
          </View>
        )}

        {/* Bookmark Button */}
        <Pressable
          style={styles.bookmarkButton}
          onPress={(e) => {
            e.stopPropagation();
            onBookmark();
          }}
          hitSlop={8}
        >
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={isBookmarked ? colors.accent.primary : colors.primary.background}
          />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text
          style={[
            styles.headline,
            compact && styles.headlineCompact,
          ]}
          numberOfLines={compact ? 2 : 3}
        >
          {headline}
        </Text>
        <Text style={styles.date}>{date}</Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.semantic.cardBackground,
    borderRadius: borderRadius.md,
    ...shadows.card,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    backgroundColor: colors.secondary.gray200,
  },
  imagePlaceholder: {
    width: '100%',
    backgroundColor: colors.secondary.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sourceBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    maxWidth: '60%',
  },
  sourceText: {
    color: colors.primary.background,
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
  },
  bookmarkButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: spacing.md,
  },
  headline: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    lineHeight: typography.title.lineHeight,
    color: colors.primary.text,
    marginBottom: spacing.sm,
  },
  headlineCompact: {
    fontSize: 16,
    lineHeight: 21,
  },
  date: {
    fontSize: typography.caption.fontSize,
    color: typography.caption.color,
  },
});

export default NewsCard;
