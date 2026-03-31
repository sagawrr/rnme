import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { Fraunces_500Medium, Fraunces_600SemiBold } from '@expo-google-fonts/fraunces';
import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { useAppTheme } from '@/hooks/use-app-theme';
import { persistor, store } from '@/store/store';

SplashScreen.preventAutoHideAsync().catch(() => {});

const rootFontSources = {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
};

export function WithLoadedFonts({ children }: { children: ReactNode }) {
  const [fontsLoaded] = useFonts(rootFontSources);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return children;
}

function AppThemeRoot({ children }: { children: ReactNode }) {
  const { navigationTheme, statusBarStyle, colors } = useAppTheme();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background).catch(() => {});
  }, [colors.background]);

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style={statusBarStyle} />
      {children}
    </ThemeProvider>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppThemeRoot>{children}</AppThemeRoot>
      </PersistGate>
    </Provider>
  );
}
