import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';

import { supabase } from '@/lib/supabase/client';
import { AppProviders, WithLoadedFonts } from '@/providers/app-provider';
import { fontFamily } from '@/theme/fonts';

export default function RootLayout() {
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    if (AppState.currentState === 'active') {
      supabase.auth.startAutoRefresh();
    }

    return () => {
      sub.remove();
    };
  }, []);

  return (
    <WithLoadedFonts>
      <AppProviders>
        <Stack
          screenOptions={{
            headerTitleAlign: 'center',
            headerTitleStyle: { fontFamily: fontFamily.bodySemiBold, fontSize: 17 },
            animation: Platform.select({
              ios: 'default',
              android: 'slide_from_right',
              default: 'fade',
            }),
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            fullScreenGestureEnabled: Platform.OS === 'ios',
          }}
        />
      </AppProviders>
    </WithLoadedFonts>
  );
}
