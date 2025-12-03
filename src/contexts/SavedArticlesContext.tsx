import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedArticle } from '../types';
import { Article } from '../../models';
import { getAuthorName } from '../../lib';

const STORAGE_KEY = '@saved_articles';

interface SavedArticlesContextType {
  savedArticles: SavedArticle[];
  isArticleSaved: (articleId: number) => boolean;
  saveArticle: (article: Article) => Promise<void>;
  removeArticle: (articleId: number) => Promise<void>;
  clearAllSaved: () => Promise<void>;
  loading: boolean;
}

const SavedArticlesContext = createContext<SavedArticlesContextType | undefined>(undefined);

export function SavedArticlesProvider({ children }: { children: ReactNode }) {
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // Load saved articles from storage on mount
  useEffect(() => {
    loadSavedArticles();
  }, []);

  const loadSavedArticles = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setSavedArticles(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load saved articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const persistArticles = async (articles: SavedArticle[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    } catch (error) {
      console.error('Failed to persist saved articles:', error);
    }
  };

  const isArticleSaved = useCallback(
    (articleId: number) => {
      return savedArticles.some((article) => article.articleId === articleId);
    },
    [savedArticles]
  );

  const saveArticle = useCallback(
    async (article: Article) => {
      const savedArticle: SavedArticle = {
        articleId: article.articleId,
        title: article.title,
        subtitle: article.subtitle,
        imgUrl: article.imgUrl,
        sourceName: article.source?.sourceName ?? null,
        sourceLogo: article.source?.logo ?? null,
        authorName: getAuthorName(article.authors),
        publicationDate: article.publicationDate,
        savedAt: new Date().toISOString(),
      };

      const updated = [savedArticle, ...savedArticles.filter((a) => a.articleId !== article.articleId)];
      setSavedArticles(updated);
      await persistArticles(updated);
    },
    [savedArticles]
  );

  const removeArticle = useCallback(
    async (articleId: number) => {
      const updated = savedArticles.filter((article) => article.articleId !== articleId);
      setSavedArticles(updated);
      await persistArticles(updated);
    },
    [savedArticles]
  );

  const clearAllSaved = useCallback(async () => {
    setSavedArticles([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <SavedArticlesContext.Provider
      value={{
        savedArticles,
        isArticleSaved,
        saveArticle,
        removeArticle,
        clearAllSaved,
        loading,
      }}
    >
      {children}
    </SavedArticlesContext.Provider>
  );
}

export function useSavedArticles() {
  const context = useContext(SavedArticlesContext);
  if (context === undefined) {
    throw new Error('useSavedArticles must be used within a SavedArticlesProvider');
  }
  return context;
}
