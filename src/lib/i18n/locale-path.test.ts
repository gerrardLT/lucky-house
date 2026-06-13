import { describe, it, expect } from 'vitest'
import {
  extractLocaleFromPath,
  getPathWithoutLocale,
  replaceLocaleInPath,
  buildLocalePath,
} from './locale-path'

describe('extractLocaleFromPath', () => {
  it('提取 zh locale', () => {
    expect(extractLocaleFromPath('/zh/stay')).toBe('zh')
  })

  it('提取 ja locale', () => {
    expect(extractLocaleFromPath('/ja/pet-friendly')).toBe('ja')
  })

  it('提取 en locale', () => {
    expect(extractLocaleFromPath('/en/')).toBe('en')
  })

  it('根路径返回 null', () => {
    expect(extractLocaleFromPath('/')).toBeNull()
  })

  it('非 locale 前缀返回 null', () => {
    expect(extractLocaleFromPath('/stay')).toBeNull()
  })

  it('不支持的 locale 返回 null', () => {
    expect(extractLocaleFromPath('/fr/stay')).toBeNull()
  })

  it('大小写不敏感', () => {
    expect(extractLocaleFromPath('/ZH/stay')).toBe('zh')
  })
})

describe('getPathWithoutLocale', () => {
  it('去除 locale 后返回剩余路径', () => {
    expect(getPathWithoutLocale('/zh/stay')).toBe('/stay')
  })

  it('多层路径保持完整', () => {
    expect(getPathWithoutLocale('/ja/stay/room-slug')).toBe('/stay/room-slug')
  })

  it('仅 locale 路径返回 /', () => {
    expect(getPathWithoutLocale('/en/')).toBe('/')
  })

  it('无 locale 前缀原样返回', () => {
    expect(getPathWithoutLocale('/stay')).toBe('/stay')
  })

  it('根路径原样返回', () => {
    expect(getPathWithoutLocale('/')).toBe('/')
  })
})

describe('replaceLocaleInPath', () => {
  it('替换 zh → ja', () => {
    expect(replaceLocaleInPath('/zh/stay', 'ja')).toBe('/ja/stay')
  })

  it('替换 en → zh，保持多层路径', () => {
    expect(replaceLocaleInPath('/en/stay/room-slug', 'zh')).toBe('/zh/stay/room-slug')
  })

  it('保留查询参数', () => {
    expect(replaceLocaleInPath('/en/stay/room-slug?ref=home', 'zh')).toBe('/zh/stay/room-slug?ref=home')
  })

  it('保留多个查询参数', () => {
    expect(replaceLocaleInPath('/ja/booking?step=2&ref=room', 'en')).toBe('/en/booking?step=2&ref=room')
  })

  it('仅 locale 路径的替换', () => {
    expect(replaceLocaleInPath('/ja/', 'en')).toBe('/en/')
  })

  it('无 locale 前缀时添加目标 locale', () => {
    expect(replaceLocaleInPath('/stay', 'ja')).toBe('/ja/stay')
  })

  it('根路径添加 locale', () => {
    expect(replaceLocaleInPath('/', 'ja')).toBe('/ja/')
  })
})

describe('buildLocalePath', () => {
  it('构建普通路径', () => {
    expect(buildLocalePath('/stay', 'ja')).toBe('/ja/stay')
  })

  it('构建根路径', () => {
    expect(buildLocalePath('/', 'zh')).toBe('/zh/')
  })

  it('构建多层路径', () => {
    expect(buildLocalePath('/stay/room-slug', 'en')).toBe('/en/stay/room-slug')
  })

  it('路径不以 / 开头时自动添加', () => {
    expect(buildLocalePath('stay', 'ja')).toBe('/ja/stay')
  })
})
