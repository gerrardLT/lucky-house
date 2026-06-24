// src/app/[locale]/activities/page.tsx
// 活动社群页 — React Server Component
// 展示活动卡片列表，支持月份/类别筛选，兴趣登记/报名按钮，会员兴趣标签登记
// 使用 getActivities() 从 CMS 层获取数据

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getActivities } from '@/lib/cms'
import { isValidLocale, BCP47_MAP, BASE_URL } from '@/lib/i18n/config'
import type { Locale } from '@/lib/i18n/config'
import { generateHreflangLinks } from '@/lib/i18n/hreflang'
import { ActivitiesGrid } from '@/components/activities/ActivitiesGrid'
import { InterestTagsForm } from '@/components/activities/InterestTagsForm'

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
    ? '活动社群'
    : locale === 'ja'
      ? 'イベント・コミュニティ'
      : 'Activities & Community'

  const description = locale === 'zh'
    ? '探索福岛岳温泉零碳宠物营地的活动预告、宠物社交聚会和兴趣社群，加入我们的携宠生活圈。'
    : locale === 'ja'
      ? '福島岳温泉ゼロカーボンペットキャンプのイベント予告、ペット交流会、コミュニティにご参加ください。'
      : 'Discover upcoming activities, pet social events, and community groups at Fukushima Dake Onsen Pet Camp.'

  const hreflangLinks = generateHreflangLinks('/activities')

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
      url: `${BASE_URL}/${locale}/activities`,
    },
  }
}

/** 活动社群页 */
export default async function ActivitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  const activities = await getActivities(locale as Locale)

  // 页面标题文案
  const pageTitle = locale === 'zh'
    ? '活动社群'
    : locale === 'ja'
      ? 'イベント・コミュニティ'
      : 'Activities & Community'

  const pageSubtitle = locale === 'zh'
    ? '与志同道合的携宠家庭一起，探索丰富多彩的社群活动'
    : locale === 'ja'
      ? '同じ想いを持つペット連れファミリーと、多彩なコミュニティイベントをお楽しみください'
      : 'Join like-minded pet families and explore our vibrant community activities'

  const kicker = locale === 'zh'
    ? 'Activities · 活动社群'
    : locale === 'ja'
      ? 'イベントガイド'
      : 'Community Events'

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
                {locale === 'zh' ? '共同的截距点滴' : locale === 'ja' ? 'ともにあゆみの時間' : 'Shared Moments'}
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
                <p className="font-serif text-2xl text-[#EAE0CC]">6</p>
                <p className="text-[10px] tracking-[0.15em] uppercase mt-1" style={{ color: 'rgba(234,224,204,0.4)' }}>
                  {locale === 'zh' ? '近期活动' : locale === 'ja' ? 'イベント' : 'Events'}
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl text-[#EAE0CC]">4</p>
                <p className="text-[10px] tracking-[0.15em] uppercase mt-1" style={{ color: 'rgba(234,224,204,0.4)' }}>
                  {locale === 'zh' ? '活动类型' : locale === 'ja' ? 'カテゴリー' : 'Categories'}
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl text-[#EAE0CC]">12</p>
                <p className="text-[10px] tracking-[0.15em] uppercase mt-1" style={{ color: 'rgba(234,224,204,0.4)' }}>
                  {locale === 'zh' ? '每年场次' : locale === 'ja' ? '年間回数' : 'Times / Year'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 活动卡片网格 + 筛选 */}
      <section className="px-8 lg:px-[60px] py-12 lg:py-16">
        <ActivitiesGrid activities={activities} locale={locale as Locale} />
      </section>

      {/* 会员兴趣标签登记 */}
      <section
        className="px-8 lg:px-[60px] py-12 lg:py-16"
        style={{ borderTop: '1px solid rgba(234,224,204,0.08)' }}
      >
        <InterestTagsForm locale={locale as Locale} />
      </section>
    </div>
  )
}
