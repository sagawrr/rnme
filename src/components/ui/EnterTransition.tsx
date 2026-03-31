import type { ReactNode } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';

type Props = {
  children: ReactNode;
  durationMs?: number;
};

export function EnterTransition({ children, durationMs = 220 }: Props) {
  return <Animated.View entering={FadeIn.duration(durationMs)}>{children}</Animated.View>;
}

