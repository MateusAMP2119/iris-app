import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
  Platform,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MockDataService from '../../services/MockDataService';
import { CategoryChip } from '../../components';
import { AppColors, AppTextStyles, AppSpacing } from '../../theme';

const { width } = Dimensions.get('window');
const isMobile = width < 768;
const pageMargin = isMobile ? AppSpacing.md : AppSpacing.xl;
const maxWidth = isMobile ? width - pageMargin * 2 : 720;

function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const article = MockDataService.getArticleById(parseInt(id || '0', 10));

  if (!article) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Article not found</Text>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const dateString = article.publishedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={AppColors.primaryText} />
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable style={styles.headerButton}>
            <Ionicons
              name="bookmark-outline"
              size={24}
              color={AppColors.primaryText}
            />
          </Pressable>
          <Pressable style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color={AppColors.primaryText} />
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Categories */}
          {article.categories && article.categories.length > 0 && (
            <View style={styles.categoriesContainer}>
              {article.categories.map((cat) => (
                <CategoryChip key={cat.id} category={cat} />
              ))}
            </View>
          )}

          {/* Title */}
          <Text style={[styles.title, !isMobile && styles.titleDesktop]}>
            {article.title}
          </Text>

          {/* Metadata */}
          <View style={styles.metadata}>
            {article.source && (
              <>
                <Text style={styles.metaSource}>{article.source.name}</Text>
                <View style={styles.metaDot} />
              </>
            )}
            <Text style={styles.metaDate}>{dateString}</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Image */}
          {article.imageUrl && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: article.imageUrl }} style={styles.image} />
            </View>
          )}

          {/* Content */}
          <Text style={styles.contentText}>{article.content}</Text>

          {/* Bottom Divider */}
          <View style={[styles.divider, styles.bottomDivider]} />

          {/* Source Info */}
          <View style={styles.sourceInfo}>
            <Text style={styles.sourceLabel}>SOURCE</Text>
            {article.source && (
              <Text style={styles.sourceName}>{article.source.name}</Text>
            )}
            <Text style={styles.sourceUrl} numberOfLines={1}>
              {article.url}
            </Text>
          </View>

          <View style={{ height: AppSpacing.xxxl }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: pageMargin,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: AppSpacing.md,
    backgroundColor: AppColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.dividerLight,
  },
  headerButton: {
    padding: AppSpacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    gap: AppSpacing.sm,
  },
  content: {
    alignSelf: 'center',
    width: '100%',
    maxWidth,
    paddingHorizontal: pageMargin,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppSpacing.xs,
    marginTop: AppSpacing.md,
  },
  title: {
    ...AppTextStyles.headlineSecondary,
    color: AppColors.primaryText,
    marginTop: AppSpacing.md,
  },
  titleDesktop: {
    ...AppTextStyles.headlinePrimary,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: AppSpacing.md,
  },
  metaSource: {
    ...AppTextStyles.caption,
    color: AppColors.gray700,
    fontWeight: '600',
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: AppColors.gray400,
    marginHorizontal: AppSpacing.sm,
  },
  metaDate: {
    ...AppTextStyles.caption,
    color: AppColors.gray600,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.divider,
    marginTop: AppSpacing.lg,
  },
  imageContainer: {
    marginTop: AppSpacing.lg,
    borderRadius: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: AppColors.gray200,
  },
  contentText: {
    ...AppTextStyles.bodyLarge,
    color: AppColors.primaryText,
    marginTop: AppSpacing.xxxl,
  },
  bottomDivider: {
    height: 2,
    marginTop: AppSpacing.xxxl,
  },
  sourceInfo: {
    backgroundColor: AppColors.gray50,
    borderRadius: 4,
    padding: AppSpacing.md,
    marginTop: AppSpacing.lg,
  },
  sourceLabel: {
    ...AppTextStyles.labelSmall,
    color: AppColors.gray600,
    marginBottom: AppSpacing.xs,
  },
  sourceName: {
    ...AppTextStyles.bodyMedium,
    fontWeight: '600',
    marginBottom: AppSpacing.xs,
  },
  sourceUrl: {
    ...AppTextStyles.caption,
    color: AppColors.accentBlue,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: AppSpacing.xl,
  },
  errorText: {
    ...AppTextStyles.headlineSecondary,
    color: AppColors.primaryText,
    marginBottom: AppSpacing.lg,
  },
  backButton: {
    paddingHorizontal: AppSpacing.lg,
    paddingVertical: AppSpacing.md,
    backgroundColor: AppColors.primaryText,
  },
  backButtonText: {
    ...AppTextStyles.button,
    color: AppColors.surface,
  },
});

export default ArticleDetailScreen;
