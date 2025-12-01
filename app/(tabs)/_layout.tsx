import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { colors, sizes, spacing } from '../../src/constants/theme';

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface TabBarIconProps {
  name: IoniconsName;
  color: string;
}

function TabBarIcon({ name, color }: TabBarIconProps) {
  return (
    <Ionicons
      name={name}
      size={sizes.tabBarIconSize}
      color={color}
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent.primary,
        tabBarInactiveTintColor: colors.secondary.gray400,
        tabBarStyle: {
          backgroundColor: colors.semantic.navBackground,
          borderTopColor: colors.semantic.divider,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? sizes.bottomNavHeight : 70,
          paddingTop: spacing.sm,
          paddingBottom: Platform.OS === 'ios' ? spacing.lg : spacing.md,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '400',
        },
        tabBarItemStyle: {
          paddingTop: spacing.xs,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'today' : 'today-outline'}
              color={color}
            />
          ),
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      />
      <Tabs.Screen
        name="foryou"
        options={{
          title: 'For You',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'person' : 'person-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="forlater"
        options={{
          title: 'For Later',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'bookmark' : 'bookmark-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'search' : 'search-outline'}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
