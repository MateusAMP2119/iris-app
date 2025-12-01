import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, View } from 'react-native';
import { colors, sizes, spacing } from '../../src/constants/theme';

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface TabBarIconProps {
  name: IoniconsName;
  color: string;
  focused: boolean;
}

function TabBarIcon({ name, color, focused }: TabBarIconProps) {
  return (
    <View style={styles.iconContainer}>
      <Ionicons
        name={name}
        size={sizes.tabBarIconSize}
        color={color}
      />
      {focused && <View style={styles.activeIndicator} />}
    </View>
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
          backgroundColor: colors.primary.background,
          borderTopColor: colors.semantic.divider,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? sizes.bottomNavHeight : 70,
          paddingTop: spacing.sm,
          paddingBottom: Platform.OS === 'ios' ? spacing.lg : spacing.md,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
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
              focused={focused}
            />
          ),
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
              focused={focused}
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
              focused={focused}
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
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent.primary,
  },
});
