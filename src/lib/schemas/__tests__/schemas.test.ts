// Quick validation test for all schemas
import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  bookingSchema,
} from '../booking'
import { contactSchema } from '../contact'
import { subscribeSchema } from '../subscribe'

describe('booking schemas', () => {
  it('step1Schema validates valid data', () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfter = new Date()
    dayAfter.setDate(dayAfter.getDate() + 2)

    const result = z.safeParse(step1Schema, {
      checkIn: tomorrow.toISOString().split('T')[0],
      checkOut: dayAfter.toISOString().split('T')[0],
      adults: 2,
      children: 1,
      rooms: 1,
      hasPet: true,
      petCount: 1,
    })
    expect(result.success).toBe(true)
  })

  it('step1Schema rejects checkOut <= checkIn', () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const result = z.safeParse(step1Schema, {
      checkIn: tomorrow.toISOString().split('T')[0],
      checkOut: tomorrow.toISOString().split('T')[0],
      adults: 2,
      children: 0,
      rooms: 1,
      hasPet: false,
    })
    expect(result.success).toBe(false)
  })

  it('step2Schema applies default for acceptAlternative', () => {
    const result = z.safeParse(step2Schema, {
      roomPreference: 'pet-friendly',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.acceptAlternative).toBe(true)
    }
  })

  it('step3Schema validates pet info', () => {
    const result = z.safeParse(step3Schema, {
      petType: 'dog',
      breed: 'Shiba Inu',
      count: 1,
      weight: 10,
      age: 3,
      vaccineStatus: 'ready',
      rabiesStatus: 'ready',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.needOnsen).toBe(false)
      expect(result.data.needGrooming).toBe(false)
    }
  })

  it('step4Schema applies default for preferredChannel', () => {
    const result = z.safeParse(step4Schema, {
      name: 'Test User',
      email: 'test@example.com',
      phone: '12345678',
      country: 'JP',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.preferredChannel).toBe('email')
    }
  })

  it('step5Schema: marketingSubscribe defaults to false (GDPR)', () => {
    const result = z.safeParse(step5Schema, {
      privacyPolicy: true,
      cancelPolicy: true,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.marketingSubscribe).toBe(false)
    }
  })

  it('step5Schema rejects privacyPolicy !== true', () => {
    const result = z.safeParse(step5Schema, {
      privacyPolicy: false,
      cancelPolicy: true,
    })
    expect(result.success).toBe(false)
  })

  it('bookingSchema validates complete booking', () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfter = new Date()
    dayAfter.setDate(dayAfter.getDate() + 2)

    const result = z.safeParse(bookingSchema, {
      checkIn: tomorrow.toISOString().split('T')[0],
      checkOut: dayAfter.toISOString().split('T')[0],
      adults: 2,
      children: 0,
      rooms: 1,
      hasPet: true,
      petCount: 1,
      roomPreference: 'pet-friendly',
      acceptAlternative: true,
      petInfo: {
        petType: 'dog',
        breed: 'Corgi',
        count: 1,
        weight: 12,
        age: 2,
        vaccineStatus: 'ready',
        rabiesStatus: 'ready',
        needOnsen: true,
        needGrooming: false,
      },
      contact: {
        name: 'Taro Yamada',
        email: 'taro@example.com',
        phone: '090-1234-5678',
        country: 'JP',
        preferredChannel: 'email',
      },
      agreements: {
        privacyPolicy: true,
        petRules: true,
        cancelPolicy: true,
        marketingSubscribe: false,
      },
      idempotencyKey: '550e8400-e29b-41d4-a716-446655440000',
      source: {
        sourceUrl: 'https://example.com/booking',
        locale: 'ja',
        deviceType: 'desktop',
        timestamp: new Date().toISOString(),
      },
    })
    expect(result.success).toBe(true)
  })
})

describe('contactSchema', () => {
  it('validates valid contact form', () => {
    const result = z.safeParse(contactSchema, {
      subject: 'pet',
      name: 'Test User',
      email: 'test@example.com',
      message: 'I have a question about pets.',
      locale: 'en',
    })
    expect(result.success).toBe(true)
  })

  it('rejects message shorter than 10 chars', () => {
    const result = z.safeParse(contactSchema, {
      subject: 'general',
      name: 'Test',
      email: 'test@example.com',
      message: 'Hi',
      locale: 'zh',
    })
    expect(result.success).toBe(false)
  })
})

describe('subscribeSchema', () => {
  it('validates valid subscription', () => {
    const result = z.safeParse(subscribeSchema, {
      email: 'user@example.com',
      locale: 'ja',
    })
    expect(result.success).toBe(true)
  })

  it('validates with optional interests', () => {
    const result = z.safeParse(subscribeSchema, {
      email: 'user@example.com',
      interests: ['pet', 'onsen'],
      locale: 'zh',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = z.safeParse(subscribeSchema, {
      email: 'not-an-email',
      locale: 'en',
    })
    expect(result.success).toBe(false)
  })
})
