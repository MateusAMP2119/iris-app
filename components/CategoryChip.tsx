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
    <Pressable onPress={onTap} style={[styles.chip, isSelected && styles.chipSelected]}>
      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
        {category.name.toUpperCase()}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: AppSpacing.md,
    paddingVertical: 3,
    borderWidth: 2,
    borderColor: AppColors.primaryText,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: AppColors.primaryText,
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
