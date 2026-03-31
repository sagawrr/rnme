import type { ReactNode } from 'react';
import { Platform, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useAppTheme } from '@/hooks/use-app-theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type PressableScaleProps = Omit<PressableProps, 'style'> & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  pressedScale?: number;
};

export function PressableScale({
  children,
  style,
  pressedScale = 0.985,
  onPressIn,
  onPressOut,
  disabled,
  android_ripple: androidRippleProp,
  ...rest
}: PressableScaleProps) {
  const { isDark } = useAppTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const androidRipple =
    androidRippleProp ??
    (Platform.OS === 'android'
      ? {
          color: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
          foreground: true,
          borderless: false,
        }
      : undefined);

  return (
    <AnimatedPressable
      disabled={disabled}
      android_ripple={androidRipple}
      style={[style, animatedStyle]}
      onPressIn={(e) => {
        if (!disabled) {
          scale.value = withSpring(pressedScale, { damping: 18, stiffness: 380 });
        }
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        if (!disabled) {
          scale.value = withSpring(1, { damping: 18, stiffness: 380 });
        }
        onPressOut?.(e);
      }}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}

