// src/components/admin/LanguageSwitcher.tsx
// 右上角语言切换器

'use client'

import { useAdminLocale } from '@/lib/i18n/useAdminLocale'
import type { Locale } from '@/lib/i18n/config'
import { LOCALES } from '@/lib/i18n/config'

const LOCALE_LABELS: Record<Locale, string> = {
  zh: '中文',
  ja: '日本語',
  en: 'EN',
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useAdminLocale()

  return (
    <div className="inline-flex items-center gap-0.5 bg-stone-900 border border-stone-800 rounded-lg px-1 py-0.5">
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
            locale === l
              ? 'bg-amber-600/10 text-amber-500'
              : 'text-stone-500 hover:text-stone-300 hover:bg-stone-800'
          }`}
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  )
}
