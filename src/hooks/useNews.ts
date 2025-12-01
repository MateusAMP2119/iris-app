import { useState, useEffect, useCallback } from 'react';
import { Article, ArticlesResponse } from '../../models';
import { fetchArticles } from '../../services/api';

interface UseNewsResult {
  articles: Article[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export function useNews(initialPageSize: number = 10): UseNewsResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadArticles = useCallback(async (pageNum: number, isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setLoading(true);
      }
      setError(null);

      const response: ArticlesResponse = await fetchArticles(pageNum, initialPageSize);

      if (isRefresh) {
        setArticles(response.content);
      } else {
        setArticles((prev) => [...prev, ...response.content]);
      }

      setHasMore(response.hasNext);
      setPage(response.pageNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, [initialPageSize]);

  useEffect(() => {
    loadArticles(0, true);
  }, [loadArticles]);

  const refresh = useCallback(async () => {
    await loadArticles(0, true);
  }, [loadArticles]);

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await loadArticles(page + 1, false);
    }
  }, [loading, hasMore, page, loadArticles]);

  return {
    articles,
    loading,
    error,
    refresh,
    loadMore,
    hasMore,
  };
}

export default useNews;
