'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'
import type { Locale, RoomType } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { ImageWithLabel } from '@/components/ui/ImageWithLabel'
import { Button } from '@/components/ui/Button'
import { subtitle as subtitleTypo, label as labelTypo, watermark as watermarkTypo } from '@/lib/i18n/locale-typo'

export interface RoomCardProps {
  room: RoomType
  locale: Locale
  /** 布局变体：standard(默认) | featured-left | featured-right | banner | editorial-left | editorial-right */
  layout?: 'standard' | 'featured-left' | 'featured-right' | 'banner' | 'editorial-left' | 'editorial-right'
}

/** 房型类别对应的 Badge variant 和文案 */
const CATEGORY_BADGE: Record<
  string,
  { variant: 'pet-friendly' | 'normal' | 'coming-soon'; label: Record<Locale, string> }
> = {
  standard: {
    variant: 'normal',
    label: { zh: '标准房', ja: 'スタンダード', en: 'Standard' },
  },
  'pet-friendly': {
    variant: 'pet-friendly',
    label: { zh: '宠物友好', ja: 'ペットフレンドリー', en: 'Pet-Friendly' },
  },
  villa: {
    variant: 'coming-soon',
    label: { zh: '营地别墅', ja: 'キャンプヴィラ', en: 'Campsite Villa' },
  },
}

/** 设施 key 对应的图标 PNG 路径 */
const AMENITY_ICONS: Record<string, string> = {
  wifi: '/icons/icon-wifi.png',
  'air-conditioning': '/icons/icon-air-conditioning.png',
  refrigerator: '/icons/icon-refrigerator.png',
  hairdryer: '/icons/icon-hairdryer.png',
  'onsen-ticket': '/icons/icon-onsen.png',
  parking: '/icons/icon-parking.png',
  balcony: '/icons/icon-terrace.png',
  towels: '/icons/icon-onsen.png',
  sofa: '/icons/icon-coffee.png',
  'pet-bed': '/icons/icon-pet-house.png',
  'pet-bowls': '/icons/icon-pet-friendly.png',
  'pet-gate': '/icons/icon-leash.png',
  'slip-resistant-floor': '/icons/icon-pet-friendly.png',
  'dog-run-access': '/icons/icon-dog-run.png',
  'private-onsen': '/icons/icon-pet-onsen.png',
  'separate-living': '/icons/icon-family.png',
  'private-bbq': '/icons/icon-bbq.png',
  'fenced-garden': '/icons/icon-eco-leaf.png',
  terrace: '/icons/icon-terrace.png',
  kitchen: '/icons/icon-coffee.png',
  washer: '/icons/icon-air-conditioning.png',
  'lake-view': '/icons/icon-eco-leaf.png',
}

/** 不可携宠警告文案 */
const NO_PET_WARNING: Record<Locale, string> = {
  zh: '不可携宠',
  ja: 'ペット不可',
  en: 'No Pets Allowed',
}

/** 宠物数量上限文案 */
const PET_LIMIT_TEXT: Record<Locale, string> = {
  zh: '最多{count}只宠物',
  ja: '最大{count}匹まで',
  en: 'Up to {count} pets',
}

/** 面积单位文案 */
const AREA_UNIT: Record<Locale, string> = {
  zh: '㎡',
  ja: '㎡',
  en: 'sqm',
}

/** 人数紧凑文案 */
const GUEST_COMPACT: Record<Locale, string> = {
  zh: '{count}人',
  ja: '{count}名',
  en: '{count} guests',
}

/** 查看详情按钮文案 */
const VIEW_DETAILS: Record<Locale, string> = {
  zh: '查看详情',
  ja: '詳細を見る',
  en: 'View Details',
}

/** 即将开放文案 */
const COMING_SOON_TEXT: Record<Locale, string> = {
  zh: '即将开放',
  ja: '近日オープン',
  en: 'Coming Soon',
}

/** Editorial 布局 — 分类标签 */
const EDITORIAL_CATEGORY_LABEL: Record<string, Record<Locale, string>> = {
  standard: { zh: 'Standard · 标准客房', ja: 'スタンダード', en: 'Standard' },
  'pet-friendly': { zh: 'Pet-Friendly · 宠物友好', ja: 'ペットフレンドリー', en: 'Pet-Friendly' },
  villa: { zh: 'Villa · 营地别墅', ja: 'キャンプヴィラ', en: 'Campsite Villa' },
}

