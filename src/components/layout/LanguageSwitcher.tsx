'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { type Locale, LOCALES, LOCALE_COOKIE_NAME, LOCALE_COOKIE_MAX_AGE_DAYS } from '@/lib/i18n/config'
import { replaceLocaleInPath } from '@/lib/i18n/locale-path'

/** 各语言显示标签 */
const LANGUAGE_LABELS: Record<Locale, string> = {
  zh: '中文',
  ja: '日本語',
  en: 'English',
}

/** 各语言简写标签（用于紧凑模式显示） */
const LANGUAGE_ABBR: Record<Locale, string> = {
  zh: '中',
  ja: '日',
  en: 'EN',
}

interface LanguageSwitcherProps {
  locale: Locale
  className?: string
}

/**
 * 语言切换器组件
 *
 * 显示当前语言，点击展开下拉菜单切换 zh/ja/en。
 * 切换时替换 URL 中的 locale 段并写入 cookie（365天有效期）。
 */
export function LanguageSwitcher({ locale, className = '' }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  // 点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // 键盘 Escape 关闭
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  function handleSwitch(targetLocale: Locale) {
    if (targetLocale === locale) {
      setIsOpen(false)
      return
    }

    // 写入 cookie（365天有效期）
    const maxAge = LOCALE_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60
    const cookieValue = `${LOCALE_COOKIE_NAME}=${targetLocale};path=/;max-age=${maxAge};SameSite=Lax`
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = cookieValue

    // 替换 URL locale 段并导航
    const newPath = replaceLocaleInPath(pathname, targetLocale)
    router.push(newPath)

    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={LANGUAGE_LABELS[locale]}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="flex items-center gap-1 rounded-md border border-stone-600 px-2 py-1.5 text-sm font-medium text-stone-200 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-colors"
      >
        <svg
          className="h-4 w-4 text-stone-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
          />
        </svg>
        <span>{LANGUAGE_ABBR[locale]}</span>
        <svg
          className={`h-3 w-3 text-stone-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label="Select language"
          className="absolute right-0 z-50 mt-1 w-32 rounded-md border border-stone-700 bg-stone-800 py-1 shadow-lg"
        >
          {LOCALES.map((lang) => (
            <li key={lang} role="option" aria-selected={lang === locale}>
              <button
                type="button"
                onClick={() => handleSwitch(lang)}
                className={`w-full px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-500 ${
                  lang === locale
                    ? 'bg-stone-700 font-semibold text-white'
                    : 'text-stone-300 hover:bg-stone-700'
                }`}
              >
                {LANGUAGE_LABELS[lang]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
