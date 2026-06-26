// src/components/admin/AdminProviders.tsx
// Admin 客户端 Providers — SessionProvider + AdminLocaleProvider

'use client'

import { SessionProvider } from 'next-auth/react'
import { AdminLocaleProvider } from '@/lib/i18n/useAdminLocale'

export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminLocaleProvider>
        {children}
      </AdminLocaleProvider>
    </SessionProvider>
  )
}
