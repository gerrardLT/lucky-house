// src/app/api/admin/activities/[id]/route.ts
// GET /api/admin/activities/:id — 活动兴趣详情
// DELETE /api/admin/activities/:id — 删除活动兴趣记录

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { db } from '@/lib/db'
import { activityInterests } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const [record] = await db
      .select()
      .from(activityInterests)
      .where(eq(activityInterests.id, id))
      .limit(1)

    if (!record) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(record)
  } catch (error) {
    console.error('[Admin Activity Detail] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const [deleted] = await db
      .delete(activityInterests)
      .where(eq(activityInterests.id, id))
      .returning()

    if (!deleted) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Admin Activity Delete] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
