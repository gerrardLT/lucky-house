import { describe, it, expect } from 'vitest'
import { parseAcceptLanguage, matchLocale, detectLocaleFromHeader } from './locale-detection'

describe('parseAcceptLanguage', () => {
  it('解析单个语言标签（无 q 值）', () => {
    const result = parseAcceptLanguage('ja')
    expect(result).toEqual([{ locale: 'ja', quality: 1.0 }])
  })

  it('解析带 q 值的多个语言标签', () => {
    const result = parseAcceptLanguage('ja;q=0.9, zh-CN;q=1.0, en;q=0.5')
    expect(result).toEqual([
      { locale: 'zh-cn', quality: 1.0 },
      { locale: 'ja', quality: 0.9 },
      { locale: 'en', quality: 0.5 },
    ])
  })

  it('解析标准浏览器格式', () => {
    const result = parseAcceptLanguage('en-US,en;q=0.9,ja;q=0.8')
    expect(result).toEqual([
      { locale: 'en-us', quality: 1.0 },
      { locale: 'en', quality: 0.9 },
      { locale: 'ja', quality: 0.8 },
    ])
  })

  it('空字符串返回空数组', () => {
    expect(parseAcceptLanguage('')).toEqual([])
  })

  it('纯空格返回空数组', () => {
    expect(parseAcceptLanguage('   ')).toEqual([])
  })

  it('忽略无效 q 值，使用默认 1.0', () => {
    const result = parseAcceptLanguage('ja;q=abc, zh;q=0.8')
    expect(result).toEqual([
      { locale: 'ja', quality: 1.0 },
      { locale: 'zh', quality: 0.8 },
    ])
  })
})

describe('matchLocale', () => {
  it('精确匹配支持的 locale', () => {
    const parsed = [{ locale: 'ja', quality: 1.0 }]
    expect(matchLocale(parsed)).toBe('ja')
  })

  it('前缀匹配（zh-CN → zh）', () => {
    const parsed = [{ locale: 'zh-cn', quality: 1.0 }]
    expect(matchLocale(parsed)).toBe('zh')
  })

  it('前缀匹配（en-US → en）', () => {
    const parsed = [{ locale: 'en-us', quality: 1.0 }]
    expect(matchLocale(parsed)).toBe('en')
  })

  it('按优先级匹配第一个支持的语言', () => {
    const parsed = [
      { locale: 'fr', quality: 1.0 },
      { locale: 'ja', quality: 0.9 },
      { locale: 'en', quality: 0.8 },
    ]
    expect(matchLocale(parsed)).toBe('ja')
  })

  it('无匹配时返回 null', () => {
    const parsed = [
      { locale: 'fr', quality: 1.0 },
      { locale: 'de', quality: 0.8 },
    ]
    expect(matchLocale(parsed)).toBeNull()
  })

  it('空列表返回 null', () => {
    expect(matchLocale([])).toBeNull()
  })
})

describe('detectLocaleFromHeader', () => {
  it('null 头返回默认 locale (zh)', () => {
    expect(detectLocaleFromHeader(null)).toBe('zh')
  })

  it('undefined 头返回默认 locale (zh)', () => {
    expect(detectLocaleFromHeader(undefined)).toBe('zh')
  })

  it('空字符串头返回默认 locale (zh)', () => {
    expect(detectLocaleFromHeader('')).toBe('zh')
  })

  it('匹配日文头', () => {
    expect(detectLocaleFromHeader('ja;q=1.0, en;q=0.5')).toBe('ja')
  })

  it('匹配英文头（带地区标签）', () => {
    expect(detectLocaleFromHeader('en-US,en;q=0.9')).toBe('en')
  })

  it('匹配中文头', () => {
    expect(detectLocaleFromHeader('zh-CN,zh;q=0.9,en;q=0.8')).toBe('zh')
  })

  it('不支持的语言头返回默认 locale', () => {
    expect(detectLocaleFromHeader('fr;q=1.0, de;q=0.9')).toBe('zh')
  })

  it('按 q 值优先级正确匹配', () => {
    // en q=1.0 (默认), ja q=0.9 → 应匹配 en
    expect(detectLocaleFromHeader('en, ja;q=0.9')).toBe('en')
  })

  it('q 值相同时取先出现的', () => {
    expect(detectLocaleFromHeader('ja;q=0.8, en;q=0.8')).toBe('ja')
  })
})
