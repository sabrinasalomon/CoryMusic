export type LyricLine = { time: number; text: string };

export type ParsedLyrics = { synced: true; lines: LyricLine[] } | { synced: false; text: string };

const TIME_TAG = /\[(\d{1,3}):(\d{1,2}(?:[.:]\d{1,3})?)\]/g;
const OFFSET_TAG = /^\s*\[offset:\s*([+-]?\d+)\s*\]\s*$/i;
const LEAD_IN_SECONDS = 0.25;

/**
 * Reads plain lyrics or LRC lyrics (`[mm:ss.xx] line`).
 * Lines without a time tag are ignored once the text has at least one timed line.
 */
export function parseLyrics(raw: string): ParsedLyrics {
  const lines: LyricLine[] = [];
  let offsetSeconds = 0;

  for (const rawLine of raw.split(/\r?\n/)) {
    const offset = OFFSET_TAG.exec(rawLine);
    if (offset) {
      offsetSeconds = Number(offset[1]) / 1000;
      continue;
    }
    const tags = [...rawLine.matchAll(TIME_TAG)];
    if (tags.length === 0) continue;
    const text = rawLine.replace(TIME_TAG, '').trim();
    for (const tag of tags) {
      lines.push({ time: Number(tag[1]) * 60 + Number(tag[2].replace(':', '.')), text });
    }
  }

  if (lines.length === 0) return { synced: false, text: raw.trim() };

  return {
    synced: true,
    lines: lines.map((line) => ({ ...line, time: Math.max(0, line.time - offsetSeconds) })).sort((a, b) => a.time - b.time),
  };
}

export function activeLineIndex(lines: LyricLine[], currentTime: number): number {
  let active = -1;
  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index].time > currentTime + LEAD_IN_SECONDS) break;
    active = index;
  }
  return active;
}
