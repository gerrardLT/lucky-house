// Property 3: Hreflang 备选链接生成覆盖所有 locale
// Property 4: 翻译 key 缺失时回退至中文
// Validates: Requirements 1.5, 1.10

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { generateHreflangLinks } from '../hreflang'
import { translate, registerTranslation, clearTranslationCache } from '../translate'
import type { Locale } from '../config'

describe('Property 3: Hreflang 备选链接生成覆盖所有 locale', () => {
  // Generate random paths with 0-4 segments
  const pathSegmentArb = fc.stringMatching(/^[a-z][a-z0-9-]{0,15}$/)
  const pathArb = fc.array(pathSegmentArb, { minLength: 0, maxLength: 4 }).map((segments) => {
    if (segments.length === 0) return '/'
    return '/' + segments.join('/')
  })

  it('always returns exactly 4 links (zh-CN, ja, en, x-default)', () => {
    fc.assert(
      fc.property(pathArb, (path) => {
        const links = generateHreflangLinks(path)

        // Must be exactly 4 links
        expect(links).toHaveLength(4)

        // Extract locales from the result
        const locales = links.map((l) => l.locale)
        expect(locales).toContain('zh-CN')
        expect(locales).toContain('ja')
        expect(locales).toContain('en')
        expect(locales).toContain('x-default')
      }),
      { numRuns: 100 }
    )
  })

  it('x-default href matches zh version href', () => {
    fc.assert(
      fc.property(pathArb, (path) => {
        const links = generateHreflangLinks(path)

        const zhLink = links.find((l) => l.locale === 'zh-CN')
        const xDefault = links.find((l) => l.locale === 'x-default')

        expect(xDefault?.href).toBe(zhLink?.href)
      }),
      { numRuns: 100 }
    )
  })

  it('all hrefs are valid absolute URLs with correct locale paths', () => {
    fc.assert(
      fc.property(pathArb, (path) => {
        const links = generateHreflangLinks(path)

        for (const link of links) {
          // All hrefs should be absolute URLs
          expect(link.href).toMatch(/^https?:\/\//)
          // All hrefs should contain a locale path segment
          expect(link.href).toMatch(/\/(zh|ja|en)(\/|$)/)
        }
      }),
      { numRuns: 100 }
    )
  })
})

describe('Property 4: 翻译 key 缺失时回退至中文', () => {
  it('returns the key itself as final fallback for non-existent namespace/key', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Locale>('zh', 'ja', 'en'),
        // Generate namespace strings that won't match any real file
        fc.stringMatching(/^nonexist_[a-z]{3,8}$/),
        // Generate key strings that won't match any real key
        fc.stringMatching(/^missing_[a-z]{3,8}$/),
        (locale, namespace, key) => {
          const result = translate(locale, namespace, key)
          // When key is missing from all locales, the key itself is returned
          return result === key
        }
      ),
      { numRuns: 100 }
    )
  })

  it('falls back to zh text when key exists in zh but not in current locale', () => {
    // Register a test translation in zh with a known key
    const testNamespace = '_test_fallback_ns'
    const testKey = 'testKey'
    const zhValue = '中文测试值'

    registerTranslation('zh', testNamespace, { [testKey]: zhValue })
    // Don't register in ja or en

    fc.assert(
      fc.property(
        fc.constantFrom<Locale>('ja', 'en'),
        (locale) => {
          const result = translate(locale, testNamespace, testKey)
          return result === zhValue
        }
      ),
      { numRuns: 10 }
    )

    // Cleanup
    clearTranslationCache()
  })
})
