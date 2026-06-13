'use client'

// src/app/[locale]/booking/success/page.tsx
// 预约成功页 — Client Component
// 展示确认编号、后续流程说明、客服联系方式
// 使用 router.replace 方式到达（由 BookingForm 提交成功后替换历史记录）

import { Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n/config'

/** 多语言文案 */
const CONTENT: Record<Locale, {
  title: string
  subtitle: string
  confirmationLabel: string
  nextStepsTitle: string
  nextSteps: string[]
  contactTitle: string
  contactEmail: string
  contactPhone: string
  serviceHours: string
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
    contactEmail: '邮箱：info@dake-pet-camp.jp',
    contactPhone: '电话：+81-243-XX-XXXX',
    serviceHours: '服务时间：每日 9:00 - 18:00（日本标准时间）',
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
    contactEmail: 'メール：info@dake-pet-camp.jp',
    contactPhone: '電話：+81-243-XX-XXXX',
    serviceHours: '受付時間：毎日 9:00〜18:00（日本標準時間）',
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
      'If you need to make any changes, please don\'t hesitate to contact our customer service team.',
    ],
    contactTitle: 'Customer Service',
    contactEmail: 'Email: info@dake-pet-camp.jp',
    contactPhone: 'Phone: +81-243-XX-XXXX',
    serviceHours: 'Hours: Daily 9:00 AM - 6:00 PM (JST)',
    backToHome: 'Back to Home',
  },
}

/** 预约成功页内容（使用 useSearchParams） */
function BookingSuccessContent() {
  const params = useParams()
  const searchParams = useSearchParams()

  const locale = (params.locale as Locale) || 'zh'
  const confirmationId = searchParams.get('id') || '—'

  const content = CONTENT[locale] || CONTENT.zh

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      {/* 成功图标 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-900/20 mb-4">
          <svg
            className="w-8 h-8 text-amber-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          {content.title}
        </h1>
        <p className="mt-2 text-stone-400">
          {content.subtitle}
        </p>
      </div>

      {/* 确认编号 */}
      <div className="bg-[#141414] border border-amber-700/50 rounded-xl p-6 text-center mb-8">
        <p className="text-sm text-amber-400 font-medium mb-1">
          {content.confirmationLabel}
        </p>
        <p className="text-2xl font-bold text-white font-mono tracking-wider">
          {confirmationId}
        </p>
      </div>

      {/* 后续流程说明 */}
      <div className="bg-[#141414] border border-white/10 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">
          {content.nextStepsTitle}
        </h2>
        <ol className="space-y-3">
          {content.nextSteps.map((step, index) => (
            <li key={index} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/5 text-stone-300 text-sm font-medium flex items-center justify-center">
                {index + 1}
              </span>
              <span className="text-stone-300 text-sm leading-relaxed">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* 客服联系方式 */}
      <div className="bg-[#141414] border border-white/10 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-3">
          {content.contactTitle}
        </h2>
        <div className="space-y-2 text-sm text-stone-300">
          <p>{content.contactEmail}</p>
          <p>{content.contactPhone}</p>
          <p>{content.serviceHours}</p>
        </div>
      </div>

      {/* 返回首页按钮 */}
      <div className="text-center">
        <Link
          href={`/${locale}/`}
          className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-6 py-3 text-sm font-medium text-white hover:bg-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 transition-colors"
        >
          {content.backToHome}
        </Link>
      </div>
    </div>
  )
}

/** 预约成功页面（包裹 Suspense 以支持 useSearchParams） */
export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 rounded-full bg-stone-700 mx-auto mb-4" />
          <div className="h-8 bg-stone-700 rounded w-64 mx-auto mb-2" />
          <div className="h-4 bg-stone-700 rounded w-96 mx-auto" />
        </div>
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  )
}
