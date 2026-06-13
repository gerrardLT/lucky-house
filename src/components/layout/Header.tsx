'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Locale } from '@/lib/i18n'
import { createTranslator } from '@/lib/i18n'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileDrawerNav } from './MobileDrawerNav'

export interface HeaderProps {
  locale: Locale
}

/**
 * Header component — 极简透明叠加式导航
 * Features:
 * - Fixed overlay on top of content (transparent initially, blur on scroll)
 * - Desktop navigation links hidden; hamburger visible at all breakpoints
 * - Logo: serif, uppercase, ultra-wide tracking, light weight
 * - CTA button with rounded-full pill shape
 */
export function Header({ locale }: HeaderProps) {
  const t = createTranslator(locale, 'common')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleScroll = useCallback(() => {
    const threshold = 80
    setIsScrolled(window.scrollY > threshold)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    requestAnimationFrame(handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        isScrolled
          ? 'bg-black/80 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent border-b border-transparent'
      }`}
      role="banner"
    >
      <div className="mx-auto max-w-7xl px-6 relative flex items-center justify-end h-16">
        {/* Logo / Brand — 绝对居中 */}
        <Link
          href={`/${locale}`}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          aria-label="Lucky House - Home"
        >
          <Image
            src="/logo/logo-main.png"
            alt="Lucky House"
            width={240}
            height={72}
            className="h-14 w-auto"
            priority
          />
        </Link>

        {/* Right Side: Language Switcher + CTA + Hamburger */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher locale={locale} />

          {/* CTA Button */}
          <Link
            href={`/${locale}/booking`}
            className="hidden sm:inline-flex items-center justify-center rounded-full bg-amber-600 text-white font-medium hover:bg-amber-500 transition-all duration-300 px-5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
          >
            {t('buttons.bookNow')}
          </Link>

          {/* Hamburger Menu Icon (visible at all breakpoints) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="inline-flex items-center justify-center rounded-md p-2 text-white hover:text-amber-400 hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1"
            aria-label={t('buttons.openMenu')}
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <MobileDrawerNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        locale={locale}
      />
    </header>
  )
}

export default Header
