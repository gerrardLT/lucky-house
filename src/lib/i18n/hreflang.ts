// src/lib/i18n/hreflang.ts
// 生成 hreflang alternate link 标签数据的工具函数

import type { Locale } from './config'
import { LOCALES, BCP47_MAP, BASE_URL, DEFAULT_LOCALE } from './config'

/** hreflang 链接条目 */
export interface HreflangLink {
  locale: string // BCP 47 语言标签 或 'x-default'
  href: string   // 完整 URL
}

/**
 * 根据当前路径生成所有语言版本的 hreflang 备选链接数据
 *
 * 为每种支持的语言生成一个 alternate link，
 * 并额外生成 x-default 指向默认语言（zh）版本。
 *
 * @param currentPath - 不含 locale 前缀的页面路径（如 '/stay/deluxe-room' 或 '/'）
 * @returns HreflangLink[] — 包含 zh/ja/en 三种语言和 x-default 共 4 条记录
 *
 * @example
 * generateHreflangLinks('/stay')
 * // =>
 * // [
 * //   { locale: 'zh-CN', href: 'https://luckyhouse.jp/zh/stay' },
 * //   { locale: 'ja', href: 'https://luckyhouse.jp/ja/stay' },
 * //   { locale: 'en', href: 'https://luckyhouse.jp/en/stay' },
 * //   { locale: 'x-default', href: 'https://luckyhouse.jp/zh/stay' },
 * // ]
 */
export function generateHreflangLinks(currentPath: string): HreflangLink[] {
  // 规范化路径：确保以 / 开头，移除末尾多余的斜杠（根路径除外）
  const normalizedPath = normalizePath(currentPath)

  const links: HreflangLink[] = []

  // 为每种支持的 locale 生成 alternate link
  for (const locale of LOCALES) {
    links.push({
      locale: BCP47_MAP[locale],
      href: buildLocalizedUrl(locale, normalizedPath),
    })
  }

  // 添加 x-default 指向默认语言（zh）版本
  links.push({
    locale: 'x-default',
    href: buildLocalizedUrl(DEFAULT_LOCALE, normalizedPath),
  })

  return links
}

/**
 * 构建带 locale 前缀的完整 URL
 *
 * @param locale - 目标语言
 * @param path - 不含 locale 前缀的路径
 * @returns 完整的绝对 URL
 */
function buildLocalizedUrl(locale: Locale, path: string): string {
  // 根路径处理：/zh/ 而非 /zh
  if (path === '/' || path === '') {
    return `${BASE_URL}/${locale}/`
  }

  // 非根路径：/zh/stay、/zh/stay/deluxe-room
  return `${BASE_URL}/${locale}${path}`
}

/**
 * 规范化路径
 * - 确保以 / 开头
 * - 移除末尾多余的斜杠（根路径 '/' 保留）
 * - 移除可能存在的 locale 前缀
 */
function normalizePath(path: string): string {
  let normalized = path

  // 确保以 / 开头
  if (!normalized.startsWith('/')) {
    normalized = '/' + normalized
  }

  // 移除可能存在的 locale 前缀（如 /zh/stay -> /stay）
  const localePattern = new RegExp(`^/(${LOCALES.join('|')})(/|$)`)
  const match = normalized.match(localePattern)
  if (match) {
    normalized = normalized.slice(match[1].length + 1) || '/'
  }

  // 移除末尾斜杠（根路径除外）
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1)
  }

  return normalized
}
