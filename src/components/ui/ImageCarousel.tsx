'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

export interface CarouselImage {
  src: string
  alt: string
  isRendering?: boolean
}

export interface ImageCarouselProps {
  images: CarouselImage[]
  className?: string
}

/**
 * ImageCarousel 图片轮播组件
 *
 * 用于房型详情页图片展示，支持：
 * - 主图展示区域（保持宽高比）
 * - 缩略图导航行
 * - 左右箭头切换
 * - 移动端滑动手势
 * - 点击主图进入全屏查看
 * - 键盘导航（左右方向键）
 * - isRendering 图片自动标注"示意图"标签
 */
export function ImageCarousel({ images, className = '' }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const fullscreenRef = useRef<HTMLDivElement>(null)
  const thumbnailsRef = useRef<HTMLDivElement>(null)

  const totalImages = images.length

  // Navigate to a specific image
  const goToImage = useCallback(
    (index: number) => {
      if (isTransitioning || totalImages === 0) return
      setIsTransitioning(true)
      setCurrentIndex((index + totalImages) % totalImages)
      setTimeout(() => setIsTransitioning(false), 300)
    },
    [isTransitioning, totalImages]
  )

  const goToPrev = useCallback(() => {
    goToImage(currentIndex - 1)
  }, [currentIndex, goToImage])

  const goToNext = useCallback(() => {
    goToImage(currentIndex + 1)
  }, [currentIndex, goToImage])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNext()
      } else if (e.key === 'Escape' && isFullscreen) {
        e.preventDefault()
        setIsFullscreen(false)
      }
    }

    const target = isFullscreen ? fullscreenRef.current : containerRef.current
    if (target) {
      target.addEventListener('keydown', handleKeyDown)
      return () => target.removeEventListener('keydown', handleKeyDown)
    }
  }, [goToPrev, goToNext, isFullscreen])

  // Focus fullscreen container when opened
  useEffect(() => {
    if (isFullscreen && fullscreenRef.current) {
      fullscreenRef.current.focus()
    }
  }, [isFullscreen])

  // Scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeThumbnail = thumbnailsRef.current.querySelector(
        `[data-index="${currentIndex}"]`
      )
      if (activeThumbnail && typeof activeThumbnail.scrollIntoView === 'function') {
        activeThumbnail.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        })
      }
    }
  }, [currentIndex])

  // Touch gesture handling - minimum swipe distance
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (Math.abs(distance) >= minSwipeDistance) {
      if (distance > 0) {
        goToNext()
      } else {
        goToPrev()
      }
    }
    setTouchStart(null)
    setTouchEnd(null)
  }

  // Handle body scroll lock for fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isFullscreen])

  if (totalImages === 0) {
    return (
      <div
        className={`relative aspect-[4/3] w-full bg-stone-100 flex items-center justify-center ${className}`}
      >
        <span className="text-stone-400">暂无图片</span>
      </div>
    )
  }

  const currentImage = images[currentIndex]

  return (
    <>
      {/* Main carousel */}
      <div
        ref={containerRef}
        className={`relative w-full ${className}`}
        role="region"
        aria-label="图片轮播"
        aria-roledescription="carousel"
        tabIndex={0}
      >
        {/* Main image area */}
        <div
          className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-stone-100 cursor-pointer"
          onClick={() => setIsFullscreen(true)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          role="button"
          aria-label="点击全屏查看"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setIsFullscreen(true)
            }
          }}
        >
          <div
            className="absolute inset-0 flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="relative min-w-full h-full flex-shrink-0"
                aria-hidden={index !== currentIndex}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw"
                  priority={index === 0}
                  loading={index === 0 ? undefined : 'lazy'}
                />
                {image.isRendering && (
                  <span className="absolute bottom-3 left-3 rounded px-2 py-0.5 text-xs font-medium text-white bg-black/60">
                    示意图
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Image counter */}
          <div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white">
            {currentIndex + 1} / {totalImages}
          </div>
        </div>

        {/* Navigation arrows */}
        {totalImages > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goToPrev()
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 shadow-md transition-colors hover:bg-black/70 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label="上一张图片"
              disabled={isTransitioning}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 shadow-md transition-colors hover:bg-black/70 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label="下一张图片"
              disabled={isTransitioning}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Thumbnail navigation */}
        {totalImages > 1 && (
          <div
            ref={thumbnailsRef}
            className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-thin"
            role="tablist"
            aria-label="缩略图导航"
          >
            {images.map((image, index) => (
              <button
                key={index}
                type="button"
                data-index={index}
                onClick={() => goToImage(index)}
                className={`relative flex-shrink-0 h-16 w-20 overflow-hidden rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                  index === currentIndex
                    ? 'ring-2 ring-amber-600 opacity-100'
                    : 'opacity-60 hover:opacity-90'
                }`}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`查看第 ${index + 1} 张图片: ${image.alt}`}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                  loading="lazy"
                />
                {image.isRendering && (
                  <span className="absolute bottom-0.5 left-0.5 rounded px-1 py-px text-[10px] font-medium text-white bg-black/60">
                    示意图
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div
          ref={fullscreenRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label="全屏图片查看"
          tabIndex={0}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault()
              setIsFullscreen(false)
            } else if (e.key === 'ArrowLeft') {
              e.preventDefault()
              goToPrev()
            } else if (e.key === 'ArrowRight') {
              e.preventDefault()
              goToNext()
            }
          }}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="关闭全屏"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Fullscreen image */}
          <div className="relative h-full w-full flex items-center justify-center p-4 md:p-12">
            <div className="relative max-h-full max-w-full w-full h-full">
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
              {currentImage.isRendering && (
                <span className="absolute bottom-4 left-4 rounded px-3 py-1 text-sm font-medium text-white bg-black/60">
                  示意图
                </span>
              )}
            </div>
          </div>

          {/* Fullscreen navigation arrows */}
          {totalImages > 1 && (
            <>
              <button
                type="button"
                onClick={goToPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="上一张图片"
                disabled={isTransitioning}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="下一张图片"
                disabled={isTransitioning}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Fullscreen counter and caption */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
            <span className="rounded-full bg-black/50 px-3 py-1 text-sm text-white">
              {currentIndex + 1} / {totalImages}
            </span>
            <p className="mt-2 text-sm text-white/80">{currentImage.alt}</p>
          </div>
        </div>
      )}
    </>
  )
}
