// src/app/api/admin/contacts/route.ts
// GET /api/admin/contacts — 联系列表（分页 + 状态筛选）

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { db } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
import { sql, eq, desc, and, or, ilike } from 'drizzle-orm'

export async function GET(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '20')))
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const statusCond = status ? eq(contacts.status, status as 'pending' | 'resolved') : undefined
    const searchCond = search
      ? or(ilike(contacts.name, `%${search}%`), ilike(contacts.email, `%${search}%`), ilike(contacts.subject, `%${search}%`), ilike(contacts.message, `%${search}%`))
      : undefined
    const conditions = [statusCond, searchCond].filter(Boolean)
    const where = conditions.length > 0 ? and(...conditions) : undefined

    const [totalResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(contacts)
      .where(where)

    const total = totalResult?.count ?? 0
    const data = await db
      .select()
      .from(contacts)
      .where(where)
      .orderBy(desc(contacts.createdAt))
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
    console.error('[Admin Contacts] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
