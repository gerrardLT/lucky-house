// src/app/[locale]/contact/page.tsx
// 联系我们页 — React Server Component
// 展示联系信息、嵌入地图、分流表单、社交入口、交通方式
// Requirements: 13.1–13.7

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSiteConfig } from '@/lib/cms'
import { isValidLocale, BCP47_MAP, BASE_URL } from '@/lib/i18n/config'
import type { Locale } from '@/lib/i18n/config'
import { generateHreflangLinks } from '@/lib/i18n/hreflang'
import { ContactForm } from '@/components/contact/ContactForm'
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
      ? '联系我们'
      : locale === 'ja'
        ? 'お問い合わせ'
        : 'Contact Us'

  const description =
    locale === 'zh'
      ? '通过电话、邮件或表单联系岳温泉零碳宠物营地，我们随时为您解答。'
      : locale === 'ja'
        ? 'お電話、メール、フォームでお気軽にお問い合わせください。'
        : 'Reach us by phone, email or form. We are happy to help with any questions.'

  const hreflangLinks = generateHreflangLinks('/contact')

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
      url: `${BASE_URL}/${locale}/contact`,
    },
  }
}

/** 社交图标 SVG */
function SocialIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'instagram':
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      )
    case 'line':
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
        </svg>
      )
    case 'wechat':
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zm-2.18 2.86c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982z" />
        </svg>
      )
    case 'xiaohongshu':
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 14h-9a.5.5 0 01-.5-.5v-7a.5.5 0 01.5-.5h9a.5.5 0 01.5.5v7a.5.5 0 01-.5.5zm-4.5-6.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
        </svg>
      )
    case 'facebook':
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    default:
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      )
  }
}

