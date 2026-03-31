import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Redirect, useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useLayoutEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AppButton } from '@/components/ui/AppButton';
import { EnterTransition } from '@/components/ui/EnterTransition';
import { Panel } from '@/components/ui/Panel';
import { COPY } from '@/constants/copy';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { useAuthSession } from '@/hooks/use-auth-session';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useGetMovieDetailsQuery, useGetMovieVideosQuery } from '@/store/api/tmdbApi';
import { toggleFavorite, toFavoriteMovie } from '@/store/slices/favoritesSlice';
import type { AppColors } from '@/theme/colors';
import { fontFamily } from '@/theme/fonts';
import { tokens } from '@/theme/tokens';
import { tmdbImageUrl, tmdbYoutubeTrailerKey } from '@/utils/tmdb';

export default function MovieDetailScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { isOnline } = useNetworkStatus();
  const session = useAuthSession();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const movieId = Number(idParam);
  const router = useRouter();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const querySkip = !Number.isFinite(movieId) || session == null;
  const { data: movie, isLoading, isFetching, error, refetch } = useGetMovieDetailsQuery(movieId, {
    skip: querySkip,
  });
  const { data: videos } = useGetMovieVideosQuery(movieId, { skip: querySkip });
  const trailerKey = tmdbYoutubeTrailerKey(videos);

  const isFavorite = useAppSelector((s) => s.favorites.entries.some((e) => e.id === movieId));

  useLayoutEffect(() => {
    navigation.setOptions({ title: movie?.title ?? COPY.movie.stackTitleFallback });
  }, [navigation, movie?.title]);

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

  if (!Number.isFinite(movieId)) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error} selectable>
          {COPY.movie.invalid}
        </Text>
      </View>
    );
  }

  if (!movie) {
    if (error) {
      return (
      <View style={styles.centered}>
        <Text style={styles.error} selectable>
          {isOnline === false ? COPY.movie.offlineHint : COPY.movie.loadError}
        </Text>
          <AppButton variant="primary" onPress={() => refetch()} style={styles.retry}>
            {COPY.movie.retry}
          </AppButton>
        </View>
      );
    }
    if (isLoading || isFetching) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }
    return (
      <View style={styles.centered}>
        <Text style={styles.error} selectable>
          {isOnline === false ? COPY.movie.offlineHint : COPY.movie.loadError}
        </Text>
        <AppButton variant="primary" onPress={() => refetch()} style={styles.retry}>
          {COPY.movie.retry}
        </AppButton>
      </View>
    );
  }

  const backdropUri = tmdbImageUrl(movie.backdrop_path ?? movie.poster_path, 'w780');
  const posterUri = tmdbImageUrl(movie.poster_path, 'w342');

  const onToggleFavorite = () => {
    dispatch(toggleFavorite(toFavoriteMovie(movie)));
  };

  const onPlayTrailer = () => {
    if (!trailerKey) return;
    router.push(`/player?youtubeKey=${encodeURIComponent(trailerKey)}` as Href);
  };

  const releaseDisplay = movie.release_date ?? COPY.movie.notAvailable;
  const ratingDisplay = Number.isFinite(movie.vote_average)
    ? COPY.movie.ratingValue(movie.vote_average)
    : COPY.movie.notAvailable;
  const runtimeDisplay = movie.runtime
    ? COPY.movie.runtimeMinutes(movie.runtime)
    : COPY.movie.notAvailable;

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      {isOnline === false ? (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineBannerText} selectable>
            {COPY.home.offlineBanner}
          </Text>
        </View>
      ) : null}
      {backdropUri ? (
        <Image source={{ uri: backdropUri }} style={styles.backdrop} contentFit="cover" />
      ) : (
        <View style={[styles.backdrop, styles.backdropPlaceholder]} />
      )}
      <Panel
        elevated
        style={{
          marginTop: -(tokens.space['2xl'] + tokens.space.xs),
          marginHorizontal: tokens.space.lg,
        }}
      >
        <EnterTransition durationMs={260}>
          <View style={styles.headerRow}>
            {posterUri ? (
              <Image source={{ uri: posterUri }} style={styles.poster} contentFit="cover" />
            ) : (
              <View style={[styles.poster, styles.posterPlaceholder]} />
            )}
            <View style={styles.headerText}>
              <Text style={styles.title} selectable>
                {movie.title}
              </Text>
            </View>
          </View>
          <View style={styles.facts}>
            <View style={styles.factRow}>
              <Text style={styles.factLabel}>{COPY.movie.releasedLabel}</Text>
              <Text style={styles.factValue} selectable>
                {releaseDisplay}
              </Text>
            </View>
            <View style={styles.factRow}>
              <Text style={styles.factLabel}>{COPY.movie.ratingLabel}</Text>
              <Text style={[styles.factValue, styles.factTabular]} selectable>
                {ratingDisplay}
              </Text>
            </View>
            <View style={styles.factRow}>
              <Text style={styles.factLabel}>{COPY.movie.runtimeLabel}</Text>
              <Text style={styles.factValue} selectable>
                {runtimeDisplay}
              </Text>
            </View>
          </View>
          {!!movie.genres?.length && (
            <Text style={styles.genres} selectable>
              {movie.genres.map((g) => g.name).join(' · ')}
            </Text>
          )}
          <Text style={styles.overview} selectable>
            {movie.overview || COPY.movie.noOverview}
          </Text>
          <View style={styles.actions}>
            <AppButton variant="outline" onPress={onToggleFavorite} style={styles.favBtn}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={22}
                color={isFavorite ? colors.heart : colors.text}
              />
              <Text style={styles.favLabel}>{isFavorite ? COPY.movie.saved : COPY.movie.save}</Text>
            </AppButton>
            <AppButton
              variant="primary"
              onPress={onPlayTrailer}
              disabled={!trailerKey}
              style={styles.trailerBtn}
            >
              <Ionicons name="play-circle" size={22} color={colors.onPrimary} />
              <Text style={styles.trailerLabel}>{COPY.movie.trailer}</Text>
            </AppButton>
          </View>
        </EnterTransition>
      </Panel>
    </ScrollView>
  );
}

