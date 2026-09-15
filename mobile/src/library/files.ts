import { Directory, File, Paths } from 'expo-file-system';

export const SUPPORTED_EXTENSIONS = ['mp3', 'm4a', 'aac', 'wav', 'aif', 'aiff', 'flac'] as const;

export function extensionOf(name: string): string {
  const clean = name.split('?')[0];
  const dot = clean.lastIndexOf('.');
  return dot >= 0 ? clean.slice(dot + 1).toLowerCase() : '';
}

export function isSupportedAudio(name: string): boolean {
  return (SUPPORTED_EXTENSIONS as readonly string[]).includes(extensionOf(name));
}

function ensureDirectory(name: string): Directory {
  const directory = new Directory(Paths.document, name);
  if (!directory.exists) directory.create({ intermediates: true });
  return directory;
}

export function musicFile(fileName: string): File {
  return new File(ensureDirectory('music'), fileName);
}

export function profilePhotoFile(fileName: string): File {
  return new File(ensureDirectory('profile'), fileName);
}

export async function saveProfilePhoto(sourceUri: string): Promise<string> {
  const fileName = `photo-${Date.now()}.${extensionOf(sourceUri) || 'jpg'}`;
  await new File(sourceUri).copy(profilePhotoFile(fileName));
  return fileName;
}

export function deleteFile(file: File): void {
  try {
    if (file.exists) file.delete();
  } catch {
    // The file is already gone; nothing else to clean up.
  }
}
