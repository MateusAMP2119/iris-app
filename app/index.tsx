import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  ArticleModal,
  HeroArticleCard,
  LiquidGlassFAB,
  NewspaperColumn,
  NewspaperCompactCard,
} from '../components';
import { Article, Category } from '../models';
import MockDataService from '../services/MockDataService';
import { AppColors, AppSpacing, AppTextStyles } from '../theme';

const { width } = Dimensions.get('window');
const isMobile = width < 768;
const pageMargin = isMobile ? AppSpacing.md : AppSpacing.xl;

function HomeScreen() {
  const [articles, setArticles] = useState<Article[]>(
    MockDataService.getRecentArticles()
  );
  const [categories] = useState<Category[]>(MockDataService.categories);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isFabMenuExpanded, setIsFabMenuExpanded] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isArticleModalVisible, setIsArticleModalVisible] = useState(false);

  const handleCategorySelect = (category: Category | null) => {
    setSelectedCategory(category);
    if (category) {
      setArticles(MockDataService.getArticlesByCategory(category.id));
    } else {
      setArticles(MockDataService.getRecentArticles());
    }
  };

  const navigateToArticle = (article: Article) => {
    setSelectedArticle(article);
    setIsArticleModalVisible(true);
  };

  const closeArticleModal = () => {
    setIsArticleModalVisible(false);
    setTimeout(() => setSelectedArticle(null), 300); // Clear after animation
  };

  const showFilterBottomSheet = () => {
    // TODO: Implement filter bottom sheet
    alert('Filter options coming soon');
  };

  const handleSearch = () => {
    // TODO: Implement search
    alert('Search functionality coming soon');
  };

  const renderNewspaperLayout = () => {
    const remainingArticles = articles.slice(1);

    if (isMobile) {
      // Mobile: Single column with compact layout
      return remainingArticles.map((article, index) => (
        <NewspaperCompactCard
          key={article.id}
          article={article}
          onTap={() => navigateToArticle(article)}
          index={index}
        />
      ));
    } else {
      // Desktop/Tablet: Multi-column newspaper layout
      const columns = 3;
      const articlesPerColumn = Math.ceil(remainingArticles.length / columns);

      return (
        <View style={styles.columnsContainer}>
          {[0, 1, 2].map((columnIndex) => {
            const startIndex = columnIndex * articlesPerColumn;
            const endIndex = Math.min(
              startIndex + articlesPerColumn,
              remainingArticles.length
            );

            if (startIndex >= remainingArticles.length) {
              return <View key={columnIndex} style={{ flex: 1 }} />;
            }

            const columnArticles = remainingArticles.slice(
              startIndex,
              endIndex
            );

            const columnTitle =
              columnIndex === 0
                ? 'NATIONAL'
                : columnIndex === 1
                ? 'INTERNATIONAL'
                : 'BUSINESS';

            return (
              <NewspaperColumn
                key={columnIndex}
                articles={columnArticles}
                onArticleTap={navigateToArticle}
                title={columnTitle}
              />
            );
          })}
        </View>
      );
    }
  };

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
      >
        {/* Masthead - Compact Newspaper Header */}
        <View style={styles.masthead}>
          <View style={styles.mastheadRow}>
            <Text style={styles.mastheadTitle}>IRIS</Text>
            <View style={styles.mastheadDivider} />
            <Text style={styles.dateText}>{dateString.toUpperCase()}</Text>
          </View>
        </View>

        {/* Category Navigation Bar */}
        <View style={styles.navBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.navContent}
          >
            <Pressable
              onPress={() => handleCategorySelect(null)}
              style={styles.navItem}
            >
              <Text
                style={[
                  styles.navText,
                  selectedCategory === null && styles.navTextActive,
                ]}
              >
                ALL NEWS
              </Text>
            </Pressable>
            {categories.map((category) => (
              <Pressable
                key={category.id}
                onPress={() => handleCategorySelect(category)}
                style={styles.navItem}
              >
                <Text
                  style={[
                    styles.navText,
                    selectedCategory?.id === category.id && styles.navTextActive,
                  ]}
                >
                  {category.name.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Hero Article - Above the Fold */}
        {articles.length > 0 && (
          <View style={styles.heroSection}>
            <HeroArticleCard
              article={articles[0]}
              onTap={() => navigateToArticle(articles[0])}
            />
            {articles.length > 1 && (
              <View style={styles.heroDivider}>
                <Text style={styles.heroDividerText}>
                  {selectedCategory 
                    ? `${selectedCategory.name.toUpperCase()} • LATEST UPDATES` 
                    : `TRENDING NOW • ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}`
                  }
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Articles Grid - Newspaper Columns */}
        {articles.length > 1 && (
          <View style={styles.articlesSection}>{renderNewspaperLayout()}</View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Liquid Glass FAB */}
      <View style={styles.fabContainer}>
        <LiquidGlassFAB
          isExpanded={isFabMenuExpanded}
          onToggle={() => setIsFabMenuExpanded(!isFabMenuExpanded)}
          onSearchTap={handleSearch}
          onFilterTap={showFilterBottomSheet}
        />
      </View>

      {/* Article Modal */}
      <ArticleModal
        article={selectedArticle}
        visible={isArticleModalVisible}
        onClose={closeArticleModal}
      />
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
  
  // ========== MASTHEAD ==========
  masthead: {
    paddingHorizontal: pageMargin,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: AppSpacing.sm,
    borderBottomWidth: 3,
    borderBottomColor: AppColors.primaryText,
  },
  mastheadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mastheadTitle: {
    ...AppTextStyles.headlinePrimary,
    color: AppColors.primaryText,
    fontWeight: '900',
    letterSpacing: 8,
    fontSize: isMobile ? 28 : 36,
  },
  mastheadDivider: {
    flex: 1,
    height: 2,
    backgroundColor: AppColors.primaryText,
    marginHorizontal: AppSpacing.md,
  },
  dateText: {
    ...AppTextStyles.caption,
    color: AppColors.primaryText,
    fontWeight: '700',
    letterSpacing: 1.5,
    fontSize: 8,
  },

  // ========== NAVIGATION BAR ==========
  navBar: {
    borderBottomWidth: 3,
    borderBottomColor: AppColors.primaryText,
    backgroundColor: AppColors.primaryText,
  },
  navContent: {
    paddingHorizontal: pageMargin,
    flexDirection: 'row',
    gap: 0,
  },
  navItem: {
    paddingHorizontal: AppSpacing.md,
    paddingVertical: AppSpacing.sm,
    borderRightWidth: 1,
    borderRightColor: AppColors.surface,
  },
  navText: {
    ...AppTextStyles.labelSmall,
    color: AppColors.surface,
    fontWeight: '800',
    letterSpacing: 1.5,
    fontSize: 11,
  },
  navTextActive: {
    color: AppColors.surface,
    textDecorationLine: 'underline',
  },

  // ========== HERO SECTION ==========
  heroSection: {
    paddingHorizontal: pageMargin,
    paddingTop: AppSpacing.xl,
  },
  heroDivider: {
    backgroundColor: AppColors.primaryText,
    paddingHorizontal: AppSpacing.md,
    paddingVertical: AppSpacing.sm,
    marginTop: AppSpacing.lg,
    marginLeft: -pageMargin,
    marginRight: -pageMargin,
    paddingLeft: pageMargin,
    paddingRight: isMobile ? 100 : 120, // Leave space for FAB
  },
  heroDividerText: {
    ...AppTextStyles.labelSmall,
    color: AppColors.surface,
    fontWeight: '900',
    letterSpacing: 2,
    fontSize: 11,
  },

  // ========== ARTICLES SECTION ==========
  articlesSection: {
    paddingTop: AppSpacing.lg,
    paddingHorizontal: isMobile ? pageMargin : 0,
  },
  columnsContainer: {
    flexDirection: 'row',
  },

  // ========== FAB ==========
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
});

export default HomeScreen;
