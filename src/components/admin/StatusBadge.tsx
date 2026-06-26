// src/components/admin/StatusBadge.tsx
'use client'

import { Badge, type BadgeProps } from '@/components/ui/Badge'
import { useAdminLocale } from '@/lib/i18n/useAdminLocale'
import type { BookingStatus, ContactStatus, InterestType } from '@/types'

interface StatusBadgeProps {
  type: 'booking' | 'contact' | 'interest'
  status: string
}

export function StatusBadge({ type, status }: StatusBadgeProps) {
  const { t } = useAdminLocale()

  let label = status
  let variant: BadgeProps['variant'] = 'normal'

  if (type === 'booking') {
    const s = status as BookingStatus
    if (s === 'pending') { label = t('bookings.pending'); variant = 'pending' }
    else if (s === 'confirmed') { label = t('bookings.confirmed'); variant = 'confirmed' }
    else if (s === 'cancelled') { label = t('bookings.cancelled'); variant = 'cancelled' }
  } else if (type === 'contact') {
    const s = status as ContactStatus
    if (s === 'pending') { label = t('contacts.pending'); variant = 'pending' }
    else if (s === 'resolved') { label = t('contacts.resolved'); variant = 'resolved' }
  } else if (type === 'interest') {
    const s = status as InterestType
    if (s === 'interest') { label = t('activities.interest'); variant = 'pending' }
    else if (s === 'register') { label = t('activities.register'); variant = 'confirmed' }
  }

  return <Badge variant={variant}>{label}</Badge>
}
