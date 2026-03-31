export const ENV = {
  TMDB_API_KEY: process.env.EXPO_PUBLIC_TMDB_API_KEY ?? '',
  TMDB_BASE_URL: process.env.EXPO_PUBLIC_TMDB_BASE_URL ?? 'https://api.themoviedb.org/3',
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  SUPABASE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '',
};

export const TMDB_IMAGE_CDN_BASE = 'https://image.tmdb.org/t/p';
