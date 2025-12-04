import React, { useCallback } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Share,
  Linking,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSavedArticles } from '../../src/contexts';
import { colors, spacing, typography, borderRadius, sizes, layout } from '../../lib/constants';
import { Article, getTimeAgo } from '../../models';
import { SavedArticle } from '../../src/types';

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
});
