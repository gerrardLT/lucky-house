// src/lib/api-helpers.ts
// 公共 API 辅助函数 — 速率限制 + IP 提取 + 限流响应

import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

/** 从 Next.js Request 中提取客户端 IP */
export function getClientIp(request: Request): string {
  const headers = request.headers
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  )
}

/**
 * 公开 API 速率限制检查
 *
 * 默认限制：每 IP 每 10 分钟最多 10 次请求
 * 返回 NextResponse | null — null 表示允许通过
 */
export function applyPublicRateLimit(
  request: Request,
  storeName: string,
  maxRequests = 10,
  windowMs = 10 * 60 * 1000
): NextResponse | null {
  const ip = getClientIp(request)
  const { allowed, retryAfterMs } = checkRateLimit(storeName, ip, maxRequests, windowMs)

  if (!allowed) {
    const retryAfterSec = Math.ceil(retryAfterMs / 1000)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RATE_LIMIT',
          message: `请求过于频繁，请 ${retryAfterSec} 秒后重试`,
        },
      },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfterSec) },
      }
    )
  }

  return null
}
