// src/components/admin/StatusBadge.tsx

import { Badge } from '@/components/ui/Badge'
import type { BookingStatus, ContactStatus, InterestType } from '@/types'

const bookingStatusMap: Record<BookingStatus, { label: string; variant: 'pending' | 'confirmed' | 'cancelled' }> = {
  pending: { label: 'Pending', variant: 'pending' },
  confirmed: { label: 'Confirmed', variant: 'confirmed' },
  cancelled: { label: 'Cancelled', variant: 'cancelled' },
}

const contactStatusMap: Record<ContactStatus, { label: string; variant: 'pending' | 'resolved' }> = {
  pending: { label: 'Pending', variant: 'pending' },
  resolved: { label: 'Resolved', variant: 'resolved' },
}

const interestTypeMap: Record<InterestType, { label: string; variant: 'pending' | 'confirmed' }> = {
  interest: { label: 'Interest', variant: 'pending' },
  register: { label: 'Registered', variant: 'confirmed' },
}

interface StatusBadgeProps {
  type: 'booking' | 'contact' | 'interest'
  status: string
}

export function StatusBadge({ type, status }: StatusBadgeProps) {
  const config =
    type === 'booking' ? bookingStatusMap[status as BookingStatus] :
    type === 'contact' ? contactStatusMap[status as ContactStatus] :
    interestTypeMap[status as InterestType]

  if (!config) return <Badge variant="normal">{status}</Badge>

  return <Badge variant={config.variant}>{config.label}</Badge>
}
