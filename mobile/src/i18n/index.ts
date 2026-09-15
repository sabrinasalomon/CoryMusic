import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import { KEYS, kv } from '../storage/kv';
import en from './locales/en.json';
import es from './locales/es.json';

export type LanguagePreference = 'system' | 'es' | 'en';

export function resolveLanguage(preference: LanguagePreference): 'es' | 'en' {
  if (preference === 'es' || preference === 'en') return preference;
  return getLocales()[0]?.languageCode === 'es' ? 'es' : 'en';
}

export function readLanguagePreference(): LanguagePreference {
  const saved = kv.get(KEYS.language);
  return saved === 'es' || saved === 'en' ? saved : 'system';
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: resolveLanguage(readLanguagePreference()),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
