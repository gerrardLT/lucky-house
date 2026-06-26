// src/lib/admin/adminFetch.ts
// Admin 专用 fetch 封装 — 自动处理 401 未认证跳转

/**
 * 封装 fetch，统一处理：
 * - 401 → 自动跳转登录页（保留当前路径以便返回）
 * - 其他错误 → throw Error
 */
export async function adminFetch(url: string, options?: RequestInit): Promise<Response> {
  const res = await fetch(url, options)

  if (res.status === 401) {
    // 避免在登录页产生重定向循环
    if (typeof window !== 'undefined' && !window.location.pathname.endsWith('/login')) {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
      window.location.href = `/admin/login?returnUrl=${returnUrl}`
    }
    // 返回一个永不 resolve 的 Promise，避免后续代码继续执行
    return new Promise(() => {})
  }

  return res
}
