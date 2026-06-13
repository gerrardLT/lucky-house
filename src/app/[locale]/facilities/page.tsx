// src/app/[locale]/facilities/page.tsx
// 温泉与设施页 — React Server Component
// 展示所有设施卡片，支持分类筛选、状态标签
// 零碳景观仅展示体验描述，不出现 B 端技术参数

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getFacilities } from '@/lib/cms'
import { isValidLocale, BCP47_MAP, BASE_URL } from '@/lib/i18n/config'
import type { Locale } from '@/lib/i18n/config'
import { generateHreflangLinks } from '@/lib/i18n/hreflang'
import { FacilitiesGrid } from '@/components/facilities/FacilitiesGrid'
import { FadeInUp } from '@/components/motion'

/** 页面 SEO 元数据 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    return {}
  }

  const title = locale === 'zh'
    ? '温泉与设施'
    : locale === 'ja'
      ? '温泉・施設'
      : 'Onsen & Facilities'

  const description = locale === 'zh'
    ? '探索福岛岳温泉零碳宠物营地的温泉、宠物服务、餐饮、休闲设施和零碳景观体验。'
    : locale === 'ja'
      ? '福島岳温泉ゼロカーボンペットキャンプの温泉、ペットサービス、お食事、レジャー施設、ゼロカーボン景観をご紹介します。'
      : 'Explore onsen baths, pet services, dining, leisure facilities, and zero-carbon landscape experiences at Fukushima Dake Onsen Pet Camp.'

  const hreflangLinks = generateHreflangLinks('/facilities')

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
      locale: BCP47_MAP[locale as Locale],
      type: 'website',
      url: `${BASE_URL}/${locale}/facilities`,
    },
  }
}

/** 温泉与设施页 */
export default async function FacilitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  const facilities = await getFacilities(locale as Locale)

  // 页面标题文案
  const pageTitle = locale === 'zh'
    ? '温泉与设施'
    : locale === 'ja'
      ? '温泉・施設'
      : 'Onsen & Facilities'

  const pageSubtitle = locale === 'zh'
    ? '在岳温泉的自然怀抱中，享受丰富的设施体验'
    : locale === 'ja'
      ? '岳温泉の自然の中で、充実した施設をお楽しみください'
      : 'Enjoy a rich variety of facilities in the embrace of Dake Onsen\'s nature'

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* 页面标题 / Hero 区域 */}
      <FadeInUp className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          {pageTitle}
        </h1>
        <p className="mt-4 text-lg text-stone-400 max-w-2xl mx-auto">
          {pageSubtitle}
        </p>
      </FadeInUp>

      {/* 设施卡片网格 + 筛选 */}
      <FacilitiesGrid facilities={facilities} locale={locale as Locale} />
    </div>
  )
}
