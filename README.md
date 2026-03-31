# RNME — Movie Explorer

React Native (Expo) app to browse TMDb movies, save favorites locally, and watch trailers.

## Architecture overview

- **Routing**: Expo Router (`src/app/`) with tabs + stack routes.
- **Screens**: UI lives in `src/screens/`; shared UI primitives in `src/components/ui/`.
- **State**: Redux Toolkit + RTK Query in `src/store/` (`tmdbApi`, slices).
- **Persistence**: `redux-persist` persists `tmdbApi`, `favorites`, `theme` (AsyncStorage).
- **Auth**: Supabase auth client in `src/lib/supabase/client.ts`.

## Libraries (purpose)

- **Routing**: `expo-router`
- **State**: `@reduxjs/toolkit`, `react-redux` (RTK Query for TMDb)
- **Persistence**: `redux-persist`, `@react-native-async-storage/async-storage`
- **Auth**: `@supabase/supabase-js`
- **Lists**: `@shopify/flash-list`
- **Forms/validation**: `react-hook-form`, `zod`
- **UI/motion**: `react-native-reanimated`, `expo-image`
- **Network**: `@react-native-community/netinfo`
- **Trailers**: `react-native-youtube-bridge`, `react-native-webview`, `expo-web-browser`

## API source

- **TMDb**: movie metadata + images.
- **YouTube**: trailer playback uses video keys from TMDb’s `/movie/{id}/videos`.

## Setup & run locally

Create a `.env` in the project root:

```bash
EXPO_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
EXPO_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3

EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

```bash
npm install
npx expo start
```

### Test login

Email: `test@rnme.com`  
Password: `Test123$$`
