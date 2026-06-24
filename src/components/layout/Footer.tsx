// src/components/layout/Footer.tsx
// Footer 全局组件 — 品牌简介、快速链接、联系信息、法律链接、社交图标、邮件订阅入口

import Link from 'next/link'
import type { Locale, SiteConfig } from '@/types'
import { createTranslator } from '@/lib/i18n/translate'
import { getSiteConfig } from '@/lib/cms'
import { label as labelTypo } from '@/lib/i18n/locale-typo'
import { FooterNewsletterForm } from './FooterNewsletterForm'

interface FooterProps {
  locale: Locale
}

/** 社交媒体图标 SVG（占位） */
function SocialIcon({ platform }: { platform: string }) {
  switch (platform) {
    case 'instagram':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    case 'line':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M12 2C6.48 2 2 5.82 2 10.5c0 4.01 3.44 7.37 8.1 8.25.31.07.74.21.85.49.1.25.06.64.03.89l-.14.82c-.04.25-.2.97.85.53s5.6-3.3 7.64-5.65C21.34 13.66 22 12.12 22 10.5 22 5.82 17.52 2 12 2z" />
        </svg>
      )
    case 'wechat':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM9 16.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm4.5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 2C6.48 2 2 5.93 2 10.75c0 2.72 1.41 5.15 3.63 6.78l-.9 2.7a.5.5 0 0 0 .71.6l3.14-1.57c1.06.3 2.2.49 3.42.49 5.52 0 10-3.93 10-8.75S17.52 2 12 2z" />
        </svg>
      )
    case 'xiaohongshu':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      )
    case 'facebook':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      )
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
  }
}

export default async function Footer({ locale }: FooterProps) {
  const t = createTranslator(locale, 'common')
  const siteConfig: SiteConfig = await getSiteConfig()
  const currentYear = new Date().getFullYear()

  // Navigation items for quick links
  const navItems = [
    { key: 'home', href: `/${locale}` },
    { key: 'stay', href: `/${locale}/stay` },
    { key: 'petFriendly', href: `/${locale}/pet-friendly` },
    { key: 'facilities', href: `/${locale}/facilities` },
    { key: 'activities', href: `/${locale}/activities` },
    { key: 'explore', href: `/${locale}/explore` },
    { key: 'gallery', href: `/${locale}/gallery` },
    { key: 'faq', href: `/${locale}/faq` },
    { key: 'booking', href: `/${locale}/booking` },
    { key: 'contact', href: `/${locale}/contact` },
  ]

  // Legal links
  const legalLinks = [
    { key: 'privacy', href: `/${locale}/privacy` },
    { key: 'terms', href: `/${locale}/terms` },
    { key: 'petRules', href: `/${locale}/pet-rules` },
    { key: 'cookiePolicy', href: `/${locale}/privacy#cookies` },
    { key: 'cancelPolicy', href: `/${locale}/terms#cancellation` },
  ]

  return (
    <footer className="border-t border-stone-700 bg-stone-900 text-stone-300" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main grid: 4 columns desktop, stacked mobile */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Section 1: Brand description */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Lucky House</h2>
            <p className="text-sm leading-relaxed">{t('footer.brand')}</p>
          </div>

          {/* Section 2: Quick links */}
          <div className="space-y-4">
            <h3 className={`text-sm font-semibold text-white ${labelTypo(locale)}`}>
              {t('footer.quickLinks')}
            </h3>
            <nav aria-label={t('footer.quickLinks')}>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className="text-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 rounded"
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Section 3: Contact information */}
          <div className="space-y-4">
            <h3 className={`text-sm font-semibold text-white ${labelTypo(locale)}`}>
              {t('footer.contactInfo')}
            </h3>
            <address className="not-italic space-y-2 text-sm">
              <p>{siteConfig.contact.address[locale]}</p>
              <p>
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 rounded"
                >
                  {siteConfig.contact.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 rounded"
                >
                  {siteConfig.contact.email}
                </a>
              </p>
              <p>{siteConfig.contact.serviceHours[locale]}</p>
            </address>
          </div>

          {/* Section 4: Newsletter subscription */}
          <div className="space-y-4">
            <h3 className={`text-sm font-semibold text-white ${labelTypo(locale)}`}>
              {t('footer.newsletter')}
            </h3>
            <FooterNewsletterForm locale={locale} />
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-stone-700 pt-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            {/* Legal links */}
            <nav aria-label={t('footer.legalLinks')}>
              <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                {legalLinks.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      className="text-xs text-stone-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 rounded"
                    >
                      {t(`footer.${link.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Social media icons */}
            <div className="flex items-center gap-4">
              <span className="sr-only">{t('footer.socialMedia')}</span>
              {siteConfig.social.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 rounded-full"
                  aria-label={social.platform}
                >
                  <SocialIcon platform={social.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <p className="mt-6 text-center text-xs text-stone-500">
            {t('footer.copyright').replace('{year}', String(currentYear))}
          </p>
        </div>
      </div>
    </footer>
  )
}
