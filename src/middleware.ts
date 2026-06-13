import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { LOCALE_COOKIE_NAME, DEFAULT_LOCALE, isValidLocale } from '@/lib/i18n/config'
import type { Locale } from '@/lib/i18n/config'
import { detectLocaleFromHeader } from '@/lib/i18n/locale-detection'
import { extractLocaleFromPath, getPathWithoutLocale } from '@/lib/i18n/locale-path'

/**
 * i18n 中间件
 *
 * 流程:
 * 1. 跳过静态资源、API 路由和 _next 路径
 * 2. 检查 URL 是否已包含有效的 locale 前缀
 *    - 是: 放行请求
 *    - 否: 进入语言检测流程
 * 3. 语言检测优先级:
 *    a. 检查 cookie（NEXT_LOCALE）
 *    b. 解析 Accept-Language 头
 *    c. 使用默认语言 zh
 * 4. 302 重定向至 /{detected_locale}/{原路径}
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 检查 URL 是否已包含有效的 locale 段
  const pathLocale = extractLocaleFromPath(pathname)
  if (pathLocale) {
    // URL 已包含有效 locale，放行
    return NextResponse.next()
  }

  // 无有效 locale 前缀 — 需要检测并重定向
  let detectedLocale: Locale = DEFAULT_LOCALE

  // 1. 优先检查 cookie
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value
  if (cookieLocale && isValidLocale(cookieLocale)) {
    detectedLocale = cookieLocale
  } else {
    // 2. 解析 Accept-Language 头
    const acceptLanguage = request.headers.get('accept-language')
    detectedLocale = detectLocaleFromHeader(acceptLanguage)
  }

  // 3. 构建重定向 URL
  const pathWithoutLocale = getPathWithoutLocale(pathname)
  const search = request.nextUrl.search || ''

  // 构建目标路径: /{locale}{原路径}
  let redirectPath: string
  if (pathWithoutLocale === '/') {
    redirectPath = `/${detectedLocale}/`
  } else {
    redirectPath = `/${detectedLocale}${pathWithoutLocale}`
  }

  const redirectUrl = new URL(`${redirectPath}${search}`, request.url)

  // 302 临时重定向
  return NextResponse.redirect(redirectUrl, 302)
}

/**
 * 中间件匹配配置
 *
 * 排除以下路径:
 * - /_next/ (Next.js 内部资源)
 * - /api/ (API 路由)
 * - 静态文件（含扩展名的路径，如 .ico, .svg, .png, .jpg 等）
 */
export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - 含文件扩展名的静态资源
     */
    '/((?!api|_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\..*).*)',
  ],
}
