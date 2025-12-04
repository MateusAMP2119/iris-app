import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { borderRadius, colors, layout, sizes, spacing, typography } from '../../lib/constants';
import { Article, getTimeAgo } from '../../models';
import { useSavedArticles } from '../../src/contexts';
import { SavedArticle } from '../../src/types';

// Configuration constants for FAB menu
const FAB_SIZE = 56; // Size of the main FAB button
const FAB_OPTION_SIZE = 48; // Size of the option buttons
const FAB_OPTION_SPACING = 12; // Spacing between option buttons

// Type guard to check if article is a full Article
function isFullArticle(article: Article | SavedArticle): article is Article {
  return 'content' in article && 'authors' in article && 'categories' in article;
}

interface ArticleModalProps {
  article: Article | SavedArticle | null;
  visible: boolean;
  onClose: () => void;
}

export function ArticleModal({ article, visible, onClose }: ArticleModalProps) {
  const { isArticleSaved, saveArticle, removeArticle } = useSavedArticles();
  
  // State and animation for FAB menu expansion
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuAnimation = useRef(new Animated.Value(0)).current;
  
  // Toggle the FAB menu open/closed
  const toggleMenu = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const toValue = isMenuOpen ? 0 : 1;
    setIsMenuOpen(!isMenuOpen);
    
    Animated.spring(menuAnimation, {
      toValue,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  }, [isMenuOpen, menuAnimation]);
  
  // Close menu when modal closes
  const handleClose = useCallback(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      menuAnimation.setValue(0);
    }
    onClose();
  }, [isMenuOpen, menuAnimation, onClose]);

  const handleBookmark = useCallback(async () => {
    if (!article) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isArticleSaved(article.articleId)) {
      await removeArticle(article.articleId);
    } else if (isFullArticle(article)) {
      // Only full Articles can be saved (SavedArticles are already saved and 
      // only appear in the For Later screen where they can be removed)
      await saveArticle(article);
    }
  }, [article, isArticleSaved, saveArticle, removeArticle]);

  const handleShare = useCallback(async () => {
    if (!article) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const url = isFullArticle(article) ? article.url : '';
      await Share.share({
        title: article.title,
        message: url ? `${article.title}\n\n${url}` : article.title,
        url: url || undefined,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }, [article]);

  const handleOpenSource = useCallback(() => {
    if (article && isFullArticle(article) && article.url) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Linking.openURL(article.url);
    }
  }, [article]);

  if (!article) return null;

  const bookmarked = isArticleSaved(article.articleId);
  
  // Get author names only for full Article type
  const authorNames = isFullArticle(article)
    ? article.authors.map((a) => `${a.firstName} ${a.lastName}`).join(', ')
    : '';

  // Get source logo - different paths for Article vs SavedArticle
  const sourceLogo = isFullArticle(article) ? article.source?.logo : article.sourceLogo;
  
  // Check if we have content to show
  const hasContent = isFullArticle(article) && article.content;
  const hasCategories = isFullArticle(article) && article.categories?.length > 0;
  const hasUrl = isFullArticle(article) && article.url;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
      <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color={colors.primary.text} />
          </Pressable>
          <View style={styles.headerActions}>
            <Pressable style={styles.headerButton} onPress={handleBookmark}>
              <Ionicons
                name={bookmarked ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color={bookmarked ? colors.accent.primary : colors.primary.text}
              />
            </Pressable>
            <Pressable style={styles.headerButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color={colors.primary.text} />
            </Pressable>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Image */}
          {article.imgUrl && (
            <Image
              source={{ uri: article.imgUrl }}
              style={styles.heroImage}
              contentFit="cover"
              transition={200}
            />
          )}

          <View style={styles.articleContent}>
            {/* Source Info */}
            {sourceLogo && (
              <Pressable 
                style={styles.sourceContainer} 
                onPress={hasUrl ? handleOpenSource : undefined}
                accessibilityRole={hasUrl ? 'button' : undefined}
                accessibilityLabel={hasUrl ? 'Open source website' : undefined}
              >
                <Image
                  source={{ uri: sourceLogo }}
                  style={styles.sourceLogo}
                  contentFit="contain"
                  transition={200}
                />
                {hasUrl && (
                  <Ionicons
                    name="open-outline"
                    size={14}
                    color={colors.accent.primary}
                    style={styles.externalIcon}
                  />
                )}
              </Pressable>
            )}

            {/* Categories */}
            {hasCategories && isFullArticle(article) && (
              <View style={styles.categoriesRow}>
                {article.categories.map((cat) => (
                  <View key={cat.categoryId} style={styles.categoryChip}>
                    <Text style={styles.categoryText}>{cat.categoryName}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Title */}
            <Text style={styles.title}>{article.title}</Text>

            {/* Subtitle */}
            {article.subtitle && (
              <Text style={styles.subtitle}>{article.subtitle}</Text>
            )}

            {/* Meta Info */}
            <View style={styles.metaRow}>
              {authorNames ? (
                <Text style={styles.author}>By {authorNames}</Text>
              ) : null}
              <Text style={styles.date}>
                {getTimeAgo(article.publicationDate)}
              </Text>
            </View>

            {/* Divider - only show if we have content */}
            {hasContent && <View style={styles.divider} />}

            {/* Article Content */}
            {hasContent && isFullArticle(article) && (
              <Text style={styles.bodyText}>{article.content}</Text>
            )}
          </View>
        </ScrollView>

        {/* Floating Action Button Menu */}
        <View style={styles.fabContainer}>
          {/* Option Buttons - appear when menu is open */}
          
          {/* Read Full Button - only show if we have a URL */}
          {hasUrl && (
            <Animated.View 
              style={[
                styles.fabOptionWrapper,
                {
                  transform: [
                    { 
                      translateY: menuAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -(FAB_OPTION_SIZE + FAB_OPTION_SPACING) * 3],
                      })
                    },
                    { 
                      scale: menuAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      })
                    },
                  ],
                  opacity: menuAnimation,
                }
              ]}
            >
              <LiquidGlassView 
                style={[
                  styles.fabOption,
                  !isLiquidGlassSupported && styles.fallbackBackground,
                ]}
                effect="regular"
              >
                <Pressable 
                  style={styles.fabOptionInner} 
                  onPress={() => {
                    handleOpenSource();
                    toggleMenu();
                  }}
                  accessibilityLabel="Read full article"
                >
                  <Ionicons name="open-outline" size={24} color={colors.primary.text} />
                </Pressable>
              </LiquidGlassView>
            </Animated.View>
          )}
          
          {/* Share Button */}
          <Animated.View 
            style={[
              styles.fabOptionWrapper,
              {
                transform: [
                  { 
                    translateY: menuAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -(FAB_OPTION_SIZE + FAB_OPTION_SPACING) * 2],
                    })
                  },
                  { 
                    scale: menuAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    })
                  },
                ],
                opacity: menuAnimation,
              }
            ]}
          >
            <LiquidGlassView 
              style={[
                styles.fabOption,
                !isLiquidGlassSupported && styles.fallbackBackground,
              ]}
              effect="regular"
            >
              <Pressable 
                style={styles.fabOptionInner} 
                onPress={() => {
                  handleShare();
                  toggleMenu();
                }}
                accessibilityLabel="Share article"
              >
                <Ionicons name="share-outline" size={24} color={colors.primary.text} />
              </Pressable>
            </LiquidGlassView>
          </Animated.View>
          
          {/* Save Button */}
          <Animated.View 
            style={[
              styles.fabOptionWrapper,
              {
                transform: [
                  { 
                    translateY: menuAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -(FAB_OPTION_SIZE + FAB_OPTION_SPACING)],
                    })
                  },
                  { 
                    scale: menuAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    })
                  },
                ],
                opacity: menuAnimation,
              }
            ]}
          >
            <LiquidGlassView 
              style={[
                styles.fabOption,
                !isLiquidGlassSupported && styles.fallbackBackground,
              ]}
              effect="regular"
            >
              <Pressable 
                style={styles.fabOptionInner} 
                onPress={() => {
                  handleBookmark();
                  toggleMenu();
                }}
                accessibilityLabel={bookmarked ? 'Remove from saved' : 'Save article'}
              >
                <Ionicons 
                  name={bookmarked ? 'bookmark' : 'bookmark-outline'} 
                  size={24} 
                  color={bookmarked ? colors.accent.primary : colors.primary.text} 
                />
              </Pressable>
            </LiquidGlassView>
          </Animated.View>
          
          {/* Main FAB Button */}
          <LiquidGlassView 
            style={[
              styles.fab,
              !isLiquidGlassSupported && styles.fallbackBackground,
            ]}
            effect="regular"
          >
            <Pressable 
              style={styles.fabInner} 
              onPress={toggleMenu}
              accessibilityLabel={isMenuOpen ? 'Close options menu' : 'Open options menu'}
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: menuAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '45deg'],
                      }),
                    },
                  ],
                }}
              >
                <Ionicons name="add" size={28} color={colors.primary.text} />
              </Animated.View>
            </Pressable>
          </LiquidGlassView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.semantic.cardBackground,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    paddingTop: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.semantic.divider,
  },
  headerButton: {
    width: sizes.touchTarget,
    height: sizes.touchTarget,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  heroImage: {
    width: '100%',
    height: 250,
    backgroundColor: colors.secondary.gray200,
  },
  articleContent: {
    padding: layout.screenPaddingHorizontal,
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  sourceLogo: {
    height: 18,
    width: 100,
  },
  externalIcon: {
    marginLeft: spacing.xs,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  categoryChip: {
    backgroundColor: colors.secondary.gray100,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.secondary.gray600,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: typography.titleLarge.fontSize + 4,
    fontWeight: typography.titleLarge.fontWeight,
    color: colors.primary.text,
    lineHeight: 34,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.secondary.gray600,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  metaRow: {
    marginBottom: spacing.md,
  },
  author: {
    fontSize: typography.caption.fontSize,
    color: colors.primary.text,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: typography.caption.fontSize,
    color: colors.secondary.gray400,
  },
  divider: {
    height: 1,
    backgroundColor: colors.semantic.divider,
    marginVertical: spacing.lg,
  },
  bodyText: {
    fontSize: typography.body.fontSize,
    lineHeight: 28,
    color: colors.primary.text,
    marginBottom: spacing.xl,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.text,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  readMoreText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.primary.background,
  },

  // Floating Action Button (FAB) Menu
  fabContainer: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    alignItems: 'center',
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    overflow: 'hidden',
  },
  fabInner: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabOptionWrapper: {
    position: 'absolute',
    bottom: 0,
  },
  fabOption: {
    width: FAB_OPTION_SIZE,
    height: FAB_OPTION_SIZE,
    borderRadius: FAB_OPTION_SIZE / 2,
    overflow: 'hidden',
  },
  fabOptionInner: {
    width: FAB_OPTION_SIZE,
    height: FAB_OPTION_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Fallback background for devices that don't support liquid glass.
  // Uses the card background color with 85% opacity to mimic the glass effect.
  fallbackBackground: {
    backgroundColor: `${colors.semantic.cardBackground}D9`, // D9 is hex for ~85% opacity
  },
});
