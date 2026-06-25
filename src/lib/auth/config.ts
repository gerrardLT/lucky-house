// src/lib/auth/config.ts
// Auth.js v5 配置 — Credentials Provider 保护 /admin 路由

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'Admin',
      credentials: {
        username: { label: '用户名', type: 'text' },
        password: { label: '密码', type: 'password' },
      },
      async authorize(credentials) {
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
