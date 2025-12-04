import { Stack } from "expo-router";
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FollowingProvider, SavedArticlesProvider, TabBarVisibilityProvider } from '../src/contexts';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SavedArticlesProvider>
          <FollowingProvider>
            <TabBarVisibilityProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              />
            </TabBarVisibilityProvider>
          </FollowingProvider>
        </SavedArticlesProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
