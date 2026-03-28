import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Forest',
        }}
      />
      <Tabs.Screen
        name="city"
        options={{
          title: 'Timeline',
        }}
      />
      <Tabs.Screen
        name="donate"
        options={{
          title: 'Real Forest',
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: 'Achievements',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Tabs>
  );
}