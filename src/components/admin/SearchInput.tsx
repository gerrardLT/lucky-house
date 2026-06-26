// src/components/admin/SearchInput.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
}

export function SearchInput({ value, onChange, placeholder = 'Search...', debounceMs = 300 }: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 同步外部 value 变化
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value
    setLocalValue(newValue)

    // 清除旧定时器，设置新定时器
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      onChange(newValue)
    }, debounceMs)
  }

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div className="relative w-full max-w-xs">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" strokeWidth={1.5} />
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2 text-sm bg-stone-900 border border-stone-800 rounded-lg text-stone-200 placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/30 transition-colors"
      />
    </div>
  )
}
