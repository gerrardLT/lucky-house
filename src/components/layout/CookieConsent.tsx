'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Locale } from '@/types'
import { translate } from '@/lib/i18n/translate'

const STORAGE_KEY = 'cookie_consent'
const CONSENT_VALUE = 'accepted'

export interface CookieConsentProps {
  locale: Locale
}

export function CookieConsent({ locale }: CookieConsentProps) {
  // Always start as false to match SSR (renders null).
  // useEffect runs after mount to check localStorage, avoiding hydration mismatch.
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      setVisible(localStorage.getItem(STORAGE_KEY) !== CONSENT_VALUE)
    } catch {
      setVisible(true)
    }
  }, [])

  function handleAccept() {
    try {
      localStorage.setItem(STORAGE_KEY, CONSENT_VALUE)
    } catch {
      // localStorage unavailable — hide banner anyway
    }
    setVisible(false)
  }

  if (!visible) {
    return null
  }

  const message = translate(locale, 'common', 'cookie.message')
  const acceptLabel = translate(locale, 'common', 'cookie.accept')
  const learnMoreLabel = translate(locale, 'common', 'cookie.learnMore')

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-t border-white/10 text-white px-4 py-3 md:px-8 md:py-4"
    >
      <div className="mx-auto max-w-5xl flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed sm:text-base">
          {message}
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={`/${locale}/privacy`}
            className="text-sm text-stone-300 underline hover:text-white transition-colors"
          >
            {learnMoreLabel}
          </Link>
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900"
          >
            {acceptLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
