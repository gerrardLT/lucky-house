'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'
import { StaggerContainer, StaggerItem, ScaleIn, LineDraw, Breathing } from '@/components/motion'
import { label, sectionTitle } from '@/lib/i18n/locale-typo'
import type { Locale } from '@/types'

export interface ValueCardsProps {
  /** 价值卡片数据 */
  cards: Array<{
    icon: string
    title: Record<Locale, string>
    description: Record<Locale, string>
    link: string
  }>
  /** 当前语言 */
  locale: Locale
}

/** icon string → SVG 映射表 */
const ICON_MAP: Record<string, React.ReactNode> = {
  'paw-heart': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      {/* Paw pads */}
      <ellipse cx="8" cy="6.5" rx="2" ry="2.5" />
      <ellipse cx="16" cy="6.5" rx="2" ry="2.5" />
      <ellipse cx="5" cy="11.5" rx="1.8" ry="2.2" />
      <ellipse cx="19" cy="11.5" rx="1.8" ry="2.2" />
      {/* Heart-shaped main pad */}
      <path d="M12 21s-6-4.35-6-8.5C6 10.015 7.79 8 10 8c1.21 0 2 .5 2 .5s.79-.5 2-.5c2.21 0 4 2.015 4 4.5C18 16.65 12 21 12 21z" />
    </svg>
  ),
  'leaf-sun': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      {/* Leaf */}
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66L7 18" />
      <path d="M20.5 3.5C15 3.5 8 8 8 15c0 2.5 1 4.5 2.5 6" />
      {/* Sun rays */}
      <circle cx="17" cy="7" r="3" />
      <line x1="17" y1="2" x2="17" y2="3" />
      <line x1="17" y1="11" x2="17" y2="12" />
      <line x1="12" y1="7" x2="13" y2="7" />
      <line x1="21" y1="7" x2="22" y2="7" />
    </svg>
  ),
  'users-group': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      {/* Person 1 */}
      <circle cx="9" cy="7" r="3" />
      <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      {/* Person 2 */}
      <circle cx="17" cy="8" r="2.5" />
      <path d="M21 21v-1.5a3 3 0 0 0-2.5-2.96" />
    </svg>
  ),
}

/** 每张 Value Card 对应的场景图 */
const VALUE_CARD_IMAGES: Array<{ src: string; alt: Record<Locale, string> }> = [
  {
    src: '/images/facilities/facility-pet-onsen-01.png',
    alt: { zh: '宠物专属温泉', ja: 'ペット専用温泉', en: 'Pet onsen' },
  },
  {
    src: '/images/hero/hero-03-eco-campsite-aerial.png',
    alt: { zh: '零碳自然营地', ja: 'ゼロカーボンキャンプ', en: 'Zero-carbon campsite' },
  },
  {
    src: '/images/facilities/facility-bbq-terrace-01.png',
    alt: { zh: 'BBQ聚会', ja: 'BBQパーティー', en: 'BBQ gathering' },
  },
]

/** 获取“了解更多”文本 */
function getLearnMoreText(locale: Locale): string {
  const text = {
    zh: '了解更多',
    ja: 'もっと見る',
    en: 'Learn More',
  }
  return text[locale]
}

/**
 * ValueCards 三大价值卡片组件 — Editorial Magazine Spread（杂志编辑排版）
 *
 * 去掉传统盒子卡片，改为垂直堆叠的杂志式编辑排版。
 * 大留白、超大序号、错落布局，呈现高端感。
 */
export function ValueCards({ cards, locale }: ValueCardsProps) {
  const reduce = useReducedMotion()
  const learnMore = getLearnMoreText(locale)

  return (
    <StaggerContainer staggerDelay={0.15} className="mx-auto max-w-4xl px-6 py-16">
      {cards.map((card, index) => (
        <div key={index}>
          <StaggerItem
            className="flex items-start gap-8 py-12"
          >
            {/* 左侧：超大序号 — ScaleIn + Breathing */}
            <ScaleIn delay={index * 0.15} className="shrink-0">
              <Breathing
                minOpacity={0.25}
                maxOpacity={0.45}
                cycleDuration={6 + index}
                className="text-8xl font-serif font-light text-amber-600 leading-none select-none"
              >
                0{index + 1}
              </Breathing>
            </ScaleIn>

            {/* 右侧：内容 */}
            <div className="flex-1 max-w-xl">
              {/* 图标 — rotate 微旋转入场 */}
              <motion.div
                className="text-amber-500 mb-3"
                aria-hidden="true"
                initial={reduce ? false : { opacity: 0, rotate: -10 }}
                whileInView={{ opacity: 1, rotate: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : index * 0.1 + 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {ICON_MAP[card.icon] ?? ICON_MAP['paw-heart']}
              </motion.div>
              <h3 className={`text-xl font-medium text-white mb-3 ${sectionTitle(locale)}`}>
                {card.title[locale]}
              </h3>
              <p className="text-white/60 leading-relaxed mb-4">
                {card.description[locale]}
              </p>
              {/* 场景图 */}
              {VALUE_CARD_IMAGES[index] && (
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-4">
                  <Image
                    src={VALUE_CARD_IMAGES[index].src}
                    alt={VALUE_CARD_IMAGES[index].alt[locale]}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                </div>
              )}
              <Link
                href={`/${locale}${card.link}`}
                className={`group/link inline-flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 transition-colors ${label(locale)}`}
              >
                {learnMore}
                <motion.span
                  className="inline-block"
                  initial={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  →
                </motion.span>
              </Link>
            </div>
          </StaggerItem>
          {/* 分隔线 — LineDraw 从左到右绘制 */}
          {index < cards.length - 1 && (
            <LineDraw
              delay={0.5 + index * 0.1}
              className="h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent"
            />
          )}
        </div>
      ))}
    </StaggerContainer>
  )
}
