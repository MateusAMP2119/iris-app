import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Article, Category } from '../models';
import MockDataService from '../services/MockDataService';
import {
  HeroArticleCard,
  NewspaperCompactCard,
  NewspaperColumn,
  CategoryChip,
  SectionHeader,
  LiquidGlassFAB,
} from '../components';
import { AppColors, AppTextStyles, AppSpacing } from '../theme';

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

  const handleCategorySelect = (category: Category | null) => {
    setSelectedCategory(category);
    if (category) {
      setArticles(MockDataService.getArticlesByCategory(category.id));
    } else {
      setArticles(MockDataService.getRecentArticles());
    }
  };

  const navigateToArticle = (article: Article) => {
    router.push({
      pathname: '/article/[id]',
      params: { id: article.id.toString() },
    });
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
      return remainingArticles.map((article) => (
        <NewspaperCompactCard
          key={article.id}
          article={article}
          onTap={() => navigateToArticle(article)}
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
      <ScrollView style={styles.scrollView}>
        {/* Masthead */}
        <View style={styles.masthead}>
          <View style={styles.dateRow}>
            <View style={styles.dateLine} />
            <Text style={styles.dateText}>{dateString.toUpperCase()}</Text>
          </View>
          <Text style={[styles.mastheadTitle, !isMobile && styles.mastheadTitleDesktop]}>
            IRIS NEWS
          </Text>
          <View style={styles.mastheadUnderline} />
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}
        >
          <Pressable
            onPress={() => handleCategorySelect(null)}
            style={[
              styles.allCategoryChip,
              {
                backgroundColor:
                  selectedCategory === null
                    ? AppColors.primaryText
                    : 'transparent',
                borderColor: AppColors.primaryText,
              },
            ]}
          >
            <Text
              style={[
                styles.allCategoryText,
                {
                  color:
                    selectedCategory === null
                      ? AppColors.surface
                      : AppColors.primaryText,
                },
              ]}
            >
              ALL
            </Text>
          </Pressable>
          {categories.map((category) => (
            <CategoryChip
              key={category.id}
              category={category}
              isSelected={selectedCategory?.id === category.id}
              onTap={() => handleCategorySelect(category)}
            />
          ))}
        </ScrollView>

        {/* Hero Article */}
        {articles.length > 0 && (
          <View style={styles.heroSection}>
            <HeroArticleCard
              article={articles[0]}
              onTap={() => navigateToArticle(articles[0])}
            />
          </View>
        )}

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <SectionHeader
            title={selectedCategory ? selectedCategory.name : 'Latest News'}
            subtitle={selectedCategory?.description}
          />
        </View>

        {/* Newspaper Layout */}
        <View style={styles.articlesSection}>{renderNewspaperLayout()}</View>

        <View style={{ height: AppSpacing.xxxl }} />
      </ScrollView>

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <LiquidGlassFAB
          isExpanded={isFabMenuExpanded}
          onToggle={() => setIsFabMenuExpanded(!isFabMenuExpanded)}
          onSearchTap={handleSearch}
          onFilterTap={showFilterBottomSheet}
        />
      </View>
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
  masthead: {
    paddingHorizontal: pageMargin,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: AppSpacing.md,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppSpacing.sm,
  },
  dateLine: {
    width: 30,
    height: 1,
    backgroundColor: AppColors.primaryText,
    marginRight: AppSpacing.xs,
  },
  dateText: {
    ...AppTextStyles.caption,
    color: AppColors.primaryText,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  mastheadTitle: {
    ...AppTextStyles.headlinePrimary,
    color: AppColors.primaryText,
    fontWeight: '900',
    letterSpacing: 2,
  },
  mastheadTitleDesktop: {
    ...AppTextStyles.masthead,
    letterSpacing: 4,
  },
  mastheadUnderline: {
    width: isMobile ? 120 : 200,
    height: 2,
    backgroundColor: AppColors.primaryText,
    marginTop: AppSpacing.xs / 2,
  },
  categoryScroll: {
    height: 30,
    marginLeft: pageMargin,
    marginTop: AppSpacing.lg,
  },
  categoryContent: {
    paddingRight: pageMargin,
    gap: AppSpacing.sm,
  },
  allCategoryChip: {
    paddingHorizontal: AppSpacing.md,
    paddingVertical: 3,
    borderWidth: 1.5,
    height: 30,
    justifyContent: 'center',
  },
  allCategoryText: {
    ...AppTextStyles.labelSmall,
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  heroSection: {
    paddingHorizontal: pageMargin,
    marginTop: AppSpacing.lg,
  },
  sectionHeader: {
    paddingHorizontal: pageMargin,
    marginTop: AppSpacing.lg,
  },
  articlesSection: {
    paddingHorizontal: pageMargin,
    marginTop: AppSpacing.md,
  },
  columnsContainer: {
    flexDirection: 'row',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});

export default HomeScreen;
