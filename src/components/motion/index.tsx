'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import type { ReactNode } from 'react'

/** 高端酒店感 easing — 极缓出入 */
const luxuryEasing = [0.16, 1, 0.3, 1] as const

/** 通用 viewport 配置 */
const defaultViewport = { once: true, margin: '-50px' }

/** 将 CJK 文本按视觉节奏分块（2-3 字符一组），英文按空格分词 */
function splitTextChunks(text: string): string[] {
  const trimmed = text.trim()
  const hasSpaces = /\s/.test(trimmed)
  if (hasSpaces) return trimmed.split(/\s+/)
  const chunkSize = trimmed.length <= 6 ? 2 : 3
  const chunks: string[] = []
  for (let i = 0; i < trimmed.length; i += chunkSize) {
    chunks.push(trimmed.slice(i, i + chunkSize))
  }
  return chunks
}

// ─────────────────────────────────────────────────────
//  Entrance Animations
// ─────────────────────────────────────────────────────

/** 淡入上移（通用 scroll reveal） */
export function FadeInUp({
  children,
  delay = 0,
  duration = 0.8,
  distance = 40,
  className = '',
}: {
  children: ReactNode
  delay?: number
  duration?: number
  distance?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={defaultViewport}
      transition={{ duration: reduce ? 0 : duration, delay: reduce ? 0 : delay, ease: luxuryEasing }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** 淡入（无位移） */
export function FadeIn({
  children,
  delay = 0,
  duration = 0.8,
  className = '',
}: {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={defaultViewport}
      transition={{ duration: reduce ? 0 : duration, delay: reduce ? 0 : delay, ease: luxuryEasing }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** 模糊淡入（blur → clear，区别于 slide-up） */
export function BlurIn({
  children,
  delay = 0,
  duration = 1,
  blur = 12,
  className = '',
}: {
  children: ReactNode
  delay?: number
  duration?: number
  blur?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, filter: 'blur(0px)' }}
      viewport={defaultViewport}
      transition={{ duration: reduce ? 0 : duration, delay: reduce ? 0 : delay, ease: luxuryEasing }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** 缩放淡入（用于 bento grid / 卡片） */
export function ScaleIn({
  children,
  delay = 0,
  duration = 0.7,
  from = 0.85,
  className = '',
}: {
  children: ReactNode
  delay?: number
  duration?: number
  from?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: from }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={defaultViewport}
      transition={{ duration: reduce ? 0 : duration, delay: reduce ? 0 : delay, ease: luxuryEasing }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** clip-path 水平展开（图片揭示，电影银幕感） */
export function ClipReveal({
  children,
  delay = 0,
  duration = 1.2,
  className = '',
}: {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { clipPath: 'inset(0 50% 0 50%)' }}
      whileInView={{ clipPath: 'inset(0 0% 0 0%)' }}
      viewport={defaultViewport}
      transition={{ duration: reduce ? 0 : duration, delay: reduce ? 0 : delay, ease: luxuryEasing }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** 缩放+上滑入场（BookingWidget 等底部组件） */
export function ScaleSlideUp({
  children,
  delay = 0.8,
  duration = 0.9,
  className = '',
}: {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reduce ? 0 : duration, delay: reduce ? 0 : delay, ease: luxuryEasing }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────
//  Decorative / Ambient
// ─────────────────────────────────────────────────────

/** 慢呼吸动画（装饰性数字/水印，周期 5-8s） */
export function Breathing({
  children,
  minOpacity = 0.12,
  maxOpacity = 0.28,
  cycleDuration = 6,
  className = '',
}: {
  children: ReactNode
  minOpacity?: number
  maxOpacity?: number
  cycleDuration?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      animate={{ opacity: [minOpacity, maxOpacity, minOpacity] }}
      transition={{ duration: cycleDuration, repeat: Infinity, ease: 'easeInOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** 水平线条绘制动画（scaleX: 0 → 1，origin-left） */
export function LineDraw({
  delay = 0.3,
  duration = 0.8,
  className = '',
}: {
  delay?: number
  duration?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={defaultViewport}
      transition={{ duration: reduce ? 0 : duration, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ originX: 0 }}
      className={className}
    />
  )
}

// ─────────────────────────────────────────────────────
//  Orchestration
// ─────────────────────────────────────────────────────

/** Stagger 容器（子元素依次入场） */
export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = '',
}: {
  children: ReactNode
  staggerDelay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduce ? 0 : staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Stagger 子元素 */
export function StaggerItem({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      variants={{
        hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: reduce ? 0 : 0.7, ease: luxuryEasing },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────
//  Hero-specific
// ─────────────────────────────────────────────────────

/**
 * Hero 标题入场动画 — 逐字/逐词 stagger
 *
 * CJK 文本按 2-3 字符分块，英文按空格分词。
 * 每块从下方滑入 + 淡入，形成波浪式编排效果。
 */
export function HeroTitle({
  children,
  className = '',
}: {
  children: string
  className?: string
}) {
  const reduce = useReducedMotion()
  const chunks = splitTextChunks(children)

  return (
    <motion.h1
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduce ? 0 : 0.08,
            delayChildren: reduce ? 0 : 0.3,
          },
        },
      }}
      className={className}
    >
      {chunks.map((chunk, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: reduce ? 0 : 0.7, ease: luxuryEasing },
            },
          }}
          className="inline-block"
        >
          {chunk}
        </motion.span>
      ))}
    </motion.h1>
  )
}

/** Hero 副标题入场 — blur + fade（区别于标题的 slide-up stagger） */
export function HeroSubtitle({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.p
      initial={reduce ? false : { opacity: 0, filter: 'blur(8px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: reduce ? 0 : 1, delay: reduce ? 0 : 0.9, ease: luxuryEasing }}
      className={className}
    >
      {children}
    </motion.p>
  )
}

/** BookingWidget / 通用上滑+缩放入场 */
export function SlideUp({
  children,
  delay = 0.8,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : delay, ease: luxuryEasing }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────
//  Text & Section Enhancements
// ─────────────────────────────────────────────────────

/**
 * LineReveal — 文本行级遮罩揭示
 *
 * overflow-hidden 遮罩 + 文字从 translateY(110%) 滑入。
 * 多行自动 stagger，形成逐行"揭开"效果。
 */
export function LineReveal({
  children,
  className = '',
  delay = 0,
  stagger = 0.12,
}: {
  children: string | string[]
  className?: string
  delay?: number
  stagger?: number
}) {
  const reduce = useReducedMotion()
  const lines = Array.isArray(children) ? children : [children]

  return (
    <div className={className}>
      {lines.map((line, i) => (
        <div key={i} className="overflow-hidden">
          <motion.span
            className="block"
            initial={reduce ? false : { y: '110%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{
              duration: reduce ? 0 : 0.7,
              delay: reduce ? 0 : delay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {line}
          </motion.span>
        </div>
      ))}
    </div>
  )
}

/**
 * BlurExit — Section 模糊入场/退场
 *
 * 进入视口时：blur(12px) + opacity(0) → clear + opacity(1)
 * 离开视口时：clear → blur(8px) + opacity(0.4)（柔和淡出，非硬切）
 */
export function BlurExit({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : delay, ease: luxuryEasing }}
    >
      {children}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────
//  Scroll-linked Animations
// ─────────────────────────────────────────────────────

/**
 * ScrollReveal — Scroll-linked clip-path 揭示动画
 *
 * 与 whileInView 不同，clipPath 值直接绑定到元素在视口中的滚动位置。
 * 效果：元素从中心向两侧像电影银幕展开，100% 连续联动。
 */
export function ScrollReveal({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'], // from element-top at viewport-bottom → element-center at viewport-center
  })

  // Map scroll progress → clipPath: starts closed, opens fully
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ['inset(0% 40% 0% 40%)', 'inset(0% 0% 0% 0%)']
  )

  // Subtle scale: starts slightly zoomed in
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1])

  // Opacity ramps up quickly in first 30% of progress
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

  if (reduce) {
    return <div ref={ref} className={className}>{children}</div>
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ clipPath, scale, opacity }}>
        {children}
      </motion.div>
    </div>
  )
}

/**
 * ParallaxScale — Scroll-linked 缩放视差
 *
 * 元素在视口中滚动时从 scaleFrom 缓缩到 1.0，产生"推近镜头"感。
 */
export function ParallaxScale({
  children,
  scaleFrom = 1.15,
  className = '',
}: {
  children: ReactNode
  scaleFrom?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 0.5], [scaleFrom, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0.7, 1])

  if (reduce) {
    return <div ref={ref} className={className}>{children}</div>
  }

  return (
    <div ref={ref} className={`${className} overflow-hidden`}>
      <motion.div style={{ scale, opacity }}>
        {children}
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────
//  Section Reveal
// ─────────────────────────────────────────────────────

/**
 * Section 入场 — 支持 slide-up（默认）和 clip-reveal 两种模式
 *
 * slide: 经典 opacity + y 滑入
 * clip:  clip-path 水平展开（电影银幕感）
 */
export function AnimatedSection({
  children,
  className = '',
  delay = 0,
  reveal = 'slide',
  id,
  ...rest
}: {
  children: ReactNode
  className?: string
  delay?: number
  reveal?: 'slide' | 'clip' | 'blur'
  id?: string
  'aria-labelledby'?: string
}) {
  const reduce = useReducedMotion()

  if (reveal === 'clip') {
    return (
      <motion.section
        id={id}
        initial={reduce ? false : { clipPath: 'inset(0 50% 0 50%)', opacity: 0 }}
        whileInView={{ clipPath: 'inset(0 0% 0 0%)', opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: reduce ? 0 : 1.2, delay: reduce ? 0 : delay, ease: luxuryEasing }}
        className={className}
        {...rest}
      >
        {children}
      </motion.section>
    )
  }

  if (reveal === 'blur') {
    return (
      <motion.section
        id={id}
        initial={reduce ? false : { opacity: 0, filter: 'blur(14px)' }}
        whileInView={{ opacity: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: reduce ? 0 : 1, delay: reduce ? 0 : delay, ease: luxuryEasing }}
        className={className}
        {...rest}
      >
        {children}
      </motion.section>
    )
  }

  return (
    <motion.section
      id={id}
      initial={reduce ? false : { opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : delay, ease: luxuryEasing }}
      className={className}
      {...rest}
    >
      {children}
    </motion.section>
  )
}
