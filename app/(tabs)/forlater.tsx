import React, { useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ReadLaterCard, EmptyState, LoadingIndicator, SwipeableTabWrapper } from '../../components';
import { useSavedArticles, useTabBarVisibility } from '../../src/contexts';
import { colors, spacing, layout, typography } from '../../lib/constants';
import { getTimeAgo } from '../../models';
import { SavedArticle } from '../../src/types';

export default function ForLaterScreen() {
  const router = useRouter();
  const { savedArticles, loading } = useSavedArticles();
  const { handleScroll } = useTabBarVisibility();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Just simulate refresh since data is from local storage
    await new Promise(resolve => setTimeout(resolve, 500));
    setRefreshing(false);
  }, []);

  const handleArticlePress = useCallback((article: SavedArticle) => {
    router.push({
      pathname: '/article/[id]',
      params: { id: article.articleId.toString() },
    });
  }, [router]);

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Read Later</Text>
      {savedArticles.length > 0 && (
        <Text style={styles.count}>
          {savedArticles.length} {savedArticles.length === 1 ? 'article' : 'articles'} saved
        </Text>
      )}
    </View>
  );

  const renderItem = useCallback(({ item }: { item: SavedArticle }) => (
    <View style={styles.cardContainer}>
      <ReadLaterCard
        sourceLogo={item.sourceLogo}
        headline={item.title}
        thumbnailUrl={item.imgUrl}
        authorName={item.authorName}
        date={getTimeAgo(item.publicationDate)}
        onPress={() => handleArticlePress(item)}
      />
    </View>
  ), [handleArticlePress]);

  if (loading) {
    return (
      <SwipeableTabWrapper>
        <SafeAreaView style={styles.container}>
          <StatusBar style="dark" />
          <LoadingIndicator />
        </SafeAreaView>
      </SwipeableTabWrapper>
    );
  }

  return (
    <SwipeableTabWrapper>
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style="dark" />
        <FlatList
          data={savedArticles}
          renderItem={renderItem}
          keyExtractor={(item) => item.articleId.toString()}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <EmptyState
              icon="bookmark-outline"
              title="No saved articles"
              message="Articles you save for later will appear here. Tap the bookmark icon on any article to save it."
            />
          }
          contentContainerStyle={[
            styles.listContent,
            savedArticles.length === 0 && styles.emptyListContent,
          ]}
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
  emptyListContent: {
    flex: 1,
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
  count: {
    fontSize: typography.caption.fontSize,
    color: colors.secondary.gray600,
  },
  cardContainer: {
    marginBottom: spacing.md,
  },
});
