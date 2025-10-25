import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Article, getTimeAgo } from '../models';
import { AppColors, AppSpacing, AppTextStyles } from '../theme';

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
  const variant = index % 6;

  // Large Feature (every 6th) - Big image top, prominent
  if (variant === 0) {
    return (
      <Pressable onPress={onTap} style={styles.largeFeat}>
        {article.imageUrl && (
          <Image 
            source={{ uri: article.imageUrl }} 
            style={styles.largeFeatImage}
            resizeMode="cover"
          />
        )}
        {article.categories && article.categories.length > 0 && (
          <View style={styles.largeFeatCategoryBox}>
            <Text style={styles.largeFeatCategory}>
              {article.categories[0].name.toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={styles.largeFeatTitle} numberOfLines={3}>
          {article.title}
        </Text>
        {article.excerpt && (
          <Text style={styles.largeFeatExcerpt} numberOfLines={2}>
            {article.excerpt}
          </Text>
        )}
        <View style={styles.largeFeatMeta}>
          {article.author && (
            <>
              <Text style={styles.largeFeatAuthor}>{article.author}</Text>
              <Text style={styles.metaDot}> · </Text>
            </>
          )}
          <Text style={styles.largeFeatTime}>{getTimeAgo(article.publishedAt)}</Text>
          {article.source && (
            <>
              <Text style={styles.metaDot}> · </Text>
              <Text style={styles.largeFeatSource}>{article.source.name}</Text>
            </>
          )}
        </View>
      </Pressable>
    );
  }

  // Medium with Side Image (variants 1, 3, 4)
  if (variant === 1 || variant === 3 || variant === 4) {
    return (
      <Pressable onPress={onTap} style={styles.mediumSide}>
        <View style={styles.mediumSideRow}>
          <View style={styles.mediumSideText}>
            {article.categories && article.categories.length > 0 && (
              <Text style={styles.mediumSideCategory}>
                {article.categories[0].name.toUpperCase()}
              </Text>
            )}
            <Text style={styles.mediumSideTitle} numberOfLines={4}>
              {article.title}
            </Text>
            <View style={styles.mediumSideMeta}>
              {article.author && (
                <>
                  <Text style={styles.mediumSideAuthor}>{article.author}</Text>
                  <Text style={styles.metaDot}> · </Text>
                </>
              )}
              <Text style={styles.mediumSideTime}>{getTimeAgo(article.publishedAt)}</Text>
            </View>
          </View>
          {article.imageUrl && (
            <Image 
              source={{ uri: article.imageUrl }} 
              style={styles.mediumSideImage}
              resizeMode="cover"
            />
          )}
        </View>
      </Pressable>
    );
  }

  // Small with Top Image (variant 2)
  if (variant === 2) {
    return (
      <Pressable onPress={onTap} style={styles.smallTop}>
        {article.imageUrl && (
          <Image 
            source={{ uri: article.imageUrl }} 
            style={styles.smallTopImage}
            resizeMode="cover"
          />
        )}
        {article.categories && article.categories.length > 0 && (
          <Text style={styles.smallTopCategory}>
            {article.categories[0].name.toUpperCase()}
          </Text>
        )}
        <Text style={styles.smallTopTitle} numberOfLines={3}>
          {article.title}
        </Text>
        <View style={styles.smallTopMeta}>
          {article.author && (
            <>
              <Text style={styles.smallTopAuthor}>{article.author}</Text>
              <Text style={styles.metaDot}> · </Text>
            </>
          )}
          <Text style={styles.smallTopTime}>{getTimeAgo(article.publishedAt)}</Text>
        </View>
      </Pressable>
    );
  }

  // Brief Text-Heavy (variant 5)
  return (
    <Pressable onPress={onTap} style={styles.briefText}>
      <View style={styles.briefBar} />
      <View style={styles.briefContent}>
        {article.categories && article.categories.length > 0 && (
          <Text style={styles.briefCategory}>
            {article.categories[0].name.toUpperCase()}
          </Text>
        )}
        <Text style={styles.briefTitle} numberOfLines={3}>
          {article.title}
        </Text>
        <View style={styles.briefMeta}>
          {article.source && (
            <Text style={styles.briefSource}>{article.source.name}</Text>
          )}
        </View>
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
  // ========== SHARED ==========
  metaDot: {
    ...AppTextStyles.captionSmall,
    color: AppColors.gray400,
    fontSize: 8,
  },

  // ========== LARGE FEATURED (Every 6th) ==========
  largeFeat: {
    paddingBottom: AppSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.primaryText,
  },
  largeFeatImage: {
    width: '100%',
    height: 160,
    backgroundColor: AppColors.gray200,
    marginBottom: AppSpacing.sm,
  },
  largeFeatCategoryBox: {
    alignSelf: 'flex-start',
    backgroundColor: AppColors.primaryText,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 6,
  },
  largeFeatCategory: {
    ...AppTextStyles.labelSmall,
    color: AppColors.surface,
    fontWeight: '900',
    letterSpacing: 1.5,
    fontSize: 8,
  },
  largeFeatTitle: {
    ...AppTextStyles.articleTitleLarge,
    color: AppColors.primaryText,
    fontWeight: '800',
    lineHeight: 26,
    letterSpacing: -0.5,
    marginBottom: 8,
    fontSize: 20,
  },
  largeFeatExcerpt: {
    ...AppTextStyles.bodySmall,
    color: AppColors.gray700,
    lineHeight: 20,
    marginBottom: 8,
    fontSize: 14,
  },
  largeFeatMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  largeFeatAuthor: {
    ...AppTextStyles.captionSmall,
    color: AppColors.primaryText,
    fontWeight: '700',
    fontSize: 11,
  },
  largeFeatTime: {
    ...AppTextStyles.captionSmall,
    color: AppColors.gray600,
    fontStyle: 'italic',
    fontSize: 11,
  },
  largeFeatSource: {
    ...AppTextStyles.captionSmall,
    color: AppColors.gray500,
    fontSize: 10,
  },

  // ========== MEDIUM WITH SIDE IMAGE (Variants 1, 3, 4) ==========
  mediumSide: {
    paddingVertical: AppSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.divider,
  },
  mediumSideRow: {
    flexDirection: 'row',
    gap: AppSpacing.sm,
  },
  mediumSideText: {
    flex: 1,
  },
  mediumSideCategory: {
    ...AppTextStyles.captionSmall,
    color: AppColors.primaryText,
    fontWeight: '900',
    letterSpacing: 1.5,
    fontSize: 9,
    marginBottom: 4,
  },
  mediumSideTitle: {
    ...AppTextStyles.articleTitleMedium,
    color: AppColors.primaryText,
    fontWeight: '700',
    lineHeight: 20,
    letterSpacing: -0.3,
    marginBottom: 6,
    fontSize: 15,
  },
  mediumSideMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  mediumSideAuthor: {
    ...AppTextStyles.captionSmall,
    color: AppColors.primaryText,
    fontWeight: '700',
    fontSize: 10,
  },
  mediumSideTime: {
    ...AppTextStyles.captionSmall,
    color: AppColors.gray600,
    fontStyle: 'italic',
    fontSize: 10,
  },
  mediumSideImage: {
    width: 85,
    height: 85,
    backgroundColor: AppColors.gray200,
  },

  // ========== SMALL WITH TOP IMAGE (Variant 2) ==========
  smallTop: {
    paddingVertical: AppSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.divider,
  },
  smallTopImage: {
    width: '100%',
    height: 100,
    backgroundColor: AppColors.gray200,
    marginBottom: 6,
  },
  smallTopCategory: {
    ...AppTextStyles.captionSmall,
    color: AppColors.primaryText,
    fontWeight: '900',
    letterSpacing: 1.5,
    fontSize: 9,
    marginBottom: 4,
  },
  smallTopTitle: {
    ...AppTextStyles.articleTitleMedium,
    color: AppColors.primaryText,
    fontWeight: '700',
    lineHeight: 19,
    letterSpacing: -0.3,
    marginBottom: 6,
    fontSize: 14,
  },
  smallTopMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  smallTopAuthor: {
    ...AppTextStyles.captionSmall,
    color: AppColors.primaryText,
    fontWeight: '700',
    fontSize: 10,
  },
  smallTopTime: {
    ...AppTextStyles.captionSmall,
    color: AppColors.gray600,
    fontStyle: 'italic',
    fontSize: 10,
  },

  // ========== BRIEF TEXT-HEAVY (Variant 5) ==========
  briefText: {
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
  briefContent: {
    flex: 1,
  },
  briefCategory: {
    ...AppTextStyles.captionSmall,
    color: AppColors.primaryText,
    fontWeight: '900',
    letterSpacing: 1.5,
    fontSize: 9,
    marginBottom: 4,
  },
  briefTitle: {
    ...AppTextStyles.articleTitleMedium,
    color: AppColors.primaryText,
    fontWeight: '700',
    lineHeight: 20,
    letterSpacing: -0.3,
    marginBottom: 6,
    fontSize: 15,
  },
  briefMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  briefSource: {
    ...AppTextStyles.captionSmall,
    color: AppColors.gray600,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
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

