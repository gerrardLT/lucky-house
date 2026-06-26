// src/components/admin/Pagination.tsx
'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAdminLocale } from '@/lib/i18n/useAdminLocale'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const { t } = useAdminLocale()

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between px-1 py-4">
      <p className="text-xs text-stone-500">
        {t('common.page').replace('{page}', String(page)).replace('{total}', String(totalPages))}
      </p>
      <div className="flex gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border border-stone-800 text-stone-400 hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          {t('common.prev')}
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border border-stone-800 text-stone-400 hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          {t('common.next')}
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
