import { TMDB_IMAGE_CDN_BASE } from '@/constants/config';

type VideosPayload = {
  results: { key: string; site: string; type: string; official?: boolean }[];
};

export function tmdbImageUrl(
  path: string | null | undefined,
  size: 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'
): string | null {
  if (path == null || path === '') return null;
  return `${TMDB_IMAGE_CDN_BASE}/${size}${path}`;
}

export function tmdbYoutubeTrailerKey(data: VideosPayload | undefined): string | null {
  if (!data?.results.length) return null;
  const list = data.results.filter((v) => v.site === 'YouTube' && v.type === 'Trailer');
  const official = list.find((v) => v.official);
  return (official ?? list[0])?.key ?? null;
}
