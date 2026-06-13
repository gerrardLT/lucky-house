// src/app/[locale]/page.tsx
// 首页 — React Server Component，从 CMS 层获取 HomepageData 并组装各区块
// Requirements: 3.1–3.12, 15.1, 15.2

import type { Metadata } from 'next'
import Image from 'next/image'
import { getHomepageData } from '@/lib/cms'
import { HeroSection, ValueCards } from '@/components/home'
import { RoomCard } from '@/components/stay/RoomCard'
import { Button } from '@/components/ui'
import { AnimatedSection, ScrollReveal, LineReveal } from '@/components/motion'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { PawDivider } from '@/components/ui/PawDivider'
import { isValidLocale, BCP47_MAP, BASE_URL } from '@/lib/i18n/config'
import type { Locale } from '@/types'
import { generateHreflangLinks } from '@/lib/i18n/hreflang'

/** 首页 SEO 元数据 */
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
      ? '岳温泉零碳宠物营地 & 温泉酒店 — 携宠温泉度假首选'
      : locale === 'ja'
        ? '岳温泉ゼロカーボンペットキャンプ＆温泉ホテル — ペットと温泉旅行'
        : 'Dake Onsen Zero-Carbon Pet Camp & Hotel — Pet-Friendly Hot Spring Retreat'

  const description =
    locale === 'zh'
      ? '福岛岳温泉畔，人与宠物共享的零碳自然度假体验。天然硫磺温泉、宠物专属服务、营地BBQ、社群活动，为携宠家庭打造理想的短途旅行目的地。'
      : locale === 'ja'
        ? '福島岳温泉のほとり、人とペットが共に楽しむゼロカーボンの自然バケーション。天然硫黄温泉、ペット専用サービス、キャンプBBQ、コミュニティイベント。'
        : 'A zero-carbon nature retreat by Fukushima\'s Dake Onsen. Natural sulfur hot springs, dedicated pet services, campsite BBQ, and community events for families with pets.'

  const hreflangLinks = generateHreflangLinks('/')

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
      url: `${BASE_URL}/${locale}`,
      siteName:
        locale === 'zh'
          ? '岳温泉零碳宠物营地 & 温泉酒店'
          : locale === 'ja'
            ? '岳温泉ゼロカーボンペットキャンプ＆温泉ホテル'
            : 'Dake Onsen Zero-Carbon Pet Camp & Onsen Hotel',
    },
  }
}

/** 生成 LodgingBusiness 结构化数据 (JSON-LD) */
function generateLodgingBusinessStructuredData(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name:
      locale === 'zh'
        ? '岳温泉零碳宠物营地 & 温泉酒店'
        : locale === 'ja'
          ? '岳温泉ゼロカーボンペットキャンプ＆温泉ホテル'
          : 'Dake Onsen Zero-Carbon Pet Camp & Onsen Hotel',
    description:
      locale === 'zh'
        ? '福岛岳温泉畔，人与宠物共享的零碳自然度假体验。'
        : locale === 'ja'
          ? '福島岳温泉のほとり、人とペットが共に楽しむゼロカーボンの自然バケーション。'
          : 'A zero-carbon nature retreat by Fukushima\'s Dake Onsen for humans and pets.',
    url: `${BASE_URL}/${locale}`,
    telephone: '+81-243-XX-XXXX',
    email: 'info@dake-pet-camp.jp',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '岳温泉1丁目',
      addressLocality: '二本松市',
      addressRegion: '福島県',
      postalCode: '964-0074',
      addressCountry: 'JP',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 37.6239,
      longitude: 140.3364,
    },
    image: `${BASE_URL}/images/hero.jpg`,
    petsAllowed: true,
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Hot Spring / Onsen', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Pet Onsen', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Dog Run', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'BBQ Area', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Free WiFi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Parking', value: true },
    ],
  }
}

/** 各 section 多语言标题 */
const SECTION_TITLES: Record<string, Record<Locale, string>> = {
  rooms: {
    zh: '精选房型',
    ja: 'おすすめの客室',
    en: 'Featured Rooms',
  },
  cta: {
    zh: '开启您的携宠温泉之旅',
    ja: 'ペットと温泉旅行を始めよう',
    en: 'Start Your Pet-Friendly Onsen Journey',
  },
}

/** 各 section 副文案 */
const SECTION_SUBTITLES: Record<string, Record<Locale, string>> = {
  rooms: {
    zh: '为您和毛孩子精心准备的舒适空间',
    ja: 'あなたとペットのために厳選されたお部屋',
    en: 'Carefully curated spaces for you and your furry companion',
  },
  cta: {
    zh: '加入首批携宠入住名单，享受专属优惠',
    ja: '最初のペット連れ宿泊リストに参加して、限定特典をゲット',
    en: 'Join our early pet-stay list for exclusive benefits',
  },
}

/** "查看更多"按钮文案 */
const VIEW_ALL: Record<string, Record<Locale, string>> = {
  rooms: {
    zh: '查看全部房型',
    ja: 'すべての客室を見る',
    en: 'View All Rooms',
  },
}

/** 底部 CTA 按钮文案 */
const CTA_BUTTON: Record<Locale, string> = {
  zh: '立即预约',
  ja: '今すぐ予約',
  en: 'Book Now',
}

