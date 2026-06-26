// src/app/admin/subscribers/page.tsx
// 订阅者列表 + CSV 导出

'use client'

import { useEffect, useState, useCallback } from 'react'
import { Users, Download } from 'lucide-react'
import { DataTable, DataTableSkeleton, type Column } from '@/components/admin/DataTable'
import { Pagination } from '@/components/admin/Pagination'
import { useAdminLocale } from '@/lib/i18n/useAdminLocale'
import type { SubscriberRecord, PaginatedResult } from '@/types'

export default function SubscribersPage() {
  const { t } = useAdminLocale()
  const [result, setResult] = useState<PaginatedResult<SubscriberRecord> | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchSubscribers = useCallback(() => {
    setLoading(true)
    fetch(`/api/admin/subscribers?page=${page}&pageSize=20`)
      .then((r) => r.json())
      .then((data) => setResult(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => { fetchSubscribers() }, [fetchSubscribers]) // eslint-disable-line react-hooks/set-state-in-effect

  const columns: Column<SubscriberRecord>[] = [
    { key: 'email', header: t('subscribers.colEmail') },
    { key: 'interests', header: t('subscribers.colInterests'), render: (r) => (
      <span className="text-xs text-stone-400">{r.interests.join(', ') || '—'}</span>
    )},
    { key: 'locale', header: t('subscribers.colLocale') },
    { key: 'subscribedAt', header: t('subscribers.colSubscribed'), render: (r) => <span className="text-xs text-stone-500">{new Date(r.subscribedAt).toLocaleDateString()}</span> },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-stone-100">{t('subscribers.title')}</h1>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- CSV download, not page navigation */}
        <a
          href="/api/admin/subscribers/export"
          className="inline-flex items-center gap-2 px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-lg text-stone-300 hover:bg-stone-800 transition-colors"
        >
          <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
          {t('subscribers.exportCsv')}
        </a>
      </div>

      {loading ? (
        <DataTableSkeleton columns={4} />
      ) : result ? (
        <>
          <DataTable
            columns={columns}
            data={result.data}
            keyField="id"
            emptyMessage={t('subscribers.empty')}
            emptyIcon={Users}
          />
          <Pagination page={result.page} totalPages={result.totalPages} onPageChange={setPage} />
        </>
      ) : null}
    </div>
  )
}
