'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import type { GalleryAsset, GalleryCategory, Locale } from '@/types'
import { FilterBar } from '@/components/ui/FilterBar'
import { ImageWithLabel } from '@/components/ui/ImageWithLabel'
import { Lightbox } from '@/components/ui/Lightbox'
import type { LightboxImage } from '@/components/ui/Lightbox'

export interface GalleryGridProps {
  assets: GalleryAsset[]
  locale: Locale
}

/** 画廊分类筛选 key 列表 */
const CATEGORY_KEYS: GalleryCategory[] = [
  'all',
  'room',
  'onsen',
  'pet',
  'dog-run',
  'bbq-cafe',
  'activity',
  'nearby',
  'eco',
]

/** 分类标签多语言映射 */
const CATEGORY_LABELS: Record<GalleryCategory, Record<Locale, string>> = {
  all: { zh: '全部', ja: 'すべて', en: 'All' },
  room: { zh: '房间', ja: '客室', en: 'Rooms' },
  onsen: { zh: '温泉', ja: '温泉', en: 'Onsen' },
  pet: { zh: '宠物', ja: 'ペット', en: 'Pets' },
  'dog-run': { zh: 'Dog Run', ja: 'ドッグラン', en: 'Dog Run' },
  'bbq-cafe': { zh: 'BBQ & Cafe', ja: 'BBQ＆カフェ', en: 'BBQ & Café' },
  activity: { zh: '活动', ja: 'アクティビティ', en: 'Activities' },
  nearby: { zh: '周边', ja: '周辺', en: 'Nearby' },
  eco: { zh: '零碳景观', ja: 'ゼロカーボン', en: 'Eco' },
}

/** 关联跳转链接文案 */
const LINK_LABEL: Record<Locale, string> = {
  zh: '查看详情',
  ja: '詳しく見る',
  en: 'View details',
}

/**
 * GalleryGrid 组件
 *
 * 响应式图片网格布局，支持分类筛选、Lightbox 全屏查看和关联跳转。
 * - 移动端 2 列，平板 3 列，桌面 4 列
 * - 点击图片打开 Lightbox
 * - 概念图（isRendering）自动显示"示意图"标签
 * - 有 linkedPage 的图片显示关联跳转入口
 */
export function GalleryGrid({ assets, locale }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('all')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // 筛选后的资源列表
  const filteredAssets = useMemo(() => {
    if (activeCategory === 'all') {
      return [...assets].sort((a, b) => a.sortOrder - b.sortOrder)
    }
    return assets
      .filter((asset) => asset.category === activeCategory)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  }, [assets, activeCategory])

  // 转换为 Lightbox 需要的图片格式
  const lightboxImages: LightboxImage[] = useMemo(
    () =>
      filteredAssets.map((asset) => ({
        src: asset.src,
        alt: asset.alt[locale],
        caption: asset.alt[locale],
      })),
    [filteredAssets, locale]
  )

  // 筛选栏选项
  const filterOptions = useMemo(
    () =>
      CATEGORY_KEYS.map((key) => ({
        key,
        label: CATEGORY_LABELS[key][locale],
      })),
    [locale]
  )

  const handleImageClick = useCallback((index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }, [])

  const handleLightboxClose = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  return (
    <section aria-label={locale === 'zh' ? '图片画廊' : locale === 'ja' ? 'フォトギャラリー' : 'Photo Gallery'}>
      {/* 分类筛选栏 */}
      <FilterBar
        options={filterOptions}
        activeKey={activeCategory}
        onFilter={(key) => setActiveCategory(key as GalleryCategory)}
        aria-label={locale === 'zh' ? '画廊分类筛选' : locale === 'ja' ? 'ギャラリーカテゴリ' : 'Gallery category filter'}
        className="mb-6"
      />

      {/* 响应式图片瀑布流：Masonry Filmstrip */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
        {filteredAssets.map((asset, index) => (
          <div
            key={asset.id}
            className="group relative overflow-hidden rounded-lg mb-3 break-inside-avoid shadow-sm transition-shadow hover:shadow-md"
          >
            <ImageWithLabel
              src={asset.src}
              alt={asset.alt[locale]}
              width={asset.width}
              height={asset.height}
              isRendering={asset.isRendering}
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              className="cursor-pointer group-hover:scale-[1.03] transition-transform duration-700"
              onClick={() => handleImageClick(index)}
            />

            {/* Hover caption overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <p className="text-xs text-white/80">{asset.alt[locale]}</p>
            </div>

            {/* 关联跳转入口：从房间照片跳转到房型页，从宠物照片跳转到宠物友好页等 */}
            {asset.linkedPage && (
              <Link
                href={`/${locale}${asset.linkedPage}`}
                className="absolute bottom-2 right-2 z-10 rounded bg-stone-800/90 px-2 py-1 text-xs font-medium text-stone-200 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 focus:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 hover:bg-stone-800"
                onClick={(e) => e.stopPropagation()}
              >
                {LINK_LABEL[locale]} →
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* 空状态 */}
      {filteredAssets.length === 0 && (
        <p className="py-12 text-center text-stone-500">
          {locale === 'zh'
            ? '暂无该分类的图片'
            : locale === 'ja'
              ? 'このカテゴリの画像はありません'
              : 'No images in this category'}
        </p>
      )}

      {/* Lightbox 全屏查看 */}
      <Lightbox
        images={lightboxImages}
        initialIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={handleLightboxClose}
      />
    </section>
  )
}
