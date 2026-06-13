// src/app/[locale]/stay/page.tsx
// 住宿房型列表页 — React Server Component
// 展示所有房型卡片（含筛选）+ 房型对比表

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getRoomTypes } from '@/lib/cms'
import { RoomGrid } from '@/components/stay/RoomGrid'
import { RoomComparisonTable } from '@/components/stay/RoomComparisonTable'
import { isValidLocale } from '@/lib/i18n/config'
import { FadeInUp } from '@/components/motion'
import type { Locale } from '@/types'

/** 页面标题/描述多语言映射 */
const PAGE_TITLE: Record<Locale, string> = {
  zh: '住宿房型',
  ja: '客室タイプ',
  en: 'Accommodations',
}

const PAGE_SUBTITLE: Record<Locale, string> = {
  zh: '从舒适标准房到宠物友好套房，再到林间营地别墅——总有一个空间，让您与爱宠共度温泉时光',
  ja: 'スタンダードルームからペットフレンドリースイート、森のキャンプヴィラまで——愛するペットと温泉のひとときを',
  en: 'From comfortable standard rooms to pet-friendly suites and forest campsite villas — find the perfect space to share an onsen getaway with your companion',
}

const PAGE_DESCRIPTION: Record<Locale, string> = {
  zh: '浏览福岛岳温泉零碳宠物营地的全部房型，包括标准房、宠物友好房和营地别墅。',
  ja: '福島岳温泉ゼロカーボンペットキャンプの全客室タイプをご覧ください。',
  en: 'Browse all room types at Fukushima Dake Onsen Zero-Carbon Pet Camp, including standard rooms, pet-friendly rooms, and campsite villas.',
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

  return {
    title: PAGE_TITLE[locale as Locale],
    description: PAGE_DESCRIPTION[locale as Locale],
    openGraph: {
      title: PAGE_TITLE[locale as Locale],
      description: PAGE_DESCRIPTION[locale as Locale],
    },
  }
}

/** 住宿房型列表页 */
export default async function StayPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  const typedLocale = locale as Locale
  const rooms = await getRoomTypes(typedLocale)

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* 页面标题区域 */}
      <FadeInUp className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          {PAGE_TITLE[typedLocale]}
        </h1>
        <p className="mt-4 text-lg text-stone-400 max-w-3xl mx-auto">
          {PAGE_SUBTITLE[typedLocale]}
        </p>
      </FadeInUp>

      {/* 房型网格（含筛选，客户端组件） */}
      <section aria-label={PAGE_TITLE[typedLocale]}>
        <RoomGrid rooms={rooms} locale={typedLocale} />
      </section>

      {/* 房型对比表 */}
      <div className="mt-16">
        <RoomComparisonTable rooms={rooms} locale={typedLocale} />
      </div>
    </div>
  )
}
