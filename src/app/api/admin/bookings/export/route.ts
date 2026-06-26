// src/app/api/admin/bookings/export/route.ts
// GET /api/admin/bookings/export — 预约 CSV 导出

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { db } from '@/lib/db'
import { bookings } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { MAX_EXPORT_ROWS, toCsvRow, csvResponse } from '@/lib/csv-utils'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.createdAt))
      .limit(MAX_EXPORT_ROWS)

    const header = 'id,checkIn,checkOut,adults,children,rooms,hasPet,petCount,roomPreference,acceptAlternative,contactName,contactEmail,contactPhone,status,createdAt'
    const rows = data.map((b) => {
      const contact = (b.contact as Record<string, string>) || {}
      return toCsvRow([
        b.id,
        b.checkIn,
        b.checkOut,
        String(b.adults),
        String(b.children),
        String(b.rooms),
        String(b.hasPet),
        String(b.petCount ?? ''),
        b.roomPreference,
        String(b.acceptAlternative),
        contact.name ?? '',
        contact.email ?? '',
        contact.phone ?? '',
        b.status,
        b.createdAt.toISOString(),
      ])
    })
    const csv = [header, ...rows].join('\n')

    return csvResponse(csv, `bookings-${new Date().toISOString().slice(0, 10)}.csv`)
  } catch (error) {
    console.error('[Admin Bookings Export] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
