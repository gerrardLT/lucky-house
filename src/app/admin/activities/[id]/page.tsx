// src/app/admin/activities/[id]/page.tsx
// 活动兴趣详情

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Compass, User, MessageSquare, Globe } from 'lucide-react'
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

  if (loading) {
    return (
      <div>
        <div className="h-4 w-16 bg-stone-800 rounded animate-pulse mb-6" />
        <div className="h-7 w-48 bg-stone-800 rounded animate-pulse mb-8" />
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-3.5 bg-stone-800/50 rounded animate-pulse mb-3" />
          ))}
        </div>
      </div>
    )
  }

  if (!record) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-red-400">Record not found</p>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-300 mb-5 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-stone-100 font-mono">{record.id}</h1>
          <p className="text-xs text-stone-500 mt-1">{new Date(record.createdAt).toLocaleString()}</p>
        </div>
        <StatusBadge type="interest" status={record.type} />
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3.5 max-w-2xl">
        {/* Activity info */}
        <div className="flex items-center gap-2 mb-1">
          <Compass className="w-4 h-4 text-stone-500" strokeWidth={1.5} />
          <span className="text-sm font-medium text-stone-200">Activity</span>
        </div>
        <InfoRow label="Activity" value={record.activitySlug} />

        {/* Contact info */}
        <div className="flex items-center gap-2 pt-2 mb-1">
          <User className="w-4 h-4 text-stone-500" strokeWidth={1.5} />
          <span className="text-sm font-medium text-stone-200">Contact</span>
        </div>
        <InfoRow label="Name" value={record.name} />
        <InfoRow label="Email" value={record.email} />
        {record.phone && <InfoRow label="Phone" value={record.phone} />}

        {/* Locale */}
        <div className="flex items-center gap-2 pt-2 mb-1">
          <Globe className="w-4 h-4 text-stone-500" strokeWidth={1.5} />
          <span className="text-sm font-medium text-stone-200">Locale</span>
        </div>
        <InfoRow label="Locale" value={record.locale} />

        {/* Message */}
        {record.message && (
          <div className="border-t border-stone-800 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-stone-500" strokeWidth={1.5} />
              <span className="text-sm font-medium text-stone-200">Message</span>
            </div>
            <p className="text-sm text-stone-300 whitespace-pre-wrap leading-relaxed pl-6">{record.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline pl-6">
      <span className="text-xs text-stone-500">{label}</span>
      <span className="text-xs text-stone-200 font-medium">{value}</span>
    </div>
  )
}
