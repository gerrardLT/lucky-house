// src/app/api/activity-interest/route.ts
// 活动兴趣登记/报名提交 API — 校验 + 确认邮件占位
// Requirements: 8.3, 8.5

import { NextResponse } from 'next/server'
import { applyPublicRateLimit } from '@/lib/api-helpers'
import { activityInterestSchema } from '@/lib/schemas/activity-interest'
import { db } from '@/lib/db'
import { activityInterests } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { createElement } from 'react'
import { sendEmail } from '@/lib/email'
import ActivityConfirmationEmail from '@/lib/email/templates/ActivityConfirmation'
import type { ApiErrorResponse } from '@/types'
import { activityConfirmationSubject } from '@/lib/email-subjects'

/** 生成登记 ID */
function generateRegistrationId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `AR-${timestamp}-${random}`
}

export async function POST(request: Request) {
  // 速率限制：每 IP 每 10 分钟最多 10 次活动登记
  const rateLimitResponse = applyPublicRateLimit(request, 'api-activity-interest', 10)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const body = await request.json()

    // Zod schema 校验
    const result = activityInterestSchema.safeParse(body)

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
          message: '表单数据验证失败',
          fields: fieldErrors,
        },
      }
      return NextResponse.json(errorResponse, { status: 400 })
    }

    const data = result.data

    // 幂等性检查：同一邮箱 + 活动 slug 不重复登记
    const [existing] = await db
      .select()
      .from(activityInterests)
      .where(
        and(
          eq(activityInterests.email, data.email),
          eq(activityInterests.activitySlug, data.activitySlug)
        )
      )
      .limit(1)

    if (existing) {
      return NextResponse.json({
        success: true,
        registrationId: existing.id,
        duplicate: true,
        message: '您已经提交过此活动的登记',
      })
    }

    // 生成登记 ID
    const registrationId = generateRegistrationId()

    // 持久化活动兴趣记录到 PostgreSQL
    await db.insert(activityInterests).values({
      id: registrationId,
      activitySlug: data.activitySlug,
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      type: data.type,
      locale: data.locale,
      message: data.message ?? null,
    })

    // 发送确认邮件（fire-and-forget）
    void sendEmail(
      data.email,
      activityConfirmationSubject(data.locale),
      createElement(ActivityConfirmationEmail, {
        registrationId,
        activityName: data.activitySlug,
        type: data.type,
        name: data.name,
        locale: data.locale,
      })
    )

    // 根据类型返回不同的成功消息
    const message = data.type === 'register'
      ? '报名成功！我们会通过邮件发送确认信息。'
      : '兴趣登记成功！活动确认后我们会第一时间通知您。'

    return NextResponse.json({
      success: true,
      registrationId,
      message,
    })
  } catch (error) {
    console.error('[ActivityInterest API] Error:', error)
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
