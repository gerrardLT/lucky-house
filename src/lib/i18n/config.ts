// src/lib/i18n/config.ts
// i18n 配置：支持的 locale 列表与默认语言

/** 支持的语言区域类型（与 src/types/index.ts 中的 Locale 保持一致） */
export type Locale = 'zh' | 'ja' | 'en'

/** 支持的所有语言 */
export const LOCALES: readonly Locale[] = ['zh', 'ja', 'en'] as const

/** 默认语言（回退语言） */
export const DEFAULT_LOCALE: Locale = 'zh'

/** 语言偏好 Cookie 名称 */
export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE'

/** Cookie 有效期（天） */
export const LOCALE_COOKIE_MAX_AGE_DAYS = 365

/** BCP 47 语言标签映射 */
export const BCP47_MAP: Record<Locale, string> = {
  zh: 'zh-CN',
  ja: 'ja',
  en: 'en',
}

/** 网站基础 URL */
export const BASE_URL = 'https://luckyhouse-group.com'

/** 判断是否为有效 locale */
export function isValidLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

// 兼容别名导出（方便其他模块使用）
export const locales = LOCALES
export const defaultLocale = DEFAULT_LOCALE
export const bcp47Map = BCP47_MAP
export const baseUrl = BASE_URL
