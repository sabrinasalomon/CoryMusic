import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';

import { insertTrack, isDuplicate } from './db';
import { extensionOf, isSupportedAudio, musicFile } from './files';

export type ImportSummary = {
  imported: number;
  duplicates: number;
  unsupported: number;
  failed: number;
};

export type ImportCandidate = {
  name: string;
  uri: string;
  size: number | null;
};

const NOISE = /\s*[([][^)\]]*(official|audio|video|lyric|lyrics|visualizer|kbps|hq|hd)[^)\]]*[)\]]/gi;

export function parseFileName(name: string): { title: string; artist: string | null } {
  const base = name.replace(/\.[^.]+$/, '');
  const cleaned = base
    .replace(/_+/g, ' ')
    .replace(NOISE, '')
    .replace(/^\s*\d{1,3}\s*[-.)]\s+/, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const parts = cleaned.split(/\s+-\s+/);
  if (parts.length >= 2 && parts[0].trim() && parts.slice(1).join(' - ').trim()) {
    return { artist: parts[0].trim(), title: parts.slice(1).join(' - ').trim() };
  }
  return { artist: null, title: cleaned || base };
}

function sizeOf(candidate: ImportCandidate): number {
  if (candidate.size !== null) return candidate.size;
  try {
    return new File(candidate.uri).size ?? 0;
  } catch {
    return 0;
  }
}

export async function importCandidates(candidates: ImportCandidate[]): Promise<ImportSummary> {
  const summary: ImportSummary = { imported: 0, duplicates: 0, unsupported: 0, failed: 0 };

  for (const candidate of candidates) {
    if (!isSupportedAudio(candidate.name)) {
      summary.unsupported += 1;
      continue;
    }

    const sizeBytes = sizeOf(candidate);
    if (isDuplicate(candidate.name, sizeBytes)) {
      summary.duplicates += 1;
      continue;
    }

    try {
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}.${extensionOf(candidate.name)}`;
      await new File(candidate.uri).copy(musicFile(fileName));
      const { title, artist } = parseFileName(candidate.name);
      insertTrack({ title, artist, fileName, originalName: candidate.name, sizeBytes });
      summary.imported += 1;
    } catch {
      summary.failed += 1;
    }
  }

  return summary;
}

export async function importFromFiles(): Promise<ImportSummary | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'audio/*',
    multiple: true,
    copyToCacheDirectory: true,
  });
  if (result.canceled) return null;

  return importCandidates(result.assets.map((asset) => ({ name: asset.name, uri: asset.uri, size: asset.size ?? null })));
}
