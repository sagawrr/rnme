import { Ionicons } from '@expo/vector-icons';
import { Redirect, Stack, Tabs } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { COPY } from '@/constants/copy';
import { useAppTheme } from '@/hooks/use-app-theme';
import { fontFamily } from '@/theme/fonts';
import { useAuthSession } from '@/hooks/use-auth-session';

export default function TabsLayout() {
  const { colors } = useAppTheme();
  const session = useAuthSession();

  if (session === undefined) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Tabs
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { color: colors.text, fontFamily: fontFamily.bodySemiBold, fontSize: 17 },
          tabBarLabelStyle: { fontFamily: fontFamily.bodyMedium, fontSize: 11 },
          headerShadowVisible: true,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.tabInactive,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: COPY.tabs.browse,
            headerShown: false,
            tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: COPY.tabs.favorites,
            tabBarIcon: ({ color, size }) => <Ionicons name="heart" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: COPY.tabs.profile,
            tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
