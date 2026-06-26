// src/app/api/admin/contacts/export/route.ts
// GET /api/admin/contacts/export — 联系工单 CSV 导出

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { db } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { MAX_EXPORT_ROWS, toCsvRow, csvResponse } from '@/lib/csv-utils'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await db
      .select()
      .from(contacts)
      .orderBy(desc(contacts.createdAt))
      .limit(MAX_EXPORT_ROWS)

    const header = 'id,subject,name,email,phone,message,locale,routedTo,status,createdAt'
    const rows = data.map((c) =>
      toCsvRow([
        c.id,
        c.subject,
        c.name,
        c.email,
        c.phone ?? '',
        c.message,
        c.locale,
        c.routedTo,
        c.status,
        c.createdAt.toISOString(),
      ])
    )
    const csv = [header, ...rows].join('\n')

    return csvResponse(csv, `contacts-${new Date().toISOString().slice(0, 10)}.csv`)
  } catch (error) {
    console.error('[Admin Contacts Export] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
