import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { ENV } from '@/constants/config';

import type { TmdbMovie, TmdbPaginatedResponse, TmdbVideosResponse } from '@/store/services/tmdb/types';

const tmdbApiKey = ENV.TMDB_API_KEY;

const baseQuery = fetchBaseQuery({
  baseUrl: ENV.TMDB_BASE_URL,
  prepareHeaders: (headers) => {
    headers.set('accept', 'application/json');
    return headers;
  },
});

const movieTag = (id: number) => [{ type: 'Movie' as const, id }];

export const tmdbApi = createApi({
  reducerPath: 'tmdbApi',
  baseQuery,
  tagTypes: ['Movie'],
  endpoints: (build) => ({
    getPopularMovies: build.query<TmdbPaginatedResponse<TmdbMovie>, { page?: number } | void>({
      query: (arg) => ({
        url: '/movie/popular',
        params: { page: arg?.page ?? 1, api_key: tmdbApiKey },
      }),
    }),

    searchMovies: build.query<
      TmdbPaginatedResponse<TmdbMovie>,
      { query: string; page?: number }
    >({
      query: ({ query, page = 1 }) => ({
        url: '/search/movie',
        params: { query, page, api_key: tmdbApiKey },
      }),
    }),

    getMovieDetails: build.query<TmdbMovie, number>({
      query: (movieId) => ({
        url: `/movie/${movieId}`,
        params: { api_key: tmdbApiKey },
      }),
      providesTags: (_r, _e, id) => movieTag(id),
    }),

    getMovieVideos: build.query<TmdbVideosResponse, number>({
      query: (movieId) => ({
        url: `/movie/${movieId}/videos`,
        params: { api_key: tmdbApiKey },
      }),
      providesTags: (_r, _e, id) => movieTag(id),
    }),
  }),
});

export const {
  useGetPopularMoviesQuery,
  useSearchMoviesQuery,
  useGetMovieDetailsQuery,
  useGetMovieVideosQuery,
} = tmdbApi;
