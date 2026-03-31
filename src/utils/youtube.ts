export function safeDecodeUriComponent(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
}

const ID_RE = /^[\w-]{6,11}$/;

export function isLikelyYoutubeVideoId(id: string): boolean {
  const s = id.trim();
  return ID_RE.test(s);
}

export function normalizeYoutubeKeyFromTmdb(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  const fromUrl = s.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,11})/i);
  if (fromUrl?.[1]) return fromUrl[1];
  if (isLikelyYoutubeVideoId(s)) return s.trim();
  return null;
}
