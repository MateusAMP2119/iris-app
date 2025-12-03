import React, { useState, useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ArticleModal, NewsCard, EmptyState, LoadingIndicator, SwipeableTabWrapper } from '../../components';
import { useSavedArticles, useTabBarVisibility } from '../../src/contexts';
import { useNews } from '../../src/hooks';
import { colors, spacing, layout, typography, borderRadius } from '../../lib/constants';
import { getTimeAgo, Article } from '../../models';

export default function SearchScreen() {
  const { articles, loading } = useNews(20);
  const { isArticleSaved, saveArticle, removeArticle } = useSavedArticles();
  const { handleScroll } = useTabBarVisibility();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Filter articles based on search query
  const filteredArticles = searchQuery.trim()
    ? articles.filter((article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.source?.sourceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.categories.some((cat) =>
          cat.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : [];

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

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Search</Text>
      
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={colors.secondary.gray400}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search articles..."
          placeholderTextColor={colors.secondary.gray400}
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            setIsSearching(text.length > 0);
          }}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={handleClearSearch} hitSlop={8}>
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.secondary.gray400}
            />
          </Pressable>
        )}
      </View>

      {/* Search Results Count */}
      {isSearching && (
        <Text style={styles.resultsCount}>
          {filteredArticles.length} {filteredArticles.length === 1 ? 'result' : 'results'} found
        </Text>
      )}
    </View>
  );

  const renderItem = useCallback(({ item }: { item: Article }) => (
    <View style={styles.cardContainer}>
      <NewsCard
        imageUrl={item.imgUrl}
        sourceLogo={item.source?.logo ?? null}
        headline={item.title}
        date={getTimeAgo(item.publicationDate)}
        isBookmarked={isArticleSaved(item.articleId)}
        onPress={() => handleArticlePress(item)}
        onBookmark={() => handleBookmark(item)}
      />
    </View>
  ), [isArticleSaved, handleArticlePress, handleBookmark]);

  const renderEmptyState = () => {
    if (!isSearching) {
      return (
        <EmptyState
          icon="search-outline"
          title="Search for news"
          message="Enter a keyword to find articles by title, source, or category."
        />
      );
    }

    return (
      <EmptyState
        icon="newspaper-outline"
        title="No results found"
        message={`We couldn't find any articles matching "${searchQuery}". Try a different search term.`}
      />
    );
  };

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

  return (
    <SwipeableTabWrapper>
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style="dark" />
        <FlatList
          data={isSearching ? filteredArticles : []}
          renderItem={renderItem}
          keyExtractor={(item) => item.articleId.toString()}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={[
            styles.listContent,
            (!isSearching || filteredArticles.length === 0) && styles.emptyListContent,
          ]}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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
    marginBottom: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary.gray100,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.body.fontSize,
    color: colors.primary.text,
    paddingVertical: spacing.xs,
  },
  resultsCount: {
    fontSize: typography.caption.fontSize,
    color: colors.secondary.gray600,
    marginTop: spacing.md,
  },
  cardContainer: {
    marginBottom: spacing.md,
  },
});
