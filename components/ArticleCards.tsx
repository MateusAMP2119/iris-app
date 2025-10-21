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

interface NewspaperCompactCardProps {
  article: Article;
  onTap: () => void;
  index?: number;
}

export function NewspaperCompactCard({
  article,
  onTap,
  index = 0,
}: NewspaperCompactCardProps) {
  const variant = index % 5;

  // Brief (Text-only) - every 5th
  if (variant === 0) {
    return (
      <Pressable onPress={onTap} style={styles.brief}>
        <View style={styles.briefBar} />
        <View style={styles.briefBody}>
          <Text style={styles.briefTitle} numberOfLines={2}>
            {article.title}
          </Text>
          <Text style={styles.briefMeta}>
            {article.source?.name.toUpperCase() || 'STAFF'}
          </Text>
        </View>
      </Pressable>
    );
  }

  // Feature (Big image) - every 4th (not 5th)
  if (variant === 3) {
    return (
      <Pressable onPress={onTap} style={styles.feature}>
        {article.imageUrl && (
          <View style={styles.featureImageBox}>
            <Image source={{ uri: article.imageUrl }} style={styles.featureImage} />
          </View>
        )}
        {article.categories && article.categories.length > 0 && (
          <Text style={styles.featureLabel}>
            {article.categories[0].name.toUpperCase()}
          </Text>
        )}
        <Text style={styles.featureTitle} numberOfLines={3}>
          {article.title}
        </Text>
        <View style={styles.featureFooter}>
          <Text style={styles.featureMeta}>
            {article.source?.name || 'Staff'} · {getTimeAgo(article.publishedAt)}
          </Text>
        </View>
      </Pressable>
    );
  }

  // Standard (Side image)
  return (
    <Pressable onPress={onTap} style={styles.standard}>
      <View style={styles.standardBody}>
        <View style={styles.standardText}>
          {article.categories && article.categories.length > 0 && (
            <View style={styles.standardLabel}>
              <Text style={styles.standardLabelText}>
                {article.categories[0].name.toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.standardTitle} numberOfLines={4}>
            {article.title}
          </Text>
          <Text style={styles.standardMeta} numberOfLines={1}>
            {article.source?.name || 'Staff'} · {getTimeAgo(article.publishedAt)}
          </Text>
        </View>
        {article.imageUrl && (
          <View style={styles.standardImageBox}>
            <Image source={{ uri: article.imageUrl }} style={styles.standardImage} />
          </View>
        )}
      </View>
    </Pressable>
  );
}

interface NewspaperColumnProps {
  articles: Article[];
  onArticleTap: (article: Article) => void;
  title?: string;
}

export function NewspaperColumn({
  articles,
  onArticleTap,
  title,
}: NewspaperColumnProps) {
  return (
    <View style={styles.column}>
      {title && (
        <View style={styles.columnHead}>
          <Text style={styles.columnTitle}>{title}</Text>
          <View style={styles.columnLine} />
        </View>
      )}
      {articles.map((article, index) => (
        <NewspaperCompactCard
          key={article.id}
          article={article}
          onTap={() => onArticleTap(article)}
          index={index}
        />
      ))}
    </View>
  );
}


const styles = StyleSheet.create({
  // ========== HERO ==========
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

  // ========== BRIEF (Text-only) ==========
  brief: {
    flexDirection: 'row',
    paddingVertical: AppSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.dividerLight,
  },
  briefBar: {
    width: 4,
    backgroundColor: AppColors.primaryText,
    marginRight: AppSpacing.sm,
  },
  briefBody: {
    flex: 1,
  },
  briefTitle: {
    ...AppTextStyles.articleTitleMedium,
    color: AppColors.primaryText,
    fontWeight: '700',
    lineHeight: 20,
    letterSpacing: -0.3,
    marginBottom: AppSpacing.xs,
    fontSize: 14,
  },
  briefMeta: {
    ...AppTextStyles.captionSmall,
    color: AppColors.gray600,
    fontWeight: '700',
    letterSpacing: 1,
    fontSize: 8,
  },

  // ========== FEATURE ==========
  feature: {
    paddingVertical: AppSpacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: AppColors.primaryText,
  },
  featureImageBox: {
    borderWidth: 2,
    borderColor: AppColors.primaryText,
    marginBottom: AppSpacing.md,
  },
  featureImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: AppColors.gray200,
  },
  featureLabel: {
    ...AppTextStyles.labelSmall,
    color: AppColors.surface,
    backgroundColor: AppColors.primaryText,
    fontWeight: '800',
    letterSpacing: 1.5,
    fontSize: 9,
    paddingHorizontal: AppSpacing.xs,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: AppSpacing.xs,
  },
  featureTitle: {
    ...AppTextStyles.articleTitleLarge,
    color: AppColors.primaryText,
    fontWeight: '800',
    lineHeight: 24,
    letterSpacing: -0.5,
    marginBottom: AppSpacing.sm,
    fontSize: 18,
  },
  featureFooter: {
    borderTopWidth: 1,
    borderTopColor: AppColors.divider,
    paddingTop: AppSpacing.xs,
  },
  featureMeta: {
    ...AppTextStyles.captionSmall,
    color: AppColors.gray600,
    fontSize: 9,
  },

  // ========== STANDARD ==========
  standard: {
    paddingVertical: AppSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.divider,
  },
  standardBody: {
    flexDirection: 'row',
  },
  standardText: {
    flex: 1,
    paddingRight: AppSpacing.md,
  },
  standardLabel: {
    borderWidth: 1,
    borderColor: AppColors.primaryText,
    paddingHorizontal: AppSpacing.xs,
    paddingVertical: 1,
    alignSelf: 'flex-start',
    marginBottom: AppSpacing.xs,
  },
  standardLabelText: {
    ...AppTextStyles.labelSmall,
    color: AppColors.primaryText,
    fontWeight: '800',
    letterSpacing: 1,
    fontSize: 7,
  },
  standardTitle: {
    ...AppTextStyles.articleTitleMedium,
    color: AppColors.primaryText,
    fontWeight: '700',
    lineHeight: 18,
    letterSpacing: -0.3,
    marginBottom: AppSpacing.sm,
    fontSize: 13,
  },
  standardMeta: {
    ...AppTextStyles.captionSmall,
    color: AppColors.gray600,
    fontSize: 9,
  },
  standardImageBox: {
    borderWidth: 1,
    borderColor: AppColors.primaryText,
  },
  standardImage: {
    width: 75,
    height: 75,
    backgroundColor: AppColors.gray200,
  },

  // ========== COLUMN ==========
  column: {
    flex: 1,
    paddingHorizontal: AppSpacing.lg,
    borderRightWidth: 1,
    borderRightColor: AppColors.divider,
  },
  columnHead: {
    marginBottom: AppSpacing.lg,
  },
  columnTitle: {
    ...AppTextStyles.labelLarge,
    color: AppColors.surface,
    backgroundColor: AppColors.primaryText,
    fontWeight: '900',
    letterSpacing: 2,
    fontSize: 13,
    paddingHorizontal: AppSpacing.sm,
    paddingVertical: 4,
  },
  columnLine: {
    height: 3,
    backgroundColor: AppColors.primaryText,
  },
});

