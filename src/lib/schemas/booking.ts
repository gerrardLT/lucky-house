// src/lib/schemas/booking.ts
// 五步预约表单 Zod 验证 Schema（前后端共享）

import { z } from 'zod'

// === Step 1: 日期与人数 ===

export const step1Schema = z
  .object({
    checkIn: z.string().refine(
      (d) => !isNaN(Date.parse(d)) && new Date(d) >= new Date(new Date().toDateString()),
      { message: '入住日期不能早于今天' }
    ),
    checkOut: z.string().refine((d) => !isNaN(Date.parse(d)), {
      message: '退房日期格式无效',
    }),
    adults: z.number().int().min(1).max(6),
    children: z.number().int().min(0).max(4),
    rooms: z.number().int().min(1).max(3),
    hasPet: z.boolean(),
    petCount: z.number().int().min(1).max(3).optional(),
  })
  .refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
    message: '退房日期必须晚于入住日期',
    path: ['checkOut'],
  })

export type Step1Data = z.infer<typeof step1Schema>

// === Step 2: 房型偏好 ===

export const step2Schema = z.object({
  roomPreference: z.enum(['standard', 'pet-friendly', 'villa', 'no-preference']),
  acceptAlternative: z.boolean().default(true),
})

export type Step2Data = z.infer<typeof step2Schema>

// === Step 3: 宠物信息（仅 hasPet === true 时验证） ===

export const step3Schema = z.object({
  petType: z.enum(['dog', 'cat', 'other']),
  breed: z.string().min(1).max(50),
  count: z.number().int().min(1).max(3),
  weight: z.number().min(0.5).max(80),
  age: z.number().min(0).max(30),
  vaccineStatus: z.enum(['ready', 'can_provide', 'unsure']),
  rabiesStatus: z.enum(['ready', 'can_provide', 'unsure']),
  needOnsen: z.boolean().default(false),
  needGrooming: z.boolean().default(false),
  specialNotes: z.string().max(300).optional(),
})

export type Step3Data = z.infer<typeof step3Schema>

// === Step 4: 联系方式 ===

export const step4Schema = z.object({
  name: z.string().min(1).max(60),
  email: z.string().email(),
  phone: z.string().min(5).max(20),
  country: z.string().min(1),
  preferredChannel: z.enum(['email', 'phone', 'line', 'wechat', 'whatsapp']).default('email'),
})

export type Step4Data = z.infer<typeof step4Schema>

// === Step 5: 规则确认 ===

export const step5Schema = z.object({
  privacyPolicy: z.literal(true, { error: '必须同意隐私政策' }),
  petRules: z.literal(true).optional(),
  cancelPolicy: z.literal(true, { error: '必须确认取消政策' }),
  marketingSubscribe: z.boolean().default(false),
})

export type Step5Data = z.infer<typeof step5Schema>

// === 完整预约 Schema（提交时校验） ===

export const bookingSchema = z.object({
  // Step 1 fields (inline to avoid refine nesting issues)
  checkIn: z.string(),
  checkOut: z.string(),
  adults: z.number().int().min(1).max(6),
  children: z.number().int().min(0).max(4),
  rooms: z.number().int().min(1).max(3),
  hasPet: z.boolean(),
  petCount: z.number().int().min(1).max(3).optional(),
  // Step 2 fields
  roomPreference: z.enum(['standard', 'pet-friendly', 'villa', 'no-preference']),
  acceptAlternative: z.boolean().default(true),
  // Step 3 (conditional)
  petInfo: step3Schema.optional(),
  // Step 4
  contact: step4Schema,
  // Step 5
  agreements: step5Schema,
  // Meta
  idempotencyKey: z.string().uuid(),
  source: z.object({
    sourceUrl: z.string().url(),
    utmSource: z.string().optional(),
    utmMedium: z.string().optional(),
    utmCampaign: z.string().optional(),
    locale: z.enum(['zh', 'ja', 'en']),
    deviceType: z.enum(['desktop', 'mobile', 'tablet']),
    timestamp: z.string().datetime(),
  }),
}).refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
  message: '退房日期必须晚于入住日期',
  path: ['checkOut'],
})

export type BookingData = z.infer<typeof bookingSchema>
