// src/app/[locale]/gallery/page.tsx
// 画廊页 — React Server Component
// 展示图片画廊，支持分类筛选、Lightbox 全屏查看、概念图标注、关联跳转

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getGalleryAssets } from '@/lib/cms'
import { isValidLocale, BCP47_MAP, BASE_URL } from '@/lib/i18n/config'
import type { Locale } from '@/lib/i18n/config'
import { generateHreflangLinks } from '@/lib/i18n/hreflang'
import { GalleryGrid } from '@/components/gallery/GalleryGrid'

/** 页面标题多语言映射 */
const PAGE_TITLE: Record<Locale, string> = {
  zh: '画廊',
  ja: 'ギャラリー',
  en: 'Gallery',
}

/** 页面副标题多语言映射 */
const PAGE_SUBTITLE: Record<Locale, string> = {
  zh: '用镜头记录温泉与宠物的美好时光',
  ja: '温泉とペットの素敵な時間をカメラに収めて',
  en: 'Capturing beautiful moments of onsen and pets through the lens',
}

/** 页面描述多语言映射 */
const PAGE_DESCRIPTION: Record<Locale, string> = {
  zh: '浏览福岛岳温泉零碳宠物营地的精美照片，包括客房、温泉、宠物设施、活动和周边景观。',
  ja: '福島岳温泉ゼロカーボンペットキャンプの写真ギャラリー。客室、温泉、ペット施設、アクティビティ、周辺景観をご覧ください。',
  en: 'Browse photos of Fukushima Dake Onsen Zero-Carbon Pet Camp, including rooms, onsen, pet facilities, activities, and surrounding scenery.',
}

/** 生成页面元数据 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    return {}
  }

  const title = PAGE_TITLE[locale]
  const description = PAGE_DESCRIPTION[locale]
  const hreflangLinks = generateHreflangLinks('/gallery')

  return {
    title,
    description,
    alternates: {
      languages: Object.fromEntries(
        hreflangLinks.map((link) => [link.locale, link.href])
      ),
    },
    openGraph: {
      title,
      description,
      locale: BCP47_MAP[locale],
      type: 'website',
      url: `${BASE_URL}/${locale}/gallery`,
    },
  }
}

/** 画廊页 */
export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  const typedLocale = locale as Locale
  const assets = await getGalleryAssets()

  const kicker: Record<Locale, string> = {
    zh: 'Gallery · 影像画廊',
    ja: 'ギャラリー',
    en: 'Photo Gallery',
  }

  return (
    <div className="bg-[#19160F] text-[#EAE0CC] min-h-screen">
      {/* Editorial 页头 */}
      <header
        className="px-8 lg:px-[60px] pt-[60px] lg:pt-[80px] pb-[40px] lg:pb-[60px]"
        style={{ borderBottom: '1px solid rgba(234,224,204,0.08)' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[60px] items-end">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#A07850] mb-4">
              {kicker[typedLocale]}
            </p>
            <h1
              className="font-serif font-normal leading-[1.1] text-[#EAE0CC]"
              style={{ fontSize: 'clamp(32px,4.5vw,60px)' }}
            >
              {PAGE_TITLE[typedLocale]}
              <br />
              <em className="italic" style={{ color: 'rgba(234,224,204,0.55)' }}>
                {typedLocale === 'zh' ? '用镜头记录美好' : typedLocale === 'ja' ? '美しい時間を画像に' : 'Moments in Frame'}
              </em>
            </h1>
          </div>
          <div className="lg:pb-1">
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(234,224,204,0.6)' }}>
              {PAGE_SUBTITLE[typedLocale]}
            </p>
            <div
              className="flex gap-8 mt-6 pt-6"
              style={{ borderTop: '1px solid rgba(234,224,204,0.08)' }}
            >
              <div>
                <p className="font-serif text-2xl text-[#EAE0CC]">15</p>
                <p className="text-[10px] tracking-[0.15em] uppercase mt-1" style={{ color: 'rgba(234,224,204,0.4)' }}>
                  {typedLocale === 'zh' ? '影像' : typedLocale === 'ja' ? '写真' : 'Photos'}
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl text-[#EAE0CC]">8</p>
                <p className="text-[10px] tracking-[0.15em] uppercase mt-1" style={{ color: 'rgba(234,224,204,0.4)' }}>
                  {typedLocale === 'zh' ? '主题分类' : typedLocale === 'ja' ? 'カテゴリー' : 'Categories'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 画廊网格（含分类筛选 + Lightbox + 概念图标注 + 关联跳转） */}
      <section className="px-8 lg:px-[60px] py-12 lg:py-16">
        <GalleryGrid assets={assets} locale={typedLocale} />
      </section>
    </div>
  )
}
