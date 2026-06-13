import type { Locale } from '@/types'

/**
 * CJK 语言判断：中文/日文不使用 uppercase、宽 tracking、italic
 *
 * 规则：
 * - CJK 文本禁止 uppercase（对中文无效，反而可能导致排版异常）
 * - CJK tracking 应收紧（汉字本身有视觉间距，额外 tracking 显得松散）
 * - CJK 避免 italic（中文 italic 变形严重，影响可读性）
 */

const IS_CJK = (locale: Locale) => locale === 'zh' || locale === 'ja'

/* ===== 展示标题（Hero / Section heading） ===== */

/** 展示标题样式：大字号 serif 标题 */
export function displayHeading(locale: Locale): string {
  return IS_CJK(locale)
    ? 'tracking-tight'
    : 'uppercase tracking-[0.15em]'
}

/** 副标题/斜体文本：英文用 italic，CJK 用常规体 */
export function subtitle(locale: Locale): string {
  return IS_CJK(locale)
    ? 'font-normal not-italic tracking-normal'
    : 'italic tracking-wide'
}

/* ===== 标签/按钮文字 ===== */

/** 标签类小字（了解更多、查看详情等） */
export function label(locale: Locale): string {
  return IS_CJK(locale)
    ? 'tracking-normal'
    : 'uppercase tracking-wider'
}

/* ===== Section 标题 ===== */

/** Section 标题 */
export function sectionTitle(locale: Locale): string {
  return IS_CJK(locale)
    ? 'tracking-tight'
    : 'tracking-wide'
}

/* ===== 水印/装饰大字 ===== */

/** 装饰性水印文字（Coming Soon overlay 等） */
export function watermark(locale: Locale): string {
  return IS_CJK(locale)
    ? 'tracking-[0.1em]'
    : 'tracking-[0.3em] uppercase'
}
