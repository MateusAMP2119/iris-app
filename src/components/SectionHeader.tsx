import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../constants/theme';

interface SectionHeaderProps {
  title: string;
  onViewMore?: () => void;
  showChevron?: boolean;
}

export function SectionHeader({
  title,
  onViewMore,
  showChevron = false,
}: SectionHeaderProps) {
  const content = (
    <>
      <Text style={styles.title}>{title}</Text>
      {(showChevron || onViewMore) && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.secondary.gray600}
        />
      )}
    </>
  );

  if (onViewMore) {
    return (
      <Pressable style={styles.container} onPress={onViewMore}>
        {content}
      </Pressable>
    );
  }

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: typography.titleLarge.fontSize,
    fontWeight: typography.titleLarge.fontWeight,
    color: colors.primary.text,
  },
});

export default SectionHeader;
