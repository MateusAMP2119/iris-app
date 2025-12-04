import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
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

// Configuration constants for the liquid glass tab bar
const PILL_WIDTH_RATIO = 0.7; // Pill width as a ratio of tab width
const PILL_TOP_OFFSET = 4; // Distance from top of tab container

interface TabMeasurement {
  x: number;
  width: number;
}

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
  
  // Animation for the pill indicator (similar to LiquidGlassTabBar)
  const pillPosition = useRef(new Animated.Value(0)).current;
  const pillWidth = useRef(new Animated.Value(0)).current;
  
  // Store tab measurements
  const [tabMeasurements, setTabMeasurements] = useState<TabMeasurement[]>([]);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  
  // Reset state when modal becomes visible
  useEffect(() => {
    if (visible) {
      setActiveTabIndex(0);
      setTabMeasurements([]);
      setIsLayoutReady(false);
    }
  }, [visible]);
  
  // Animate pill to the active tab
  useEffect(() => {
    if (isLayoutReady && tabMeasurements[activeTabIndex]) {
      const tab = tabMeasurements[activeTabIndex];
      const targetPillWidth = tab.width * PILL_WIDTH_RATIO;
      const targetPosition = tab.x + (tab.width - targetPillWidth) / 2;
      
      Animated.parallel([
        Animated.spring(pillPosition, {
          toValue: targetPosition,
          useNativeDriver: false,
          tension: 80,
          friction: 12,
        }),
        Animated.spring(pillWidth, {
          toValue: targetPillWidth,
          useNativeDriver: false,
          tension: 80,
          friction: 12,
        }),
      ]).start();
    }
  }, [activeTabIndex, isLayoutReady, tabMeasurements, pillPosition, pillWidth]);

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

  const handleShare = async () => {
    if (!article) return;
    
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
  };

  const handleOpenSource = () => {
    if (article && isFullArticle(article) && article.url) {
      Linking.openURL(article.url);
    }
  };
  
  // Handler for measuring tab positions (similar to LiquidGlassTabBar)
  const handleTabLayout = (index: number) => (event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setTabMeasurements(prev => {
      const newMeasurements = [...prev];
      newMeasurements[index] = { x, width };
      
      // Get the total number of tabs (varies based on hasUrl)
      const totalTabs = hasUrl ? 4 : 3;
      
      // Check if all tabs have been measured
      if (newMeasurements.filter(Boolean).length === totalTabs) {
        setIsLayoutReady(true);
        
        // Initialize pill position to first tab if not set
        if (!prev.length && newMeasurements[activeTabIndex]) {
          const tab = newMeasurements[activeTabIndex];
          const targetPillWidth = tab.width * PILL_WIDTH_RATIO;
          const targetPosition = tab.x + (tab.width - targetPillWidth) / 2;
          pillPosition.setValue(targetPosition);
          pillWidth.setValue(targetPillWidth);
        }
      }
      
      return newMeasurements;
    });
  };
  
  // Handle tab press with haptic feedback
  const handleTabPress = (index: number, action: () => void) => {
    setActiveTabIndex(index);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    action();
  };

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

            {/* Read More Button - only show if we have a URL */}
            {hasUrl && (
              <Pressable 
                style={styles.readMoreButton} 
                onPress={handleOpenSource}
                accessibilityRole="button"
                accessibilityLabel="Read full article"
              >
                <Text style={styles.readMoreText}>Read full article</Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={colors.primary.background}
                />
              </Pressable>
            )}
          </View>
        </ScrollView>

        {/* Bottom Navigation Bar with Liquid Glass */}
        <LiquidGlassView 
          style={[
            styles.bottomNavBar,
            !isLiquidGlassSupported && styles.fallbackBackground,
          ]}
          effect="regular"
        >
          <View style={styles.tabContainer}>
            {/* Animated Pill Indicator */}
            {isLayoutReady && (
              <Animated.View
                style={[
                  styles.pillIndicator,
                  {
                    width: pillWidth,
                    left: pillPosition,
                  },
                  !isLiquidGlassSupported && styles.pillFallback,
                ]}
              >
                {isLiquidGlassSupported && (
                  <LiquidGlassView
                    style={styles.pillGlass}
                    effect="clear"
                  />
                )}
              </Animated.View>
            )}
            
            <Pressable 
              style={styles.navItem} 
              onPress={() => handleTabPress(0, onClose)} 
              onLayout={handleTabLayout(0)}
              accessibilityLabel="Close"
            >
              <Ionicons name="close" size={22} color={activeTabIndex === 0 ? colors.accent.primary : colors.primary.text} />
              <Text style={[styles.navLabel, activeTabIndex === 0 && styles.navLabelActive]}>Close</Text>
            </Pressable>
            <Pressable 
              style={styles.navItem} 
              onPress={() => handleTabPress(1, handleBookmark)} 
              onLayout={handleTabLayout(1)}
              accessibilityLabel="Bookmark"
            >
              <Ionicons 
                name={bookmarked ? 'bookmark' : 'bookmark-outline'} 
                size={22} 
                color={(activeTabIndex === 1 || bookmarked) ? colors.accent.primary : colors.primary.text} 
              />
              <Text style={[styles.navLabel, activeTabIndex === 1 && styles.navLabelActive]}>{bookmarked ? 'Saved' : 'Save'}</Text>
            </Pressable>
            <Pressable 
              style={styles.navItem} 
              onPress={() => handleTabPress(2, handleShare)} 
              onLayout={handleTabLayout(2)}
              accessibilityLabel="Share"
            >
              <Ionicons name="share-outline" size={22} color={activeTabIndex === 2 ? colors.accent.primary : colors.primary.text} />
              <Text style={[styles.navLabel, activeTabIndex === 2 && styles.navLabelActive]}>Share</Text>
            </Pressable>
            {hasUrl && (
              <Pressable 
                style={styles.navItem} 
                onPress={() => handleTabPress(3, handleOpenSource)} 
                onLayout={handleTabLayout(3)}
                accessibilityLabel="Read Full"
              >
                <Ionicons name="open-outline" size={22} color={activeTabIndex === 3 ? colors.accent.primary : colors.primary.text} />
                <Text style={[styles.navLabel, activeTabIndex === 3 && styles.navLabelActive]}>Read</Text>
              </Pressable>
            )}
          </View>
        </LiquidGlassView>
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

  bottomNavBar: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.lg,
    right: spacing.lg,
    borderRadius: 24,
  },
  // Fallback background for devices that don't support liquid glass.
  // Uses the card background color with 85% opacity to mimic the glass effect.
  fallbackBackground: {
    backgroundColor: `${colors.semantic.cardBackground}D9`, // D9 is hex for ~85% opacity
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'relative',
  },
  pillIndicator: {
    position: 'absolute',
    top: -PILL_TOP_OFFSET,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  pillGlass: {
    flex: 1,
    borderRadius: 16,
  },
  pillFallback: {
    backgroundColor: 'rgba(255, 45, 85, 0.15)',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    minHeight: 44,
  },
  navLabel: {
    fontSize: typography.caption.fontSize,
    fontWeight: '500',
    color: colors.primary.text,
    marginTop: 2,
  },
  navLabelActive: {
    fontWeight: '600',
    color: colors.accent.primary,
  },
});
