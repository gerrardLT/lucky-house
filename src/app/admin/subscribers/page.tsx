// src/app/admin/subscribers/page.tsx
// 订阅者列表 + CSV 导出

'use client'

import { useEffect, useState, useCallback } from 'react'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { Pagination } from '@/components/admin/Pagination'
import type { SubscriberRecord, PaginatedResult } from '@/types'

export default function SubscribersPage() {
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
    { key: 'email', header: 'Email' },
    { key: 'interests', header: 'Interests', render: (r) => (
      <span className="text-xs text-stone-400">{r.interests.join(', ') || '—'}</span>
    )},
    { key: 'locale', header: 'Locale' },
    { key: 'subscribedAt', header: 'Subscribed', render: (r) => new Date(r.subscribedAt).toLocaleDateString() },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-100">Subscribers</h1>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- CSV download, not page navigation */}
        <a
          href="/api/admin/subscribers/export"
          className="px-4 py-2 text-sm bg-stone-800 border border-stone-700 rounded-lg text-stone-300 hover:bg-stone-700 transition-colors"
        >
          Export CSV
        </a>
      </div>

      {loading ? (
        <p className="text-stone-500">Loading...</p>
      ) : result ? (
        <>
          <DataTable
            columns={columns}
            data={result.data}
            keyField="id"
            emptyMessage="No subscribers yet"
          />
          <Pagination page={result.page} totalPages={result.totalPages} onPageChange={setPage} />
        </>
      ) : null}
    </div>
  )
}
