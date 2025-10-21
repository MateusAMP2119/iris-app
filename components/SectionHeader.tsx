import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppColors, AppSpacing, AppTextStyles } from '../theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  onSeeAllPress?: () => void;
}

export default function SectionHeader({ title, subtitle, onSeeAllPress }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Classic newspaper section header with black background */}
      <View style={styles.header}>
        <Text style={styles.title}>{title.toUpperCase()}</Text>
        {onSeeAllPress && (
          <Pressable onPress={onSeeAllPress} style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>VIEW ALL</Text>
          </Pressable>
        )}
      </View>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.primaryText,
    borderWidth: 3,
    borderColor: AppColors.primaryText,
    paddingVertical: AppSpacing.sm,
    paddingHorizontal: AppSpacing.md,
  },
  title: {
    ...AppTextStyles.labelLarge,
    color: AppColors.surface,
    letterSpacing: 2.5,
    fontWeight: '900',
    flex: 1,
  },
  seeAllButton: {
    backgroundColor: AppColors.surface,
    paddingHorizontal: AppSpacing.sm,
    paddingVertical: AppSpacing.xs / 2,
    borderWidth: 2,
    borderColor: AppColors.surface,
  },
  seeAllText: {
    ...AppTextStyles.labelSmall,
    color: AppColors.primaryText,
    letterSpacing: 1.2,
    fontWeight: '800',
  },
  subtitle: {
    ...AppTextStyles.caption,
    color: AppColors.gray600,
    fontStyle: 'italic',
    paddingHorizontal: AppSpacing.xs,
    marginTop: AppSpacing.xs,
  },
});
