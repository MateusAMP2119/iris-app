import React, { useEffect, useState, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Share,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LoadingIndicator, EmptyState } from '../../src/components';
import { useSavedArticles } from '../../src/contexts';
import { colors, spacing, typography, borderRadius, sizes, layout } from '../../src/constants/theme';
import { Article, getTimeAgo } from '../../models';
import { fetchArticles } from '../../services/api';

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isArticleSaved, saveArticle, removeArticle } = useSavedArticles();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadArticle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, we'd have a dedicated endpoint for single articles
      // For now, we fetch all and find by ID
      const response = await fetchArticles(0, 50);
      const found = response.content.find(
        (a) => a.articleId.toString() === id
      );
      
      if (found) {
        setArticle(found);
      } else {
        setError('Article not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load article');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadArticle();
  }, [loadArticle]);

  const handleBack = () => {
    router.back();
  };

  const handleBookmark = useCallback(async () => {
    if (!article) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isArticleSaved(article.articleId)) {
      await removeArticle(article.articleId);
    } else {
      await saveArticle(article);
    }
  }, [article, isArticleSaved, saveArticle, removeArticle]);

  const handleShare = async () => {
    if (!article) return;
    
    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n\n${article.url}`,
        url: article.url,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleOpenSource = () => {
    if (article?.url) {
      Linking.openURL(article.url);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <LoadingIndicator />
      </SafeAreaView>
    );
  }

  if (error || !article) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={colors.primary.text} />
          </Pressable>
        </View>
        <EmptyState
          icon="alert-circle-outline"
          title="Article not found"
          message={error || 'The article you are looking for does not exist.'}
        />
      </SafeAreaView>
    );
  }

  const bookmarked = isArticleSaved(article.articleId);
  const authorNames = article.authors
    .map((a) => `${a.firstName} ${a.lastName}`)
    .join(', ');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.headerButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={colors.primary.text} />
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
          {article.source?.logo && (
            <Pressable style={styles.sourceContainer} onPress={handleOpenSource}>
              <Image
                source={{ uri: article.source.logo }}
                style={styles.sourceLogo}
                contentFit="contain"
                transition={200}
              />
              <Ionicons
                name="open-outline"
                size={14}
                color={colors.accent.primary}
                style={styles.externalIcon}
              />
            </Pressable>
          )}

          {/* Categories */}
          <View style={styles.categoriesRow}>
            {article.categories.map((cat) => (
              <View key={cat.categoryId} style={styles.categoryChip}>
                <Text style={styles.categoryText}>{cat.categoryName}</Text>
              </View>
            ))}
          </View>

          {/* Title */}
          <Text style={styles.title}>{article.title}</Text>

          {/* Subtitle */}
          {article.subtitle && (
            <Text style={styles.subtitle}>{article.subtitle}</Text>
          )}

          {/* Meta Info */}
          <View style={styles.metaRow}>
            {authorNames && (
              <Text style={styles.author}>By {authorNames}</Text>
            )}
            <Text style={styles.date}>
              {getTimeAgo(article.publicationDate)}
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Article Content */}
          <Text style={styles.bodyText}>{article.content}</Text>

          {/* Read More Button */}
          <Pressable style={styles.readMoreButton} onPress={handleOpenSource}>
            <Text style={styles.readMoreText}>Read full article</Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color={colors.primary.background}
            />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
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
