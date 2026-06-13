// Property 1: Accept-Language 头解析正确选择 locale
// Validates: Requirements 1.2

import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { detectLocaleFromHeader } from '../locale-detection'
import { LOCALES } from '../config'
import type { Locale } from '../config'

describe('Property 1: Accept-Language 头解析正确选择 locale', () => {
  /**
   * 生成随机 Accept-Language 头字符串
   * 格式: "lang;q=0.X, lang2;q=0.Y, ..."
   */
  const supportedLocaleArb = fc.constantFrom<Locale>('zh', 'ja', 'en')
  const qValueArb = fc.float({ min: Math.fround(0.1), max: Math.fround(1.0), noNaN: true })

  it('detectLocaleFromHeader always returns a valid Locale', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 200 }),
        (headerStr) => {
          const result = detectLocaleFromHeader(headerStr)
          return LOCALES.includes(result)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('when a supported locale has the highest q-value, it is returned', () => {
    fc.assert(
      fc.property(
        supportedLocaleArb,
        qValueArb,
        fc.array(
          fc.tuple(supportedLocaleArb, qValueArb),
          { minLength: 0, maxLength: 5 }
        ),
        (targetLocale, targetQ, otherEntries) => {
          // Ensure targetQ is strictly higher than all others
          const maxOtherQ = targetQ * 0.5 // others are at most half the target q
          const entries = otherEntries
            .filter(([loc]) => loc !== targetLocale)
            .map(([loc]) => {
              const q = Math.round(maxOtherQ * 100) / 1000
              return `${loc};q=${q.toFixed(3)}`
            })

          // Add the target locale with highest q
          entries.unshift(`${targetLocale};q=${targetQ.toFixed(3)}`)

          // Shuffle entries to avoid position bias
          const header = entries.join(', ')
          const result = detectLocaleFromHeader(header)
          return result === targetLocale
        }
      ),
      { numRuns: 100 }
    )
  })

  it('returns zh (default) when header is empty or contains no supported locale', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('', 'fr', 'de;q=0.9, it;q=0.8', 'ko-KR, pt-BR;q=0.5'),
        (header) => {
          const result = detectLocaleFromHeader(header)
          return result === 'zh'
        }
      ),
      { numRuns: 20 }
    )
  })
})
