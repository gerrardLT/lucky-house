// src/app/[locale]/explore/page.tsx
// 周边探索页 — React Server Component
// 展示 Google Maps 嵌入（lazy-load）、周边玩法卡片、行程推荐、季节内容
// Requirements: 9.1–9.7

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getExploreData } from '@/lib/cms'
import { isValidLocale, BCP47_MAP, BASE_URL } from '@/lib/i18n/config'
import type { Locale } from '@/lib/i18n/config'
import { generateHreflangLinks } from '@/lib/i18n/hreflang'
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

  const title =
    locale === 'zh'
      ? '周边探索'
      : locale === 'ja'
        ? '周辺探索'
        : 'Explore Nearby'

  const description =
    locale === 'zh'
      ? '探索福岛岳温泉周边景点、行程推荐和四季体验。规划您的完美短途旅行。'
      : locale === 'ja'
        ? '福島岳温泉周辺の観光スポット、おすすめプラン、四季の体験をご紹介します。'
        : 'Explore nearby attractions, recommended itineraries, and seasonal experiences around Fukushima Dake Onsen.'

  const hreflangLinks = generateHreflangLinks('/explore')

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
      url: `${BASE_URL}/${locale}/explore`,
    },
  }
}

/** 分类名称本地化 */
function getCategoryLabel(category: string, locale: Locale): string {
  const labels: Record<string, Record<Locale, string>> = {
    onsen: { zh: '温泉', ja: '温泉', en: 'Onsen' },
    nature: { zh: '自然', ja: '自然', en: 'Nature' },
    attraction: { zh: '景点', ja: '観光', en: 'Attraction' },
    culture: { zh: '文化', ja: '文化', en: 'Culture' },
    food: { zh: '美食', ja: 'グルメ', en: 'Food' },
  }
  return labels[category]?.[locale] ?? category
}

/** 季节图标 */
const seasonIcons: Record<string, string> = {
  spring: '🌸',
  summer: '☀️',
  autumn: '🍁',
  winter: '❄️',
}

