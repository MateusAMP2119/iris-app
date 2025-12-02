import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="index">
        <Icon sf="calendar" drawable="ic_menu_today" />
        <Label>Today</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="foryou">
        <Icon sf="person.fill" drawable="ic_menu_person" />
        <Label>For You</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="forlater">
        <Icon sf="bookmark.fill" drawable="ic_menu_bookmark" />
        <Label>For Later</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="search" role="search">
        <Icon sf="magnifyingglass" drawable="ic_menu_search" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
