import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { ThemePreference } from './types';

type ThemeState = {
  preference: ThemePreference;
};

const initialState: ThemeState = {
  preference: 'system',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemePreference: (state, action: PayloadAction<ThemePreference>) => {
      state.preference = action.payload;
    },
  },
});

export const { setThemePreference } = themeSlice.actions;
export default themeSlice.reducer;
