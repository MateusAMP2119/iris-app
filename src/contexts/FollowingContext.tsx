import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FollowedSource } from '../types';
import { Source } from '../../models';

const STORAGE_KEY = '@followed_sources';

interface FollowingContextType {
  followedSources: FollowedSource[];
  isSourceFollowed: (sourceId: number) => boolean;
  followSource: (source: Source) => Promise<void>;
  unfollowSource: (sourceId: number) => Promise<void>;
  loading: boolean;
}

const FollowingContext = createContext<FollowingContextType | undefined>(undefined);

export function FollowingProvider({ children }: { children: ReactNode }) {
  const [followedSources, setFollowedSources] = useState<FollowedSource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFollowedSources();
  }, []);

  const loadFollowedSources = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setFollowedSources(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load followed sources:', error);
    } finally {
      setLoading(false);
    }
  };

  const persistSources = async (sources: FollowedSource[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sources));
    } catch (error) {
      console.error('Failed to persist followed sources:', error);
    }
  };

  const isSourceFollowed = useCallback(
    (sourceId: number) => {
      return followedSources.some((source) => source.sourceId === sourceId);
    },
    [followedSources]
  );

  const followSource = useCallback(
    async (source: Source) => {
      const followedSource: FollowedSource = {
        sourceId: source.sourceId,
        sourceName: source.sourceName,
        sourceUrl: source.sourceUrl,
        followedAt: new Date().toISOString(),
      };

      const updated = [followedSource, ...followedSources.filter((s) => s.sourceId !== source.sourceId)];
      setFollowedSources(updated);
      await persistSources(updated);
    },
    [followedSources]
  );

  const unfollowSource = useCallback(
    async (sourceId: number) => {
      const updated = followedSources.filter((source) => source.sourceId !== sourceId);
      setFollowedSources(updated);
      await persistSources(updated);
    },
    [followedSources]
  );

  return (
    <FollowingContext.Provider
      value={{
        followedSources,
        isSourceFollowed,
        followSource,
        unfollowSource,
        loading,
      }}
    >
      {children}
    </FollowingContext.Provider>
  );
}

export function useFollowing() {
  const context = useContext(FollowingContext);
  if (context === undefined) {
    throw new Error('useFollowing must be used within a FollowingProvider');
  }
  return context;
}
