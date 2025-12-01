import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { animations, borderRadius, colors, shadows, spacing, typography } from '../constants/theme';

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
      {/* Image Section */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={[styles.image, { height: imageHeight }]}
            contentFit="cover"
            transition={200}
            placeholder={colors.secondary.gray100}
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
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        {/* Source Label - Below image */}
        {source && (
          <Text style={styles.sourceText} numberOfLines={1}>
            {source}
          </Text>
        )}
        
        <Text
          style={[
            styles.headline,
            compact && styles.headlineCompact,
          ]}
          numberOfLines={compact ? 2 : 3}
        >
          {headline}
        </Text>
        
        <View style={styles.footer}>
          <Text style={styles.date}>{date}</Text>
          
          {/* Bookmark Button - Bottom right */}
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
              color={isBookmarked ? colors.accent.primary : colors.secondary.gray300}
            />
          </Pressable>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.semantic.cardBackground,
    borderRadius: borderRadius.md,
    ...shadows.card,
  },
  imageContainer: {
    position: 'relative',
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
    overflow: 'hidden',
    padding: spacing.md,
    paddingBottom: 0,
  },
  image: {
    width: '100%',
    backgroundColor: colors.secondary.gray100,
    borderRadius: borderRadius.md,
  },
  imagePlaceholder: {
    width: '100%',
    backgroundColor: colors.secondary.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: spacing.md,
  },
  sourceText: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.primary.text,
    marginBottom: spacing.sm,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: typography.caption.fontSize,
    color: typography.caption.color,
  },
  bookmarkButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -spacing.sm,
    marginBottom: -spacing.sm,
  },
});

export default NewsCard;
