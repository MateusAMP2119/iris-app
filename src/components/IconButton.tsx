import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, sizes } from '../constants/theme';

interface IconButtonProps {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export function IconButton({
  iconName,
  label,
  isActive,
  onPress,
}: IconButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={iconName}
          size={sizes.tabBarIconSize}
          color={isActive ? colors.accent.primary : colors.secondary.gray400}
        />
      </View>
      <Text
        style={[
          styles.label,
          isActive && styles.labelActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: sizes.touchTarget,
    minHeight: sizes.touchTarget,
    paddingHorizontal: spacing.sm,
  },
  iconContainer: {
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: typography.caption.fontSize,
    fontWeight: '500',
    color: colors.secondary.gray400,
  },
  labelActive: {
    color: colors.accent.primary,
  },
});

export default IconButton;
