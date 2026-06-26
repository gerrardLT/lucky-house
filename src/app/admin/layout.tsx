// src/app/admin/layout.tsx
// Admin 布局 — 侧边栏 + 主内容区（无 locale 前缀）

import { AdminLocaleProvider } from '@/lib/i18n/useAdminLocale'
import { Sidebar } from '@/components/admin/Sidebar'
import { LanguageSwitcher } from '@/components/admin/LanguageSwitcher'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className="bg-stone-950 text-stone-100 antialiased">
        <AdminLocaleProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto">
              <div className="flex justify-end px-6 pt-4 lg:px-8 lg:pt-6">
                <LanguageSwitcher />
              </div>
              <div className="px-6 pb-6 lg:px-8 lg:pb-8">{children}</div>
            </main>
          </div>
        </AdminLocaleProvider>
      </body>
    </html>
  )
}
