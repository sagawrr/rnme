import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { COPY } from '@/constants/copy';
import type { AppColors } from '@/theme/colors';

import type { HomeScreenStyles } from '../HomeScreen';
import { MIN_SEARCH_CHARS } from '../useBrowseMovieFeed';

type Props = {
  styles: HomeScreenStyles;
  colors: AppColors;
  isFetching: boolean;
  moviesLength: number;
  error: unknown;
  isOnline: boolean | null;
  isSearching: boolean;
  searchText: string;
  debounced: string;
  onRefresh: () => void;
};

export function BrowseListEmptyState({
  styles,
  colors,
  isFetching,
  moviesLength,
  error,
  isOnline,
  isSearching,
  searchText,
  debounced,
  onRefresh,
}: Props) {
  if (isFetching && !moviesLength) {
    return (
      <View style={styles.emptyState}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.emptyTitle}>{COPY.home.emptyLoadingTitle}</Text>
        <Text style={styles.emptySubtitle}>{COPY.home.emptyLoadingSub}</Text>
      </View>
    );
  }

  if (error) {
    const offline = isOnline === false;
    return (
      <View style={styles.emptyState}>
        <Ionicons name="cloud-offline-outline" size={52} color={colors.textMuted} style={styles.emptyGlyph} />
        <Text style={styles.emptyTitle}>
          {offline
            ? COPY.home.emptyErrorOfflineTitle
            : isSearching
              ? COPY.home.emptyErrorSearchTitle
              : COPY.home.emptyErrorListTitle}
        </Text>
        <Text style={styles.emptySubtitle}>
          {offline
            ? COPY.home.emptyErrorOfflineSub
            : isSearching
              ? COPY.home.emptyErrorSearchSub
              : COPY.home.emptyErrorListSub}
        </Text>
        <AppButton
          variant="primary"
          onPress={onRefresh}
          style={styles.retry}
        >
          <Ionicons name="refresh" size={20} color={colors.onPrimary} />
          <Text style={styles.retryText}>{COPY.common.tryAgain}</Text>
        </AppButton>
      </View>
    );
  }

  const trimmed = searchText.trim();
  const typingHint = trimmed.length > 0 && trimmed.length < MIN_SEARCH_CHARS && !isSearching;
  if (typingHint) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="text-outline" size={44} color={colors.textMuted} style={styles.emptyGlyph} />
        <Text style={styles.emptyTitle}>{COPY.home.emptyTypingTitle}</Text>
        <Text style={styles.emptySubtitle}>
          {MIN_SEARCH_CHARS - trimmed.length === 1
            ? COPY.home.emptyTypingSubOne
            : COPY.home.emptyTypingSubMany(MIN_SEARCH_CHARS - trimmed.length)}
        </Text>
      </View>
    );
  }

  if (isSearching && !isFetching) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="search-outline" size={52} color={colors.textMuted} style={styles.emptyGlyph} />
        <Text style={styles.emptyTitle}>{COPY.home.emptyNoResultsTitle}</Text>
        <Text style={styles.emptySubtitle}>{COPY.home.emptyNoResultsSub(debounced)}</Text>
      </View>
    );
  }

  return (
    <View style={styles.emptyState}>
      <Ionicons name="sparkles-outline" size={52} color={colors.textMuted} style={styles.emptyGlyph} />
      <Text style={styles.emptyTitle}>{COPY.home.emptyNothingTitle}</Text>
      <Text style={styles.emptySubtitle}>{COPY.home.emptyNothingSub}</Text>
    </View>
  );
}
