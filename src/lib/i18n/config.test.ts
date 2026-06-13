import { describe, it, expect } from 'vitest'
import { LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE_NAME, BCP47_MAP, isValidLocale } from './config'

describe('i18n config', () => {
  it('支持 zh, ja, en 三种语言', () => {
    expect(LOCALES).toEqual(['zh', 'ja', 'en'])
  })

  it('默认语言为 zh', () => {
    expect(DEFAULT_LOCALE).toBe('zh')
  })

  it('cookie 名称为 NEXT_LOCALE', () => {
    expect(LOCALE_COOKIE_NAME).toBe('NEXT_LOCALE')
  })

  it('BCP47 映射正确', () => {
    expect(BCP47_MAP.zh).toBe('zh-CN')
    expect(BCP47_MAP.ja).toBe('ja')
    expect(BCP47_MAP.en).toBe('en')
  })
})

describe('isValidLocale', () => {
  it('zh 为有效 locale', () => {
    expect(isValidLocale('zh')).toBe(true)
  })

  it('ja 为有效 locale', () => {
    expect(isValidLocale('ja')).toBe(true)
  })

  it('en 为有效 locale', () => {
    expect(isValidLocale('en')).toBe(true)
  })

  it('fr 不是有效 locale', () => {
    expect(isValidLocale('fr')).toBe(false)
  })

  it('空字符串不是有效 locale', () => {
    expect(isValidLocale('')).toBe(false)
  })

  it('大写 ZH 不是有效 locale', () => {
    expect(isValidLocale('ZH')).toBe(false)
  })
})
