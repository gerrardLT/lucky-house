// src/app/api/subscribe/route.ts
// 邮件订阅 API — 邮箱格式校验 + 兴趣标签存储
// Requirements: 2.9, 8.3

import { NextResponse } from 'next/server'
import { subscribeSchema } from '@/lib/schemas/subscribe'
import { db } from '@/lib/db'
import { subscribers } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'
import type { ApiErrorResponse } from '@/types'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Zod schema 校验
    const result = subscribeSchema.safeParse(body)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const path = issue.path.join('.')
        if (path && !fieldErrors[path]) {
          fieldErrors[path] = issue.message
        }
      }

      const errorResponse: ApiErrorResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '邮箱格式无效或数据验证失败',
          fields: fieldErrors,
        },
      }
      return NextResponse.json(errorResponse, { status: 400 })
    }

    const data = result.data

    // Upsert 订阅记录（邮箱去重 + 兴趣标签合并）
    const id = `sub-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
    const interests = data.interests || []

    await db
      .insert(subscribers)
      .values({
        id,
        email: data.email,
        interests,
        locale: data.locale,
      })
      .onConflictDoUpdate({
        target: subscribers.email,
        set: {
          interests: sql`ARRAY(SELECT DISTINCT unnest(array_cat(${subscribers.interests}, ${interests}::text[])))`,
          locale: data.locale,
          subscribedAt: new Date(),
        },
      })

    return NextResponse.json({
      success: true,
      message: '订阅成功',
    })
  } catch (error) {
    console.error('[Subscribe API] Error:', error)
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '服务器内部错误，请稍后重试',
      },
    }
    return NextResponse.json(errorResponse, { status: 500 })
  }
}
