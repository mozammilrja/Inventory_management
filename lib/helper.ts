export function formatNumber(num: number): string {
  if (num >= 1_000_000_000_000) return (num / 1_000_000_000_000).toFixed(2).replace(/\.00$/, '') + 'T';
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2).replace(/\.00$/, '') + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2).replace(/\.00$/, '') + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(2).replace(/\.00$/, '') + 'K';
  return num.toString();
}
