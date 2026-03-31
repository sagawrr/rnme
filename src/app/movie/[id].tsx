import { Stack } from 'expo-router';

import { COPY } from '@/constants/copy';
import MovieDetailScreen from '@/screens/movie/MovieDetailScreen';

export default function MovieRoute() {
  return (
    <>
      <Stack.Screen options={{ title: COPY.movie.stackTitleFallback }} />
      <MovieDetailScreen />
    </>
  );
}