/** 周边探索页 */
export default async function ExplorePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params

  if (!isValidLocale(localeParam)) {
    notFound()
  }

  const locale = localeParam as Locale
  const exploreData = await getExploreData()

  // 页面标题文案
  const pageTitle =
    locale === 'zh'
      ? '周边探索'
      : locale === 'ja'
        ? '周辺探索'
        : 'Explore Nearby'

  const pageSubtitle =
    locale === 'zh'
      ? '从岳温泉出发，探索福岛二本松地区的丰富体验'
      : locale === 'ja'
        ? '岳温泉を拠点に、福島二本松エリアの豊かな体験を探索'
        : 'Starting from Dake Onsen, discover the rich experiences of Fukushima Nihonmatsu area'

  const mapSectionTitle =
    locale === 'zh'
      ? '位置与交通'
      : locale === 'ja'
        ? 'アクセス'
        : 'Location & Access'

  const spotsSectionTitle =
    locale === 'zh'
      ? '周边玩法'
      : locale === 'ja'
        ? '周辺スポット'
        : 'Nearby Spots'

  const itinerarySectionTitle =
    locale === 'zh'
      ? '行程推荐'
      : locale === 'ja'
        ? 'おすすめプラン'
        : 'Recommended Itineraries'

  const seasonSectionTitle =
    locale === 'zh'
      ? '四季体验'
      : locale === 'ja'
        ? '四季の楽しみ方'
        : 'Seasonal Experiences'

  const distanceLabel =
    locale === 'zh'
      ? '距离'
      : locale === 'ja'
        ? '距離'
        : 'Distance'

  return (
    <div className="bg-[#19160F] text-[#EAE0CC] min-h-screen">
      {/* 1. Editorial 页头 */}
      <header
        className="px-8 lg:px-[60px] pt-[60px] lg:pt-[80px] pb-[40px] lg:pb-[60px]"
        style={{ borderBottom: '1px solid rgba(234,224,204,0.08)' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[60px] items-end">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#A07850] mb-4">
              {locale === 'zh' ? 'Explore · 周边探索' : locale === 'ja' ? '周辺アクセス' : 'Explore Nearby'}
            </p>
            <h1
              className="font-serif font-normal leading-[1.1] text-[#EAE0CC]"
              style={{ fontSize: 'clamp(32px,4.5vw,60px)' }}
            >
              {pageTitle}
              <br />
              <em className="italic" style={{ color: 'rgba(234,224,204,0.55)' }}>
                {locale === 'zh' ? '二本松‧福岛托著山' : locale === 'ja' ? '二本松の山鹿と温泉' : 'Nihonmatsu & Beyond'}
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
                <p className="font-serif text-2xl text-[#EAE0CC]">{exploreData.spots.length}</p>
                <p className="text-[10px] tracking-[0.15em] uppercase mt-1" style={{ color: 'rgba(234,224,204,0.4)' }}>
                  {locale === 'zh' ? '周边玩法' : locale === 'ja' ? 'スポット' : 'Spots'}
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl text-[#EAE0CC]">{exploreData.itineraries.length}</p>
                <p className="text-[10px] tracking-[0.15em] uppercase mt-1" style={{ color: 'rgba(234,224,204,0.4)' }}>
                  {locale === 'zh' ? '推荐行程' : locale === 'ja' ? 'プラン' : 'Itineraries'}
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl text-[#EAE0CC]">4</p>
                <p className="text-[10px] tracking-[0.15em] uppercase mt-1" style={{ color: 'rgba(234,224,204,0.4)' }}>
                  {locale === 'zh' ? '四季体验' : locale === 'ja' ? '四季' : 'Seasons'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
  
      {/* 2. 地图区域 */}
      <section
        className="px-8 lg:px-[60px] py-12 lg:py-16"
        style={{ borderBottom: '1px solid rgba(234,224,204,0.08)' }}
        aria-labelledby="map-section-title"
      >
        <h2
          id="map-section-title"
          className="text-[10px] tracking-[0.2em] uppercase text-[#A07850] mb-6"
        >
          {mapSectionTitle}
        </h2>
        <div
          className="overflow-hidden"
          style={{ border: '1px solid rgba(234,224,204,0.08)' }}
        >
          <iframe
            title={
              locale === 'zh'
                ? '福岛岳温泉位置地图'
                : locale === 'ja'
                  ? '福峳岳温泉の地図'
                  : 'Fukushima Dake Onsen Location Map'
            }
            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${exploreData.mapCenter.lat},${exploreData.mapCenter.lng}&zoom=13&language=${locale}`}
            width="100%"
            height="420"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
  
      {/* 3. 周边玩法卡片 */}
      <section
        className="px-8 lg:px-[60px] py-12 lg:py-16"
        style={{ borderBottom: '1px solid rgba(234,224,204,0.08)' }}
        aria-labelledby="spots-section-title"
      >
        <h2
          id="spots-section-title"
          className="text-[10px] tracking-[0.2em] uppercase text-[#A07850] mb-8"
        >
          {spotsSectionTitle}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {exploreData.spots.map((spot, index) => (
            <article
              key={index}
              className="p-6"
              style={{
                background: '#211D14',
                border: '1px solid rgba(234,224,204,0.08)',
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <p className="text-[10px] tracking-[0.15em] uppercase text-[#A07850]">
                  {getCategoryLabel(spot.category, locale)}
                </p>
              </div>
              <h3 className="font-serif text-lg font-normal text-[#EAE0CC] mb-2">
                {spot.name[locale]}
              </h3>
              <p
                className="text-sm leading-relaxed line-clamp-3"
                style={{ color: 'rgba(234,224,204,0.6)' }}
              >
                {spot.description[locale]}
              </p>
              {spot.distance && (
                <p
                  className="text-xs mt-4 pt-4"
                  style={{
                    color: 'rgba(234,224,204,0.4)',
                    borderTop: '1px solid rgba(234,224,204,0.08)',
                  }}
                >
                  <span className="text-[#A07850]">{distanceLabel}</span>{' '}
                  {spot.distance}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>
  
      {/* 4. 行程推荐 */}
      <section
        className="px-8 lg:px-[60px] py-12 lg:py-16"
        style={{ borderBottom: '1px solid rgba(234,224,204,0.08)' }}
        aria-labelledby="itinerary-section-title"
      >
        <h2
          id="itinerary-section-title"
          className="text-[10px] tracking-[0.2em] uppercase text-[#A07850] mb-8"
        >
          {itinerarySectionTitle}
        </h2>
        <div className="space-y-6">
          {exploreData.itineraries.map((itinerary, index) => (
            <article
              key={index}
              className="p-6 lg:p-8"
              style={{
                background: '#211D14',
                border: '1px solid rgba(234,224,204,0.08)',
              }}
            >
              <div className="mb-6">
                <div className="flex flex-wrap items-baseline gap-3 mb-3">
                  <h3 className="font-serif text-xl font-normal text-[#EAE0CC]">
                    {itinerary.title[locale]}
                  </h3>
                  <span
                    className="text-[10px] tracking-[0.15em] uppercase"
                    style={{ color: 'rgba(234,224,204,0.4)' }}
                  >
                    {itinerary.duration}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {itinerary.tags[locale].map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="inline-flex items-center px-2 py-0.5 text-[10px] tracking-[0.1em] uppercase"
                      style={{
                        background: 'rgba(160,120,80,0.12)',
                        color: '#A07850',
                        border: '1px solid rgba(160,120,80,0.25)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {/* 步骤列表 */}
              <ol
                className="relative ml-3 space-y-4"
                style={{ borderLeft: '1px solid rgba(234,224,204,0.08)' }}
              >
                {itinerary.steps.map((step, stepIdx) => (
                  <li key={stepIdx} className="pl-6 relative">
                    <span
                      className="absolute -left-[5px] top-[6px] h-2.5 w-2.5 rounded-full"
                      style={{ background: '#A07850' }}
                    />
                    <h4 className="text-sm font-medium text-[#EAE0CC]">
                      {step.name[locale]}
                    </h4>
                    <p
                      className="text-sm mt-0.5"
                      style={{ color: 'rgba(234,224,204,0.55)' }}
                    >
                      {step.description[locale]}
                    </p>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>
  
      {/* 5. 四季体验 */}
      <section
        className="px-8 lg:px-[60px] py-12 lg:py-16"
        aria-labelledby="season-section-title"
      >
        <h2
          id="season-section-title"
          className="text-[10px] tracking-[0.2em] uppercase text-[#A07850] mb-8"
        >
          {seasonSectionTitle}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {(
            Object.entries(exploreData.seasonalContent) as [
              'spring' | 'summer' | 'autumn' | 'winter',
              (typeof exploreData.seasonalContent)['spring'],
            ][]
          ).map(([season, content]) => (
            <article
              key={season}
              className="p-6"
              style={{
                background: '#211D14',
                border: '1px solid rgba(234,224,204,0.08)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl" aria-hidden="true">
                  {seasonIcons[season]}
                </span>
                <h3 className="font-serif text-lg font-normal text-[#EAE0CC]">
                  {content.title[locale]}
                </h3>
              </div>
              <ul className="space-y-2">
                {content.highlights[locale].map((highlight, idx) => (
                  <li
                    key={idx}
                    className="text-sm flex items-start gap-2"
                    style={{ color: 'rgba(234,224,204,0.6)' }}
                  >
                    <span
                      className="mt-[6px] w-1 h-1 rounded-full flex-shrink-0"
                      style={{ background: '#A07850' }}
                      aria-hidden="true"
                    />
                    {highlight}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
