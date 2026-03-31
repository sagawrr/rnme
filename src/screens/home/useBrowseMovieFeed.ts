import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COPY } from '@/constants/copy';
import type { TmdbMovie } from '@/store/api/types';
import { useGetPopularMoviesQuery, useSearchMoviesQuery } from '@/store/api/tmdbApi';

const SEARCH_DEBOUNCE_MS = 450;
export const MIN_SEARCH_CHARS = 2;

type SearchHintParts = { lead: string; trail?: string };

function buildSearchHintParts(args: {
  listIsEmpty: boolean;
  trimmedInputLength: number;
  isSearching: boolean;
  isFetching: boolean;
  moviesCount: number;
  totalResults: number | undefined;
  debounced: string;
  canLoadMore: boolean;
}): SearchHintParts | null {
  const {
    listIsEmpty,
    trimmedInputLength,
    isSearching,
    isFetching,
    moviesCount,
    totalResults,
    debounced,
    canLoadMore,
  } = args;

  if (listIsEmpty) return null;
  if (trimmedInputLength === 0) {
    return {
      lead: COPY.home.hintPopularLead,
      trail: canLoadMore ? COPY.home.hintPopularTrailMore : COPY.home.hintPopularTrail,
    };
  }
  if (trimmedInputLength < MIN_SEARCH_CHARS) {
    return {
      lead: COPY.home.hintTypingLead,
      trail: COPY.home.hintTypingTrail,
    };
  }
  if (isSearching && isFetching) {
    return { lead: COPY.home.hintUpdatingResults };
  }
  if (isSearching && moviesCount) {
    const n =
      typeof totalResults === 'number' && totalResults > 0 ? totalResults : moviesCount;
    const countLabel = n === 1 ? COPY.home.hintFilmCountOne : COPY.home.hintFilmCountMany(n);
    return {
      lead: COPY.home.hintResultsLead(countLabel, debounced),
      trail: canLoadMore ? COPY.home.hintResultsTrailMore : COPY.home.hintResultsTrailEnd,
    };
  }
  return {
    lead: COPY.home.hintPopularLead,
    trail: canLoadMore ? COPY.home.hintPopularTrailMore : COPY.home.hintPopularTrail,
  };
}

function buildPartialTypingLine(
  listIsEmpty: boolean,
  trimmedInputLength: number,
  isSearching: boolean
): string | null {
  if (listIsEmpty) return null;
  if (trimmedInputLength === 0 || trimmedInputLength >= MIN_SEARCH_CHARS || isSearching) return null;
  const need = MIN_SEARCH_CHARS - trimmedInputLength;
  return need === 1 ? COPY.home.partialTypingOne : COPY.home.partialTypingMany(need);
}

function useDebouncedSearchTrim(trimmed: string, delayMs: number): string {
  const [debounced, setDebounced] = useState(trimmed);

  useEffect(() => {
    if (trimmed === '') {
      setDebounced('');
      return;
    }
    const t = setTimeout(() => setDebounced(trimmed), delayMs);
    return () => clearTimeout(t);
  }, [trimmed, delayMs]);

  return debounced;
}

export function useBrowseMovieFeed() {
  const insets = useSafeAreaInsets();

  const [searchText, setSearchText] = useState('');
  const trimmedSearch = searchText.trim();
  const debounced = useDebouncedSearchTrim(trimmedSearch, SEARCH_DEBOUNCE_MS);

  const [searchFocused, setSearchFocused] = useState(false);
  const [listPage, setListPage] = useState(1);
  const [movies, setMovies] = useState<TmdbMovie[]>([]);
  const loadMoreLock = useRef(false);

  const isSearching = debounced.length >= MIN_SEARCH_CHARS;

  const popular = useGetPopularMoviesQuery({ page: listPage }, { skip: isSearching });
  const searchQuery = useSearchMoviesQuery(
    { query: debounced, page: listPage },
    { skip: !isSearching }
  );

  const active = isSearching ? searchQuery : popular;
  const { data, error, isFetching, isSuccess, refetch, fulfilledTimeStamp } = active;
  const totalResults = data?.total_results;
  const totalPages = data?.total_pages ?? 0;

  const queryIdentity = isSearching ? debounced : '__popular__';

  useLayoutEffect(() => {
    setListPage(1);
    setMovies([]);
    loadMoreLock.current = false;
  }, [queryIdentity, isSearching]);

  useEffect(() => {
    if (error) {
      loadMoreLock.current = false;
      return;
    }
    if (!data?.results) return;

    setMovies((prev) => {
      if (listPage === 1) return data.results;
      const ids = new Set(prev.map((m) => m.id));
      const appended = data.results.filter((m) => !ids.has(m.id));
      return appended.length ? [...prev, ...appended] : prev;
    });
    loadMoreLock.current = false;
  }, [data?.results, error, fulfilledTimeStamp, listPage]);

  const onRefresh = useCallback(() => {
    loadMoreLock.current = false;
    if (listPage > 1) {
      setListPage(1);
      setMovies([]);
    } else {
      refetch();
    }
  }, [listPage, refetch]);

  const clearSearch = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSearchText('');
    Keyboard.dismiss();
  }, []);

  const canLoadMore = isSuccess && movies.length > 0 && totalPages > 0 && listPage < totalPages;

  const loadMore = useCallback(() => {
    if (!canLoadMore || isFetching || error || loadMoreLock.current) return;
    loadMoreLock.current = true;
    setListPage((p) => p + 1);
  }, [canLoadMore, error, isFetching]);

  const listIsEmpty = movies.length === 0;

  const searchHintParts = buildSearchHintParts({
    listIsEmpty,
    trimmedInputLength: trimmedSearch.length,
    isSearching,
    isFetching,
    moviesCount: movies.length,
    totalResults,
    debounced,
    canLoadMore,
  });

  const partialTypingLine = buildPartialTypingLine(listIsEmpty, trimmedSearch.length, isSearching);

  return {
    insets,
    searchText,
    setSearchText,
    searchFocused,
    setSearchFocused,
    debounced,
    movies,
    error,
    isFetching,
    isSearching,
    listPage,
    totalResults,
    totalPages,
    onRefresh,
    clearSearch,
    loadMore,
    searchHintParts,
    partialTypingLine,
  };
}
