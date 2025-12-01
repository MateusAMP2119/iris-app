import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Article, getTimeAgo } from '../models';
import { fetchArticles } from '../services/api';

function ArticleCard({ article }: { article: Article }) {
  const authorNames = article.authors
    .map((a) => `${a.firstName} ${a.lastName}`)
    .join(', ');

  return (
    <Pressable style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.categoriesRow}>
          {article.categories.map((cat) => (
            <View key={cat.categoryId} style={styles.categoryChip}>
              <Text style={styles.categoryText}>{cat.categoryName}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.title}>{article.title}</Text>
        {article.subtitle && (
          <Text style={styles.subtitle} numberOfLines={2}>
            {article.subtitle}
          </Text>
        )}
        <View style={styles.metaRow}>
          {authorNames && <Text style={styles.author}>{authorNames}</Text>}
          <Text style={styles.time}>{getTimeAgo(article.publicationDate)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchArticles(0, 10);
      setArticles(response.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={loadArticles}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>IRIS</Text>
      </View>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.articleId.toString()}
        renderItem={({ item }) => <ArticleCard article={item} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 4,
    color: '#000',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
  },
  cardContent: {
    paddingVertical: 12,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  categoryChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    lineHeight: 24,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  author: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#c00',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
