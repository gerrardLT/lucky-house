// src/app/api/admin/contacts/[id]/route.ts
// GET /api/admin/contacts/:id — 联系详情

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { db } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id)).limit(1)

    if (!contact) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(contact)
  } catch (error) {
    console.error('[Admin Contact Detail] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
