import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

import type { AppColors } from '@/theme/colors';

export function buildNavigationTheme(colors: AppColors, dark: boolean): Theme {
  const base = dark ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.error,
    },
  };
}
