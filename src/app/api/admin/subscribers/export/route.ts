// src/app/api/admin/subscribers/export/route.ts
// GET /api/admin/subscribers/export — CSV 导出

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { db } from '@/lib/db'
import { subscribers } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await db
      .select()
      .from(subscribers)
      .orderBy(desc(subscribers.subscribedAt))

    const header = 'id,email,interests,locale,subscribedAt'
    const rows = data.map((s) =>
      [
        s.id,
        s.email,
        `"${s.interests.join('|')}"`,
        s.locale,
        s.subscribedAt.toISOString(),
      ].join(',')
    )
    const csv = [header, ...rows].join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    })
  } catch (error) {
    console.error('[Admin Subscribers Export] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
