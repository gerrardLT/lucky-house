// src/app/[locale]/booking/page.tsx
// 预约页 — Async Server Component
// 从 CMS 获取宠物入住规则 FAQ 数据，传递给 BookingForm 组件

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getFAQs } from '@/lib/cms'
import { isValidLocale, BCP47_MAP, BASE_URL } from '@/lib/i18n/config'
import type { Locale } from '@/lib/i18n/config'
import { generateHreflangLinks } from '@/lib/i18n/hreflang'
import { BookingForm } from '@/components/booking/BookingForm'

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
      ? '预约咨询'
      : locale === 'ja'
        ? 'ご予約・お問い合わせ'
        : 'Book Your Stay'

  const description =
    locale === 'zh'
      ? '填写预约表单，加入岳温泉零碳宠物营地首批入住候补名单。5步完成预约申请。'
      : locale === 'ja'
        ? '予約フォームにご記入いただき、岳温泉ゼロカーボンペットキャンプの入居候補リストにご参加ください。5ステップで予約申請完了。'
        : 'Fill out the booking form to join the waitlist at Dake Onsen Zero-Carbon Pet Camp. Complete your reservation request in 5 simple steps.'

  const hreflangLinks = generateHreflangLinks('/booking')

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
      url: `${BASE_URL}/${locale}/booking`,
    },
  }
}

/** 预约页面 */
export default async function BookingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  const typedLocale = locale as Locale

  // 获取宠物入住相关 FAQ（用于 Step 5 规则确认，统一数据源）
  const faqRules = await getFAQs('pet')

  // 页面标题文案
  const pageTitle =
    typedLocale === 'zh'
      ? '预约咨询'
      : typedLocale === 'ja'
        ? 'ご予約・お問い合わせ'
        : 'Book Your Stay'

  const pageSubtitle =
    typedLocale === 'zh'
      ? '填写以下表单，提交预约申请。我们将在 24 小时内与您联系确认。'
      : typedLocale === 'ja'
        ? '以下のフォームにご記入のうえ、ご予約をお申し込みください。24時間以内にご連絡いたします。'
        : 'Fill out the form below to submit your booking request. We will contact you within 24 hours to confirm.'

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* 页面标题 */}
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          {pageTitle}
        </h1>
        <p className="mt-4 text-lg text-stone-400 max-w-2xl mx-auto">
          {pageSubtitle}
        </p>
      </header>

      {/* 预约表单 */}
      <BookingForm locale={typedLocale} faqRules={faqRules} />
    </div>
  )
}
