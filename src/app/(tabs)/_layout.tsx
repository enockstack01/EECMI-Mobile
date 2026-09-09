import { Ionicons } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import { View } from 'react-native';

import { AppHeader } from '@/components/ui/app-header';
import { Fonts } from '@/constants/theme';
import { useNotifications } from '@/hooks/use-notifications';
import { useTheme } from '@/hooks/use-theme';

type IconName = keyof typeof Ionicons.glyphMap;

const TABS: { name: string; title: string; icon: IconName }[] = [
  { name: 'index', title: 'Home', icon: 'home' },
  { name: 'devotions', title: 'Devotions', icon: 'book' },
  { name: 'news', title: 'News', icon: 'newspaper' },
  { name: 'involved', title: 'Get Involved', icon: 'hand-left' },
  { name: 'account', title: 'Account', icon: 'person-circle' },
];

export default function TabsLayout() {
  const c = useTheme();
  const { unread } = useNotifications();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: ({ options, route }) => (
          <AppHeader
            variant={route.name === 'index' ? 'home' : 'section'}
            title={options.title ?? ''}
            action={{
              icon: unread > 0 ? 'notifications' : 'notifications-outline',
              onPress: () => router.push('/notifications'),
              accessibilityLabel: unread > 0 ? `Notifications, ${unread} unread` : 'Notifications',
              badge: unread > 0,
            }}
          />
        ),
        sceneStyle: { backgroundColor: c.background },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.textSecondary,
        tabBarStyle: { backgroundColor: c.background, borderTopColor: c.border },
        tabBarItemStyle: { paddingVertical: 4 },
        tabBarLabelStyle: { fontFamily: Fonts.sans, fontSize: 11, fontWeight: '600' },
      }}>
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size, focused }) => (
              <View>
                <Ionicons
                  name={focused ? tab.icon : (`${tab.icon}-outline` as IconName)}
                  size={size}
                  color={color}
                />
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
