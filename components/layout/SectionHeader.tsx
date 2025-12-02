import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../lib/constants';

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
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {(showChevron || onViewMore) && (
          <Ionicons
            name="chevron-forward"
            size={28}
            color={colors.primary.text}
            style={styles.chevron}
          />
        )}
      </View>
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    fontSize: typography.titleLarge.fontSize,
    fontWeight: typography.titleLarge.fontWeight,
    color: colors.primary.text,
  },
  chevron: {
    marginLeft: 2,
  },
});

export default SectionHeader;
