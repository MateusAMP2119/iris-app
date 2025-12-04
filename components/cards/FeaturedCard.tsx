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
import { animations, borderRadius, colors, shadows, spacing, typography } from '../../lib/constants';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.85;

interface FeaturedCardProps {
  imageUrl: string | null;
  sourceLogo: string | null;
  headline: string;
  date: string;
  isBookmarked: boolean;
  onPress: () => void;
  onBookmark: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FeaturedCard({
  imageUrl,
  sourceLogo,
  headline,
  date,
  isBookmarked,
  onPress,
  onBookmark,
}: FeaturedCardProps) {
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

  return (
    <AnimatedPressable
      style={[styles.card, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {/* Image Section */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={200}
            placeholder={colors.secondary.gray100}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
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
        {/* Source Logo - Below image */}
        {sourceLogo && (
          <Image
            source={{ uri: sourceLogo }}
            style={styles.sourceLogo}
            contentFit="contain"
            transition={200}
          />
        )}
        
        <Text style={styles.headline} numberOfLines={2}>
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
    width: CARD_WIDTH,
    backgroundColor: colors.semantic.cardBackground,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
    ...shadows.card,
  },
  imageContainer: {
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
    overflow: 'hidden',
    padding: spacing.md - spacing.xs,
    paddingBottom: 0,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: colors.secondary.gray100,
    borderRadius: borderRadius.md,
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: colors.secondary.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  content: {
    padding: spacing.md,
  },
  sourceLogo: {
    height: 18,
    width: 100,
    marginLeft: -spacing.xs,
    marginBottom: spacing.sm,
  },
  headline: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    lineHeight: typography.title.lineHeight,
    color: colors.primary.text,
    marginBottom: spacing.sm,
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

export default FeaturedCard;
