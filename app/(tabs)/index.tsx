import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useMemo } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Article, getTimeAgo } from '../../models';
import { ArticleModal, EmptyState, LoadingIndicator, NewsCard, SectionHeader, SwipeableTabWrapper } from '../../components';
import { colors, layout, spacing, typography } from '../../lib/constants';
import { Article, getTimeAgo } from '../../models';
import { useSavedArticles, useTabBarVisibility } from '../../src/contexts';
import { useNews } from '../../src/hooks';

const { width: screenWidth } = Dimensions.get('window');

export default function TodayScreen() {
  const { articles, loading, error, refresh } = useNews(10);
  const { isArticleSaved, saveArticle, removeArticle } = useSavedArticles();
  const { handleScroll } = useTabBarVisibility();
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const handleArticlePress = useCallback((article: Article) => {
    setSelectedArticle(article);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedArticle(null);
  }, []);

  const handleBookmark = useCallback(async (article: Article) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isArticleSaved(article.articleId)) {
      await removeArticle(article.articleId);
    } else {
      await saveArticle(article);
    }
  }, [isArticleSaved, saveArticle, removeArticle]);

  // Separate featured articles from regular articles
  const featuredArticles = useMemo(() => 
    articles.filter(article => article.isFeatured === true),
    [articles]
  );

  const topStories = useMemo(() => 
    articles.filter(article => !article.isFeatured),
    [articles]
  );

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

      {/* Featured Articles - Horizontal Scroll */}
      {featuredArticles.length > 0 && (
        <View style={styles.featuredSection}>
          <FlatList
            data={featuredArticles}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => `featured-${item.articleId}`}
            contentContainerStyle={styles.featuredListContent}
            renderItem={({ item }) => (
              <FeaturedCard
                imageUrl={item.imgUrl}
                sourceLogo={item.source?.logo ?? null}
                headline={item.title}
                date={getTimeAgo(item.publicationDate)}
                isBookmarked={isArticleSaved(item.articleId)}
                onPress={() => handleArticlePress(item)}
                onBookmark={() => handleBookmark(item)}
              />
            )}
          />
        </View>
      )}

      {/* Top Stories Section Header */}
      {topStories.length > 0 && (
        <SectionHeader title="Top Stories" showChevron />
      )}
    </View>
  );

  const renderTopStory = useCallback(({ item, index }: { item: Article; index: number }) => {
    const isLeft = index % 2 === 0;
    return (
      <View style={[styles.gridItem, isLeft ? styles.gridItemLeft : styles.gridItemRight]}>
        <NewsCard
          imageUrl={item.imgUrl}
          sourceLogo={item.source?.logo ?? null}
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
      <SwipeableTabWrapper>
        <SafeAreaView style={styles.container}>
          <StatusBar style="dark" />
          <LoadingIndicator />
        </SafeAreaView>
      </SwipeableTabWrapper>
    );
  }

  if (error && articles.length === 0) {
    return (
      <SwipeableTabWrapper>
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
      </SwipeableTabWrapper>
    );
  }

  return (
    <SwipeableTabWrapper>
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
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.accent.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        />
        <ArticleModal
          article={selectedArticle}
          visible={modalVisible}
          onClose={handleCloseModal}
        />
      </SafeAreaView>
    </SwipeableTabWrapper>
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
  featuredSection: {
    marginHorizontal: -layout.screenPaddingHorizontal,
  },
  featuredListContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    padding: spacing.xs
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
