export function initials(name: string, fallback = 'CM'): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return fallback;
  const letters = words.length === 1 ? words[0].slice(0, 2) : words[0][0] + words[words.length - 1][0];
  return letters.toUpperCase();
}

export function formatMegabytes(bytes: number): string {
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}
