import { openDatabaseSync } from 'expo-sqlite';

import { isRuleCondition, isRuleField, MATCH_MODES, SORT_OPTIONS } from '../smart/rules';
import type { MatchMode, SmartPlaylist, SmartPlaylistDraft, SmartRule, SortBy } from '../smart/rules';

export type Track = {
  id: number;
  title: string;
  artist: string | null;
  fileName: string;
  originalName: string;
  sizeBytes: number;
  importedAt: number;
  playCount: number;
  lastPlayedAt: number | null;
  isFavorite: boolean;
  lyrics: string | null;
};

export type TrackStats = {
  isFavorite: boolean;
  playCount: number;
  lastPlayedAt: number | null;
  lyrics: string | null;
};

type TrackRow = {
  id: number;
  title: string;
  artist: string | null;
  file_name: string;
  original_name: string;
  size_bytes: number;
  imported_at: number;
  play_count: number;
  last_played_at: number | null;
  is_favorite: number;
  lyrics: string | null;
};

type PlaylistRow = {
  id: number;
  name: string;
  match_mode: string;
  sort_by: string;
  limit_count: number | null;
  created_at: number;
  updated_at: number;
};

type RuleRow = {
  playlist_id: number;
  field: string;
  condition: string;
  value: string;
};

type PendingRow = {
  is_favorite: number;
  play_count: number;
  last_played_at: number | null;
  lyrics: string | null;
};

const db = openDatabaseSync('corymusic.db');

db.execSync(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS tracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT,
    file_name TEXT NOT NULL UNIQUE,
    original_name TEXT NOT NULL,
    size_bytes INTEGER NOT NULL DEFAULT 0,
    imported_at INTEGER NOT NULL,
    play_count INTEGER NOT NULL DEFAULT 0,
    last_played_at INTEGER,
    is_favorite INTEGER NOT NULL DEFAULT 0,
    lyrics TEXT
  );
  CREATE TABLE IF NOT EXISTS playlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kind TEXT NOT NULL DEFAULT 'smart',
    name TEXT NOT NULL,
    match_mode TEXT NOT NULL DEFAULT 'all',
    sort_by TEXT NOT NULL DEFAULT 'recentlyAdded',
    limit_count INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS smart_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    playlist_id INTEGER NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    field TEXT NOT NULL,
    condition TEXT NOT NULL,
    value TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS pending_track_stats (
    original_name TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    is_favorite INTEGER NOT NULL DEFAULT 0,
    play_count INTEGER NOT NULL DEFAULT 0,
    last_played_at INTEGER,
    lyrics TEXT,
    PRIMARY KEY (original_name, size_bytes)
  );
