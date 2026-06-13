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
  /** 布局变体：standard(默认) | featured-left(图左文右大图) | featured-right(文左图右大图) | banner(全宽横幅) */
  layout?: 'standard' | 'featured-left' | 'featured-right' | 'banner'
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
