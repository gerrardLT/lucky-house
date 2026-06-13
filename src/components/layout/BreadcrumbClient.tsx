'use client'

import { usePathname } from 'next/navigation'
import { Breadcrumb } from './Breadcrumb'
import type { Locale } from '@/lib/i18n/config'

interface BreadcrumbClientProps {
  locale: Locale
}

/**
 * 客户端 Breadcrumb 包装器
 * 使用 usePathname() 获取当前路径并传递给 Breadcrumb 服务端组件
 */
export function BreadcrumbClient({ locale }: BreadcrumbClientProps) {
  const pathname = usePathname()
  return <Breadcrumb locale={locale} pathname={pathname} />
}
