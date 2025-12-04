import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Linking,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
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

// Configuration constants for scroll-based button hiding
const SCROLL_THRESHOLD = 10; // Minimum scroll distance to trigger hide/show
const INITIAL_SCROLL_OFFSET = 50; // Scroll position before hiding starts
const BUTTON_HIDE_OFFSET = 100; // Distance to translate buttons when hiding

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
  
  // Animation for hiding/showing action buttons on scroll
  const translateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  
  // Handle scroll events to show/hide buttons
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDiff = currentScrollY - lastScrollY.current;
    
    // Update last scroll position
    lastScrollY.current = currentScrollY;

    // Always show when at the top
    if (currentScrollY <= 0) {
      translateY.stopAnimation();
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 60,
        friction: 12,
      }).start();
      return;
    }

    // Only update visibility if we've scrolled past the threshold
    if (Math.abs(scrollDiff) > SCROLL_THRESHOLD && currentScrollY > INITIAL_SCROLL_OFFSET) {
      translateY.stopAnimation();
      if (scrollDiff > 0) {
        // Scrolling down - hide buttons
        Animated.spring(translateY, {
          toValue: BUTTON_HIDE_OFFSET,
          useNativeDriver: true,
          tension: 60,
          friction: 12,
        }).start();
      } else {
        // Scrolling up - show buttons
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 60,
          friction: 12,
        }).start();
      }
    }
  }, [translateY]);

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
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={onClose}>
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
          onScroll={handleScroll}
          scrollEventThrottle={16}
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

        {/* Floating Action Buttons with Liquid Glass */}
        <Animated.View 
          style={[
            styles.actionButtonsContainer,
            { transform: [{ translateY }] }
          ]}
        >
          {/* Save Button */}
          <LiquidGlassView 
            style={[
              styles.actionButton,
              !isLiquidGlassSupported && styles.fallbackBackground,
            ]}
            effect="regular"
          >
            <Pressable 
              style={styles.actionButtonInner} 
              onPress={handleBookmark}
              accessibilityLabel={bookmarked ? 'Remove from saved' : 'Save article'}
            >
              <Ionicons 
                name={bookmarked ? 'bookmark' : 'bookmark-outline'} 
                size={22} 
                color={bookmarked ? colors.accent.primary : colors.primary.text} 
              />
            </Pressable>
          </LiquidGlassView>

          {/* Share Button */}
          <LiquidGlassView 
            style={[
              styles.actionButton,
              !isLiquidGlassSupported && styles.fallbackBackground,
            ]}
            effect="regular"
          >
            <Pressable 
              style={styles.actionButtonInner} 
              onPress={handleShare}
              accessibilityLabel="Share article"
            >
              <Ionicons name="share-outline" size={22} color={colors.primary.text} />
            </Pressable>
          </LiquidGlassView>

          {/* Read Full Button - only show if we have a URL */}
          {hasUrl && (
            <LiquidGlassView 
              style={[
                styles.actionButton,
                !isLiquidGlassSupported && styles.fallbackBackground,
              ]}
              effect="regular"
            >
              <Pressable 
                style={styles.actionButtonInner} 
                onPress={handleOpenSource}
                accessibilityLabel="Read full article"
              >
                <Ionicons name="open-outline" size={22} />
              </Pressable>
            </LiquidGlassView>
          )}
        </Animated.View>
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

  // Floating Action Buttons
  actionButtonsContainer: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  actionButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  actionButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
    minHeight: 44,
  },
  actionButtonLabel: {
    fontSize: typography.caption.fontSize,
    fontWeight: '500',
    color: colors.primary.text,
  },
  actionButtonLabelActive: {
    fontWeight: '600',
    color: colors.accent.primary,
  },
  // Fallback background for devices that don't support liquid glass.
  // Uses the card background color with 85% opacity to mimic the glass effect.
  fallbackBackground: {
    backgroundColor: `${colors.semantic.cardBackground}D9`, // D9 is hex for ~85% opacity
  },
});
