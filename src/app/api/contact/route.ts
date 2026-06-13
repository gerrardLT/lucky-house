// src/app/api/contact/route.ts
// 联系表单 API — 主题分流 + Zod 校验 + 自动确认
// Requirements: 13.3, 13.6

import { NextResponse } from 'next/server'
import { contactSchema } from '@/lib/schemas/contact'
import type { ApiErrorResponse } from '@/types'

/** 主题对应的运营标签/邮箱（MVP 阶段 mock） */
const SUBJECT_ROUTING: Record<string, string> = {
  accommodation: 'booking@luckyhouse.jp',
  pet: 'pet@luckyhouse.jp',
  activity: 'events@luckyhouse.jp',
  general: 'info@luckyhouse.jp',
}

/** MVP 内存存储：联系表单提交记录 */
const contactSubmissions: Array<{
  id: string
  subject: string
  name: string
  email: string
  phone?: string
  message: string
  locale: string
  routedTo: string
  createdAt: string
}> = []

/** 生成工单 ID */
function generateTicketId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `CT-${timestamp}-${random}`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Zod schema 校验
    const result = contactSchema.safeParse(body)

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

    // 主题分流：根据 subject 确定路由目标
    const routedTo = SUBJECT_ROUTING[data.subject] || SUBJECT_ROUTING.general

    // 生成工单 ID
    const ticketId = generateTicketId()

    // 存储联系记录
    contactSubmissions.push({
      id: ticketId,
      subject: data.subject,
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      locale: data.locale,
      routedTo,
      createdAt: new Date().toISOString(),
    })

    // 自动确认邮件占位（MVP 阶段仅记录日志）
    // TODO: Phase 1+ 接入邮件服务发送自动确认
    console.log('[Contact] Auto-confirmation email placeholder:', {
      ticketId,
      userEmail: data.email,
      subject: data.subject,
      routedTo,
    })

    return NextResponse.json({
      success: true,
      ticketId,
      message: '您的消息已收到，我们会尽快回复。',
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
