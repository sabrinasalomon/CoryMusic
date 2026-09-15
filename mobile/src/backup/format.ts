import type { LanguagePreference } from '../i18n';
import { isRuleCondition, isRuleField, MATCH_MODES, SORT_OPTIONS } from '../smart/rules';
import type { MatchMode, SmartRule, SortBy } from '../smart/rules';

export const BACKUP_APP = 'CoryMusic';
export const BACKUP_SCHEMA_VERSION = 1;

export type BackupTrack = {
  originalName: string;
  sizeBytes: number;
  title: string;
  artist: string | null;
  isFavorite: boolean;
  playCount: number;
  lastPlayedAt: number | null;
  importedAt: number;
};

export type BackupPlaylist = {
  name: string;
  matchMode: MatchMode;
  sortBy: SortBy;
  limit: number | null;
  rules: SmartRule[];
};

export type BackupProfile = {
  name: string;
  language: LanguagePreference;
  photo: { base64: string; extension: string } | null;
};

export type Backup = {
  app: typeof BACKUP_APP;
  schemaVersion: typeof BACKUP_SCHEMA_VERSION;
  exportedAt: string;
  profile: BackupProfile;
  tracks: BackupTrack[];
  smartPlaylists: BackupPlaylist[];
};

type Loose = Record<string, unknown>;

const isObject = (value: unknown): value is Loose => typeof value === 'object' && value !== null && !Array.isArray(value);
const asString = (value: unknown, fallback = ''): string => (typeof value === 'string' ? value : fallback);
const asNumber = (value: unknown, fallback = 0): number => (typeof value === 'number' && Number.isFinite(value) ? value : fallback);
const asNullableNumber = (value: unknown): number | null => (typeof value === 'number' && Number.isFinite(value) ? value : null);

function parseTrack(value: unknown): BackupTrack | null {
  if (!isObject(value)) return null;
  const originalName = asString(value.originalName);
  if (!originalName) return null;
  return {
    originalName,
    sizeBytes: asNumber(value.sizeBytes),
    title: asString(value.title, originalName),
    artist: typeof value.artist === 'string' ? value.artist : null,
    isFavorite: value.isFavorite === true,
    playCount: Math.max(0, Math.floor(asNumber(value.playCount))),
    lastPlayedAt: asNullableNumber(value.lastPlayedAt),
    importedAt: asNumber(value.importedAt, Date.now()),
  };
}

function parsePlaylist(value: unknown): BackupPlaylist | null {
  if (!isObject(value)) return null;
  const name = asString(value.name).trim();
  if (!name || !Array.isArray(value.rules)) return null;

  const rules: SmartRule[] = value.rules.flatMap((rule) => {
    if (!isObject(rule)) return [];
    const field = asString(rule.field);
    const condition = asString(rule.condition);
    if (!isRuleField(field) || !isRuleCondition(condition)) return [];
    return [{ field, condition, value: asString(rule.value) }];
  });
  if (rules.length === 0) return null;

  const matchMode = asString(value.matchMode);
  const sortBy = asString(value.sortBy);
  const limit = asNullableNumber(value.limit);

  return {
    name,
    matchMode: (MATCH_MODES as readonly string[]).includes(matchMode) ? (matchMode as MatchMode) : 'all',
    sortBy: (SORT_OPTIONS as readonly string[]).includes(sortBy) ? (sortBy as SortBy) : 'recentlyAdded',
    limit: limit !== null && limit > 0 ? Math.floor(limit) : null,
    rules,
  };
}

export function parseBackup(text: string): Backup | null {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return null;
  }
  if (!isObject(data) || data.app !== BACKUP_APP || data.schemaVersion !== BACKUP_SCHEMA_VERSION) return null;

  const profile = isObject(data.profile) ? data.profile : {};
  const language = asString(profile.language);
  const photo = isObject(profile.photo) && typeof profile.photo.base64 === 'string' && profile.photo.base64.length > 0
    ? { base64: profile.photo.base64, extension: asString(profile.photo.extension, 'jpg') || 'jpg' }
    : null;

  return {
    app: BACKUP_APP,
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: asString(data.exportedAt),
    profile: {
      name: asString(profile.name),
      language: language === 'es' || language === 'en' ? language : 'system',
      photo,
    },
    tracks: Array.isArray(data.tracks) ? data.tracks.flatMap((track) => parseTrack(track) ?? []) : [],
    smartPlaylists: Array.isArray(data.smartPlaylists) ? data.smartPlaylists.flatMap((playlist) => parsePlaylist(playlist) ?? []) : [],
  };
}
