import Storage from 'expo-sqlite/kv-store';

export const KEYS = {
  userName: 'profile.name',
  photoFile: 'profile.photoFile',
  language: 'profile.language',
  onboardingDone: 'profile.onboardingDone',
  folderUri: 'folder.uri',
  folderName: 'folder.name',
  folderLastSync: 'folder.lastSyncAt',
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
