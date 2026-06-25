// src/app/api/admin/activities/route.ts
// GET /api/admin/activities — 活动兴趣列表（分页 + 类型筛选）

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { db } from '@/lib/db'
import { activityInterests } from '@/lib/db/schema'
import { sql, eq, desc, and } from 'drizzle-orm'

export async function GET(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '20')))
    const type = searchParams.get('type')

    const conditions = type ? eq(activityInterests.type, type as 'interest' | 'register') : undefined
    const where = conditions ? and(conditions) : undefined

    const [totalResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(activityInterests)
      .where(where)

    const total = totalResult?.count ?? 0
    const data = await db
      .select()
      .from(activityInterests)
      .where(where)
      .orderBy(desc(activityInterests.createdAt))
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
    console.error('[Admin Activities] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
