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
  const results = data.results;

  const youtubeOfType = (type: string) =>
    results.filter((v) => v.site === 'YouTube' && v.type === type);

  const pickOfficialFirst = (list: VideosPayload['results']) => {
    if (!list.length) return null;
    const official = list.find((v) => v.official);
    const key = (official ?? list[0])?.key?.trim();
    return key || null;
  };

  return (
    pickOfficialFirst(youtubeOfType('Trailer')) ??
    pickOfficialFirst(youtubeOfType('Teaser')) ??
    pickOfficialFirst(youtubeOfType('Clip')) ??
    null
  );
}
