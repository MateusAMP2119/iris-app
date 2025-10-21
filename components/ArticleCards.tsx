import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { Article, getTimeAgo } from '../models';
import { AppColors, AppTextStyles, AppSpacing } from '../theme';

interface HeroArticleCardProps {
  article: Article;
  onTap: () => void;
}

export function HeroArticleCard({ article, onTap }: HeroArticleCardProps) {
  return (
    <Pressable onPress={onTap} style={styles.heroCard}>
      {/* Title - Classic newspaper headline */}
      <Text style={styles.heroTitle} numberOfLines={4}>
        {article.title}
      </Text>

      {/* Categories */}
      {article.categories && article.categories.length > 0 && (
        <View style={styles.categoriesRow}>
          {article.categories.map((cat) => (
            <View key={cat.id} style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{cat.name.toUpperCase()}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Image */}
      {article.imageUrl && (
        <Image source={{ uri: article.imageUrl }} style={styles.heroImage} />
      )}

      {/* Excerpt */}
      {article.excerpt && (
        <Text style={styles.heroExcerpt} numberOfLines={3}>
          {article.excerpt}
        </Text>
      )}

      {/* Metadata */}
      <View style={styles.heroMeta}>
        {article.source && (
          <>
            <Text style={styles.heroMetaText}>{article.source.name}</Text>
            <View style={styles.dot} />
          </>
        )}
        <Text style={styles.heroMetaText}>{getTimeAgo(article.publishedAt)}</Text>
      </View>
    </Pressable>
  );
}

interface NewspaperCompactCardProps {
  article: Article;
  onTap: () => void;
}

export function NewspaperCompactCard({ article, onTap }: NewspaperCompactCardProps) {
  return (
    <Pressable onPress={onTap} style={styles.compactCard}>
      <View style={styles.compactContent}>
        {/* Text Content */}
        <View style={styles.compactText}>
          {/* Categories - small bordered badge */}
          {article.categories && article.categories.length > 0 && (
            <View style={styles.compactCategoryBadge}>
              <Text style={styles.compactCategoryText}>
                {article.categories[0].name.toUpperCase()}
              </Text>
            </View>
          )}

          {/* Title */}
          <Text style={styles.compactTitle} numberOfLines={3}>
            {article.title}
          </Text>

          {/* Metadata with decorative line */}
          <View style={styles.compactMeta}>
            <View style={styles.compactMetaLine} />
            {article.source && (
              <>
                <Text style={styles.compactMetaTextBold}>{article.source.name}</Text>
                <Text style={styles.compactMetaDot}> • </Text>
              </>
            )}
            <Text style={styles.compactMetaTextItalic}>{getTimeAgo(article.publishedAt)}</Text>
          </View>
        </View>

        {/* Image with border */}
        {article.imageUrl && (
          <View style={styles.compactImageContainer}>
            <Image source={{ uri: article.imageUrl }} style={styles.compactImage} />
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

export function NewspaperColumn({ articles, onArticleTap, title }: NewspaperColumnProps) {
  return (
    <View style={styles.column}>
      {title && (
        <View style={styles.columnHeader}>
          <View style={styles.columnBar} />
          <Text style={styles.columnTitle}>{title}</Text>
        </View>
      )}
      {articles.map((article) => (
        <NewspaperCompactCard
          key={article.id}
          article={article}
          onTap={() => onArticleTap(article)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  // Hero Card Styles
  heroCard: {
    width: '100%',
    borderBottomWidth: 3,
    borderBottomColor: AppColors.divider,
    paddingBottom: AppSpacing.lg,
  },
  heroTitle: {
    ...AppTextStyles.articleTitleHero,
    color: AppColors.primaryText,
    lineHeight: AppTextStyles.articleTitleHero.fontSize * 1.1,
    letterSpacing: -0.5,
    fontWeight: '800',
    marginBottom: AppSpacing.sm,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: AppSpacing.md,
    gap: AppSpacing.xs,
  },
  categoryBadge: {
    paddingHorizontal: AppSpacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: AppColors.primaryText,
  },
  categoryText: {
    ...AppTextStyles.labelSmall,
    fontSize: 9,
    color: AppColors.primaryText,
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  heroImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: AppColors.gray200,
    marginBottom: AppSpacing.md,
  },
  heroExcerpt: {
    ...AppTextStyles.bodyMedium,
    color: AppColors.gray700,
    marginBottom: AppSpacing.sm,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroMetaText: {
    ...AppTextStyles.caption,
    color: AppColors.gray600,
    fontWeight: '600',
    fontSize: 11,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: AppColors.gray400,
    marginHorizontal: AppSpacing.xs,
  },

  // Compact Card Styles
  compactCard: {
    paddingVertical: AppSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.dividerLight,
  },
  compactContent: {
    flexDirection: 'row',
  },
  compactText: {
    flex: 1,
    paddingRight: AppSpacing.md,
  },
  compactCategoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: AppSpacing.xs,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: AppColors.primaryText,
    marginBottom: AppSpacing.xs,
  },
  compactCategoryText: {
    ...AppTextStyles.labelSmall,
    fontSize: 8,
    color: AppColors.primaryText,
    letterSpacing: 1,
    fontWeight: '700',
  },
  compactTitle: {
    ...AppTextStyles.articleTitleMedium,
    color: AppColors.primaryText,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: AppTextStyles.articleTitleMedium.fontSize * 1.3,
    marginBottom: AppSpacing.sm,
  },
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactMetaLine: {
    width: 12,
    height: 1,
    backgroundColor: AppColors.primaryText,
    marginRight: AppSpacing.xs,
  },
  compactMetaTextBold: {
    ...AppTextStyles.captionSmall,
    color: AppColors.primaryText,
    fontWeight: '700',
  },
  compactMetaDot: {
    ...AppTextStyles.captionSmall,
    color: AppColors.gray400,
  },
  compactMetaTextItalic: {
    ...AppTextStyles.captionSmall,
    color: AppColors.gray600,
    fontStyle: 'italic',
  },
  compactImageContainer: {
    borderWidth: 1,
    borderColor: AppColors.gray300,
  },
  compactImage: {
    width: 100,
    height: 100,
    backgroundColor: AppColors.gray200,
  },

  // Column Styles
  column: {
    flex: 1,
    paddingHorizontal: AppSpacing.md,
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppSpacing.lg,
  },
  columnBar: {
    width: 3,
    height: 24,
    backgroundColor: AppColors.primaryText,
    marginRight: AppSpacing.sm,
  },
  columnTitle: {
    ...AppTextStyles.headlineSecondary,
    color: AppColors.primaryText,
    fontWeight: '900',
    letterSpacing: 2,
  },
});
