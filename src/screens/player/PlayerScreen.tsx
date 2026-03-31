import { Redirect, useLocalSearchParams, type Href } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import {
  YoutubeView,
  useYouTubeEvent,
  useYouTubePlayer,
  type YoutubeError,
} from 'react-native-youtube-bridge';

import { COPY } from '@/constants/copy';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuthSession } from '@/hooks/use-auth-session';
import type { AppColors } from '@/theme/colors';
import { tokens } from '@/theme/tokens';
import { normalizeYoutubeKeyFromTmdb, safeDecodeUriComponent, youtubeWatchUrl } from '@/utils/youtube';

function youtubeErrorUserMessage(err: YoutubeError): string {
  switch (err.message) {
    case 'EMBEDDED_PLAYBACK_NOT_ALLOWED':
    case 'EMBEDDED_RESTRICTED':
      return COPY.player.youtubeEmbedBlocked;
    case 'VIDEO_NOT_FOUND_OR_PRIVATE':
      return COPY.player.youtubeMissing;
    case 'HTML5_PLAYER_ERROR':
      return COPY.player.youtubeHtml5Error;
    case 'INVALID_PARAMETER_VALUE':
    case 'INVALID_YOUTUBE_VIDEO_ID':
      return COPY.player.youtubeInvalidId;
    default:
      return COPY.player.youtubeFallback;
  }
}

type EmbeddedYoutubePlayerProps = {
  videoId: string;
  width: number;
  height: number;
  styles: ReturnType<typeof createStyles>;
  onFatalError: (err: YoutubeError) => void;
};

function EmbeddedYoutubePlayer({
  videoId,
  width,
  height,
  styles,
  onFatalError,
}: EmbeddedYoutubePlayerProps) {
  const player = useYouTubePlayer(videoId, {
    autoplay: true,
    controls: true,
    playsinline: true,
    rel: false,
  });

  useYouTubeEvent(player, 'error', (err) => {
    onFatalError(err);
  });

  return (
    <YoutubeView
      player={player}
      width={width}
      height={height}
      useInlineHtml
      style={styles.playerChrome}
      webViewStyle={styles.webView}
      webViewProps={{
        androidLayerType: 'hardware',
        domStorageEnabled: true,
        cacheEnabled: true,
        allowsInlineMediaPlayback: true,
        mediaPlaybackRequiresUserAction: false,
        allowsFullscreenVideo: true,
        ...(Platform.OS === 'android'
          ? { mixedContentMode: 'compatibility', thirdPartyCookiesEnabled: true }
          : {}),
      }}
    />
  );
}

export default function PlayerScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { width } = useWindowDimensions();
  const session = useAuthSession();
  const { youtubeKey: keyParam } = useLocalSearchParams<{ youtubeKey?: string | string[] }>();
  const rawParam = Array.isArray(keyParam) ? keyParam[0] : keyParam;
  const videoId =
    typeof rawParam === 'string' && rawParam
      ? normalizeYoutubeKeyFromTmdb(safeDecodeUriComponent(rawParam)) ?? ''
      : '';

  const [fatalError, setFatalError] = useState<YoutubeError | null>(null);
  const [retry, setRetry] = useState(0);

  const playerHeight = Math.max(200, Math.round(width * (9 / 16)));

  if (session === undefined) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!session) {
    return <Redirect href={'/login' as Href} />;
  }

  if (!videoId) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{COPY.player.noTrailer}</Text>
      </View>
    );
  }

  if (fatalError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.fallbackTitle}>{COPY.player.cantPlayTitle}</Text>
        <Text style={styles.fallbackBody}>{youtubeErrorUserMessage(fatalError)}</Text>
        <AppButton
          variant="primary"
          onPress={() => WebBrowser.openBrowserAsync(youtubeWatchUrl(videoId))}
          style={styles.primaryBtn}
        >
          {COPY.player.watchOnYoutube}
        </AppButton>
        <AppButton
          variant="secondary"
          onPress={() => {
            setFatalError(null);
            setRetry((k) => k + 1);
          }}
          style={styles.secondaryBtn}
        >
          {COPY.common.tryAgain}
        </AppButton>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.playerOuter}>
        <EmbeddedYoutubePlayer
          key={`${videoId}-${retry}`}
          videoId={videoId}
          width={width}
          height={playerHeight}
          styles={styles}
          onFatalError={(err) => setFatalError(err)}
        />
      </View>
      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [styles.linkRow, pressed && styles.btnPressed]}
          onPress={() => WebBrowser.openBrowserAsync(youtubeWatchUrl(videoId))}
        >
          <Text style={styles.linkText}>{COPY.player.openInBrowser}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function createStyles(c: AppColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: tokens.color.black,
    },
    playerOuter: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: tokens.color.black,
    },
    playerChrome: {
      alignSelf: 'center',
      backgroundColor: tokens.color.black,
    },
    webView: {
      backgroundColor: tokens.color.black,
    },
    footer: {
      paddingVertical: tokens.space.md,
      paddingHorizontal: tokens.space.lg,
      backgroundColor: tokens.color.black,
    },
    linkRow: {
      alignSelf: 'center',
      paddingVertical: tokens.space.sm,
      paddingHorizontal: tokens.space.md,
    },
    linkText: {
      color: c.textSecondary,
      fontSize: 15,
      textDecorationLine: 'underline',
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: tokens.space.xl,
      backgroundColor: c.background,
    },
    error: { color: c.text, fontSize: 16, textAlign: 'center' },
    fallbackTitle: {
      color: c.text,
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
    },
    fallbackBody: {
      marginTop: 10,
      color: c.textSecondary,
      fontSize: 15,
      textAlign: 'center',
      lineHeight: 22,
    },
    primaryBtn: {
      marginTop: tokens.space.xl,
      paddingVertical: tokens.space.md2,
      paddingHorizontal: tokens.space.xl,
      borderRadius: tokens.radius.button,
    },
    secondaryBtn: {
      marginTop: tokens.space.md,
      paddingVertical: tokens.space.md,
      paddingHorizontal: tokens.space.lg2,
    },
    btnPressed: { opacity: 0.85 },
  });
}
