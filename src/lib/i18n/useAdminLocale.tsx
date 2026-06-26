// src/lib/i18n/useAdminLocale.ts
// Admin 后台多语言切换 hook + Context Provider
// 使用 localStorage 存储语言偏好，默认 zh

'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { Locale } from './config'
import { DEFAULT_LOCALE, isValidLocale } from './config'
import { createTranslator } from './translate'

const ADMIN_LOCALE_KEY = 'admin-locale'

interface AdminLocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const AdminLocaleContext = createContext<AdminLocaleContextValue | null>(null)

/** 从 localStorage 读取已保存的语言偏好 */
function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  try {
    const stored = localStorage.getItem(ADMIN_LOCALE_KEY)
    if (stored && isValidLocale(stored)) return stored
  } catch {
    // ignore
  }
  return DEFAULT_LOCALE
}

export function AdminLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => getStoredLocale())
  const [mounted, setMounted] = useState(false)

  // SSR 时无法访问 localStorage，通过 lazy initializer 已在 useState 中处理
  useEffect(() => {
    setMounted(true)
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    try {
      localStorage.setItem(ADMIN_LOCALE_KEY, newLocale)
    } catch {
      // ignore
    }
  }, [])

  const t = useCallback(
    (key: string) => createTranslator(locale, 'admin')(key),
    [locale]
  )

  // SSR / 首次渲染使用默认语言，避免 hydration mismatch
  const displayLocale = mounted ? locale : DEFAULT_LOCALE
  const displayT = mounted ? t : (key: string) => createTranslator(DEFAULT_LOCALE, 'admin')(key)

  return (
    <AdminLocaleContext.Provider value={{ locale: displayLocale, setLocale, t: displayT }}>
      {children}
    </AdminLocaleContext.Provider>
  )
}

export function useAdminLocale() {
  const ctx = useContext(AdminLocaleContext)
  if (!ctx) {
    // 如果在 Provider 外使用（如 login 页），返回默认值
    const t = (key: string) => createTranslator(DEFAULT_LOCALE, 'admin')(key)
    return { locale: DEFAULT_LOCALE, setLocale: () => {}, t }
  }
  return ctx
}