function createStyles(c: AppColors) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.background },
    offlineBanner: {
      paddingHorizontal: tokens.space.lg,
      paddingVertical: tokens.space.sm + 2,
      backgroundColor: c.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
    offlineBannerText: {
      fontFamily: fontFamily.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
      color: c.textSecondary,
    },
    content: { paddingBottom: tokens.space.xl + tokens.space.sm },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: tokens.space.xl,
      backgroundColor: c.background,
    },
    error: { fontSize: 15, color: c.error, textAlign: 'center', fontFamily: fontFamily.bodyMedium },
    retry: {
      marginTop: 12,
      paddingHorizontal: tokens.space.lg2,
      paddingVertical: 10,
      borderRadius: tokens.radius.sm,
    },
    backdrop: { width: '100%', height: 200, backgroundColor: c.overlayBackdrop },
    backdropPlaceholder: {},
    headerRow: { flexDirection: 'row', gap: 14 },
    poster: {
      width: 96,
      height: 144,
      borderRadius: tokens.radius.sm,
      backgroundColor: c.posterPlaceholder,
    },
    posterPlaceholder: {},
    headerText: { flex: 1, minWidth: 0, justifyContent: 'center' },
    title: {
      fontSize: 22,
      color: c.text,
      fontFamily: fontFamily.displaySemiBold,
      letterSpacing: -0.3,
      lineHeight: 28,
    },
    facts: {
      marginTop: tokens.space.md + 2,
      gap: tokens.space.sm + 2,
    },
    factRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: tokens.space.md,
    },
    factLabel: {
      fontSize: 13,
      color: c.textMuted,
      fontFamily: fontFamily.bodySemiBold,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    factValue: {
      flex: 1,
      textAlign: 'right',
      fontSize: 15,
      color: c.textSecondary,
      fontFamily: fontFamily.bodyMedium,
      lineHeight: 22,
    },
    factTabular: { fontVariant: ['tabular-nums'] },
    genres: {
      marginTop: tokens.space.md + 2,
      fontSize: 13,
      color: c.textMuted,
      fontFamily: fontFamily.bodyMedium,
    },
    overview: {
      marginTop: tokens.space.md,
      fontSize: 15,
      color: c.textSecondary,
      lineHeight: 24,
      fontFamily: fontFamily.body,
    },
    actions: { flexDirection: 'row', gap: tokens.space.md, marginTop: tokens.space.lg + 4 },
    favBtn: {
      flex: 1,
      borderRadius: tokens.radius.sm + 2,
    },
    favLabel: { fontSize: 15, color: c.text, fontFamily: fontFamily.bodySemiBold },
    trailerBtn: {
      flex: 1,
      borderRadius: tokens.radius.sm + 2,
    },
    trailerLabel: { fontSize: 15, color: c.onPrimary, fontFamily: fontFamily.bodySemiBold },
  });
}
