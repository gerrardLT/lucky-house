// src/app/[locale]/layout.tsx
// Locale 级根 Layout — 集成 Header + Footer + CookieConsent
// 设置 html lang 属性、hreflang alternate links、per-locale metadata

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Playfair_Display, Noto_Serif_JP, Noto_Serif_SC, Jost } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CookieConsent } from '@/components/layout/CookieConsent'
import {
  LOCALES,
  BCP47_MAP,
  isValidLocale,
  BASE_URL,
} from '@/lib/i18n/config'
import type { Locale } from '@/lib/i18n/config'
import { generateHreflangLinks } from '@/lib/i18n/hreflang'
import { translate } from '@/lib/i18n/translate'

/* ─── 字体配置 ─── */

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
})

const notoSerifJP = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto-serif-jp',
  display: 'swap',
  fallback: ['Noto Serif CJK JP', 'serif'],
})

const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto-serif-sc',
  display: 'swap',
  fallback: ['Noto Serif CJK SC', 'serif'],
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-jost',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
})

/** 生成所有 locale 的静态路由参数 */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

/** 根据 locale 生成 per-locale metadata */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    return {}
  }

  const siteName = translate(locale, 'common', 'site.name')
  const siteDescription = translate(locale, 'common', 'site.description')

  // 生成 hreflang 链接（首页级别）
  const hreflangLinks = generateHreflangLinks('/')

  return {
    title: {
      template: `%s | ${siteName}`,
      default: siteName,
    },
    description: siteDescription,
    metadataBase: new URL(BASE_URL),
    alternates: {
      languages: Object.fromEntries(
        hreflangLinks.map((link) => [link.locale, link.href])
      ),
    },
    openGraph: {
      siteName,
      locale: BCP47_MAP[locale],
      type: 'website',
    },
  }
}

/**
 * Locale 级 Layout
 * 作为所有 /[locale]/* 页面的布局容器
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // 验证 locale 参数，无效则返回 404
  if (!isValidLocale(locale)) {
    notFound()
  }

  // 获取 BCP 47 语言标签
  const lang = BCP47_MAP[locale as Locale]

  return (
    <html lang={lang} className={`h-full antialiased ${playfair.variable} ${notoSerifJP.variable} ${notoSerifSC.variable} ${jost.variable}`}>
      <body className="min-h-full flex flex-col pt-16">
        <Header locale={locale as Locale} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale as Locale} />
        <CookieConsent locale={locale as Locale} />
      </body>
    </html>
  )
}
