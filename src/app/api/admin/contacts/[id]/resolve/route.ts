// src/app/api/admin/contacts/[id]/resolve/route.ts
// PATCH /api/admin/contacts/:id/resolve — 标记联系工单已解决

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { db } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const [updated] = await db
      .update(contacts)
      .set({ status: 'resolved' })
      .where(eq(contacts.id, id))
      .returning()

    if (!updated) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[Admin Contact Resolve] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
