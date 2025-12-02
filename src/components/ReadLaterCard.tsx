import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows, animations, sizes } from '../constants/theme';

interface ReadLaterCardProps {
  sourceLogo: string | null;
  headline: string;
  thumbnailUrl: string | null;
  date: string;
  onPress: () => void;
  onDelete: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ReadLaterCard({
  sourceLogo,
  headline,
  thumbnailUrl,
  date,
  onPress,
  onDelete,
}: ReadLaterCardProps) {
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
      <View style={styles.content}>
        {sourceLogo && (
          <Image
            source={{ uri: sourceLogo }}
            style={styles.sourceLogo}
            contentFit="contain"
            transition={200}
          />
        )}
        <Text style={styles.headline} numberOfLines={3}>
          {headline}
        </Text>
        <Text style={styles.date}>{date}</Text>
      </View>

      <View style={styles.rightSection}>
        {thumbnailUrl ? (
          <Image
            source={{ uri: thumbnailUrl }}
            style={styles.thumbnail}
            contentFit="cover"
            transition={200}
            placeholder={colors.secondary.gray200}
          />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <Ionicons
              name="newspaper-outline"
              size={24}
              color={colors.secondary.gray400}
            />
          </View>
        )}
        
        <Pressable
          style={styles.deleteButton}
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          hitSlop={8}
        >
          <Ionicons
            name="close-circle"
            size={22}
            color={colors.secondary.gray400}
          />
        </Pressable>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.semantic.cardBackground,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.card,
  },
  content: {
    flex: 1,
    marginRight: spacing.md,
    justifyContent: 'center',
  },
  sourceLogo: {
    height: 18,
    width: 100,
    marginBottom: spacing.xs,
  },
  headline: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    lineHeight: 22,
    color: colors.primary.text,
    marginBottom: spacing.sm,
  },
  date: {
    fontSize: typography.caption.fontSize,
    color: typography.caption.color,
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  thumbnail: {
    width: sizes.thumbnailMedium,
    height: sizes.thumbnailMedium,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.secondary.gray200,
  },
  thumbnailPlaceholder: {
    width: sizes.thumbnailMedium,
    height: sizes.thumbnailMedium,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.secondary.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    marginTop: spacing.sm,
    padding: spacing.xs,
  },
});

export default ReadLaterCard;
