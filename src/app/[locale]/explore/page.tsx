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
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FadeInUp, AnimatedSection, StaggerContainer, StaggerItem } from '@/components/motion'

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

/** 分类标签颜色映射 */
const categoryBadgeVariant: Record<string, 'pet-friendly' | 'normal' | 'open' | 'coming-soon'> = {
  onsen: 'pet-friendly',
  nature: 'open',
  attraction: 'coming-soon',
  culture: 'normal',
  food: 'normal',
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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* 1. 页面标题 / Hero 区域 */}
      <FadeInUp className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          {pageTitle}
        </h1>
        <p className="mt-4 text-lg text-stone-400 max-w-2xl mx-auto">
          {pageSubtitle}
        </p>
      </FadeInUp>

      {/* 2. Google Maps 嵌入（lazy-load） */}
      <section className="mb-16" aria-labelledby="map-section-title">
        <h2
          id="map-section-title"
          className="text-2xl font-bold text-white mb-6"
        >
          {mapSectionTitle}
        </h2>
        <div className="rounded-xl overflow-hidden shadow-sm border border-stone-700">
          <iframe
            title={
              locale === 'zh'
                ? '福岛岳温泉位置地图'
                : locale === 'ja'
                  ? '福島岳温泉の地図'
                  : 'Fukushima Dake Onsen Location Map'
            }
            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${exploreData.mapCenter.lat},${exploreData.mapCenter.lng}&zoom=13&language=${locale}`}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />
        </div>
      </section>

      {/* 3. 周边玩法卡片 */}
      <AnimatedSection className="mb-16" aria-labelledby="spots-section-title">
        <h2
          id="spots-section-title"
          className="text-2xl font-bold text-white mb-6"
        >
          {spotsSectionTitle}
        </h2>
        <StaggerContainer staggerDelay={0.12} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {exploreData.spots.map((spot, index) => (
            <StaggerItem key={index}>
              <Card
                as="article"
                image={
                  spot.image
                    ? {
                        src: spot.image.src,
                        alt: spot.image.alt[locale],
                        width: spot.image.width,
                        height: spot.image.height,
                      }
                    : undefined
                }
                padding="md"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    {spot.name[locale]}
                  </h3>
                  <Badge
                    variant={categoryBadgeVariant[spot.category] ?? 'normal'}
                  >
                    {getCategoryLabel(spot.category, locale)}
                  </Badge>
                </div>
                <p className="text-sm text-stone-400 mb-3 line-clamp-3">
                  {spot.description[locale]}
                </p>
                {spot.distance && (
                  <p className="text-xs text-stone-400">
                    <span className="font-medium">{distanceLabel}:</span>{' '}
                    {spot.distance}
                  </p>
                )}
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </AnimatedSection>

      {/* 4. 行程推荐 */}
      <section className="mb-16" aria-labelledby="itinerary-section-title">
        <h2
          id="itinerary-section-title"
          className="text-2xl font-bold text-white mb-6"
        >
          {itinerarySectionTitle}
        </h2>
        <div className="space-y-8">
          {exploreData.itineraries.map((itinerary, index) => (
            <Card key={index} as="article" padding="lg">
              <div className="mb-4">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-white">
                    {itinerary.title[locale]}
                  </h3>
                  <Badge variant="normal">{itinerary.duration}</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {itinerary.tags[locale].map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-stone-800 text-stone-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {/* 步骤列表 */}
              <ol className="relative border-l-2 border-stone-700 ml-3 space-y-4">
                {itinerary.steps.map((step, stepIdx) => (
                  <li key={stepIdx} className="pl-6 relative">
                    <span className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-stone-600 border-2 border-[#0a0a0a]" />
                    <h4 className="text-sm font-semibold text-stone-200">
                      {step.name[locale]}
                    </h4>
                    <p className="text-sm text-stone-400 mt-0.5">
                      {step.description[locale]}
                    </p>
                  </li>
                ))}
              </ol>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. 四季体验内容 */}
      <AnimatedSection aria-labelledby="season-section-title">
        <h2
          id="season-section-title"
          className="text-2xl font-bold text-white mb-6"
        >
          {seasonSectionTitle}
        </h2>
        <StaggerContainer staggerDelay={0.12} className="grid gap-6 sm:grid-cols-2">
          {(
            Object.entries(exploreData.seasonalContent) as [
              'spring' | 'summer' | 'autumn' | 'winter',
              (typeof exploreData.seasonalContent)['spring'],
            ][]
          ).map(([season, content]) => (
            <StaggerItem key={season}>
              <Card as="article" padding="md">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl" aria-hidden="true">
                    {seasonIcons[season]}
                  </span>
                  <h3 className="text-lg font-semibold text-white">
                    {content.title[locale]}
                  </h3>
                </div>
                <ul className="space-y-1.5">
                  {content.highlights[locale].map((highlight, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-stone-400 flex items-start gap-2"
                    >
                      <span className="text-stone-400 mt-0.5" aria-hidden="true">
                        •
                      </span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </AnimatedSection>
    </div>
  )
}
