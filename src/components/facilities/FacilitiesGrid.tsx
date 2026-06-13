'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Facility, Locale } from '@/types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ImageWithLabel } from '@/components/ui/ImageWithLabel'
import { FilterBar } from '@/components/ui/FilterBar'

export interface FacilitiesGridProps {
  facilities: Facility[]
  locale: Locale
}

/** 设施分类 key 列表 */
type FacilityCategory = 'all' | 'onsen' | 'pet-service' | 'dining' | 'leisure' | 'eco'

const CATEGORY_KEYS: FacilityCategory[] = [
  'all',
  'onsen',
  'pet-service',
  'dining',
  'leisure',
  'eco',
]

/** 分类标签多语言映射 */
const CATEGORY_LABELS: Record<FacilityCategory, Record<Locale, string>> = {
  all: { zh: '全部', ja: 'すべて', en: 'All' },
  onsen: { zh: '温泉', ja: '温泉', en: 'Onsen' },
  'pet-service': { zh: '宠物服务', ja: 'ペットサービス', en: 'Pet Services' },
  dining: { zh: '餐饮', ja: 'お食事', en: 'Dining' },
  leisure: { zh: '休闲', ja: 'レジャー', en: 'Leisure' },
  eco: { zh: '零碳景观', ja: 'ゼロカーボン景観', en: 'Eco Landscape' },
}

/** 设施状态 Badge variant 映射 */
function getStatusBadgeVariant(status: Facility['status']): 'open' | 'coming-soon' | 'maintenance' {
  switch (status) {
    case 'open':
      return 'open'
    case 'opening_soon':
      return 'coming-soon'
    case 'maintenance':
      return 'maintenance'
  }
}

/** 设施状态文案多语言映射 */
const STATUS_LABELS: Record<Facility['status'], Record<Locale, string>> = {
  open: { zh: '已开放', ja: '営業中', en: 'Open' },
  opening_soon: { zh: '即将开放', ja: 'まもなくオープン', en: 'Opening Soon' },
  maintenance: { zh: '维护中', ja: 'メンテナンス中', en: 'Under Maintenance' },
}

/** 设施图标映射 — 使用 PNG 图标 */
const ICON_MAP: Record<string, string> = {
  'onsen-private': '/icons/icon-onsen.png',
  'onsen-shared': '/icons/icon-onsen.png',
  'pet-bath': '/icons/icon-pet-onsen.png',
  'dog-run': '/icons/icon-dog-run.png',
  'dog-run-indoor': '/icons/icon-dog-run.png',
  grooming: '/icons/icon-pet-grooming.png',
  bbq: '/icons/icon-bbq.png',
  cafe: '/icons/icon-coffee.png',
  lounge: '/icons/icon-coffee.png',
  'eco-leaf': '/icons/icon-eco-leaf.png',
}

/**
 * FacilitiesGrid 组件
 *
 * 设施卡片网格布局，支持分类筛选。
 * - 每个设施显示图片/图标、名称、描述、状态标签
 * - 零碳景观类（eco）仅展示体验描述，不显示技术参数
 * - 即将开放设施视觉灰化但可见
 * - 可链接到预约页面或 FAQ
 */
export function FacilitiesGrid({ facilities, locale }: FacilitiesGridProps) {
  const [activeCategory, setActiveCategory] = useState<FacilityCategory>('all')

  // 筛选后的设施列表
  const filteredFacilities = useMemo(() => {
    if (activeCategory === 'all') {
      return facilities
    }
    return facilities.filter((f) => f.category === activeCategory)
  }, [facilities, activeCategory])

  // 筛选栏选项
  const filterOptions = useMemo(
    () =>
      CATEGORY_KEYS.map((key) => ({
        key,
        label: CATEGORY_LABELS[key][locale],
      })),
    [locale]
  )

  return (
    <section aria-label={locale === 'zh' ? '设施列表' : locale === 'ja' ? '施設一覧' : 'Facilities List'}>
      {/* 分类筛选栏 */}
      <FilterBar
        options={filterOptions}
        activeKey={activeCategory}
        onFilter={(key) => setActiveCategory(key as FacilityCategory)}
        aria-label={
          locale === 'zh'
            ? '设施分类筛选'
            : locale === 'ja'
              ? '施設カテゴリフィルター'
              : 'Facility category filter'
        }
        className="mb-8"
      />

      {/* 响应式设施卡片网格：1列移动/2列md/3列lg */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredFacilities.map((facility) => (
          <FacilityCard key={facility.slug} facility={facility} locale={locale} />
        ))}
      </div>

      {/* 空状态 */}
      {filteredFacilities.length === 0 && (
        <p className="py-12 text-center text-stone-500">
          {locale === 'zh'
            ? '暂无该分类的设施'
            : locale === 'ja'
              ? 'このカテゴリの施設はありません'
              : 'No facilities in this category'}
        </p>
      )}
    </section>
  )
}

/** 单个设施卡片 */
function FacilityCard({ facility, locale }: { facility: Facility; locale: Locale }) {
  const isOpeningSoon = facility.status === 'opening_soon'
  const isMaintenance = facility.status === 'maintenance'
  const isGrayedOut = isOpeningSoon || isMaintenance

  return (
    <Card
      as="article"
      className={`flex flex-col transition-opacity ${isGrayedOut ? 'opacity-70' : ''}`}
      padding="none"
    >
      {/* 设施图片 — 使用 ImageWithLabel 支持"示意图"标签 */}
      {facility.image && (
        <ImageWithLabel
          src={facility.image.src}
          alt={facility.image.alt[locale]}
          width={facility.image.width}
          height={facility.image.height}
          isRendering={facility.image.isRendering}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      )}
      <div className="flex flex-col flex-1 gap-3 p-5">
        {/* 图标 + 名称与状态 */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Image
              src={ICON_MAP[facility.icon] || '/icons/icon-pet-friendly.png'}
              alt=""
              width={28}
              height={28}
              className="opacity-80"
              aria-hidden="true"
            />
            <h3 className="text-lg font-semibold text-white">
              {facility.name[locale]}
            </h3>
          </div>
          <Badge variant={getStatusBadgeVariant(facility.status)}>
            {STATUS_LABELS[facility.status][locale]}
          </Badge>
        </div>

        {/* 描述 — 零碳景观类仅展示体验描述，不包含技术参数 */}
        <p className="text-sm text-stone-300 leading-relaxed flex-1">
          {facility.description[locale]}
        </p>

        {/* 操作链接 */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-700">
          {facility.linkedBooking && (
            <Button
              variant="primary"
              size="sm"
              href={`/${locale}/booking`}
            >
              {locale === 'zh' ? '立即预约' : locale === 'ja' ? '予約する' : 'Book Now'}
            </Button>
          )}
          {facility.linkedFAQ && (
            <Link
              href={`/${locale}/faq#${facility.linkedFAQ}`}
              className="text-sm text-amber-400 hover:text-amber-300 hover:underline font-medium"
            >
              {locale === 'zh' ? '查看FAQ' : locale === 'ja' ? 'FAQを見る' : 'View FAQ'}
            </Link>
          )}
        </div>
      </div>
    </Card>
  )
}
