import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { colors, typography, spacing, sizes } from '../constants/theme';

interface SourceAvatarProps {
  sourceName: string;
  logoUrl?: string;
  isFollowing: boolean;
  onPress: () => void;
}

export function SourceAvatar({
  sourceName,
  logoUrl,
  isFollowing,
  onPress,
}: SourceAvatarProps) {
  // Generate initials from source name
  const initials = sourceName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View
        style={[
          styles.avatarContainer,
          isFollowing && styles.avatarFollowing,
        ]}
      >
        {logoUrl ? (
          <Image
            source={{ uri: logoUrl }}
            style={styles.avatar}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={styles.initialsContainer}>
            <Text style={styles.initials}>{initials}</Text>
          </View>
        )}
      </View>
      <Text style={styles.sourceName} numberOfLines={1}>
        {sourceName}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: (sizes.avatarMedium + spacing.md),
  },
  avatarContainer: {
    width: sizes.avatarMedium,
    height: sizes.avatarMedium,
    borderRadius: sizes.avatarMedium / 2,
    overflow: 'hidden',
    backgroundColor: colors.secondary.gray200,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarFollowing: {
    borderColor: colors.accent.primary,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  initialsContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary.gray200,
  },
  initials: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary.gray600,
  },
  sourceName: {
    fontSize: typography.caption.fontSize,
    fontWeight: '400',
    color: colors.primary.text,
    textAlign: 'center',
    maxWidth: sizes.avatarMedium + spacing.sm,
  },
});

export default SourceAvatar;
