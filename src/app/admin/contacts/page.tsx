// src/app/admin/contacts/page.tsx
// 联系列表

'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Mail } from 'lucide-react'
import { DataTable, DataTableSkeleton, type Column } from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Pagination } from '@/components/admin/Pagination'
import { useAdminLocale } from '@/lib/i18n/useAdminLocale'
import type { ContactRecord, PaginatedResult } from '@/types'

export default function ContactsPage() {
  const router = useRouter()
  const { t } = useAdminLocale()
  const [result, setResult] = useState<PaginatedResult<ContactRecord> | null>(null)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchContacts = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), pageSize: '20' })
    if (statusFilter) params.set('status', statusFilter)

    fetch(`/api/admin/contacts?${params}`)
      .then((r) => r.json())
      .then((data) => setResult(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page, statusFilter])

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-stone-100">{t('contacts.title')}</h1>
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
