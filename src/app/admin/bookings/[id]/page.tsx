// src/app/admin/bookings/[id]/page.tsx
// 预约详情 + 状态变更

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { StatusBadge } from '@/components/admin/StatusBadge'
import type { BookingRecord, BookingStatus } from '@/types'

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [booking, setBooking] = useState<BookingRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/bookings/${id}`)
      .then((r) => r.json())
      .then((data) => setBooking(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  async function updateStatus(newStatus: BookingStatus) {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        const updated = await res.json()
        setBooking(updated)
      }
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <p className="text-stone-500">Loading...</p>
  if (!booking) return <p className="text-red-400">Booking not found</p>

  const contact = booking.contact as unknown as Record<string, string>
  const petInfo = booking.petInfo as Record<string, unknown> | null

  return (
    <div>
      <button onClick={() => router.back()} className="text-sm text-stone-500 hover:text-stone-300 mb-4">
        ← Back
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-100">{booking.id}</h1>
          <p className="text-sm text-stone-500 mt-1">
            Created: {new Date(booking.createdAt).toLocaleString()}
          </p>
        </div>
        <StatusBadge type="booking" status={booking.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InfoSection title="Booking Details">
          <InfoRow label="Check-in" value={booking.checkIn} />
          <InfoRow label="Check-out" value={booking.checkOut} />
          <InfoRow label="Adults" value={String(booking.adults)} />
          <InfoRow label="Children" value={String(booking.children)} />
          <InfoRow label="Rooms" value={String(booking.rooms)} />
          <InfoRow label="Room Preference" value={booking.roomPreference} />
        </InfoSection>

        <InfoSection title="Contact">
          <InfoRow label="Name" value={contact?.name || ''} />
          <InfoRow label="Email" value={contact?.email || ''} />
          <InfoRow label="Phone" value={contact?.phone || ''} />
          <InfoRow label="Country" value={contact?.country || ''} />
        </InfoSection>

        {booking.hasPet && petInfo && (
          <InfoSection title="Pet Info">
            <InfoRow label="Type" value={String(petInfo.petType || '')} />
            <InfoRow label="Breed" value={String(petInfo.breed || '')} />
            <InfoRow label="Weight" value={`${petInfo.weight} kg`} />
            <InfoRow label="Age" value={`${petInfo.age} years`} />
          </InfoSection>
        )}

        <InfoSection title="Actions">
          <div className="flex gap-2 mt-2">
            {(['pending', 'confirmed', 'cancelled'] as BookingStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                disabled={updating || booking.status === s}
                className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                  booking.status === s
                    ? 'border-amber-500 bg-amber-900/30 text-amber-400'
                    : 'border-stone-700 text-stone-400 hover:bg-stone-800'
                } disabled:opacity-50`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </InfoSection>
      </div>
    </div>
  )
}

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-stone-800 border border-stone-700 rounded-xl p-6">
      <h2 className="text-lg font-medium text-stone-200 mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-stone-500">{label}</span>
      <span className="text-sm text-stone-200">{value}</span>
    </div>
  )
}
