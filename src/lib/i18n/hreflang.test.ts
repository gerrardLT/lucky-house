import { describe, it, expect } from 'vitest'
import { generateHreflangLinks } from './hreflang'

describe('generateHreflangLinks', () => {
  describe('基本功能', () => {
    it('为根路径生成 4 条 hreflang 链接（zh/ja/en + x-default）', () => {
      const links = generateHreflangLinks('/')
      expect(links).toHaveLength(4)
    })

    it('包含所有 3 种语言的 alternate link', () => {
      const links = generateHreflangLinks('/stay')
      const locales = links.map((l) => l.locale)

      expect(locales).toContain('zh-CN')
      expect(locales).toContain('ja')
      expect(locales).toContain('en')
      expect(locales).toContain('x-default')
    })

    it('x-default 指向 zh 版本', () => {
      const links = generateHreflangLinks('/stay')
      const xDefault = links.find((l) => l.locale === 'x-default')

      expect(xDefault?.href).toBe('https://luckyhouse-group.com/zh/stay')
    })
  })

  describe('路径处理', () => {
    it('根路径 / 生成正确的 URL（末尾斜杠）', () => {
      const links = generateHreflangLinks('/')

      expect(links.find((l) => l.locale === 'zh-CN')?.href).toBe('https://luckyhouse-group.com/zh/')
      expect(links.find((l) => l.locale === 'ja')?.href).toBe('https://luckyhouse-group.com/ja/')
      expect(links.find((l) => l.locale === 'en')?.href).toBe('https://luckyhouse-group.com/en/')
    })

    it('一级路径生成正确的 URL', () => {
      const links = generateHreflangLinks('/stay')

      expect(links.find((l) => l.locale === 'zh-CN')?.href).toBe('https://luckyhouse-group.com/zh/stay')
      expect(links.find((l) => l.locale === 'ja')?.href).toBe('https://luckyhouse-group.com/ja/stay')
      expect(links.find((l) => l.locale === 'en')?.href).toBe('https://luckyhouse-group.com/en/stay')
    })

    it('多级路径生成正确的 URL', () => {
      const links = generateHreflangLinks('/stay/deluxe-room')

      expect(links.find((l) => l.locale === 'zh-CN')?.href).toBe(
        'https://luckyhouse-group.com/zh/stay/deluxe-room'
      )
      expect(links.find((l) => l.locale === 'ja')?.href).toBe(
        'https://luckyhouse-group.com/ja/stay/deluxe-room'
      )
    })

    it('自动移除已有的 locale 前缀', () => {
      const links = generateHreflangLinks('/zh/stay')

      expect(links.find((l) => l.locale === 'zh-CN')?.href).toBe('https://luckyhouse-group.com/zh/stay')
      expect(links.find((l) => l.locale === 'ja')?.href).toBe('https://luckyhouse-group.com/ja/stay')
    })

    it('不带前导斜杠的路径也能正确处理', () => {
      const links = generateHreflangLinks('stay')

      expect(links.find((l) => l.locale === 'zh-CN')?.href).toBe('https://luckyhouse-group.com/zh/stay')
    })

    it('移除末尾多余斜杠（根路径除外）', () => {
      const links = generateHreflangLinks('/stay/')

      expect(links.find((l) => l.locale === 'zh-CN')?.href).toBe('https://luckyhouse-group.com/zh/stay')
    })
  })

  describe('URL 格式验证', () => {
    it('所有 href 以 https://luckyhouse-group.com 开头', () => {
      const links = generateHreflangLinks('/pet-friendly')

      for (const link of links) {
        expect(link.href).toMatch(/^https:\/\/luckyhouse\.jp\//)
      }
    })

    it('所有 href 包含 locale 段', () => {
      const links = generateHreflangLinks('/faq')
      const nonDefault = links.filter((l) => l.locale !== 'x-default')

      for (const link of nonDefault) {
        expect(link.href).toMatch(/\/(zh|ja|en)\//)
      }
    })
  })
})
