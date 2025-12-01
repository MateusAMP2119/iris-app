/**
 * Type definitions for the News Aggregator App
 */

// Re-export Article types from models
export { Article, Author, Category, Source, ArticlesResponse } from '../../models';

// Navigation types for typed routes
export type RootTabParamList = {
  Today: undefined;
  ForYou: undefined;
  ForLater: undefined;
  Search: undefined;
};

export type RootStackParamList = {
  Main: undefined;
  ArticleDetail: { articleId: number };
  Following: undefined;
  Discover: undefined;
  History: undefined;
};

// Saved article type (extends Article with bookmark metadata)
export interface SavedArticle {
  articleId: number;
  title: string;
  subtitle: string | null;
  imgUrl: string | null;
  sourceName: string | null;
  publicationDate: string;
  savedAt: string;
}

// Source following type
export interface FollowedSource {
  sourceId: number;
  sourceName: string;
  sourceUrl: string;
  logoUrl?: string;
  followedAt: string;
}

// Reading history entry
export interface HistoryEntry {
  articleId: number;
  title: string;
  sourceName: string | null;
  imgUrl: string | null;
  readAt: string;
}

// Tab bar item configuration
export interface TabBarItem {
  name: string;
  label: string;
  icon: string;
  activeIcon: string;
}
