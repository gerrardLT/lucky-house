import { LOCALES, DEFAULT_LOCALE } from './config'
import type { Locale } from './config'

/**
 * 解析 Accept-Language 头中的语言标签和 q 值
 *
 * Accept-Language 格式示例:
 *   "ja;q=0.9, zh-CN;q=1.0, en;q=0.5"
 *   "en-US,en;q=0.9,ja;q=0.8"
 *   "zh"
 *
 * 返回按 q 值降序排列的 { locale, quality } 数组
 */
export interface ParsedLanguage {
  locale: string
  quality: number
}

/**
 * 解析 Accept-Language 头字符串为语言标签列表（按 q 值降序）
 */
export function parseAcceptLanguage(header: string): ParsedLanguage[] {
  if (!header || !header.trim()) {
    return []
  }

  return header
    .split(',')
    .map((entry) => {
      const parts = entry.trim().split(';')
      const locale = parts[0].trim().toLowerCase()
      let quality = 1.0 // 默认 q 值为 1

      for (let i = 1; i < parts.length; i++) {
        const param = parts[i].trim()
        if (param.startsWith('q=')) {
          const qValue = parseFloat(param.substring(2))
          if (!isNaN(qValue) && qValue >= 0 && qValue <= 1) {
            quality = qValue
          }
        }
      }

      return { locale, quality }
    })
    .filter((entry) => entry.locale.length > 0)
    .sort((a, b) => b.quality - a.quality)
}

/**
 * 从解析后的语言列表中匹配第一个受支持的 locale
 *
 * 匹配策略:
 * 1. 精确匹配（如 "zh" → zh）
 * 2. 前缀匹配（如 "zh-CN" → zh, "en-US" → en, "ja-JP" → ja）
 */
export function matchLocale(parsedLanguages: ParsedLanguage[]): Locale | null {
  for (const { locale } of parsedLanguages) {
    // 精确匹配
    if (LOCALES.includes(locale as Locale)) {
      return locale as Locale
    }

    // 前缀匹配: 取语言标签的主语言部分（如 "zh-CN" → "zh"）
    const primary = locale.split('-')[0]
    if (LOCALES.includes(primary as Locale)) {
      return primary as Locale
    }
  }

  return null
}

/**
 * 从 Accept-Language 头检测最佳匹配 locale
 *
 * 按 q 值优先级匹配 zh/ja/en 中的最高优先语言
 * 如果 Accept-Language 头不包含任何支持的语言或头部缺失，则返回默认 locale（zh）
 */
export function detectLocaleFromHeader(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) {
    return DEFAULT_LOCALE
  }

  const parsed = parseAcceptLanguage(acceptLanguage)
  const matched = matchLocale(parsed)

  return matched ?? DEFAULT_LOCALE
}
