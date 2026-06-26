// src/lib/hooks/usePolling.ts
// 通用轮询 hook — 定时执行回调，支持暂停/恢复

import { useEffect, useRef, useCallback } from 'react'

export function usePolling(
  callback: () => Promise<void> | void,
  intervalMs: number,
  enabled = true
) {
  const callbackRef = useRef(callback)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // 保持 callback 引用最新
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    stop()
    if (enabled) {
      timerRef.current = setInterval(() => {
        void callbackRef.current()
      }, intervalMs)
    }
  }, [enabled, intervalMs, stop])

  useEffect(() => {
    start()
    return stop
  }, [start, stop])

  // 页面不可见时暂停轮询，节省资源
  useEffect(() => {
    function handleVisibility() {
      if (document.hidden) {
        stop()
      } else if (enabled) {
        start()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [enabled, start, stop])

  return { start, stop }
}
