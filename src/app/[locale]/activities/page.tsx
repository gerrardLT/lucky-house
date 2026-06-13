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

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* 页面标题 / Hero 区域 */}
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          {pageTitle}
        </h1>
        <p className="mt-4 text-lg text-stone-400 max-w-2xl mx-auto">
          {pageSubtitle}
        </p>
      </header>

      {/* 活动卡片网格 + 筛选 */}
      <ActivitiesGrid activities={activities} locale={locale as Locale} />

      {/* 会员兴趣标签登记 */}
      <section className="mt-16">
        <InterestTagsForm locale={locale as Locale} />
      </section>
    </div>
  )
}
