import { combineReducers } from '@reduxjs/toolkit';

import { tmdbApi } from '@/store/api/tmdbApi';
import favoritesReducer from '@/store/slices/favoritesSlice';
import themeReducer from '@/store/slices/themeSlice';

export const rootReducer = combineReducers({
  theme: themeReducer,
  favorites: favoritesReducer,
  [tmdbApi.reducerPath]: tmdbApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

