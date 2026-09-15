import type { TFunction } from 'i18next';

import type { Track } from '../library/db';

export const RULE_FIELDS = ['artist', 'title', 'importedAt', 'playCount', 'lastPlayedAt', 'favorite'] as const;
export type RuleField = (typeof RULE_FIELDS)[number];

export const RULE_CONDITIONS = ['is', 'isNot', 'contains', 'inLast', 'notInLast', 'greaterThan', 'lessThan', 'isTrue', 'isFalse'] as const;
export type RuleCondition = (typeof RULE_CONDITIONS)[number];

export const MATCH_MODES = ['all', 'any'] as const;
export type MatchMode = (typeof MATCH_MODES)[number];

export const SORT_OPTIONS = ['recentlyAdded', 'mostPlayed', 'title', 'artist', 'random'] as const;
export type SortBy = (typeof SORT_OPTIONS)[number];

export const LIMIT_OPTIONS = [null, 25, 50, 100] as const;

export type SmartRule = { field: RuleField; condition: RuleCondition; value: string };

export type SmartPlaylist = {
  id: number;
  name: string;
  matchMode: MatchMode;
  sortBy: SortBy;
  limit: number | null;
  rules: SmartRule[];
  createdAt: number;
  updatedAt: number;
};

export type SmartPlaylistDraft = Omit<SmartPlaylist, 'id' | 'createdAt' | 'updatedAt'> & { id?: number };

export const CONDITIONS_BY_FIELD: Record<RuleField, readonly RuleCondition[]> = {
  artist: ['is', 'isNot', 'contains'],
  title: ['contains', 'is', 'isNot'],
  importedAt: ['inLast', 'notInLast'],
  playCount: ['greaterThan', 'lessThan'],
  lastPlayedAt: ['notInLast', 'inLast'],
  favorite: ['isTrue', 'isFalse'],
};

export type ValueKind = 'text' | 'number' | 'days' | 'none';

export function valueKind(field: RuleField): ValueKind {
  if (field === 'artist' || field === 'title') return 'text';
  if (field === 'playCount') return 'number';
  if (field === 'favorite') return 'none';
  return 'days';
}

export function defaultRule(field: RuleField = 'artist'): SmartRule {
  const kind = valueKind(field);
  return {
    field,
    condition: CONDITIONS_BY_FIELD[field][0],
    value: kind === 'days' ? '30' : kind === 'number' ? '5' : '',
  };
}

export function isRuleField(value: string): value is RuleField {
  return (RULE_FIELDS as readonly string[]).includes(value);
}

export function isRuleCondition(value: string): value is RuleCondition {
  return (RULE_CONDITIONS as readonly string[]).includes(value);
}

export function isValidRule(rule: SmartRule): boolean {
  if (!CONDITIONS_BY_FIELD[rule.field].includes(rule.condition)) return false;
  const kind = valueKind(rule.field);
  if (kind === 'none') return true;
  if (kind === 'text') return rule.value.trim().length > 0;
  const number = Number(rule.value);
  return rule.value.trim() !== '' && Number.isFinite(number) && number >= 0;
}

const DAY = 86_400_000;

function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

function compareText(actual: string, rule: SmartRule): boolean {
  const a = normalize(actual);
  const v = normalize(rule.value);
  if (rule.condition === 'is') return a === v;
  if (rule.condition === 'isNot') return a !== v;
  return a.includes(v);
}

function withinDays(timestamp: number | null, rule: SmartRule, now: number): boolean {
  const inside = timestamp !== null && now - timestamp <= Number(rule.value) * DAY;
  return rule.condition === 'inLast' ? inside : !inside;
}

export function matchesRule(track: Track, rule: SmartRule, now: number): boolean {
  switch (rule.field) {
    case 'artist':
      return compareText(track.artist ?? '', rule);
    case 'title':
      return compareText(track.title, rule);
    case 'playCount':
      return rule.condition === 'greaterThan' ? track.playCount > Number(rule.value) : track.playCount < Number(rule.value);
    case 'importedAt':
      return withinDays(track.importedAt, rule, now);
    case 'lastPlayedAt':
      return withinDays(track.lastPlayedAt, rule, now);
    case 'favorite':
      return rule.condition === 'isTrue' ? track.isFavorite : !track.isFavorite;
  }
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const result = [...items];
  let state = seed >>> 0;
  const random = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function evaluateSmartPlaylist(
  playlist: Pick<SmartPlaylist, 'matchMode' | 'sortBy' | 'limit' | 'rules'> & { id?: number },
  tracks: Track[],
  now: number = Date.now(),
): Track[] {
  const rules = playlist.rules.filter(isValidRule);
  if (rules.length === 0) return [];

  const matched = tracks.filter((track) =>
    playlist.matchMode === 'all'
      ? rules.every((rule) => matchesRule(track, rule, now))
      : rules.some((rule) => matchesRule(track, rule, now)),
  );

  let sorted: Track[];
  switch (playlist.sortBy) {
    case 'mostPlayed':
      sorted = [...matched].sort((a, b) => b.playCount - a.playCount || (b.lastPlayedAt ?? 0) - (a.lastPlayedAt ?? 0));
      break;
    case 'title':
      sorted = [...matched].sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'artist':
      sorted = [...matched].sort((a, b) => (a.artist ?? '').localeCompare(b.artist ?? '') || a.title.localeCompare(b.title));
      break;
    case 'random':
      sorted = seededShuffle(matched, (playlist.id ?? 1) * 1000 + Math.floor(now / DAY));
      break;
    default:
      sorted = [...matched].sort((a, b) => b.importedAt - a.importedAt);
  }

  return playlist.limit ? sorted.slice(0, playlist.limit) : sorted;
}

export function describeRule(rule: SmartRule, t: TFunction): string {
  const field = t(`smart.fields.${rule.field}`);
  const condition = t(`smart.conditions.${rule.condition}`);
  const kind = valueKind(rule.field);
  if (kind === 'none') return `${field}: ${condition}`;
  if (kind === 'days') return `${field} ${condition} ${t('smart.daysValue', { count: Number(rule.value) })}`;
  if (kind === 'number') return `${field}: ${condition} ${rule.value}`;
  return `${field} ${condition} “${rule.value}”`;
}

export type Preset = {
  key: 'recent' | 'favorites' | 'mostPlayed' | 'forgotten';
  symbol: 'clock' | 'heart' | 'flame' | 'moon.zzz';
  draft: SmartPlaylistDraft;
};

export function presets(t: TFunction): Preset[] {
  return [
    {
      key: 'recent',
      symbol: 'clock',
      draft: { name: t('smart.presets.recent'), matchMode: 'all', sortBy: 'recentlyAdded', limit: null, rules: [{ field: 'importedAt', condition: 'inLast', value: '30' }] },
    },
    {
      key: 'favorites',
      symbol: 'heart',
      draft: { name: t('smart.presets.favorites'), matchMode: 'all', sortBy: 'title', limit: null, rules: [{ field: 'favorite', condition: 'isTrue', value: '' }] },
    },
    {
      key: 'mostPlayed',
      symbol: 'flame',
      draft: { name: t('smart.presets.mostPlayed'), matchMode: 'all', sortBy: 'mostPlayed', limit: 50, rules: [{ field: 'playCount', condition: 'greaterThan', value: '0' }] },
    },
    {
      key: 'forgotten',
      symbol: 'moon.zzz',
      draft: { name: t('smart.presets.forgotten'), matchMode: 'all', sortBy: 'random', limit: null, rules: [{ field: 'lastPlayedAt', condition: 'notInLast', value: '90' }] },
    },
  ];
}
