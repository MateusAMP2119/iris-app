import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Category } from '../models';
import { AppColors, AppSpacing, AppTextStyles } from '../theme';

interface CategoryChipProps {
  category: Category;
  isSelected?: boolean;
  onTap?: () => void;
}

export default function CategoryChip({ category, isSelected, onTap }: CategoryChipProps) {
  return (
    <Pressable onPress={onTap} style={[styles.chip]}>
      <Text style={[styles.chipText]}>
        {category.name.toUpperCase()}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: AppSpacing.md,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: AppColors.primaryText,
    backgroundColor: AppColors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chipText: {
    ...AppTextStyles.labelSmall,
    color: AppColors.primaryText,
    letterSpacing: 1.5,
    fontWeight: '800',
  },
  chipTextSelected: {
    color: AppColors.surface,
  },
});
