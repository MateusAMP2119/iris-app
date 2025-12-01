import React, { useCallback } from 'react';
import {
  FlatList,
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
import { NewsCard, LoadingIndicator, EmptyState } from '../../src/components';
import { useSavedArticles, useTabBarVisibility } from '../../src/contexts';
import { useNews } from '../../src/hooks';
import { colors, spacing, layout, typography } from '../../src/constants/theme';
import { getTimeAgo, Article } from '../../models';

const { width: screenWidth } = Dimensions.get('window');

export default function ForYouScreen() {
  const router = useRouter();
  const { articles, loading, error, refresh } = useNews(12);
  const { isArticleSaved, saveArticle, removeArticle } = useSavedArticles();
  const { handleScroll } = useTabBarVisibility();
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

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>For You</Text>
      <Text style={styles.subtitle}>Personalized stories based on your interests</Text>
    </View>
  );

  const renderItem = useCallback(({ item, index }: { item: Article; index: number }) => {
    // Alternate between full-width and grid layout
    const isFullWidth = index % 3 === 0;
    
    if (isFullWidth) {
      return (
        <View style={styles.fullWidthItem}>
          <NewsCard
            imageUrl={item.imgUrl}
            source={item.source?.sourceName ?? null}
            headline={item.title}
            date={getTimeAgo(item.publicationDate)}
            isBookmarked={isArticleSaved(item.articleId)}
            onPress={() => handleArticlePress(item)}
            onBookmark={() => handleBookmark(item)}
          />
        </View>
      );
    }

    const isLeft = (index - Math.floor(index / 3)) % 2 === 0;
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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item) => item.articleId.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
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
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: typography.display.fontSize,
    fontWeight: typography.display.fontWeight,
    color: colors.primary.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.secondary.gray600,
  },
  fullWidthItem: {
    marginBottom: spacing.md,
  },
  gridItem: {
    width: (screenWidth - layout.screenPaddingHorizontal * 2 - spacing.md) / 2,
    marginBottom: spacing.md,
  },
  gridItemLeft: {
    marginRight: spacing.sm / 2,
  },
  gridItemRight: {
    marginLeft: spacing.sm / 2,
  },
});
