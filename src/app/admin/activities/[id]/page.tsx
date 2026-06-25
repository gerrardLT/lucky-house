// src/app/admin/activities/[id]/page.tsx
// 活动兴趣详情

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { StatusBadge } from '@/components/admin/StatusBadge'
import type { ActivityInterestRecord } from '@/types'

export default function ActivityDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [record, setRecord] = useState<ActivityInterestRecord | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/activities/${id}`)
      .then((r) => r.json())
      .then((data) => setRecord(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="text-stone-500">Loading...</p>
  if (!record) return <p className="text-red-400">Record not found</p>

  return (
    <div>
      <button onClick={() => router.back()} className="text-sm text-stone-500 hover:text-stone-300 mb-4">← Back</button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-100">{record.id}</h1>
          <p className="text-sm text-stone-500 mt-1">{new Date(record.createdAt).toLocaleString()}</p>
        </div>
        <StatusBadge type="interest" status={record.type} />
      </div>

      <div className="bg-stone-800 border border-stone-700 rounded-xl p-6 space-y-4 max-w-2xl">
        <div className="flex justify-between"><span className="text-stone-500">Activity</span><span className="text-stone-200">{record.activitySlug}</span></div>
        <div className="flex justify-between"><span className="text-stone-500">Name</span><span className="text-stone-200">{record.name}</span></div>
        <div className="flex justify-between"><span className="text-stone-500">Email</span><span className="text-stone-200">{record.email}</span></div>
        {record.phone && <div className="flex justify-between"><span className="text-stone-500">Phone</span><span className="text-stone-200">{record.phone}</span></div>}
        <div className="flex justify-between"><span className="text-stone-500">Locale</span><span className="text-stone-200">{record.locale}</span></div>
        {record.message && (
          <div className="border-t border-stone-700 pt-4">
            <p className="text-stone-500 text-sm mb-2">Message</p>
            <p className="text-stone-200 whitespace-pre-wrap">{record.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
