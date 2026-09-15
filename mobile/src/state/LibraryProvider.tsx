import * as Haptics from 'expo-haptics';
import type { Directory } from 'expo-file-system';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import {
  deleteSmartPlaylist as removeSmartPlaylist,
  listSmartPlaylists,
  listTracks,
  recordPlay as storePlay,
  saveSmartPlaylist as storeSmartPlaylist,
  setFavorite,
  setLyrics,
} from '../library/db';
import type { Track } from '../library/db';
import { pickMusicFolder, scanMusicFolder } from '../library/folder';
import { importCandidates, importFromFiles } from '../library/importer';
import type { ImportSummary } from '../library/importer';
import type { SmartPlaylist, SmartPlaylistDraft } from '../smart/rules';
import { KEYS, kv, readTimestamp } from '../storage/kv';

export type ArtistSummary = { name: string | null; count: number };

export type MusicFolder = {
  name: string;
  uri: string;
  lastSyncAt: number | null;
};

type LibraryContextValue = {
  tracks: Track[];
  artists: ArtistSummary[];
  totalBytes: number;
  smartPlaylists: SmartPlaylist[];
  musicFolder: MusicFolder | null;
  syncing: boolean;
  importMusic: () => Promise<void>;
  syncMusicFolder: () => Promise<void>;
  chooseMusicFolder: () => Promise<void>;
  forgetMusicFolder: () => void;
  toggleFavorite: (track: Track) => void;
  recordPlay: (trackId: number) => void;
  saveLyrics: (trackId: number, lyrics: string | null) => void;
  saveSmartPlaylist: (draft: SmartPlaylistDraft) => number;
  deleteSmartPlaylist: (id: number) => void;
  reload: () => void;
};

const LibraryContext = createContext<LibraryContextValue | null>(null);

function readMusicFolder(): MusicFolder | null {
  const uri = kv.get(KEYS.folderUri);
  const name = kv.get(KEYS.folderName);
  if (!uri || !name) return null;
  return { uri, name, lastSyncAt: readTimestamp(KEYS.folderLastSync) };
}

