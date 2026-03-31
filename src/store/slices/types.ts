export type FavoriteMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
};

export type ThemePreference = 'light' | 'dark' | 'system';
