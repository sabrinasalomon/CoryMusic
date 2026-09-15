import Storage from 'expo-sqlite/kv-store';

export const KEYS = {
  userName: 'profile.name',
  photoFile: 'profile.photoFile',
  language: 'profile.language',
  onboardingDone: 'profile.onboardingDone',
  folderUri: 'folder.uri',
  folderName: 'folder.name',
  folderLastSync: 'folder.lastSyncAt',
  backupAutoWeekly: 'backup.autoWeekly',
  backupLastAuto: 'backup.lastAutoAt',
  backupLastExport: 'backup.lastExportAt',
} as const;

export const kv = {
  get(key: string): string | null {
    return Storage.getItemSync(key);
  },
  set(key: string, value: string): void {
    Storage.setItemSync(key, value);
  },
  remove(key: string): void {
    Storage.removeItemSync(key);
  },
};

export function readTimestamp(key: string): number | null {
  const value = Number(kv.get(key));
  return Number.isFinite(value) && value > 0 ? value : null;
}
