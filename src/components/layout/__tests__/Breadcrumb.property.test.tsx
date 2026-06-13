// Property 5: 面包屑导航按路径深度正确显示
// Validates: Requirements 2.5

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { render } from '@testing-library/react'
import { Breadcrumb } from '../Breadcrumb'
import type { Locale } from '@/lib/i18n/config'

// Mock next/link to render as simple <a> tags
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('Property 5: 面包屑导航按路径深度正确显示', () => {
  const localeArb = fc.constantFrom<Locale>('zh', 'ja', 'en')
  const pathSegmentArb = fc.stringMatching(/^[a-z][a-z0-9-]{0,12}$/)

  it('renders null (no nav element) when path has 0 segments after locale', () => {
    fc.assert(
      fc.property(localeArb, (locale) => {
        // Path like /zh/ has 0 segments after locale
        const pathname = `/${locale}/`
        const { container } = render(
          <Breadcrumb locale={locale} pathname={pathname} />
        )
        const nav = container.querySelector('nav[aria-label="breadcrumb"]')
        expect(nav).toBeNull()
      }),
      { numRuns: 10 }
    )
  })

  it('renders nav with correct number of items when segments >= 1', () => {
    fc.assert(
      fc.property(
        localeArb,
        fc.array(pathSegmentArb, { minLength: 1, maxLength: 4 }),
        (locale, segments) => {
          const pathname = `/${locale}/${segments.join('/')}`
          const { container } = render(
            <Breadcrumb locale={locale} pathname={pathname} />
          )
          const nav = container.querySelector('nav[aria-label="breadcrumb"]')
          expect(nav).not.toBeNull()

          // Number of list items = segments.length + 1 (Home item)
          const items = container.querySelectorAll('li')
          expect(items.length).toBe(segments.length + 1)
        }
      ),
      { numRuns: 50 }
    )
  })

  it('first breadcrumb item is always Home link', () => {
    fc.assert(
      fc.property(
        localeArb,
        fc.array(pathSegmentArb, { minLength: 1, maxLength: 3 }),
        (locale, segments) => {
          const pathname = `/${locale}/${segments.join('/')}`
          const { container } = render(
            <Breadcrumb locale={locale} pathname={pathname} />
          )
          const firstLink = container.querySelector('li a')
          expect(firstLink).not.toBeNull()
          expect(firstLink?.getAttribute('href')).toBe(`/${locale}`)
        }
      ),
      { numRuns: 30 }
    )
  })

  it('last breadcrumb item is current page (not a link)', () => {
    fc.assert(
      fc.property(
        localeArb,
        fc.array(pathSegmentArb, { minLength: 1, maxLength: 3 }),
        (locale, segments) => {
          const pathname = `/${locale}/${segments.join('/')}`
          const { container } = render(
            <Breadcrumb locale={locale} pathname={pathname} />
          )
          const lastItem = container.querySelector('[aria-current="page"]')
          expect(lastItem).not.toBeNull()
        }
      ),
      { numRuns: 30 }
    )
  })
})
