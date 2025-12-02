import React, { useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { ReadLaterCard, EmptyState, LoadingIndicator } from '../../src/components';
import { useSavedArticles, useTabBarVisibility } from '../../src/contexts';
import { colors, spacing, layout, typography } from '../../src/constants/theme';
import { getTimeAgo } from '../../models';
import { SavedArticle } from '../../src/types';

export default function ForLaterScreen() {
  const router = useRouter();
  const { savedArticles, removeArticle, loading } = useSavedArticles();
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

  const handleDelete = useCallback(async (article: SavedArticle) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      'Remove Article',
      'Are you sure you want to remove this article from your reading list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removeArticle(article.articleId);
          },
        },
      ]
    );
  }, [removeArticle]);

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
        date={getTimeAgo(item.publicationDate)}
        onPress={() => handleArticlePress(item)}
        onDelete={() => handleDelete(item)}
      />
    </View>
  ), [handleArticlePress, handleDelete]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <LoadingIndicator />
      </SafeAreaView>
    );
  }

  return (
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
