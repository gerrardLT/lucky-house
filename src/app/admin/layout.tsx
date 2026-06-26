// src/app/admin/layout.tsx
// Admin 布局 — 侧边栏 + 主内容区（无 locale 前缀）

import { AdminProviders } from '@/components/admin/AdminProviders'
import { AdminShell } from '@/components/admin/AdminShell'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className="bg-stone-950 text-stone-100 antialiased">
        <AdminProviders>
          <AdminShell>{children}</AdminShell>
        </AdminProviders>
      </body>
    </html>
  )
}
