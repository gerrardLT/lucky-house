// src/components/admin/ErrorToast.tsx
// 轻量级错误提示 — 自动消失

'use client'

import { useEffect } from 'react'
import { AlertCircle, X } from 'lucide-react'

interface ErrorToastProps {
  message: string | null
  onClose: () => void
  duration?: number
}

export function ErrorToast({ message, onClose, duration = 5000 }: ErrorToastProps) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [message, onClose, duration])

  if (!message) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-2 bg-red-950/90 border border-red-800/50 text-red-300 text-sm px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm max-w-sm">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span className="flex-1">{message}</span>
        <button onClick={onClose} className="shrink-0 hover:text-red-100 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
