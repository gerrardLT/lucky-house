// src/app/admin/bookings/[id]/page.tsx
// 预约详情 + 状态变更

'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Users, MapPin, PawPrint, Globe, CheckSquare, Loader2 } from 'lucide-react'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { InfoSection, InfoRow } from '@/components/admin/InfoSection'
import { ErrorToast } from '@/components/admin/ErrorToast'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { adminFetch } from '@/lib/admin/adminFetch'
import { useAdminLocale } from '@/lib/i18n/useAdminLocale'
import { useAdminDate } from '@/lib/i18n/useAdminDate'
import type { BookingRecord, BookingStatus } from '@/types'

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { t } = useAdminLocale()
  const { formatDateTime } = useAdminDate()
  const [booking, setBooking] = useState<BookingRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmStatus, setConfirmStatus] = useState<BookingStatus | null>(null)

  const fetchBooking = useCallback(() => {
    adminFetch(`/api/admin/bookings/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('HTTP_ERROR')
        return r.json()
      })
      .then((data) => setBooking(data))
      .catch(() => setError(t('common.errorLoad')))
      .finally(() => setLoading(false))
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchBooking()
  }, [fetchBooking])

  async function updateStatus(newStatus: BookingStatus) {
    setUpdating(true)
    setError(null)
    try {
      const res = await adminFetch(`/api/admin/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        const updated = await res.json()
        setBooking(updated)
      } else {
        setError(t('common.errorAction'))
      }
    } catch {
      setError(t('common.errorNetwork'))
    } finally {
      setUpdating(false)
      setConfirmStatus(null)
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

  const contact = booking.contact
  const petInfo = booking.petInfo
  const source = booking.source as { sourceUrl?: string; deviceType?: string; utmSource?: string; utmMedium?: string; utmCampaign?: string } | undefined
  const agreements = booking.agreements as { privacyPolicy?: boolean; petRules?: boolean; cancelPolicy?: boolean; marketingSubscribe?: boolean } | undefined
  const statusLabel: Record<BookingStatus, string> = {
    pending: t('bookings.pending'),
    confirmed: t('bookings.confirmed'),
    cancelled: t('bookings.cancelled'),
  }

  return (
    <div>
      <ErrorToast message={error} onClose={() => setError(null)} />

      {/* 确认状态变更弹窗 */}
      <ConfirmDialog
        open={confirmStatus !== null}
        title={t('common.confirmChangeStatus')}
        message={t('common.confirmChangeStatusMsg').replace('{status}', confirmStatus ? statusLabel[confirmStatus] : '')}
        confirmLabel={t('common.confirm')}
        cancelLabel={t('common.cancel')}
        variant={confirmStatus === 'cancelled' ? 'danger' : 'warning'}
        onConfirm={() => confirmStatus && updateStatus(confirmStatus)}
        onCancel={() => setConfirmStatus(null)}
      />

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
            {formatDateTime(booking.createdAt)}
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
          <InfoRow label={t('bookings.detail.acceptAlternative')} value={booking.acceptAlternative ? t('bookings.detail.yes') : t('bookings.detail.no')} />
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
            {booking.petCount != null && (
              <InfoRow label={t('bookings.detail.petCount')} value={String(booking.petCount)} />
            )}
          </InfoSection>
        )}

        {/* Source Info */}
        {source && (
          <InfoSection title={t('bookings.detail.source')} icon={Globe}>
            {source.sourceUrl && <InfoRow label={t('bookings.detail.sourceUrl')} value={source.sourceUrl} />}
            {source.deviceType && <InfoRow label={t('bookings.detail.deviceType')} value={source.deviceType} />}
          </InfoSection>
        )}

        {/* Agreements */}
        {agreements && (
          <InfoSection title={t('bookings.detail.agreements')} icon={CheckSquare}>
            <InfoRow label={t('bookings.detail.privacyPolicy')} value={agreements.privacyPolicy ? t('bookings.detail.yes') : t('bookings.detail.no')} />
            {agreements.petRules !== undefined && (
              <InfoRow label={t('bookings.detail.petRules')} value={agreements.petRules ? t('bookings.detail.yes') : t('bookings.detail.no')} />
            )}
            <InfoRow label={t('bookings.detail.cancelPolicy')} value={agreements.cancelPolicy ? t('bookings.detail.yes') : t('bookings.detail.no')} />
            <InfoRow label={t('bookings.detail.marketingSubscribe')} value={agreements.marketingSubscribe ? t('bookings.detail.yes') : t('bookings.detail.no')} />
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
                  onClick={() => !isActive && setConfirmStatus(s)}
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