/** 社会证明文案 */
const SOCIAL_PROOF: Record<Locale, string> = {
  zh: '已有 128 位宠物家庭关注',
  ja: '128組のペットファミリーが注目',
  en: '128 pet families have shown interest',
}

/** CTA 信任标识 */
const TRUST_BADGES: Record<Locale, string[]> = {
  zh: ['· 免费取消', '· 48小时确认', '· 携宠入住'],
  ja: ['· キャンセル無料', '· 48時間以内に確認', '· ペット同伴OK'],
  en: ['· Free Cancellation', '· Confirmed in 48h', '· Pet-Friendly'],
}

/** 房型区 CTA 辅助文案 */
const ROOMS_HINT: Record<Locale, string> = {
  zh: '3 种房型 · 12 间宠物友好客房',
  ja: '3タイプの客室 · 12室ペット同伴可',
  en: '3 room types · 12 pet-friendly rooms',
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const currentLocale = locale as Locale

  // 从 CMS 层获取数据
  const homepageData = await getHomepageData()

  // LodgingBusiness 结构化数据
  const lodgingBusinessData = generateLodgingBusinessStructuredData(currentLocale)

  return (
    <>
      {/* LodgingBusiness 结构化数据 (SEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingBusinessData) }}
      />

      {/* 1. Hero 首屏 */}
      <HeroSection
        image={homepageData.hero.image}
        title={homepageData.hero.title}
        subtitle={homepageData.hero.subtitle}
        locale={currentLocale}
        bookingVisible={homepageData.bookingWidgetVisible}
      />

      {/* 3. 三大价值卡片 */}
      <section id="value-cards" className="bg-[#0a0a0a]">
        <ValueCards cards={homepageData.valueCards} locale={currentLocale} />
      </section>

      {/* 父印分隔线 */}
      <PawDivider className="bg-[#0a0a0a]" />

      {/* 4. 精选房型预览 — 杂志特写非对称布局 */}
      <AnimatedSection id="featured-rooms" reveal="blur" className="bg-[#141414] py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4">
          {/* 左对齐 section header — LineReveal 遮罩揭示 */}
          <div className="mb-10 lg:mb-14">
            <LineReveal className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              {SECTION_TITLES.rooms[currentLocale]}
            </LineReveal>
            <LineReveal delay={0.15} className="mt-3 text-stone-400 text-base lg:text-lg">
              {SECTION_SUBTITLES.rooms[currentLocale]}
            </LineReveal>
          </div>

          <div className="space-y-10">
            {/* 第1个房型：图左文右（大图特写）— scroll-linked 揭示 */}
            {homepageData.featuredRooms[0] && (
              <ScrollReveal>
                <RoomCard room={homepageData.featuredRooms[0]} locale={currentLocale} layout="featured-left" />
              </ScrollReveal>
            )}

            {/* 第2个房型：文左图右（镜像翻转）— scroll-linked 揭示 */}
            {homepageData.featuredRooms[1] && (
              <ScrollReveal>
                <RoomCard room={homepageData.featuredRooms[1]} locale={currentLocale} layout="featured-right" />
              </ScrollReveal>
            )}

            {/* 第3个房型：全宽横幅（Coming Soon） */}
            {homepageData.featuredRooms[2] && (
              <ScrollReveal>
                <RoomCard room={homepageData.featuredRooms[2]} locale={currentLocale} layout="banner" />
              </ScrollReveal>
            )}
          </div>

          <div className="mt-10 flex items-center gap-4">
            <Button variant="secondary" size="md" href={`/${currentLocale}/stay`}>
              {VIEW_ALL.rooms[currentLocale]}
            </Button>
            <span className="text-sm text-stone-500">
              {ROOMS_HINT[currentLocale]}
            </span>
          </div>
        </div>
      </AnimatedSection>

      {/* 父印分隔线 */}
      <PawDivider className="bg-[#141414]" />

      {/* 10. 底部 CTA — 全屏沉浸式，视频背景呼应 Hero */}
      <AnimatedSection id="bottom-cta" className="relative py-20 lg:py-28 overflow-hidden">
        {/* 背景图片 */}
        <div className="absolute inset-0 z-[1]">
          <Image
            src="/images/hero/hero-02-shiba-onsen-veranda.png"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/65" />
        </div>

        {/* 内容居中 */}
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          {/* 社会证明 */}
          <p className="text-sm text-amber-400/80 mb-6">
            {SOCIAL_PROOF[currentLocale]}
          </p>
          <LineReveal className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl lg:leading-tight">
            {SECTION_TITLES.cta[currentLocale]}
          </LineReveal>
          <LineReveal delay={0.15} className="mt-5 text-white/70 text-base lg:text-lg leading-relaxed max-w-xl mx-auto">
            {SECTION_SUBTITLES.cta[currentLocale]}
          </LineReveal>
          <div className="mt-10">
            <MagneticButton variant="primary" size="lg" href={`/${currentLocale}/booking`}>
              {CTA_BUTTON[currentLocale]}
            </MagneticButton>
          </div>
          {/* 信任标识 */}
          <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2">
            {TRUST_BADGES[currentLocale].map((badge) => (
              <span key={badge} className="text-xs text-white/50">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </>
  )
}
