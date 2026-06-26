// src/components/admin/ConfirmDialog.tsx
// 通用确认对话框 — 用于破坏性操作前的二次确认

'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
  onConfirm: () => void
  onCancel: () => void
}

const variantStyles = {
  danger: 'bg-red-600 hover:bg-red-500',
  warning: 'bg-amber-600 hover:bg-amber-500',
  info: 'bg-blue-600 hover:bg-blue-500',
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = '取消',
  variant = 'warning',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null)

  // ESC 关闭
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onCancel])

  // 打开时聚焦确认按钮
  useEffect(() => {
    if (open) confirmRef.current?.focus()
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      {/* Dialog */}
      <div className="relative bg-stone-900 border border-stone-800 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-stone-500 hover:text-stone-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon + Title */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-amber-600/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <h2 className="text-base font-semibold text-stone-100">{title}</h2>
        </div>

        {/* Message */}
        <p className="text-sm text-stone-400 mb-6 leading-relaxed">{message}</p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-sm text-stone-400 border border-stone-700 rounded-lg hover:bg-stone-800 hover:text-stone-200 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 text-sm text-white font-medium rounded-lg transition-colors ${variantStyles[variant]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
