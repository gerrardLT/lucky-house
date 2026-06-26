// src/app/admin/activities/page.tsx
// 活动兴趣列表 — 搜索 + 类型筛选 + 分页

'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Compass, RefreshCw, Trash2 } from 'lucide-react'
import { DataTable, DataTableSkeleton, type Column } from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Pagination } from '@/components/admin/Pagination'
import { SearchInput } from '@/components/admin/SearchInput'
import { ErrorToast } from '@/components/admin/ErrorToast'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { adminFetch } from '@/lib/admin/adminFetch'
import { useAdminLocale } from '@/lib/i18n/useAdminLocale'
import { useAdminDate } from '@/lib/i18n/useAdminDate'
import type { ActivityInterestRecord, PaginatedResult } from '@/types'

export default function ActivitiesPage() {
  const router = useRouter()
  const { t } = useAdminLocale()
  const { formatDate } = useAdminDate()
  const [result, setResult] = useState<PaginatedResult<ActivityInterestRecord> | null>(null)
  const [page, setPage] = useState(1)
  const [typeFilter, setTypeFilter] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())
  const [showBatchDelete, setShowBatchDelete] = useState(false)
  const [batchDeleting, setBatchDeleting] = useState(false)

  const fetchActivities = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), pageSize: '20' })
    if (typeFilter) params.set('type', typeFilter)
    if (search) params.set('search', search)

    adminFetch(`/api/admin/activities?${params}`)
      .then((r) => {
        if (!r.ok) throw new Error('HTTP_ERROR')
        return r.json()
      })
      .then((data) => setResult(data))
      .catch(() => setError(t('common.errorLoad')))
      .finally(() => { setLoading(false); setRefreshing(false) })
  }, [page, typeFilter, search, t])

  useEffect(() => { fetchActivities() }, [fetchActivities]) // eslint-disable-line react-hooks/set-state-in-effect

  const columns: Column<ActivityInterestRecord>[] = [
    { key: 'id', header: t('activities.colId'), render: (r) => <span className="font-mono text-amber-500 text-xs">{r.id}</span> },
    { key: 'activitySlug', header: t('activities.colActivity') },
    { key: 'name', header: t('activities.colName') },
    { key: 'email', header: t('activities.colEmail'), render: (r) => <span className="text-xs">{r.email}</span> },
    { key: 'type', header: t('activities.colType'), render: (r) => <StatusBadge type="interest" status={r.type} /> },
    { key: 'createdAt', header: t('activities.colDate'), render: (r) => <span className="text-xs text-stone-500">{formatDate(r.createdAt)}</span> },
  ]

  return (
    <div>
      <ErrorToast message={error} onClose={() => setError(null)} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-xl font-semibold text-stone-100">{t('activities.title')}</h1>
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
            onClick={() => { setRefreshing(true); fetchActivities() }}
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
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}
            className="px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-lg text-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-colors"
          >
            <option value="">{t('activities.allTypes')}</option>
            <option value="interest">{t('activities.interest')}</option>
            <option value="register">{t('activities.register')}</option>
          </select>
        </div>
      </div>

      {loading ? (
        <DataTableSkeleton columns={6} />
      ) : result ? (
        <>
          <DataTable
            columns={columns}
            data={result.data}
            keyField="id"
            onRowClick={(row) => router.push(`/admin/activities/${row.id}`)}
            emptyMessage={t('activities.empty')}
            emptyIcon={Compass}
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
                adminFetch(`/api/admin/activities/${id}`, { method: 'DELETE' })
              )
            )
            setSelectedKeys(new Set())
            setShowBatchDelete(false)
            fetchActivities()
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
