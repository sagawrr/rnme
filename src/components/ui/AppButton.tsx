import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import type { AppColors } from '@/theme/colors';
import { fontFamily } from '@/theme/fonts';
import { tokens } from '@/theme/tokens';

import { PressableScale } from './PressableScale';

export type AppButtonVariant = 'primary' | 'secondary' | 'outline';

export type AppButtonProps = {
  variant?: AppButtonVariant;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

function containerForVariant(c: AppColors, variant: AppButtonVariant, disabled: boolean): ViewStyle {
  const base: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: tokens.space.sm,
    borderRadius: tokens.radius.md,
  };
  if (variant === 'primary') {
    return {
      ...base,
      backgroundColor: disabled ? c.trailerDisabled : c.primary,
      paddingVertical: tokens.space.md + 2,
      paddingHorizontal: tokens.space.lg,
    };
  }
  if (variant === 'outline') {
    return {
      ...base,
      backgroundColor: c.surfaceMuted,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
      paddingVertical: tokens.space.md,
      paddingHorizontal: tokens.space.md,
    };
  }
  return {
    ...base,
    backgroundColor: 'transparent',
    paddingVertical: tokens.space.md,
    paddingHorizontal: tokens.space.lg,
  };
}

function labelForVariant(c: AppColors, variant: AppButtonVariant): TextStyle {
  if (variant === 'primary') {
    return { color: c.onPrimary, fontSize: 16, fontFamily: fontFamily.bodySemiBold };
  }
  if (variant === 'outline') {
    return { color: c.text, fontSize: 15, fontFamily: fontFamily.bodySemiBold };
  }
  return { color: c.textMuted, fontSize: 15, fontFamily: fontFamily.bodySemiBold };
}

export function AppButton({
  variant = 'primary',
  onPress,
  disabled = false,
  loading = false,
  children,
  style,
  labelStyle,
}: AppButtonProps) {
  const { colors } = useAppTheme();

  return (
    <PressableScale
      onPress={onPress}
      disabled={loading || disabled}
      style={[containerForVariant(colors, variant, disabled && variant === 'primary'), style]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.onPrimary : colors.textMuted} />
      ) : typeof children === 'string' || typeof children === 'number' ? (
        <Text style={[labelForVariant(colors, variant), labelStyle]} selectable>
          {children}
        </Text>
      ) : (
        children
      )}
    </PressableScale>
  );
}

