'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export interface LightboxImage {
  src: string
  alt: string
  caption?: string
}

export interface LightboxProps {
  images: LightboxImage[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
}

/**
 * Lightbox 组件 — 全屏图片查看器
 * 支持：左右切换、图注、Esc 关闭、移动端滑动手势、键盘导航、焦点陷阱
 */
export function Lightbox({ images, initialIndex = 0, isOpen, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchDeltaX, setTouchDeltaX] = useState(0)

  const overlayRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // 同步 initialIndex 变化
  useEffect(() => {
    if (isOpen) {
      // Use rAF to avoid synchronous setState in effect
      requestAnimationFrame(() => setCurrentIndex(initialIndex))
    }
  }, [initialIndex, isOpen])

  // 防止 body 滚动
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  // 打开时聚焦关闭按钮（焦点陷阱入口）
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus()
    }
  }, [isOpen])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }, [images.length])

  // 键盘事件处理
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          goToPrevious()
          break
        case 'ArrowRight':
          goToNext()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, goToPrevious, goToNext])

  // 焦点陷阱
  useEffect(() => {
    if (!isOpen || !overlayRef.current) return

    const overlay = overlayRef.current

    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusableElements = overlay.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )

      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleFocusTrap)
    return () => document.removeEventListener('keydown', handleFocusTrap)
  }, [isOpen])

  // 触摸滑动手势
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
    setTouchDeltaX(0)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return
    const delta = e.touches[0].clientX - touchStartX
    setTouchDeltaX(delta)
  }

  const handleTouchEnd = () => {
    if (touchStartX === null) return

    const swipeThreshold = 50

    if (touchDeltaX > swipeThreshold) {
      goToPrevious()
    } else if (touchDeltaX < -swipeThreshold) {
      goToNext()
    }

    setTouchStartX(null)
    setTouchDeltaX(0)
  }

  // 点击背景关闭
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose()
    }
  }

  if (!isOpen || images.length === 0) return null

  const currentImage = images[currentIndex]

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="图片查看器"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={handleOverlayClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 关闭按钮 */}
      <button
        ref={closeButtonRef}
        onClick={onClose}
        aria-label="关闭图片查看器"
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* 图片计数器 */}
      <div className="absolute top-4 left-4 z-10 rounded bg-black/50 px-3 py-1 text-sm text-white">
        {currentIndex + 1} / {images.length}
      </div>

      {/* 左箭头 */}
      {images.length > 1 && (
        <button
          onClick={goToPrevious}
          aria-label="上一张图片"
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-4 sm:h-12 sm:w-12"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 sm:h-6 sm:w-6"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* 右箭头 */}
      {images.length > 1 && (
        <button
          onClick={goToNext}
          aria-label="下一张图片"
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-4 sm:h-12 sm:w-12"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 sm:h-6 sm:w-6"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* 图片区域 */}
      <div className="flex max-h-[80vh] max-w-[90vw] flex-col items-center sm:max-w-[85vw]">
        <div className="relative flex items-center justify-center">
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            width={1200}
            height={800}
            className="max-h-[70vh] w-auto object-contain"
            priority
          />
        </div>

        {/* 图注 */}
        {currentImage.caption && (
          <p className="mt-3 max-w-2xl text-center text-sm text-white/80 sm:text-base">
            {currentImage.caption}
          </p>
        )}
      </div>
    </div>
  )
}
