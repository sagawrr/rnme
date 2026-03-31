import { useFocusEffect } from '@react-navigation/native';
import { Audio, ResizeMode, Video } from 'expo-av';
import { useCallback, useEffect, useState } from 'react';
import { AppState, StyleSheet, View, useWindowDimensions, type AppStateStatus, type LayoutChangeEvent } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { tokens } from '@/theme/tokens';
import { rgbaFromHex } from '@/utils/color';

import LOGIN_INTRO_VIDEO from '@assets/videos/background-intro.mp4';

const PROGRESS_INTERVAL_MS = 12_000;

export function LoginIntroBackdrop() {
  const { colors } = useAppTheme();
  const window = useWindowDimensions();
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const [screenFocused, setScreenFocused] = useState(true);
  const [appState, setAppState] = useState<AppStateStatus>(() => AppState.currentState);

  useFocusEffect(
    useCallback(() => {
      setScreenFocused(true);
      return () => setScreenFocused(false);
    }, [])
  );

  useEffect(() => {
    const sub = AppState.addEventListener('change', setAppState);
    return () => sub.remove();
  }, []);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
  }, []);

  const onStackLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width < 1 || height < 1) return;
    setLayout((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
  };

  const width = layout.width > 0 ? layout.width : window.width;
  const height = layout.height > 0 ? layout.height : window.height;
  const shouldPlay = screenFocused && appState === 'active';

  const scrimWashStyle = {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: rgbaFromHex(colors.overlayBackdrop, tokens.opacity.loginScrim),
  };

  return (
    <View style={styles.stack} pointerEvents="none" onLayout={onStackLayout}>
      <Video
        source={LOGIN_INTRO_VIDEO}
        style={{ position: 'absolute', top: 0, left: 0, width, height }}
        resizeMode={ResizeMode.COVER}
        isLooping
        isMuted
        shouldPlay={shouldPlay}
        useNativeControls={false}
        progressUpdateIntervalMillis={PROGRESS_INTERVAL_MS}
      />
      <View style={scrimWashStyle} />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
});
