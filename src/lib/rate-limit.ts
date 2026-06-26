// src/lib/rate-limit.ts
// 轻量级内存滑动窗口速率限制器
// 适用于单实例部署（Docker standalone），生产多实例可替换为 Redis

interface RateLimitEntry {
  timestamps: number[]
}

const stores = new Map<string, Map<string, RateLimitEntry>>()

function getStore(name: string): Map<string, RateLimitEntry> {
  let store = stores.get(name)
  if (!store) {
    store = new Map()
    stores.set(name, store)
  }
  return store
}

/**
 * 检查速率限制（滑动窗口算法）
 *
 * @param storeName - 限制器名称（如 'login', 'public-api'）
 * @param key - 标识符（如 IP 地址、用户标识）
 * @param maxRequests - 窗口内最大请求数
 * @param windowMs - 窗口时长（毫秒）
 * @returns allowed: 是否允许, remaining: 剩余次数, retryAfterMs: 被限制时需等待的毫秒数
 */
export function checkRateLimit(
  storeName: string,
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; retryAfterMs: number } {
  const store = getStore(storeName)
  const now = Date.now()
  const windowStart = now - windowMs

  let entry = store.get(key)
  if (!entry) {
    entry = { timestamps: [] }
    store.set(key, entry)
  }

  // 清理窗口外的记录
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart)

  if (entry.timestamps.length >= maxRequests) {
    const oldestInWindow = entry.timestamps[0]
    const retryAfterMs = oldestInWindow + windowMs - now
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: Math.max(0, retryAfterMs),
    }
  }

  // 记录本次请求
  entry.timestamps.push(now)

  return {
    allowed: true,
    remaining: maxRequests - entry.timestamps.length,
    retryAfterMs: 0,
  }
}

/**
 * 定期清理过期的 store 条目，防止内存泄漏
 * 每 5 分钟运行一次
 */
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000
let cleanupTimer: ReturnType<typeof setInterval> | null = null

export function startRateLimitCleanup(): void {
  if (cleanupTimer) return
  cleanupTimer = setInterval(() => {
    const now = Date.now()
    const maxWindow = 15 * 60 * 1000 // 15 分钟，覆盖最大窗口
    for (const [, store] of stores) {
      for (const [key, entry] of store) {
        entry.timestamps = entry.timestamps.filter((t) => t > now - maxWindow)
        if (entry.timestamps.length === 0) {
          store.delete(key)
        }
      }
    }
  }, CLEANUP_INTERVAL_MS)
  // 允许 Node.js 进程在没有其他任务时退出
  if (cleanupTimer && typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
    cleanupTimer.unref()
  }
}