`);

const trackColumns = db.getAllSync<{ name: string }>('PRAGMA table_info(tracks)').map((column) => column.name);
if (!trackColumns.includes('play_count')) db.execSync('ALTER TABLE tracks ADD COLUMN play_count INTEGER NOT NULL DEFAULT 0');
if (!trackColumns.includes('last_played_at')) db.execSync('ALTER TABLE tracks ADD COLUMN last_played_at INTEGER');
if (!trackColumns.includes('is_favorite')) db.execSync('ALTER TABLE tracks ADD COLUMN is_favorite INTEGER NOT NULL DEFAULT 0');
if (!trackColumns.includes('lyrics')) db.execSync('ALTER TABLE tracks ADD COLUMN lyrics TEXT');

const pendingColumns = db.getAllSync<{ name: string }>('PRAGMA table_info(pending_track_stats)').map((column) => column.name);
if (!pendingColumns.includes('lyrics')) db.execSync('ALTER TABLE pending_track_stats ADD COLUMN lyrics TEXT');

function toTrack(row: TrackRow): Track {
  return {
    id: row.id,
    title: row.title,
    artist: row.artist,
    fileName: row.file_name,
    originalName: row.original_name,
    sizeBytes: row.size_bytes,
    importedAt: row.imported_at,
    playCount: row.play_count,
    lastPlayedAt: row.last_played_at,
    isFavorite: row.is_favorite === 1,
    lyrics: row.lyrics,
  };
}

export function listTracks(): Track[] {
  return db.getAllSync<TrackRow>('SELECT * FROM tracks ORDER BY imported_at DESC, id DESC').map(toTrack);
}

export function isDuplicate(originalName: string, sizeBytes: number): boolean {
  return findTrackIdByOriginal(originalName, sizeBytes) !== null;
}

export function findTrackIdByOriginal(originalName: string, sizeBytes: number): number | null {
  return (
    db.getFirstSync<{ id: number }>('SELECT id FROM tracks WHERE original_name = ? AND size_bytes = ?', originalName, sizeBytes)?.id ?? null
  );
}

export function mergeTrackStats(trackId: number, stats: TrackStats): void {
  db.runSync(
    `UPDATE tracks SET
       is_favorite = MAX(is_favorite, ?),
       play_count = MAX(play_count, ?),
       lyrics = COALESCE(lyrics, ?),
       last_played_at = CASE
         WHEN ? IS NULL THEN last_played_at
         WHEN last_played_at IS NULL OR ? > last_played_at THEN ?
         ELSE last_played_at
       END
     WHERE id = ?`,
    stats.isFavorite ? 1 : 0,
    stats.playCount,
    stats.lyrics,
    stats.lastPlayedAt,
    stats.lastPlayedAt,
    stats.lastPlayedAt,
    trackId,
  );
}

export function savePendingStats(originalName: string, sizeBytes: number, stats: TrackStats): void {
  db.runSync(
    'INSERT OR REPLACE INTO pending_track_stats (original_name, size_bytes, is_favorite, play_count, last_played_at, lyrics) VALUES (?, ?, ?, ?, ?, ?)',
    originalName,
    sizeBytes,
    stats.isFavorite ? 1 : 0,
    stats.playCount,
    stats.lastPlayedAt,
    stats.lyrics,
  );
}

export function countPendingStats(): number {
  return db.getFirstSync<{ total: number }>('SELECT COUNT(*) AS total FROM pending_track_stats')?.total ?? 0;
}

export function insertTrack(track: Pick<Track, 'title' | 'artist' | 'fileName' | 'originalName' | 'sizeBytes'>): number {
  const result = db.runSync(
    'INSERT INTO tracks (title, artist, file_name, original_name, size_bytes, imported_at) VALUES (?, ?, ?, ?, ?, ?)',
    track.title,
    track.artist,
    track.fileName,
    track.originalName,
    track.sizeBytes,
    Date.now(),
  );
  const id = result.lastInsertRowId;

  const pending = db.getFirstSync<PendingRow>(
    'SELECT is_favorite, play_count, last_played_at, lyrics FROM pending_track_stats WHERE original_name = ? AND size_bytes = ?',
    track.originalName,
    track.sizeBytes,
  );
  if (pending) {
    mergeTrackStats(id, {
      isFavorite: pending.is_favorite === 1,
      playCount: pending.play_count,
      lastPlayedAt: pending.last_played_at,
      lyrics: pending.lyrics,
    });
    db.runSync('DELETE FROM pending_track_stats WHERE original_name = ? AND size_bytes = ?', track.originalName, track.sizeBytes);
  }

  return id;
}

export function recordPlay(trackId: number): void {
  db.runSync('UPDATE tracks SET play_count = play_count + 1, last_played_at = ? WHERE id = ?', Date.now(), trackId);
}

export function setFavorite(trackId: number, favorite: boolean): void {
  db.runSync('UPDATE tracks SET is_favorite = ? WHERE id = ?', favorite ? 1 : 0, trackId);
}

export function setLyrics(trackId: number, lyrics: string | null): void {
  db.runSync('UPDATE tracks SET lyrics = ? WHERE id = ?', lyrics, trackId);
}

export function listSmartPlaylists(): SmartPlaylist[] {
  const rows = db.getAllSync<PlaylistRow>("SELECT * FROM playlists WHERE kind = 'smart' ORDER BY created_at ASC, id ASC");
  const ruleRows = db.getAllSync<RuleRow>('SELECT playlist_id, field, condition, value FROM smart_rules ORDER BY playlist_id, position');

  const rulesByPlaylist = new Map<number, SmartRule[]>();
  for (const rule of ruleRows) {
    if (!isRuleField(rule.field) || !isRuleCondition(rule.condition)) continue;
    const list = rulesByPlaylist.get(rule.playlist_id) ?? [];
    list.push({ field: rule.field, condition: rule.condition, value: rule.value });
    rulesByPlaylist.set(rule.playlist_id, list);
  }

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    matchMode: (MATCH_MODES as readonly string[]).includes(row.match_mode) ? (row.match_mode as MatchMode) : 'all',
    sortBy: (SORT_OPTIONS as readonly string[]).includes(row.sort_by) ? (row.sort_by as SortBy) : 'recentlyAdded',
    limit: row.limit_count,
    rules: rulesByPlaylist.get(row.id) ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export function saveSmartPlaylist(draft: SmartPlaylistDraft): number {
  const now = Date.now();
  db.execSync('BEGIN');
  try {
    let id = draft.id;
    if (id === undefined) {
      const result = db.runSync(
        "INSERT INTO playlists (kind, name, match_mode, sort_by, limit_count, created_at, updated_at) VALUES ('smart', ?, ?, ?, ?, ?, ?)",
        draft.name,
        draft.matchMode,
        draft.sortBy,
        draft.limit,
        now,
        now,
      );
      id = result.lastInsertRowId;
    } else {
      db.runSync(
        'UPDATE playlists SET name = ?, match_mode = ?, sort_by = ?, limit_count = ?, updated_at = ? WHERE id = ?',
        draft.name,
        draft.matchMode,
        draft.sortBy,
        draft.limit,
        now,
        id,
      );
      db.runSync('DELETE FROM smart_rules WHERE playlist_id = ?', id);
    }
    draft.rules.forEach((rule, position) => {
      db.runSync(
        'INSERT INTO smart_rules (playlist_id, position, field, condition, value) VALUES (?, ?, ?, ?, ?)',
        id as number,
        position,
        rule.field,
        rule.condition,
        rule.value,
      );
    });
    db.execSync('COMMIT');
    return id;
  } catch (error) {
    db.execSync('ROLLBACK');
    throw error;
  }
}

export function deleteSmartPlaylist(id: number): void {
  db.runSync('DELETE FROM smart_rules WHERE playlist_id = ?', id);
  db.runSync('DELETE FROM playlists WHERE id = ?', id);
}
