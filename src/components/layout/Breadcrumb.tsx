// src/components/layout/Breadcrumb.tsx
// 面包屑导航组件：根据 URL 路径深度条件渲染
// 包含 BreadcrumbList 结构化数据 (JSON-LD) — Requirements 15.4
// Server Component — 无需 'use client'

import Link from 'next/link'
import type { Locale } from '@/lib/i18n/config'
import { BASE_URL } from '@/lib/i18n/config'
import { translate } from '@/lib/i18n/translate'

export interface BreadcrumbProps {
  locale: Locale
  pathname: string
}

/**
 * URL 路径段到翻译 key 的映射
 * 已知路径段使用 nav 命名空间的翻译 key
 */
const SEGMENT_TO_NAV_KEY: Record<string, string> = {
  stay: 'nav.stay',
  'pet-friendly': 'nav.petFriendly',
  facilities: 'nav.facilities',
  activities: 'nav.activities',
  explore: 'nav.explore',
  gallery: 'nav.gallery',
  faq: 'nav.faq',
  booking: 'nav.booking',
  contact: 'nav.contact',
  privacy: 'footer.privacy',
  terms: 'footer.terms',
  'pet-rules': 'footer.petRules',
}

/**
 * 将 URL 段格式化为可读标签
 * 对于未知段（如动态 slug），将连字符替换为空格并首字母大写
 */
function formatSegmentLabel(segment: string): string {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * 获取路径段的显示标签
 * 1. 如果是已知段，使用翻译 key 获取本地化标签
 * 2. 如果是未知段（动态 slug），格式化为可读标签
 */
function getSegmentLabel(segment: string, locale: Locale): string {
  const navKey = SEGMENT_TO_NAV_KEY[segment]
  if (navKey) {
    return translate(locale, 'common', navKey)
  }
  // 对于动态段（如房间 slug），格式化为可读标签
  return formatSegmentLabel(segment)
}

/**
 * 从 pathname 中提取 locale 后的路径段
 * 例如：/zh/stay/pet-friendly-twin → ['stay', 'pet-friendly-twin']
 */
function getPathSegments(pathname: string): string[] {
  // 移除开头和结尾的斜杠，然后按 / 分割
  const parts = pathname.replace(/^\/|\/$/g, '').split('/')

  // 第一段是 locale，跳过
  if (parts.length <= 1) {
    return []
  }

  return parts.slice(1).filter((segment) => segment.length > 0)
}

/**
 * Breadcrumb 面包屑导航组件
 *
 * 条件渲染规则：
 * - /zh/ → 不显示（根路径，locale 后无路径段）
 * - /zh/stay → 显示（Home > 住宿房型）
 * - /zh/stay/pet-friendly-twin → 显示（Home > 住宿房型 > Pet Friendly Twin）
 *
 * 仅在 locale 后路径段数 ≥ 1 时渲染
 * 同时输出 BreadcrumbList 结构化数据 (JSON-LD) — Requirements 15.4
 */
export function Breadcrumb({ locale, pathname }: BreadcrumbProps) {
  const segments = getPathSegments(pathname)

  // 路径深度 < 1（即仅有 locale 或根路径），不渲染面包屑
  if (segments.length < 1) {
    return null
  }

  // 构建面包屑项列表
  const homeLabel = translate(locale, 'common', 'nav.home')
  const items: Array<{ label: string; href: string; isCurrent: boolean }> = []

  // 首页始终是第一项
  items.push({
    label: homeLabel,
    href: `/${locale}`,
    isCurrent: false,
  })

  // 逐段构建路径和标签
  let cumulativePath = `/${locale}`
  segments.forEach((segment, index) => {
    cumulativePath += `/${segment}`
    const label = getSegmentLabel(segment, locale)
    const isCurrent = index === segments.length - 1

    items.push({
      label,
      href: cumulativePath,
      isCurrent,
    })
  })

  // 生成 BreadcrumbList 结构化数据
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${BASE_URL}${item.href}`,
    })),
  }

  return (
    <>
      {/* BreadcrumbList 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <nav aria-label="breadcrumb" className="mt-16 bg-stone-900 border-b border-stone-700">
      <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-stone-400">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <span className="mx-1.5 text-stone-500" aria-hidden="true">
                  /
                </span>
              )}
              {item.isCurrent ? (
                <span
                  aria-current="page"
                  className="font-medium text-white"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-amber-400 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
    </>
  )
}

export default Breadcrumb
