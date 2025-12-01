import React, { useCallback } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { NewsCard, SectionHeader, LoadingIndicator, EmptyState } from '../../src/components';
import { useSavedArticles } from '../../src/contexts';
import { useNews } from '../../src/hooks';
import { colors, spacing, layout, typography } from '../../src/constants/theme';
import { getTimeAgo, Article } from '../../models';

const { width: screenWidth } = Dimensions.get('window');

export default function TodayScreen() {
  const router = useRouter();
  const { articles, loading, error, refresh } = useNews(10);
  const { isArticleSaved, saveArticle, removeArticle } = useSavedArticles();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const handleArticlePress = useCallback((article: Article) => {
    router.push({
      pathname: '/article/[id]',
      params: { id: article.articleId.toString() },
    });
  }, [router]);

  const handleBookmark = useCallback(async (article: Article) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isArticleSaved(article.articleId)) {
      await removeArticle(article.articleId);
    } else {
      await saveArticle(article);
    }
  }, [isArticleSaved, saveArticle, removeArticle]);

  const featuredArticle = articles[0];
  const topStories = articles.slice(1);

  // Get current date formatted
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const renderHeader = () => (
    <View>
      {/* Header with date */}
      <View style={styles.header}>
        <Text style={styles.date}>{dateString}</Text>
        <Text style={styles.title}>Breaking News</Text>
      </View>

      {/* Featured/Hero Article */}
      {featuredArticle && (
        <View style={styles.heroSection}>
          <NewsCard
            imageUrl={featuredArticle.imgUrl}
            source={featuredArticle.source?.sourceName ?? null}
            headline={featuredArticle.title}
            date={getTimeAgo(featuredArticle.publicationDate)}
            isBookmarked={isArticleSaved(featuredArticle.articleId)}
            onPress={() => handleArticlePress(featuredArticle)}
            onBookmark={() => handleBookmark(featuredArticle)}
            featured
          />
        </View>
      )}

      {/* Top Stories Section Header */}
      {topStories.length > 0 && (
        <SectionHeader title="Top Stories" />
      )}
    </View>
  );

  const renderTopStory = useCallback(({ item, index }: { item: Article; index: number }) => {
    const isLeft = index % 2 === 0;
    return (
      <View style={[styles.gridItem, isLeft ? styles.gridItemLeft : styles.gridItemRight]}>
        <NewsCard
          imageUrl={item.imgUrl}
          source={item.source?.sourceName ?? null}
          headline={item.title}
          date={getTimeAgo(item.publicationDate)}
          isBookmarked={isArticleSaved(item.articleId)}
          onPress={() => handleArticlePress(item)}
          onBookmark={() => handleBookmark(item)}
          compact
        />
      </View>
    );
  }, [isArticleSaved, handleArticlePress, handleBookmark]);

  if (loading && articles.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <LoadingIndicator />
      </SafeAreaView>
    );
  }

  if (error && articles.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <EmptyState
          icon="alert-circle-outline"
          title="Unable to load news"
          message={error}
        />
        <Pressable style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <FlatList
        data={topStories}
        renderItem={renderTopStory}
        keyExtractor={(item) => item.articleId.toString()}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.semantic.screenBackground,
  },
  listContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: spacing.xl,
  },
  header: {
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  date: {
    fontSize: typography.caption.fontSize,
    color: colors.secondary.gray600,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: typography.display.fontSize,
    fontWeight: typography.display.fontWeight,
    color: colors.primary.text,
  },
  heroSection: {
    marginBottom: spacing.md,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  gridItem: {
    width: (screenWidth - layout.screenPaddingHorizontal * 2 - spacing.md) / 2,
  },
  gridItemLeft: {
    marginRight: spacing.sm / 2,
  },
  gridItemRight: {
    marginLeft: spacing.sm / 2,
  },
  retryButton: {
    backgroundColor: colors.primary.text,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
    marginTop: spacing.md,
    alignSelf: 'center',
  },
  retryText: {
    color: colors.primary.background,
    fontWeight: '600',
    fontSize: 16,
  },
});
