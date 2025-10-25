import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Article, getTimeAgo } from '../models';
import { AppColors, AppSpacing, AppTextStyles } from '../theme';

interface HeroArticleCardProps {
  article: Article;
  onTap: () => void;
}

export function HeroArticleCard({ article, onTap }: HeroArticleCardProps) {
  return (
    <Pressable onPress={onTap} style={styles.hero}>
      {/* Category Tag */}
      {article.categories && article.categories.length > 0 && (
        <View style={styles.heroCategoryTag}>
          <Text style={styles.heroCategoryText}>
            {article.categories[0].name.toUpperCase()}
          </Text>
        </View>
      )}

      {/* Headline */}
      <Text style={styles.heroTitle}>{article.title}</Text>

      {/* Author & Time */}
      <View style={styles.heroMeta}>
        {article.author && (
          <>
            <Text style={styles.heroAuthor}>By {article.author}</Text>
            <Text style={styles.heroDot}> · </Text>
          </>
        )}
        <Text style={styles.heroTime}>{getTimeAgo(article.publishedAt)}</Text>
      </View>

      {/* Featured Image */}
      {article.imageUrl && (
        <Image source={{ uri: article.imageUrl }} style={styles.heroImage} />
      )}

      {/* Lead */}
      {article.excerpt && (
        <Text style={styles.heroExcerpt}>{article.excerpt}</Text>
      )}

      {/* Source */}
      {article.source && (
        <View style={styles.heroSource}>
          <View style={styles.heroSourceLine} />
          <Text style={styles.heroSourceText}>
            {article.source.name.toUpperCase()}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
  },
  heroCategoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: AppColors.primaryText,
    paddingHorizontal: AppSpacing.sm,
    paddingVertical: AppSpacing.xs / 2,
    marginBottom: AppSpacing.md,
  },
  heroCategoryText: {
    ...AppTextStyles.labelSmall,
    color: AppColors.surface,
    fontWeight: '800',
    letterSpacing: 2,
    fontSize: 9,
  },
  heroTitle: {
    ...AppTextStyles.articleTitleHero,
    color: AppColors.primaryText,
    fontWeight: '900',
    lineHeight: 42,
    letterSpacing: -1.5,
    marginBottom: AppSpacing.sm,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppSpacing.lg,
  },
  heroAuthor: {
    ...AppTextStyles.caption,
    color: AppColors.primaryText,
    fontWeight: '700',
    fontSize: 11,
  },
  heroDot: {
    ...AppTextStyles.caption,
    color: AppColors.gray400,
    fontSize: 10,
  },
  heroTime: {
    ...AppTextStyles.caption,
    color: AppColors.gray600,
    fontStyle: 'italic',
    fontSize: 10,
  },
  heroImage: {
    width: '100%',
    aspectRatio: 16 / 10,
    backgroundColor: AppColors.gray200,
    marginBottom: AppSpacing.lg,
  },
  heroExcerpt: {
    ...AppTextStyles.bodyMedium,
    color: AppColors.primaryText,
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: AppSpacing.md,
    fontSize: 16,
  },
  heroSource: {
    marginTop: AppSpacing.sm,
  },
  heroSourceLine: {
    width: 60,
    height: 2,
    backgroundColor: AppColors.primaryText,
    marginBottom: AppSpacing.xs,
  },
  heroSourceText: {
    ...AppTextStyles.caption,
    color: AppColors.primaryText,
    fontWeight: '800',
    letterSpacing: 1,
    fontSize: 10,
  },
});
