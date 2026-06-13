// src/app/api/activity-interest/route.ts
// 活动兴趣登记/报名提交 API — 校验 + 确认邮件占位
// Requirements: 8.3, 8.5

import { NextResponse } from 'next/server'
import { activityInterestSchema } from '@/lib/schemas/activity-interest'
import type { ApiErrorResponse } from '@/types'

/** MVP 内存存储：活动兴趣/报名记录 */
const activityRegistrations: Array<{
  id: string
  activitySlug: string
  name: string
  email: string
  phone?: string
  type: 'interest' | 'register'
  locale: string
  message?: string
  createdAt: string
}> = []

/** 生成登记 ID */
function generateRegistrationId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `AR-${timestamp}-${random}`
}

export async function POST(request: Request) {
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

    // 生成登记 ID
    const registrationId = generateRegistrationId()

    // 存储登记记录
    activityRegistrations.push({
      id: registrationId,
      activitySlug: data.activitySlug,
      name: data.name,
      email: data.email,
      phone: data.phone,
      type: data.type,
      locale: data.locale,
      message: data.message,
      createdAt: new Date().toISOString(),
    })

    // 确认邮件占位（MVP 阶段仅记录日志）
    // TODO: Phase 1+ 接入邮件服务发送确认邮件
    console.log('[Activity Interest] Confirmation email placeholder:', {
      registrationId,
      userEmail: data.email,
      activitySlug: data.activitySlug,
      type: data.type,
    })

    // 根据类型返回不同的成功消息
    const message = data.type === 'register'
      ? '报名成功！我们会通过邮件发送确认信息。'
      : '兴趣登记成功！活动确认后我们会第一时间通知您。'

    return NextResponse.json({
      success: true,
      registrationId,
      message,
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
