// src/app/admin/bookings/page.tsx
// 预约列表 — 表格 + 状态筛选 + 分页

'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Pagination } from '@/components/admin/Pagination'
import type { BookingRecord, PaginatedResult } from '@/types'

export default function BookingsPage() {
  const router = useRouter()
  const [result, setResult] = useState<PaginatedResult<BookingRecord> | null>(null)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchBookings = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), pageSize: '20' })
    if (statusFilter) params.set('status', statusFilter)

    fetch(`/api/admin/bookings?${params}`)
      .then((r) => r.json())
      .then((data) => setResult(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page, statusFilter])

  useEffect(() => { fetchBookings() }, [fetchBookings]) // eslint-disable-line react-hooks/set-state-in-effect

  const columns: Column<BookingRecord>[] = [
    { key: 'id', header: 'ID', render: (r) => <span className="font-mono text-amber-400 text-xs">{r.id}</span> },
    { key: 'checkIn', header: 'Check-in' },
    { key: 'checkOut', header: 'Check-out' },
    { key: 'adults', header: 'Guests', render: (r) => `${r.adults}+${r.children}` },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge type="booking" status={r.status} /> },
    {
      key: 'createdAt',
      header: 'Date',
      render: (r) => new Date(r.createdAt).toLocaleDateString(),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-100">Bookings</h1>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="px-3 py-2 text-sm bg-stone-800 border border-stone-700 rounded-lg text-stone-300"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <p className="text-stone-500">Loading...</p>
      ) : result ? (
        <>
          <DataTable
            columns={columns}
            data={result.data}
            keyField="id"
            onRowClick={(row) => router.push(`/admin/bookings/${row.id}`)}
            emptyMessage="No bookings found"
          />
          <Pagination page={result.page} totalPages={result.totalPages} onPageChange={setPage} />
        </>
      ) : null}
    </div>
  )
}
