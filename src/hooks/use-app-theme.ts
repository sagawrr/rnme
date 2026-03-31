import { useColorScheme } from 'react-native';
import type { StatusBarStyle } from 'expo-status-bar';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setThemePreference } from '@/store/slices/themeSlice';
import type { ThemePreference } from '@/store/slices/types';
import { darkColors, lightColors, type AppColors } from '@/theme/colors';
import { buildNavigationTheme } from '@/theme/navigation';

export function useAppTheme() {
  const preference = useAppSelector((s) => s.theme.preference);
  const dispatch = useAppDispatch();
  const systemScheme = useColorScheme();

  const resolvedScheme: 'light' | 'dark' =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const isDark = resolvedScheme === 'dark';
  const colors: AppColors = isDark ? darkColors : lightColors;
  const navigationTheme = buildNavigationTheme(colors, isDark);
  const statusBarStyle: StatusBarStyle = isDark ? 'light' : 'dark';

  const setPreference = (next: ThemePreference) => {
    dispatch(setThemePreference(next));
  };

  return {
    colors,
    isDark,
    preference,
    resolvedScheme,
    navigationTheme,
    setPreference,
    statusBarStyle,
  };
}
