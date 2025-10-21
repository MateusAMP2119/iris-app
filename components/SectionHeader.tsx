import { View, Text, Pressable, StyleSheet } from 'react-native';
import { AppColors, AppTextStyles, AppSpacing } from '../theme';
import React from 'react';

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
    borderWidth: 2,
    borderColor: AppColors.primaryText,
    paddingVertical: AppSpacing.sm,
    paddingHorizontal: AppSpacing.md,
  },
  title: {
    ...AppTextStyles.labelLarge,
    color: '#FFFFFF',
    letterSpacing: 2,
    fontWeight: '800',
    flex: 1,
  },
  seeAllButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: AppSpacing.sm,
    paddingVertical: AppSpacing.xs / 2,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  seeAllText: {
    ...AppTextStyles.labelSmall,
    color: AppColors.primaryText,
    letterSpacing: 1,
    fontWeight: '700',
  },
  subtitle: {
    ...AppTextStyles.caption,
    color: AppColors.gray600,
    fontStyle: 'italic',
    paddingHorizontal: AppSpacing.xs,
    marginTop: AppSpacing.xs,
  },
});
