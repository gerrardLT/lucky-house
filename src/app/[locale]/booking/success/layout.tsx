// src/app/[locale]/booking/success/layout.tsx
// 预约成功页布局 — 提供 SEO 元数据（因 page.tsx 是 client component 无法导出 generateMetadata）

import type { Metadata } from 'next'
import { isValidLocale, BCP47_MAP, BASE_URL } from '@/lib/i18n/config'
import type { Locale } from '@/lib/i18n/config'

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
      ? '预约提交成功'
      : locale === 'ja'
        ? 'ご予約受付完了'
        : 'Booking Confirmed'

  const description =
    locale === 'zh'
      ? '您的预约申请已成功提交，我们将在24小时内与您联系。'
      : locale === 'ja'
        ? 'ご予約を受け付けました。24時間以内にご連絡いたします。'
        : 'Your booking request has been submitted successfully. We will contact you within 24 hours.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: BCP47_MAP[locale as Locale],
      type: 'website',
      url: `${BASE_URL}/${locale}/booking/success`,
    },
    robots: {
      index: false, // 成功页不需要被搜索引擎索引
    },
  }
}

export default function BookingSuccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