/** Editorial 布局 — 渐变背景（按房型类别） */
const EDITORIAL_GRADIENT: Record<string, string> = {
  standard: 'from-[#2E2616] via-[#3C3020] to-[#1A1409]',
  'pet-friendly': 'from-[#1C261A] via-[#243020] to-[#101608]',
  villa: 'from-[#1E1E12] via-[#262616] to-[#101009]',
}

/** Editorial 布局 — 规格行标签 */
const EDITORIAL_SPEC_LABELS: Record<string, Record<Locale, string>> = {
  area: { zh: '面积', ja: '広さ', en: 'Area' },
  bed: { zh: '床型', ja: 'ベッドタイプ', en: 'Bed' },
  guests: { zh: '入住', ja: '宿泊', en: 'Guests' },
}

/** Editorial 布局 — 价格状态文案 */
const EDITORIAL_PRICE_TEXT: Record<string, Record<Locale, string>> = {
  inquiry: { zh: '价格请咨询 · Inquiry', ja: 'お問合せ', en: 'On Inquiry' },
  coming_soon: { zh: '价格待定 · Coming Soon', ja: '近日公開', en: 'Coming Soon' },
}

/** Editorial 布局 — CTA文案 */
const EDITORIAL_CTA: Record<Locale, string> = {
  zh: '查看详情 ↗',
  ja: '詳細を見る ↗',
  en: 'View Details ↗',
}

/**
 * RoomCard 组件 — "Luxury Suite Showcase" 豪华套房展示
 *
 * 电影画面风格：图片渐变融合信息区，底部金色渐变光带 hover 亮起，
 * serif italic 标题，极简排版，hover 图片放大效果。
 * 支持多种布局变体用于首页杂志式非对称排版。
 */
