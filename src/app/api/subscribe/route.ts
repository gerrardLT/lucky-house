// src/app/api/subscribe/route.ts
// 邮件订阅 API — 邮箱格式校验 + 兴趣标签存储
// Requirements: 2.9, 8.3

import { NextResponse } from 'next/server'
import { subscribeSchema } from '@/lib/schemas/subscribe'
import type { ApiErrorResponse } from '@/types'

/** MVP 内存存储：订阅记录 */
const subscribers = new Map<string, {
  email: string
  interests: string[]
  locale: string
  subscribedAt: string
}>()

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

    // 存储订阅记录（以 email 为 key 去重，新提交覆盖旧记录的兴趣标签）
    const existing = subscribers.get(data.email)
    const interests = data.interests || []

    if (existing) {
      // 合并兴趣标签（去重）
      const mergedInterests = [...new Set([...existing.interests, ...interests])]
      subscribers.set(data.email, {
        ...existing,
        interests: mergedInterests,
        locale: data.locale,
        subscribedAt: new Date().toISOString(),
      })
    } else {
      subscribers.set(data.email, {
        email: data.email,
        interests,
        locale: data.locale,
        subscribedAt: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      success: true,
      message: '订阅成功',
    })
  } catch {
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
