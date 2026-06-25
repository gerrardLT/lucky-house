// src/app/api/admin/stats/route.ts
// GET /api/admin/stats — 仪表盘统计数据

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { db } from '@/lib/db'
import { bookings, contacts, subscribers, activityInterests } from '@/lib/db/schema'
import { sql, desc } from 'drizzle-orm'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const [bookingStats] = await db
      .select({
        total: sql<number>`count(*)::int`,
        pending: sql<number>`count(*) filter (where status = 'pending')::int`,
        confirmed: sql<number>`count(*) filter (where status = 'confirmed')::int`,
        cancelled: sql<number>`count(*) filter (where status = 'cancelled')::int`,
      })
      .from(bookings)

    const [contactStats] = await db
      .select({
        total: sql<number>`count(*)::int`,
        pending: sql<number>`count(*) filter (where status = 'pending')::int`,
      })
      .from(contacts)

    const [subscriberStats] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(subscribers)

    const [activityStats] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(activityInterests)

    const recentBookings = await db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.createdAt))
      .limit(5)

    return NextResponse.json({
      totalBookings: bookingStats.total,
      pendingBookings: bookingStats.pending,
      confirmedBookings: bookingStats.confirmed,
      cancelledBookings: bookingStats.cancelled,
      totalContacts: contactStats.total,
      pendingContacts: contactStats.pending,
      totalSubscribers: subscriberStats.total,
      totalActivityInterests: activityStats.total,
      recentBookings,
    })
  } catch (error) {
    console.error('[Admin Stats] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
