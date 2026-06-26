// src/app/api/booking/route.ts
// 预约提交 API — Zod 校验 + 幂等去重 + 归因数据记录 + 邮件触发占位
// Requirements: 12.11, 12.14, 12.15

import { NextResponse } from 'next/server'
import { applyPublicRateLimit } from '@/lib/api-helpers'
import { bookingSchema } from '@/lib/schemas/booking'
import { db } from '@/lib/db'
import { bookings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { createElement } from 'react'
import { sendEmail } from '@/lib/email'
import BookingConfirmationEmail from '@/lib/email/templates/BookingConfirmation'
import BookingNotificationEmail from '@/lib/email/templates/BookingNotification'
import type { ApiErrorResponse } from '@/types'
import { bookingConfirmationSubject, bookingNotificationSubject } from '@/lib/email-subjects'

/** 生成确认编号 */
function generateConfirmationId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `LH-${timestamp}-${random}`
}

export async function POST(request: Request) {
  // 速率限制：每 IP 每 10 分钟最多 5 次预约
  const rateLimitResponse = applyPublicRateLimit(request, 'api-booking', 5)
  if (rateLimitResponse) return rateLimitResponse

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
    const [existing] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.idempotencyKey, data.idempotencyKey))
      .limit(1)

    if (existing) {
      return NextResponse.json({
        success: true,
        confirmationId: existing.id,
        duplicate: true,
      })
    }

    // 生成确认编号
    const confirmationId = generateConfirmationId()

    // 持久化预约记录到 PostgreSQL（ON CONFLICT 幂等去重）
    await db
      .insert(bookings)
      .values({
        id: confirmationId,
        idempotencyKey: data.idempotencyKey,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        adults: data.adults,
        children: data.children,
        rooms: data.rooms,
        hasPet: data.hasPet,
        petCount: data.petCount ?? null,
        roomPreference: data.roomPreference,
        acceptAlternative: data.acceptAlternative,
        petInfo: data.petInfo ?? null,
        contact: data.contact,
        agreements: data.agreements,
        source: data.source,
        status: 'pending',
      })
      .onConflictDoNothing({ target: bookings.idempotencyKey })

    // 发送邮件（fire-and-forget，不阻塞响应）
    /* eslint-disable react/no-children-prop -- children is a data field (number of kids), not React children */
    void sendEmail(
      data.contact.email,
      bookingConfirmationSubject(data.source.locale),
      createElement(BookingConfirmationEmail, {
        confirmationId,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        adults: data.adults,
        children: data.children,
        rooms: data.rooms,
        roomPreference: data.roomPreference,
        hasPet: data.hasPet,
        contactName: data.contact.name,
        locale: data.source.locale,
      })
    )

    void sendEmail(
      'booking@luckyhouse-group.com',
      bookingNotificationSubject(confirmationId),
      createElement(BookingNotificationEmail, {
        confirmationId,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        adults: data.adults,
        children: data.children,
        rooms: data.rooms,
        roomPreference: data.roomPreference,
        hasPet: data.hasPet,
        petInfo: data.petInfo ?? null,
        contactName: data.contact.name,
        contactEmail: data.contact.email,
        contactPhone: data.contact.phone,
        country: data.contact.country,
        preferredChannel: data.contact.preferredChannel,
        source: data.source,
      })
    )
    /* eslint-enable react/no-children-prop */

    return NextResponse.json({
      success: true,
      confirmationId,
    })
  } catch (error) {
    console.error('[Booking API] Error:', error)
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
