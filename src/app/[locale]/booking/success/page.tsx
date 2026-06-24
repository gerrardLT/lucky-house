// src/app/[locale]/booking/success/page.tsx
// 预约成功页 — Server Component
// 展示确认编号、后续流程说明、客服联系方式（从 site-config 读取）
// 使用 router.replace 方式到达（由 BookingForm 提交成功后替换历史记录）

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { isValidLocale } from '@/lib/i18n/config'
import { getSiteConfig } from '@/lib/cms'
import type { Locale } from '@/lib/i18n/config'

/** 多语言文案（不含联系方式，联系方式统一从 site-config 获取） */
const CONTENT: Record<Locale, {
  title: string
  subtitle: string
  confirmationLabel: string
  nextStepsTitle: string
  nextSteps: string[]
  contactTitle: string
  contactEmailLabel: string
  contactPhoneLabel: string
  serviceHoursLabel: string
  backToHome: string
}> = {
  zh: {
    title: '预约提交成功！',
    subtitle: '感谢您的预约申请，我们已收到您的信息。',
    confirmationLabel: '确认编号',
    nextStepsTitle: '后续流程',
    nextSteps: [
      '我们的工作人员将在 24 小时内通过您选择的联系方式与您取得联系。',
      '请留意您的邮箱，确认邮件已发送至您提供的邮箱地址。',
      '如有任何变更需求，请随时联系我们的客服团队。',
    ],
    contactTitle: '客服联系方式',
    contactEmailLabel: '邮箱',
    contactPhoneLabel: '电话',
    serviceHoursLabel: '服务时间',
    backToHome: '返回首页',
  },
  ja: {
    title: 'ご予約を受け付けました！',
    subtitle: 'お申し込みありがとうございます。情報を確認いたしました。',
    confirmationLabel: '確認番号',
    nextStepsTitle: '今後の流れ',
    nextSteps: [
      '24時間以内に、ご選択いただいた連絡方法でスタッフよりご連絡いたします。',
      '確認メールをご登録のメールアドレスに送信しました。ご確認ください。',
      '変更がございましたら、お気軽にカスタマーサービスまでご連絡ください。',
    ],
    contactTitle: 'カスタマーサービス',
    contactEmailLabel: 'メール',
    contactPhoneLabel: '電話',
    serviceHoursLabel: '受付時間',
    backToHome: 'トップページへ戻る',
  },
  en: {
    title: 'Booking Submitted Successfully!',
    subtitle: 'Thank you for your reservation request. We have received your information.',
    confirmationLabel: 'Confirmation ID',
    nextStepsTitle: 'What Happens Next',
    nextSteps: [
      'Our team will reach out to you within 24 hours via your preferred contact method.',
      'A confirmation email has been sent to the email address you provided.',
      "If you need to make any changes, please don't hesitate to contact our customer service team.",
    ],
    contactTitle: 'Customer Service',
    contactEmailLabel: 'Email',
    contactPhoneLabel: 'Phone',
    serviceHoursLabel: 'Hours',
    backToHome: 'Back to Home',
  },
}

/** 预约成功页面 — Server Component */
export default async function BookingSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ id?: string }>
}) {
  const { locale } = await params
  const { id } = await searchParams

  if (!isValidLocale(locale)) {
    notFound()
  }

  const typedLocale = locale as Locale
  const confirmationId = id || '—'
  const content = CONTENT[typedLocale]

  // 从 site-config 读取统一的联系信息
  const siteConfig = await getSiteConfig()
  const { email, phone, serviceHours } = siteConfig.contact

  return (
    <div className="bg-[#19160F] text-[#EAE0CC] min-h-screen">
      <div className="max-w-2xl mx-auto px-8 py-16 lg:py-24">
        {/* 成功图标 */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
            style={{ background: 'rgba(160,120,80,0.12)', border: '1px solid rgba(160,120,80,0.25)' }}
          >
            <svg
              className="w-8 h-8"
              style={{ color: '#A07850' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
  
          <h1
            className="font-serif font-normal text-[#EAE0CC]"
            style={{ fontSize: 'clamp(24px,3.5vw,40px)' }}
          >
            {content.title}
          </h1>
          <p className="mt-3 text-sm" style={{ color: 'rgba(234,224,204,0.6)' }}>
            {content.subtitle}
          </p>
        </div>
  
        {/* 确认编号 */}
        <div
          className="p-6 text-center mb-6"
          style={{
            background: '#211D14',
            border: '1px solid rgba(160,120,80,0.3)',
          }}
        >
          <p
            className="text-[10px] tracking-[0.2em] uppercase mb-2 text-[#A07850]"
          >
            {content.confirmationLabel}
          </p>
          <p className="font-serif text-3xl tracking-wider text-[#EAE0CC] font-normal">
            {confirmationId}
          </p>
        </div>
  
        {/* 后续流程说明 */}
        <div
          className="p-6 mb-4"
          style={{
            background: '#211D14',
            border: '1px solid rgba(234,224,204,0.08)',
          }}
        >
          <h2
            className="text-[10px] tracking-[0.2em] uppercase text-[#A07850] mb-5"
          >
            {content.nextStepsTitle}
          </h2>
          <ol className="space-y-4">
            {content.nextSteps.map((step, index) => (
              <li key={index} className="flex gap-4">
                <span
                  className="flex-shrink-0 font-serif text-lg leading-none"
                  style={{ color: '#A07850' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className="text-sm leading-relaxed"
                  style={{ color: 'rgba(234,224,204,0.7)' }}
                >
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
  
        {/* 客服联系方式 */}
        <div
          className="p-6 mb-8"
          style={{
            background: '#211D14',
            border: '1px solid rgba(234,224,204,0.08)',
          }}
        >
          <h2
            className="text-[10px] tracking-[0.2em] uppercase text-[#A07850] mb-5"
          >
            {content.contactTitle}
          </h2>
          <div className="space-y-3 text-sm">
            <p style={{ color: 'rgba(234,224,204,0.6)' }}>
              <span style={{ color: 'rgba(234,224,204,0.4)' }}>{content.contactEmailLabel}  </span>
              <a
                href={`mailto:${email}`}
                className="text-[#A07850] hover:text-[#C49A6A] transition-colors"
              >
                {email}
              </a>
            </p>
            <p style={{ color: 'rgba(234,224,204,0.6)' }}>
              <span style={{ color: 'rgba(234,224,204,0.4)' }}>{content.contactPhoneLabel}  </span>
              <a
                href={`tel:${phone}`}
                className="text-[#A07850] hover:text-[#C49A6A] transition-colors"
              >
                {phone}
              </a>
            </p>
            <p style={{ color: 'rgba(234,224,204,0.6)' }}>
              <span style={{ color: 'rgba(234,224,204,0.4)' }}>{content.serviceHoursLabel}  </span>
              {serviceHours[typedLocale]}
            </p>
          </div>
        </div>
  
        {/* 返回首页 */}
        <div className="text-center">
          <Link
            href={`/${typedLocale}/`}
            className="inline-flex items-center justify-center px-8 py-3 text-sm tracking-[0.1em] uppercase font-medium transition-colors"
            style={{ background: '#A07850', color: '#19160F' }}
          >
            {content.backToHome}
          </Link>
        </div>
      </div>
    </div>
  )
}
