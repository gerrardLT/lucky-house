// src/app/api/admin/bookings/[id]/route.ts
// GET /api/admin/bookings/:id — 预约详情

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { db } from '@/lib/db'
import { bookings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1)

    if (!booking) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('[Admin Booking Detail] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
