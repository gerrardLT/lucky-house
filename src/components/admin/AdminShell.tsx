// src/components/admin/AdminShell.tsx
// Admin 布局外壳 — 登录页不显示侧边栏/语言切换器

'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { LanguageSwitcher } from './LanguageSwitcher'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === '/admin/login'

  if (isLogin) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="flex justify-end px-6 pt-4 lg:px-8 lg:pt-6">
          <LanguageSwitcher />
        </div>
        <div className="px-6 pb-6 lg:px-8 lg:pb-8">{children}</div>
      </main>
    </div>
  )
}
