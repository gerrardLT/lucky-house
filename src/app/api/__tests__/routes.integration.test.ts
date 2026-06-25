/**
 * API Routes Integration Tests
 *
 * 测试 booking/contact/subscribe API 路由的完整行为：
 * - Zod 校验、幂等性、错误响应格式
 * - 主题分流和校验
 * - 邮箱格式校验
 *
 * **Validates: Requirements 12.9, 12.11, 13.7**
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { POST as bookingPOST } from '@/app/api/booking/route'
import { POST as contactPOST } from '@/app/api/contact/route'
import { POST as subscribePOST } from '@/app/api/subscribe/route'

/** Helper: 创建模拟 Request 对象 */
function createRequest(body: unknown): Request {
  return new Request('http://localhost:3000/api/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

/** 生成有效的预约提交数据 */
function createValidBookingData(overrides?: Record<string, unknown>) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const dayAfter = new Date()
  dayAfter.setDate(dayAfter.getDate() + 3)

  return {
    checkIn: tomorrow.toISOString().split('T')[0],
    checkOut: dayAfter.toISOString().split('T')[0],
    adults: 2,
    children: 0,
    rooms: 1,
    hasPet: false,
    roomPreference: 'standard',
    acceptAlternative: true,
    contact: {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      country: 'JP',
      preferredChannel: 'email',
    },
    agreements: {
      privacyPolicy: true,
      cancelPolicy: true,
      marketingSubscribe: false,
    },
    idempotencyKey: crypto.randomUUID(),
    source: {
      sourceUrl: 'https://luckyhouse-group.com/zh/booking',
      locale: 'zh',
      deviceType: 'desktop',
      timestamp: new Date().toISOString(),
    },
    ...overrides,
  }
}

// =====================================================
// Booking API Tests
// =====================================================

describe('POST /api/booking', () => {
  it('有效提交返回 success 和 confirmationId', async () => {
    const data = createValidBookingData()
    const request = createRequest(data)
    const response = await bookingPOST(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.confirmationId).toBeDefined()
    expect(json.confirmationId).toMatch(/^LH-/)
  })

  it('重复的 idempotencyKey 返回相同的 confirmationId', async () => {
    const idempotencyKey = crypto.randomUUID()
    const data = createValidBookingData({ idempotencyKey })

    // 第一次提交
    const request1 = createRequest(data)
    const response1 = await bookingPOST(request1)
    const json1 = await response1.json()

    expect(json1.success).toBe(true)
    const firstConfirmationId = json1.confirmationId

    // 第二次提交（相同 idempotencyKey）
    const request2 = createRequest(data)
    const response2 = await bookingPOST(request2)
    const json2 = await response2.json()

    expect(json2.success).toBe(true)
    expect(json2.confirmationId).toBe(firstConfirmationId)
    expect(json2.duplicate).toBe(true)
  })

  it('无效数据返回 400 和 VALIDATION_ERROR', async () => {
    const invalidData = {
      checkIn: 'not-a-date',
      checkOut: 'also-invalid',
      adults: 0, // invalid: min 1
      children: 5, // invalid: max 4
      rooms: 0, // invalid: min 1
      hasPet: 'not-boolean', // invalid type
      roomPreference: 'invalid-option',
      contact: {
        name: '',
        email: 'invalid-email',
        phone: '1',
        country: '',
      },
      agreements: {
        privacyPolicy: false,
        cancelPolicy: false,
        marketingSubscribe: false,
      },
      idempotencyKey: 'not-a-uuid',
      source: {
        sourceUrl: 'not-a-url',
        locale: 'fr', // invalid
        deviceType: 'invalid',
        timestamp: 'not-datetime',
      },
    }

    const request = createRequest(invalidData)
    const response = await bookingPOST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('VALIDATION_ERROR')
    expect(json.error.message).toBeDefined()
  })

  it('缺少必填字段返回 400', async () => {
    const request = createRequest({})
    const response = await bookingPOST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('VALIDATION_ERROR')
  })
})

// =====================================================
// Contact API Tests
// =====================================================

describe('POST /api/contact', () => {
  it('有效提交返回 success 和 ticketId', async () => {
    const data = {
      subject: 'accommodation',
      name: '张三',
      email: 'zhangsan@example.com',
      phone: '13800138000',
      message: '我想了解宠物入住的具体规则和要求。',
      locale: 'zh',
    }

    const request = createRequest(data)
    const response = await contactPOST(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.ticketId).toBeDefined()
    expect(json.ticketId).toMatch(/^CT-/)
  })

  it('缺少必填字段返回 400', async () => {
    const invalidData = {
      subject: 'general',
      // 缺少 name, email, message
      locale: 'zh',
    }

    const request = createRequest(invalidData)
    const response = await contactPOST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('VALIDATION_ERROR')
  })

  it('无效邮箱返回 400', async () => {
    const data = {
      subject: 'pet',
      name: 'Test',
      email: 'invalid-email',
      message: '这是一条测试消息，包含足够的字符。',
      locale: 'zh',
    }

    const request = createRequest(data)
    const response = await contactPOST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('VALIDATION_ERROR')
  })

  it('消息过短返回 400', async () => {
    const data = {
      subject: 'activity',
      name: 'User',
      email: 'user@test.com',
      message: '短', // min 10 characters
      locale: 'en',
    }

    const request = createRequest(data)
    const response = await contactPOST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('VALIDATION_ERROR')
  })
})

// =====================================================
// Subscribe API Tests
// =====================================================

describe('POST /api/subscribe', () => {
  it('有效邮箱返回 success', async () => {
    const data = {
      email: 'subscriber@example.com',
      interests: ['pet', 'onsen'],
      locale: 'zh',
    }

    const request = createRequest(data)
    const response = await subscribePOST(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
  })

  it('无效邮箱返回 400', async () => {
    const data = {
      email: 'not-an-email',
      locale: 'zh',
    }

    const request = createRequest(data)
    const response = await subscribePOST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('VALIDATION_ERROR')
  })

  it('缺少 email 返回 400', async () => {
    const data = {
      locale: 'en',
    }

    const request = createRequest(data)
    const response = await subscribePOST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
  })

  it('无效 locale 返回 400', async () => {
    const data = {
      email: 'test@example.com',
      locale: 'fr', // invalid
    }

    const request = createRequest(data)
    const response = await subscribePOST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
  })

  it('不含 interests 字段仍然成功', async () => {
    const data = {
      email: 'minimal@test.com',
      locale: 'ja',
    }

    const request = createRequest(data)
    const response = await subscribePOST(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
  })
})
