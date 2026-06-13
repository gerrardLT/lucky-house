// src/app/[locale]/faq/page.tsx
// FAQ / Rules 页 — React Server Component
// 展示 FAQ 搜索 + 分类 anchor 跳转 + Accordion
// 包含 FAQPage 结构化数据（SEO）

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getFAQs } from '@/lib/cms'
import { isValidLocale, BCP47_MAP, BASE_URL } from '@/lib/i18n/config'
import type { Locale } from '@/lib/i18n/config'
import { generateHreflangLinks } from '@/lib/i18n/hreflang'
import { FAQSection } from '@/components/faq/FAQSection'
import type { FAQ } from '@/types'

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
      ? '常见问题 FAQ'
      : locale === 'ja'
        ? 'よくある質問 FAQ'
        : 'Frequently Asked Questions'

  const description =
    locale === 'zh'
      ? '关于宠物入住、房型价格、温泉设施、交通到达和取消政策的常见问题解答。'
      : locale === 'ja'
        ? 'ペット宿泊、客室・料金、温泉施設、交通アクセス、キャンセルポリシーに関するよくある質問。'
        : 'Frequently asked questions about pet stays, room rates, onsen facilities, transportation, and cancellation policies.'

  const hreflangLinks = generateHreflangLinks('/faq')

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
      url: `${BASE_URL}/${locale}/faq`,
    },
  }
}

/** 生成 FAQPage 结构化数据（JSON-LD） */
function generateFAQStructuredData(faqs: FAQ[], locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question[locale] ?? faq.question.zh,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer[locale] ?? faq.answer.zh,
      },
    })),
  }
}

/** FAQ 页面 */
export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  const faqs = await getFAQs()
  const typedLocale = locale as Locale

  // 页面标题文案
  const pageTitle =
    locale === 'zh'
      ? '常见问题'
      : locale === 'ja'
        ? 'よくある質問'
        : 'Frequently Asked Questions'

  const pageSubtitle =
    locale === 'zh'
      ? '搜索或浏览以下常见问题，快速找到您需要的答案'
      : locale === 'ja'
        ? '以下のよくある質問を検索・閲覧して、必要な情報をすばやく見つけましょう'
        : 'Search or browse common questions below to quickly find the answers you need'

  // 结构化数据
  const structuredData = generateFAQStructuredData(faqs, typedLocale)

  return (
    <>
      {/* FAQPage 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {pageTitle}
          </h1>
          <p className="mt-4 text-lg text-stone-400 max-w-2xl mx-auto">
            {pageSubtitle}
          </p>
        </header>

        {/* FAQ 搜索 + 筛选 + 手风琴 */}
        <FAQSection faqs={faqs} locale={typedLocale} />
      </div>
    </>
  )
}
