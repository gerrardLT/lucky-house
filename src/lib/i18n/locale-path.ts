import { LOCALES } from './config'
import type { Locale } from './config'

/**
 * 从 URL pathname 中提取 locale 前缀
 *
 * 示例:
 *   "/zh/stay" → "zh"
 *   "/ja/pet-friendly" → "ja"
 *   "/en/" → "en"
 *   "/stay" → null (无有效 locale 前缀)
 *   "/" → null
 */
export function extractLocaleFromPath(pathname: string): Locale | null {
  // 去掉开头的 /，取第一段
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) {
    return null
  }

  const firstSegment = segments[0].toLowerCase()
  if (LOCALES.includes(firstSegment as Locale)) {
    return firstSegment as Locale
  }

  return null
}

/**
 * 获取去除 locale 前缀后的路径
 *
 * 示例:
 *   "/zh/stay" → "/stay"
 *   "/ja/stay/room-slug" → "/stay/room-slug"
 *   "/en/" → "/"
 *   "/stay" → "/stay" (无 locale 前缀则原样返回)
 *   "/" → "/"
 */
export function getPathWithoutLocale(pathname: string): string {
  const locale = extractLocaleFromPath(pathname)
  if (!locale) {
    return pathname
  }

  // 去掉 locale 段，保留剩余路径
  const withoutLocale = pathname.replace(new RegExp(`^/${locale}`, 'i'), '')
  return withoutLocale || '/'
}

/**
 * 将 URL 路径中的 locale 段替换为目标语言
 *
 * 保留完整路径与查询参数不变，仅替换 locale 段
 *
 * 示例:
 *   replaceLocaleInPath("/zh/stay", "ja") → "/ja/stay"
 *   replaceLocaleInPath("/en/stay/room-slug?ref=home", "zh") → "/zh/stay/room-slug?ref=home"
 *   replaceLocaleInPath("/ja/", "en") → "/en/"
 *   replaceLocaleInPath("/stay", "ja") → "/ja/stay" (无 locale 前缀则添加)
 *   replaceLocaleInPath("/", "ja") → "/ja/"
 */
export function replaceLocaleInPath(fullPath: string, targetLocale: Locale): string {
  // 分离路径和查询参数
  const [pathname, ...queryParts] = fullPath.split('?')
  const queryString = queryParts.length > 0 ? `?${queryParts.join('?')}` : ''

  const currentLocale = extractLocaleFromPath(pathname)

  let newPathname: string

  if (currentLocale) {
    // 替换已有的 locale 段
    newPathname = pathname.replace(new RegExp(`^/${currentLocale}`, 'i'), `/${targetLocale}`)
  } else {
    // 无 locale 前缀时，添加目标 locale
    const cleanPath = pathname === '/' ? '/' : pathname
    newPathname = `/${targetLocale}${cleanPath}`
  }

  return `${newPathname}${queryString}`
}

/**
 * 构建带有指定 locale 的完整路径
 *
 * 示例:
 *   buildLocalePath("/stay", "ja") → "/ja/stay"
 *   buildLocalePath("/", "zh") → "/zh/"
 *   buildLocalePath("/stay/room-slug", "en") → "/en/stay/room-slug"
 */
export function buildLocalePath(pathWithoutLocale: string, locale: Locale): string {
  if (pathWithoutLocale === '/') {
    return `/${locale}/`
  }

  // 确保路径以 / 开头
  const normalizedPath = pathWithoutLocale.startsWith('/')
    ? pathWithoutLocale
    : `/${pathWithoutLocale}`

  return `/${locale}${normalizedPath}`
}
