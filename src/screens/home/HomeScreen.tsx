import { Ionicons } from '@expo/vector-icons';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { rowCardStyle } from '@/components/ui/Panel';
import { COPY } from '@/constants/copy';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useNetworkStatus } from '@/hooks/use-network-status';
import type { TmdbMovie } from '@/store/api/types';
import type { AppColors } from '@/theme/colors';
import { fontFamily } from '@/theme/fonts';
import { tokens } from '@/theme/tokens';

import { BrowseListEmptyState, MovieBrowseRow } from './components';
import { useBrowseMovieFeed } from './useBrowseMovieFeed';

export function createHomeScreenStyles(c: AppColors) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.background },
    searchBlock: {
      paddingHorizontal: tokens.space.lg,
      paddingTop: tokens.space.sm + 2,
      paddingBottom: tokens.space.md,
    },
    offlineBanner: {
      marginHorizontal: tokens.space.lg,
      marginTop: -tokens.space.xs,
      marginBottom: tokens.space.sm + 2,
      paddingVertical: tokens.space.sm + 2,
      paddingHorizontal: tokens.space.md,
      backgroundColor: c.surface,
      borderRadius: tokens.radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
    },
    offlineBannerText: {
      fontFamily: fontFamily.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
      color: c.textSecondary,
    },
    searchScreenTitle: {
      fontFamily: fontFamily.displaySemiBold,
      fontSize: 28,
      letterSpacing: -0.85,
      lineHeight: 32,
      color: c.text,
      marginBottom: tokens.space.md + 2,
    },
    searchField: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.surface,
      borderRadius: tokens.radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
      paddingLeft: tokens.space.lg,
      paddingRight: tokens.space.md,
      minHeight: tokens.size.inputMinHeight,
      ...tokens.shadow.soft,
    },
    searchFieldFocused: {
      borderColor: c.primary,
      borderWidth: 1.5,
      ...tokens.shadow.focus,
    },
    searchGlyph: { marginRight: tokens.space.md },
    searchInput: {
      flex: 1,
      paddingVertical: tokens.space.md + 2,
      fontSize: 16,
      color: c.text,
      fontFamily: fontFamily.body,
    },
    clearIconBtn: {
      padding: tokens.space.sm - 2,
      marginLeft: 2,
    },
    clearIconBtnPressed: { opacity: 0.65 },
    hintPartial: {
      marginTop: tokens.space.md,
      paddingHorizontal: 2,
      fontFamily: fontFamily.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
      color: c.textSecondary,
    },
    hintBlock: {
      marginTop: tokens.space.md,
      paddingHorizontal: 2,
    },
    hintLead: {
      fontFamily: fontFamily.displayMedium,
      fontSize: 15,
      letterSpacing: -0.2,
      lineHeight: 20,
      color: c.text,
    },
    hintTrail: {
      marginTop: 4,
      fontFamily: fontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.textMuted,
    },
    list: { flex: 1 },
    listContent: { paddingTop: 4, paddingBottom: 28 },
    listContentEmpty: { flexGrow: 1 },
    listFooter: {
      paddingVertical: tokens.space.xl - 4,
      alignItems: 'center',
    },
    row: {
      ...rowCardStyle(c),
      marginHorizontal: tokens.space.lg,
      marginBottom: tokens.space.md,
    },
    poster: {
      width: tokens.size.posterW,
      height: tokens.size.posterH,
      borderRadius: tokens.radius.poster,
      backgroundColor: c.posterPlaceholder,
    },
    posterPlaceholder: {},
    rowBody: { flex: 1, minWidth: 0 },
    title: {
      fontSize: 16,
      color: c.text,
      fontFamily: fontFamily.displaySemiBold,
      letterSpacing: -0.2,
    },
    meta: {
      marginTop: 5,
      fontSize: 13,
      color: c.textSecondary,
      fontFamily: fontFamily.bodyMedium,
    },
    overview: {
      marginTop: 6,
      fontSize: 13,
      color: c.textMuted,
      lineHeight: 18,
      fontFamily: fontFamily.body,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: tokens.space['2xl'],
      paddingVertical: tokens.space['3xl'],
      minHeight: 280,
    },
    emptyGlyph: { marginBottom: 18 },
    emptyTitle: {
      fontFamily: fontFamily.displayMedium,
      fontSize: 20,
      letterSpacing: -0.35,
      lineHeight: 26,
      color: c.text,
      textAlign: 'center',
      marginBottom: 10,
    },
    emptySubtitle: {
      fontFamily: fontFamily.body,
      fontSize: 15,
      lineHeight: 22,
      color: c.textMuted,
      textAlign: 'center',
      maxWidth: 320,
    },
    retry: {
      marginTop: 22,
      paddingHorizontal: 22,
      paddingVertical: 12,
      borderRadius: 12,
    },
    retryText: { color: c.onPrimary, fontFamily: fontFamily.bodySemiBold, fontSize: 15 },
  });
}

