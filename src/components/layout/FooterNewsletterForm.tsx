'use client'

// src/components/layout/FooterNewsletterForm.tsx
// Footer 邮件订阅表单 — Client Component
// 将用户邮箱提交到 /api/subscribe，支持同意授权 Checkbox

import { useState } from 'react'
import type { Locale } from '@/types'
import { createTranslator } from '@/lib/i18n/translate'
import { Checkbox } from '@/components/ui'

interface FooterNewsletterFormProps {
  locale: Locale
}

export function FooterNewsletterForm({ locale }: FooterNewsletterFormProps) {
  const t = createTranslator(locale, 'common')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const successMsg =
    locale === 'zh'
      ? '订阅成功！感谢您的关注。'
      : locale === 'ja'
        ? '登録完了！ありがとうございます。'
        : 'Subscribed! Thank you.'

  const errorMsg =
    locale === 'zh'
      ? '订阅失败，请稍后重试。'
      : locale === 'ja'
        ? '登録に失敗しました。後ほどお試しください。'
        : 'Subscription failed. Please try again.'

  const consentRequiredMsg =
    locale === 'zh'
      ? '请勾选同意接收邮件'
      : locale === 'ja'
        ? 'メール受信に同意してください'
        : 'Please agree to receive emails'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent) {
      setStatus('error')
      return
    }
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, interests: [], locale }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
        setConsent(false)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="text-sm text-amber-400 py-2">
        {successMsg}
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" aria-label={t('footer.newsletter')}>
      <div className="flex">
        <label htmlFor="footer-email" className="sr-only">
          {t('footer.newsletterPlaceholder')}
        </label>
        <input
          id="footer-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('footer.newsletterPlaceholder')}
          className="w-full rounded-l-md border border-stone-600 bg-stone-800 px-3 py-2 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-r-md bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-500 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? '…' : t('buttons.subscribe')}
        </button>
      </div>
      <div className="flex items-start gap-2">
        <Checkbox
          id="footer-newsletter-consent"
          checked={consent}
          onCheckedChange={(v) => setConsent(Boolean(v))}
        />
        <label
          htmlFor="footer-newsletter-consent"
          className="text-xs leading-tight text-stone-400 cursor-pointer"
        >
          {t('footer.newsletterConsent')}
        </label>
      </div>
      {status === 'error' && (
        <p className="text-xs text-red-400" role="alert">
          {!consent ? consentRequiredMsg : errorMsg}
        </p>
      )}
    </form>
  )
}