/** 联系我们页 */
export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params

  if (!isValidLocale(localeParam)) {
    notFound()
  }

  const locale = localeParam as Locale
  const siteConfig = await getSiteConfig()

  // 页面文案
  const pageTitle =
    locale === 'zh'
      ? '联系我们'
      : locale === 'ja'
        ? 'お問い合わせ'
        : 'Contact Us'

  const pageSubtitle =
    locale === 'zh'
      ? '我们期待为您提供帮助，请通过以下方式联系我们'
      : locale === 'ja'
        ? 'お気軽にお問い合わせください'
        : 'We look forward to hearing from you'

  const contactInfoTitle =
    locale === 'zh'
      ? '联系信息'
      : locale === 'ja'
        ? '連絡先情報'
        : 'Contact Information'

  const addressLabel =
    locale === 'zh'
      ? '地址'
      : locale === 'ja'
        ? '住所'
        : 'Address'

  const phoneLabel =
    locale === 'zh'
      ? '电话'
      : locale === 'ja'
        ? '電話番号'
        : 'Phone'

  const emailLabel =
    locale === 'zh'
      ? '邮箱'
      : locale === 'ja'
        ? 'メール'
        : 'Email'

  const hoursLabel =
    locale === 'zh'
      ? '客服时间'
      : locale === 'ja'
        ? '営業時間'
        : 'Service Hours'

  const mapTitle =
    locale === 'zh'
      ? '位置地图'
      : locale === 'ja'
        ? '所在地マップ'
        : 'Location Map'

  const socialTitle =
    locale === 'zh'
      ? '关注我们'
      : locale === 'ja'
        ? 'フォローする'
        : 'Follow Us'

  const transportTitle =
    locale === 'zh'
      ? '交通到达方式'
      : locale === 'ja'
        ? 'アクセス方法'
        : 'How to Get Here'

  const transportItems =
    locale === 'zh'
      ? [
          { mode: '🚗 自驾', detail: '从东北自动车道二本松IC出口约20分钟车程' },
          { mode: '🚃 电车', detail: 'JR东北本线「二本松站」下车，转乘出租车约20分钟' },
          { mode: '🚌 巴士', detail: '二本松站前乘坐岳温泉方向路线巴士约30分钟' },
          { mode: '✈️ 航空', detail: '最近机场：福岛机场（约60分钟车程）或仙台机场（约90分钟车程）' },
        ]
      : locale === 'ja'
        ? [
            { mode: '🚗 お車', detail: '東北自動車道 二本松ICから約20分' },
            { mode: '🚃 電車', detail: 'JR東北本線「二本松駅」下車、タクシーで約20分' },
            { mode: '🚌 バス', detail: '二本松駅前から岳温泉行き路線バスで約30分' },
            { mode: '✈️ 飛行機', detail: '最寄り空港：福島空港（約60分）または仙台空港（約90分）' },
          ]
        : [
            { mode: '🚗 By Car', detail: 'About 20 min from Nihonmatsu IC on Tohoku Expressway' },
            { mode: '🚃 By Train', detail: 'JR Tohoku Main Line to Nihonmatsu Station, then 20 min taxi' },
            { mode: '🚌 By Bus', detail: 'Local bus from Nihonmatsu Station to Dake Onsen (approx. 30 min)' },
            { mode: '✈️ By Air', detail: 'Nearest airports: Fukushima Airport (~60 min) or Sendai Airport (~90 min)' },
          ]

  const exploreMoreLabel =
    locale === 'zh'
      ? '查看更多周边信息 →'
      : locale === 'ja'
        ? '周辺情報をもっと見る →'
        : 'See more about the area →'

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* 1. 页面标题 */}
      <FadeInUp className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          {pageTitle}
        </h1>
        <p className="mt-4 text-lg text-stone-400 max-w-2xl mx-auto">
          {pageSubtitle}
        </p>
      </FadeInUp>

      {/* 2. 主内容区 — 2列布局（桌面端：表单左、信息右） */}
      <div className="grid gap-12 lg:grid-cols-2">
        {/* 左列：联系表单 */}
        <section aria-labelledby="contact-form-title">
          <h2 id="contact-form-title" className="sr-only">
            {locale === 'zh' ? '咨询表单' : locale === 'ja' ? 'お問い合わせフォーム' : 'Contact Form'}
          </h2>
          <ContactForm locale={locale} />
        </section>

        {/* 右列：联系信息 + 社交链接 */}
        <aside className="space-y-8">
          {/* 联系信息 */}
          <section aria-labelledby="contact-info-title">
            <h2
              id="contact-info-title"
              className="text-xl font-bold text-white mb-4"
            >
              {contactInfoTitle}
            </h2>
            <dl className="space-y-4">
              {/* 地址 */}
              <div className="flex items-start gap-3">
                <dt className="sr-only">{addressLabel}</dt>
                <span className="mt-0.5 text-amber-400" aria-hidden="true">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <dd>
                  <p className="text-sm font-medium text-stone-300">{addressLabel}</p>
                  <p className="text-sm text-stone-400">{siteConfig.contact.address[locale]}</p>
                </dd>
              </div>

              {/* 电话 */}
              <div className="flex items-start gap-3">
                <dt className="sr-only">{phoneLabel}</dt>
                <span className="mt-0.5 text-amber-400" aria-hidden="true">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <dd>
                  <p className="text-sm font-medium text-stone-300">{phoneLabel}</p>
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="text-sm text-amber-400 hover:text-amber-300 underline"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </dd>
              </div>

              {/* 邮箱 */}
              <div className="flex items-start gap-3">
                <dt className="sr-only">{emailLabel}</dt>
                <span className="mt-0.5 text-amber-400" aria-hidden="true">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <dd>
                  <p className="text-sm font-medium text-stone-300">{emailLabel}</p>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-sm text-amber-400 hover:text-amber-300 underline"
                  >
                    {siteConfig.contact.email}
                  </a>
                </dd>
              </div>

              {/* 客服时间 */}
              <div className="flex items-start gap-3">
                <dt className="sr-only">{hoursLabel}</dt>
                <span className="mt-0.5 text-amber-400" aria-hidden="true">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <dd>
                  <p className="text-sm font-medium text-stone-300">{hoursLabel}</p>
                  <p className="text-sm text-stone-400">{siteConfig.contact.serviceHours[locale]}</p>
                </dd>
              </div>
            </dl>
          </section>

          {/* 社交媒体链接 */}
          <section aria-labelledby="social-links-title">
            <h2
              id="social-links-title"
              className="text-xl font-bold text-white mb-4"
            >
              {socialTitle}
            </h2>
            <div className="flex flex-wrap gap-3">
              {siteConfig.social.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-stone-300 transition-colors hover:border-amber-500/50 hover:bg-white/5 hover:text-amber-400"
                  aria-label={social.platform}
                >
                  <SocialIcon icon={social.icon} />
                  <span>{social.platform}</span>
                </a>
              ))}
            </div>
          </section>
        </aside>
      </div>

      {/* 3. 嵌入 Google Map（lazy iframe） */}
      <AnimatedSection className="mt-16" aria-labelledby="map-title">
        <h2
          id="map-title"
          className="text-2xl font-bold text-white mb-6"
        >
          {mapTitle}
        </h2>
        <div className="rounded-xl overflow-hidden shadow-sm border border-white/10">
          <iframe
            title={
              locale === 'zh'
                ? '岳温泉零碳宠物营地位置地图'
                : locale === 'ja'
                  ? '岳温泉ゼロカーボンペットキャンプの地図'
                  : 'Dake Onsen Zero-Carbon Pet Camp Location Map'
            }
            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=37.5905,140.3489&zoom=14`}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />
        </div>
      </AnimatedSection>

      {/* 4. 交通到达方式 */}
      <AnimatedSection className="mt-16" aria-labelledby="transport-title">
        <h2
          id="transport-title"
          className="text-2xl font-bold text-white mb-6"
        >
          {transportTitle}
        </h2>
        <StaggerContainer staggerDelay={0.1} className="grid gap-4 sm:grid-cols-2">
          {transportItems.map((item, index) => (
            <StaggerItem key={index}>
              <div className="rounded-lg border border-white/10 bg-[#141414] p-4">
                <p className="font-medium text-white mb-1">{item.mode}</p>
                <p className="text-sm text-stone-400">{item.detail}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
        <div className="mt-6">
          <Link
            href={`/${locale}/explore`}
            className="inline-flex items-center text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
          >
            {exploreMoreLabel}
          </Link>
        </div>
      </AnimatedSection>
    </div>
  )
}
