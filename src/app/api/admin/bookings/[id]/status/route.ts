// src/app/api/admin/bookings/[id]/status/route.ts
// PATCH /api/admin/bookings/:id/status — 更新预约状态

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { db } from '@/lib/db'
import { bookings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import type { BookingStatus } from '@/types'

const VALID_STATUSES: BookingStatus[] = ['pending', 'confirmed', 'cancelled']

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body as { status: string }

    if (!status || !VALID_STATUSES.includes(status as BookingStatus)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: pending, confirmed, or cancelled' },
        { status: 400 }
      )
    }

    const [updated] = await db
      .update(bookings)
      .set({ status: status as BookingStatus, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning()

    if (!updated) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[Admin Booking Status] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
