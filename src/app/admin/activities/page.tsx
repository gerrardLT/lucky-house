// src/app/admin/activities/page.tsx
// 活动兴趣列表

'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Pagination } from '@/components/admin/Pagination'
import type { ActivityInterestRecord, PaginatedResult } from '@/types'

export default function ActivitiesPage() {
  const router = useRouter()
  const [result, setResult] = useState<PaginatedResult<ActivityInterestRecord> | null>(null)
  const [page, setPage] = useState(1)
  const [typeFilter, setTypeFilter] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchActivities = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), pageSize: '20' })
    if (typeFilter) params.set('type', typeFilter)

    fetch(`/api/admin/activities?${params}`)
      .then((r) => r.json())
      .then((data) => setResult(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page, typeFilter])

  useEffect(() => { fetchActivities() }, [fetchActivities]) // eslint-disable-line react-hooks/set-state-in-effect

  const columns: Column<ActivityInterestRecord>[] = [
    { key: 'id', header: 'ID', render: (r) => <span className="font-mono text-amber-400 text-xs">{r.id}</span> },
    { key: 'activitySlug', header: 'Activity' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'type', header: 'Type', render: (r) => <StatusBadge type="interest" status={r.type} /> },
    { key: 'createdAt', header: 'Date', render: (r) => new Date(r.createdAt).toLocaleDateString() },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-100">Activities</h1>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}
          className="px-3 py-2 text-sm bg-stone-800 border border-stone-700 rounded-lg text-stone-300"
        >
          <option value="">All Types</option>
          <option value="interest">Interest</option>
          <option value="register">Registered</option>
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
            onRowClick={(row) => router.push(`/admin/activities/${row.id}`)}
            emptyMessage="No activity registrations yet"
          />
          <Pagination page={result.page} totalPages={result.totalPages} onPageChange={setPage} />
        </>
      ) : null}
    </div>
  )
}