export type HomeScreenStyles = ReturnType<typeof createHomeScreenStyles>;

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const styles = createHomeScreenStyles(colors);
  const { isOnline } = useNetworkStatus();

  const {
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
    onRefresh,
    clearSearch,
    loadMore,
    searchHintParts,
    partialTypingLine,
  } = useBrowseMovieFeed();

  const renderListFooter = () => {
    if (!movies.length) return null;
    const loadingMore = isFetching && listPage > 1;
    if (!loadingMore) return null;
    return (
      <View style={styles.listFooter}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  };

  const renderItem: ListRenderItem<TmdbMovie> = ({ item }) => (
    <MovieBrowseRow movie={item} styles={styles} colors={colors} />
  );

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <View style={styles.searchBlock}>
        <Text style={styles.searchScreenTitle}>{COPY.home.title}</Text>
        <View style={[styles.searchField, searchFocused && styles.searchFieldFocused]}>
          <Ionicons
            name="search"
            size={20}
            color={searchFocused ? colors.primary : colors.textMuted}
            style={styles.searchGlyph}
          />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder={COPY.home.searchPlaceholder}
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="never"
            returnKeyType="search"
            blurOnSubmit={false}
            onSubmitEditing={() => Keyboard.dismiss()}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchText.length > 0 ? (
            <Pressable
              onPress={clearSearch}
              hitSlop={14}
              style={({ pressed }) => [styles.clearIconBtn, pressed && styles.clearIconBtnPressed]}
            >
              <Ionicons name="close-circle" size={24} color={colors.textSecondary} />
            </Pressable>
          ) : null}
        </View>
        {partialTypingLine ? (
          <Text style={styles.hintPartial}>
            {partialTypingLine}
          </Text>
        ) : searchHintParts ? (
          <View style={styles.hintBlock}>
            <Text style={styles.hintLead}>{searchHintParts.lead}</Text>
            {searchHintParts.trail ? <Text style={styles.hintTrail}>{searchHintParts.trail}</Text> : null}
          </View>
        ) : null}
      </View>
      {isOnline === false ? (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineBannerText}>{COPY.home.offlineBanner}</Text>
        </View>
      ) : null}
      <FlashList
        style={styles.list}
        data={movies}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentInsetAdjustmentBehavior="automatic"
        ListEmptyComponent={
          movies.length ? undefined : (
            <BrowseListEmptyState
              styles={styles}
              colors={colors}
              isFetching={isFetching}
              moviesLength={movies.length}
              error={error}
              isOnline={isOnline}
              isSearching={isSearching}
              searchText={searchText}
              debounced={debounced}
              onRefresh={onRefresh}
            />
          )
        }
        ListFooterComponent={renderListFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        drawDistance={220}
        getItemType={() => 'movie'}
        contentContainerStyle={movies.length ? styles.listContent : styles.listContentEmpty}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'on-drag' : 'none'}
        onScrollBeginDrag={() => {
          if (Platform.OS === 'android') Keyboard.dismiss();
        }}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && listPage === 1}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    </View>
  );
}
