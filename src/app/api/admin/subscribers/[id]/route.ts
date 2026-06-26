// src/app/api/admin/subscribers/[id]/route.ts
// DELETE /api/admin/subscribers/:id — 删除订阅者

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { db } from '@/lib/db'
import { subscribers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const [deleted] = await db.delete(subscribers).where(eq(subscribers.id, id)).returning()

    if (!deleted) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Admin Subscriber Delete] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
