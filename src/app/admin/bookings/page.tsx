// src/app/admin/bookings/page.tsx
// 预约列表 — 表格 + 状态筛选 + 搜索 + 分页

'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays } from 'lucide-react'
import { DataTable, DataTableSkeleton, type Column } from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Pagination } from '@/components/admin/Pagination'
import { SearchInput } from '@/components/admin/SearchInput'
import { ErrorToast } from '@/components/admin/ErrorToast'
import { useAdminLocale } from '@/lib/i18n/useAdminLocale'
import type { BookingRecord, PaginatedResult } from '@/types'

export default function BookingsPage() {
  const router = useRouter()
  const { t } = useAdminLocale()
  const [result, setResult] = useState<PaginatedResult<BookingRecord> | null>(null)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), pageSize: '20' })
    if (statusFilter) params.set('status', statusFilter)
    if (search) params.set('search', search)

    fetch(`/api/admin/bookings?${params}`)
      .then((r) => {
        if (!r.ok) throw new Error('HTTP_ERROR')
        return r.json()
      })
      .then((data) => setResult(data))
      .catch(() => setError(t('common.errorLoad')))
      .finally(() => setLoading(false))
  }, [page, statusFilter, search]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchBookings() }, [fetchBookings]) // eslint-disable-line react-hooks/set-state-in-effect

  const columns: Column<BookingRecord>[] = [
    { key: 'id', header: t('bookings.colId'), render: (r) => <span className="font-mono text-amber-500 text-xs">{r.id}</span> },
    { key: 'checkIn', header: t('bookings.colCheckIn') },
    { key: 'checkOut', header: t('bookings.colCheckOut') },
    { key: 'adults', header: t('bookings.colGuests'), render: (r) => <span className="text-xs">{r.adults}A + {r.children}C</span> },
    { key: 'status', header: t('bookings.colStatus'), render: (r) => <StatusBadge type="booking" status={r.status} /> },
    {
      key: 'createdAt',
      header: t('bookings.colDate'),
      render: (r) => <span className="text-xs text-stone-500">{new Date(r.createdAt).toLocaleDateString()}</span>,
    },
  ]

  return (
    <div>
      <ErrorToast message={error} onClose={() => setError(null)} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-xl font-semibold text-stone-100">{t('bookings.title')}</h1>
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
            <option value="">{t('bookings.allStatus')}</option>
            <option value="pending">{t('bookings.pending')}</option>
            <option value="confirmed">{t('bookings.confirmed')}</option>
            <option value="cancelled">{t('bookings.cancelled')}</option>
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
            onRowClick={(row) => router.push(`/admin/bookings/${row.id}`)}
            emptyMessage={t('bookings.empty')}
            emptyIcon={CalendarDays}
          />
          <Pagination page={result.page} totalPages={result.totalPages} onPageChange={setPage} />
        </>
      ) : null}
    </div>
  )
}
