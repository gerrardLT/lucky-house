// src/app/api/admin/contacts/[id]/resolve/route.ts
// PATCH /api/admin/contacts/:id/resolve — 切换联系工单状态 (pending ↔ resolved)

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { db } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const { status } = body as { status?: string }

    // 支持双向切换：传入 'pending' 或 'resolved'，否则默认 resolved
    const newStatus: 'pending' | 'resolved' =
      status === 'pending' ? 'pending' : 'resolved'

    const [updated] = await db
      .update(contacts)
      .set({ status: newStatus })
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
