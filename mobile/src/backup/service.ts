import * as DocumentPicker from 'expo-document-picker';
import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import type { LanguagePreference } from '../i18n';
import {
  findTrackIdByOriginal,
  listSmartPlaylists,
  listTracks,
  mergeTrackStats,
  savePendingStats,
  saveSmartPlaylist,
} from '../library/db';
import { extensionOf, profilePhotoFile } from '../library/files';
import { BACKUP_APP, BACKUP_SCHEMA_VERSION, parseBackup } from './format';
import type { Backup } from './format';

const SNAPSHOT_PREFIX = 'corymusic-backup-';
const SNAPSHOTS_TO_KEEP = 5;

export type BackupSnapshot = {
  name: string;
  uri: string;
  createdAt: number;
  sizeBytes: number;
};

export type RestoreReport = {
  playlists: number;
  matched: number;
  pending: number;
};

function snapshotsDirectory(): Directory {
  const directory = new Directory(Paths.document, 'backups');
  if (!directory.exists) directory.create({ intermediates: true });
  return directory;
}

function fileName(date: Date = new Date()): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${SNAPSHOT_PREFIX}${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}.json`;
}

function writeTextFile(file: File, text: string): void {
  if (file.exists) file.delete();
  file.create();
  file.write(text);
}

export function buildBackup(profile: { name: string; language: LanguagePreference; photoFile: string | null }): Backup {
  let photo: Backup['profile']['photo'] = null;
  if (profile.photoFile) {
    try {
      const file = profilePhotoFile(profile.photoFile);
      if (file.exists) photo = { base64: file.base64Sync(), extension: extensionOf(profile.photoFile) || 'jpg' };
    } catch {
      photo = null;
    }
  }

  return {
    app: BACKUP_APP,
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    profile: { name: profile.name, language: profile.language, photo },
    tracks: listTracks().map((track) => ({
      originalName: track.originalName,
      sizeBytes: track.sizeBytes,
      title: track.title,
      artist: track.artist,
      isFavorite: track.isFavorite,
      playCount: track.playCount,
      lastPlayedAt: track.lastPlayedAt,
      importedAt: track.importedAt,
    })),
    smartPlaylists: listSmartPlaylists().map((playlist) => ({
      name: playlist.name,
      matchMode: playlist.matchMode,
      sortBy: playlist.sortBy,
      limit: playlist.limit,
      rules: playlist.rules,
    })),
  };
}

export function listSnapshots(): BackupSnapshot[] {
  let entries: (Directory | File)[] = [];
  try {
    entries = snapshotsDirectory().list();
  } catch {
    return [];
  }
  return entries
    .filter((entry): entry is File => entry instanceof File && entry.name.startsWith(SNAPSHOT_PREFIX) && entry.name.endsWith('.json'))
    .map((file) => ({
      name: file.name,
      uri: file.uri,
      createdAt: file.modificationTime ?? file.creationTime ?? 0,
      sizeBytes: file.size ?? 0,
    }))
    .sort((a, b) => b.createdAt - a.createdAt || b.name.localeCompare(a.name));
}

export function writeSnapshot(backup: Backup): void {
  writeTextFile(new File(snapshotsDirectory(), fileName()), JSON.stringify(backup));
  for (const old of listSnapshots().slice(SNAPSHOTS_TO_KEEP)) {
    try {
      new File(old.uri).delete();
    } catch {
      // Keep going; an old snapshot that can't be removed is harmless.
    }
  }
}

export async function shareBackup(backup: Backup, dialogTitle: string): Promise<void> {
  if (!(await Sharing.isAvailableAsync())) throw new Error('Sharing is not available');
  const file = new File(Paths.cache, fileName());
  writeTextFile(file, JSON.stringify(backup, null, 2));
  await Sharing.shareAsync(file.uri, { mimeType: 'application/json', UTI: 'public.json', dialogTitle });
}

export async function pickBackupFile(): Promise<Backup | 'invalid' | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: ['application/json', 'public.json', 'text/plain'],
    multiple: false,
    copyToCacheDirectory: true,
  });
  if (result.canceled) return null;
  const text = await new File(result.assets[0].uri).text();
  return parseBackup(text) ?? 'invalid';
}

export function readSnapshot(uri: string): Backup | null {
  try {
    return parseBackup(new File(uri).textSync());
  } catch {
    return null;
  }
}

export function restoreLibraryData(backup: Backup): RestoreReport {
  let matched = 0;
  let pending = 0;
  for (const track of backup.tracks) {
    const stats = { isFavorite: track.isFavorite, playCount: track.playCount, lastPlayedAt: track.lastPlayedAt };
    const trackId = findTrackIdByOriginal(track.originalName, track.sizeBytes);
    if (trackId !== null) {
      mergeTrackStats(trackId, stats);
      matched += 1;
    } else {
      savePendingStats(track.originalName, track.sizeBytes, stats);
      pending += 1;
    }
  }

  const existing = listSmartPlaylists();
  for (const playlist of backup.smartPlaylists) {
    const sameName = existing.find((item) => item.name === playlist.name);
    saveSmartPlaylist({ id: sameName?.id, ...playlist });
  }

  return { playlists: backup.smartPlaylists.length, matched, pending };
}

export function photoToTemporaryFile(photo: { base64: string; extension: string }): string {
  const file = new File(Paths.cache, `restored-photo-${Date.now()}.${photo.extension}`);
  if (file.exists) file.delete();
  file.create();
  file.write(photo.base64, { encoding: 'base64' });
  return file.uri;
}
