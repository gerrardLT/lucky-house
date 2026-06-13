// src/lib/schemas/activity-interest.ts
// 活动兴趣登记/报名 Zod 验证 Schema（前后端共享）
// Requirements: 8.3, 8.5

import { z } from 'zod'

export const activityInterestSchema = z.object({
  activitySlug: z.string().min(1),
  name: z.string().min(1).max(60),
  email: z.string().email(),
  phone: z.string().min(5).max(20).optional(),
  type: z.enum(['interest', 'register']), // interest = 兴趣登记, register = 正式报名
  locale: z.enum(['zh', 'ja', 'en']),
  message: z.string().max(300).optional(),
})

export type ActivityInterestData = z.infer<typeof activityInterestSchema>