export function RoomCard({ room, locale, layout = 'standard' }: RoomCardProps) {
  const reduce = useReducedMotion()
  const mainImage = room.images[0]
  const categoryBadge = CATEGORY_BADGE[room.category]
  const displayedAmenities = room.amenities.slice(0, 4)
  const isComingSoon = room.status === 'coming_soon'
  const isBanner = layout === 'banner'
  const isFeatured = layout === 'featured-left' || layout === 'featured-right'

  /* ===== Editorial-Left/Right 布局：Hoshinoya Editorial 杂志对开风格 ===== */
  if (layout === 'editorial-left' || layout === 'editorial-right') {
    const isRight = layout === 'editorial-right'
    const gradient = EDITORIAL_GRADIENT[room.category] || EDITORIAL_GRADIENT.standard
    const catLabel = (EDITORIAL_CATEGORY_LABEL[room.category] || {})[locale] || room.category
    const priceText = (EDITORIAL_PRICE_TEXT[room.priceStatus] || {})[locale] || room.priceStatus
    const isInquiry = room.priceStatus === 'inquiry'
    const indexNum = String(room.sortOrder).padStart(2, '0')

    return (
      <article className="flex flex-col lg:flex-row border-b border-[rgba(234,224,204,0.08)]">
        {/* 图片面板 */}
        <div
          className={`relative w-full lg:w-[55%] min-h-[280px] lg:min-h-[520px] overflow-hidden flex-shrink-0 ${isRight ? 'lg:order-2' : 'lg:order-1'}`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(160,120,80,0.06),transparent_60%)]" />
          {mainImage && (
            <Image
              src={mainImage.src}
              alt={mainImage.alt[locale]}
              fill
              className="object-cover opacity-25 mix-blend-luminosity"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          )}
          <div className="absolute bottom-5 left-6 text-[10px] tracking-[0.2em] text-[rgba(234,224,204,0.3)] font-light">
            Concept Render · 概念示意
          </div>
          <div className="absolute top-5 right-5 text-[11px] text-[rgba(234,224,204,0.3)] tracking-[0.15em]">
            {indexNum}
          </div>
          {isComingSoon && (
            <div className="absolute top-5 left-5 text-[9px] tracking-[0.25em] uppercase text-[rgba(234,224,204,0.35)] border border-[rgba(234,224,204,0.1)] px-3 py-1.5 bg-[rgba(25,22,15,0.75)] backdrop-blur-sm">
              即将开放 · Coming Soon
            </div>
          )}
        </div>

        {/* 内容面板 */}
        <div
          className={`flex-1 bg-[#211D14] px-8 py-10 lg:px-12 lg:py-[52px] flex flex-col justify-center ${isComingSoon ? 'opacity-70' : ''} ${isRight ? 'lg:order-1' : 'lg:order-2'}`}
          style={{
            borderLeft: !isRight ? '1px solid rgba(234,224,204,0.08)' : undefined,
            borderRight: isRight ? '1px solid rgba(234,224,204,0.08)' : undefined,
          }}
        >
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#A07850] mb-4">{catLabel}</div>
          <h3 className="font-serif text-[clamp(22px,2.5vw,36px)] font-normal leading-[1.2] text-[#EAE0CC] mb-1.5">
            {room.name[locale]}
          </h3>
          {locale !== 'en' && (
            <div className="font-serif italic text-[13px] text-[rgba(234,224,204,0.35)] mb-7">
              {room.name.en}
            </div>
          )}
          <p className="text-[14px] leading-[1.9] text-[rgba(234,224,204,0.6)] mb-8 line-clamp-3">
            {room.description[locale]}
          </p>
          {/* 规格行 */}
          <div className="flex border-t border-b border-[rgba(234,224,204,0.08)] mb-7">
            <div className="flex-1 px-3 py-3.5 border-r border-[rgba(234,224,204,0.08)]">
              <div className="text-[9px] tracking-[0.2em] uppercase text-[rgba(234,224,204,0.35)] mb-1.5">
                {EDITORIAL_SPEC_LABELS.area[locale]}
              </div>
              <div className="text-[13px] text-[#EAE0CC]">{room.area} ㎡</div>
            </div>
            <div className="flex-1 px-3 py-3.5 border-r border-[rgba(234,224,204,0.08)]">
              <div className="text-[9px] tracking-[0.2em] uppercase text-[rgba(234,224,204,0.35)] mb-1.5">
                {EDITORIAL_SPEC_LABELS.bed[locale]}
              </div>
              <div className="text-[13px] text-[#EAE0CC] truncate">{room.bedType[locale]}</div>
            </div>
            <div className="flex-1 px-3 py-3.5">
              <div className="text-[9px] tracking-[0.2em] uppercase text-[rgba(234,224,204,0.35)] mb-1.5">
                {EDITORIAL_SPEC_LABELS.guests[locale]}
              </div>
              <div className="text-[13px] text-[#EAE0CC]">
                {locale === 'zh'
                  ? `最多 ${room.maxGuests} 位`
                  : locale === 'ja'
                    ? `最大 ${room.maxGuests} 名`
                    : `Up to ${room.maxGuests}`}
              </div>
            </div>
          </div>
          {/* 价格标签 */}
          <div className="mb-6">
            <span
              className={`text-[10px] tracking-[0.2em] uppercase px-4 py-2 inline-block border ${
                isInquiry
                  ? 'border-[rgba(160,120,80,0.3)] text-[#A07850]'
                  : 'border-[rgba(234,224,204,0.1)] text-[rgba(234,224,204,0.35)]'
              }`}
            >
              {priceText}
            </span>
          </div>
          {/* 标签 */}
          <div className="flex flex-wrap gap-1.5 mb-7">
            {room.tags[locale].map((tag) => (
              <span
                key={tag}
                className={`text-[10px] tracking-[0.12em] px-2.5 py-1 border ${
                  room.isPetFriendly
                    ? 'border-[rgba(160,120,80,0.25)] text-[#A07850]'
                    : 'border-[rgba(234,224,204,0.08)] text-[rgba(234,224,204,0.35)]'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
          {/* CTA */}
          {!isComingSoon && (
            <a
              href={`/${locale}/stay/${room.slug}`}
              className="inline-flex items-center gap-2.5 text-[12px] tracking-[0.15em] text-[#EAE0CC] no-underline pb-0.5 w-fit hover:text-[#A07850] transition-colors duration-300"
              style={{ borderBottom: '1px solid #A07850' }}
            >
              {EDITORIAL_CTA[locale]}
            </a>
          )}
        </div>
      </article>
    )
  }

  /* ===== Banner 布局：全宽横幅，图上文下 ===== */
  if (isBanner) {
    return (
      <article className="group relative rounded-2xl overflow-hidden bg-[#0f0f0f]">
        <div className="flex flex-col">
          {mainImage && (
            <div className="relative w-full h-[240px] sm:h-[320px] overflow-hidden">
              <ImageWithLabel
                src={mainImage.src}
                alt={mainImage.alt[locale]}
                width={mainImage.width}
                height={mainImage.height}
                isRendering={mainImage.isRendering}
                className="w-full h-full object-cover opacity-50 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/40 to-transparent pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-3xl sm:text-5xl font-serif font-light text-white/15 select-none ${watermarkTypo(locale)}`}>
                  {COMING_SOON_TEXT[locale]}
                </span>
              </div>
              {categoryBadge && (
                <div className="absolute top-3 left-3">
                  <Badge variant={categoryBadge.variant}>{categoryBadge.label[locale]}</Badge>
                </div>
              )}
              {isComingSoon && (
                <div className="absolute top-3 right-3">
                  <Badge variant="coming-soon">{COMING_SOON_TEXT[locale]}</Badge>
                </div>
              )}
            </div>
          )}
          <div className="relative p-6 lg:px-12 lg:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className={`text-xl lg:text-2xl font-serif text-white/70 ${subtitleTypo(locale)}`}>
                {room.name[locale]}
              </h3>
              <div className="mt-2 flex items-center gap-3">
                <Badge variant="pet-friendly">🐾 {CATEGORY_BADGE['pet-friendly'].label[locale]}</Badge>
                <span className="text-xs text-white/40">
                  {room.area}{AREA_UNIT[locale]} · {GUEST_COMPACT[locale].replace('{count}', String(room.maxGuests))} · {room.bedType[locale]}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                {displayedAmenities.map((amenity) => (
                  <span key={amenity} className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 border border-white/10" title={amenity} aria-label={amenity}>
                    {AMENITY_ICONS[amenity]
                      ? <Image src={AMENITY_ICONS[amenity]} alt={amenity} width={16} height={16} className="opacity-80" />
                      : <span className="text-xs text-white/30">•</span>
                    }
                  </span>
                ))}
              </div>
            </div>
            <div className="text-2xl font-light shrink-0">
              <PriceDisplay status={room.priceStatus} price={room.price} locale={locale} />
            </div>
          </div>
        </div>
        <motion.div
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduce ? 0 : 1, delay: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ originX: 0.5 }}
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent group-hover:via-amber-500/40 transition-colors duration-500"
        />
      </article>
    )
  }

  /* ===== Featured 布局：大图侧边，非对称杂志排版 ===== */
  if (isFeatured) {
    const isReverse = layout === 'featured-right'
    return (
      <article className="group relative rounded-2xl overflow-hidden bg-[#0f0f0f]">
        <div className="flex flex-col lg:flex-row">
          {/* 图片区 — 占 60% */}
          {mainImage && (
            <div className={`relative w-full aspect-[16/10] lg:w-[60%] lg:aspect-auto lg:min-h-[420px] overflow-hidden ${isReverse ? 'lg:order-2' : ''}`}>
              <ImageWithLabel
                src={mainImage.src}
                alt={mainImage.alt[locale]}
                width={mainImage.width}
                height={mainImage.height}
                isRendering={mainImage.isRendering}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)] pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0f0f0f] to-transparent lg:hidden pointer-events-none" />
              {categoryBadge && (
                <div className="absolute top-3 left-3">
                  <Badge variant={categoryBadge.variant}>{categoryBadge.label[locale]}</Badge>
                </div>
              )}
              {isComingSoon && (
                <div className="absolute top-3 right-3">
                  <Badge variant="coming-soon">{COMING_SOON_TEXT[locale]}</Badge>
                </div>
              )}
            </div>
          )}
          {/* 信息区 — 占 40% */}
          <div className={`relative p-6 lg:w-[40%] lg:p-8 flex flex-col justify-between group-hover:translate-x-1 transition-transform duration-300 ${isReverse ? 'lg:order-1 group-hover:-translate-x-1' : ''}`}>
            <div>
              <h3 className={`text-xl lg:text-2xl font-serif text-white group-hover:text-amber-400 transition-colors duration-300 ${subtitleTypo(locale)}`}>
                {room.name[locale]}
              </h3>
              <div className="mt-2">
                {room.isPetFriendly ? (
                  <div className="flex items-center gap-2">
                    <Badge variant="pet-friendly">🐾 {CATEGORY_BADGE['pet-friendly'].label[locale]}</Badge>
                    <span className="text-xs text-white/40">
                      {PET_LIMIT_TEXT[locale].replace('{count}', String(room.maxPets))}
                    </span>
                  </div>
                ) : (
                  <Badge variant="maintenance">🚫 {NO_PET_WARNING[locale]}</Badge>
                )}
              </div>
              <p className="mt-3 text-sm text-white/40">
                {room.area}{AREA_UNIT[locale]} · {GUEST_COMPACT[locale].replace('{count}', String(room.maxGuests))} · {room.bedType[locale]}
              </p>
              <div className="mt-4 flex gap-2">
                {displayedAmenities.map((amenity) => (
                  <span key={amenity} className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 border border-white/10" title={amenity} aria-label={amenity}>
                    {AMENITY_ICONS[amenity]
                      ? <Image src={AMENITY_ICONS[amenity]} alt={amenity} width={16} height={16} className="opacity-80" />
                      : <span className="text-xs text-white/30">•</span>
                    }
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 flex items-end justify-between">
              <div className="text-2xl font-light">
                <PriceDisplay status={room.priceStatus} price={room.price} locale={locale} />
              </div>
              <Button variant="outline" size="sm" href={`/${locale}/stay/${room.slug}`} className={`text-xs ${labelTypo(locale)}`}>
                {VIEW_DETAILS[locale]}
              </Button>
            </div>
          </div>
        </div>
        <motion.div
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduce ? 0 : 1, delay: reduce ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ originX: 0.5 }}
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent group-hover:via-amber-500/80 transition-colors duration-500"
        />
      </article>
    )
  }

  /* ===== Standard 布局（原有逻辑） ===== */
  return (
    <article className="group relative rounded-2xl overflow-hidden bg-[#0f0f0f]">
      <div className="flex flex-col lg:flex-row">
        {mainImage && (
          <div className="relative w-full aspect-[16/10] lg:w-[45%] lg:aspect-auto lg:min-h-[320px] overflow-hidden">
            <ImageWithLabel
              src={mainImage.src}
              alt={mainImage.alt[locale]}
              width={mainImage.width}
              height={mainImage.height}
              isRendering={mainImage.isRendering}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 45vw"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)] pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0f0f0f] to-transparent lg:hidden pointer-events-none" />
            {categoryBadge && (
              <div className="absolute top-3 left-3">
                <Badge variant={categoryBadge.variant}>{categoryBadge.label[locale]}</Badge>
              </div>
            )}
            {isComingSoon && (
              <div className="absolute top-3 right-3">
                <Badge variant="coming-soon">{COMING_SOON_TEXT[locale]}</Badge>
              </div>
            )}
          </div>
        )}
        <div className="relative p-6 lg:w-[55%] lg:p-8 flex flex-col justify-between">
          <div>
            <h3 className={`text-xl lg:text-2xl font-serif text-white group-hover:text-amber-400 transition-colors duration-300 ${subtitleTypo(locale)}`}>
              {room.name[locale]}
            </h3>
            <div className="mt-2">
              {room.isPetFriendly ? (
                <div className="flex items-center gap-2">
                  <Badge variant="pet-friendly">🐾 {CATEGORY_BADGE['pet-friendly'].label[locale]}</Badge>
                  <span className="text-xs text-white/40">
                    {PET_LIMIT_TEXT[locale].replace('{count}', String(room.maxPets))}
                  </span>
                </div>
              ) : (
                <Badge variant="maintenance">🚫 {NO_PET_WARNING[locale]}</Badge>
              )}
            </div>
            <p className="mt-3 text-sm text-white/40">
              {room.area}{AREA_UNIT[locale]} · {GUEST_COMPACT[locale].replace('{count}', String(room.maxGuests))} · {room.bedType[locale]}
            </p>
            <div className="mt-4 flex gap-2">
              {displayedAmenities.map((amenity) => (
                <span key={amenity} className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 border border-white/10" title={amenity} aria-label={amenity}>
                  {AMENITY_ICONS[amenity]
                    ? <Image src={AMENITY_ICONS[amenity]} alt={amenity} width={16} height={16} className="opacity-80" />
                    : <span className="text-xs text-white/30">•</span>
                  }
                </span>
              ))}
            </div>
          </div>
          <div className="mt-6 flex items-end justify-between">
            <div className="text-2xl font-light">
              <PriceDisplay status={room.priceStatus} price={room.price} locale={locale} />
            </div>
            <Button variant="outline" size="sm" href={`/${locale}/stay/${room.slug}`} className={`text-xs ${labelTypo(locale)}`}>
              {VIEW_DETAILS[locale]}
            </Button>
          </div>
        </div>
      </div>
      <motion.div
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: reduce ? 0 : 1, delay: reduce ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ originX: 0.5 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent group-hover:via-amber-500/80 transition-colors duration-500"
      />
    </article>
  )
}
