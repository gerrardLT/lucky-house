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

      <div className="bg-[#19160F] text-[#EAE0CC] min-h-screen">
        {/* Editorial 页头 */}
        <header
          className="px-8 lg:px-[60px] pt-[60px] lg:pt-[80px] pb-[40px] lg:pb-[60px]"
          style={{ borderBottom: '1px solid rgba(234,224,204,0.08)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[60px] items-end">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#A07850] mb-4">
                {typedLocale === 'zh' ? 'FAQ · 常见问题' : typedLocale === 'ja' ? 'よくある質問' : 'FAQ'}
              </p>
              <h1
                className="font-serif font-normal leading-[1.1] text-[#EAE0CC]"
                style={{ fontSize: 'clamp(32px,4.5vw,60px)' }}
              >
                {pageTitle}
                <br />
                <em className="italic" style={{ color: 'rgba(234,224,204,0.55)' }}>
                  {typedLocale === 'zh' ? '快速找到答案' : typedLocale === 'ja' ? '答えを見つける' : 'Find Your Answers'}
                </em>
              </h1>
            </div>
            <div className="lg:pb-1">
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(234,224,204,0.6)' }}>
                {pageSubtitle}
              </p>
            </div>
          </div>
        </header>

        {/* FAQ 搜索 + 筛选 + 手风琴 */}
        <div className="px-8 lg:px-[60px] py-12 lg:py-16">
          <FAQSection faqs={faqs} locale={typedLocale} />
        </div>
      </div>
    </>
  )
}
