// src/app/api/contact/route.ts
// 联系表单 API — 主题分流 + Zod 校验 + 自动确认
// Requirements: 13.3, 13.6

import { NextResponse } from 'next/server'
import { contactSchema } from '@/lib/schemas/contact'
import { db } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
import { createElement } from 'react'
import { sendEmail } from '@/lib/email'
import ContactAutoReplyEmail from '@/lib/email/templates/ContactAutoReply'
import type { ApiErrorResponse } from '@/types'

/** 主题对应的运营标签/邮箱（MVP 阶段 mock） */
const SUBJECT_ROUTING: Record<string, string> = {
  accommodation: 'booking@luckyhouse.jp',
  pet: 'pet@luckyhouse.jp',
  activity: 'events@luckyhouse.jp',
  general: 'info@luckyhouse.jp',
}

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

    // 持久化联系记录到 PostgreSQL
    await db.insert(contacts).values({
      id: ticketId,
      subject: data.subject,
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      message: data.message,
      locale: data.locale,
      routedTo,
      status: 'pending',
    })

    // 发送自动确认邮件（fire-and-forget）
    void sendEmail(
      data.email,
      'Message Received - Luckyhouse',
      createElement(ContactAutoReplyEmail, {
        ticketId,
        name: data.name,
        subject: data.subject,
        locale: data.locale,
      })
    )

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
