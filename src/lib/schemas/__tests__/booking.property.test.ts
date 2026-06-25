// Property 11: Zod 预约表单 Schema 验证正确性
// Validates: Requirements 12.4, 12.5, 12.6, 12.7, 12.8, 12.9, 12.10, 12.17

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { bookingSchema, step1Schema, step2Schema, step3Schema, step4Schema, step5Schema } from '../booking'

describe('Property 11: Zod 预约表单 Schema 验证正确性', () => {
  // Helper: generate a future date string (tomorrow or later)
  const futureDateArb = fc.integer({ min: 1, max: 365 }).map((daysAhead) => {
    const d = new Date()
    d.setDate(d.getDate() + daysAhead)
    return d.toISOString().split('T')[0]
  })

  // Generate a checkIn/checkOut pair where checkOut > checkIn
  const dateRangeArb = fc.integer({ min: 1, max: 300 }).chain((daysAhead) => {
    return fc.integer({ min: 1, max: 30 }).map((stayDays) => {
      const checkIn = new Date()
      checkIn.setDate(checkIn.getDate() + daysAhead)
      const checkOut = new Date(checkIn)
      checkOut.setDate(checkOut.getDate() + stayDays)
      return {
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
      }
    })
  })

  const validStep1Arb = dateRangeArb.chain(({ checkIn, checkOut }) =>
    fc.record({
      checkIn: fc.constant(checkIn),
      checkOut: fc.constant(checkOut),
      adults: fc.integer({ min: 1, max: 6 }),
      children: fc.integer({ min: 0, max: 4 }),
      rooms: fc.integer({ min: 1, max: 3 }),
      hasPet: fc.boolean(),
      petCount: fc.constantFrom(undefined, 1, 2, 3),
    })
  )

  const validStep2Arb = fc.record({
    roomPreference: fc.constantFrom('standard' as const, 'pet-friendly' as const, 'villa' as const, 'no-preference' as const),
    acceptAlternative: fc.boolean(),
  })

  const validStep3Arb = fc.record({
    petType: fc.constantFrom('dog' as const, 'cat' as const, 'other' as const),
    breed: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
    count: fc.integer({ min: 1, max: 3 }),
    weight: fc.float({ min: 0.5, max: 80, noNaN: true }),
    age: fc.float({ min: 0, max: 30, noNaN: true }),
    vaccineStatus: fc.constantFrom('ready' as const, 'can_provide' as const, 'unsure' as const),
    rabiesStatus: fc.constantFrom('ready' as const, 'can_provide' as const, 'unsure' as const),
    needOnsen: fc.boolean(),
    needGrooming: fc.boolean(),
    specialNotes: fc.option(fc.string({ maxLength: 300 }), { nil: undefined }),
  })

  // Custom email generator that produces emails accepted by Zod v4's strict validation
  const emailArb = fc.tuple(
    fc.stringMatching(/^[a-z][a-z0-9]{1,8}$/),
    fc.stringMatching(/^[a-z][a-z0-9]{1,6}$/),
    fc.constantFrom('com', 'org', 'net', 'jp', 'io')
  ).map(([local, domain, tld]) => `${local}@${domain}.${tld}`)

  const validStep4Arb = fc.record({
    name: fc.string({ minLength: 1, maxLength: 60 }).filter((s) => s.trim().length > 0),
    email: emailArb,
    phone: fc.string({ minLength: 5, maxLength: 20 }).filter((s) => s.trim().length >= 5),
    country: fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length > 0),
    preferredChannel: fc.constantFrom('email' as const, 'phone' as const, 'line' as const, 'wechat' as const, 'whatsapp' as const),
  })

  const validStep5Arb = fc.record({
    privacyPolicy: fc.constant(true as const),
    petRules: fc.constantFrom(true as const, undefined),
    cancelPolicy: fc.constant(true as const),
    marketingSubscribe: fc.boolean(),
  })

  it('valid booking data passes schema validation', () => {
    const validBookingArb = fc.tuple(
      validStep1Arb,
      validStep2Arb,
      fc.option(validStep3Arb, { nil: undefined }),
      validStep4Arb,
      validStep5Arb,
    ).map(([step1, step2, petInfo, contact, agreements]) => ({
      ...step1,
      ...step2,
      petInfo,
      contact,
      agreements,
      idempotencyKey: crypto.randomUUID(),
      source: {
        sourceUrl: 'https://luckyhouse-group.com/zh/booking',
        utmSource: 'google',
        locale: 'zh' as const,
        deviceType: 'desktop' as const,
        timestamp: new Date().toISOString(),
      },
    }))

    fc.assert(
      fc.property(validBookingArb, (data) => {
        const result = bookingSchema.safeParse(data)
        if (!result.success) {
          // Debug: show what failed
          console.error('Validation failed:', result.error.issues)
        }
        expect(result.success).toBe(true)
      }),
      { numRuns: 50 }
    )
  })

  it('invalid data (checkOut <= checkIn) fails validation', () => {
    fc.assert(
      fc.property(
        futureDateArb,
        fc.integer({ min: 0, max: 0 }), // 0 days stay = same day
        (checkInStr, _offset) => {
          const data = {
            checkIn: checkInStr,
            checkOut: checkInStr, // same as check-in
            adults: 2,
            children: 0,
            rooms: 1,
            hasPet: false,
            roomPreference: 'standard',
            acceptAlternative: true,
            contact: {
              name: 'Test',
              email: 'test@example.com',
              phone: '12345678',
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
          }
          const result = bookingSchema.safeParse(data)
          expect(result.success).toBe(false)
        }
      ),
      { numRuns: 20 }
    )
  })

  it('missing required fields fail step-level validation', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          {}, // empty object
          { adults: 2 }, // missing most fields
          { checkIn: '2025-12-01', checkOut: '2025-12-03' }, // missing adults/rooms/hasPet
        ),
        (invalidData) => {
          const result = step1Schema.safeParse(invalidData)
          expect(result.success).toBe(false)
        }
      ),
      { numRuns: 10 }
    )
  })

  it('marketingSubscribe defaults to false', () => {
    const data = {
      privacyPolicy: true,
      cancelPolicy: true,
      // marketingSubscribe not provided
    }
    const result = step5Schema.safeParse(data)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.marketingSubscribe).toBe(false)
    }
  })

  it('adults out of range [1-6] fails step1 validation', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 7, max: 100 }),
        (invalidAdults) => {
          const checkIn = new Date()
          checkIn.setDate(checkIn.getDate() + 5)
          const checkOut = new Date(checkIn)
          checkOut.setDate(checkOut.getDate() + 2)

          const data = {
            checkIn: checkIn.toISOString().split('T')[0],
            checkOut: checkOut.toISOString().split('T')[0],
            adults: invalidAdults,
            children: 0,
            rooms: 1,
            hasPet: false,
          }
          const result = step1Schema.safeParse(data)
          expect(result.success).toBe(false)
        }
      ),
      { numRuns: 20 }
    )
  })
})
