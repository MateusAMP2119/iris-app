import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';

export default function TabLayout() {
  return (
    <NativeTabs minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="index">
        <Icon sf="calendar" drawable="ic_menu_today" />
        <Label>Today</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="forlater">
        <Icon sf="bookmark.fill" drawable="ic_menu_bookmark" />
        <Label>For Later</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="search">
        <Icon sf="magnifyingglass" drawable="ic_menu_search" />
        <Label>Search</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
