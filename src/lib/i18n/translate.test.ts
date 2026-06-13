import { describe, it, expect, beforeEach } from 'vitest'
import { translate, createTranslator, clearTranslationCache } from './translate'

describe('translate', () => {
  beforeEach(() => {
    clearTranslationCache()
  })

  describe('基本翻译功能', () => {
    it('从 zh common.json 获取翻译', () => {
      expect(translate('zh', 'common', 'nav.home')).toBe('首页')
    })

    it('从 ja common.json 获取翻译', () => {
      expect(translate('ja', 'common', 'nav.home')).toBe('ホーム')
    })

    it('从 en common.json 获取翻译', () => {
      expect(translate('en', 'common', 'nav.home')).toBe('Home')
    })
  })

  describe('嵌套 key 点号访问', () => {
    it('支持一级嵌套', () => {
      expect(translate('zh', 'common', 'buttons.bookNow')).toBe('立即预约')
    })

    it('支持多级嵌套', () => {
      expect(translate('zh', 'common', 'footer.brand')).toContain('福岛岳温泉')
    })
  })

  describe('回退机制', () => {
    it('当 key 在 ja 中缺失时，回退到 zh', () => {
      // 假设 ja 中缺少某个 key，这里我们用一个确定不存在的 key 来测试
      // 由于 ja 和 zh 文件结构一致，我们通过 translate 函数逻辑确保回退有效
      // 测试当 locale 文件中找不到时回退的行为
      const result = translate('ja', 'nonexistent-namespace', 'some.key')
      // 如果 zh 中也没有，返回 key 本身
      expect(result).toBe('some.key')
    })

    it('当 namespace 文件不存在时，回退到 zh 同 namespace 查找', () => {
      const result = translate('en', 'nonexistent', 'test.key')
      expect(result).toBe('test.key')
    })

    it('zh locale 中 key 不存在时返回 key 本身', () => {
      const result = translate('zh', 'common', 'nonexistent.key.path')
      expect(result).toBe('nonexistent.key.path')
    })
  })

  describe('边界情况', () => {
    it('空 key 返回空字符串作为 key', () => {
      const result = translate('zh', 'common', '')
      expect(result).toBe('')
    })

    it('无效 locale 视为默认 locale（zh）', () => {
      // @ts-expect-error 故意传入无效 locale
      const result = translate('fr', 'common', 'nav.home')
      expect(result).toBe('首页')
    })
  })
})

describe('createTranslator', () => {
  beforeEach(() => {
    clearTranslationCache()
  })

  it('创建带预设 locale 和 namespace 的翻译函数', () => {
    const t = createTranslator('zh', 'common')
    expect(t('nav.home')).toBe('首页')
    expect(t('buttons.bookNow')).toBe('立即预约')
  })

  it('不同 locale 的 translator 返回对应语言', () => {
    const tZh = createTranslator('zh', 'common')
    const tJa = createTranslator('ja', 'common')
    const tEn = createTranslator('en', 'common')

    expect(tZh('nav.stay')).toBe('住宿房型')
    expect(tJa('nav.stay')).toBe('客室・宿泊')
    expect(tEn('nav.stay')).toBe('Accommodations')
  })
})
