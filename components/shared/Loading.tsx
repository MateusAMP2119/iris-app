import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { colors, spacing, borderRadius, shadows } from '../../lib/constants';

interface SkeletonCardProps {
  compact?: boolean;
}

export function SkeletonCard({ compact = false }: SkeletonCardProps) {
  const imageHeight = compact ? 100 : 180;

  return (
    <Animated.View
      style={[styles.card, compact && styles.cardCompact]}
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
    >
      <View style={[styles.imagePlaceholder, { height: imageHeight }]} />
      <View style={styles.content}>
        <View style={styles.titleLine} />
        <View style={[styles.titleLine, styles.titleLineShort]} />
        <View style={styles.dateLine} />
      </View>
    </Animated.View>
  );
}

export function LoadingIndicator() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.accent.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.semantic.cardBackground,
    borderRadius: borderRadius.md,
    ...shadows.card,
    overflow: 'hidden',
  },
  cardCompact: {
    flex: 1,
  },
  imagePlaceholder: {
    width: '100%',
    backgroundColor: colors.secondary.gray200,
  },
  content: {
    padding: spacing.md,
  },
  titleLine: {
    height: 16,
    backgroundColor: colors.secondary.gray200,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  titleLineShort: {
    width: '70%',
  },
  dateLine: {
    height: 12,
    width: '30%',
    backgroundColor: colors.secondary.gray200,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
});

export default SkeletonCard;
