import { Directory, File } from 'expo-file-system';

import { extensionOf, isSupportedAudio } from './files';
import type { ImportCandidate } from './importer';

const MAX_DEPTH = 5;
const MAX_FILES = 5000;
const UNSUPPORTED_AUDIO = ['ogg', 'oga', 'opus', 'wma', 'ape', 'mka', 'webm'];

export type FolderScan = {
  candidates: ImportCandidate[];
  unsupported: number;
};

function isCancellation(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.toLowerCase().includes('cancel');
}

export async function pickMusicFolder(initialUri?: string): Promise<Directory | null> {
  try {
    return await Directory.pickDirectoryAsync(initialUri);
  } catch (error) {
    if (isCancellation(error)) return null;
    throw error;
  }
}

function sizeOf(file: File): number | null {
  try {
    return file.size ?? null;
  } catch {
    return null;
  }
}

export function scanMusicFolder(directory: Directory): FolderScan {
  const scan: FolderScan = { candidates: [], unsupported: 0 };

  const walk = (current: Directory, depth: number) => {
    if (depth > MAX_DEPTH || scan.candidates.length >= MAX_FILES) return;

    let entries: (Directory | File)[];
    try {
      entries = current.list();
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      if (entry instanceof Directory) {
        walk(entry, depth + 1);
      } else if (isSupportedAudio(entry.name)) {
        scan.candidates.push({ name: entry.name, uri: entry.uri, size: sizeOf(entry) });
      } else if (UNSUPPORTED_AUDIO.includes(extensionOf(entry.name))) {
        scan.unsupported += 1;
      }
    }
  };

  walk(directory, 0);
  return scan;
}
