import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { TmdbMovie } from '@/store/api/types';
import type { FavoriteMovie } from './types';

type FavoritesState = {
  entries: FavoriteMovie[];
};

const initialState: FavoritesState = {
  entries: [],
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<FavoriteMovie>) => {
      const movie = action.payload;
      const i = state.entries.findIndex((e) => e.id === movie.id);
      if (i >= 0) state.entries.splice(i, 1);
      else state.entries.push(movie);
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;

export function toFavoriteMovie(m: TmdbMovie): FavoriteMovie {
  return {
    id: m.id,
    title: m.title,
    poster_path: m.poster_path,
    vote_average: m.vote_average,
    release_date: m.release_date,
  };
}
