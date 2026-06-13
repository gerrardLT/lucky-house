// Property 2: URL locale 段替换保持路径完整性
// Validates: Requirements 1.3

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { replaceLocaleInPath } from '../locale-path'
import { LOCALES } from '../config'
import type { Locale } from '../config'

describe('Property 2: URL locale 段替换保持路径完整性', () => {
  const localeArb = fc.constantFrom<Locale>('zh', 'ja', 'en')

  // Generate valid path segments (alphanumeric + hyphens, simulating URL slugs)
  const pathSegmentArb = fc.stringMatching(/^[a-z][a-z0-9-]{0,20}$/)

  // Generate a path with 0-4 segments
  const pathArb = fc.array(pathSegmentArb, { minLength: 0, maxLength: 4 }).map((segments) => {
    if (segments.length === 0) return '/'
    return '/' + segments.join('/')
  })

  it('replaceLocaleInPath always produces a valid path starting with /{locale}/', () => {
    fc.assert(
      fc.property(
        localeArb,
        pathArb,
        localeArb,
        (sourceLocale, pathWithoutLocale, targetLocale) => {
          const fullPath = `/${sourceLocale}${pathWithoutLocale === '/' ? '/' : pathWithoutLocale}`
          const result = replaceLocaleInPath(fullPath, targetLocale)

          // Result must start with /{targetLocale}
          expect(result.startsWith(`/${targetLocale}`)).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('preserves path segments after locale replacement', () => {
    fc.assert(
      fc.property(
        localeArb,
        pathArb,
        localeArb,
        (sourceLocale, pathWithoutLocale, targetLocale) => {
          const fullPath = `/${sourceLocale}${pathWithoutLocale === '/' ? '/' : pathWithoutLocale}`
          const result = replaceLocaleInPath(fullPath, targetLocale)

          // Extract segments after locale from both original and result
          const originalSegments = fullPath.split('/').filter(Boolean).slice(1) // skip locale
          const resultSegments = result.split('?')[0].split('/').filter(Boolean).slice(1) // skip locale

          // Path segments after locale should be identical
          expect(resultSegments).toEqual(originalSegments)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('preserves query parameters after replacement', () => {
    fc.assert(
      fc.property(
        localeArb,
        pathArb,
        localeArb,
        fc.string({ minLength: 1, maxLength: 30 }).map((s) => s.replace(/[?#&=]/g, 'x')),
        (sourceLocale, pathWithoutLocale, targetLocale, queryValue) => {
          const basePath = `/${sourceLocale}${pathWithoutLocale === '/' ? '/' : pathWithoutLocale}`
          const fullPath = `${basePath}?ref=${queryValue}`
          const result = replaceLocaleInPath(fullPath, targetLocale)

          // Query string should be preserved
          expect(result).toContain(`?ref=${queryValue}`)
        }
      ),
      { numRuns: 100 }
    )
  })
})
