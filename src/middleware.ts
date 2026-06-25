// src/middleware.ts
// 链式中间件：/admin 路径走 Auth.js 认证，其他路径走 i18n 语言检测

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth/config'
import { LOCALE_COOKIE_NAME, DEFAULT_LOCALE, isValidLocale } from '@/lib/i18n/config'
import type { Locale } from '@/lib/i18n/config'
import { detectLocaleFromHeader } from '@/lib/i18n/locale-detection'
import { extractLocaleFromPath, getPathWithoutLocale } from '@/lib/i18n/locale-path'

/**
 * Admin 认证处理
 *
 * 流程:
 * 1. 检查 session 是否存在
 * 2. /admin/login 始终放行（已登录用户由登录页自行重定向）
 * 3. 其他 /admin 路径无 session 则重定向至登录页
 */
async function handleAdminAuth(request: NextRequest): Promise<NextResponse> {
  const session = await auth()
  const { pathname } = request.nextUrl

  // /admin/login 始终公开
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // 无 session → 重定向至登录页
  if (!session) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl, 302)
  }

  return NextResponse.next()
}

/**
 * i18n 语言检测处理
 *
 * 流程:
 * 1. 检查 URL 是否已包含有效的 locale 前缀 → 放行
 * 2. 检测语言（cookie → Accept-Language → 默认 zh）
 * 3. 302 重定向至 /{locale}/{原路径}
 */
function handleI18n(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl

  // 检查 URL 是否已包含有效的 locale 段
  const pathLocale = extractLocaleFromPath(pathname)
  if (pathLocale) {
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

  let redirectPath: string
  if (pathWithoutLocale === '/') {
    redirectPath = `/${detectedLocale}/`
  } else {
    redirectPath = `/${detectedLocale}${pathWithoutLocale}`
  }

  const redirectUrl = new URL(`${redirectPath}${search}`, request.url)
  return NextResponse.redirect(redirectUrl, 302)
}

/**
 * 主中间件入口
 *
 * - /admin 路径 → Auth.js 认证
 * - 其他路径 → i18n 语言检测
 */
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    return handleAdminAuth(request)
  }

  return handleI18n(request)
}

/**
 * 中间件匹配配置
 *
 * 排除以下路径:
 * - /_next/ (Next.js 内部资源)
 * - /api/ (API 路由，含 /api/auth)
 * - 静态文件（含扩展名的路径）
 * - favicon.ico, sitemap.xml, robots.txt
 */
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\..*).*)',
  ],
}
