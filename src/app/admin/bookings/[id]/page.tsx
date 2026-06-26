// src/app/admin/bookings/[id]/page.tsx
// 预约详情 + 状态变更

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Users, MapPin, PawPrint, Loader2 } from 'lucide-react'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { useAdminLocale } from '@/lib/i18n/useAdminLocale'
import type { BookingRecord, BookingStatus } from '@/types'

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { t } = useAdminLocale()
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

  if (loading) {
    return (
      <div>
        <div className="h-4 w-16 bg-stone-800 rounded animate-pulse mb-6" />
        <div className="h-7 w-48 bg-stone-800 rounded animate-pulse mb-2" />
        <div className="h-4 w-32 bg-stone-800 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-stone-900 border border-stone-800 rounded-xl p-5">
              <div className="h-4 w-24 bg-stone-800 rounded animate-pulse mb-4" />
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="h-3.5 bg-stone-800/50 rounded animate-pulse mb-3" />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-red-400">{t('bookings.detail.notFound')}</p>
      </div>
    )
  }

  const contact = booking.contact as unknown as Record<string, string>
  const petInfo = booking.petInfo as Record<string, unknown> | null

  return (
    <div>
      {/* Back nav */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-300 mb-5 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {t('bookings.detail.back')}
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-stone-100 font-mono">{booking.id}</h1>
          <p className="text-xs text-stone-500 mt-1">
            {new Date(booking.createdAt).toLocaleString()}
          </p>
        </div>
        <StatusBadge type="booking" status={booking.status} />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Booking Details */}
        <InfoSection title={t('bookings.detail.bookingDetails')} icon={Calendar}>
          <InfoRow label={t('bookings.detail.checkIn')} value={booking.checkIn} />
          <InfoRow label={t('bookings.detail.checkOut')} value={booking.checkOut} />
          <InfoRow label={t('bookings.detail.adults')} value={String(booking.adults)} />
          <InfoRow label={t('bookings.detail.children')} value={String(booking.children)} />
          <InfoRow label={t('bookings.detail.rooms')} value={String(booking.rooms)} />
          <InfoRow label={t('bookings.detail.roomPreference')} value={booking.roomPreference} />
        </InfoSection>

        {/* Contact */}
        <InfoSection title={t('bookings.detail.contact')} icon={Users}>
          <InfoRow label={t('bookings.detail.name')} value={contact?.name || ''} />
          <InfoRow label={t('bookings.detail.email')} value={contact?.email || ''} />
          <InfoRow label={t('bookings.detail.phone')} value={contact?.phone || ''} />
          <InfoRow label={t('bookings.detail.country')} value={contact?.country || ''} />
        </InfoSection>

        {/* Pet Info */}
        {booking.hasPet && petInfo && (
          <InfoSection title={t('bookings.detail.petInfo')} icon={PawPrint}>
            <InfoRow label={t('bookings.detail.petType')} value={String(petInfo.petType || '')} />
            <InfoRow label={t('bookings.detail.breed')} value={String(petInfo.breed || '')} />
            <InfoRow label={t('bookings.detail.weight')} value={`${petInfo.weight} ${t('bookings.detail.weightUnit')}`} />
            <InfoRow label={t('bookings.detail.age')} value={`${petInfo.age} ${t('bookings.detail.ageUnit')}`} />
          </InfoSection>
        )}

        {/* Actions */}
        <InfoSection title={t('bookings.detail.statusActions')} icon={MapPin}>
          <div className="flex gap-2 mt-1">
            {(['pending', 'confirmed', 'cancelled'] as BookingStatus[]).map((s) => {
              const isActive = booking.status === s
              return (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={updating || isActive}
                  className={`flex-1 px-3 py-2 text-xs rounded-lg border transition-colors ${
                    isActive
                      ? 'border-amber-600/50 bg-amber-600/10 text-amber-500 font-medium'
                      : 'border-stone-800 text-stone-500 hover:bg-stone-800 hover:text-stone-300'
                  } disabled:opacity-50`}
                >
                  {updating && !isActive ? (
                    <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                  ) : (
                    t(`bookings.${s}`)
                  )}
                </button>
              )
            })}
          </div>
        </InfoSection>
      </div>
    </div>
  )
}

function InfoSection({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  children: React.ReactNode
}) {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-stone-500" strokeWidth={1.5} />
        <h2 className="text-sm font-medium text-stone-200">{title}</h2>
      </div>
      <div className="space-y-2.5">{children}</div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-xs text-stone-500">{label}</span>
      <span className="text-xs text-stone-200 font-medium">{value}</span>
    </div>
  )
}
