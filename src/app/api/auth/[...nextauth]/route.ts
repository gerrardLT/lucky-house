// src/app/api/auth/[...nextauth]/route.ts
// Auth.js v5 API 路由处理器

import { handlers } from '@/lib/auth/config'

export const { GET, POST } = handlers
