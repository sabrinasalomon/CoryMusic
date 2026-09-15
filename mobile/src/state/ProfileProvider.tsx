import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import i18n, { readLanguagePreference, resolveLanguage } from '../i18n';
import type { LanguagePreference } from '../i18n';
import { deleteFile, profilePhotoFile, saveProfilePhoto } from '../library/files';
import { KEYS, kv } from '../storage/kv';

type ProfileContextValue = {
  name: string;
  photoUri: string | null;
  language: LanguagePreference;
  onboardingDone: boolean;
  setName: (name: string) => void;
  setPhoto: (sourceUri: string) => Promise<void>;
  removePhoto: () => void;
  setLanguage: (language: LanguagePreference) => void;
  completeOnboarding: () => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [name, setNameState] = useState(() => kv.get(KEYS.userName) ?? '');
  const [photoFile, setPhotoFile] = useState<string | null>(() => kv.get(KEYS.photoFile));
  const [language, setLanguageState] = useState<LanguagePreference>(readLanguagePreference);
  const [onboardingDone, setOnboardingDone] = useState(() => kv.get(KEYS.onboardingDone) === 'true');

  const setName = useCallback((value: string) => {
    const trimmed = value.trim();
    setNameState(trimmed);
    if (trimmed) kv.set(KEYS.userName, trimmed);
    else kv.remove(KEYS.userName);
  }, []);

  const setPhoto = useCallback(async (sourceUri: string) => {
    const saved = await saveProfilePhoto(sourceUri);
    setPhotoFile((previous) => {
      if (previous) deleteFile(profilePhotoFile(previous));
      return saved;
    });
    kv.set(KEYS.photoFile, saved);
  }, []);

  const removePhoto = useCallback(() => {
    setPhotoFile((previous) => {
      if (previous) deleteFile(profilePhotoFile(previous));
      return null;
    });
    kv.remove(KEYS.photoFile);
  }, []);

  const setLanguage = useCallback((value: LanguagePreference) => {
    setLanguageState(value);
    kv.set(KEYS.language, value);
    i18n.changeLanguage(resolveLanguage(value));
  }, []);

  const completeOnboarding = useCallback(() => {
    setOnboardingDone(true);
    kv.set(KEYS.onboardingDone, 'true');
  }, []);

  const value = useMemo<ProfileContextValue>(
    () => ({
      name,
      photoUri: photoFile ? profilePhotoFile(photoFile).uri : null,
      language,
      onboardingDone,
      setName,
      setPhoto,
      removePhoto,
      setLanguage,
      completeOnboarding,
    }),
    [name, photoFile, language, onboardingDone, setName, setPhoto, removePhoto, setLanguage, completeOnboarding],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used inside ProfileProvider');
  return context;
}