export function LibraryProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [tracks, setTracks] = useState<Track[]>(() => listTracks());
  const [smartPlaylists, setSmartPlaylists] = useState<SmartPlaylist[]>(() => listSmartPlaylists());
  const [musicFolder, setMusicFolder] = useState<MusicFolder | null>(readMusicFolder);
  const [syncing, setSyncing] = useState(false);
  const sessionFolder = useRef<Directory | null>(null);

  const reload = useCallback(() => {
    setTracks(listTracks());
    setSmartPlaylists(listSmartPlaylists());
  }, []);

  const summaryLines = useCallback(
    (summary: ImportSummary) => {
      const lines = [t('import.imported', { count: summary.imported })];
      if (summary.duplicates) lines.push(t('import.duplicates', { count: summary.duplicates }));
      if (summary.unsupported) lines.push(t('import.unsupported', { count: summary.unsupported }));
      if (summary.failed) lines.push(t('import.failed', { count: summary.failed }));
      return lines;
    },
    [t],
  );

  const importMusic = useCallback(async () => {
    try {
      const summary = await importFromFiles();
      if (!summary) return;
      setTracks(listTracks());
      if (summary.imported > 0) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(t('import.resultTitle'), summaryLines(summary).join('\n'));
    } catch {
      Alert.alert(t('import.errorTitle'), t('import.errorBody'));
    }
  }, [t, summaryLines]);

  const rememberFolder = useCallback((directory: Directory) => {
    sessionFolder.current = directory;
    kv.set(KEYS.folderUri, directory.uri);
    kv.set(KEYS.folderName, directory.name);
    setMusicFolder((previous) => ({
      uri: directory.uri,
      name: directory.name,
      lastSyncAt: previous?.uri === directory.uri ? previous.lastSyncAt : null,
    }));
  }, []);

  const runSync = useCallback(
    async (directory: Directory) => {
      const scan = scanMusicFolder(directory);
      const summary = await importCandidates(scan.candidates);
      summary.unsupported += scan.unsupported;

      const now = Date.now();
      kv.set(KEYS.folderLastSync, String(now));
      setMusicFolder((previous) => (previous ? { ...previous, lastSyncAt: now } : previous));
      setTracks(listTracks());

      if (summary.imported > 0) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const lines = [t('folder.found', { count: scan.candidates.length }), ...summaryLines(summary)];
      Alert.alert(t('folder.resultTitle'), lines.join('\n'));
    },
    [t, summaryLines],
  );

  const syncWith = useCallback(
    async (getDirectory: () => Promise<Directory | null>) => {
      if (syncing) return;
      setSyncing(true);
      try {
        const directory = await getDirectory();
        if (!directory) return;
        await runSync(directory);
      } catch {
        sessionFolder.current = null;
        Alert.alert(t('folder.errorTitle'), t('folder.errorBody'));
      } finally {
        setSyncing(false);
      }
    },
    [syncing, runSync, t],
  );

  const syncMusicFolder = useCallback(
    () =>
      syncWith(async () => {
        if (sessionFolder.current) return sessionFolder.current;
        const picked = await pickMusicFolder(musicFolder?.uri);
        if (picked) rememberFolder(picked);
        return picked;
      }),
    [syncWith, musicFolder?.uri, rememberFolder],
  );

  const chooseMusicFolder = useCallback(
    () =>
      syncWith(async () => {
        const picked = await pickMusicFolder();
        if (picked) rememberFolder(picked);
        return picked;
      }),
    [syncWith, rememberFolder],
  );

  const forgetMusicFolder = useCallback(() => {
    sessionFolder.current = null;
    kv.remove(KEYS.folderUri);
    kv.remove(KEYS.folderName);
    kv.remove(KEYS.folderLastSync);
    setMusicFolder(null);
  }, []);

  const toggleFavorite = useCallback((track: Track) => {
    setFavorite(track.id, !track.isFavorite);
    setTracks(listTracks());
  }, []);

  const recordPlay = useCallback((trackId: number) => {
    storePlay(trackId);
    setTracks(listTracks());
  }, []);

  const saveLyrics = useCallback((trackId: number, lyrics: string | null) => {
    setLyrics(trackId, lyrics && lyrics.trim() ? lyrics.replace(/\s+$/, '') : null);
    setTracks(listTracks());
  }, []);

  const saveSmartPlaylist = useCallback((draft: SmartPlaylistDraft) => {
    const id = storeSmartPlaylist(draft);
    setSmartPlaylists(listSmartPlaylists());
    return id;
  }, []);

  const deleteSmartPlaylist = useCallback((id: number) => {
    removeSmartPlaylist(id);
    setSmartPlaylists(listSmartPlaylists());
  }, []);

  const value = useMemo<LibraryContextValue>(() => {
    const byArtist = new Map<string | null, number>();
    let totalBytes = 0;
    for (const track of tracks) {
      byArtist.set(track.artist, (byArtist.get(track.artist) ?? 0) + 1);
      totalBytes += track.sizeBytes;
    }
    const artists = [...byArtist.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => (a.name ?? '￿').localeCompare(b.name ?? '￿'));
    return {
      tracks,
      artists,
      totalBytes,
      smartPlaylists,
      musicFolder,
      syncing,
      importMusic,
      syncMusicFolder,
      chooseMusicFolder,
      forgetMusicFolder,
      toggleFavorite,
      recordPlay,
      saveLyrics,
      saveSmartPlaylist,
      deleteSmartPlaylist,
      reload,
    };
  }, [
    saveLyrics,
    tracks,
    smartPlaylists,
    musicFolder,
    syncing,
    importMusic,
    syncMusicFolder,
    chooseMusicFolder,
    forgetMusicFolder,
    toggleFavorite,
    recordPlay,
    saveSmartPlaylist,
    deleteSmartPlaylist,
    reload,
  ]);

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary(): LibraryContextValue {
  const context = useContext(LibraryContext);
  if (!context) throw new Error('useLibrary must be used inside LibraryProvider');
  return context;
}
