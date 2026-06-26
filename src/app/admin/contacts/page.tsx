// src/app/admin/contacts/page.tsx
// 联系列表 — 搜索 + 状态筛选 + 分页

'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Mail } from 'lucide-react'
import { DataTable, DataTableSkeleton, type Column } from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Pagination } from '@/components/admin/Pagination'
import { SearchInput } from '@/components/admin/SearchInput'
import { ErrorToast } from '@/components/admin/ErrorToast'
import { useAdminLocale } from '@/lib/i18n/useAdminLocale'
import type { ContactRecord, PaginatedResult } from '@/types'

export default function ContactsPage() {
  const router = useRouter()
  const { t } = useAdminLocale()
  const [result, setResult] = useState<PaginatedResult<ContactRecord> | null>(null)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContacts = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), pageSize: '20' })
    if (statusFilter) params.set('status', statusFilter)
    if (search) params.set('search', search)

    fetch(`/api/admin/contacts?${params}`)
      .then((r) => {
        if (!r.ok) throw new Error('HTTP_ERROR')
        return r.json()
      })
      .then((data) => setResult(data))
      .catch(() => setError(t('common.errorLoad')))
      .finally(() => setLoading(false))
  }, [page, statusFilter, search]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchContacts() }, [fetchContacts]) // eslint-disable-line react-hooks/set-state-in-effect

  const columns: Column<ContactRecord>[] = [
    { key: 'id', header: t('contacts.colTicket'), render: (r) => <span className="font-mono text-amber-500 text-xs">{r.id}</span> },
    { key: 'subject', header: t('contacts.colSubject') },
    { key: 'name', header: t('contacts.colName') },
    { key: 'email', header: t('contacts.colEmail'), render: (r) => <span className="text-xs">{r.email}</span> },
    { key: 'status', header: t('contacts.colStatus'), render: (r) => <StatusBadge type="contact" status={r.status} /> },
    { key: 'createdAt', header: t('contacts.colDate'), render: (r) => <span className="text-xs text-stone-500">{new Date(r.createdAt).toLocaleDateString()}</span> },
  ]

  return (
    <div>
      <ErrorToast message={error} onClose={() => setError(null)} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-xl font-semibold text-stone-100">{t('contacts.title')}</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SearchInput
            value={search}
            onChange={(v) => { setSearch(v); setPage(1) }}
            placeholder={t('common.search')}
          />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-lg text-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-colors"
          >
            <option value="">{t('contacts.allStatus')}</option>
            <option value="pending">{t('contacts.pending')}</option>
            <option value="resolved">{t('contacts.resolved')}</option>
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
            onRowClick={(row) => router.push(`/admin/contacts/${row.id}`)}
            emptyMessage={t('contacts.empty')}
            emptyIcon={Mail}
          />
          <Pagination page={result.page} totalPages={result.totalPages} onPageChange={setPage} />
        </>
      ) : null}
    </div>
  )
}
