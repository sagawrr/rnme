import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import type { AppColors } from '@/theme/colors';
import { tokens } from '@/theme/tokens';

export function rowCardStyle(c: AppColors): ViewStyle {
  return {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: c.surface,
    padding: tokens.space.md + 2,
    borderRadius: tokens.radius.lg,
    gap: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: c.border,
  };
}

type PanelProps = {
  elevated?: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Panel({ elevated = false, children, style }: PanelProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: elevated ? tokens.radius.xl : tokens.radius.lg,
          padding: elevated ? tokens.space.lg + 2 : tokens.space.md + 2,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          ...(elevated ? tokens.shadow.card : {}),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

