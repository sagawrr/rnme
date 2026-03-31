import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Text, View } from 'react-native';

import { EnterTransition } from '@/components/ui/EnterTransition';
import { PressableScale } from '@/components/ui/PressableScale';
import { COPY } from '@/constants/copy';
import type { TmdbMovie } from '@/store/api/types';
import type { AppColors } from '@/theme/colors';
import { tokens } from '@/theme/tokens';
import { tmdbImageUrl } from '@/utils/tmdb';

import type { HomeScreenStyles } from '../HomeScreen';

type Props = {
  movie: TmdbMovie;
  styles: HomeScreenStyles;
  colors: AppColors;
};

export function MovieBrowseRow({ movie, styles, colors }: Props) {
  const uri = tmdbImageUrl(movie.poster_path, 'w185');

  return (
    <EnterTransition>
      <Link href={`/movie/${movie.id}`} asChild>
        <PressableScale style={styles.row}>
          {uri ? (
            <Image
              source={{ uri }}
              style={styles.poster}
              contentFit="cover"
              transition={tokens.motion.imageFadeMs}
              cachePolicy="memory-disk"
            />
          ) : (
            <View style={[styles.poster, styles.posterPlaceholder]} />
          )}
          <View style={styles.rowBody}>
            <Text style={styles.title} numberOfLines={2}>
              {movie.title}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              {movie.release_date ?? '—'} · ★ {movie.vote_average.toFixed(1)}
            </Text>
            <Text style={styles.overview} numberOfLines={2}>
              {movie.overview || COPY.movie.noOverview}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </PressableScale>
      </Link>
      <Link.Preview />
    </EnterTransition>
  );
}
