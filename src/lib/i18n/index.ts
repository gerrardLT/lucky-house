// src/lib/i18n/index.ts
// i18n 模块统一导出

export { translate, createTranslator, registerTranslation, clearTranslationCache } from './translate'
export { generateHreflangLinks } from './hreflang'
export type { HreflangLink } from './hreflang'
export type { Locale } from './config'
export {
  LOCALES,
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  LOCALE_COOKIE_MAX_AGE_DAYS,
  BCP47_MAP,
  BASE_URL,
  isValidLocale,
  locales,
  defaultLocale,
  bcp47Map,
  baseUrl,
} from './config'
