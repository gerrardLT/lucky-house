// src/app/admin/subscribers/page.tsx
// 订阅者列表 + 搜索 + CSV 导出

'use client'

import { useEffect, useState, useCallback } from 'react'
import { Users, Download, RefreshCw, Trash2 } from 'lucide-react'
import { DataTable, DataTableSkeleton, type Column } from '@/components/admin/DataTable'
import { Pagination } from '@/components/admin/Pagination'
import { SearchInput } from '@/components/admin/SearchInput'
import { ErrorToast } from '@/components/admin/ErrorToast'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { adminFetch } from '@/lib/admin/adminFetch'
import { useAdminLocale } from '@/lib/i18n/useAdminLocale'
import { useAdminDate } from '@/lib/i18n/useAdminDate'
import type { SubscriberRecord, PaginatedResult } from '@/types'

export default function SubscribersPage() {
  const { t } = useAdminLocale()
  const { formatDate } = useAdminDate()
  const [result, setResult] = useState<PaginatedResult<SubscriberRecord> | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())
  const [showBatchDelete, setShowBatchDelete] = useState(false)
  const [batchDeleting, setBatchDeleting] = useState(false)

  const fetchSubscribers = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), pageSize: '20' })
    if (search) params.set('search', search)

    adminFetch(`/api/admin/subscribers?${params}`)
      .then((r) => {
        if (!r.ok) throw new Error('HTTP_ERROR')
        return r.json()
      })
      .then((data) => setResult(data))
      .catch(() => setError(t('common.errorLoad')))
      .finally(() => { setLoading(false); setRefreshing(false) })
  }, [page, search, t])

  useEffect(() => { fetchSubscribers() }, [fetchSubscribers]) // eslint-disable-line react-hooks/set-state-in-effect

  const columns: Column<SubscriberRecord>[] = [
    { key: 'email', header: t('subscribers.colEmail') },
    { key: 'interests', header: t('subscribers.colInterests'), render: (r) => (
      <span className="text-xs text-stone-400">{r.interests.join(', ') || '—'}</span>
    )},
    { key: 'locale', header: t('subscribers.colLocale') },
    { key: 'subscribedAt', header: t('subscribers.colSubscribed'), render: (r) => <span className="text-xs text-stone-500">{formatDate(r.subscribedAt)}</span> },
  ]

  return (
    <div>
      <ErrorToast message={error} onClose={() => setError(null)} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-xl font-semibold text-stone-100">{t('subscribers.title')}</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {selectedKeys.size > 0 && (
            <>
              <span className="text-xs text-stone-400">{t('common.selectedCount').replace('{count}', String(selectedKeys.size))}</span>
              <button
                onClick={() => setShowBatchDelete(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs bg-red-950/50 border border-red-900/50 rounded-lg text-red-400 hover:bg-red-950 transition-colors shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                {t('common.batchDelete')}
              </button>
            </>
          )}
          <button
            onClick={() => { setRefreshing(true); fetchSubscribers() }}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-lg text-stone-300 hover:bg-stone-800 transition-colors shrink-0 disabled:opacity-50"
            title={t('common.refresh')}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} strokeWidth={1.5} />
          </button>
          <SearchInput
            value={search}
            onChange={(v) => { setSearch(v); setPage(1) }}
            placeholder={t('common.search')}
          />
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- CSV download, not page navigation */}
          <a
            href="/api/admin/subscribers/export"
            className="inline-flex items-center gap-2 px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-lg text-stone-300 hover:bg-stone-800 transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
            {t('subscribers.exportCsv')}
          </a>
        </div>
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
            selectable
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          />
          <Pagination page={result.page} totalPages={result.totalPages} onPageChange={setPage} />
        </>
      ) : null}

      <ConfirmDialog
        open={showBatchDelete}
        title={t('common.confirmDelete')}
        message={t('common.batchDeleteConfirm').replace('{count}', String(selectedKeys.size))}
        confirmLabel={batchDeleting ? t('common.batchDeleting') : t('common.delete')}
        variant="danger"
        onConfirm={async () => {
          setBatchDeleting(true)
          try {
            await Promise.all(
              Array.from(selectedKeys).map((id) =>
                adminFetch(`/api/admin/subscribers/${id}`, { method: 'DELETE' })
              )
            )
            setSelectedKeys(new Set())
            setShowBatchDelete(false)
            fetchSubscribers()
          } catch {
            setError(t('common.errorAction'))
          } finally {
            setBatchDeleting(false)
          }
        }}
        onCancel={() => setShowBatchDelete(false)}
      />
    </div>
  )
}
