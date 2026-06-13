// src/lib/schemas/subscribe.ts
// 邮件订阅 Zod 验证 Schema（前后端共享）

import { z } from 'zod'

export const subscribeSchema = z.object({
  email: z.string().email(),
  interests: z.array(z.string()).optional(),
  locale: z.enum(['zh', 'ja', 'en']),
})

export type SubscribeData = z.infer<typeof subscribeSchema>
