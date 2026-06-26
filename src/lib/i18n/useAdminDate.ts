// src/lib/i18n/useAdminDate.ts
// Admin 日期格式化 hook — 跟随 Admin locale 设置

'use client'

import { useCallback } from 'react'
import { useAdminLocale } from './useAdminLocale'
import { BCP47_MAP } from './config'
import type { Locale } from './config'

/** 根据 admin locale 格式化日期 */
export function useAdminDate() {
  const { locale } = useAdminLocale()

  const formatDate = useCallback(
    (dateStr: string | Date): string => {
      const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
      return date.toLocaleDateString(BCP47_MAP[locale as Locale] || 'zh-CN')
    },
    [locale]
  )

  const formatDateTime = useCallback(
    (dateStr: string | Date): string => {
      const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
      return date.toLocaleString(BCP47_MAP[locale as Locale] || 'zh-CN')
    },
    [locale]
  )

  return { formatDate, formatDateTime }
}
