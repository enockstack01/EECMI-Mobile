import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

import { AppHeader } from '@/components/ui/app-header';
import { Colors, Fonts } from '@/constants/theme';

type IconName = keyof typeof Ionicons.glyphMap;

const TABS: { name: string; title: string; icon: IconName }[] = [
  { name: 'index', title: 'Home', icon: 'home' },
  { name: 'programs', title: 'Programs', icon: 'grid' },
  { name: 'news', title: 'News', icon: 'newspaper' },
  { name: 'involved', title: 'Get Involved', icon: 'hand-left' },
  { name: 'contact', title: 'Contact', icon: 'chatbubble-ellipses' },
];

export default function TabsLayout() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: ({ options, route }) => (
          <AppHeader
            variant={route.name === 'index' ? 'home' : 'section'}
            title={options.title ?? ''}
          />
        ),
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.textSecondary,
        tabBarStyle: {
          backgroundColor: c.background,
          borderTopColor: c.border,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontFamily: Fonts.sans, fontSize: 11, fontWeight: '600' },
      }}>
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? tab.icon : (`${tab.icon}-outline` as IconName)} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
