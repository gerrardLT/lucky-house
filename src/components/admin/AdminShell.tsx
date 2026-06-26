// src/components/admin/AdminShell.tsx
// Admin 布局外壳 — 登录页不显示侧边栏/语言切换器

'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useAdminLocale } from '@/lib/i18n/useAdminLocale'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === '/admin/login'
  const { locale } = useAdminLocale()

  // 动态更新 <html lang="..."> 属性
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  if (isLogin) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="flex justify-end px-4 pt-4 lg:px-8 lg:pt-6">
          <LanguageSwitcher />
        </div>
        <div className="px-4 pb-6 pt-2 lg:px-8 lg:pb-8 lg:pt-0">{children}</div>
      </main>
    </div>
  )
}
