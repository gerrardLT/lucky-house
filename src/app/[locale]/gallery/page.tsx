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

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* 页面标题区域 */}
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          {PAGE_TITLE[typedLocale]}
        </h1>
        <p className="mt-4 text-lg text-stone-400 max-w-2xl mx-auto">
          {PAGE_SUBTITLE[typedLocale]}
        </p>
      </header>

      {/* 画廊网格（含分类筛选 + Lightbox + 概念图标注 + 关联跳转） */}
      <GalleryGrid assets={assets} locale={typedLocale} />
    </div>
  )
}
