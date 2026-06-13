// src/lib/schemas/contact.ts
// 联系表单 Zod 验证 Schema（前后端共享）

import { z } from 'zod'

export const contactSchema = z.object({
  subject: z.enum(['accommodation', 'pet', 'activity', 'general']),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
  locale: z.enum(['zh', 'ja', 'en']),
})

export type ContactData = z.infer<typeof contactSchema>
