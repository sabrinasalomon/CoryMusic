import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import type { Backup } from '../backup/format';
import {
  buildBackup,
  listSnapshots,
  photoToTemporaryFile,
  pickBackupFile,
  readSnapshot,
  restoreLibraryData,
  shareBackup,
  writeSnapshot,
} from '../backup/service';
import type { BackupSnapshot } from '../backup/service';
import { countPendingStats } from '../library/db';
import { KEYS, kv, readTimestamp } from '../storage/kv';
import { useLibrary } from './LibraryProvider';
import { useProfile } from './ProfileProvider';

const WEEK = 7 * 24 * 60 * 60 * 1000;

type BackupContextValue = {
  snapshots: BackupSnapshot[];
  lastExportAt: number | null;
  autoWeekly: boolean;
  pendingSongs: number;
  needsExportReminder: boolean;
  busy: boolean;
  setAutoWeekly: (enabled: boolean) => void;
  saveBackup: () => Promise<void>;
  restoreFromFile: () => Promise<void>;
  restoreSnapshot: (snapshot: BackupSnapshot) => void;
};

const BackupContext = createContext<BackupContextValue | null>(null);

export function BackupProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const profile = useProfile();
  const library = useLibrary();
  const [snapshots, setSnapshots] = useState<BackupSnapshot[]>(() => listSnapshots());
  const [lastExportAt, setLastExportAt] = useState<number | null>(() => readTimestamp(KEYS.backupLastExport));
  const [autoWeekly, setAutoWeeklyState] = useState(() => kv.get(KEYS.backupAutoWeekly) !== 'false');
  const [pendingSongs, setPendingSongs] = useState(() => countPendingStats());
  const [busy, setBusy] = useState(false);
  const autoChecked = useRef(false);

  const hasData = library.tracks.length > 0 || library.smartPlaylists.length > 0;

  const currentBackup = useCallback(
    () => buildBackup({ name: profile.name, language: profile.language, photoFile: kv.get(KEYS.photoFile) }),
    [profile.name, profile.language],
  );

  useEffect(() => {
    if (autoChecked.current || !autoWeekly || !hasData) return;
    autoChecked.current = true;
    const lastAuto = readTimestamp(KEYS.backupLastAuto);
    if (lastAuto !== null && Date.now() - lastAuto < WEEK) return;
    try {
      writeSnapshot(currentBackup());
      kv.set(KEYS.backupLastAuto, String(Date.now()));
      setSnapshots(listSnapshots());
    } catch {
      // The next launch tries again.
    }
  }, [autoWeekly, hasData, currentBackup]);

  const setAutoWeekly = useCallback((enabled: boolean) => {
    setAutoWeeklyState(enabled);
    kv.set(KEYS.backupAutoWeekly, enabled ? 'true' : 'false');
  }, []);

  const saveBackup = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    try {
      const backup = currentBackup();
      writeSnapshot(backup);
      setSnapshots(listSnapshots());
      await shareBackup(backup, t('backup.shareTitle'));
      const now = Date.now();
      kv.set(KEYS.backupLastExport, String(now));
      setLastExportAt(now);
    } catch {
      Alert.alert(t('backup.saveErrorTitle'), t('backup.saveErrorBody'));
    } finally {
      setBusy(false);
    }
  }, [busy, currentBackup, t]);

  const applyBackup = useCallback(
    async (backup: Backup) => {
      setBusy(true);
      try {
        writeSnapshot(currentBackup());
        const report = restoreLibraryData(backup);
        if (backup.profile.name) profile.setName(backup.profile.name);
        profile.setLanguage(backup.profile.language);
        if (backup.profile.photo) await profile.setPhoto(photoToTemporaryFile(backup.profile.photo));
        library.reload();
        setSnapshots(listSnapshots());
        setPendingSongs(countPendingStats());
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        const lines = [
          t('backup.reportPlaylists', { count: report.playlists }),
          t('backup.reportMatched', { count: report.matched }),
        ];
        if (report.pending) lines.push(t('backup.reportPending', { count: report.pending }));
        Alert.alert(t('backup.reportTitle'), lines.join('\n'));
      } catch {
        Alert.alert(t('backup.restoreErrorTitle'), t('backup.restoreErrorBody'));
      } finally {
        setBusy(false);
      }
    },
    [currentBackup, profile, library, t],
  );

  const confirmRestore = useCallback(
    (backup: Backup) => {
      const summary = [
        t('backup.confirmSongs', { count: backup.tracks.length }),
        t('backup.confirmPlaylists', { count: backup.smartPlaylists.length }),
        backup.profile.name ? t('backup.confirmProfile', { name: backup.profile.name }) : null,
        t('backup.confirmSafety'),
      ]
        .filter(Boolean)
        .join('\n');
      Alert.alert(t('backup.confirmTitle'), summary, [
        { text: t('backup.cancel'), style: 'cancel' },
        { text: t('backup.restore'), onPress: () => applyBackup(backup) },
      ]);
    },
    [applyBackup, t],
  );

  const restoreFromFile = useCallback(async () => {
    if (busy) return;
    try {
      const result = await pickBackupFile();
      if (result === null) return;
      if (result === 'invalid') {
        Alert.alert(t('backup.invalidTitle'), t('backup.invalidBody'));
        return;
      }
      confirmRestore(result);
    } catch {
      Alert.alert(t('backup.restoreErrorTitle'), t('backup.restoreErrorBody'));
    }
  }, [busy, confirmRestore, t]);

  const restoreSnapshot = useCallback(
    (snapshot: BackupSnapshot) => {
      if (busy) return;
      const backup = readSnapshot(snapshot.uri);
      if (!backup) {
        Alert.alert(t('backup.invalidTitle'), t('backup.invalidBody'));
        return;
      }
      confirmRestore(backup);
    },
    [busy, confirmRestore, t],
  );

  const value = useMemo<BackupContextValue>(
    () => ({
      snapshots,
      lastExportAt,
      autoWeekly,
      pendingSongs,
      needsExportReminder: hasData && (lastExportAt === null || Date.now() - lastExportAt > WEEK),
      busy,
      setAutoWeekly,
      saveBackup,
      restoreFromFile,
      restoreSnapshot,
    }),
    [snapshots, lastExportAt, autoWeekly, pendingSongs, hasData, busy, setAutoWeekly, saveBackup, restoreFromFile, restoreSnapshot],
  );

  return <BackupContext.Provider value={value}>{children}</BackupContext.Provider>;
}

export function useBackup(): BackupContextValue {
  const context = useContext(BackupContext);
  if (!context) throw new Error('useBackup must be used inside BackupProvider');
  return context;
}
