// src/app/api/admin/subscribers/export/route.ts
// GET /api/admin/subscribers/export — CSV 导出

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { db } from '@/lib/db'
import { subscribers } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { MAX_EXPORT_ROWS, toCsvRow, csvResponse } from '@/lib/csv-utils'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await db
      .select()
      .from(subscribers)
      .orderBy(desc(subscribers.subscribedAt))
      .limit(MAX_EXPORT_ROWS)

    const header = 'id,email,interests,locale,subscribedAt'
    const rows = data.map((s) =>
      toCsvRow([s.id, s.email, s.interests.join('|'), s.locale, s.subscribedAt.toISOString()])
    )
    const csv = [header, ...rows].join('\n')

    return csvResponse(csv, `subscribers-${new Date().toISOString().slice(0, 10)}.csv`)
  } catch (error) {
    console.error('[Admin Subscribers Export] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
