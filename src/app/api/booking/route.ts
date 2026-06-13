// src/app/api/booking/route.ts
// 预约提交 API — Zod 校验 + 幂等去重 + 归因数据记录 + 邮件触发占位
// Requirements: 12.11, 12.14, 12.15

import { NextResponse } from 'next/server'
import { bookingSchema } from '@/lib/schemas/booking'
import type { ApiErrorResponse } from '@/types'

/** MVP 内存存储：已提交的预约记录（按 idempotencyKey 去重） */
const submittedBookings = new Map<string, { confirmationId: string; createdAt: string }>()

/** 生成确认编号 */
function generateConfirmationId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `LH-${timestamp}-${random}`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Zod schema 校验
    const result = bookingSchema.safeParse(body)

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

    // 幂等性检查：如果同一 idempotencyKey 已提交过，返回已有确认号
    const existing = submittedBookings.get(data.idempotencyKey)
    if (existing) {
      return NextResponse.json({
        success: true,
        confirmationId: existing.confirmationId,
        duplicate: true,
      })
    }

    // 生成确认编号
    const confirmationId = generateConfirmationId()

    // 记录归因数据（MVP 阶段仅内存存储）
    const bookingRecord = {
      confirmationId,
      createdAt: new Date().toISOString(),
      // 归因数据
      attribution: {
        sourceUrl: data.source.sourceUrl,
        utmSource: data.source.utmSource,
        utmMedium: data.source.utmMedium,
        utmCampaign: data.source.utmCampaign,
        locale: data.source.locale,
        deviceType: data.source.deviceType,
        timestamp: data.source.timestamp,
      },
    }

    // 存储预约记录
    submittedBookings.set(data.idempotencyKey, bookingRecord)

    // 邮件触发占位（MVP 阶段仅记录日志）
    // TODO: Phase 1+ 接入邮件服务
    // - 60秒内发送用户确认邮件（含确认编号与提交摘要）
    // - 60秒内发送运营通知邮件（含用户信息、宠物信息、来源与 UTM）
    console.log('[Booking] Email trigger placeholder:', {
      confirmationId,
      userEmail: data.contact.email,
      hasPet: data.hasPet,
      attribution: bookingRecord.attribution,
    })

    return NextResponse.json({
      success: true,
      confirmationId,
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
