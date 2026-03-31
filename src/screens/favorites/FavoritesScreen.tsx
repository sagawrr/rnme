import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { EnterTransition } from '@/components/ui/EnterTransition';
import { PressableScale } from '@/components/ui/PressableScale';
import { rowCardStyle } from '@/components/ui/Panel';
import { COPY } from '@/constants/copy';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAppSelector } from '@/store/hooks';
import type { FavoriteMovie } from '@/store/slices/types';
import type { AppColors } from '@/theme/colors';
import { fontFamily } from '@/theme/fonts';
import { tokens } from '@/theme/tokens';
import { tmdbImageUrl } from '@/utils/tmdb';

export default function FavoritesScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const entries = useAppSelector((s) => s.favorites.entries);

  const renderItem: ListRenderItem<FavoriteMovie> = ({ item }) => {
    const uri = tmdbImageUrl(item.poster_path, 'w185');
    return (
      <EnterTransition>
        <Link href={`/movie/${item.id}`} asChild>
          <PressableScale style={styles.row}>
            {uri ? (
              <Image
                source={{ uri }}
                style={styles.poster}
                contentFit="cover"
                transition={tokens.motion.imageFadeMs}
                cachePolicy="memory-disk"
              />
            ) : (
              <View style={[styles.poster, styles.posterPlaceholder]} />
            )}
            <View style={styles.rowBody}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.meta}>
                {item.release_date ?? '—'} · ★ {item.vote_average.toFixed(1)}
              </Text>
            </View>
          </PressableScale>
        </Link>
        <Link.Preview />
      </EnterTransition>
    );
  };

  if (!entries.length) {
    return (
      <View style={styles.emptyRoot}>
        <Ionicons name="heart-outline" size={52} color={colors.textMuted} style={styles.emptyGlyph} />
        <Text style={styles.emptyTitle}>{COPY.favorites.emptyTitle}</Text>
        <Text style={styles.emptySub}>{COPY.favorites.emptySub}</Text>
        <Link href="/" asChild>
          <Link.Trigger>
            <AppButton variant="primary" style={styles.emptyCta}>
              {COPY.tabs.browse}
            </AppButton>
          </Link.Trigger>
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.listRoot}>
      <FlashList
        data={entries}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        getItemType={() => 'favorite'}
        drawDistance={220}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

function createStyles(c: AppColors) {
  return StyleSheet.create({
    listRoot: { flex: 1, backgroundColor: c.background },
    listContent: {
      paddingHorizontal: tokens.space.lg,
      paddingTop: tokens.space.md,
      paddingBottom: tokens.space.xl + tokens.space.sm,
    },
    row: {
      ...rowCardStyle(c),
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
    meta: { marginTop: 5, fontSize: 13, color: c.textSecondary, fontFamily: fontFamily.bodyMedium },
    emptyRoot: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: tokens.space['2xl'],
      paddingVertical: tokens.space['3xl'],
      backgroundColor: c.background,
    },
    emptyTitle: {
      fontFamily: fontFamily.displayMedium,
      fontSize: 20,
      letterSpacing: -0.35,
      lineHeight: 26,
      color: c.text,
      textAlign: 'center',
    },
    emptyGlyph: { marginBottom: 18 },
    emptySub: {
      marginTop: tokens.space.sm + 2,
      fontSize: 15,
      lineHeight: 22,
      color: c.textMuted,
      textAlign: 'center',
      fontFamily: fontFamily.body,
      maxWidth: 320,
    },
    emptyCta: {
      marginTop: tokens.space.lg,
      paddingHorizontal: tokens.space.xl,
    },
  });
}
