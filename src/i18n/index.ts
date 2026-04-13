import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation resources
import esCommon from './locales/es/common.json'
import esAuth from './locales/es/auth.json'
import esNavigation from './locales/es/navigation.json'
import esAccessibility from './locales/es/accessibility.json'
import esScraping from './locales/es/scraping.json'

import enCommon from './locales/en/common.json'
import enAuth from './locales/en/auth.json'
import enNavigation from './locales/en/navigation.json'
import enAccessibility from './locales/en/accessibility.json'
import enScraping from './locales/en/scraping.json'

export const defaultNS = 'common'
export const resources = {
  es: {
    common: esCommon,
    auth: esAuth,
    navigation: esNavigation,
    accessibility: esAccessibility,
    scraping: esScraping,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    navigation: enNavigation,
    accessibility: enAccessibility,
    scraping: enScraping,
  },
} as const

export const supportedLanguages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
] as const

export type SupportedLanguage = 'es' | 'en'

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    defaultNS,
    fallbackLng: 'es',
    supportedLngs: ['es', 'en'],
    
    // Language detection configuration
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // Debug mode in development
    debug: import.meta.env.DEV,
  })

export default i18n