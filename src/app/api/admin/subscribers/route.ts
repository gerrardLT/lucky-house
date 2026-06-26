// src/app/api/admin/subscribers/route.ts
// GET /api/admin/subscribers — 订阅者列表（分页）

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { db } from '@/lib/db'
import { subscribers } from '@/lib/db/schema'
import { sql, desc, ilike } from 'drizzle-orm'

export async function GET(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '20')))
    const search = searchParams.get('search')

    const where = search ? ilike(subscribers.email, `%${search}%`) : undefined

    const [totalResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(subscribers)
      .where(where)

    const total = totalResult?.count ?? 0
    const data = await db
      .select()
      .from(subscribers)
      .where(where)
      .orderBy(desc(subscribers.subscribedAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize)

    return NextResponse.json({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    })
  } catch (error) {
    console.error('[Admin Subscribers] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
