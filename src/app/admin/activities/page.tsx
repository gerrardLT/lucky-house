// src/app/admin/activities/page.tsx
// 活动兴趣列表

'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Compass } from 'lucide-react'
import { DataTable, DataTableSkeleton, type Column } from '@/components/admin/DataTable'
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
    { key: 'id', header: 'ID', render: (r) => <span className="font-mono text-amber-500 text-xs">{r.id}</span> },
    { key: 'activitySlug', header: 'Activity' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email', render: (r) => <span className="text-xs">{r.email}</span> },
    { key: 'type', header: 'Type', render: (r) => <StatusBadge type="interest" status={r.type} /> },
    { key: 'createdAt', header: 'Date', render: (r) => <span className="text-xs text-stone-500">{new Date(r.createdAt).toLocaleDateString()}</span> },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-stone-100">Activities</h1>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}
          className="px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-lg text-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-colors"
        >
          <option value="">All Types</option>
          <option value="interest">Interest</option>
          <option value="register">Registered</option>
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
            onRowClick={(row) => router.push(`/admin/activities/${row.id}`)}
            emptyMessage="No activity registrations yet"
            emptyIcon={Compass}
          />
          <Pagination page={result.page} totalPages={result.totalPages} onPageChange={setPage} />
        </>
      ) : null}
    </div>
  )
}
