export function rgbaFromHex(hex: string, alpha: number): string {
  const raw = hex.trim().replace('#', '');
  if (raw.length !== 6 || Number.isNaN(Number.parseInt(raw, 16))) return hex;
  const n = Number.parseInt(raw, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}
