'use client'

import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'

export interface MagneticButtonProps {
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  className?: string
  /** 磁性吸引强度（px） */
  strength?: number
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-amber-600 text-stone-900 hover:bg-amber-500 active:bg-amber-700 focus-visible:ring-amber-500',
  secondary:
    'bg-stone-800 text-stone-200 hover:bg-stone-700 active:bg-stone-900 focus-visible:ring-amber-500',
  ghost:
    'bg-transparent text-stone-300 hover:bg-stone-800 hover:text-white focus-visible:ring-amber-500',
  outline:
    'border border-stone-600 bg-transparent text-stone-200 hover:bg-stone-800 hover:text-white focus-visible:ring-amber-500',
}

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
}

/**
 * MagneticButton — 磁性按钮
 *
 * 鼠标接近时按钮被"吸引"跟随移动，松开后弹回原位。
 * 使用 useMotionValue 实现流畅的 translate 插值。
 */
export function MagneticButton({
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  className = '',
  strength = 8,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const reduce = useReducedMotion()

  function handleMouseMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setPos({
      x: (e.clientX - cx) * 0.25,
      y: (e.clientY - cy) * 0.25,
    })
  }

  function handleMouseLeave() {
    setPos({ x: 0, y: 0 })
  }

  const classes = [
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-45 disabled:cursor-not-allowed disabled:pointer-events-none',
    variantStyles[variant],
    sizeStyles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = loading ? (
    <>
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {children}
    </>
  ) : (
    children
  )

  // Reduced motion 或 disabled：渲染为普通元素，不加磁性效果
  if (reduce || disabled || loading) {
    if (href && !disabled && !loading) {
      return <Link href={href} className={classes}>{content}</Link>
    }
    return (
      <button className={classes} onClick={onClick} disabled={disabled || loading}>
        {content}
      </button>
    )
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      style={{ display: 'inline-block' }}
    >
      {href ? (
        <Link href={href} className={classes} tabIndex={0}>
          {content}
        </Link>
      ) : (
        <button className={classes} onClick={onClick} type="button">
          {content}
        </button>
      )}
    </motion.div>
  )
}
