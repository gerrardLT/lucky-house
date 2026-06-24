'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n/config'
import { createTranslator } from '@/lib/i18n/translate'
import { replaceLocaleInPath } from '@/lib/i18n/locale-path'

interface MobileDrawerNavProps {
  isOpen: boolean
  onClose: () => void
  locale: Locale
}

/** Navigation items matching the 9 items in the Header */
const NAV_ITEMS = [
  { key: 'home', href: '' },
  { key: 'stay', href: '/stay' },
  { key: 'petFriendly', href: '/pet-friendly' },
  { key: 'facilities', href: '/facilities' },
  { key: 'activities', href: '/activities' },
  { key: 'explore', href: '/explore' },
  { key: 'gallery', href: '/gallery' },
  { key: 'faq', href: '/faq' },
  { key: 'booking', href: '/booking' },
  { key: 'contact', href: '/contact' },
] as const

export function MobileDrawerNav({ isOpen, onClose, locale }: MobileDrawerNavProps) {
  const t = createTranslator(locale, 'common')
  const pathname = usePathname()
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Focus trap and Escape key handling
  useEffect(() => {
    if (!isOpen) return

    // Focus the close button when drawer opens
    closeButtonRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      // Focus trap
      if (e.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleNavClick = useCallback(() => {
    onClose()
  }, [onClose])

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={locale === 'zh' ? '导航菜单' : locale === 'ja' ? 'ナビゲーションメニュー' : 'Navigation menu'}
        className={`fixed inset-y-0 right-0 z-[70] w-full max-w-sm h-[100dvh] bg-stone-900 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-end p-4 border-b border-stone-700">
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label={t('buttons.close')}
            className="p-2 rounded-lg text-stone-300 hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 min-h-0 overflow-y-auto px-4 py-6" aria-label="Mobile navigation">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link
                  href={`/${locale}${item.href}`}
                  onClick={handleNavClick}
                  className="block px-4 py-3 rounded-lg text-lg font-medium text-stone-200 hover:bg-stone-800 hover:text-amber-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                >
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>

          {/* Language Switcher section */}
          <div className="mt-6 pt-6 border-t border-stone-700">
            <p className="px-4 text-sm font-medium text-stone-500 mb-2">
              {t('language.switchTo')}
            </p>
            <div className="flex gap-2 px-4">
              {(['zh', 'ja', 'en'] as const).map((lang) => (
                <Link
                  key={lang}
                  href={replaceLocaleInPath(pathname, lang)}
                  onClick={handleNavClick}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
                    lang === locale
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                  aria-label={t(`language.${lang}`)}
                  aria-current={lang === locale ? 'true' : undefined}
                >
                  {t(`language.${lang}`)}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Fixed bottom CTA button */}
        <div className="p-4 border-t border-stone-700">
          <Link
            href={`/${locale}/booking`}
            onClick={handleNavClick}
            className="block w-full px-6 py-3.5 text-center text-lg font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
          >
            {t('buttons.bookNow')}
          </Link>
        </div>
      </div>
    </>
  )
}
