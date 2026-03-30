export type TmdbPaginatedResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

export type TmdbMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  overview: string;
  vote_average: number;
  vote_count?: number;
  runtime?: number | null;
  genres?: { id: number; name: string }[];
};

export type TmdbVideo = {
  key: string;
  name: string;
  site: string;
  type: string;
  official?: boolean;
};

export type TmdbVideosResponse = {
  id: number;
  results: TmdbVideo[];
};

