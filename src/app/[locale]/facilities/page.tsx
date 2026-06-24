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

  const kicker = locale === 'zh'
    ? 'Facilities · 设施一览'
    : locale === 'ja'
      ? '施設ガイド'
      : 'Facilities Guide'

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
              {kicker}
            </p>
            <h1
              className="font-serif font-normal leading-[1.1] text-[#EAE0CC]"
              style={{ fontSize: 'clamp(32px,4.5vw,60px)' }}
            >
              {pageTitle}
              <br />
              <em className="italic" style={{ color: 'rgba(234,224,204,0.55)' }}>
                {locale === 'zh' ? 'Onsen & Facilities' : locale === 'ja' ? 'Onsen & Facilities' : 'Onsen & Facilities'}
              </em>
            </h1>
          </div>
          <div className="lg:pb-1">
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(234,224,204,0.6)' }}>
              {pageSubtitle}
            </p>
            <div
              className="flex gap-8 mt-6 pt-6"
              style={{ borderTop: '1px solid rgba(234,224,204,0.08)' }}
            >
              <div>
                <p className="font-serif text-2xl text-[#EAE0CC]">10</p>
                <p className="text-[10px] tracking-[0.15em] uppercase mt-1" style={{ color: 'rgba(234,224,204,0.4)' }}>
                  {locale === 'zh' ? '项设施' : locale === 'ja' ? '施設' : 'Facilities'}
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl text-[#EAE0CC]">5</p>
                <p className="text-[10px] tracking-[0.15em] uppercase mt-1" style={{ color: 'rgba(234,224,204,0.4)' }}>
                  {locale === 'zh' ? '大类别' : locale === 'ja' ? 'カテゴリー' : 'Categories'}
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl text-[#EAE0CC]">2</p>
                <p className="text-[10px] tracking-[0.15em] uppercase mt-1" style={{ color: 'rgba(234,224,204,0.4)' }}>
                  {locale === 'zh' ? '温泉浴池' : locale === 'ja' ? '温泉風呂' : 'Onsen Baths'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 设施卡片网格 + 筛选 */}
      <section className="px-8 lg:px-[60px] py-12 lg:py-16">
        <FacilitiesGrid facilities={facilities} locale={locale as Locale} />
      </section>
    </div>
  )
}
