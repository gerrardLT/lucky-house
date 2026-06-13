// src/lib/i18n/translate.ts
// 翻译工具函数：支持 namespace 加载、嵌套 key 点号访问、缺失 key 回退 zh

import type { Locale } from './config'
import { DEFAULT_LOCALE, isValidLocale } from './config'

// 静态导入所有已知的翻译文件
// 使用 import 确保 bundler (Vitest/Next.js) 正确解析路径
import zhCommon from '@/i18n/zh/common.json'
import jaCommon from '@/i18n/ja/common.json'
import enCommon from '@/i18n/en/common.json'

/** 翻译文件注册表 */
type TranslationData = Record<string, unknown>

const staticTranslations: Record<string, TranslationData> = {
  'zh/common': zhCommon,
  'ja/common': jaCommon,
  'en/common': enCommon,
}

/** 动态翻译文件缓存（用于后续动态加载的 namespace） */
const dynamicCache: Map<string, TranslationData> = new Map()

/**
 * 获取翻译文件数据
 * 优先使用静态导入的数据，否则尝试动态加载
 */
function getTranslationData(locale: Locale, namespace: string): TranslationData {
  const key = `${locale}/${namespace}`

  // 先检查静态导入的翻译
  if (key in staticTranslations) {
    return staticTranslations[key]
  }

  // 再检查动态缓存
  if (dynamicCache.has(key)) {
    return dynamicCache.get(key)!
  }

  // 尝试动态加载（运行时环境）
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const data = require(`../../i18n/${locale}/${namespace}.json`) as TranslationData
    dynamicCache.set(key, data)
    return data
  } catch {
    dynamicCache.set(key, {})
    return {}
  }
}

/**
 * 通过点号路径从嵌套对象中获取值
 * 例如: getNestedValue({ nav: { home: "首页" } }, "nav.home") => "首页"
 */
function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  if (path === '') {
    return undefined
  }

  const keys = path.split('.')
  let current: unknown = obj

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined
    }
    current = (current as Record<string, unknown>)[key]
  }

  if (typeof current === 'string') {
    return current
  }

  return undefined
}

/**
 * 翻译函数
 *
 * @param locale - 当前语言
 * @param namespace - 翻译文件命名空间（如 'common', 'home', 'booking'）
 * @param key - 翻译 key，支持点号分隔的嵌套路径（如 'nav.home', 'buttons.bookNow'）
 * @returns 翻译后的文本字符串
 *
 * 回退逻辑：
 * 1. 先在当前 locale 翻译文件中查找
 * 2. 若未找到，回退到 zh（默认语言）翻译文件中查找
 * 3. 若 zh 中也未找到，返回 key 本身
 */
export function translate(locale: Locale, namespace: string, key: string): string {
  // 验证 locale
  const validLocale = isValidLocale(locale) ? locale : DEFAULT_LOCALE

  // 尝试在当前 locale 中查找
  const translations = getTranslationData(validLocale, namespace)
  const value = getNestedValue(translations, key)

  if (value !== undefined) {
    return value
  }

  // 如果当前 locale 不是默认语言，回退到 zh
  if (validLocale !== DEFAULT_LOCALE) {
    const fallbackTranslations = getTranslationData(DEFAULT_LOCALE, namespace)
    const fallbackValue = getNestedValue(fallbackTranslations, key)

    if (fallbackValue !== undefined) {
      return fallbackValue
    }
  }

  // 最后的安全回退：返回 key 本身
  return key
}

/**
 * 创建带预设 locale 和 namespace 的翻译函数
 * 方便在组件中使用，减少重复参数传递
 *
 * @example
 * const t = createTranslator('zh', 'common')
 * t('nav.home') // => "首页"
 */
export function createTranslator(locale: Locale, namespace: string) {
  return (key: string): string => translate(locale, namespace, key)
}

/**
 * 注册额外的翻译数据（用于测试或动态加载场景）
 */
export function registerTranslation(locale: Locale, namespace: string, data: TranslationData): void {
  staticTranslations[`${locale}/${namespace}`] = data
}

/**
 * 清除动态翻译缓存（测试用途）
 */
export function clearTranslationCache(): void {
  dynamicCache.clear()
}
