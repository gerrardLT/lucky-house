// src/lib/auth/config.ts
// Auth.js v5 配置 — Credentials Provider 保护 /admin 路由

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { checkRateLimit } from '@/lib/rate-limit'

/** 从请求中提取客户端 IP */
function getClientIp(request: Request | undefined): string {
  if (!request) return 'unknown'
  const headers = request.headers
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  )
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'Admin',
      credentials: {
        username: { label: '用户名', type: 'text' },
        password: { label: '密码', type: 'password' },
      },
      async authorize(credentials, request) {
        // 速率限制：同一 IP 每 15 分钟最多 5 次登录尝试
        const ip = getClientIp(request as Request | undefined)
        const { allowed, retryAfterMs } = checkRateLimit('login', ip, 5, 15 * 60 * 1000)

        if (!allowed) {
          const waitSec = Math.ceil(retryAfterMs / 1000)
          throw new Error(`登录尝试过于频繁，请 ${waitSec} 秒后重试`)
        }

        const username = credentials?.username as string | undefined
        const password = credentials?.password as string | undefined

        if (
          username === process.env.ADMIN_USERNAME &&
          password === process.env.ADMIN_PASSWORD
        ) {
          return { id: 'admin', name: 'Admin' }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      // /admin/login 始终公开（已登录用户也会被放行，由登录页重定向）
      if (pathname === '/admin/login') return true
      // 其他 /admin 路径需要认证
      return !!auth
    },
  },
  trustHost: true,
})
